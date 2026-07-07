# J14 — Create & curate an album

> Actor: **any Member** creates; edit/delete = author or Super (AD-10). Status: 🟢 documented.
> Related: [[_index]], [[entity-media]].

## Entry points
- Gallery "New album"; "Add to album" from a photo ([[journey-J13-upload-media]]); an event's "make an album".

## Steps
1. Create `album` (title, description, optional `event_id`, `cover_media_id`).
2. Add media via `album_media` (many-to-many — a photo can be in several albums); reorder (`sort_order`).

## Data touchpoints
`album` (insert) · `album_media` (insert/reorder) · `media` (read).

## Edge cases
- Removing media from an album ≠ deleting the media.
- Empty album; album author vs. contributors (author/Super edit the album itself).

## Connections
[[journey-J13-upload-media]], [[journey-J15]], [[journey-J10-add-event]].
