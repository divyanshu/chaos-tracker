import type { TaskStatus } from '@/core/domain'

export type StatusAction = 'start' | 'pause' | 'resume' | 'complete'

export const STATUS_DISPLAY: Record<TaskStatus, { label: string; className: string }> = {
  pending: {
    label: 'Not Started',
    className: 'bg-stone-200/70 text-stone-600 dark:bg-stone-700/50 dark:text-stone-300',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-slate-200/70 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300',
  },
  paused: {
    label: 'Paused',
    className: 'bg-orange-100/70 text-orange-700/80 dark:bg-orange-900/30 dark:text-orange-300/80',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-100/60 text-green-700/80 dark:bg-green-900/30 dark:text-green-300/70',
  },
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

const STATUS_CYCLE: TaskStatus[] = ['pending', 'in_progress', 'paused', 'completed']

export function toggleStatus(current: TaskStatus): TaskStatus {
  const idx = STATUS_CYCLE.indexOf(current)
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
}

export const ACTION_LABELS: Record<StatusAction, string> = {
  start: 'Start',
  pause: 'Pause',
  resume: 'Resume',
  complete: 'Complete',
}
