import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import App from '@/App'

const LandscapeView = lazy(
  () => import('@/features/landscape/LandscapeView'),
)
const TaskDetailView = lazy(
  () => import('@/features/tasks/TaskDetailView'),
)
const RejuvenationView = lazy(
  () => import('@/features/rejuvenation/RejuvenationView'),
)

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full p-8 text-muted-foreground">
          Loading...
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <LandscapeView />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'tasks/:taskId',
        element: (
          <SuspenseWrapper>
            <TaskDetailView />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'rejuvenate',
        element: (
          <SuspenseWrapper>
            <RejuvenationView />
          </SuspenseWrapper>
        ),
      },
    ],
  },
])
