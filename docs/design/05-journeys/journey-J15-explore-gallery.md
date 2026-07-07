# J15 — Explore the gallery

> Actor: **any Member** (view-all). Read-only browse of [[entity-media]]. Status: 🟢 documented.
> Related: [[_index]], [[journey-J13-upload-media]].

## Entry points
- Gallery tab; a person profile's "photos"; an event's photos; an album.

## What's shown & interactions
- Grid of media; **filters**: by person (tags) / event / place / album / date.
- Lightbox with caption, tagged people (tap a face → [[journey-J16-person-profile]]), place, event.
- "Upload" → [[journey-J13-upload-media]].

## Data touchpoints
Reads `media`, `media_tag`, `album`/`album_media`, `person`, `event`, `place`.

## Edge cases
- Video playback (post-MVP); untagged media still browsable; deleted media hidden (soft delete).

## Connections
[[journey-J13-upload-media]], [[journey-J14]], [[journey-J16-person-profile]].
