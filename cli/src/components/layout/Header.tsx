import React from 'react'
import { Box, Text } from 'ink'
import { colors } from '../../theme/colors.js'

export function Header() {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text>{colors.accent.bold('  CHAOS TRACKER')}</Text>
      <Text>{colors.dim('  ─────────────────────────────────────────────')}</Text>
    </Box>
  )
}
