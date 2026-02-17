import React from 'react'
import { Box, Text } from 'ink'
import { colors, categoryColor } from '../../theme/colors.js'
import { termWidth } from '../../utils/terminal.js'

type PanelProps = {
  title: string
  count: number
  children: React.ReactNode
}

export function Panel({ title, count, children }: PanelProps) {
  const catColor = categoryColor(title)
  const titleStr = ` ${title} (${count}) `
  const w = termWidth()
  // Account for ╭─ (2 chars) + title + ─...╮ (1 char)
  const lineWidth = Math.max(w - titleStr.length - 3, 0)

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text>
        {colors.dim('\u256d\u2500')}
        {catColor.bold(titleStr)}
        {colors.dim('\u2500'.repeat(lineWidth) + '\u256e')}
      </Text>
      <Box flexDirection="column" paddingLeft={1} paddingRight={1}>
        {children}
      </Box>
      <Text>{colors.dim('\u2570' + '\u2500'.repeat(w - 2) + '\u256f')}</Text>
    </Box>
  )
}
