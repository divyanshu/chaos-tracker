import chalk from 'chalk'

// Monochromatic pastel purple palette with intentional semantic colors
export const colors = {
  // Base text
  primary: chalk.hex('#e7e5e4'),     // Stone-200 — default text
  muted: chalk.hex('#78716c'),       // Stone-500 — secondary text
  dim: chalk.hex('#44403c'),         // Stone-700 — borders, hints, de-emphasized
  accent: chalk.hex('#c4b5fd'),      // Pastel purple — primary accent

  // Category shades (monochromatic purple, light → rich)
  cat1: chalk.hex('#e9d5ff'),        // Lavender — lightest
  cat2: chalk.hex('#d8b4fe'),        // Light purple
  cat3: chalk.hex('#c4b5fd'),        // Pastel purple
  cat4: chalk.hex('#b197fc'),        // Medium purple
  cat5: chalk.hex('#a78bfa'),        // Rich purple
  cat6: chalk.hex('#8b5cf6'),        // Vivid purple

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

const CATEGORY_COLORS: Record<string, chalk.ChalkInstance> = {
  Work: colors.cat1,
  Personal: colors.cat2,
  Chores: colors.cat3,
  Connection: colors.cat4,
  Hobby: colors.cat5,
  Rejuvenate: colors.cat6,
  Completed: colors.completed,
  'Top of Mind': colors.accent,
}

export const categoryColor = (name: string): chalk.ChalkInstance =>
  CATEGORY_COLORS[name] ?? colors.primary
