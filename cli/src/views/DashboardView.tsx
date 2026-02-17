import React, { useContext, useCallback } from 'react'
import { Box, useStdin } from 'ink'
import { CategoryGroup } from '../components/category/CategoryGroup.js'
import { Header } from '../components/layout/Header.js'
import { Footer } from '../components/layout/Footer.js'
import { TypeAheadInput } from '../components/TypeAheadInput.js'
import { useTasks } from '../hooks/use-tasks.js'
import { useSelectedTask, useKeyboardNav } from '../hooks/use-navigation.js'
import { AppStateContext } from '../app.js'

function KeyboardHandler({ flatTaskIds }: { flatTaskIds: string[] }) {
  useKeyboardNav(flatTaskIds)
  return null
}

export function DashboardView() {
  const { tasksByCategory, flatTaskIds } = useTasks()
  const selectedTaskId = useSelectedTask(flatTaskIds)
  const { isRawModeSupported } = useStdin()
  const { state, setState } = useContext(AppStateContext)

  const closeTypeahead = useCallback(() => {
    setState((s) => ({ ...s, typeaheadOpen: false }))
  }, [setState])

  return (
    <Box flexDirection="column">
      <Header />
      {isRawModeSupported && !state.typeaheadOpen && (
        <KeyboardHandler flatTaskIds={flatTaskIds} />
      )}
      {state.typeaheadOpen && <TypeAheadInput onClose={closeTypeahead} />}
      {tasksByCategory.map(({ category, tasks }) => (
        <Box key={category} dimColor={state.typeaheadOpen}>
          <CategoryGroup
            category={category}
            tasks={tasks}
            selectedTaskId={state.typeaheadOpen ? null : selectedTaskId}
          />
        </Box>
      ))}
      <Footer />
    </Box>
  )
}
