import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { taskRepository } from '@/infrastructure'
import type { NewTask, Task, TaskUpdate } from '@/core/domain'
import { taskKeys } from './query-keys'

// --- Queries ---

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: () => taskRepository.getAll(),
  })
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: taskKeys.detail(id!),
    queryFn: () => taskRepository.getById(id!),
    enabled: !!id,
  })
}

export function useTasksByCategory(category: string) {
  return useQuery({
    queryKey: taskKeys.list({ category }),
    queryFn: () => taskRepository.getByCategory(category),
  })
}

// --- Mutations ---

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newTask: NewTask) => taskRepository.create(newTask),
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
    mutationFn: ({ id, changes }: { id: string; changes: TaskUpdate }) =>
      taskRepository.update(id, changes),
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
    mutationFn: (id: string) => taskRepository.delete(id),
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
    mutationFn: (id: string) => taskRepository.touch(id),
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
