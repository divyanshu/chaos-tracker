import { useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTasksByCategory, useCreateTask, useUpdateTask, useTouchTask } from '@/hooks/use-tasks'
import type { TaskStatus } from '@/core/domain'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { neglectLevel, relativeTime } from '@/lib/neglect'
import { STATUS_DISPLAY, availableActions, nextStatus, ACTION_LABELS } from '@/lib/task-status'
import { ArrowLeft, Play, Pause, CheckCircle2, Hand } from 'lucide-react'

const ACTION_ICONS: Record<string, typeof Play> = {
  start: Play,
  resume: Play,
  pause: Pause,
  complete: CheckCircle2,
}

function RejuvenationView() {
  const { data: tasks, isLoading, error } = useTasksByCategory('Rejuvenate')
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const touchTask = useTouchTask()
  const [newTitle, setNewTitle] = useState('')

  function handleCreate() {
    if (!newTitle.trim()) return
    createTask.mutate({
      title: newTitle.trim(),
      category: 'Rejuvenate',
      status: 'pending',
      description: null,
    })
    setNewTitle('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleCreate()
  }

  function handleStatusChange(taskId: string, status: TaskStatus) {
    updateTask.mutate({ id: taskId, changes: { status } })
  }

  function handleTouch(taskId: string) {
    touchTask.mutate(taskId)
  }

  if (isLoading) {
    return (
      <div className="p-8 text-muted-foreground">Loading...</div>
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

  return (
    <div className="p-8 max-w-2xl">
      <Link
        to="/"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Landscape
      </Link>

      <h1 className="text-2xl font-bold mb-1">Rejuvenation</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Track activities that recharge you. {allTasks.length} logged.
      </p>

      {/* Quick add */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add a rejuvenation activity..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={handleCreate} disabled={!newTitle.trim()}>
          Add
        </Button>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {allTasks.map((task) => {
          const neglect = neglectLevel(task.last_touched)
          const display = STATUS_DISPLAY[task.status]
          const actions = availableActions(task.status)

          return (
            <div
              key={task.id}
              className={cn(
                'rounded-lg border bg-card p-3',
                neglect === 'warning' && 'border-l-2 border-l-amber-400',
                neglect === 'critical' && 'border-l-2 border-l-red-500',
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <Link
                  to={`/tasks/${task.id}`}
                  className="font-medium text-sm hover:underline"
                >
                  {task.title}
                </Link>
                <Badge className={cn('shrink-0 text-[10px] border-0', display.className)}>
                  {display.label}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 mt-2">
                {actions.map((action) => {
                  const Icon = ACTION_ICONS[action]
                  return (
                    <Button
                      key={action}
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => handleStatusChange(task.id, nextStatus(action))}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {ACTION_LABELS[action]}
                    </Button>
                  )
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => handleTouch(task.id)}
                >
                  <Hand className="h-3 w-3 mr-1" />
                  Touch
                </Button>
                <span className="text-xs text-muted-foreground ml-auto">
                  {relativeTime(task.last_touched)}
                </span>
              </div>
            </div>
          )
        })}

        {allTasks.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">
            No rejuvenation activities yet. Add one above.
          </p>
        )}
      </div>
    </div>
  )
}

export default RejuvenationView
