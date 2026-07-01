import type { Edge, Node } from '@xyflow/react'
import type { FamilyData, Person } from '@/types/family'

const COL_WIDTH = 220
const ROW_HEIGHT = 160

export interface PersonNodeData extends Record<string, unknown> {
  person: Person
}

/**
 * Compute a simple generational layout: people with no parent sit at the top
 * (generation 0); each child drops one row below its deepest parent. Within a
 * generation, nodes are spread left-to-right in insertion order.
 *
 * This is deliberately a lightweight heuristic (no external layout engine) —
 * good enough for the MVP graph view; swap for dagre/elk if trees get large.
 */
export function layoutFamily(data: FamilyData): {
  nodes: Node<PersonNodeData>[]
  edges: Edge[]
} {
  const parentToChildren = new Map<string, string[]>()
  const childHasParent = new Set<string>()

  for (const rel of data.relationships) {
    if (rel.type !== 'parent') continue
    const kids = parentToChildren.get(rel.fromId) ?? []
    kids.push(rel.toId)
    parentToChildren.set(rel.fromId, kids)
    childHasParent.add(rel.toId)
  }

  // Assign a generation (depth) to every person via BFS from the roots.
  const generation = new Map<string, number>()
  const roots = data.people.filter((p) => !childHasParent.has(p.id))
  const queue: string[] = roots.map((p) => p.id)
  for (const id of queue) generation.set(id, 0)

  while (queue.length) {
    const id = queue.shift()!
    const depth = generation.get(id) ?? 0
    for (const childId of parentToChildren.get(id) ?? []) {
      const next = depth + 1
      if (next > (generation.get(childId) ?? -1)) {
        generation.set(childId, next)
        queue.push(childId)
      }
    }
  }

  // Bucket people by generation and place them.
  const byGen = new Map<number, Person[]>()
  for (const p of data.people) {
    const g = generation.get(p.id) ?? 0
    const bucket = byGen.get(g) ?? []
    bucket.push(p)
    byGen.set(g, bucket)
  }

  const nodes: Node<PersonNodeData>[] = []
  for (const [gen, people] of byGen) {
    people.forEach((person, i) => {
      nodes.push({
        id: person.id,
        type: 'person',
        position: { x: i * COL_WIDTH, y: gen * ROW_HEIGHT },
        data: { person },
      })
    })
  }

  const edges: Edge[] = data.relationships.map((rel) => ({
    id: rel.id,
    source: rel.fromId,
    target: rel.toId,
    type: rel.type === 'spouse' ? 'straight' : 'smoothstep',
    animated: false,
    style:
      rel.type === 'spouse'
        ? { stroke: '#e879a6', strokeDasharray: '4 4' }
        : { stroke: '#64748b' },
  }))

  return { nodes, edges }
}
