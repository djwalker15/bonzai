# J4 — Grant / revoke a role

> Actor: **Super Admin** (AD-7). Status: 🟢 documented. Related: [[_index]], [[decisions]] (AD-4,
> AD-6, AD-7), [[entity-user-account]].

## Entry points
- Admin panel "People & access"; approving an [[journey-J2-request-access]] (Path A); a node's
  "manage access".

## Steps
1. Pick the user + role (`super` / `branch` / `node`) + `anchor_person_id`.
2. Set `include_parents` — `true` for self-anchored, `false` for delegated (AD-6).
3. Insert `grant`. To revoke: set `revoked_at` (soft; auditable).

## Data touchpoints
`grant` (insert / update `revoked_at`) · `access_request` (update `status` if from J2).

## Edge cases
- Granting a role a user effectively already has (union, AD-8) → warn/no-op.
- Revoking your own last Super grant → block (never zero Supers).

## Connections
From [[journey-J2-request-access]]. Governs `can_edit` everywhere.
