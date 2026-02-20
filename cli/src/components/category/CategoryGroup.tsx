import React from 'react'
import type { Task } from '#core/domain/task.js'
import { Panel } from '../layout/Panel.js'
import { TaskRow } from '../task/TaskRow.js'

type CategoryGroupProps = {
  category: string
  tasks: Task[]
  selectedTaskId: string | null
  isCollapsed?: boolean
}

export function CategoryGroup({ category, tasks, selectedTaskId, isCollapsed }: CategoryGroupProps) {
  if (tasks.length === 0) return null

  return (
    <Panel title={category} count={tasks.length} isCollapsed={isCollapsed}>
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} isSelected={task.id === selectedTaskId} />
      ))}
    </Panel>
  )
}
