import React, { useState, useEffect, useContext } from 'react'
import { Box, Text, useInput, useStdin } from 'ink'
import { TaskDetail } from '../components/task/TaskDetail.js'
import { TaskForm } from '../components/task/TaskForm.js'
import { colors } from '../theme/colors.js'
import { useTasks } from '../hooks/use-tasks.js'
import { AppStateContext, RepoContext } from '../app.js'
import type { Task } from '#core/domain/task.js'

export function TaskDetailView() {
  const { state, setState } = useContext(AppStateContext)
  const repo = useContext(RepoContext)
  const { setStatus, touchTask, deleteTask } = useTasks()
  const [task, setTask] = useState<Task | null>(null)
  const [editing, setEditing] = useState(false)
  const { isRawModeSupported } = useStdin()

  useEffect(() => {
    if (state.selectedTaskId) {
      repo.getById(state.selectedTaskId).then(setTask)
    }
  }, [state.selectedTaskId, repo])

  const goBack = () => setState((s) => ({ ...s, view: 'dashboard' }))

  if (!task) {
    return <Text>{colors.muted('Task not found')}</Text>
  }

  if (editing) {
    return (
      <TaskForm
        initialTitle={task.title}
        initialCategory={task.category}
        initialDescription={task.description ?? ''}
        onSubmit={async (title, category, description) => {
          await repo.update(task.id, { title, category, description: description || null })
          const tasks = await repo.getAll()
          setState((s) => ({ ...s, tasks, view: 'dashboard' }))
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <Box flexDirection="column">
      <TaskDetail task={task} />
      <Box paddingLeft={2} marginTop={1} gap={2}>
        <Text>{colors.accent('e')}{colors.dim(':edit')}</Text>
        <Text>{colors.accent('s')}{colors.dim(':start')}</Text>
        <Text>{colors.accent('p')}{colors.dim(':pause')}</Text>
        <Text>{colors.accent('c')}{colors.dim(':done')}</Text>
        <Text>{colors.accent('t')}{colors.dim(':touch')}</Text>
        <Text>{colors.accent('d')}{colors.dim(':del')}</Text>
        <Text>{colors.accent('Esc')}{colors.dim(':back')}</Text>
      </Box>
      {isRawModeSupported && (
        <DetailKeyHandler
          taskId={task.id}
          onEdit={() => setEditing(true)}
          onBack={goBack}
          setStatus={setStatus}
          touchTask={touchTask}
          deleteTask={deleteTask}
          setState={setState}
        />
      )}
    </Box>
  )
}

function DetailKeyHandler({
  taskId,
  onEdit,
  onBack,
  setStatus,
  touchTask,
  deleteTask,
  setState,
}: {
  taskId: string
  onEdit: () => void
  onBack: () => void
  setStatus: (id: string, status: 'in_progress' | 'paused' | 'completed') => Promise<void>
  touchTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setState: React.Dispatch<React.SetStateAction<import('../app.js').AppState>>
}) {
  useInput((input, key) => {
    if (key.escape) {
      onBack()
      return
    }
    if (input === 'e') {
      onEdit()
      return
    }
    if (input === 's') {
      setStatus(taskId, 'in_progress')
      onBack()
      return
    }
    if (input === 'p') {
      setStatus(taskId, 'paused')
      onBack()
      return
    }
    if (input === 'c') {
      setStatus(taskId, 'completed')
      onBack()
      return
    }
    if (input === 't') {
      touchTask(taskId)
      onBack()
      return
    }
    if (input === 'd') {
      deleteTask(taskId).then(() => {
        setState((s) => ({ ...s, view: 'dashboard' }))
      })
    }
  })

  return null
}
