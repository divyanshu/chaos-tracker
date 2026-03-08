import { useMemo, useCallback, useEffect, useRef } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  useNodesState,
  type NodeTypes,
  type OnNodeDrag,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useUIStore } from '@/stores/ui-store'
import { useTasks } from '@/hooks/use-tasks'
import { TaskNode } from './TaskNode'
import { CategoryGroup } from './CategoryGroup'
import { layoutTasks } from './auto-layout'
import { saveNodePosition } from './position-store'

const nodeTypes: NodeTypes = {
  task: TaskNode,
  categoryGroup: CategoryGroup,
}

export function CanvasView() {
  const { data: tasks, isLoading } = useTasks()
  const selectNode = useUIStore((s) => s.selectNode)
  const initializedRef = useRef(false)

  const computedNodes = useMemo(() => {
    if (!tasks || tasks.length === 0) return []
    return layoutTasks(tasks).nodes
  }, [tasks])

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])

  // Set nodes only on first successful load
  useEffect(() => {
    if (computedNodes.length > 0 && !initializedRef.current) {
      initializedRef.current = true
      setNodes(computedNodes)
    }
  }, [computedNodes, setNodes])

  // Sync data changes (status, title, etc.) without resetting positions
  useEffect(() => {
    if (!initializedRef.current || !tasks) return
    setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.type !== 'task') return node
        const task = tasks.find((t) => t.id === node.id)
        if (!task) return node
        const currentData = node.data as Record<string, unknown>
        if (
          currentData.title === task.title &&
          currentData.status === task.status &&
          currentData.category === task.category &&
          currentData.lastTouched === task.last_touched
        ) {
          return node
        }
        return {
          ...node,
          data: {
            ...currentData,
            title: task.title,
            status: task.status,
            category: task.category,
            lastTouched: task.last_touched,
          },
        }
      })
    })
  }, [tasks, setNodes])

  const onNodeDragStop: OnNodeDrag = useCallback((_event, node) => {
    saveNodePosition(node.id, node.position)
  }, [])

  const setQuickEntryOpen = useUIStore((s) => s.setQuickEntryOpen)

  const onPaneDoubleClick = useCallback(() => {
    setQuickEntryOpen(true)
  }, [setQuickEntryOpen])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[72px] w-[220px] animate-pulse rounded-lg bg-muted"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <span className="text-sm">Loading tasks...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={(_e, node) => {
          if (node.type === 'task') selectNode(node.id)
        }}
        onPaneClick={() => selectNode(null)}
        onDoubleClick={onPaneDoubleClick}
        onNodeDragStop={onNodeDragStop}
        snapToGrid
        snapGrid={[20, 20]}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="hsl(var(--muted-foreground))"
          className="opacity-30"
        />
        <MiniMap
          nodeStrokeWidth={3}
          pannable
          zoomable
          className="!bottom-16 !right-4"
        />
        <Controls
          showInteractive={false}
          className="!bottom-16 !left-4"
        />
      </ReactFlow>
    </div>
  )
}
