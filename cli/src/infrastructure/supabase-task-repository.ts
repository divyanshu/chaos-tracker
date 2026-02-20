import type { Task, NewTask, TaskUpdate } from '#core/domain/task.js'
import type { TaskRepository } from '#core/repositories/task-repository.js'
import { supabase } from './supabase.js'

export class SupabaseTaskRepository implements TaskRepository {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Task[]
  }

  async getById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data as Task
  }

  async getByCategory(category: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Task[]
  }

  async create(task: NewTask): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single()

    if (error) throw error
    return data as Task
  }

  async update(id: string, changes: TaskUpdate): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...changes, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Task
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) throw error
  }

  async touch(id: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        last_touched: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Task
  }
}
