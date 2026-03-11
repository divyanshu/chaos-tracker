import React from 'react'
import { Box, Text, useStdin } from 'ink'
import type { Task } from '#core/domain/task.js'
import { StatusBadge } from './StatusBadge.js'
import { colors, categoryColor, tagColor } from '../../theme/colors.js'
import { relativeTime, neglectIndicator } from '../../utils/time.js'

type TaskDetailProps = {
  task: Task
}

export function TaskDetail({ task }: TaskDetailProps) {
  const catColor = categoryColor(task.category)
  const neglect = neglectIndicator(task.last_touched)
  const statusLabel = task.status === 'in_progress' ? 'in progress' : task.status

  return (
    <Box flexDirection="column" gap={1}>
      <Box gap={1}>
        <StatusBadge status={task.status} />
        <Text>{colors.primary.bold(task.title)}</Text>
        {neglect ? (
          <Text>{neglect === '!!' ? colors.danger(neglect) : colors.warn(neglect)}</Text>
        ) : null}
      </Box>

      <Box flexDirection="column" paddingLeft={2}>
        <Box gap={1}>
          <Text>{colors.dim('Category:')}</Text>
          <Text>{catColor(task.category)}</Text>
        </Box>
        {task.tags.length > 0 && (
          <Box gap={1}>
            <Text>{colors.dim('Tags:')}</Text>
            <Text>{task.tags.map((t) => tagColor(t)(t)).join(colors.dim(', '))}</Text>
          </Box>
        )}
        <Box gap={1}>
          <Text>{colors.dim('Status:')}</Text>
          <Text>{colors.primary(statusLabel)}</Text>
        </Box>
        <Box gap={1}>
          <Text>{colors.dim('Last touched:')}</Text>
          <Text>{colors.primary(relativeTime(task.last_touched) + ' ago')}</Text>
        </Box>
        <Box gap={1}>
          <Text>{colors.dim('Created:')}</Text>
          <Text>{colors.primary(relativeTime(task.created_at) + ' ago')}</Text>
        </Box>
      </Box>

      {task.description ? (
        <Box paddingLeft={2} flexDirection="column">
          <Text>{colors.dim('Description:')}</Text>
          <Text>{colors.primary(task.description)}</Text>
        </Box>
      ) : null}
    </Box>
  )
}
