import { useNavigate } from 'react-router-dom'
import { useTasks, useCreateTask, useUpdateTask, useTouchTask } from '@/hooks/use-tasks'
import { useUIStore } from '@/stores/ui-store'
import { DEFAULT_CATEGORIES } from '@/core/domain'
import type { Task, TaskStatus } from '@/core/domain'
import { FilterBar } from './FilterBar'
import { CategoryColumn } from './CategoryColumn'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

function LandscapeView() {
  const navigate = useNavigate()
  const { data: tasks, isLoading, error } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const touchTask = useTouchTask()

  const filterCategories = useUIStore((s) => s.filterCategories)
  const filterStatuses = useUIStore((s) => s.filterStatuses)

  function handleStatusChange(taskId: string, status: TaskStatus) {
    updateTask.mutate({ id: taskId, changes: { status } })
  }

  function handleTouch(taskId: string) {
    touchTask.mutate(taskId)
  }

  function handleSelect(taskId: string) {
    navigate(`/tasks/${taskId}`)
  }

  function handleCreate(title: string, category: string) {
    createTask.mutate({
      title,
      category,
      status: 'pending',
      description: null,
    })
  }

  useKeyboardShortcuts({
    onToggleStatus: handleStatusChange,
    onTouchTask: handleTouch,
    tasks: tasks ?? [],
  })

  if (isLoading) {
    return (
      <div className="p-8 text-muted-foreground">Loading tasks...</div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-destructive">
        Failed to load tasks: {error.message}
      </div>
    )
  }

  const allTasks = tasks ?? []

  // Filter tasks
  const filtered = allTasks.filter((task) => {
    if (filterCategories.length > 0 && !filterCategories.includes(task.category)) {
      return false
    }
    if (filterStatuses.length > 0 && !filterStatuses.includes(task.status)) {
      return false
    }
    return true
  })

  // Group by category in DEFAULT_CATEGORIES order
  const tasksByCategory = new Map<string, Task[]>()
  for (const cat of DEFAULT_CATEGORIES) {
    tasksByCategory.set(cat.name, [])
  }
  for (const task of filtered) {
    const existing = tasksByCategory.get(task.category)
    if (existing) {
      existing.push(task)
    } else {
      tasksByCategory.set(task.category, [task])
    }
  }

  // Determine which columns to show
  const visibleCategories = DEFAULT_CATEGORIES.filter((cat) => {
    if (filterCategories.length > 0 && !filterCategories.includes(cat.name)) {
      return false
    }
    return true
  })

  return (
    <div className="flex flex-col h-screen">
      <FilterBar />

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-4 h-full min-w-min">
          {visibleCategories.map((cat) => (
            <CategoryColumn
              key={cat.name}
              categoryName={cat.name}
              categoryColor={cat.color}
              tasks={tasksByCategory.get(cat.name) ?? []}
              onStatusChange={handleStatusChange}
              onTouch={handleTouch}
              onSelectTask={handleSelect}
              onCreateTask={handleCreate}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LandscapeView
