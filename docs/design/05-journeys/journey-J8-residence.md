# J8 — Add / edit a residence

> Actor: **Editor** (`can_edit` on the person — tree rule, AD-10). Feeds the **map**. Status: 🟢
> documented. Related: [[_index]], [[entity-place]].

## Entry points
- [[journey-J16-person-profile]] "Add residence"; inline in [[journey-J5-add-person]]; map "place someone here".

## Steps
1. Pick / create a [[entity-place]] (search existing → dedupe; else name + optional coords).
2. Set `start_date`(+precision) [+ `end_date`; null = current]; `is_primary` if multiple current.
3. Insert `residence`. Optionally offer a `residence_change` [[entity-event]] for the timeline
   (D-PL3 — not forced).

## Data touchpoints
`place` (read/insert) · `residence` (insert/update) · optional `event`.

## Edge cases
- Overlapping current residences → allow (dual homes) but nudge `is_primary`.
- Place with no coords → shows in list but not as a map pin until geocoded (Stage 7).

## Connections
[[journey-J12]] (map reads this), [[journey-J5-add-person]], [[journey-J16-person-profile]].
