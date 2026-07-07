# Entity — Collaboration (Access Request + Suggested Edit)

> **Surfaced by [[journey-J2-request-access]]**, not the original domain map — logged here so the
> model stays complete (the vault is alive). Both are **post-MVP candidates**; scope decided in
> [Stage 6](../06-scope/mvp-scope.md). Status: 🟢 validated (2026-07-06). Patterns: [[_patterns]].
> Authority context: [[decisions]] (AD-7, AD-8).

## AccessRequest — "please give me a grant"
| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✓ | P1 |
| `user_id` | uuid → [[entity-user-account]] | ✓ | requester |
| `requested_role` | enum | ✓ | `branch, node, edit_person` |
| `anchor_person_id` | uuid → [[entity-person]] | | the scope they want |
| `note` | text | | why |
| `status` | enum | ✓ | `pending, approved, declined` |
| `reviewed_by` | uuid → [[entity-user-account]] | | a Super |
| `created_at` / `reviewed_at` | timestamptz | | P2 |

Approving an AccessRequest **creates a `grant`** ([[journey-J4-grant-role]]).

## SuggestedEdit — "here's the change I'd make"
| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✓ | P1 |
| `proposer_user_id` | uuid → [[entity-user-account]] | ✓ | |
| `target_type` | enum | ✓ | `person, relationship, residence, event, media` |
| `target_id` | uuid | ✓ | the row to change (polymorphic) |
| `proposed_change` | jsonb | ✓ | field→new-value payload |
| `note` | text | | |
| `status` | enum | ✓ | `pending, accepted, rejected` |
| `reviewed_by` | uuid → [[entity-user-account]] | | a Super |
| `created_at` / `reviewed_at` | timestamptz | | P2 |

Accepting applies `proposed_change` to the target row (as the reviewing Super).

## Decisions
- **D-C1 — Two distinct mechanisms** (founder's choice): *request a grant* (AccessRequest) vs.
  *propose a specific change* (SuggestedEdit). Kept separate — different payloads, different review.
- **D-C2 — `SuggestedEdit.target` is polymorphic** (`target_type` + `target_id`) rather than an FK
  per entity — the only place we use this pattern; justified because a proposal can target any
  editable row and we don't want N near-identical tables.
- **D-C3 — Both are strong post-MVP candidates.** The reunion doesn't need a moderation queue; the
  tree + core capture do. Flag for [Stage 6](../06-scope/mvp-scope.md).
