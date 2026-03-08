import { create } from 'zustand'

type Theme = 'light' | 'dark'
type LayoutMode = 'canvas' | 'split'

interface UIState {
  theme: Theme
  toggleTheme: () => void

  layoutMode: LayoutMode
  toggleLayoutMode: () => void

  selectedNodeId: string | null
  selectNode: (id: string | null) => void

  quickEntryOpen: boolean
  setQuickEntryOpen: (open: boolean) => void

  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void

  taskDetailId: string | null
  openTaskDetail: (id: string) => void
  closeTaskDetail: () => void

  helpOpen: boolean
  setHelpOpen: (open: boolean) => void
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function getInitialLayoutMode(): LayoutMode {
  if (typeof window === 'undefined') return 'canvas'
  const stored = localStorage.getItem('chaos-canvas-layout')
  return stored === 'split' ? 'split' : 'canvas'
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
      const next: LayoutMode = state.layoutMode === 'canvas' ? 'split' : 'canvas'
      localStorage.setItem('chaos-canvas-layout', next)
      return { layoutMode: next }
    }),

  selectedNodeId: null,
  selectNode: (id) => set({ selectedNodeId: id }),

  quickEntryOpen: false,
  setQuickEntryOpen: (open) => set({ quickEntryOpen: open }),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  taskDetailId: null,
  openTaskDetail: (id) => set({ taskDetailId: id }),
  closeTaskDetail: () => set({ taskDetailId: null }),

  helpOpen: false,
  setHelpOpen: (open) => set({ helpOpen: open }),
}))
