import React from 'react'
import { Box, Text } from 'ink'
import { colors, categoryColor } from '../../theme/colors.js'
import { termWidth } from '../../utils/terminal.js'

type PanelProps = {
  title: string
  count: number
  isCollapsed?: boolean
  children: React.ReactNode
}

export function Panel({ title, count, isCollapsed, children }: PanelProps) {
  const catColor = categoryColor(title)
  const collapseIndicator = isCollapsed != null ? (isCollapsed ? '[+] ' : '[-] ') : ''
  const titleStr = ` ${collapseIndicator}${title} (${count}) `
  const w = termWidth()
  const lineWidth = Math.max(w - titleStr.length - 3, 0)

  if (isCollapsed) {
    return (
      <Box flexDirection="column" marginBottom={1}>
        <Text>
          {colors.dim('\u256d\u2500')}
          {catColor.bold(titleStr)}
          {colors.dim('\u2500'.repeat(lineWidth) + '\u256e')}
        </Text>
        <Text>{colors.dim('\u2570' + '\u2500'.repeat(w - 2) + '\u256f')}</Text>
      </Box>
    )
  }

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
