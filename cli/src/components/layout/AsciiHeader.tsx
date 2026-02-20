import React from 'react'
import { Box, Text } from 'ink'
import chalk from 'chalk'
import { colors } from '../../theme/colors.js'
import { termWidth } from '../../utils/terminal.js'

// Purple palette mapped from the original cyan/white art tokens
const fill = colors.accent                   // #c4b5fd — pastel purple (block fill)
const edge = chalk.hex('#e9d5ff')            // Lavender (inner letter edges ═╗╔║╚╝)

const BOX_DRAWING = new Set(['╗', '╔', '═', '║', '╚', '╝'])

// Rows 2–20 of the original art (external blank padding stripped)
const ART: string[] = [
  '     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
  '     ░                                                               ░',
  '     ░                                                               ░',
  '     ░    ░░░░░░╗░░╗  ░░╗ ░░░░░╗  ░░░░░░╗ ░░░░░░░╗                   ░',
  '     ░   ░░╔════╝░░║  ░░║░░╔══░░╗░░╔═══░░╗░░╔════╝                   ░',
  '     ░   ░░║     ░░░░░░░║░░░░░░░║░░║   ░░║░░░░░░░╗                   ░',
  '     ░   ░░║     ░░╔══░░║░░╔══░░║░░║   ░░║╚════░░║                   ░',
  '     ░   ╚░░░░░░╗░░║  ░░║░░║  ░░║╚░░░░░░╔╝░░░░░░░║                   ░',
  '     ░    ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝                   ░',
  '     ░                                                               ░',
  '     ░   ░░░░░░░░╗░░░░░░╗  ░░░░░╗  ░░░░░░╗░░╗  ░░╗░░░░░░░╗░░░░░░╗    ░',
  '     ░   ╚══░░╔══╝░░╔══░░╗░░╔══░░╗░░╔════╝░░║ ░░╔╝░░╔════╝░░╔══░░╗   ░',
  '     ░      ░░║   ░░░░░░╔╝░░░░░░░║░░║     ░░░░░╔╝ ░░░░░╗  ░░░░░░╔╝   ░',
  '     ░      ░░║   ░░╔══░░╗░░╔══░░║░░║     ░░╔═░░╗ ░░╔══╝  ░░╔══░░╗   ░',
  '     ░      ░░║   ░░║  ░░║░░║  ░░║╚░░░░░░╗░░║  ░░╗░░░░░░░╗░░║  ░░║   ░',
  '     ░      ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ░',
  '     ░                                                               ░',
  '     ░                                                               ░',
  '     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
]

function colorLine(line: string): string {
  let result = ''
  for (const ch of line) {
    if (ch === '░') result += fill(ch)
    else if (BOX_DRAWING.has(ch)) result += edge(ch)
    else result += ch
  }
  return result
}

// Pre-compute colored lines once at module load
const COLORED_LINES = ART.map(colorLine)

export function AsciiHeader() {
  const w = termWidth()

  // Narrow terminal fallback — simple text header
  if (w < 75) {
    return (
      <Box flexDirection="column" marginBottom={1}>
        <Text>{colors.accent.bold('  CHAOS TRACKER')}</Text>
        <Text>{colors.dim('  ' + '\u2500'.repeat(w - 2))}</Text>
      </Box>
    )
  }

  return (
    <Box flexDirection="column">
      {COLORED_LINES.map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
    </Box>
  )
}
