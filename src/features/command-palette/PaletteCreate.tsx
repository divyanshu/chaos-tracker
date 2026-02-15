import { useRef, useEffect } from 'react'
import { DEFAULT_CATEGORIES } from '@/core/domain'
import { cn } from '@/lib/utils'

interface PaletteCreateProps {
  title: string
  categoryIndex: number
  onTitleChange: (title: string) => void
  onCategoryChange: (index: number) => void
  onConfirm: () => void
  onBack: () => void
}

export function PaletteCreate({
  title,
  categoryIndex,
  onTitleChange,
  onCategoryChange,
  onConfirm,
  onBack,
}: PaletteCreateProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (title.trim()) onConfirm()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onBack()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const next = e.shiftKey
        ? (categoryIndex - 1 + DEFAULT_CATEGORIES.length) % DEFAULT_CATEGORIES.length
        : (categoryIndex + 1) % DEFAULT_CATEGORIES.length
      onCategoryChange(next)
    } else if (e.key === 'ArrowLeft') {
      // Only navigate categories when cursor is at start
      const input = inputRef.current
      if (input && input.selectionStart === 0 && input.selectionEnd === 0) {
        e.preventDefault()
        const prev = (categoryIndex - 1 + DEFAULT_CATEGORIES.length) % DEFAULT_CATEGORIES.length
        onCategoryChange(prev)
      }
    } else if (e.key === 'ArrowRight') {
      const input = inputRef.current
      if (input && input.selectionStart === input.value.length) {
        e.preventDefault()
        const next = (categoryIndex + 1) % DEFAULT_CATEGORIES.length
        onCategoryChange(next)
      }
    }
  }

  return (
    <div onKeyDown={handleKeyDown}>
      <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Task title..."
          className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex flex-wrap gap-1.5 px-3 py-3">
        {DEFAULT_CATEGORIES.map((cat, i) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => onCategoryChange(i)}
            className={cn(
              'inline-flex items-center rounded px-2 py-1 text-xs font-medium transition-all',
              i === categoryIndex
                ? 'ring-2 ring-ring ring-offset-1 ring-offset-background'
                : 'opacity-60 hover:opacity-100',
            )}
            style={{ backgroundColor: `${cat.color}25`, color: cat.color }}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="border-t px-3 py-2 text-xs text-muted-foreground">
        Enter to create &middot; Tab to change category &middot; Esc to go back
      </div>
    </div>
  )
}
