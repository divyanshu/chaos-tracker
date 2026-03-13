import { useContext, useCallback, useMemo } from 'react'
import type { Task, TaskStatus } from '#core/domain/task.js'
import { DEFAULT_CATEGORIES, COMPLETED_CATEGORY_NAME, DEFAULT_CATEGORY_NAME } from '#core/domain/category.js'
import { RepoContext, AppStateContext } from '../app.js'

function sortCompletedToBottom(tasks: Task[]): Task[] {
  const active = tasks.filter((t) => t.status !== 'completed')
  const completed = tasks.filter((t) => t.status === 'completed')
  return [...active, ...completed]
}

export function useTasks() {
  const repo = useContext(RepoContext)
  const { state, setState } = useContext(AppStateContext)

  const refresh = useCallback(async () => {
    const tasks = await repo.getAll()
    setState((s) => ({ ...s, tasks }))
  }, [repo, setState])

  const hasFilters =
    state.filterCategories.length > 0 ||
    state.filterStatuses.length > 0 ||
    state.filterTags.length > 0

  const filteredTasks = hasFilters
    ? state.tasks.filter((t) => {
        const catMatch = state.filterCategories.length === 0 || state.filterCategories.includes(t.category)
        const statusMatch = state.filterStatuses.length === 0 || state.filterStatuses.includes(t.status)
        const tagMatch = state.filterTags.length === 0 || state.filterTags.some((tag) => t.tags.includes(tag))
        return catMatch && statusMatch && tagMatch
      })
    : state.tasks

  // Regular categories: sort completed to bottom within each
  const regularCategories = useMemo(() =>
    DEFAULT_CATEGORIES.map((cat) => ({
      category: cat.name,
      tasks: sortCompletedToBottom(filteredTasks.filter((t) => t.category === cat.name)),
    })),
    [filteredTasks]
  )

  // Completed category group
  const completedTasks = useMemo(() =>
    filteredTasks.filter((t) => t.category === COMPLETED_CATEGORY_NAME),
    [filteredTasks]
  )

  const completedGroup = useMemo(() => ({
    category: COMPLETED_CATEGORY_NAME,
    tasks: completedTasks,
  }), [completedTasks])

  // Flat list for keyboard navigation: regular categories + completed (if expanded)
  const flatTaskIds = useMemo(() => {
    const ids = regularCategories.flatMap((g) => g.tasks.map((t) => t.id))
    if (!state.completedCollapsed) {
      ids.push(...completedTasks.map((t) => t.id))
    }
    return ids
  }, [regularCategories, completedTasks, state.completedCollapsed])

  const setStatus = useCallback(
    async (id: string, status: TaskStatus) => {
      await repo.update(id, { status })
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
    async (title: string, category: string, description?: string, tags?: string[]) => {
      await repo.create({
        title,
        category: category || DEFAULT_CATEGORY_NAME,
        tags: tags ?? [],
        description: description ?? null,
        status: 'pending',
      })
      await refresh()
    },
    [repo, refresh]
  )

  return {
    tasks: state.tasks,
    tasksByCategory: regularCategories,
    regularCategories,
    completedGroup,
    flatTaskIds,
    refresh,
    setStatus,
    deleteTask,
    createTask,
  }
}
