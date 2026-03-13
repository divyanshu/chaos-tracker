import React, { useContext } from 'react'
import { Box, Text, useInput, useStdin } from 'ink'
import { colors } from '../theme/colors.js'
import { AppStateContext } from '../app.js'

const SHORTCUTS = [
  ['j / \u2193', 'Move down'],
  ['k / \u2191', 'Move up'],
  ['Enter', 'Open task detail'],
  ['n', 'Create new task'],
  ['s', 'Start selected task'],
  ['p', 'Pause selected task'],
  ['c', 'Complete selected task'],
  ['d', 'Delete selected task'],
  ['e', 'Edit task (in detail view)'],
  ['f', 'Filter tasks'],
  [': or /', 'Open command palette'],
  ['?', 'Show this help'],
  ['q', 'Quit'],
  ['Esc', 'Go back'],
]

export function HelpView() {
  const { setState } = useContext(AppStateContext)
  const { isRawModeSupported } = useStdin()

  return (
    <Box flexDirection="column">
      <Text>{colors.accent.bold('  Keyboard Shortcuts')}</Text>
      <Text>{colors.dim('  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500')}</Text>
      <Box flexDirection="column" paddingLeft={2} marginTop={1}>
        {SHORTCUTS.map(([key, desc]) => (
          <Box key={key} gap={1}>
            <Box width={14}>
              <Text>{colors.accent(key!)}</Text>
            </Box>
            <Text>{colors.primary(desc!)}</Text>
          </Box>
        ))}
      </Box>
      <Box paddingLeft={2} marginTop={1}>
        <Text>{colors.dim('Press Esc or ? to go back')}</Text>
      </Box>
      {isRawModeSupported && <HelpKeyHandler onBack={() => setState((s) => ({ ...s, view: 'dashboard' }))} />}
    </Box>
  )
}

function HelpKeyHandler({ onBack }: { onBack: () => void }) {
  useInput((input, key) => {
    if (key.escape || input === '?' || input === 'q') {
      onBack()
    }
  })
  return null
}
