import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Command } from '@/components/ui/command'
import { DEFAULT_CATEGORIES } from '@/core/domain'
import type { PaletteActionKind } from '@/core/services/palette-actions'
import { nextStatus } from '@/lib/task-status'
import type { StatusAction } from '@/lib/task-status'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useTouchTask } from '@/hooks/use-tasks'
import { useUIStore } from '@/stores/ui-store'
import { useCommandPalette } from './use-command-palette'
import { PaletteSearch } from './PaletteSearch'
import { PaletteActions } from './PaletteActions'
import { PaletteCreate } from './PaletteCreate'

function isInputFocused(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}

export function CommandPalette() {
  const [state, dispatch] = useCommandPalette()
  const navigate = useNavigate()
  const { data: tasks = [] } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const touchTask = useTouchTask()
  const setPaletteOpen = useUIStore((s) => s.setPaletteOpen)
  const previousFocusRef = useRef<Element | null>(null)

  const isOpen = state.phase !== 'idle'

  // Sync palette open state to zustand store
  useEffect(() => {
    setPaletteOpen(isOpen)
    if (isOpen) {
      previousFocusRef.current = document.activeElement
    } else if (previousFocusRef.current instanceof HTMLElement) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [isOpen, setPaletteOpen])

  // Global keyboard listener for opening
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Cmd+K / Ctrl+K
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (isOpen) {
          dispatch({ type: 'close' })
        } else {
          dispatch({ type: 'open' })
        }
        return
      }

      // '/' when no input focused
      if (e.key === '/' && !isOpen && !isInputFocused(e.target)) {
        e.preventDefault()
        dispatch({ type: 'open' })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, dispatch])

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        dispatch({ type: 'close' })
      }
    },
    [dispatch],
  )

  // Handle action execution
  const handleExecuteAction = useCallback(
    (kind: PaletteActionKind) => {
      if (state.phase !== 'action') return
      const task = state.task

      switch (kind) {
        case 'start':
        case 'pause':
        case 'resume':
        case 'complete':
          updateTask.mutate({
            id: task.id,
            changes: { status: nextStatus(kind as StatusAction) },
          })
          dispatch({ type: 'close' })
          break

        case 'touch':
          touchTask.mutate(task.id)
          dispatch({ type: 'close' })
          break

        case 'edit':
          navigate(`/tasks/${task.id}`)
          dispatch({ type: 'close' })
          break

        case 'open':
          navigate(`/tasks/${task.id}`)
          dispatch({ type: 'close' })
          break

        case 'delete':
          deleteTask.mutate(task.id)
          dispatch({ type: 'close' })
          break
      }
    },
    [state, dispatch, updateTask, touchTask, deleteTask, navigate],
  )

  // Handle task creation
  const handleCreate = useCallback(() => {
    if (state.phase !== 'create') return
    const category = DEFAULT_CATEGORIES[state.categoryIndex]?.name ?? 'Work'
    createTask.mutate({
      title: state.title.trim(),
      category,
      status: 'pending',
      description: null,
    })
    dispatch({ type: 'close' })
  }, [state, dispatch, createTask])

  const handleEscapeKeyDown = useCallback(
    (e: Event) => {
      if (state.phase === 'action' || state.phase === 'create') {
        e.preventDefault()
        dispatch({ type: 'back' })
      }
    },
    [state.phase, dispatch],
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        className="overflow-hidden p-0 shadow-lg max-w-lg gap-0"
        hideCloseButton
        onEscapeKeyDown={handleEscapeKeyDown}
      >
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <Command shouldFilter={false} className="rounded-lg">
          {state.phase === 'search' && (
            <PaletteSearch
              tasks={tasks}
              query={state.query}
              onQueryChange={(query) => dispatch({ type: 'set_query', query })}
              onSelectTask={(task) => dispatch({ type: 'select_task', task })}
              onSelectCreate={(title) => dispatch({ type: 'select_create', title })}
            />
          )}
          {state.phase === 'action' && (
            <PaletteActions
              task={state.task}
              onExecute={handleExecuteAction}
              onBack={() => dispatch({ type: 'back' })}
            />
          )}
          {state.phase === 'create' && (
            <PaletteCreate
              title={state.title}
              categoryIndex={state.categoryIndex}
              onTitleChange={(title) => dispatch({ type: 'set_title', title })}
              onCategoryChange={(index) => dispatch({ type: 'set_category', index })}
              onConfirm={handleCreate}
              onBack={() => dispatch({ type: 'back' })}
            />
          )}
        </Command>
      </DialogContent>
    </Dialog>
  )
}
