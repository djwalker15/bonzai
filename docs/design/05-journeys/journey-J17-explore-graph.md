# J17 — Navigate & explore the graph

> Actor: **any Member** (view-all). The default view; read/navigate the tree the scaffold already
> renders (React Flow). Status: 🟢 documented. Related: [[_index]], [[journey-J16-person-profile]],
> [[entity-relationship]].

## Entry points
- App home / Graph tab; deep-link to a focused person.

## What's shown & interactions
- Generational layout (roots up, children down); pan/zoom; spouse & parent edges styled by type.
- Tap a node → [[journey-J16-person-profile]]; "focus" to center a person + kin.
- **Filters**: highlight a branch; toggle deceased; collapse distant kin for large trees.
- Inline "+ add parent/child/spouse" → [[journey-J5-add-person]] (if `can_edit`).

## Data touchpoints
Reads `person`, `relationship`; layout is derived (siblings/half/step computed).

## Edge cases
- Large / complex trees (multiple marriages, adoptions) strain the scaffold's heuristic layout —
  flagged for a real layout engine (dagre/elk) in [Stage 7](../07-implementation/implementation-plan.md).
- Married-in partners drawn beside their blood relative; disconnected people (no relationships) shown in a tray.

## Connections
Hub view → [[journey-J16-person-profile]], [[journey-J5-add-person]], [[journey-J7-link-relationship]].
