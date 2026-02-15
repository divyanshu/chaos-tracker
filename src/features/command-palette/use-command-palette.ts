import { useReducer } from 'react'
import type { Task } from '@/core/domain'

export type PaletteState =
  | { phase: 'idle' }
  | { phase: 'search'; query: string; highlightIndex: number }
  | { phase: 'action'; task: Task; highlightIndex: number; query: string }
  | { phase: 'create'; title: string; categoryIndex: number }

export type PaletteAction =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'set_query'; query: string }
  | { type: 'set_highlight'; index: number }
  | { type: 'select_task'; task: Task }
  | { type: 'select_create'; title: string }
  | { type: 'back' }
  | { type: 'set_title'; title: string }
  | { type: 'set_category'; index: number }

function reducer(state: PaletteState, action: PaletteAction): PaletteState {
  switch (action.type) {
    case 'open':
      return { phase: 'search', query: '', highlightIndex: 0 }

    case 'close':
      return { phase: 'idle' }

    case 'set_query':
      if (state.phase !== 'search') return state
      return { ...state, query: action.query, highlightIndex: 0 }

    case 'set_highlight':
      if (state.phase === 'search' || state.phase === 'action') {
        return { ...state, highlightIndex: action.index }
      }
      return state

    case 'select_task':
      if (state.phase !== 'search') return state
      return { phase: 'action', task: action.task, highlightIndex: 0, query: state.query }

    case 'select_create':
      return { phase: 'create', title: action.title, categoryIndex: 0 }

    case 'back':
      if (state.phase === 'action') {
        return { phase: 'search', query: state.query, highlightIndex: 0 }
      }
      if (state.phase === 'create') {
        return { phase: 'search', query: state.title, highlightIndex: 0 }
      }
      return { phase: 'idle' }

    case 'set_title':
      if (state.phase !== 'create') return state
      return { ...state, title: action.title }

    case 'set_category':
      if (state.phase !== 'create') return state
      return { ...state, categoryIndex: action.index }

    default:
      return state
  }
}

const INITIAL_STATE: PaletteState = { phase: 'idle' }

export function useCommandPalette() {
  return useReducer(reducer, INITIAL_STATE)
}
