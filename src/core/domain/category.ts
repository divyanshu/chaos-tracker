export type Category = {
  id: string
  name: string
  color: string
  order: number
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Work', color: '#6366f1', order: 0 },
  { name: 'Personal', color: '#22c55e', order: 1 },
  { name: 'Chores', color: '#f59e0b', order: 2 },
  { name: 'Connection', color: '#ec4899', order: 3 },
  { name: 'Hobby', color: '#8b5cf6', order: 4 },
  { name: 'Rejuvenate', color: '#06b6d4', order: 5 },
]
