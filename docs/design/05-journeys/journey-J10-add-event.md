# J10 — Add an event (+ participants)

> Actor: **any Member** (content = open create, AD-10). Feeds the **timeline**. Status: 🟢
> documented. Related: [[_index]], [[entity-event]], [[decisions]] (AD-10).

## Entry points
- Timeline "Add event"; a person profile "Add event"; from a photo ([[journey-J13-upload-media]]);
  offered after a marriage relationship ([[journey-J7-link-relationship]]).

## Steps
1. Pick `type` (birth, marriage, graduation, move, reunion, trip, …) + `date`(+precision) [+ `end_date`].
2. Optional `place` ([[entity-place]] — reuse or create).
3. Add **participants**: people + `role` (subject / spouse / attendee / …). Tagging people you
   can't edit is allowed (it's content, not a person-record change).
4. Notes; optionally attach media.
5. Insert `event` (`created_by = me`) + `event_participant` rows → appears on the timeline.

## Data touchpoints
`event` (insert) · `event_participant` (insert) · `place` (read/insert) · `media` link.

## Edge cases
- **Editing/deleting later**: author or Super only (AD-10) — plain participants can't edit.
- Approximate dates ("circa"); a residence move may also create a [[entity-place]] `Residence`
  (offer, don't force — [[entity-place]] D-PL3).
- Duplicate life events (two "births") → warn.

## Connections
[[journey-J7-link-relationship]] (marriage), [[journey-J13-upload-media]], [[journey-J12]] (map, if
placed), [[journey-J16-person-profile]].
