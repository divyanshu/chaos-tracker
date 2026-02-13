import { config } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from 'ink'
import React from 'react'
import { App } from './app.js'
import type { TaskRepository } from '../../src/core/repositories/task-repository.js'

// Load .env.local from project root (silently no-ops if missing)
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../../.env.local') })

const useMock = process.argv.includes('--mock')

let repo: TaskRepository

if (useMock) {
  const { MockTaskRepository } = await import('./infrastructure/mock-task-repository.js')
  repo = new MockTaskRepository()
} else {
  const { SupabaseTaskRepository } = await import('./infrastructure/supabase-task-repository.js')
  repo = new SupabaseTaskRepository()
}

const { waitUntilExit } = render(<App repo={repo} />)
waitUntilExit().catch(() => {})
