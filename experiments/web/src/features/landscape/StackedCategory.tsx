import { useState, type KeyboardEvent } from 'react'
import type { Task, TaskStatus } from '@/core/domain'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { TaskCard } from './TaskCard'

interface StackedCategoryProps {
  categoryName: string
  categoryColor: string
  tasks: Task[]
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onTouch: (taskId: string) => void
  onSelectTask: (taskId: string) => void
  onCreateTask: (title: string, category: string) => void
}

export function StackedCategory({
  categoryName,
  categoryColor,
  tasks,
  onStatusChange,
  onTouch,
  onSelectTask,
  onCreateTask,
}: StackedCategoryProps) {
  const [newTitle, setNewTitle] = useState('')

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && newTitle.trim()) {
      onCreateTask(newTitle.trim(), categoryName)
      setNewTitle('')
    }
    if (e.key === 'Escape') {
      setNewTitle('')
      ;(e.target as HTMLInputElement).blur()
    }
  }

  return (
    <div>
      {/* Section header */}
      <div
        className="rounded-t-sm px-4 py-2 flex items-center justify-between"
        style={{ backgroundColor: `${categoryColor}20` }}
      >
        <span className="font-semibold text-sm" style={{ color: categoryColor }}>
          {categoryName}
        </span>
        <Badge variant="secondary" className="text-[10px] h-5">
          {tasks.length}
        </Badge>
      </div>

      {/* Tasks grid */}
      <div className="border-x border-border p-3">
        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
                onTouch={onTouch}
                onSelect={onSelectTask}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">
            No tasks
          </p>
        )}
      </div>

      {/* Quick create */}
      <div className="px-3 py-2 border border-t-0 border-border rounded-b-sm">
        <Input
          placeholder="+ New task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-8 text-sm"
        />
      </div>
    </div>
  )
}
