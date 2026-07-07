# Entity — Place (+ Residence)

> A geographic location; powers the **map** view. Shared Place entity + per-person residence
> history (Stage 2 decision). Status: 🟢 validated (2026-07-02). Patterns: [[_patterns]]. Related:
> [[entity-person]], [[entity-event]].

## Place

Reusable — referenced by residences, events, and media so one real place = one pin.

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✓ | P1 |
| `name` | text | ✓ | e.g. "Austin, TX" or "Grandma's house" |
| `locality` / `region` / `country` | text | | structured parts, optional |
| `latitude` / `longitude` | numeric | | for map pins; nullable (a place may be name-only) |
| `notes` | text | | |
| audit + `deleted_at` | | | P2, P3 |

## Residence (per-person location over time)

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✓ | |
| `person_id` | uuid → [[entity-person]] | ✓ | |
| `place_id` | uuid → Place | ✓ | |
| `start_date` / `start_date_precision` | date / enum | | when they moved there (P4) |
| `end_date` / `end_date_precision` | date / enum | | null = current residence |
| `is_primary` | boolean | | the "where they are now" pin when multiple current |
| `notes` | text | | |
| audit + `deleted_at` | | | P2, P3 |

## Decisions
- **D-PL1 — Place is shared/deduped**, referenced by many entities. Rejected: free-text location on
  each entity (the scaffold's `Person.location`) — cheap but no real map and endless duplicates.
- **D-PL2 — Current residence = a Residence row with null `end_date`.** Migration history falls out
  naturally (order residences by `start_date`). The map's "where is everyone now" query =
  residences with null `end_date`.
- **D-PL3 — Residence is the source of truth for location; a `residence_change` [[entity-event]] is
  optional narrative.** When a user adds a residence with a start date, the UI *may* offer to also
  create a timeline event, but the Residence row alone is enough for the map. Avoids forcing double
  entry.

## Open
- Geocoding: do we store lat/lng from a geocoder at entry time, or just names for MVP and add pins
  later? (Infra decision → Stage 7.)
- Do Events need their own place history, or is a single `place_id` per event enough? (Currently:
  single.)

## Delta from scaffold
The scaffold's `Person.location: string | null` (a comment says it "feeds a future map view")
becomes the Place + Residence pair. Migration in Stage 8.
