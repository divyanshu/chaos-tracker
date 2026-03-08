import { useUIStore } from '@/stores/ui-store'

const SHORTCUTS = [
  { section: 'Navigation', items: [
    { keys: ['↑', '↓', '←', '→'], label: 'Navigate between nodes' },
    { keys: ['j', 'k', 'h'], label: 'Vim-style navigation' },
    { keys: ['Tab'], label: 'Cycle through nodes' },
  ]},
  { section: 'Task Actions', items: [
    { keys: ['s'], label: 'Start task' },
    { keys: ['p'], label: 'Pause task' },
    { keys: ['c'], label: 'Complete task' },
    { keys: ['t'], label: 'Touch task' },
    { keys: ['d'], label: 'Delete task' },
    { keys: ['Enter', 'e'], label: 'Open task detail' },
  ]},
  { section: 'Creation & Search', items: [
    { keys: ['/'], label: 'Quick entry (search + create)' },
    { keys: [':', '\u2318K'], label: 'Command palette' },
  ]},
  { section: 'View', items: [
    { keys: ['l'], label: 'Toggle layout mode' },
    { keys: ['\u2318\\'], label: 'Toggle sidebar' },
    { keys: ['\u2318+', '\u2318-'], label: 'Zoom in / out' },
    { keys: ['\u23180'], label: 'Reset zoom' },
    { keys: ['?'], label: 'This help' },
    { keys: ['Esc'], label: 'Close panel / deselect' },
  ]},
]

export function HelpOverlay() {
  const { helpOpen, setHelpOpen } = useUIStore()

  if (!helpOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setHelpOpen(false)} />
      <div className="relative w-full max-w-lg rounded-lg border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Keyboard Shortcuts</h2>
          <button
            onClick={() => setHelpOpen(false)}
            className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent transition-colors"
          >
            Esc
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {SHORTCUTS.map((section) => (
            <div key={section.section}>
              <h3 className="mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {section.section}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2">
                    <span className="text-xs">{item.label}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key) => (
                        <kbd
                          key={key}
                          className="inline-flex h-5 min-w-[20px] items-center justify-center rounded border bg-muted px-1 font-mono text-[10px] text-muted-foreground"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
