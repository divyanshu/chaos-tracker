import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTask, useUpdateTask, useTouchTask, useDeleteTask } from '@/hooks/use-tasks'
import { DEFAULT_CATEGORIES } from '@/core/domain'
import type { TaskStatus } from '@/core/domain'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { neglectLevel, relativeTime } from '@/lib/neglect'
import {
  STATUS_DISPLAY,
  availableActions,
  nextStatus,
  ACTION_LABELS,
} from '@/lib/task-status'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Hand,
  Play,
  Pause,
  CheckCircle2,
} from 'lucide-react'

const ALL_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'paused', 'completed']

const ACTION_ICONS: Record<string, typeof Play> = {
  start: Play,
  resume: Play,
  pause: Pause,
  complete: CheckCircle2,
}

function TaskDetailView() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const { data: task, isLoading, error } = useTask(taskId)
  const updateTask = useUpdateTask()
  const touchTask = useTouchTask()
  const deleteTask = useDeleteTask()

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Edit form state
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editStatus, setEditStatus] = useState<TaskStatus>('pending')

  function startEditing() {
    if (!task) return
    setEditTitle(task.title)
    setEditDescription(task.description ?? '')
    setEditCategory(task.category)
    setEditStatus(task.status)
    setIsEditing(true)
  }

  function handleSave() {
    if (!task) return
    updateTask.mutate(
      {
        id: task.id,
        changes: {
          title: editTitle,
          description: editDescription || null,
          category: editCategory,
          status: editStatus,
        },
      },
      { onSuccess: () => setIsEditing(false) },
    )
  }

  function handleDelete() {
    if (!task) return
    deleteTask.mutate(task.id, {
      onSuccess: () => navigate('/'),
    })
  }

  function handleStatusAction(action: string) {
    if (!task) return
    updateTask.mutate({
      id: task.id,
      changes: { status: nextStatus(action as 'start' | 'pause' | 'resume' | 'complete') },
    })
  }

  function handleTouch() {
    if (!task) return
    touchTask.mutate(task.id)
  }

  if (isLoading) {
    return (
      <div className="p-8 text-muted-foreground">Loading task...</div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-destructive">
        Failed to load task: {error.message}
      </div>
    )
  }

  if (!task) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground mb-4">Task not found.</p>
        <Link to="/">
          <Button variant="outline">Back to Landscape</Button>
        </Link>
      </div>
    )
  }

  const neglect = neglectLevel(task.last_touched)
  const display = STATUS_DISPLAY[task.status]
  const actions = availableActions(task.status)
  const categoryDef = DEFAULT_CATEGORIES.find((c) => c.name === task.category)

  if (isEditing) {
    return (
      <div className="p-8 max-w-2xl">
        <button
          onClick={() => setIsEditing(false)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel editing
        </button>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Add a description..."
              className="mt-1.5"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={editStatus} onValueChange={(v) => setEditStatus(v as TaskStatus)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_DISPLAY[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={!editTitle.trim()}>
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link
        to="/"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Landscape
      </Link>

      {/* Title + status */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">{task.title}</h1>
        <Badge className={cn('shrink-0 text-xs border-0', display.className)}>
          {display.label}
        </Badge>
      </div>

      {/* Category */}
      {categoryDef && (
        <div className="flex items-center gap-2 mb-4">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: categoryDef.color }}
          />
          <span className="text-sm text-muted-foreground">{task.category}</span>
        </div>
      )}

      {/* Description */}
      {task.description && (
        <p className="text-muted-foreground mb-6">{task.description}</p>
      )}

      {/* Neglect indicator */}
      {neglect !== 'none' && (
        <div className={cn(
          'text-sm mb-6 px-3 py-2 rounded-md',
          neglect === 'warning' && 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
          neglect === 'critical' && 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
        )}>
          {neglect === 'critical' ? 'Critically neglected' : 'Getting neglected'} — last touched {relativeTime(task.last_touched)}
        </div>
      )}

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-3 text-sm mb-6 p-4 rounded-lg bg-muted/50">
        <div>
          <span className="text-muted-foreground">Last touched</span>
          <p className="font-medium">{relativeTime(task.last_touched)}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Created</span>
          <p className="font-medium">{relativeTime(task.created_at)}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Updated</span>
          <p className="font-medium">{relativeTime(task.updated_at)}</p>
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2 flex-wrap">
        {actions.map((action) => {
          const Icon = ACTION_ICONS[action]
          return (
            <Button
              key={action}
              variant="outline"
              size="sm"
              onClick={() => handleStatusAction(action)}
            >
              <Icon className="h-4 w-4 mr-1.5" />
              {ACTION_LABELS[action]}
            </Button>
          )
        })}
        <Button variant="outline" size="sm" onClick={handleTouch}>
          <Hand className="h-4 w-4 mr-1.5" />
          Touch
        </Button>
        <Button variant="outline" size="sm" onClick={startEditing}>
          <Pencil className="h-4 w-4 mr-1.5" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete
        </Button>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
            <DialogDescription>
              This will permanently delete &ldquo;{task.title}&rdquo;. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TaskDetailView
