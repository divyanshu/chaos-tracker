import type { Node } from '@xyflow/react'
import type { Task } from '#core/domain/task'
import { DEFAULT_CATEGORIES } from '#core/domain/category'
import type { TaskNodeData } from './TaskNode'
import type { CategoryGroupData } from './CategoryGroup'
import { CATEGORY_COLORS } from '@/lib/theme'
import { loadCanvasState } from './position-store'

const NODE_WIDTH = 220
const NODE_HEIGHT = 72
const NODE_GAP_X = 20
const NODE_GAP_Y = 16
const COLS_PER_GROUP = 2
const GROUP_PADDING_TOP = 44
const GROUP_PADDING = 20
const GROUP_GAP = 80
const GROUPS_PER_ROW = 3

type LayoutResult = {
  nodes: Node[]
}

export function layoutTasks(tasks: Task[]): LayoutResult {
  const savedState = loadCanvasState()
  const savedPositions = savedState?.positions ?? {}

  // Group tasks by category
  const categoryOrder = DEFAULT_CATEGORIES.map((c) => c.name)
  const grouped = new Map<string, Task[]>()
  for (const cat of categoryOrder) {
    grouped.set(cat, [])
  }
  for (const task of tasks) {
    const list = grouped.get(task.category)
    if (list) {
      list.push(task)
    } else {
      // Unknown category — create a group for it
      grouped.set(task.category, [task])
    }
  }

  // Remove empty categories
  for (const [cat, list] of grouped) {
    if (list.length === 0) grouped.delete(cat)
  }

  const nodes: Node[] = []
  let groupIndex = 0

  for (const [category, categoryTasks] of grouped) {
    const color = CATEGORY_COLORS[category] ?? '#888888'
    const rows = Math.ceil(categoryTasks.length / COLS_PER_GROUP)
    const groupContentWidth = COLS_PER_GROUP * NODE_WIDTH + (COLS_PER_GROUP - 1) * NODE_GAP_X
    const groupContentHeight = rows * NODE_HEIGHT + (rows > 0 ? (rows - 1) * NODE_GAP_Y : 0)
    const groupWidth = groupContentWidth + GROUP_PADDING * 2
    const groupHeight = groupContentHeight + GROUP_PADDING_TOP + GROUP_PADDING

    // Position the group in a grid layout
    const col = groupIndex % GROUPS_PER_ROW
    const row = Math.floor(groupIndex / GROUPS_PER_ROW)
    const groupX = col * (groupWidth + GROUP_GAP)
    const groupY = row * (groupHeight + GROUP_GAP)

    const groupId = `group-${category}`

    // Group node
    nodes.push({
      id: groupId,
      type: 'categoryGroup',
      position: savedPositions[groupId]
        ? { x: savedPositions[groupId].x, y: savedPositions[groupId].y }
        : { x: groupX, y: groupY },
      data: {
        label: category,
        color,
        taskCount: categoryTasks.length,
      } satisfies CategoryGroupData,
      style: { width: groupWidth, height: groupHeight },
      draggable: true,
    })

    // Task nodes inside the group
    categoryTasks.forEach((task, i) => {
      const taskCol = i % COLS_PER_GROUP
      const taskRow = Math.floor(i / COLS_PER_GROUP)
      const relX = GROUP_PADDING + taskCol * (NODE_WIDTH + NODE_GAP_X)
      const relY = GROUP_PADDING_TOP + taskRow * (NODE_HEIGHT + NODE_GAP_Y)

      const nodeId = task.id

      nodes.push({
        id: nodeId,
        type: 'task',
        position: savedPositions[nodeId]
          ? { x: savedPositions[nodeId].x, y: savedPositions[nodeId].y }
          : { x: relX, y: relY },
        parentId: savedPositions[nodeId] ? undefined : groupId,
        extent: savedPositions[nodeId] ? undefined : 'parent' as const,
        data: {
          title: task.title,
          status: task.status,
          category: task.category,
          categoryColor: color,
          lastTouched: task.last_touched,
        } satisfies TaskNodeData,
        draggable: true,
      })
    })

    groupIndex++
  }

  return { nodes }
}
