import { Outlet } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CommandPalette } from '@/features/command-palette/CommandPalette'

function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-background text-foreground">
        <Outlet />
        <CommandPalette />
      </div>
    </TooltipProvider>
  )
}

export default App
