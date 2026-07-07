# Entity — User Account (+ authority stub)

> A login, optionally linked to one [[entity-person]]. The *authority* model (roles, branch
> scoping, invitations) is **designed in [Stage 4](../04-architecture/decisions.md)** — this doc
> defines only the account's data shape and the person-link. Status: 🟢 validated (2026-07-02) (auth deferred).

## User Account

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✓ | likely = auth provider's user id (Stage 4) |
| `email` | text | ✓ | login identity |
| `display_name` | text | | |
| `linked_person_id` | uuid → [[entity-person]] | | 0..1; the node this account *is* |
| `created_at` | timestamptz | ✓ | |

**Invariant:** a Person has at most one User and a User links to at most one Person (`unique`
on `linked_person_id`). An account can exist before it's linked (invited but not yet claimed) and a
Person can exist forever unlinked.

## Grant (authority — defined in [Stage 4](../04-architecture/decisions.md))

Model B is now settled, so the authority tables are concrete. **Editable scope is computed from
grants + the tree, never stored per content row** (P7).

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✓ | P1 |
| `user_id` | uuid → User Account | ✓ | grant holder |
| `role` | enum | ✓ | `super, branch, node` |
| `anchor_person_id` | uuid → [[entity-person]] | | null for `super`; the scope anchor otherwise |
| `include_parents` | boolean | ✓ | `true` = self-anchored (reaches to anchor's parents); `false` = delegated, descendants-only (AD-6) |
| `granted_by` (= `created_by`) | uuid → User Account | ✓ | always a Super Admin (AD-7) |
| `created_at` | timestamptz | ✓ | |
| `revoked_at` | timestamptz | | soft-revoke; a grant is active while null |

**Branch is NOT a stored entity** — it's the `can_edit(person)` computation over a grant's anchor
(AD-3, AD-12). No `branches` table.

## Invitation

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | uuid | ✓ | P1 |
| `email` | text | ✓ | invitee |
| `link_person_id` | uuid → [[entity-person]] | | node the new account will link to |
| `role` | enum | | optional grant to apply on acceptance (`branch`/`node`) |
| `anchor_person_id` | uuid → [[entity-person]] | | for the applied grant |
| `token` | text | ✓ | single-use |
| `expires_at` | timestamptz | | |
| `accepted_at` | timestamptz | | |
| `created_by` | uuid → User Account | ✓ | a Super Admin |

*Access request* (Member → Super) is a lightweight flow; modeled at journey time (Stage 5) — may
be a simple `access_request` row or an out-of-band message.

## Decisions
- **D-U1 — Account and Person are separate entities with a nullable link**, never merged. Supports
  unlinked nodes (kids/elderly/deceased) and pre-claim invites cleanly ([[domain-map]] tension §2).
- **D-U2 — Authority is not stored on content rows** (P7); it's evaluated by `can_edit()` from
  grants + tree at access time (AD-12).
- **D-U3 — No `branches` table.** A branch is a computed scope (AD-3), so authority is expressed by
  `grants` (anchor + shape), not by materializing group membership.
