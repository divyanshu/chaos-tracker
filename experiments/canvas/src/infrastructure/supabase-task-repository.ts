import type { Task, NewTask, TaskUpdate } from '#core/domain/task'
import type { TaskRepository } from '#core/repositories/task-repository'
import { supabase } from './supabase'

export class SupabaseTaskRepository implements TaskRepository {
  async getAll(): Promise<Task[]> {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Task[]
  }

  async getById(id: string): Promise<Task | null> {
    if (!supabase) throw new Error('Supabase not configured')
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
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Task[]
  }

  async create(task: NewTask): Promise<Task> {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single()

    if (error) throw error
    return data as Task
  }

  async update(id: string, changes: TaskUpdate): Promise<Task> {
    if (!supabase) throw new Error('Supabase not configured')
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
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) throw error
  }

  async touch(id: string): Promise<Task> {
    if (!supabase) throw new Error('Supabase not configured')
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

export const taskRepository = new SupabaseTaskRepository()
