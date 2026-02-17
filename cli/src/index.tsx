import { config } from 'dotenv'
import { resolve } from 'node:path'
import { homedir } from 'node:os'
import { render } from 'ink'
import React from 'react'
import { App } from './app.js'
import type { TaskRepository } from '../../src/core/repositories/task-repository.js'
import { hasSupabaseEnv, writeConfig, applyConfigToEnv } from './utils/config.js'

// Load environment variables (first match wins, already-set env vars take priority)
// 1. ~/.config/chaos-tracker/.env  — XDG-style user config
// 2. .env.local in cwd             — for running from project directory
config({ path: resolve(homedir(), '.config/chaos-tracker/.env'), quiet: true })
config({ path: resolve(process.cwd(), '.env.local'), quiet: true })

const args = process.argv.slice(2)
const useMock = args.includes('--mock')
const useConfig = args.includes('config')

// --- Branch: `chaos config` ---
if (useConfig) {
  const { ConfigView } = await import('./views/ConfigView.js')
  console.clear()
  const { waitUntilExit } = render(<ConfigView />)
  await waitUntilExit().catch(() => {})
  process.exit(0)
}

// --- Branch: `chaos --mock` ---
if (useMock) {
  const { MockTaskRepository } = await import('./infrastructure/mock-task-repository.js')
  startApp(new MockTaskRepository())
} else if (hasSupabaseEnv()) {
  // --- Branch: env vars present ---
  const { SupabaseTaskRepository } = await import('./infrastructure/supabase-task-repository.js')
  startApp(new SupabaseTaskRepository())
} else {
  // --- Branch: no credentials — run onboarding ---
  const { OnboardingView } = await import('./views/OnboardingView.js')
  console.clear()
  const onboarding = render(
    <OnboardingView
      onComplete={async (cfg) => {
        writeConfig(cfg)
        applyConfigToEnv(cfg)
        onboarding.unmount()
        const { SupabaseTaskRepository } = await import('./infrastructure/supabase-task-repository.js')
        startApp(new SupabaseTaskRepository())
      }}
    />
  )
}

function startApp(repo: TaskRepository) {
  console.clear()
  const { waitUntilExit } = render(<App repo={repo} />)
  waitUntilExit().catch(() => {})
}
