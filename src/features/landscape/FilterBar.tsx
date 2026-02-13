import { Link } from 'react-router-dom'
import { DEFAULT_CATEGORIES } from '@/core/domain'
import type { TaskStatus } from '@/core/domain'
import { useUIStore } from '@/stores/ui-store'
import { STATUS_DISPLAY } from '@/lib/task-status'
import { cn } from '@/lib/utils'
import { Sun, Moon, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ALL_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'paused', 'completed']

export function FilterBar() {
  const {
    theme,
    toggleTheme,
    filterCategories,
    filterStatuses,
    toggleFilterCategory,
    toggleFilterStatus,
    clearFilters,
  } = useUIStore()

  const hasFilters = filterCategories.length > 0 || filterStatuses.length > 0

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border overflow-x-auto">
      {/* Category chips */}
      <div className="flex items-center gap-1.5">
        {DEFAULT_CATEGORIES.map((cat) => {
          const active = filterCategories.length === 0 || filterCategories.includes(cat.name)
          return (
            <button
              key={cat.name}
              onClick={() => toggleFilterCategory(cat.name)}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium transition-all',
                active
                  ? 'opacity-100'
                  : 'opacity-40 hover:opacity-60',
              )}
              style={{
                backgroundColor: `${cat.color}20`,
                color: cat.color,
              }}
            >
              {cat.name}
            </button>
          )
        })}
      </div>

      <div className="w-px h-5 bg-border shrink-0" />

      {/* Status chips */}
      <div className="flex items-center gap-1.5">
        {ALL_STATUSES.map((status) => {
          const display = STATUS_DISPLAY[status]
          const active = filterStatuses.length === 0 || filterStatuses.includes(status)
          return (
            <button
              key={status}
              onClick={() => toggleFilterStatus(status)}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium transition-all',
                display.className,
                !active && 'opacity-40 hover:opacity-60',
              )}
            >
              {display.label}
            </button>
          )
        })}
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-7 px-2 text-xs text-muted-foreground"
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}

      <div className="flex-1" />

      {/* Right side actions */}
      <Link
        to="/rejuvenate"
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-cyan-600 bg-cyan-100/50 hover:bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/30 dark:hover:bg-cyan-900/50 transition-colors"
      >
        <Sparkles className="h-3 w-3" />
        Rejuvenate
      </Link>

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="h-8 w-8 p-0"
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
