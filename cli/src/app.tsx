import React, { useState, useCallback } from 'react'
import { Box, Text } from 'ink'
import type { TaskRepository } from '#core/repositories/task-repository.js'
import type { Task } from '#core/domain/task.js'
import { COMPLETED_CATEGORY_NAME } from '#core/domain/category.js'
import { LoadingAnimation } from './components/LoadingAnimation.js'
import { DashboardView } from './views/DashboardView.js'
import { TaskDetailView } from './views/TaskDetailView.js'
import { CreateTaskView } from './views/CreateTaskView.js'
import { HelpView } from './views/HelpView.js'
import { CommandPaletteView } from './views/CommandPaletteView.js'
import { FilterView } from './views/FilterView.js'

export type View = 'dashboard' | 'detail' | 'create' | 'edit' | 'filter' | 'help' | 'command'

export type AppState = {
  tasks: Task[]
  view: View
  selectedIndex: number
  selectedTaskId: string | null
  filterCategories: string[]
  filterStatuses: string[]
  typeaheadOpen: boolean
  completedCollapsed: boolean
}

export const RepoContext = React.createContext<TaskRepository>(null as unknown as TaskRepository)
export const AppStateContext = React.createContext<{
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
}>({
  state: {
    tasks: [], view: 'dashboard', selectedIndex: 0,
    selectedTaskId: null, filterCategories: [], filterStatuses: [],
    typeaheadOpen: false, completedCollapsed: true,
  },
  setState: () => {},
})

export function App({ repo }: { repo: TaskRepository }) {
  const [ready, setReady] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [state, setState] = useState<AppState>({
    tasks: [],
    view: 'dashboard',
    selectedIndex: 0,
    selectedTaskId: null,
    filterCategories: [],
    filterStatuses: [],
    typeaheadOpen: false,
    completedCollapsed: true,
  })

  const loadTasks = useCallback(async () => {
    try {
      const tasks = await repo.getAll()
      // Migrate completed tasks to Completed category on launch
      const migrations = tasks.filter(
        (t) => t.status === 'completed' && t.category !== COMPLETED_CATEGORY_NAME
      )
      for (const t of migrations) {
        await repo.update(t.id, { category: COMPLETED_CATEGORY_NAME })
      }
      if (migrations.length > 0) {
        const migrated = await repo.getAll()
        setState((s) => ({ ...s, tasks: migrated }))
      } else {
        setState((s) => ({ ...s, tasks }))
      }
      setReady(true)
    } catch (err: unknown) {
      const message = err instanceof Error
        ? err.message
        : typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Unknown error connecting to Supabase'
      setLoadError(message)
      setReady(true)
    }
  }, [repo])

  React.useEffect(() => {
    loadTasks()
  }, [loadTasks])

  if (!ready) {
    return <LoadingAnimation />
  }

  if (loadError) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red" bold>Failed to load tasks</Text>
        <Text color="gray">{loadError}</Text>
        <Text dimColor>{'\n'}Try: chaos --mock  (offline mode)  or  chaos config  (fix credentials)</Text>
      </Box>
    )
  }

  return (
    <RepoContext.Provider value={repo}>
      <AppStateContext.Provider value={{ state, setState }}>
        {state.view === 'dashboard' && <DashboardView />}
        {state.view === 'detail' && <TaskDetailView />}
        {state.view === 'create' && <CreateTaskView />}
        {state.view === 'help' && <HelpView />}
        {state.view === 'command' && <CommandPaletteView />}
        {state.view === 'filter' && <FilterView />}
      </AppStateContext.Provider>
    </RepoContext.Provider>
  )
}
