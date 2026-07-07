# J6 — Edit a person / mark deceased

> Actor: **Editor** (`can_edit`, AD-12). A variant of [[journey-J5-add-person]] on an existing node.
> Status: 🟢 documented. Related: [[_index]], [[entity-person]].

## Entry points
- [[journey-J16-person-profile]] "Edit"; inline on a graph node.

## Steps
1. Edit any [[entity-person]] field (names, gender, dates+precision, notes, avatar).
2. **Mark deceased**: set `deceased = true` (+ optional `death_date`+precision) — P5.
3. Save (`updated_at` bumped). If not permitted → [[journey-J2-request-access]] (request/suggest).

## Data touchpoints
`person` (update); avatar change references [[entity-media]] (`avatar_media_id`).

## Edge cases
- Editing your own linked node is always allowed (baseline, AD-4).
- Soft-delete a person (`deleted_at`) = delete authority per AD-13; warn about attached
  relationships/events (they reference this person).

## Connections
[[journey-J16-person-profile]], [[journey-J8]] (residence), [[journey-J13-upload-media]] (avatar).
