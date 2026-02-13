import chalk from 'chalk'

// Warm pastel palette — Stone base + softened category colors
export const colors = {
  // Base
  primary: chalk.hex('#e7e5e4'),     // Stone-200
  muted: chalk.hex('#a8a29e'),       // Stone-400
  dim: chalk.hex('#78716c'),         // Stone-500
  accent: chalk.hex('#fbbf24'),      // Warm amber

  // Category colors
  work: chalk.hex('#a5b4fc'),        // Pastel indigo
  personal: chalk.hex('#86efac'),    // Pastel green
  chores: chalk.hex('#fcd34d'),      // Pastel amber
  connection: chalk.hex('#f9a8d4'),  // Pastel pink
  hobby: chalk.hex('#c4b5fd'),       // Pastel purple
  rejuvenate: chalk.hex('#67e8f9'),  // Pastel cyan

  // Status
  pending: chalk.hex('#a8a29e'),     // Stone-400
  inProgress: chalk.hex('#86efac'),  // Green
  paused: chalk.hex('#fcd34d'),      // Amber
  completed: chalk.hex('#78716c'),   // Dim

  // Alerts
  warn: chalk.hex('#fbbf24'),        // Amber
  danger: chalk.hex('#f87171'),      // Red

  // Highlight
  selected: chalk.bgHex('#292524').hex('#e7e5e4'), // Stone-800 bg
  selectedBold: chalk.bgHex('#292524').hex('#fbbf24').bold,
} as const

export const categoryColor = (name: string): chalk.ChalkInstance => {
  const map: Record<string, chalk.ChalkInstance> = {
    Work: colors.work,
    Personal: colors.personal,
    Chores: colors.chores,
    Connection: colors.connection,
    Hobby: colors.hobby,
    Rejuvenate: colors.rejuvenate,
  }
  return map[name] ?? colors.primary
}
