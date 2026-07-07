# J13 — Upload media (+ tag people / attach)

> Actor: **any Member** (content = open create, AD-10). Feeds the **gallery** and profile photos.
> Status: 🟢 documented. Related: [[_index]], [[entity-media]], [[decisions]] (AD-8, AD-10).

## Entry points
- Gallery "Upload"; profile "Add photo"; event "Add photos" ([[journey-J10-add-event]]).

## Steps
1. Select file(s) → upload to **Supabase Storage**; store `storage_path` (P8), not a blob.
2. Create `media` (`kind`, `caption`, `taken_date`+precision, optional `place_id`/`event_id`,
   `created_by = me`).
3. **Tag people** (`media_tag`) — any member may tag anyone (content).
4. Optional: set as a person's **avatar** (`person.avatar_media_id`) — requires `can_edit(person)`;
   add to an album ([[journey-J14]]).

## Data touchpoints
Storage object · `media` (insert) · `media_tag` (insert) · `person.avatar_media_id` (update, if
permitted) · `album_media` (optional insert).

## Edge cases
- **Edit/delete**: uploader or Super only (AD-10).
- File-type/size limits; **video** is modeled but post-MVP (Stage 6) — heavier storage/transcoding.
- Tagging an unlinked node is fine; removing a tag; a tag drives "tap a face → jump to the node"
  ([[journey-J16-person-profile]]).

## Connections
[[journey-J10-add-event]], [[journey-J16-person-profile]], [[journey-J14]] (album), [[journey-J12]] (map).
