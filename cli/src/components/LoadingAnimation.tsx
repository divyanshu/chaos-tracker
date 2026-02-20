import React, { useState, useEffect } from 'react'
import { Box, Text } from 'ink'
import chalk from 'chalk'
import { colors } from '../theme/colors.js'
import { termWidth } from '../utils/terminal.js'
import { AsciiHeader } from './layout/AsciiHeader.js'

const BAR_CHAR = '░'
const INDENT = 5          // matches header art left margin
const FULL_BAR_LEN = 65   // columns 5–69, matches header border width
const WAVE_RADIUS = 3

// Intensity gradient: dim base → accent peak
const WAVE: chalk.ChalkInstance[] = [
  chalk.hex('#44403c'),   // dim (stone-700)
  chalk.hex('#78716c'),   // muted (stone-500)
  chalk.hex('#8b5cf6'),   // vivid purple
  colors.accent,          // pastel purple — peak
]

export function LoadingAnimation() {
  const [tick, setTick] = useState(0)
  const w = termWidth()

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 40)
    return () => clearInterval(id)
  }, [])

  const isNarrow = w < 75
  const barLen = isNarrow ? Math.max(w - 4, 10) : FULL_BAR_LEN
  const indent = isNarrow ? 2 : INDENT

  // Wave center sweeps left → right with padding for smooth entry/exit
  const cycleLen = barLen + WAVE_RADIUS * 2
  const waveCenter = (tick % cycleLen) - WAVE_RADIUS

  // Build the scanning bar
  let bar = ' '.repeat(indent)
  for (let i = 0; i < barLen; i++) {
    const dist = Math.abs(i - waveCenter)
    const level = dist <= WAVE_RADIUS ? WAVE_RADIUS - dist : 0
    bar += WAVE[level](BAR_CHAR)
  }

  // Cycling dots (400 ms per phase)
  const dots = '.'.repeat(Math.floor(tick / 10) % 4)

  return (
    <Box flexDirection="column">
      <AsciiHeader />
      <Box flexDirection="column" marginTop={1}>
        <Text>{bar}</Text>
        <Text>{' '.repeat(indent) + colors.muted('Loading tasks' + dots)}</Text>
      </Box>
    </Box>
  )
}
