import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { FamilyData } from '@/types/family'
import { layoutFamily } from '@/lib/layout'
import { PersonNode } from '@/components/PersonNode'

const nodeTypes: NodeTypes = { person: PersonNode }

/** The MVP surface: a pannable/zoomable family tree rendered from the store. */
export function FamilyGraph({ data }: { data: FamilyData }) {
  const { nodes, edges } = useMemo(() => layoutFamily(data), [data])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      proOptions={{ hideAttribution: true }}
    >
      <Background />
      <Controls />
      <MiniMap pannable zoomable />
    </ReactFlow>
  )
}
