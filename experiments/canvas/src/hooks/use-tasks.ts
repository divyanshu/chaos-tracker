import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { taskRepository } from '@/infrastructure/supabase-task-repository'
import { isSupabaseConfigured } from '@/infrastructure/supabase'
import { MOCK_TASKS } from '@/canvas/mock-tasks'
import type { NewTask, Task, TaskUpdate } from '#core/domain/task'
import { taskKeys } from './query-keys'

// --- Queries ---

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: () => {
      if (!isSupabaseConfigured) return Promise.resolve(MOCK_TASKS)
      return taskRepository.getAll()
    },
  })
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: taskKeys.detail(id!),
    queryFn: () => {
      if (!isSupabaseConfigured) {
        return Promise.resolve(MOCK_TASKS.find((t) => t.id === id) ?? null)
      }
      return taskRepository.getById(id!)
    },
    enabled: !!id,
  })
}

// --- Mutations ---

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newTask: NewTask) => {
      if (!isSupabaseConfigured) {
        const task: Task = {
          ...newTask,
          id: `mock-${Date.now()}`,
          last_touched: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        return Promise.resolve(task)
      }
      return taskRepository.create(newTask)
    },
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() })
      const previous = queryClient.getQueryData<Task[]>(taskKeys.lists())

      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old = []) => [
        {
          ...newTask,
          id: `temp-${Date.now()}`,
          last_touched: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        ...old,
      ])

      return { previous }
    },
    onError: (_err, _newTask, context) => {
      if (context?.previous) {
        queryClient.setQueryData(taskKeys.lists(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: TaskUpdate }) => {
      if (!isSupabaseConfigured) {
        const tasks = queryClient.getQueryData<Task[]>(taskKeys.lists()) ?? []
        const task = tasks.find((t) => t.id === id)
        if (!task) return Promise.reject(new Error('Task not found'))
        return Promise.resolve({ ...task, ...changes, updated_at: new Date().toISOString() })
      }
      return taskRepository.update(id, changes)
    },
    onMutate: async ({ id, changes }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() })
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(id) })

      const previousList = queryClient.getQueryData<Task[]>(taskKeys.lists())
      const previousDetail = queryClient.getQueryData<Task | null>(
        taskKeys.detail(id),
      )

      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old = []) =>
        old.map((t) =>
          t.id === id
            ? { ...t, ...changes, updated_at: new Date().toISOString() }
            : t,
        ),
      )

      queryClient.setQueryData<Task | null>(taskKeys.detail(id), (old) =>
        old
          ? { ...old, ...changes, updated_at: new Date().toISOString() }
          : old,
      )

      return { previousList, previousDetail }
    },
    onError: (_err, { id }, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(taskKeys.lists(), context.previousList)
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(taskKeys.detail(id), context.previousDetail)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSupabaseConfigured) return Promise.resolve()
      return taskRepository.delete(id)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() })
      const previous = queryClient.getQueryData<Task[]>(taskKeys.lists())

      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old = []) =>
        old.filter((t) => t.id !== id),
      )

      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(taskKeys.lists(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export function useTouchTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSupabaseConfigured) {
        const tasks = queryClient.getQueryData<Task[]>(taskKeys.lists()) ?? []
        const task = tasks.find((t) => t.id === id)
        if (!task) return Promise.reject(new Error('Task not found'))
        const now = new Date().toISOString()
        return Promise.resolve({ ...task, last_touched: now, updated_at: now })
      }
      return taskRepository.touch(id)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() })
      const now = new Date().toISOString()
      const previous = queryClient.getQueryData<Task[]>(taskKeys.lists())

      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old = []) =>
        old.map((t) =>
          t.id === id ? { ...t, last_touched: now, updated_at: now } : t,
        ),
      )

      queryClient.setQueryData<Task | null>(taskKeys.detail(id), (old) =>
        old ? { ...old, last_touched: now, updated_at: now } : old,
      )

      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(taskKeys.lists(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}
