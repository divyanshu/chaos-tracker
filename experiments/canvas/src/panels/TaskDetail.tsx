import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { toast } from 'sonner'
import { useUIStore } from '@/stores/ui-store'
import { useTask, useUpdateTask, useDeleteTask, useTouchTask } from '@/hooks/use-tasks'
import { cn } from '@/lib/utils'
import { STATUS_DISPLAY, availableActions, nextStatus, ACTION_LABELS } from '@/lib/task-status'
import { relativeTime } from '@/lib/neglect'
import { CATEGORY_COLORS } from '@/lib/theme'
import { DEFAULT_CATEGORIES } from '#core/domain/category'

export function TaskDetail() {
  const { taskDetailId, closeTaskDetail, selectNode } = useUIStore()
  const { data: task } = useTask(taskDetailId ?? undefined)
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const touchTask = useTouchTask()

  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (task) {
      setEditTitle(task.title)
      setEditDescription(task.description ?? '')
      setEditCategory(task.category)
    }
  }, [task])

  useEffect(() => {
    if (editing) {
      setTimeout(() => titleRef.current?.focus(), 50)
    }
  }, [editing])

  // Slide-in animation
  useEffect(() => {
    if (taskDetailId && panelRef.current) {
      gsap.from(panelRef.current, {
        x: 300,
        opacity: 0,
        duration: 0.35,
        ease: 'power3.out',
      })
    }
  }, [taskDetailId])

  if (!taskDetailId || !task) return null

  const statusInfo = STATUS_DISPLAY[task.status]
  const actions = availableActions(task.status)
  const categoryColor = CATEGORY_COLORS[task.category] ?? '#888'

  function handleSave() {
    const changes: Record<string, string | null> = {}
    if (editTitle !== task!.title) changes.title = editTitle
    if (editDescription !== (task!.description ?? '')) {
      changes.description = editDescription || null
    }
    if (editCategory !== task!.category) changes.category = editCategory

    if (Object.keys(changes).length > 0) {
      updateTask.mutate({ id: task!.id, changes })
      toast.success('Task updated')
    }
    setEditing(false)
  }

  function handleDelete() {
    if (confirm('Delete this task?')) {
      deleteTask.mutate(task!.id)
      toast.success(`Deleted "${task!.title}"`)
      selectNode(null)
      closeTaskDetail()
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" onClick={closeTaskDetail} />
      <div ref={panelRef} className="relative w-full max-w-sm border-l bg-card shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-xs font-medium text-muted-foreground">Task Detail</span>
          <div className="flex items-center gap-1">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={closeTaskDetail}
              className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent transition-colors"
            >
              Esc
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {editing ? (
            <>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Title</label>
                <input
                  ref={titleRef}
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave()
                    if (e.key === 'Escape') setEditing(false)
                  }}
                  className="w-full rounded-md border bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Category</label>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setEditCategory(cat.name)}
                      className={cn(
                        'rounded-md px-2 py-1 text-xs transition-colors',
                        editCategory === cat.name
                          ? 'ring-2 ring-ring'
                          : 'hover:bg-accent',
                      )}
                      style={{
                        backgroundColor: `${cat.color}20`,
                        color: cat.color,
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Status + Title */}
              <div className="flex items-start gap-2">
                <span className={cn('mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0', statusInfo.dot)} />
                <h2 className={cn(
                  'text-base font-semibold tracking-tight leading-snug',
                  task.status === 'completed' && 'line-through text-muted-foreground',
                )}>
                  {task.title}
                </h2>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {task.description}
                </p>
              )}

              {/* Meta */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Status</span>
                  <span className="text-xs font-medium">{statusInfo.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Category</span>
                  <span
                    className="rounded-sm px-1.5 py-0.5 text-xs font-medium"
                    style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                  >
                    {task.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Last touched</span>
                  <span className="text-xs">{relativeTime(task.last_touched)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Created</span>
                  <span className="text-xs">{relativeTime(task.created_at)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-3 space-y-1.5">
                {actions.map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      updateTask.mutate({ id: task.id, changes: { status: nextStatus(action) } })
                      toast.success(`${ACTION_LABELS[action]}ed "${task.title}"`)
                    }}
                    className="flex w-full items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors"
                  >
                    <span>{ACTION_LABELS[action]}</span>
                    <kbd className="ml-auto rounded border bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {action[0]}
                    </kbd>
                  </button>
                ))}
                <button
                  onClick={() => {
                    touchTask.mutate(task.id)
                    toast.success(`Touched "${task.title}"`)
                  }}
                  className="flex w-full items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors"
                >
                  <span>Touch</span>
                  <kbd className="ml-auto rounded border bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                    t
                  </kbd>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <span>Delete</span>
                  <kbd className="ml-auto rounded border bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                    d
                  </kbd>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
