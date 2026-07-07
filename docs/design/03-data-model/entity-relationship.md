# Entity — Relationship

> A kinship tie between two [[entity-person]]s. Full kinship set (Stage 2 decision). Status: 🟡
> validated (2026-07-02). Patterns: [[_patterns]].

## Approach: one typed table (recommended)

A single `relationships` table with a `type` enum, rather than separate tables per kind. Matches
the scaffold's shape, keeps one code path and one query for the graph layout, and extends by adding
enum values.

## Fields

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✓ | P1 |
| `from_person_id` | uuid → [[entity-person]] | ✓ | for directed types, the "senior" party (parent/guardian) |
| `to_person_id` | uuid → [[entity-person]] | ✓ | for directed types, the "junior" party (child/ward) |
| `type` | enum | ✓ | see below |
| `start_date` / `start_date_precision` | date / enum | | e.g. marriage/partnership start (P4) |
| `end_date` / `end_date_precision` | date / enum | | e.g. divorce/end of partnership (P4) |
| `status` | enum | | for pairings: `active | former | widowed` (nullable for parent types) |
| `notes` | text | | |
| audit + `deleted_at` | | | P2, P3 |

### `type` enum
- **Directed (from = senior, to = junior):** `biological_parent`, `adoptive_parent`, `step_parent`,
  `foster_parent`, `guardian`.
- **Symmetric (order not meaningful):** `spouse`, `partner`.

## Derived, not stored
- **Siblings** — shared parent.
- **Half-siblings** — share exactly one parent.
- **Step-siblings** — a parent's spouse's children.
- **Grandparent/cousin/etc.** — graph traversal.

Storing only the atomic ties above keeps the model small; everything else is computed for display.

## Decisions
- **D-R1 — Single typed table over split tables.** One code path for layout/traversal; extensible
  via enum. Rejected: per-category tables (parent-child / partnership / guardianship) — cleaner
  per-type fields but 3× the query/merge cost for the graph, and this app's relationship fields are
  nearly uniform.
- **D-R2 — Directionality by convention on directed types** (`from` = parent-like). Symmetric types
  ignore order. A `unique(from,to,type)` + `no_self_relationship` check carries over from the
  scaffold migration; add a normalization rule so symmetric pairs aren't double-entered.
- **D-R3 — Marriages carry dates + status here**, and *may* also have a corresponding `marriage`
  [[entity-event]] for the timeline. Structural tie (relationship) and timeline entry (event) are
  separate concerns — see [[entity-event]] D-E3.

## Open
- Do we need `biological_parent` vs a generic `parent` + a `biological boolean`? (Enum vs. flag.)
- Confirm the pairing `status` values.
