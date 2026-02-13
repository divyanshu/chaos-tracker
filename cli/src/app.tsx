import React, { useState, useCallback } from 'react'
import { Box, Text } from 'ink'
import type { TaskRepository } from '../../src/core/repositories/task-repository.js'
import type { Task } from '../../src/core/domain/task.js'
import { colors } from './theme/colors.js'
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
}

export const RepoContext = React.createContext<TaskRepository>(null as unknown as TaskRepository)
export const AppStateContext = React.createContext<{
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
}>({
  state: {
    tasks: [], view: 'dashboard', selectedIndex: 0,
    selectedTaskId: null, filterCategories: [], filterStatuses: [],
  },
  setState: () => {},
})

export function App({ repo }: { repo: TaskRepository }) {
  const [ready, setReady] = useState(false)
  const [state, setState] = useState<AppState>({
    tasks: [],
    view: 'dashboard',
    selectedIndex: 0,
    selectedTaskId: null,
    filterCategories: [],
    filterStatuses: [],
  })

  const loadTasks = useCallback(async () => {
    const tasks = await repo.getAll()
    setState((s) => ({ ...s, tasks }))
    setReady(true)
  }, [repo])

  React.useEffect(() => {
    loadTasks()
  }, [loadTasks])

  if (!ready) {
    return (
      <Box>
        <Text>{colors.accent('Loading...')}</Text>
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
