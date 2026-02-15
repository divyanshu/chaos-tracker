import type { Task } from '@/core/domain'
import { DEFAULT_CATEGORIES } from '@/core/domain'
import { searchTasks, type SearchResult } from '@/core/services/fuzzy-search'
import { neglectLevel } from '@/lib/neglect'
import { CommandGroup, CommandItem, CommandInput, CommandList } from '@/components/ui/command'
import { Plus } from 'lucide-react'

interface PaletteSearchProps {
  tasks: Task[]
  query: string
  onQueryChange: (query: string) => void
  onSelectTask: (task: Task) => void
  onSelectCreate: (title: string) => void
}

function HighlightedTitle({ title, highlights }: { title: string; highlights: [number, number][] }) {
  if (highlights.length === 0) return <>{title}</>

  const parts: React.ReactNode[] = []
  let cursor = 0

  for (const [start, end] of highlights) {
    if (cursor < start) {
      parts.push(title.slice(cursor, start))
    }
    parts.push(
      <span key={start} className="font-bold text-foreground">
        {title.slice(start, end)}
      </span>,
    )
    cursor = end
  }
  if (cursor < title.length) {
    parts.push(title.slice(cursor))
  }

  return <>{parts}</>
}

function NeglectDot({ lastTouched }: { lastTouched: string }) {
  const level = neglectLevel(lastTouched)
  if (level === 'none') return null
  return (
    <span
      className={
        level === 'warning'
          ? 'inline-block h-1.5 w-1.5 rounded-full bg-amber-400/70'
          : 'inline-block h-1.5 w-1.5 rounded-full bg-red-400/70'
      }
    />
  )
}

function CategoryChip({ category }: { category: string }) {
  const cat = DEFAULT_CATEGORIES.find((c) => c.name === category)
  const color = cat?.color ?? '#888'
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium"
      style={{ backgroundColor: `${color}25`, color }}
    >
      {category}
    </span>
  )
}

export function PaletteSearch({
  tasks,
  query,
  onQueryChange,
  onSelectTask,
  onSelectCreate,
}: PaletteSearchProps) {
  const results: SearchResult[] = searchTasks(tasks, query)

  return (
    <>
      <CommandInput
        placeholder="Search tasks..."
        value={query}
        onValueChange={onQueryChange}
      />
      <CommandList>
        <CommandGroup>
          {results.map((result) => (
            <CommandItem
              key={result.task.id}
              value={result.task.id}
              onSelect={() => onSelectTask(result.task)}
              className="flex items-center gap-2"
            >
              <span className="flex-1 truncate text-sm">
                <HighlightedTitle title={result.task.title} highlights={result.titleHighlights} />
              </span>
              <CategoryChip category={result.task.category} />
              <NeglectDot lastTouched={result.task.last_touched} />
            </CommandItem>
          ))}
          {query.trim() && (
            <CommandItem
              value={`__create__${query}`}
              onSelect={() => onSelectCreate(query.trim())}
              className="text-muted-foreground"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>
                Create &ldquo;<span className="text-foreground">{query.trim()}</span>&rdquo;
              </span>
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </>
  )
}
