import { useEffect, useMemo, useState, useRef } from 'react'
import { useUIStore } from '@/stores/ui-store'
import { useTasks, useUpdateTask, useTouchTask, useDeleteTask } from '@/hooks/use-tasks'
import { searchTasks } from '#core/services/fuzzy-search'
import { cn } from '@/lib/utils'
import { availableActions, nextStatus, ACTION_LABELS } from '@/lib/task-status'

type PaletteItem = {
  id: string
  label: string
  description?: string
  shortcut?: string
  action: () => void
  destructive?: boolean
}

export function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    selectedNodeId,
    selectNode,
    toggleTheme,
    toggleLayoutMode,
    setQuickEntryOpen,
    setHelpOpen,
  } = useUIStore()

  const { data: tasks } = useTasks()
  const updateTask = useUpdateTask()
  const touchTask = useTouchTask()
  const deleteTask = useDeleteTask()

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedTask = useMemo(() => {
    if (!selectedNodeId || !tasks) return null
    return tasks.find((t) => t.id === selectedNodeId) ?? null
  }, [selectedNodeId, tasks])

  const items = useMemo<PaletteItem[]>(() => {
    const result: PaletteItem[] = []

    // Task actions for selected node
    if (selectedTask) {
      const actions = availableActions(selectedTask.status)
      for (const action of actions) {
        result.push({
          id: `action-${action}`,
          label: `${ACTION_LABELS[action]} task`,
          description: selectedTask.title,
          shortcut: action[0],
          action: () => {
            updateTask.mutate({
              id: selectedTask.id,
              changes: { status: nextStatus(action) },
            })
            setCommandPaletteOpen(false)
          },
        })
      }
      result.push({
        id: 'action-touch',
        label: 'Touch task',
        description: selectedTask.title,
        shortcut: 't',
        action: () => {
          touchTask.mutate(selectedTask.id)
          setCommandPaletteOpen(false)
        },
      })
      result.push({
        id: 'action-delete',
        label: 'Delete task',
        description: selectedTask.title,
        shortcut: 'd',
        destructive: true,
        action: () => {
          if (confirm('Delete this task?')) {
            deleteTask.mutate(selectedTask.id)
            selectNode(null)
          }
          setCommandPaletteOpen(false)
        },
      })
    }

    // Global actions
    result.push(
      {
        id: 'new-task',
        label: 'New task',
        shortcut: 'n',
        action: () => {
          setCommandPaletteOpen(false)
          setQuickEntryOpen(true)
        },
      },
      {
        id: 'toggle-theme',
        label: 'Toggle theme',
        action: () => {
          toggleTheme()
          setCommandPaletteOpen(false)
        },
      },
      {
        id: 'toggle-layout',
        label: 'Toggle layout mode',
        shortcut: 'l',
        action: () => {
          toggleLayoutMode()
          setCommandPaletteOpen(false)
        },
      },
      {
        id: 'help',
        label: 'Show keyboard shortcuts',
        shortcut: '?',
        action: () => {
          setCommandPaletteOpen(false)
          setHelpOpen(true)
        },
      },
    )

    // Task search
    if (query && tasks) {
      const searchResults = searchTasks(tasks, query, 5)
      for (const r of searchResults) {
        if (!result.some((item) => item.id === `goto-${r.task.id}`)) {
          result.push({
            id: `goto-${r.task.id}`,
            label: r.task.title,
            description: `Go to task · ${r.task.category}`,
            action: () => {
              selectNode(r.task.id)
              setCommandPaletteOpen(false)
            },
          })
        }
      }
    }

    // Filter by query
    if (query) {
      const q = query.toLowerCase()
      return result.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q),
      )
    }

    return result
  }, [
    selectedTask,
    query,
    tasks,
    updateTask,
    touchTask,
    deleteTask,
    selectNode,
    setCommandPaletteOpen,
    setQuickEntryOpen,
    toggleTheme,
    toggleLayoutMode,
    setHelpOpen,
  ])

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!commandPaletteOpen) return null

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setCommandPaletteOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, items.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
      return
    }
    if (e.key === 'Enter' && items[selectedIndex]) {
      e.preventDefault()
      items[selectedIndex].action()
      return
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={() => setCommandPaletteOpen(false)}
      />
      <div className="relative w-full max-w-md rounded-lg border bg-card shadow-2xl">
        <div className="flex items-center border-b px-3">
          <span className="text-muted-foreground mr-2 text-sm">:</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-72 overflow-y-auto p-1">
          {items.map((item, i) => (
            <button
              key={item.id}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                i === selectedIndex ? 'bg-accent' : 'hover:bg-accent/50',
                item.destructive && 'text-destructive',
              )}
              onClick={item.action}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <span className="flex-1 truncate text-left">{item.label}</span>
              {item.description && (
                <span className="truncate text-[10px] text-muted-foreground">
                  {item.description}
                </span>
              )}
              {item.shortcut && (
                <kbd className="ml-1 rounded border bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {item.shortcut}
                </kbd>
              )}
            </button>
          ))}
          {items.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No commands found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
