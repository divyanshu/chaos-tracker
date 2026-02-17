import { existsSync, readFileSync, writeFileSync, mkdirSync, chmodSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { homedir } from 'node:os'

export type ChaosConfig = {
  supabaseUrl: string
  supabaseAnonKey: string
}

export const CONFIG_DIR = resolve(homedir(), '.config/chaos-tracker')
export const CONFIG_FILE_PATH = resolve(CONFIG_DIR, '.env')

/** Check if the config file exists on disk. */
export function configFileExists(): boolean {
  return existsSync(CONFIG_FILE_PATH)
}

/** Parse URL and key from the config file. Returns partial if fields are missing. */
export function readConfig(): Partial<ChaosConfig> {
  if (!configFileExists()) return {}

  const content = readFileSync(CONFIG_FILE_PATH, 'utf-8')
  const config: Partial<ChaosConfig> = {}

  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim()
    if (key === 'VITE_SUPABASE_URL') config.supabaseUrl = value
    if (key === 'VITE_SUPABASE_ANON_KEY') config.supabaseAnonKey = value
  }

  return config
}

/** Create the config directory and write the .env file with restrictive permissions. */
export function writeConfig(config: ChaosConfig): void {
  mkdirSync(dirname(CONFIG_FILE_PATH), { recursive: true })
  const content = [
    '# Chaos Tracker — Supabase credentials',
    `VITE_SUPABASE_URL=${config.supabaseUrl}`,
    `VITE_SUPABASE_ANON_KEY=${config.supabaseAnonKey}`,
    '',
  ].join('\n')
  writeFileSync(CONFIG_FILE_PATH, content, 'utf-8')
  chmodSync(CONFIG_FILE_PATH, 0o600)
}

/** Set process.env vars so supabase.ts finds them on dynamic import. */
export function applyConfigToEnv(config: ChaosConfig): void {
  process.env.VITE_SUPABASE_URL = config.supabaseUrl
  process.env.VITE_SUPABASE_ANON_KEY = config.supabaseAnonKey
}

/** Check if both Supabase env vars are present. */
export function hasSupabaseEnv(): boolean {
  return Boolean(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY)
}

/** Mask a value for display: show first 8 + last 4 chars. */
export function maskValue(value: string): string {
  if (value.length <= 16) return '••••••••'
  return value.slice(0, 8) + '••••' + value.slice(-4)
}
