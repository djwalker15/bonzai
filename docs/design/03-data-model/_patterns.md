# Data Model — Recurring Patterns

> Decided once, applied to every entity. Status: 🟢 validated (2026-07-02). Related: [[_erd]] · [[domain-map]].

Per the playbook's "consistency compounds" principle, these patterns are settled here and then
assumed by every entity doc.

## P1 — Identifiers
UUID primary keys (`id uuid default gen_random_uuid()`), matching the scaffold
(`crypto.randomUUID()` client-side, `pgcrypto` in `0001_init.sql`). Portable between local-first
and Supabase.

## P2 — Audit fields
Every **content** entity carries: `created_at timestamptz`, `updated_at timestamptz`, and
`created_by uuid` → [[entity-user-account]]. This powers trust ("who added this?") and a future
activity feed. Join tables carry `created_at` + `created_by` only.

## P3 — Soft delete
Content entities use `deleted_at timestamptz null` (soft delete), **not** hard delete — family data
is precious and accidental deletes at a chaotic reunion are likely. Queries filter
`deleted_at is null`. *(Confirmed as the default; final call logged in
[Stage 4](../04-architecture/decisions.md).)*

## P4 — Approximate dates
Historical family data is often imprecise ("circa 1890", year only). Any user-supplied date is a
pair: the `date` column + a `*_precision` enum — **`day | month | year | circa | unknown`**. The UI
renders precision-aware ("c. 1890", "March 1948", "1948–"). Applies to birth/death, event, media,
relationship start/end, and residence dates.

## P5 — Living vs. deceased
A Person has an explicit `deceased boolean` **and** an optional `death_date`. The boolean is
authoritative (someone can be known-deceased with an unknown date); "living" is `deceased = false`.
Avoids conflating "alive" with "we don't know when they died."

## P6 — Single-family scoping (for now)
Bonzai is **one family tree per instance** — no `family_id`/tenant column yet. If multi-family pull
ever emerges, the extension point is a nullable `family_id` on top-level entities (documented, not
built). Keeps the MVP simple without foreclosing the platform path.

## P7 — Authorship, not ownership, in the data layer
Rows record *who created them* (`created_by`), but **who may edit them** is computed from the
branch/role model, not stored per-row. That authority logic lives in
[Stage 4](../04-architecture/decisions.md) (RLS policies / app guards), keeping content entities
free of permission columns.

## P8 — Media references, not blobs
Images/video live in object storage (Supabase Storage, per Stage 4/7); the DB stores a
`storage_path` + metadata. A profile photo is a *reference* to a [[entity-media]] row, not a
duplicated URL.
