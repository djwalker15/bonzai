# J16 — View a person profile (the hub)

> Actor: **any Member** (view-all, AD-11). The pivot that connects all four views on one person.
> Status: 🟢 documented. Related: [[_index]], [[entity-person]], [[decisions]] (AD-11, AD-12).

## Entry points
- Tap a **graph** node; a **tagged face** in a photo; a **timeline** entry; **map** pin; search.

## Sections shown
- Header: avatar, name, lifespan (precision-aware), `deceased` styling.
- **Story/notes**; **relationships** (link back into the graph); **events** (this person's timeline
  slice); **residences** (their map slice / migration); **media** they're tagged in (gallery slice).
- **Edit affordances** appear only if `can_edit(person)` (AD-12). If unlinked and I'm a Super:
  **"Invite to claim this node"** ([[journey-J3-invite-relative]]).

## Data touchpoints
Reads `person`, `relationship`, `event`/`event_participant`, `residence`, `media`/`media_tag`.

## Edge cases
- Linked vs. unlinked display; deceased vs. living; everything is viewable (view-all), only editing
  gates on scope.

## Connections
The hub → every view and into [[journey-J5-add-person]], J6, [[journey-J7-link-relationship]],
[[journey-J10-add-event]], [[journey-J13-upload-media]].
