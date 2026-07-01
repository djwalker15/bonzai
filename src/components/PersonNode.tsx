import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import type { PersonNodeData } from '@/lib/layout'

function yearOf(date: string | null): string | null {
  if (!date) return null
  const y = date.slice(0, 4)
  return /^\d{4}$/.test(y) ? y : null
}

/** Card node representing one family member in the graph view. */
export function PersonNode({ data }: NodeProps<Node<PersonNodeData>>) {
  const { person } = data
  const born = yearOf(person.birthDate)
  const died = yearOf(person.deathDate)
  const lifespan = born || died ? `${born ?? '?'}–${died ?? ''}` : null

  return (
    <div className="min-w-[168px] rounded-lg border border-border bg-card px-3 py-2 text-card-foreground shadow-sm">
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
      <div className="text-sm font-semibold leading-tight">
        {person.firstName} {person.lastName}
      </div>
      {lifespan && (
        <div className="mt-0.5 text-xs text-muted-foreground">{lifespan}</div>
      )}
      {person.location && (
        <div className="text-xs text-muted-foreground">{person.location}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </div>
  )
}
