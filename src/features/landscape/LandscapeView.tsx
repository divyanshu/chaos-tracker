import { Link } from 'react-router-dom'
import { useTasks } from '@/hooks/use-tasks'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function LandscapeView() {
  const { data: tasks, isLoading, error } = useTasks()

  if (isLoading) {
    return (
      <div className="p-8 text-muted-foreground">Loading tasks...</div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-destructive">
        Failed to load tasks: {error.message}
      </div>
    )
  }

  const tasksByCategory = (tasks ?? []).reduce<Record<string, typeof tasks>>(
    (acc, task) => {
      const cat = task.category
      if (!acc[cat]) acc[cat] = []
      acc[cat]!.push(task)
      return acc
    },
    {},
  )

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Landscape</h1>
      <p className="text-muted-foreground mb-8">
        {tasks?.length ?? 0} tasks across{' '}
        {Object.keys(tasksByCategory).length} categories
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {category}
                <Badge variant="secondary">{categoryTasks!.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categoryTasks!.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="block rounded-md border p-3 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{task.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {task.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(tasksByCategory).length === 0 && (
        <p className="text-muted-foreground">No tasks yet.</p>
      )}
    </div>
  )
}

export default LandscapeView
