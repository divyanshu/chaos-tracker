import type { Task, TaskStatus } from '@/core/domain'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { neglectLevel, relativeTime } from '@/lib/neglect'
import { STATUS_DISPLAY, availableActions, nextStatus, toggleStatus, ACTION_LABELS } from '@/lib/task-status'
import { Play, Pause, CheckCircle2, Hand, AlertTriangle, AlertCircle } from 'lucide-react'
import type { KeyboardEvent } from 'react'

interface TaskCardProps {
  task: Task
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onTouch: (taskId: string) => void
  onSelect: (taskId: string) => void
}

const ACTION_ICONS: Record<string, typeof Play> = {
  start: Play,
  resume: Play,
  pause: Pause,
  complete: CheckCircle2,
}

export function TaskCard({ task, onStatusChange, onTouch, onSelect }: TaskCardProps) {
  const neglect = neglectLevel(task.last_touched)
  const display = STATUS_DISPLAY[task.status]
  const actions = availableActions(task.status)

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === ' ') {
      e.preventDefault()
      onStatusChange(task.id, toggleStatus(task.status))
    } else if (e.key === 't') {
      e.preventDefault()
      onTouch(task.id)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      onSelect(task.id)
    }
  }

  return (
    <div
      tabIndex={0}
      data-task-id={task.id}
      role="button"
      onClick={() => onSelect(task.id)}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative rounded-lg border bg-card p-3 cursor-pointer transition-colors',
        'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        neglect === 'warning' && 'border-l-2 border-l-amber-400',
        neglect === 'critical' && 'border-l-2 border-l-red-500',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-sm leading-snug">{task.title}</span>
        <Badge className={cn('shrink-0 text-[10px] border-0', display.className)}>
          {display.label}
        </Badge>
      </div>

      {neglect !== 'none' && (
        <div className={cn(
          'flex items-center gap-1 mt-1.5 text-xs',
          neglect === 'warning' && 'text-amber-500',
          neglect === 'critical' && 'text-red-500',
        )}>
          {neglect === 'warning' ? (
            <AlertTriangle className="h-3 w-3" />
          ) : (
            <AlertCircle className="h-3 w-3" />
          )}
          <span>{relativeTime(task.last_touched)}</span>
        </div>
      )}

      {/* Hover quick-action buttons */}
      <div
        className="absolute right-1 bottom-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        {actions.map((action) => {
          const Icon = ACTION_ICONS[action]
          return (
            <Tooltip key={action}>
              <TooltipTrigger asChild>
                <button
                  className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  onClick={() => onStatusChange(task.id, nextStatus(action))}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{ACTION_LABELS[action]}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => onTouch(task.id)}
            >
              <Hand className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Touch</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
