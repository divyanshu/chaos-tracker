import React from 'react'
import { Box, Text } from 'ink'
import { colors } from '../../theme/colors.js'

type ShortcutProps = {
  keys: string
  label: string
}

function Shortcut({ keys, label }: ShortcutProps) {
  return (
    <Text>
      {colors.accent(keys)}
      {colors.dim(':')}
      {colors.muted(label)}
    </Text>
  )
}

export function Footer() {
  return (
    <Box marginTop={1} gap={2} flexWrap="wrap">
      <Shortcut keys="j/k" label="nav" />
      <Shortcut keys="n" label="new" />
      <Shortcut keys="s" label="start" />
      <Shortcut keys="p" label="pause" />
      <Shortcut keys="c" label="done" />
      <Shortcut keys="t" label="touch" />
      <Shortcut keys="d" label="del" />
      <Shortcut keys="/" label="find" />
      <Shortcut keys=":" label="cmd" />
      <Shortcut keys="?" label="help" />
      <Shortcut keys="q" label="quit" />
    </Box>
  )
}
