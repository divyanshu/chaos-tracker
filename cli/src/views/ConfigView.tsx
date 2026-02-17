import React, { useState, useEffect } from 'react'
import { Box, Text, useApp, useInput, useStdin } from 'ink'
import { TextInput } from '@inkjs/ui'
import { colors } from '../theme/colors.js'
import {
  readConfig,
  writeConfig,
  applyConfigToEnv,
  maskValue,
  CONFIG_FILE_PATH,
} from '../utils/config.js'

type ConfigStep = 'view' | 'edit-url' | 'edit-key' | 'saved'

export function ConfigView() {
  const { exit } = useApp()
  const { isRawModeSupported } = useStdin()
  const existing = readConfig()
  const [step, setStep] = useState<ConfigStep>('view')
  const [url, setUrl] = useState(existing.supabaseUrl ?? '')
  const [key, setKey] = useState(existing.supabaseAnonKey ?? '')

  // Auto-exit after save flash
  useEffect(() => {
    if (step === 'saved') {
      const timer = setTimeout(() => exit(), 1000)
      return () => clearTimeout(timer)
    }
  }, [step, exit])

  return (
    <Box flexDirection="column" gap={1}>
      <Text>{colors.accent.bold('  CHAOS TRACKER — Config')}</Text>
      <Text>{colors.dim('  ─────────────────────────────────────────────')}</Text>

      <Box paddingLeft={2}>
        <Text>{colors.dim(`File: ${CONFIG_FILE_PATH}`)}</Text>
      </Box>

      {/* URL */}
      <Box paddingLeft={2} gap={1}>
        <Text>{step === 'edit-url' ? colors.accent('▸') : ' '}</Text>
        <Text>{colors.dim('Supabase URL:')}</Text>
        {step === 'edit-url' ? (
          <TextInput
            defaultValue={url}
            onSubmit={(value) => {
              const trimmed = value.trim()
              if (trimmed) {
                setUrl(trimmed)
                setStep('edit-key')
              }
            }}
          />
        ) : (
          <Text>{url ? colors.primary(url) : colors.muted('(not set)')}</Text>
        )}
      </Box>

      {/* Key */}
      <Box paddingLeft={2} gap={1}>
        <Text>{step === 'edit-key' ? colors.accent('▸') : ' '}</Text>
        <Text>{colors.dim('Anon Key:')}</Text>
        {step === 'edit-key' ? (
          <TextInput
            defaultValue={key}
            onSubmit={(value) => {
              const trimmed = value.trim()
              if (trimmed) {
                setKey(trimmed)
                const config = { supabaseUrl: url, supabaseAnonKey: trimmed }
                writeConfig(config)
                applyConfigToEnv(config)
                setStep('saved')
              }
            }}
          />
        ) : (
          <Text>{key ? colors.primary(maskValue(key)) : colors.muted('(not set)')}</Text>
        )}
      </Box>

      {/* Status bar */}
      {step === 'saved' && (
        <Box paddingLeft={2}>
          <Text>{colors.success('Saved successfully.')}</Text>
        </Box>
      )}

      {step === 'view' && isRawModeSupported && (
        <ViewControls onEdit={() => setStep('edit-url')} onExit={exit} />
      )}

      {step === 'view' && (
        <Box paddingLeft={2} gap={2}>
          <Text>{colors.accent('e')}{colors.dim(':edit')}</Text>
          <Text>{colors.accent('q')}{colors.dim(':quit')}</Text>
        </Box>
      )}
    </Box>
  )
}

function ViewControls({
  onEdit,
  onExit,
}: {
  onEdit: () => void
  onExit: () => void
}) {
  useInput((input, key) => {
    if (input === 'e') {
      onEdit()
      return
    }
    if (input === 'q' || key.escape) {
      onExit()
    }
  })
  return null
}
