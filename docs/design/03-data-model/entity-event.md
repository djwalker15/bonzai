# Entity — Event (+ EventParticipant)

> A dated happening; powers the **timeline** view. One flexible entity (Stage 2 decision):
> individual vs. shared is expressed by participant count. Status: 🟢 validated (2026-07-02). Patterns:
> [[_patterns]]. Related: [[entity-person]], [[entity-place]], [[entity-media]].

## Event

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✓ | P1 |
| `title` | text | | e.g. "Wedding of A & B"; can be auto-generated from type + participants |
| `type` | enum | ✓ | `birth, death, marriage, divorce, adoption, graduation, military_service, immigration, residence_change, reunion, trip, other` |
| `date` / `date_precision` | date / enum | ✓ | P4 |
| `end_date` / `end_date_precision` | date / enum | | ranges (service, trips) |
| `place_id` | uuid → [[entity-place]] | | where it happened |
| `notes` | text | | |
| audit + `deleted_at` | | | P2, P3 |

## EventParticipant (join)

| Field | Type | Req | Notes |
|---|---|---|---|
| `event_id` | uuid → Event | ✓ | |
| `person_id` | uuid → [[entity-person]] | ✓ | |
| `role` | enum | ✓ | `subject, spouse, parent, child, graduate, attendee, officiant, other` |
| `created_at` / `created_by` | | | P2 |

PK `(event_id, person_id, role)`. Birth → 1 `subject`; marriage → 2 `spouse`; reunion → N
`attendee`.

## Decisions
- **D-E1 — One Event entity + participant join** (Stage 2). Participant count/role expresses the
  individual-vs-family distinction; one timeline query.
- **D-E2 — Type-specific fields handled by optional columns**, not subtypes. Only `end_date` is
  needed beyond the common set today; add sparingly.
- **D-E3 — Events are descriptive, not structural.** A `marriage`/`birth`/`adoption` event does
  **not** by itself create kinship — the corresponding [[entity-relationship]] row is the source of
  truth for the tree. They may be linked, and the UI can offer "add the marriage event" when a
  spouse relationship is created. Rationale: keeps the graph independent of timeline completeness.
- **D-E4 — Residence changes** can appear both as a `residence_change` event (timeline) and a
  [[entity-place]] `Residence` row (map). See [[entity-place]] D-PL3 for how we avoid double entry.

## Open
- Should creating a `marriage` relationship **auto-offer** a marriage event (and vice versa)? (UX
  convenience vs. duplication — resolve in Stage 5 journeys.)
- Do we want an `event_media` link, or is Media→event (single `event_id` on Media) enough? See
  [[entity-media]].
