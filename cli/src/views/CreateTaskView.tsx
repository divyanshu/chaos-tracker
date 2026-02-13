import React, { useContext } from 'react'
import { TaskForm } from '../components/task/TaskForm.js'
import { useTasks } from '../hooks/use-tasks.js'
import { AppStateContext } from '../app.js'

export function CreateTaskView() {
  const { setState } = useContext(AppStateContext)
  const { createTask } = useTasks()

  return (
    <TaskForm
      onSubmit={async (title, category, description) => {
        await createTask(title, category, description || undefined)
        setState((s) => ({ ...s, view: 'dashboard' }))
      }}
      onCancel={() => setState((s) => ({ ...s, view: 'dashboard' }))}
    />
  )
}
