import { memo, useRef, useEffect } from 'react'
import { type NodeProps, type Node } from '@xyflow/react'
import gsap from 'gsap'

export type CategoryGroupData = {
  label: string
  color: string
  taskCount: number
}

export type CategoryGroupType = Node<CategoryGroupData, 'categoryGroup'>

export const CategoryGroup = memo(function CategoryGroup({
  data,
}: NodeProps<CategoryGroupType>) {
  const ref = useRef<HTMLDivElement>(null)
  const hasAppeared = useRef(false)

  useEffect(() => {
    if (ref.current && !hasAppeared.current) {
      hasAppeared.current = true
      gsap.from(ref.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      })
    }
  }, [])

  return (
    <div
      ref={ref}
      className="h-full w-full rounded-xl border-2 border-dashed p-4 pt-8"
      style={{
        borderColor: `${data.color}30`,
        background: `${data.color}05`,
      }}
    >
      <div className="absolute left-4 top-2 flex items-center gap-2">
        <span
          className="text-xs font-semibold tracking-tight"
          style={{ color: data.color }}
        >
          {data.label}
        </span>
        <span
          className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-medium"
          style={{
            backgroundColor: `${data.color}20`,
            color: data.color,
          }}
        >
          {data.taskCount}
        </span>
      </div>
    </div>
  )
})
