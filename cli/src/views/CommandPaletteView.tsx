import React, { useState, useContext } from 'react'
import { Box, Text, useInput, useStdin } from 'ink'
import { TextInput } from '@inkjs/ui'
import { colors } from '../theme/colors.js'
import { AppStateContext } from '../app.js'
import { useTasks } from '../hooks/use-tasks.js'
import { DEFAULT_CATEGORIES } from '../../../src/core/domain/category.js'

const COMMANDS = [
  { name: 'add', alias: ['new', 'create'], desc: 'Create a new task — add <title>' },
  { name: 'start', alias: ['s'], desc: 'Start a task — start' },
  { name: 'pause', alias: ['p'], desc: 'Pause a task — pause' },
  { name: 'complete', alias: ['done', 'c'], desc: 'Complete a task — complete' },
  { name: 'touch', alias: ['t'], desc: 'Touch a task — touch' },
  { name: 'delete', alias: ['rm', 'del'], desc: 'Delete a task — delete' },
  { name: 'filter', alias: ['f'], desc: 'Open filter view' },
  { name: 'help', alias: ['?', 'h'], desc: 'Show keyboard shortcuts' },
  { name: 'quit', alias: ['exit', 'q'], desc: 'Exit Chaos Tracker' },
]

export function CommandPaletteView() {
  const { state, setState } = useContext(AppStateContext)
  const { setStatus, touchTask, deleteTask, createTask, flatTaskIds } = useTasks()
  const [query, setQuery] = useState('')

  const goBack = () => setState((s) => ({ ...s, view: 'dashboard' }))

  const filtered = COMMANDS.filter((cmd) => {
    if (!query) return true
    const q = query.toLowerCase()
    return cmd.name.includes(q) || cmd.alias.some((a) => a.includes(q)) || cmd.desc.toLowerCase().includes(q)
  })

  const executeCommand = async (input: string) => {
    const parts = input.trim().split(/\s+/)
    const cmd = parts[0]?.toLowerCase()
    const arg = parts.slice(1).join(' ')

    const selectedId = flatTaskIds[state.selectedIndex] ?? null

    switch (cmd) {
      case 'add':
      case 'new':
      case 'create':
        if (arg) {
          await createTask(arg, DEFAULT_CATEGORIES[0].name)
          goBack()
        } else {
          setState((s) => ({ ...s, view: 'create' }))
        }
        break
      case 'start':
      case 's':
        if (selectedId) await setStatus(selectedId, 'in_progress')
        goBack()
        break
      case 'pause':
      case 'p':
        if (selectedId) await setStatus(selectedId, 'paused')
        goBack()
        break
      case 'complete':
      case 'done':
      case 'c':
        if (selectedId) await setStatus(selectedId, 'completed')
        goBack()
        break
      case 'touch':
      case 't':
        if (selectedId) await touchTask(selectedId)
        goBack()
        break
      case 'delete':
      case 'rm':
      case 'del':
        if (selectedId) await deleteTask(selectedId)
        goBack()
        break
      case 'filter':
      case 'f':
        setState((s) => ({ ...s, view: 'filter' }))
        break
      case 'help':
      case '?':
      case 'h':
        setState((s) => ({ ...s, view: 'help' }))
        break
      case 'quit':
      case 'exit':
      case 'q':
        process.exit(0)
        break
      default:
        goBack()
    }
  }

  return (
    <Box flexDirection="column">
      <Text>{colors.accent.bold('  Command Palette')}</Text>
      <Text>{colors.dim('  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500')}</Text>

      <Box paddingLeft={2} marginTop={1} gap={1}>
        <Text>{colors.accent(':')}</Text>
        <TextInput
          defaultValue=""
          onChange={setQuery}
          onSubmit={executeCommand}
        />
      </Box>

      <Box flexDirection="column" paddingLeft={4} marginTop={1}>
        {filtered.map((cmd) => (
          <Box key={cmd.name} gap={1}>
            <Box width={12}>
              <Text>{colors.accent(cmd.name)}</Text>
            </Box>
            <Text>{colors.muted(cmd.desc)}</Text>
          </Box>
        ))}
      </Box>

      <Box paddingLeft={2} marginTop={1}>
        <Text>{colors.dim('Enter to execute, Esc to cancel')}</Text>
      </Box>
      <EscHandler onBack={goBack} />
    </Box>
  )
}

function EscHandler({ onBack }: { onBack: () => void }) {
  const { isRawModeSupported } = useStdin()
  if (!isRawModeSupported) return null
  return <EscInput onBack={onBack} />
}

function EscInput({ onBack }: { onBack: () => void }) {
  useInput((_input, key) => {
    if (key.escape) onBack()
  })
  return null
}
