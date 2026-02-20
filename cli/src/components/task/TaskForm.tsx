import React, { useState } from 'react'
import { Box, Text, useInput, useStdin } from 'ink'
import { TextInput } from '@inkjs/ui'
import { DEFAULT_CATEGORIES } from '#core/domain/category.js'
import { colors, categoryColor } from '../../theme/colors.js'

type TaskFormProps = {
  onSubmit: (title: string, category: string, description: string) => void
  onCancel: () => void
  initialTitle?: string
  initialCategory?: string
  initialDescription?: string
}

type FormStep = 'title' | 'category' | 'description' | 'confirm'

export function TaskForm({
  onSubmit,
  onCancel,
  initialTitle = '',
  initialCategory = DEFAULT_CATEGORIES[0].name,
  initialDescription = '',
}: TaskFormProps) {
  const [step, setStep] = useState<FormStep>('title')
  const [title, setTitle] = useState(initialTitle)
  const [categoryIdx, setCategoryIdx] = useState(
    DEFAULT_CATEGORIES.findIndex((c) => c.name === initialCategory)
  )
  const [description, setDescription] = useState(initialDescription)
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
      {(step === 'category' || step === 'description' || step === 'confirm') && (
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
      {(step === 'description' || step === 'confirm') && (
        <Box paddingLeft={2} gap={1}>
          <Text>{step === 'description' ? colors.accent('\u25b8') : ' '}</Text>
          <Text>{colors.dim('Description:')}</Text>
          {step === 'description' ? (
            <TextInput
              defaultValue={description}
              onSubmit={(value) => {
                setDescription(value.trim())
                setStep('confirm')
              }}
            />
          ) : (
            <Text>{colors.primary(description || '(none)')}</Text>
          )}
        </Box>
      )}

      {/* Confirm */}
      {step === 'confirm' && isRawModeSupported && (
        <ConfirmStep
          onConfirm={() => onSubmit(title, category, description)}
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
