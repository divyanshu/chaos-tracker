import React from 'react'
import { Box, useStdin } from 'ink'
import { CategoryGroup } from '../components/category/CategoryGroup.js'
import { Header } from '../components/layout/Header.js'
import { Footer } from '../components/layout/Footer.js'
import { useTasks } from '../hooks/use-tasks.js'
import { useSelectedTask, useKeyboardNav } from '../hooks/use-navigation.js'

function KeyboardHandler({ flatTaskIds }: { flatTaskIds: string[] }) {
  useKeyboardNav(flatTaskIds)
  return null
}

export function DashboardView() {
  const { tasksByCategory, flatTaskIds } = useTasks()
  const selectedTaskId = useSelectedTask(flatTaskIds)
  const { isRawModeSupported } = useStdin()

  return (
    <Box flexDirection="column">
      <Header />
      {isRawModeSupported && <KeyboardHandler flatTaskIds={flatTaskIds} />}
      {tasksByCategory.map(({ category, tasks }) => (
        <CategoryGroup
          key={category}
          category={category}
          tasks={tasks}
          selectedTaskId={selectedTaskId}
        />
      ))}
      <Footer />
    </Box>
  )
}
