import React, { useContext, useCallback } from 'react'
import { Box, useStdin } from 'ink'
import { CategoryGroup } from '../components/category/CategoryGroup.js'
import { AsciiHeader } from '../components/layout/AsciiHeader.js'
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
  const { regularCategories, completedGroup, flatTaskIds } = useTasks()
  const selectedTaskId = useSelectedTask(flatTaskIds)
  const { isRawModeSupported } = useStdin()
  const { state, setState } = useContext(AppStateContext)

  const closeTypeahead = useCallback(() => {
    setState((s) => ({ ...s, typeaheadOpen: false }))
  }, [setState])

  return (
    <Box flexDirection="column">
      <AsciiHeader />
      {isRawModeSupported && !state.typeaheadOpen && (
        <KeyboardHandler flatTaskIds={flatTaskIds} />
      )}
      {/* Regular categories */}
      {regularCategories.map(({ category, tasks }) => (
        <Box key={category} dimColor={state.typeaheadOpen}>
          <CategoryGroup
            category={category}
            tasks={tasks}
            selectedTaskId={state.typeaheadOpen ? null : selectedTaskId}
          />
        </Box>
      ))}
      {/* Completed category — collapsible */}
      {completedGroup.tasks.length > 0 && (
        <Box dimColor={state.typeaheadOpen}>
          <CategoryGroup
            category={completedGroup.category}
            tasks={completedGroup.tasks}
            selectedTaskId={state.typeaheadOpen ? null : (state.completedCollapsed ? null : selectedTaskId)}
            isCollapsed={state.completedCollapsed}
          />
        </Box>
      )}
      {state.typeaheadOpen ? (
        <TypeAheadInput onClose={closeTypeahead} />
      ) : (
        <Footer />
      )}
    </Box>
  )
}
