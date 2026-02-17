import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).\n' +
    'Set them in one of:\n' +
    '  1. Your shell profile (export VITE_SUPABASE_URL=...)\n' +
    '  2. ~/.config/chaos-tracker/.env\n' +
    '  3. .env.local in the current directory\n' +
    'Or run with --mock to use offline mock data.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
