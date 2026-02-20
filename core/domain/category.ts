export type Category = {
  id: string
  name: string
  color: string
  order: number
}

export const COMPLETED_CATEGORY_NAME = 'Completed'
export const TOP_OF_MIND_CATEGORY_NAME = 'Top of Mind'

export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Work', color: '#7a8fa6', order: 0 },
  { name: 'Personal', color: '#a0b89c', order: 1 },
  { name: 'Chores', color: '#b8a99a', order: 2 },
  { name: 'Connection', color: '#c4a0a0', order: 3 },
  { name: 'Hobby', color: '#9a8db8', order: 4 },
  { name: 'Rejuvenate', color: '#8aada6', order: 5 },
]
