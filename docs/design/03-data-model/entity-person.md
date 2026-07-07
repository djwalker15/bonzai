# Entity — Person

> The hub of the whole model. A human in the family tree, linked or not to a [[entity-user-account]].
> Status: 🟢 validated (2026-07-02). Patterns: [[_patterns]]. Related: [[entity-relationship]], [[entity-event]],
> [[entity-media]], [[entity-place]].

## Fields

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✓ | P1 |
| `first_name` | text | ✓ | |
| `middle_name` | text | | |
| `last_name` | text | ✓ | current/family surname |
| `birth_surname` | text | | maiden / surname at birth, if different |
| `preferred_name` | text | | nickname / what the family calls them |
| `suffix` | text | | Jr., III, etc. |
| `gender` | text | | optional, free-ish (not an enum — families vary); pronouns optional in `notes` |
| `birth_date` | date | | + `birth_date_precision` (P4) |
| `birth_date_precision` | enum | | P4 |
| `deceased` | boolean | ✓ | default `false` (P5) |
| `death_date` | date | | + `death_date_precision` (P4) |
| `death_date_precision` | enum | | P4 |
| `notes` | text | | rich free text — the "stories" field (Stage 2 decision) |
| `avatar_media_id` | uuid → [[entity-media]] | | profile photo as a Media reference (P8) |
| `created_at`/`updated_at`/`created_by`/`deleted_at` | | | P2, P3 |

## Relationships
- **Kinship** → [[entity-relationship]] (parent/spouse/partner/adoptive/step/guardian…). Siblings
  are *derived* (shared parent), not stored.
- **User link** → [[entity-user-account]] (0..1 each way). A Person may have no account (unlinked
  node); an account links to exactly one Person.
- **Events** → via [[entity-event]] `EventParticipant`.
- **Residences** → via [[entity-place]] `Residence` (many over time).
- **Media** → tagged via [[entity-media]] `MediaTag`; one may be the `avatar`.

## Decisions
- **D-P1 — `gender` is optional free text, not an enum.** Families are diverse and this isn't a
  genealogy-record app; avoid a rigid enum. Reconsider only if a view needs to branch on it.
- **D-P2 — Living status is an explicit boolean** (P5), not derived from `death_date`.
- **D-P3 — `notes` carries stories** (Stage 2), so no separate Story entity in the MVP model.
- **D-P4 — Profile photo is a Media reference** (`avatar_media_id`), replacing the scaffold's raw
  `photoUrl` string, so profile pics participate in the gallery and get proper authorship/dates.

## Open
- Do we need `pronouns` and/or `title` (Dr., etc.) as first-class fields, or is `notes` enough?
- Per-person **privacy/visibility** flag → deferred to [Stage 4](../04-architecture/decisions.md).

## Delta from scaffold (`src/types/family.ts`)
Adds middle/birth-surname/preferred/suffix/gender, split date-precision fields, `deceased`, and
swaps `photoUrl: string` → `avatar_media_id`. `location` moves out to residence history
([[entity-place]]). Migration handled in Stage 8.
