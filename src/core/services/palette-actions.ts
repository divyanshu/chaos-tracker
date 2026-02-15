import type { Task } from '../domain'
import { availableActions, ACTION_LABELS } from '../../lib/task-status'
import type { StatusAction } from '../../lib/task-status'

export type PaletteActionKind = StatusAction | 'touch' | 'edit' | 'delete' | 'open'

export interface PaletteAction {
  kind: PaletteActionKind
  label: string
  shortcut: string
  destructive?: boolean
}

const ACTION_SHORTCUTS: Record<PaletteActionKind, string> = {
  start: 's',
  pause: 'p',
  resume: 'r',
  complete: 'c',
  touch: 't',
  edit: 'e',
  delete: 'd',
  open: 'o',
}

export function resolveActions(task: Task): PaletteAction[] {
  const statusActions = availableActions(task.status)
  const actions: PaletteAction[] = statusActions.map((action) => ({
    kind: action,
    label: ACTION_LABELS[action],
    shortcut: ACTION_SHORTCUTS[action],
  }))

  actions.push(
    { kind: 'touch', label: 'Touch', shortcut: 't' },
    { kind: 'edit', label: 'Edit', shortcut: 'e' },
    { kind: 'open', label: 'Open', shortcut: 'o' },
    { kind: 'delete', label: 'Delete', shortcut: 'd', destructive: true },
  )

  return actions
}
