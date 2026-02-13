import { useState, type KeyboardEvent } from 'react'
import type { Task, TaskStatus } from '@/core/domain'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { TaskCard } from './TaskCard'

interface CategoryColumnProps {
  categoryName: string
  categoryColor: string
  tasks: Task[]
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onTouch: (taskId: string) => void
  onSelectTask: (taskId: string) => void
  onCreateTask: (title: string, category: string) => void
}

export function CategoryColumn({
  categoryName,
  categoryColor,
  tasks,
  onStatusChange,
  onTouch,
  onSelectTask,
  onCreateTask,
}: CategoryColumnProps) {
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
    <div className="w-72 shrink-0 flex flex-col h-full">
      {/* Column header */}
      <div
        className="rounded-t-lg px-3 py-2 flex items-center justify-between"
        style={{ backgroundColor: `${categoryColor}20` }}
      >
        <span className="font-semibold text-sm" style={{ color: categoryColor }}>
          {categoryName}
        </span>
        <Badge variant="secondary" className="text-[10px] h-5">
          {tasks.length}
        </Badge>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto space-y-2 p-2 border-x border-border">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onTouch={onTouch}
            onSelect={onSelectTask}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No tasks
          </p>
        )}
      </div>

      {/* Quick create */}
      <div className="p-2 border border-t-0 border-border rounded-b-lg">
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
