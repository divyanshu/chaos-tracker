import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-bold mb-8">Chaos Tracker</h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Sample Task
            <Badge variant="secondary">In Progress</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This is a test card to verify ShadCN components are working.
          </p>
          <div className="flex gap-2">
            <Button size="sm">Touch</Button>
            <Button size="sm" variant="outline">Complete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
