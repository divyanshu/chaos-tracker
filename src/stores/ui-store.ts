import { create } from 'zustand'
import type { TaskStatus } from '@/core/domain'

type Theme = 'light' | 'dark'
type LayoutMode = 'kanban' | 'stacked'

interface UIState {
  theme: Theme
  toggleTheme: () => void

  layoutMode: LayoutMode
  toggleLayoutMode: () => void

  filterCategories: string[]
  filterStatuses: TaskStatus[]
  toggleFilterCategory: (category: string) => void
  toggleFilterStatus: (status: TaskStatus) => void
  clearFilters: () => void

  selectedTaskId: string | null
  selectTask: (id: string | null) => void
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function getInitialLayoutMode(): LayoutMode {
  if (typeof window === 'undefined') return 'kanban'
  const stored = localStorage.getItem('chaos-layout')
  return stored === 'stacked' ? 'stacked' : 'kanban'
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('chaos-theme', theme)
}

export const useUIStore = create<UIState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      return { theme: next }
    }),

  layoutMode: getInitialLayoutMode(),
  toggleLayoutMode: () =>
    set((state) => {
      const next: LayoutMode = state.layoutMode === 'kanban' ? 'stacked' : 'kanban'
      localStorage.setItem('chaos-layout', next)
      return { layoutMode: next }
    }),

  filterCategories: [],
  filterStatuses: [],
  toggleFilterCategory: (category) =>
    set((state) => ({
      filterCategories: state.filterCategories.includes(category)
        ? state.filterCategories.filter((c) => c !== category)
        : [...state.filterCategories, category],
    })),
  toggleFilterStatus: (status) =>
    set((state) => ({
      filterStatuses: state.filterStatuses.includes(status)
        ? state.filterStatuses.filter((s) => s !== status)
        : [...state.filterStatuses, status],
    })),
  clearFilters: () => set({ filterCategories: [], filterStatuses: [] }),

  selectedTaskId: null,
  selectTask: (id) => set({ selectedTaskId: id }),
}))
