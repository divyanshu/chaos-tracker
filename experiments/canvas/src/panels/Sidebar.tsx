import { useMemo, useState } from 'react'
import { useReactFlow } from '@xyflow/react'
import { useUIStore } from '@/stores/ui-store'
import { useTasks } from '@/hooks/use-tasks'
import { DEFAULT_CATEGORIES, COMPLETED_CATEGORY_NAME, TOP_OF_MIND_CATEGORY_NAME } from '#core/domain/category'
import type { Task } from '#core/domain/task'
import { cn } from '@/lib/utils'
import { STATUS_DISPLAY } from '@/lib/task-status'
import { relativeTime } from '@/lib/neglect'
import { CATEGORY_COLORS } from '@/lib/theme'

const TOP_OF_MIND_HOURS = 4

function isTopOfMind(task: Task): boolean {
  if (task.status === 'completed') return false
  const hours = (Date.now() - new Date(task.last_touched).getTime()) / (1000 * 60 * 60)
  return hours < TOP_OF_MIND_HOURS
}

export function Sidebar() {
  const { data: tasks } = useTasks()
  const { selectedNodeId, selectNode } = useUIStore()
  const { setCenter } = useReactFlow()
  const [completedOpen, setCompletedOpen] = useState(false)

  const grouped = useMemo(() => {
    if (!tasks) return { topOfMind: [], categories: [], completed: [] }

    const topOfMind = tasks.filter(isTopOfMind)
      .sort((a, b) => new Date(b.last_touched).getTime() - new Date(a.last_touched).getTime())

    const completed = tasks.filter((t) => t.status === 'completed')
    const active = tasks.filter((t) => t.status !== 'completed' && !isTopOfMind(t))

    const categoryOrder = DEFAULT_CATEGORIES.map((c) => c.name)
    const categories: { name: string; color: string; tasks: Task[] }[] = []

    for (const catName of categoryOrder) {
      const catTasks = active.filter((t) => t.category === catName)
      if (catTasks.length > 0) {
        categories.push({
          name: catName,
          color: CATEGORY_COLORS[catName] ?? '#888',
          tasks: catTasks,
        })
      }
    }

    // Uncategorized tasks
    const knownCategories = new Set(categoryOrder)
    const uncategorized = active.filter((t) => !knownCategories.has(t.category))
    if (uncategorized.length > 0) {
      categories.push({ name: 'Other', color: '#888', tasks: uncategorized })
    }

    return { topOfMind, categories, completed }
  }, [tasks])

  function handleTaskClick(taskId: string) {
    selectNode(taskId)
    // Pan canvas to the selected node
    const flow = document.querySelector('.react-flow')
    if (flow) {
      setCenter(0, 0, { duration: 0 }) // trigger a re-render, then we'll pan properly
    }
  }

  function TaskItem({ task }: { task: Task }) {
    const isSelected = task.id === selectedNodeId
    const isCompleted = task.status === 'completed'
    const statusInfo = STATUS_DISPLAY[task.status]

    return (
      <button
        onClick={() => handleTaskClick(task.id)}
        className={cn(
          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors text-left',
          isSelected ? 'bg-accent' : 'hover:bg-accent/50',
          isCompleted && 'opacity-50',
        )}
      >
        <span className={cn('h-2 w-2 rounded-full flex-shrink-0', statusInfo.dot)} />
        <span className={cn('flex-1 truncate', isCompleted && 'line-through')}>
          {task.title}
        </span>
        <span className="text-[10px] text-muted-foreground flex-shrink-0">
          {relativeTime(task.last_touched)}
        </span>
      </button>
    )
  }

  return (
    <div className="flex h-full flex-col border-l">
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-xs font-semibold tracking-tight">Tasks</span>
        <span className="text-[10px] text-muted-foreground">{tasks?.length ?? 0} total</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {/* Top of Mind */}
        {grouped.topOfMind.length > 0 && (
          <div>
            <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {TOP_OF_MIND_CATEGORY_NAME}
            </div>
            {grouped.topOfMind.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}

        {/* Categories */}
        {grouped.categories.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center gap-1.5 px-2 py-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: cat.color }}>
                {cat.name}
              </span>
              <span className="text-[10px] text-muted-foreground">({cat.tasks.length})</span>
            </div>
            {cat.tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ))}

        {/* Completed */}
        {grouped.completed.length > 0 && (
          <div>
            <button
              onClick={() => setCompletedOpen(!completedOpen)}
              className="flex w-full items-center gap-1.5 px-2 py-1 text-left"
            >
              <span className="text-[10px] text-muted-foreground">
                {completedOpen ? '▾' : '▸'}
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {COMPLETED_CATEGORY_NAME}
              </span>
              <span className="text-[10px] text-muted-foreground">
                ({grouped.completed.length})
              </span>
            </button>
            {completedOpen && grouped.completed.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 border-t px-3 py-1.5 text-[10px] text-muted-foreground">
        <span><kbd className="font-mono">/</kbd> entry</span>
        <span><kbd className="font-mono">:</kbd> cmd</span>
        <span><kbd className="font-mono">?</kbd> help</span>
      </div>
    </div>
  )
}
