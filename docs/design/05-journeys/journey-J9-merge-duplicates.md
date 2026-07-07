# J9 — Merge duplicate people  ⏭️ deferred (post-MVP)

> Actor: **Super Admin**. Deferred — a chaotic reunion *will* create duplicate people, but the
> merge tool is not needed to ship. Stubbed so the need isn't forgotten. Status: ⏭️ deferred.
> Related: [[_index]], [[journey-J5-add-person]] (duplicate *warning* is MVP; *merge* is not).

## Sketch (for later)
- Pick two people flagged as the same → choose a survivor → re-point all `relationship`,
  `event_participant`, `residence`, `media_tag`, `grant` references → soft-delete the loser.
- Must be atomic (a server function — see [Stage 7](../07-implementation/implementation-plan.md)
  server-function inventory).

## MVP mitigation
[[journey-J5-add-person]] warns on likely duplicates (same name + birth date) at creation, reducing
how many arise before a merge tool exists.
