# J7 — Link a relationship

> Actor: **Editor** (`can_edit` on the affected people). Draws the ties the graph renders. Status:
> 🟢 documented. Related: [[_index]], [[journey-J5-add-person]], [[entity-relationship]].

## Entry points
- Inline from [[journey-J5-add-person]] (add parent/child/spouse/partner).
- Connect two existing nodes ("link these people").

## Steps
1. Pick the two people + `type` (full kinship enum: biological/adoptive/step/foster parent,
   guardian, spouse, partner).
2. Optional `start_date` / `end_date` / `status` (marriage → dates, divorced/widowed).
3. Validate: `no_self_relationship`; unique `(from,to,type)`; symmetric normalization for
   spouse/partner; **cycle check** (a person cannot become their own ancestor).
4. Insert `relationship`; graph re-lays out; siblings/half/step recompute (derived).

## Data touchpoints
`relationship` (insert) · reads `person`.

## Edge cases
- Duplicate or reciprocal duplicate of a symmetric tie → block.
- Conflicting biology (two `biological_parent`s of the same sex) → warn, allow (blended families).
- Permission denied → [[journey-J2-request-access]].
- Optionally offer to also create a `marriage`/`adoption` [[entity-event]] for the timeline
  (descriptive, not structural — AD, [[entity-event]] D-E3).

## Connections
[[journey-J5-add-person]], [[journey-J10-add-event]] (marriage event), graph
([[journey-J17]]).
