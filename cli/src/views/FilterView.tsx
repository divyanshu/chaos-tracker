import React, { useState, useContext } from 'react'
import { Box, Text, useInput, useStdin } from 'ink'
import { colors, categoryColor, tagColor } from '../theme/colors.js'
import { AppStateContext } from '../app.js'
import { DEFAULT_CATEGORIES, DEFAULT_TAGS } from '#core/domain/category.js'
import type { TaskStatus } from '#core/domain/task.js'

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
]

type FilterItem =
  | { type: 'category'; value: string }
  | { type: 'status'; value: string }
  | { type: 'tag'; value: string }

export function FilterView() {
  const { state, setState } = useContext(AppStateContext)
  const [cursorIdx, setCursorIdx] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(state.filterCategories)
  )
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    new Set(state.filterStatuses)
  )
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    new Set(state.filterTags)
  )
  const { isRawModeSupported } = useStdin()

  const items: FilterItem[] = [
    ...DEFAULT_CATEGORIES.map((c) => ({ type: 'category' as const, value: c.name })),
    ...STATUSES.map((s) => ({ type: 'status' as const, value: s.value })),
    ...DEFAULT_TAGS.map((t) => ({ type: 'tag' as const, value: t.name })),
  ]

  const goBack = () => {
    setState((s) => ({
      ...s,
      view: 'dashboard',
      filterCategories: Array.from(selectedCategories),
      filterStatuses: Array.from(selectedStatuses),
      filterTags: Array.from(selectedTags),
    }))
  }

  const toggleItem = (item: FilterItem) => {
    if (item.type === 'category') {
      setSelectedCategories((prev) => {
        const next = new Set(prev)
        if (next.has(item.value)) next.delete(item.value)
        else next.add(item.value)
        return next
      })
    } else if (item.type === 'status') {
      setSelectedStatuses((prev) => {
        const next = new Set(prev)
        if (next.has(item.value)) next.delete(item.value)
        else next.add(item.value)
        return next
      })
    } else {
      setSelectedTags((prev) => {
        const next = new Set(prev)
        if (next.has(item.value)) next.delete(item.value)
        else next.add(item.value)
        return next
      })
    }
  }

  return (
    <Box flexDirection="column">
      <Text>{colors.accent.bold('  Filter Tasks')}</Text>
      <Text>{colors.dim('  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500')}</Text>

      <Box paddingLeft={2} marginTop={1}>
        <Text>{colors.dim('Categories')}</Text>
      </Box>
      <Box flexDirection="column" paddingLeft={3}>
        {DEFAULT_CATEGORIES.map((cat, i) => {
          const isActive = cursorIdx === i
          const isChecked = selectedCategories.has(cat.name)
          const catCol = categoryColor(cat.name)
          return (
            <Box key={cat.name} gap={1}>
              <Text>{isActive ? colors.accent('\u25b8') : ' '}</Text>
              <Text>{isChecked ? colors.accent('[\u2713]') : colors.dim('[ ]')}</Text>
              <Text>{catCol(cat.name)}</Text>
            </Box>
          )
        })}
      </Box>

      <Box paddingLeft={2} marginTop={1}>
        <Text>{colors.dim('Statuses')}</Text>
      </Box>
      <Box flexDirection="column" paddingLeft={3}>
        {STATUSES.map((s, i) => {
          const idx = DEFAULT_CATEGORIES.length + i
          const isActive = cursorIdx === idx
          const isChecked = selectedStatuses.has(s.value)
          return (
            <Box key={s.value} gap={1}>
              <Text>{isActive ? colors.accent('\u25b8') : ' '}</Text>
              <Text>{isChecked ? colors.accent('[\u2713]') : colors.dim('[ ]')}</Text>
              <Text>{colors.primary(s.label)}</Text>
            </Box>
          )
        })}
      </Box>

      <Box paddingLeft={2} marginTop={1}>
        <Text>{colors.dim('Tags')}</Text>
      </Box>
      <Box flexDirection="column" paddingLeft={3}>
        {DEFAULT_TAGS.map((tag, i) => {
          const idx = DEFAULT_CATEGORIES.length + STATUSES.length + i
          const isActive = cursorIdx === idx
          const isChecked = selectedTags.has(tag.name)
          return (
            <Box key={tag.name} gap={1}>
              <Text>{isActive ? colors.accent('\u25b8') : ' '}</Text>
              <Text>{isChecked ? colors.accent('[\u2713]') : colors.dim('[ ]')}</Text>
              <Text>{tagColor(tag.name)(tag.name)}</Text>
            </Box>
          )
        })}
      </Box>

      <Box paddingLeft={2} marginTop={1} gap={2}>
        <Text>{colors.dim('Space:toggle  Enter/Esc:apply & back  r:reset')}</Text>
      </Box>

      {isRawModeSupported && (
        <FilterKeyHandler
          items={items}
          cursorIdx={cursorIdx}
          setCursorIdx={setCursorIdx}
          toggleItem={toggleItem}
          onBack={goBack}
          onReset={() => {
            setSelectedCategories(new Set())
            setSelectedStatuses(new Set())
            setSelectedTags(new Set())
          }}
        />
      )}
    </Box>
  )
}

function FilterKeyHandler({
  items,
  cursorIdx,
  setCursorIdx,
  toggleItem,
  onBack,
  onReset,
}: {
  items: FilterItem[]
  cursorIdx: number
  setCursorIdx: (idx: number) => void
  toggleItem: (item: FilterItem) => void
  onBack: () => void
  onReset: () => void
}) {
  useInput((input, key) => {
    if (key.escape || key.return) {
      onBack()
      return
    }
    if (input === 'j' || key.downArrow) {
      setCursorIdx(Math.min(cursorIdx + 1, items.length - 1))
      return
    }
    if (input === 'k' || key.upArrow) {
      setCursorIdx(Math.max(cursorIdx - 1, 0))
      return
    }
    if (input === ' ') {
      const item = items[cursorIdx]
      if (item) toggleItem(item)
      return
    }
    if (input === 'r') {
      onReset()
    }
  })
  return null
}
