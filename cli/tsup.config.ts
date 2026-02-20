import { defineConfig } from 'tsup'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  banner: { js: '#!/usr/bin/env node' },
  clean: true,
  alias: {
    '#core': resolve(__dirname, '../src/core'),
  },
})
