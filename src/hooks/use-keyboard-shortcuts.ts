import { useEffect } from 'react'
import type { Task, TaskStatus } from '@/core/domain'
import { toggleStatus } from '@/lib/task-status'

interface UseKeyboardShortcutsOptions {
  onToggleStatus: (taskId: string, status: TaskStatus) => void
  onTouchTask: (taskId: string) => void
  tasks: Task[]
}

export function useKeyboardShortcuts({
  onToggleStatus,
  onTouchTask,
  tasks,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const tag = target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const taskId = document.activeElement?.getAttribute('data-task-id')
      if (!taskId) return

      const task = tasks.find((t) => t.id === taskId)
      if (!task) return

      if (e.key === ' ') {
        e.preventDefault()
        onToggleStatus(taskId, toggleStatus(task.status))
      } else if (e.key === 't') {
        e.preventDefault()
        onTouchTask(taskId)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onToggleStatus, onTouchTask, tasks])
}
