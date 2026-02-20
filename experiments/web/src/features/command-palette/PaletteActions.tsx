import { useEffect, useState, useCallback } from 'react'
import type { Task } from '@/core/domain'
import { DEFAULT_CATEGORIES } from '@/core/domain'
import { resolveActions, type PaletteAction, type PaletteActionKind } from '@/core/services/palette-actions'
import { CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RotateCcw, CheckCircle2, Hand, Pencil, Trash2, ExternalLink } from 'lucide-react'

interface PaletteActionsProps {
  task: Task
  onExecute: (kind: PaletteActionKind) => void
  onBack: () => void
}

const ACTION_ICONS: Record<PaletteActionKind, typeof Play> = {
  start: Play,
  pause: Pause,
  resume: RotateCcw,
  complete: CheckCircle2,
  touch: Hand,
  edit: Pencil,
  delete: Trash2,
  open: ExternalLink,
}

export function PaletteActions({ task, onExecute, onBack }: PaletteActionsProps) {
  const actions = resolveActions(task)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const cat = DEFAULT_CATEGORIES.find((c) => c.name === task.category)
  const catColor = cat?.color ?? '#888'

  const handleAction = useCallback(
    (action: PaletteAction) => {
      if (action.kind === 'delete' && !confirmingDelete) {
        setConfirmingDelete(true)
        return
      }
      onExecute(action.kind)
    },
    [confirmingDelete, onExecute],
  )

  // Shortcut key listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (confirmingDelete) {
        if (e.key === 'Enter') {
          e.preventDefault()
          onExecute('delete')
        } else if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
          setConfirmingDelete(false)
        }
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        onBack()
        return
      }

      const action = actions.find((a) => a.shortcut === e.key)
      if (action) {
        e.preventDefault()
        handleAction(action)
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [actions, confirmingDelete, handleAction, onBack, onExecute])

  return (
    <>
      <div className="flex items-center gap-2 border-b px-3 py-2.5">
        <span className="text-sm font-medium truncate flex-1">{task.title}</span>
        <Badge
          className="text-[10px] border-0"
          style={{ backgroundColor: `${catColor}25`, color: catColor }}
        >
          {task.category}
        </Badge>
      </div>
      <CommandList>
        <CommandGroup>
          {actions.map((action) => {
            const Icon = ACTION_ICONS[action.kind]
            const isDeleteConfirm = action.kind === 'delete' && confirmingDelete

            return (
              <CommandItem
                key={action.kind}
                value={action.kind}
                onSelect={() => handleAction(action)}
                className={action.destructive ? 'text-red-500 dark:text-red-400' : ''}
              >
                <Icon className="h-4 w-4 mr-2 shrink-0" />
                <span className="flex-1">
                  {isDeleteConfirm ? 'Confirm delete? Enter / Esc' : action.label}
                </span>
                {!isDeleteConfirm && (
                  <kbd className="ml-auto text-[10px] tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {action.shortcut}
                  </kbd>
                )}
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </>
  )
}
