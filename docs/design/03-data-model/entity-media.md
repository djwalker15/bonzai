# Entity — Media (+ MediaTag)

> An uploaded photo (video later); powers the **gallery** view and profile photos. Status: 🟡
> validated (2026-07-02). Patterns: [[_patterns]]. Related: [[entity-person]], [[entity-event]], [[entity-place]].

## Media

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✓ | P1 |
| `storage_path` | text | ✓ | object-storage key (P8), not a blob |
| `kind` | enum | ✓ | `photo, video` (video post-MVP but modeled now) |
| `caption` | text | | |
| `taken_date` / `taken_date_precision` | date / enum | | when the photo was taken (P4) |
| `place_id` | uuid → [[entity-place]] | | where it was taken |
| `event_id` | uuid → [[entity-event]] | | the event it belongs to |
| `uploaded_by` (= `created_by`) | uuid → [[entity-user-account]] | ✓ | P2 |
| audit + `deleted_at` | | | P2, P3 |

## MediaTag (join — people in the media)

| Field | Type | Req | Notes |
|---|---|---|---|
| `media_id` | uuid → Media | ✓ | |
| `person_id` | uuid → [[entity-person]] | ✓ | |
| `created_at` / `created_by` | | | P2 |

PK `(media_id, person_id)`. Tagging drives "tap a face → jump to the graph node" (Stage 2 scenario
5) and the per-person gallery filter.

## Album (+ AlbumMedia join)

Named collections (Stage 3 decision — full media vision). A photo/video can live in **multiple**
albums, so the link is many-to-many.

**Album**

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✓ | P1 |
| `title` | text | ✓ | e.g. "Reunion 2026" |
| `description` | text | | |
| `cover_media_id` | uuid → Media | | album thumbnail |
| `event_id` | uuid → [[entity-event]] | | optional: an album *for* an event |
| audit + `deleted_at` | | | P2, P3 |

**AlbumMedia (join)**

| Field | Type | Req | Notes |
|---|---|---|---|
| `album_id` | uuid → Album | ✓ | |
| `media_id` | uuid → Media | ✓ | |
| `sort_order` | int | | manual ordering within the album |
| `created_at` / `created_by` | | | P2 |

PK `(album_id, media_id)`.

## Decisions
- **D-M1 — Media is a first-class entity from the start**, even though gallery is a post-MVP view,
  because profile photos ([[entity-person]] `avatar_media_id`) reference it. Building it once avoids
  a later migration of `photoUrl` strings.
- **D-M2 — Single `event_id` / `place_id` per media**, but **Albums are many-to-many** — a photo
  belongs to at most one event/place but can appear in several albums.
- **D-M3 — Face bounding boxes deferred.** MediaTag records *who* is in a photo, not *where* in the
  frame. A `bbox` column is a documented future add for face-hover UI.
- **D-M4 — Full media vision modeled now** (Stage 3 decision): photos **and** video (`kind`) and
  **Albums**. The model carries all three even though *when* each ships is a Stage 6 scope call —
  video transcoding/storage provisioning is flagged for [Stage 7](../07-implementation/implementation-plan.md).

## Open
- Video transcoding pipeline + storage limits → sizing decision in [Stage 7](../07-implementation/implementation-plan.md).
