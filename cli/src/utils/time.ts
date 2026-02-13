const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()

  if (diff < MINUTE) return 'just now'
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m`
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`
  return `${Math.floor(diff / DAY)}d`
}

export function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / DAY)
}

export type NeglectLevel = 'none' | 'warning' | 'critical'

export function neglectLevel(lastTouched: string): NeglectLevel {
  const days = daysSince(lastTouched)
  if (days >= 7) return 'critical'
  if (days >= 3) return 'warning'
  return 'none'
}

export function neglectIndicator(lastTouched: string): string {
  const level = neglectLevel(lastTouched)
  if (level === 'critical') return '!!'
  if (level === 'warning') return '\u26a0'
  return ''
}
