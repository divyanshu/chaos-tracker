import { Outlet } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'

function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-background text-foreground">
        <Outlet />
      </div>
    </TooltipProvider>
  )
}

export default App
