import chalk from 'chalk'

// Monochromatic pastel purple palette with intentional semantic colors
export const colors = {
  // Base text
  primary: chalk.hex('#e7e5e4'),     // Stone-200 — default text
  muted: chalk.hex('#78716c'),       // Stone-500 — secondary text
  dim: chalk.hex('#44403c'),         // Stone-700 — borders, hints, de-emphasized
  accent: chalk.hex('#c4b5fd'),      // Pastel purple — primary accent

  // Semantic status — green/yellow/red used intentionally
  pending: chalk.hex('#78716c'),     // Stone-500 — neutral/inactive
  inProgress: chalk.hex('#86efac'),  // Green — active/success
  paused: chalk.hex('#fcd34d'),      // Amber — caution/paused
  completed: chalk.hex('#57534e'),   // Stone-600 — faded/done

  // Alerts
  success: chalk.hex('#86efac'),     // Green
  warn: chalk.hex('#fbbf24'),        // Amber
  danger: chalk.hex('#f87171'),      // Red

  // Highlight (selected row)
  selected: chalk.bgHex('#292524').hex('#e7e5e4'),
  selectedBold: chalk.bgHex('#292524').hex('#c4b5fd').bold,
} as const

// Workflow categories — primary task grouping
const CATEGORY_COLORS: Record<string, chalk.ChalkInstance> = {
  Urgent: chalk.hex('#f87171'),      // Red
  'Up Next': chalk.hex('#fbbf24'),   // Amber
  Admin: chalk.hex('#a8a29e'),       // Stone-400
  Flow: chalk.hex('#c4b5fd'),        // Pastel purple
  Completed: colors.completed,
  'Top of Mind': colors.accent,
}

export const categoryColor = (name: string): chalk.ChalkInstance =>
  CATEGORY_COLORS[name] ?? colors.primary

// Tags — topic labels with muted colors
const TAG_COLORS: Record<string, chalk.ChalkInstance> = {
  Work: chalk.hex('#7a8fa6'),
  Personal: chalk.hex('#a0b89c'),
  Chores: chalk.hex('#b8a99a'),
  Connection: chalk.hex('#c4a0a0'),
  Hobby: chalk.hex('#9a8db8'),
  Rejuvenate: chalk.hex('#8aada6'),
}

export const tagColor = (name: string): chalk.ChalkInstance =>
  TAG_COLORS[name] ?? colors.muted
