import { Toaster } from 'sonner'
import { Providers } from '@/app/providers'
import { CanvasView } from '@/canvas/CanvasView'
import { QuickEntry } from '@/panels/QuickEntry'
import { CommandPalette } from '@/panels/CommandPalette'
import { TaskDetail } from '@/panels/TaskDetail'
import { HelpOverlay } from '@/panels/HelpOverlay'
import { Sidebar } from '@/panels/Sidebar'
import { useUIStore } from '@/stores/ui-store'
import { useKeyboard } from '@/hooks/use-keyboard'
import { isSupabaseConfigured } from '@/infrastructure/supabase'

function Header() {
  const { theme, toggleTheme, layoutMode, toggleLayoutMode } = useUIStore()

  return (
    <header className="flex h-11 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold tracking-tight">chaos</span>
        <span className="text-muted-foreground text-sm">·</span>
        <span className="text-muted-foreground text-sm">canvas</span>
        {!isSupabaseConfigured && (
          <span className="rounded-sm bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-500">
            mock
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={toggleLayoutMode}
          className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          title={`Switch to ${layoutMode === 'canvas' ? 'split' : 'canvas'} mode (l)`}
        >
          {layoutMode === 'canvas' ? '≡' : '⊞'}
        </button>
        <button
          onClick={toggleTheme}
          className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? '◑' : '◐'}
        </button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="flex h-8 items-center justify-between border-t px-4 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-3">
        <span><kbd className="font-mono">/</kbd> entry</span>
        <span><kbd className="font-mono">:</kbd> cmd</span>
        <span><kbd className="font-mono">n</kbd> new</span>
        <span><kbd className="font-mono">?</kbd> help</span>
      </div>
      <div className="flex items-center gap-3">
        <span>⊞ grid</span>
      </div>
    </footer>
  )
}

function AppShell() {
  useKeyboard()
  const layoutMode = useUIStore((s) => s.layoutMode)

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <CanvasView />
        </div>
        {layoutMode === 'split' && (
          <div className="w-80 flex-shrink-0">
            <Sidebar />
          </div>
        )}
      </main>
      <Footer />

      {/* Overlay panels */}
      <QuickEntry />
      <CommandPalette />
      <TaskDetail />
      <HelpOverlay />
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: 'text-sm',
          duration: 2000,
        }}
        theme="system"
      />
    </div>
  )
}

export default function App() {
  return (
    <Providers>
      <AppShell />
    </Providers>
  )
}
