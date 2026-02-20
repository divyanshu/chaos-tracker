import React from 'react'
import { Text } from 'ink'
import type { TaskStatus } from '#core/domain/task.js'
import { colors } from '../../theme/colors.js'

const STATUS_SYMBOLS: Record<TaskStatus, string> = {
  pending: '\u25cb',
  in_progress: '\u25cf',
  paused: '\u25d0',
  completed: '\u25cf',
}

const STATUS_COLORS: Record<TaskStatus, (s: string) => string> = {
  pending: colors.pending,
  in_progress: colors.inProgress,
  paused: colors.paused,
  completed: colors.completed,
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <Text>{STATUS_COLORS[status](STATUS_SYMBOLS[status])}</Text>
}
