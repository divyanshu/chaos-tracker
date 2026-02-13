import { useParams, Link } from 'react-router-dom'
import { useTask } from '@/hooks/use-tasks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function TaskDetailView() {
  const { taskId } = useParams<{ taskId: string }>()
  const { data: task, isLoading, error } = useTask(taskId)

  if (isLoading) {
    return (
      <div className="p-8 text-muted-foreground">Loading task...</div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-destructive">
        Failed to load task: {error.message}
      </div>
    )
  }

  if (!task) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground mb-4">Task not found.</p>
        <Link to="/">
          <Button variant="outline">Back to Landscape</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link
        to="/"
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        &larr; Back to Landscape
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {task.title}
            <Badge variant="outline">{task.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {task.description && (
            <p className="text-muted-foreground">{task.description}</p>
          )}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Category:</span>{' '}
              {task.category}
            </div>
            <div>
              <span className="text-muted-foreground">Last touched:</span>{' '}
              {new Date(task.last_touched).toLocaleDateString()}
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>{' '}
              {new Date(task.created_at).toLocaleDateString()}
            </div>
            <div>
              <span className="text-muted-foreground">Updated:</span>{' '}
              {new Date(task.updated_at).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TaskDetailView
