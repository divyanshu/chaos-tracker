import { useReducer, useCallback } from 'react'
import type { Task } from '#core/domain/task.js'
import { searchTasks, type SearchResult } from '#core/services/fuzzy-search.js'
import { DEFAULT_CATEGORIES, DEFAULT_TAGS } from '#core/domain/category.js'

export type TypeAheadMode = 'searching' | 'creating' | 'confirmed'
export type CreateFocusRow = 'category' | 'tags'

export type TypeAheadState = {
  mode: TypeAheadMode
  query: string
  results: SearchResult[]
  selectedResultIdx: number
  inputFocused: boolean
  categoryIdx: number
  createFocusRow: CreateFocusRow
  tagFocusIdx: number
  selectedTags: string[]
  createdTaskTitle: string
  createdTaskCategory: string
}

type Action =
  | { type: 'SET_QUERY'; query: string; tasks: Task[] }
  | { type: 'NAVIGATE_RESULT'; delta: number }
  | { type: 'FOCUS_INPUT' }
  | { type: 'BLUR_INPUT' }
  | { type: 'BACK_TO_SEARCH' }
  | { type: 'START_CREATE' }
  | { type: 'CYCLE_CATEGORY'; delta: number }
  | { type: 'FOCUS_TAGS_ROW' }
  | { type: 'BACK_TO_CATEGORY_ROW' }
  | { type: 'CYCLE_TAG_FOCUS'; delta: number }
  | { type: 'TOGGLE_TAG' }
  | { type: 'CONFIRM_CREATE'; title: string; category: string }
  | { type: 'RESET' }

const INITIAL_STATE: TypeAheadState = {
  mode: 'searching',
  query: '',
  results: [],
  selectedResultIdx: 0,
  inputFocused: true,
  categoryIdx: 0,
  createFocusRow: 'category',
  tagFocusIdx: 0,
  selectedTags: [],
  createdTaskTitle: '',
  createdTaskCategory: '',
}

function reducer(state: TypeAheadState, action: Action): TypeAheadState {
  switch (action.type) {
    case 'SET_QUERY': {
      const results = searchTasks(action.tasks, action.query, 6)
      return {
        ...state,
        mode: 'searching',
        query: action.query,
        results,
        selectedResultIdx: 0,
        inputFocused: true,
      }
    }

    case 'NAVIGATE_RESULT': {
      const maxIdx = state.results.length - 1
      if (maxIdx < 0) return state
      let next = state.selectedResultIdx + action.delta
      if (next < 0) {
        return { ...state, selectedResultIdx: 0, inputFocused: true }
      }
      if (next > maxIdx) next = maxIdx
      return { ...state, selectedResultIdx: next, inputFocused: false }
    }

    case 'FOCUS_INPUT':
      return { ...state, inputFocused: true }

    case 'BLUR_INPUT':
      return { ...state, inputFocused: false }

    case 'BACK_TO_SEARCH':
      return { ...state, mode: 'searching', inputFocused: true }

    case 'START_CREATE':
      return {
        ...state,
        mode: 'creating',
        categoryIdx: 0,
        createFocusRow: 'category',
        tagFocusIdx: 0,
        selectedTags: [],
      }

    case 'CYCLE_CATEGORY': {
      const len = DEFAULT_CATEGORIES.length
      let next = state.categoryIdx + action.delta
      if (next < 0) next = len - 1
      if (next >= len) next = 0
      return { ...state, categoryIdx: next }
    }

    case 'FOCUS_TAGS_ROW':
      return { ...state, createFocusRow: 'tags' }

    case 'BACK_TO_CATEGORY_ROW':
      return { ...state, createFocusRow: 'category' }

    case 'CYCLE_TAG_FOCUS': {
      const len = DEFAULT_TAGS.length
      let next = state.tagFocusIdx + action.delta
      if (next < 0) next = len - 1
      if (next >= len) next = 0
      return { ...state, tagFocusIdx: next }
    }

    case 'TOGGLE_TAG': {
      const tag = DEFAULT_TAGS[state.tagFocusIdx].name
      const has = state.selectedTags.includes(tag)
      const next = has
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag]
      return { ...state, selectedTags: next }
    }

    case 'CONFIRM_CREATE':
      return {
        ...state,
        mode: 'confirmed',
        createdTaskTitle: action.title,
        createdTaskCategory: action.category,
      }

    case 'RESET':
      return { ...INITIAL_STATE }

    default:
      return state
  }
}

export function useTypeahead(tasks: Task[]) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const setQuery = useCallback(
    (query: string) => dispatch({ type: 'SET_QUERY', query, tasks }),
    [tasks],
  )

  const navigateResult = useCallback(
    (delta: number) => dispatch({ type: 'NAVIGATE_RESULT', delta }),
    [],
  )

  const focusInput = useCallback(() => dispatch({ type: 'FOCUS_INPUT' }), [])
  const blurInput = useCallback(() => dispatch({ type: 'BLUR_INPUT' }), [])
  const backToSearch = useCallback(() => dispatch({ type: 'BACK_TO_SEARCH' }), [])
  const startCreate = useCallback(() => dispatch({ type: 'START_CREATE' }), [])

  const cycleCategory = useCallback(
    (delta: number) => dispatch({ type: 'CYCLE_CATEGORY', delta }),
    [],
  )

  const focusTagsRow = useCallback(() => dispatch({ type: 'FOCUS_TAGS_ROW' }), [])
  const backToCategoryRow = useCallback(() => dispatch({ type: 'BACK_TO_CATEGORY_ROW' }), [])
  const cycleTagFocus = useCallback((delta: number) => dispatch({ type: 'CYCLE_TAG_FOCUS', delta }), [])
  const toggleTag = useCallback(() => dispatch({ type: 'TOGGLE_TAG' }), [])

  const confirmCreate = useCallback(
    (title: string, category: string) =>
      dispatch({ type: 'CONFIRM_CREATE', title, category }),
    [],
  )

  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  const initResults = useCallback(() => {
    dispatch({ type: 'SET_QUERY', query: '', tasks })
  }, [tasks])

  return {
    state,
    setQuery,
    navigateResult,
    focusInput,
    blurInput,
    backToSearch,
    startCreate,
    cycleCategory,
    focusTagsRow,
    backToCategoryRow,
    cycleTagFocus,
    toggleTag,
    confirmCreate,
    reset,
    initResults,
  }
}
