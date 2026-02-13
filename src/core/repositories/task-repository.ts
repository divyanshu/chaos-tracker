import type { Task, NewTask, TaskUpdate } from '../domain'

export interface TaskRepository {
  getAll(): Promise<Task[]>
  getById(id: string): Promise<Task | null>
  getByCategory(category: string): Promise<Task[]>
  create(task: NewTask): Promise<Task>
  update(id: string, changes: TaskUpdate): Promise<Task>
  delete(id: string): Promise<void>
  touch(id: string): Promise<Task>
}
