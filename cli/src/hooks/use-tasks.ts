import { useContext, useCallback } from 'react'
import type { TaskStatus } from '#core/domain/task.js'
import { DEFAULT_CATEGORIES } from '#core/domain/category.js'
import { RepoContext, AppStateContext } from '../app.js'

export function useTasks() {
  const repo = useContext(RepoContext)
  const { state, setState } = useContext(AppStateContext)

  const refresh = useCallback(async () => {
    const tasks = await repo.getAll()
    setState((s) => ({ ...s, tasks }))
  }, [repo, setState])

  const hasFilters = state.filterCategories.length > 0 || state.filterStatuses.length > 0

  const filteredTasks = hasFilters
    ? state.tasks.filter((t) => {
        const catMatch = state.filterCategories.length === 0 || state.filterCategories.includes(t.category)
        const statusMatch = state.filterStatuses.length === 0 || state.filterStatuses.includes(t.status)
        return catMatch && statusMatch
      })
    : state.tasks

  const tasksByCategory = DEFAULT_CATEGORIES.map((cat) => ({
    category: cat.name,
    tasks: filteredTasks.filter((t) => t.category === cat.name),
  }))

  // Flat list of task IDs in display order (for navigation)
  const flatTaskIds = tasksByCategory.flatMap((g) => g.tasks.map((t) => t.id))

  const setStatus = useCallback(
    async (id: string, status: TaskStatus) => {
      await repo.update(id, { status })
      await refresh()
    },
    [repo, refresh]
  )

  const touchTask = useCallback(
    async (id: string) => {
      await repo.touch(id)
      await refresh()
    },
    [repo, refresh]
  )

  const deleteTask = useCallback(
    async (id: string) => {
      await repo.delete(id)
      await refresh()
    },
    [repo, refresh]
  )

  const createTask = useCallback(
    async (title: string, category: string, description?: string) => {
      await repo.create({
        title,
        category,
        description: description ?? null,
        status: 'pending',
      })
      await refresh()
    },
    [repo, refresh]
  )

  return {
    tasks: state.tasks,
    tasksByCategory,
    flatTaskIds,
    refresh,
    setStatus,
    touchTask,
    deleteTask,
    createTask,
  }
}
