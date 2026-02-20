import { useContext, useCallback, useMemo } from 'react'
import type { Task, TaskStatus } from '#core/domain/task.js'
import { DEFAULT_CATEGORIES, COMPLETED_CATEGORY_NAME, TOP_OF_MIND_CATEGORY_NAME } from '#core/domain/category.js'
import { RepoContext, AppStateContext } from '../app.js'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

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

  const hasFilters = state.filterCategories.length > 0 || state.filterStatuses.length > 0

  const filteredTasks = hasFilters
    ? state.tasks.filter((t) => {
        const catMatch = state.filterCategories.length === 0 || state.filterCategories.includes(t.category)
        const statusMatch = state.filterStatuses.length === 0 || state.filterStatuses.includes(t.status)
        return catMatch && statusMatch
      })
    : state.tasks

  // Top of Mind: tasks touched within 7 days, not completed, sorted by last_touched desc
  // Uses full task list (ignores filters)
  const topOfMindTasks = useMemo(() => {
    const now = Date.now()
    return state.tasks
      .filter((t) => {
        const touchedMs = new Date(t.last_touched).getTime()
        return (now - touchedMs) < SEVEN_DAYS_MS && t.status !== 'completed'
      })
      .sort((a, b) => new Date(b.last_touched).getTime() - new Date(a.last_touched).getTime())
  }, [state.tasks])

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

  const topOfMindGroup = useMemo(() => ({
    category: TOP_OF_MIND_CATEGORY_NAME,
    tasks: topOfMindTasks,
  }), [topOfMindTasks])

  // Flat list for keyboard navigation: regular categories + completed (if expanded)
  // Top of Mind is view-only — not included
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
    tasksByCategory: regularCategories,
    topOfMindGroup,
    regularCategories,
    completedGroup,
    flatTaskIds,
    refresh,
    setStatus,
    touchTask,
    deleteTask,
    createTask,
  }
}
