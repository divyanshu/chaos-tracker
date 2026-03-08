export type CanvasState = {
  positions: Record<string, { x: number; y: number }>
  groupPositions: Record<string, { x: number; y: number; width: number; height: number }>
  viewport: { x: number; y: number; zoom: number }
}

const STORAGE_KEY = 'chaos-canvas-state'

export function loadCanvasState(): CanvasState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CanvasState
  } catch {
    return null
  }
}

export function saveCanvasState(state: CanvasState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export function saveNodePosition(id: string, position: { x: number; y: number }): void {
  const state = loadCanvasState() ?? {
    positions: {},
    groupPositions: {},
    viewport: { x: 0, y: 0, zoom: 1 },
  }
  state.positions[id] = position
  saveCanvasState(state)
}

export function saveViewport(viewport: { x: number; y: number; zoom: number }): void {
  const state = loadCanvasState() ?? {
    positions: {},
    groupPositions: {},
    viewport: { x: 0, y: 0, zoom: 1 },
  }
  state.viewport = viewport
  saveCanvasState(state)
}

export function removeNodePosition(id: string): void {
  const state = loadCanvasState()
  if (!state) return
  delete state.positions[id]
  saveCanvasState(state)
}
