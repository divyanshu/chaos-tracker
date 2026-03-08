import { useState, useRef, useEffect, useMemo } from 'react'
import gsap from 'gsap'
import { toast } from 'sonner'
import { useUIStore } from '@/stores/ui-store'
import { useTasks, useCreateTask, useUpdateTask, useTouchTask } from '@/hooks/use-tasks'
import { searchTasks, type SearchResult } from '#core/services/fuzzy-search'
import { DEFAULT_CATEGORIES } from '#core/domain/category'
import { CATEGORY_COLORS } from '@/lib/theme'
import { cn } from '@/lib/utils'
import { relativeTime } from '@/lib/neglect'
import { STATUS_DISPLAY } from '@/lib/task-status'

export function QuickEntry() {
  const { quickEntryOpen, setQuickEntryOpen, selectNode } = useUIStore()
  const { data: tasks } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const touchTask = useTouchTask()

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mode, setMode] = useState<'search' | 'category'>('search')
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const results = useMemo<SearchResult[]>(() => {
    if (!tasks) return []
    return searchTasks(tasks, query)
  }, [tasks, query])

  const showCreate = query.trim().length > 0 && results.every(
    (r) => r.task.title.toLowerCase() !== query.trim().toLowerCase()
  )

  useEffect(() => {
    if (quickEntryOpen) {
      setQuery('')
      setSelectedIndex(0)
      setMode('search')
      setTimeout(() => inputRef.current?.focus(), 50)
      // Animate in
      if (panelRef.current) {
        gsap.from(panelRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.25,
          ease: 'power3.out',
        })
      }
    }
  }, [quickEntryOpen])

  // Animate results appearing
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const items = resultsRef.current.children
      gsap.from(items, {
        y: 8,
        opacity: 0,
        stagger: 0.04,
        duration: 0.2,
        ease: 'power2.out',
      })
    }
  }, [results])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!quickEntryOpen) return null

  const totalItems = results.length + (showCreate ? 1 : 0)

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      if (mode === 'category') {
        setMode('search')
        return
      }
      setQuickEntryOpen(false)
      return
    }

    if (mode === 'category') {
      const cats = DEFAULT_CATEGORIES
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % cats.length)
        return
      }
      if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + cats.length) % cats.length)
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const cat = cats[selectedIndex]
        createTask.mutate({
          title: query.trim(),
          description: null,
          status: 'pending',
          category: cat.name,
        })
        toast.success(`Created "${query.trim()}" in ${cat.name}`)
        setQuickEntryOpen(false)
        return
      }
      return
    }

    // Search mode
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, totalItems - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
      return
    }
    if (e.key === 'Tab' && showCreate) {
      e.preventDefault()
      setMode('category')
      setSelectedIndex(0)
      return
    }
    if (e.key === 'Enter' && totalItems > 0) {
      e.preventDefault()
      if (showCreate && selectedIndex === results.length) {
        setMode('category')
        setSelectedIndex(0)
        return
      }
      if (results[selectedIndex]) {
        selectNode(results[selectedIndex].task.id)
        setQuickEntryOpen(false)
      }
      return
    }

    // Quick actions on selected result (Alt+key)
    if (selectedIndex < results.length && e.altKey) {
      const task = results[selectedIndex].task
      if (e.key === 's') {
        e.preventDefault()
        updateTask.mutate({ id: task.id, changes: { status: 'in_progress' } })
        toast.success(`Started "${task.title}"`)
        return
      }
      if (e.key === 'p') {
        e.preventDefault()
        updateTask.mutate({ id: task.id, changes: { status: 'paused' } })
        toast.success(`Paused "${task.title}"`)
        return
      }
      if (e.key === 'c') {
        e.preventDefault()
        updateTask.mutate({ id: task.id, changes: { status: 'completed' } })
        toast.success(`Completed "${task.title}"`)
        return
      }
      if (e.key === 't') {
        e.preventDefault()
        touchTask.mutate(task.id)
        toast.success(`Touched "${task.title}"`)
        return
      }
    }
  }

  function renderHighlightedTitle(result: SearchResult) {
    const { task, titleHighlights } = result
    if (titleHighlights.length === 0) return task.title

    const parts: React.ReactNode[] = []
    let lastEnd = 0

    for (const [start, end] of titleHighlights) {
      if (start > lastEnd) {
        parts.push(task.title.slice(lastEnd, start))
      }
      parts.push(
        <span key={start} className="text-primary font-semibold">
          {task.title.slice(start, end)}
        </span>,
      )
      lastEnd = end
    }
    if (lastEnd < task.title.length) {
      parts.push(task.title.slice(lastEnd))
    }
    return parts
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setQuickEntryOpen(false)} />
      <div ref={panelRef} className="relative w-full max-w-lg rounded-lg border bg-card shadow-2xl">
        <div className="flex items-center border-b px-3">
          <span className="text-muted-foreground mr-2 text-sm font-mono">/</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'category' ? 'Pick a category...' : 'Search tasks or type to create...'}
            className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {mode === 'category' ? (
          <div className="max-h-64 overflow-y-auto p-1">
            <div className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground">
              Category for "<span className="text-foreground">{query.trim()}</span>"
            </div>
            {DEFAULT_CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                  i === selectedIndex ? 'bg-accent' : 'hover:bg-accent/50',
                )}
                onClick={() => {
                  createTask.mutate({
                    title: query.trim(),
                    description: null,
                    status: 'pending',
                    category: cat.name,
                  })
                  toast.success(`Created "${query.trim()}" in ${cat.name}`)
                  setQuickEntryOpen(false)
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div ref={resultsRef} className="max-h-64 overflow-y-auto p-1">
            {results.map((result, i) => (
              <button
                key={result.task.id}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                  i === selectedIndex ? 'bg-accent' : 'hover:bg-accent/50',
                )}
                onClick={() => {
                  selectNode(result.task.id)
                  setQuickEntryOpen(false)
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <span className={cn('h-2 w-2 rounded-full flex-shrink-0', STATUS_DISPLAY[result.task.status].dot)} />
                <span className="flex-1 truncate text-left">
                  {renderHighlightedTitle(result)}
                </span>
                <span
                  className="rounded-sm px-1 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[result.task.category] ?? '#888'}20`,
                    color: CATEGORY_COLORS[result.task.category] ?? '#888',
                  }}
                >
                  {result.task.category}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {relativeTime(result.task.last_touched)}
                </span>
              </button>
            ))}

            {showCreate && (
              <button
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                  selectedIndex === results.length ? 'bg-accent' : 'hover:bg-accent/50',
                )}
                onClick={() => {
                  setMode('category')
                  setSelectedIndex(0)
                }}
                onMouseEnter={() => setSelectedIndex(results.length)}
              >
                <span className="text-muted-foreground">+</span>
                <span>Create "<span className="font-medium">{query.trim()}</span>"</span>
                <span className="ml-auto text-[10px] text-muted-foreground">Tab</span>
              </button>
            )}

            {results.length === 0 && !showCreate && (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                Type to search or create a task
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 border-t px-3 py-1.5 text-[10px] text-muted-foreground">
          <span>↑↓ navigate</span>
          <span>⏎ select</span>
          {showCreate && mode === 'search' && <span>Tab create</span>}
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}
