import React, { useState } from 'react'
import { Box, Text, useInput, useStdin } from 'ink'
import { TextInput } from '@inkjs/ui'
import { colors } from '../theme/colors.js'
import { CONFIG_FILE_PATH, maskValue } from '../utils/config.js'
import type { ChaosConfig } from '../utils/config.js'

type OnboardingStep = 'welcome' | 'url' | 'key' | 'confirm'

type OnboardingViewProps = {
  onComplete: (config: ChaosConfig) => void
}

export function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [url, setUrl] = useState('')
  const [key, setKey] = useState('')
  const { isRawModeSupported } = useStdin()

  return (
    <Box flexDirection="column" gap={1}>
      <Text>{colors.accent.bold('  CHAOS TRACKER')}</Text>
      <Text>{colors.dim('  ─────────────────────────────────────────────')}</Text>

      {/* Welcome */}
      <Box paddingLeft={2} flexDirection="column">
        <Text>{step === 'welcome' ? colors.accent('▸') : ' '} {colors.primary("Welcome! Let's connect to your Supabase project.")}</Text>
        <Text>  {colors.dim(`Config will be saved to ${CONFIG_FILE_PATH}`)}</Text>
      </Box>

      {step === 'welcome' && isRawModeSupported && (
        <WelcomeStep onContinue={() => setStep('url')} />
      )}
      {step === 'welcome' && (
        <Box paddingLeft={2}>
          <Text>{colors.muted('Press Enter to begin')}</Text>
        </Box>
      )}

      {/* URL */}
      {step !== 'welcome' && (
        <Box paddingLeft={2} gap={1}>
          <Text>{step === 'url' ? colors.accent('▸') : ' '}</Text>
          <Text>{colors.dim('Supabase URL:')}</Text>
          {step === 'url' ? (
            <TextInput
              placeholder="https://xxxxx.supabase.co"
              onSubmit={(value) => {
                const trimmed = value.trim()
                if (trimmed) {
                  setUrl(trimmed)
                  setStep('key')
                }
              }}
            />
          ) : (
            <Text>{colors.primary(url)}</Text>
          )}
        </Box>
      )}

      {/* Anon Key */}
      {(step === 'key' || step === 'confirm') && (
        <Box paddingLeft={2} gap={1}>
          <Text>{step === 'key' ? colors.accent('▸') : ' '}</Text>
          <Text>{colors.dim('Anon Key:')}</Text>
          {step === 'key' ? (
            <TextInput
              placeholder="eyJhbGciOiJIUzI1NiIs..."
              onSubmit={(value) => {
                const trimmed = value.trim()
                if (trimmed) {
                  setKey(trimmed)
                  setStep('confirm')
                }
              }}
            />
          ) : (
            <Text>{colors.primary(maskValue(key))}</Text>
          )}
        </Box>
      )}

      {/* Confirm */}
      {step === 'confirm' && isRawModeSupported && (
        <ConfirmStep
          onConfirm={() => onComplete({ supabaseUrl: url, supabaseAnonKey: key })}
          onRestart={() => {
            setUrl('')
            setKey('')
            setStep('url')
          }}
        />
      )}

      <Box paddingLeft={2}>
        <Text>{colors.dim('Tip: Run with --mock to try without Supabase')}</Text>
      </Box>
    </Box>
  )
}

function WelcomeStep({ onContinue }: { onContinue: () => void }) {
  useInput((_input, key) => {
    if (key.return) onContinue()
  })
  return null
}

function ConfirmStep({
  onConfirm,
  onRestart,
}: {
  onConfirm: () => void
  onRestart: () => void
}) {
  useInput((input, key) => {
    if (key.return || input === 'y') {
      onConfirm()
      return
    }
    if (key.escape || input === 'n') {
      onRestart()
    }
  })

  return (
    <Box paddingLeft={2} gap={1}>
      <Text>{colors.accent('▸')}</Text>
      <Text>{colors.primary('Save and connect? ')}</Text>
      <Text>{colors.muted('(Enter/y to confirm, Esc/n to re-enter)')}</Text>
    </Box>
  )
}
