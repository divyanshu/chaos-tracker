import React from 'react'
import { Box, Text } from 'ink'
import type { Task } from '#core/domain/task.js'
import { StatusBadge } from './StatusBadge.js'
import { colors } from '../../theme/colors.js'
import { relativeTime, neglectIndicator } from '../../utils/time.js'

type TaskRowProps = {
  task: Task
  isSelected: boolean
}

export function TaskRow({ task, isSelected }: TaskRowProps) {
  const neglect = neglectIndicator(task.last_touched)
  const time = relativeTime(task.last_touched)

  const titleColor = isSelected ? colors.selectedBold : colors.primary
  const metaColor = isSelected ? colors.selected : colors.muted

  const statusLabel = task.status === 'in_progress' ? 'in progress' : task.status

  return (
    <Box>
      {isSelected ? (
        <Text>{colors.accent('\u25b8 ')}</Text>
      ) : (
        <Text>{'  '}</Text>
      )}
      <StatusBadge status={task.status} />
      <Text> </Text>
      <Box flexGrow={1}>
        <Text wrap="truncate">{titleColor(task.title)}</Text>
      </Box>
      <Box flexShrink={0} gap={1}>
        <Text>{metaColor(statusLabel)}</Text>
        <Text>{metaColor(time)}</Text>
        {neglect ? (
          <Text>{neglect === '!!' ? colors.danger(neglect) : colors.warn(neglect)}</Text>
        ) : null}
      </Box>
    </Box>
  )
}
