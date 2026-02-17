import React from 'react'
import { Box, Text } from 'ink'
import { colors } from '../../theme/colors.js'
import { termWidth } from '../../utils/terminal.js'

export function Header() {
  const w = termWidth()

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text>{colors.accent.bold('  CHAOS TRACKER')}</Text>
      <Text>{colors.dim('  ' + '\u2500'.repeat(w - 2))}</Text>
    </Box>
  )
}
