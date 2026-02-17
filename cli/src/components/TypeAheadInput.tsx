import React, { useEffect, useContext, useCallback } from 'react'
import { Box, Text, useInput, useStdin } from 'ink'
import { TextInput } from '@inkjs/ui'
import { colors, categoryColor } from '../theme/colors.js'
import { termWidth } from '../utils/terminal.js'
import { useTypeahead } from '../hooks/use-typeahead.js'
import { useTasks } from '../hooks/use-tasks.js'
import { AppStateContext } from '../app.js'
import { StatusBadge } from './task/StatusBadge.js'
import { relativeTime, neglectIndicator } from '../utils/time.js'
import { DEFAULT_CATEGORIES } from '../../../src/core/domain/category.js'
import type { SearchResult } from '../../../src/core/services/fuzzy-search.js'

type TypeAheadInputProps = {
  onClose: () => void
}

export function TypeAheadInput({ onClose }: TypeAheadInputProps) {
  const { isRawModeSupported } = useStdin()
  const { tasks, setStatus, touchTask, createTask, refresh } = useTasks()
  const { setState } = useContext(AppStateContext)
  const {
    state: ta,
    setQuery,
    navigateResult,
    blurInput,
    backToSearch,
    startCreate,
    cycleCategory,
    confirmCreate,
    reset,
    initResults,
  } = useTypeahead(tasks)

  // Initialize with empty query (shows recent tasks)
  useEffect(() => {
    initResults()
  }, [initResults])

  // Auto-dismiss confirmation after ~1s
  useEffect(() => {
    if (ta.mode !== 'confirmed') return
    const timer = setTimeout(() => {
      reset()
      onClose()
    }, 1000)
    return () => clearTimeout(timer)
  }, [ta.mode, reset, onClose])

  const selectedResult = ta.results[ta.selectedResultIdx] ?? null

  const handleCreate = useCallback(async () => {
    const title = ta.query.trim()
    if (!title) return
    const category = DEFAULT_CATEGORIES[ta.categoryIdx].name
    await createTask(title, category)
    await refresh()
    confirmCreate(title, category)
  }, [ta.query, ta.categoryIdx, createTask, refresh, confirmCreate])

  const handleOpenTask = useCallback(() => {
    if (!selectedResult) return
    setState((s) => ({
      ...s,
      typeaheadOpen: false,
      view: 'detail',
      selectedTaskId: selectedResult.task.id,
    }))
  }, [selectedResult, setState])

  const handleQuickAction = useCallback(
    async (action: 's' | 'p' | 'c' | 't') => {
      if (!selectedResult) return
      const id = selectedResult.task.id
      switch (action) {
        case 's':
          await setStatus(id, 'in_progress')
          break
        case 'p':
          await setStatus(id, 'paused')
          break
        case 'c':
          await setStatus(id, 'completed')
          break
        case 't':
          await touchTask(id)
          break
      }
      // Re-run search to update results in-place
      setQuery(ta.query)
    },
    [selectedResult, setStatus, touchTask, setQuery, ta.query],
  )

  // Panel border (full terminal width)
  const w = termWidth()
  const titleText = ' / Quick Entry '
  const topLine =
    colors.dim('\u250c\u2500') +
    colors.accent.bold(titleText) +
    colors.dim('\u2500'.repeat(Math.max(w - titleText.length - 3, 0)) + '\u2510')
  const bottomLine = colors.dim('\u2514' + '\u2500'.repeat(w - 2) + '\u2518')

  if (ta.mode === 'confirmed') {
    return (
      <Box flexDirection="column" marginBottom={1}>
        <Text>{topLine}</Text>
        <Box paddingLeft={2} paddingRight={2}>
          <Text>
            {colors.success('\u2713')} Created &quot;{colors.primary(ta.createdTaskTitle)}&quot; in{' '}
            {categoryColor(ta.createdTaskCategory)(ta.createdTaskCategory)}
          </Text>
        </Box>
        <Text>{bottomLine}</Text>
      </Box>
    )
  }

  if (ta.mode === 'creating') {
    return (
      <Box flexDirection="column" marginBottom={1}>
        <Text>{topLine}</Text>
        <Box paddingLeft={2} paddingRight={2}>
          <Text>
            {colors.accent('+')} {colors.primary(ta.query)}
          </Text>
        </Box>
        <Box paddingLeft={2} paddingRight={2} marginTop={1}>
          <Text>{colors.muted('Category:  ')}</Text>
          {DEFAULT_CATEGORIES.map((cat, i) => (
            <Text key={cat.name}>
              {i === ta.categoryIdx
                ? categoryColor(cat.name).bold('[' + cat.name + ']')
                : colors.dim(cat.name)}
              {i < DEFAULT_CATEGORIES.length - 1 ? '  ' : ''}
            </Text>
          ))}
        </Box>
        <Box paddingLeft={2} paddingRight={2} marginTop={1}>
          <Text>{colors.dim('\u2190\u2192:category \u00b7 Enter:create \u00b7 Esc:back')}</Text>
        </Box>
        <Text>{bottomLine}</Text>
        {isRawModeSupported && (
          <CreateModeKeys
            onCycle={cycleCategory}
            onCreate={handleCreate}
            onBack={backToSearch}
          />
        )}
      </Box>
    )
  }

  // Searching mode
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text>{topLine}</Text>
      <Box paddingLeft={2} paddingRight={2}>
        {ta.inputFocused ? (
          <Box>
            <Text>{colors.accent('> ')}</Text>
            <TextInput
              defaultValue=""
              onChange={setQuery}
              onSubmit={() => {
                if (selectedResult) handleOpenTask()
              }}
            />
          </Box>
        ) : (
          <Text>
            {colors.accent('> ')}{colors.primary(ta.query)}{colors.dim('_')}
          </Text>
        )}
      </Box>

      {ta.results.length > 0 ? (
        <Box flexDirection="column" paddingLeft={2} paddingRight={2} marginTop={1}>
          {ta.results.map((result, i) => (
            <ResultRow
              key={result.task.id}
              result={result}
              isSelected={!ta.inputFocused && i === ta.selectedResultIdx}
            />
          ))}
        </Box>
      ) : ta.query.trim() ? (
        <Box paddingLeft={4} marginTop={1}>
          <Text>{colors.muted('No matching tasks')}</Text>
        </Box>
      ) : null}

      <Box paddingLeft={2} paddingRight={2} marginTop={1} gap={1}>
        <Text>
          {ta.results.length > 0
            ? colors.dim(
                `${ta.results.length} match${ta.results.length === 1 ? '' : 'es'} \u00b7 \u2191\u2193:select \u00b7 Enter:open \u00b7 Tab:new \u00b7 Esc:\u00d7`,
              )
            : ta.query.trim()
              ? colors.dim(`Tab: create \u201c${ta.query}\u201d \u00b7 Esc:\u00d7`)
              : colors.dim('\u2191\u2193:select \u00b7 Enter:open \u00b7 Tab:new \u00b7 Esc:\u00d7')}
        </Text>
      </Box>
      <Text>{bottomLine}</Text>
      {isRawModeSupported && (
        <SearchModeKeys
          inputFocused={ta.inputFocused}
          hasResults={ta.results.length > 0}
          onNavigate={navigateResult}
          onBlur={blurInput}
          onStartCreate={startCreate}
          onOpen={handleOpenTask}
          onClose={onClose}
          onQuickAction={handleQuickAction}
        />
      )}
    </Box>
  )
}

