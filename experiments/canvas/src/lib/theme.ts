import { DEFAULT_CATEGORIES } from '#core/domain/category'

/** Map category name → color for use in nodes and groups */
export const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(
  DEFAULT_CATEGORIES.map((c) => [c.name, c.color])
)

/** Status dot colors */
export const STATUS_COLORS = {
  pending: 'hsl(var(--muted-foreground))',
  in_progress: '#22c55e',
  paused: '#f59e0b',
  completed: '#6b7280',
} as const
