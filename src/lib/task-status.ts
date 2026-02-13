import type { TaskStatus } from '@/core/domain'

export type StatusAction = 'start' | 'pause' | 'resume' | 'complete'

export const STATUS_DISPLAY: Record<TaskStatus, { label: string; className: string }> = {
  pending: {
    label: 'Not Started',
    className: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  paused: {
    label: 'Paused',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
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
