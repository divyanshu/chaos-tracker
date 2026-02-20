export type TaskStatus = 'pending' | 'in_progress' | 'paused' | 'completed'

export type Task = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  category: string
  last_touched: string
  created_at: string
  updated_at: string
}

export type NewTask = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'last_touched'>

export type TaskUpdate = Partial<Omit<Task, 'id' | 'created_at'>>