// --- Result row with highlighted title ---

function ResultRow({ result, isSelected }: { result: SearchResult; isSelected: boolean }) {
  const { task, titleHighlights } = result
  const indicator = isSelected ? colors.accent('\u25b8 ') : '  '
  const neglect = neglectIndicator(task.last_touched)
  const time = relativeTime(task.last_touched)

  return (
    <Box>
      <Text>
        {indicator}
        <StatusBadge status={task.status} />{' '}
        <HighlightedTitle title={task.title} highlights={titleHighlights} isSelected={isSelected} />
        {'  '}
        {categoryColor(task.category)(task.category)}
        {'  '}
        {colors.dim(time)}
        {neglect ? '  ' + (neglect === '!!' ? colors.danger(neglect) : colors.warn(neglect)) : ''}
      </Text>
    </Box>
  )
}

function HighlightedTitle({
  title,
  highlights,
  isSelected,
}: {
  title: string
  highlights: [number, number][]
  isSelected: boolean
}) {
  if (highlights.length === 0) {
    return <Text>{isSelected ? colors.primary(title) : colors.muted(title)}</Text>
  }

  const parts: React.ReactNode[] = []
  let lastEnd = 0

  for (const [start, end] of highlights) {
    if (start > lastEnd) {
      const segment = title.slice(lastEnd, start)
      parts.push(
        <Text key={`t-${lastEnd}`}>{isSelected ? colors.primary(segment) : colors.muted(segment)}</Text>,
      )
    }
    const segment = title.slice(start, end)
    parts.push(
      <Text key={`h-${start}`} bold>
        {isSelected ? colors.accent(segment) : colors.primary(segment)}
      </Text>,
    )
    lastEnd = end
  }

  if (lastEnd < title.length) {
    const segment = title.slice(lastEnd)
    parts.push(
      <Text key={`t-${lastEnd}`}>{isSelected ? colors.primary(segment) : colors.muted(segment)}</Text>,
    )
  }

  return <Text>{parts}</Text>
}

// --- Keyboard handlers as separate components ---

function SearchModeKeys({
  inputFocused,
  hasResults,
  onNavigate,
  onBlur,
  onStartCreate,
  onOpen,
  onClose,
  onQuickAction,
}: {
  inputFocused: boolean
  hasResults: boolean
  onNavigate: (delta: number) => void
  onBlur: () => void
  onStartCreate: () => void
  onOpen: () => void
  onClose: () => void
  onQuickAction: (action: 's' | 'p' | 'c' | 't') => void
}) {
  useInput((input, key) => {
    if (key.escape) {
      onClose()
      return
    }

    if (key.tab) {
      onStartCreate()
      return
    }

    if (inputFocused) {
      // In input zone: only handle arrow down to move into results
      if (key.downArrow && hasResults) {
        onBlur()
        return
      }
      return
    }

    // In results zone
    if (key.downArrow) {
      onNavigate(1)
      return
    }
    if (key.upArrow) {
      onNavigate(-1) // Will refocus input if past idx 0
      return
    }
    if (key.return) {
      onOpen()
      return
    }

    // Quick actions (only in results zone when input not focused)
    if (input === 's') {
      onQuickAction('s')
      return
    }
    if (input === 'p') {
      onQuickAction('p')
      return
    }
    if (input === 'c') {
      onQuickAction('c')
      return
    }
    if (input === 't') {
      onQuickAction('t')
      return
    }
  })

  return null
}

function CreateModeKeys({
  onCycle,
  onCreate,
  onBack,
}: {
  onCycle: (delta: number) => void
  onCreate: () => void
  onBack: () => void
}) {
  useInput((_input, key) => {
    if (key.escape) {
      onBack()
      return
    }
    if (key.return) {
      onCreate()
      return
    }
    if (key.leftArrow) {
      onCycle(-1)
      return
    }
    if (key.rightArrow) {
      onCycle(1)
      return
    }
  })

  return null
}
