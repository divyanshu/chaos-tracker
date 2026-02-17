import { useContext, useCallback, useMemo } from 'react'
import { useInput } from 'ink'
import { AppStateContext } from '../app.js'
import { useTasks } from './use-tasks.js'

export function useSelectedTask(flatTaskIds: string[]) {
  const { state } = useContext(AppStateContext)

  const selectedTaskId = useMemo(() => {
    if (flatTaskIds.length === 0) return null
    const idx = Math.min(state.selectedIndex, flatTaskIds.length - 1)
    return flatTaskIds[idx] ?? null
  }, [flatTaskIds, state.selectedIndex])

  return selectedTaskId
}

export function useKeyboardNav(flatTaskIds: string[]) {
  const { state, setState } = useContext(AppStateContext)

  const selectedTaskId = useSelectedTask(flatTaskIds)
  const { setStatus, touchTask, deleteTask } = useTasks()

  const moveSelection = useCallback(
    (delta: number) => {
      setState((s) => {
        const maxIdx = flatTaskIds.length - 1
        if (maxIdx < 0) return s
        let next = s.selectedIndex + delta
        if (next < 0) next = 0
        if (next > maxIdx) next = maxIdx
        return { ...s, selectedIndex: next }
      })
    },
    [flatTaskIds.length, setState]
  )

  useInput((input, key) => {
    // Navigation
    if (input === 'j' || key.downArrow) {
      moveSelection(1)
      return
    }
    if (input === 'k' || key.upArrow) {
      moveSelection(-1)
      return
    }

    if (!selectedTaskId) return

    // Status actions
    if (input === 's') {
      setStatus(selectedTaskId, 'in_progress')
      return
    }
    if (input === 'p') {
      setStatus(selectedTaskId, 'paused')
      return
    }
    if (input === 'c') {
      setStatus(selectedTaskId, 'completed')
      return
    }
    if (input === 't') {
      touchTask(selectedTaskId)
      return
    }

    // View changes
    if (input === 'n') {
      setState((s) => ({ ...s, view: 'create' }))
      return
    }
    if (key.return) {
      setState((s) => ({ ...s, view: 'detail', selectedTaskId }))
      return
    }
    if (input === 'd') {
      deleteTask(selectedTaskId)
      return
    }
    if (input === '?') {
      setState((s) => ({ ...s, view: 'help' }))
      return
    }
    if (input === '/') {
      setState((s) => ({ ...s, typeaheadOpen: true }))
      return
    }
    if (input === ':') {
      setState((s) => ({ ...s, view: 'command' }))
      return
    }
    if (input === 'f') {
      setState((s) => ({ ...s, view: 'filter' }))
      return
    }
    if (input === 'q') {
      process.exit(0)
    }
  }, { isActive: state.view === 'dashboard' && !state.typeaheadOpen })
}
