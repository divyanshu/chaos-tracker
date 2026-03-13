import React, { useState } from 'react'
import { Box, Text, useInput, useStdin } from 'ink'
import { TextInput } from '@inkjs/ui'
import { DEFAULT_CATEGORIES, DEFAULT_TAGS } from '#core/domain/category.js'
import { colors, categoryColor, tagColor } from '../../theme/colors.js'

type TaskFormProps = {
  onSubmit: (title: string, category: string, description: string, tags: string[]) => void
  onCancel: () => void
  initialTitle?: string
  initialCategory?: string
  initialDescription?: string
  initialTags?: string[]
}

type FormStep = 'title' | 'category' | 'description' | 'tags' | 'confirm'

export function TaskForm({
  onSubmit,
  onCancel,
  initialTitle = '',
  initialCategory = DEFAULT_CATEGORIES[0].name,
  initialDescription = '',
  initialTags = [],
}: TaskFormProps) {
  const [step, setStep] = useState<FormStep>('title')
  const [title, setTitle] = useState(initialTitle)
  const [categoryIdx, setCategoryIdx] = useState(
    DEFAULT_CATEGORIES.findIndex((c) => c.name === initialCategory)
  )
  const [description, setDescription] = useState(initialDescription)
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(initialTags))
  const { isRawModeSupported } = useStdin()

  const category = DEFAULT_CATEGORIES[categoryIdx >= 0 ? categoryIdx : 0].name

  return (
    <Box flexDirection="column" gap={1}>
      <Text>{colors.accent.bold(initialTitle ? '  Edit Task' : '  New Task')}</Text>
      <Text>{colors.dim('  ─────────────────────────────────────────────')}</Text>

      {/* Title */}
      <Box paddingLeft={2} gap={1}>
        <Text>{step === 'title' ? colors.accent('\u25b8') : ' '}</Text>
        <Text>{colors.dim('Title:')}</Text>
        {step === 'title' ? (
          <TextInput
            defaultValue={title}
            onSubmit={(value) => {
              if (value.trim()) {
                setTitle(value.trim())
                setStep('category')
              }
            }}
          />
        ) : (
          <Text>{colors.primary(title)}</Text>
        )}
      </Box>

      {/* Category */}
      {(step === 'category' || step === 'description' || step === 'tags' || step === 'confirm') && (
        <Box paddingLeft={2} gap={1}>
          <Text>{step === 'category' ? colors.accent('\u25b8') : ' '}</Text>
          <Text>{colors.dim('Category:')}</Text>
          {step === 'category' ? (
            <CategorySelector
              selectedIdx={categoryIdx}
              onSelect={(idx) => {
                setCategoryIdx(idx)
                setStep('description')
              }}
              onCancel={onCancel}
            />
          ) : (
            <Text>{categoryColor(category)(category)}</Text>
          )}
        </Box>
      )}

      {/* Description */}
      {(step === 'description' || step === 'tags' || step === 'confirm') && (
        <Box paddingLeft={2} gap={1}>
          <Text>{step === 'description' ? colors.accent('\u25b8') : ' '}</Text>
          <Text>{colors.dim('Description:')}</Text>
          {step === 'description' ? (
            <TextInput
              defaultValue={description}
              onSubmit={(value) => {
                setDescription(value.trim())
                setStep('tags')
              }}
            />
          ) : (
            <Text>{colors.primary(description || '(none)')}</Text>
          )}
        </Box>
      )}

      {/* Tags */}
      {(step === 'tags' || step === 'confirm') && (
        <Box paddingLeft={2} gap={1}>
          <Text>{step === 'tags' ? colors.accent('\u25b8') : ' '}</Text>
          <Text>{colors.dim('Tags:')}</Text>
          {step === 'tags' ? (
            <TagSelector
              selected={selectedTags}
              onChange={setSelectedTags}
              onConfirm={() => setStep('confirm')}
              onCancel={onCancel}
            />
          ) : (
            <Text>
              {selectedTags.size > 0
                ? Array.from(selectedTags).map((t) => tagColor(t)(t)).join(colors.dim(', '))
                : colors.muted('(none)')}
            </Text>
          )}
        </Box>
      )}

      {/* Confirm */}
      {step === 'confirm' && isRawModeSupported && (
        <ConfirmStep
          onConfirm={() => onSubmit(title, category, description, Array.from(selectedTags))}
          onCancel={onCancel}
        />
      )}

      <Box paddingLeft={2}>
        <Text>{colors.dim('Esc to cancel')}</Text>
      </Box>
    </Box>
  )
}

function CategorySelector({
  selectedIdx,
  onSelect,
  onCancel,
}: {
  selectedIdx: number
  onSelect: (idx: number) => void
  onCancel: () => void
}) {
  const [idx, setIdx] = useState(selectedIdx >= 0 ? selectedIdx : 0)

  useInput((input, key) => {
    if (key.escape) {
      onCancel()
      return
    }
    if (input === 'j' || key.downArrow) {
      setIdx((i) => Math.min(i + 1, DEFAULT_CATEGORIES.length - 1))
      return
    }
    if (input === 'k' || key.upArrow) {
      setIdx((i) => Math.max(i - 1, 0))
      return
    }
    if (key.return) {
      onSelect(idx)
    }
  })

  return (
    <Box flexDirection="column">
      {DEFAULT_CATEGORIES.map((cat, i) => {
        const catCol = categoryColor(cat.name)
        const prefix = i === idx ? colors.accent('\u25b8 ') : '  '
        return (
          <Text key={cat.name}>
            {prefix}
            {catCol(cat.name)}
          </Text>
        )
      })}
    </Box>
  )
}

function TagSelector({
  selected,
  onChange,
  onConfirm,
  onCancel,
}: {
  selected: Set<string>
  onChange: (tags: Set<string>) => void
  onConfirm: () => void
  onCancel: () => void
}) {
  const [idx, setIdx] = useState(0)

  useInput((input, key) => {
    if (key.escape) {
      onCancel()
      return
    }
    if (key.return) {
      onConfirm()
      return
    }
    if (input === 'j' || key.downArrow) {
      setIdx((i) => Math.min(i + 1, DEFAULT_TAGS.length - 1))
      return
    }
    if (input === 'k' || key.upArrow) {
      setIdx((i) => Math.max(i - 1, 0))
      return
    }
    if (input === ' ') {
      const tag = DEFAULT_TAGS[idx].name
      const next = new Set(selected)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      onChange(next)
    }
  })

  return (
    <Box flexDirection="column">
      {DEFAULT_TAGS.map((tag, i) => {
        const isActive = i === idx
        const isChecked = selected.has(tag.name)
        return (
          <Box key={tag.name} gap={1}>
            <Text>{isActive ? colors.accent('\u25b8') : ' '}</Text>
            <Text>{isChecked ? colors.accent('[\u2713]') : colors.dim('[ ]')}</Text>
            <Text>{tagColor(tag.name)(tag.name)}</Text>
          </Box>
        )
      })}
      <Box marginTop={1}>
        <Text>{colors.dim('j/k:move  Space:toggle  Enter:confirm')}</Text>
      </Box>
    </Box>
  )
}

function ConfirmStep({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) {
  useInput((input, key) => {
    if (key.return || input === 'y') {
      onConfirm()
      return
    }
    if (key.escape || input === 'n') {
      onCancel()
    }
  })

  return (
    <Box paddingLeft={2} gap={1}>
      <Text>{colors.accent('\u25b8')}</Text>
      <Text>{colors.primary('Save? ')}</Text>
      <Text>{colors.muted('(Enter/y to confirm, Esc/n to cancel)')}</Text>
    </Box>
  )
}
