import { useEffect, useCallback } from 'react'
import { useReactFlow, type Node } from '@xyflow/react'
import { toast } from 'sonner'
import { useUIStore } from '@/stores/ui-store'
import { useUpdateTask, useTouchTask, useDeleteTask } from './use-tasks'
import { nextStatus, availableActions } from '@/lib/task-status'

/**
 * Global keyboard handler — CLI-style shortcuts for canvas interaction.
 * Only active when no panel/dialog is open and no input is focused.
 */
export function useKeyboard() {
  const {
    selectedNodeId,
    selectNode,
    setQuickEntryOpen,
    quickEntryOpen,
    setCommandPaletteOpen,
    commandPaletteOpen,
    openTaskDetail,
    taskDetailId,
    closeTaskDetail,
    setHelpOpen,
    helpOpen,
    toggleLayoutMode,
    toggleTheme,
  } = useUIStore()

  const { getNodes, fitView, zoomIn, zoomOut, setCenter } = useReactFlow()
  const updateTask = useUpdateTask()
  const touchTask = useTouchTask()
  const deleteTask = useDeleteTask()

  const getTaskNodes = useCallback(() => {
    return getNodes().filter((n) => n.type === 'task')
  }, [getNodes])

  const findNearestNode = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      const taskNodes = getTaskNodes()
      if (taskNodes.length === 0) return null

      if (!selectedNodeId) return taskNodes[0] ?? null

      const current = taskNodes.find((n) => n.id === selectedNodeId)
      if (!current) return taskNodes[0] ?? null

      const cx = current.position.x
      const cy = current.position.y

      let best: Node | null = null
      let bestDist = Infinity

      for (const node of taskNodes) {
        if (node.id === current.id) continue
        const dx = node.position.x - cx
        const dy = node.position.y - cy

        let inDirection = false
        switch (direction) {
          case 'up': inDirection = dy < -10; break
          case 'down': inDirection = dy > 10; break
          case 'left': inDirection = dx < -10; break
          case 'right': inDirection = dx > 10; break
        }

        if (!inDirection) continue

        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < bestDist) {
          bestDist = dist
          best = node
        }
      }

      return best
    },
    [selectedNodeId, getTaskNodes],
  )

  const cycleNode = useCallback(
    (forward: boolean) => {
      const taskNodes = getTaskNodes()
      if (taskNodes.length === 0) return

      if (!selectedNodeId) {
        selectNode(taskNodes[0].id)
        return
      }

      const idx = taskNodes.findIndex((n) => n.id === selectedNodeId)
      const next = forward
        ? (idx + 1) % taskNodes.length
        : (idx - 1 + taskNodes.length) % taskNodes.length
      selectNode(taskNodes[next].id)
    },
    [selectedNodeId, selectNode, getTaskNodes],
  )

  const panToNode = useCallback(
    (nodeId: string) => {
      const node = getNodes().find((n) => n.id === nodeId)
      if (node) {
        setCenter(node.position.x + 110, node.position.y + 36, { duration: 300, zoom: 1 })
      }
    },
    [getNodes, setCenter],
  )

  const navigateToNode = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      const node = findNearestNode(direction)
      if (node) {
        selectNode(node.id)
        panToNode(node.id)
      }
    },
    [findNearestNode, selectNode, panToNode],
  )

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      // Always handle Escape
      if (e.key === 'Escape') {
        if (quickEntryOpen) { setQuickEntryOpen(false); return }
        if (commandPaletteOpen) { setCommandPaletteOpen(false); return }
        if (taskDetailId) { closeTaskDetail(); return }
        if (helpOpen) { setHelpOpen(false); return }
        if (selectedNodeId) { selectNode(null); return }
        return
      }

      // Don't handle shortcuts when typing in inputs
      if (isInput) return

      // Don't handle when a panel is open (except Escape handled above)
      if (quickEntryOpen || commandPaletteOpen || taskDetailId || helpOpen) return

      // Meta/Ctrl shortcuts
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'k') {
          e.preventDefault()
          setCommandPaletteOpen(true)
          return
        }
        if (e.key === '=') {
          e.preventDefault()
          zoomIn()
          return
        }
        if (e.key === '-') {
          e.preventDefault()
          zoomOut()
          return
        }
        if (e.key === '0') {
          e.preventDefault()
          fitView({ duration: 300 })
          return
        }
        if (e.key === '\\') {
          e.preventDefault()
          toggleLayoutMode()
          return
        }
        return
      }

      // Navigation
      switch (e.key) {
        case 'ArrowUp':
        case 'k':
          e.preventDefault()
          navigateToNode('up')
          return
        case 'ArrowDown':
        case 'j':
          e.preventDefault()
          navigateToNode('down')
          return
        case 'ArrowLeft':
        case 'h':
          e.preventDefault()
          navigateToNode('left')
          return
        case 'ArrowRight':
          // only arrow key, not 'l' (used for layout)
          e.preventDefault()
          navigateToNode('right')
          return
        case 'Tab':
          e.preventDefault()
          cycleNode(!e.shiftKey)
          return
      }

      // Global actions (no selection needed)
      switch (e.key) {
        case '/':
          e.preventDefault()
          setQuickEntryOpen(true)
          return
        case 'n':
          e.preventDefault()
          setQuickEntryOpen(true)
          return
        case ':':
          e.preventDefault()
          setCommandPaletteOpen(true)
          return
        case '?':
          e.preventDefault()
          setHelpOpen(true)
          return
        case 'l':
          e.preventDefault()
          toggleLayoutMode()
          return
      }

      // Task actions (need selection)
      if (!selectedNodeId) return

      const nodes = getNodes()
      const node = nodes.find((n) => n.id === selectedNodeId)
      if (!node || node.type !== 'task') return

      const taskData = node.data as { status: string; title: string }

      switch (e.key) {
        case 's': {
          const actions = availableActions(taskData.status as Parameters<typeof availableActions>[0])
          if (actions.includes('start')) {
            updateTask.mutate({ id: selectedNodeId, changes: { status: nextStatus('start') } })
            toast.success(`Started "${taskData.title}"`)
          }
          return
        }
        case 'p': {
          const actions = availableActions(taskData.status as Parameters<typeof availableActions>[0])
          if (actions.includes('pause')) {
            updateTask.mutate({ id: selectedNodeId, changes: { status: nextStatus('pause') } })
            toast.success(`Paused "${taskData.title}"`)
          }
          return
        }
        case 'c': {
          updateTask.mutate({ id: selectedNodeId, changes: { status: 'completed' } })
          toast.success(`Completed "${taskData.title}"`)
          return
        }
        case 't': {
          touchTask.mutate(selectedNodeId)
          toast.success(`Touched "${taskData.title}"`)
          return
        }
        case 'd': {
          if (confirm('Delete this task?')) {
            deleteTask.mutate(selectedNodeId)
            toast.success(`Deleted "${taskData.title}"`)
            selectNode(null)
          }
          return
        }
        case 'Enter':
        case 'e': {
          openTaskDetail(selectedNodeId)
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    selectedNodeId,
    selectNode,
    quickEntryOpen,
    setQuickEntryOpen,
    commandPaletteOpen,
    setCommandPaletteOpen,
    taskDetailId,
    closeTaskDetail,
    openTaskDetail,
    helpOpen,
    setHelpOpen,
    toggleLayoutMode,
    toggleTheme,
    navigateToNode,
    cycleNode,
    updateTask,
    touchTask,
    deleteTask,
    fitView,
    zoomIn,
    zoomOut,
    getNodes,
  ])
}
