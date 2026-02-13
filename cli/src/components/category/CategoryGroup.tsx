import React from 'react'
import type { Task } from '../../../../src/core/domain/task.js'
import { Panel } from '../layout/Panel.js'
import { TaskRow } from '../task/TaskRow.js'

type CategoryGroupProps = {
  category: string
  tasks: Task[]
  selectedTaskId: string | null
}

export function CategoryGroup({ category, tasks, selectedTaskId }: CategoryGroupProps) {
  if (tasks.length === 0) return null

  return (
    <Panel title={category} count={tasks.length}>
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} isSelected={task.id === selectedTaskId} />
      ))}
    </Panel>
  )
}
