import type { Task, NewTask, TaskUpdate } from '#core/domain/task.js'
import type { TaskRepository } from '#core/repositories/task-repository.js'
import { generateId } from '../utils/id.js'
import { SEED_TASKS } from './seed-data.js'

export class MockTaskRepository implements TaskRepository {
  private tasks: Map<string, Task>

  constructor() {
    this.tasks = new Map(SEED_TASKS.map((t) => [t.id, { ...t }]))
  }

  async getAll(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  async getById(id: string): Promise<Task | null> {
    return this.tasks.get(id) ?? null
  }

  async getByCategory(category: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter((t) => t.category === category)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  async create(task: NewTask): Promise<Task> {
    const now = new Date().toISOString()
    const newTask: Task = {
      ...task,
      id: generateId(),
      last_touched: now,
      created_at: now,
      updated_at: now,
    }
    this.tasks.set(newTask.id, newTask)
    return newTask
  }

  async update(id: string, changes: TaskUpdate): Promise<Task> {
    const existing = this.tasks.get(id)
    if (!existing) throw new Error(`Task ${id} not found`)
    const updated: Task = {
      ...existing,
      ...changes,
      updated_at: new Date().toISOString(),
    }
    this.tasks.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    this.tasks.delete(id)
  }

  async touch(id: string): Promise<Task> {
    const existing = this.tasks.get(id)
    if (!existing) throw new Error(`Task ${id} not found`)
    const now = new Date().toISOString()
    const updated: Task = { ...existing, last_touched: now, updated_at: now }
    this.tasks.set(id, updated)
    return updated
  }
}
