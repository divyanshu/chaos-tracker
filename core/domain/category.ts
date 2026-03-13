export type Category = {
  id: string
  name: string
  color: string
  order: number
}

export type Tag = {
  name: string
  color: string
}

export const COMPLETED_CATEGORY_NAME = 'Completed'

// Workflow categories — the primary way tasks are organized day-to-day
export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Urgent', color: '#ef4444', order: 0 },
  { name: 'Up Next', color: '#f59e0b', order: 1 },
  { name: 'Admin', color: '#6b7280', order: 2 },
  { name: 'Flow', color: '#8b5cf6', order: 3 },
]

export const DEFAULT_CATEGORY_NAME = 'Up Next'

// Tags — topic labels (formerly "categories"). A task can have multiple tags.
export const DEFAULT_TAGS: Tag[] = [
  { name: 'Work', color: '#7a8fa6' },
  { name: 'Personal', color: '#a0b89c' },
  { name: 'Chores', color: '#b8a99a' },
  { name: 'Connection', color: '#c4a0a0' },
  { name: 'Hobby', color: '#9a8db8' },
  { name: 'Rejuvenate', color: '#8aada6' },
]
