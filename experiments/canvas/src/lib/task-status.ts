import type { TaskStatus } from '#core/domain/task'

export type StatusAction = 'start' | 'pause' | 'resume' | 'complete'

export const STATUS_DISPLAY: Record<TaskStatus, { label: string; dot: string }> = {
  pending: { label: 'Pending', dot: 'bg-stone-400 dark:bg-stone-500' },
  in_progress: { label: 'In Progress', dot: 'bg-green-500' },
  paused: { label: 'Paused', dot: 'bg-amber-500' },
  completed: { label: 'Completed', dot: 'bg-stone-500 dark:bg-stone-600' },
}

export function availableActions(status: TaskStatus): StatusAction[] {
  switch (status) {
    case 'pending':
      return ['start', 'complete']
    case 'in_progress':
      return ['pause', 'complete']
    case 'paused':
      return ['resume', 'complete']
    case 'completed':
      return []
  }
}

export function nextStatus(action: StatusAction): TaskStatus {
  switch (action) {
    case 'start':
    case 'resume':
      return 'in_progress'
    case 'pause':
      return 'paused'
    case 'complete':
      return 'completed'
  }
}

export const ACTION_LABELS: Record<StatusAction, string> = {
  start: 'Start',
  pause: 'Pause',
  resume: 'Resume',
  complete: 'Complete',
}
