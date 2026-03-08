import { memo, useRef, useEffect } from 'react'
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import gsap from 'gsap'
import type { TaskStatus } from '#core/domain/task'
import { cn } from '@/lib/utils'
import { STATUS_DISPLAY } from '@/lib/task-status'
import { neglectLevel, relativeTime } from '@/lib/neglect'

export type TaskNodeData = {
  title: string
  status: TaskStatus
  category: string
  categoryColor: string
  lastTouched: string
}

export type TaskNodeType = Node<TaskNodeData, 'task'>

function NeglectDot({ lastTouched, status }: { lastTouched: string; status: TaskStatus }) {
  if (status === 'completed') return null
  const level = neglectLevel(lastTouched)
  if (level === 'none') return null
  return (
    <span
      className={cn(
        'absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-card',
        level === 'warning' && 'bg-amber-400',
        level === 'critical' && 'bg-red-400',
      )}
    />
  )
}

export const TaskNode = memo(function TaskNode({ data, selected }: NodeProps<TaskNodeType>) {
  const isCompleted = data.status === 'completed'
  const statusInfo = STATUS_DISPLAY[data.status]
  const cardRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const hasAppeared = useRef(false)

  // Appear animation
  useEffect(() => {
    if (cardRef.current && !hasAppeared.current) {
      hasAppeared.current = true
      gsap.from(cardRef.current, {
        scale: 0.85,
        opacity: 0,
        duration: 0.35,
        ease: 'back.out(1.7)',
      })
    }
  }, [])

  // Selection ring animation
  useEffect(() => {
    if (!cardRef.current) return
    if (selected) {
      gsap.to(cardRef.current, {
        boxShadow: '0 0 0 2px hsl(var(--ring))',
        scale: 1.02,
        duration: 0.15,
        ease: 'power2.out',
      })
    } else {
      gsap.to(cardRef.current, {
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        scale: 1,
        duration: 0.15,
        ease: 'power2.out',
      })
    }
  }, [selected])

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative w-[220px] rounded-lg border bg-card px-3 py-2.5 shadow-sm transition-colors duration-150',
        'hover:shadow-md',
        isCompleted && 'opacity-50',
      )}
    >
      <Handle type="target" position={Position.Left} className="!invisible" />
      <Handle type="source" position={Position.Right} className="!invisible" />

      <NeglectDot lastTouched={data.lastTouched} status={data.status} />

      {/* Title row */}
      <div className="flex items-start gap-2">
        <span
          ref={dotRef}
          className={cn(
            'mt-1 h-2 w-2 flex-shrink-0 rounded-full transition-colors duration-300',
            statusInfo.dot,
          )}
        />
        <span
          className={cn(
            'text-sm font-medium leading-snug tracking-tight',
            isCompleted && 'line-through text-muted-foreground',
          )}
        >
          {data.title}
        </span>
      </div>

      {/* Meta row */}
      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span
          className="inline-flex items-center rounded-sm px-1.5 py-0.5 font-medium"
          style={{
            backgroundColor: `${data.categoryColor}20`,
            color: data.categoryColor,
          }}
        >
          {data.category}
        </span>
        <span className="text-muted-foreground/60">·</span>
        <span>{relativeTime(data.lastTouched)}</span>
      </div>
    </div>
  )
})
