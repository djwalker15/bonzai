# Stage 6 — Scope Gate (MVP Definition)

> The hard line between what ships first and what waits. Status: 🟢 validated (2026-07-06). Related: [[README]],
> [[_index]] (journeys), [[decisions]], [[_erd]].

## The switch question
> *"What's the minimum that makes the family actually use this?"*

**Answer:** they can **log in, see their shared family tree, and grow it** — each relative curating
their own line under proper permissions. That's the MVP. Not a demo of a tree; a **real, private,
multi-user family tree** the family co-builds. Decisions this session: **Graph + capture +
profile photos**, **full multi-user from day one**, **no reunion deadline pressure** (build it
right; demo whatever exists at the July 10–12 reunion).

## Phase 1 — MVP: "The living, shared tree"

### Journeys IN
[[journey-J1-accept-invite]] · [[journey-J3-invite-relative]] · [[journey-J4-grant-role]] ·
[[journey-J5-add-person]] · [[journey-J6-edit-person]] · [[journey-J7-link-relationship]] ·
[[journey-J16-person-profile]] · [[journey-J17-explore-graph]] · **avatar slice of
[[journey-J13-upload-media]]** (upload one photo → set as `avatar_media_id`; no tagging/albums).

### Foundation entities IN
[[entity-person]] (incl. `avatar_media_id`) · [[entity-relationship]] · [[entity-user-account]] ·
**Grant** · **Invitation** · **Media (avatar-only slice)** — `media(id, storage_path, kind,
caption?, created_by, audit, deleted_at)`; **no** `media_tag`/`album`/`event`/`place` links yet ·
**`can_edit()` + RLS policies** (AD-12).

### The hard part that MUST be in MVP
Full **auth + invite + branch permissions (Model B) enforced by RLS** (AD-1…AD-12). This is the
architecture-validating core — building it last would risk a late rewrite. Everything else layers
on top without touching it.

## Deferred phases (each a coherent capability, not scattered features)

| Phase | Capability | Journeys | New entities |
|-------|-----------|----------|--------------|
| **2 — Gallery** | Full photos: tag faces, albums, event/place attach, gallery view (Media table + avatars already exist from MVP) | J13 (full), J14, J15 | [[entity-media]] adds `media_tag`, `album`, `album_media`, and `event`/`place` links |
| **3 — Timeline** | Life & family events over time | [[journey-J10-add-event]], J11 | [[entity-event]] (event, event_participant) |
| **4 — Map** | Where the family is / migration over time | [[journey-J8-residence]], J12 | [[entity-place]] (place, residence) |
| **5 — Collaboration & polish** | Access requests, suggested-edit queue, merge, video | [[journey-J2-request-access]], [[journey-J9-merge-duplicates]] | [[entity-collaboration]] (access_request, suggested_edit); `media.kind='video'` |

**Post-MVP ordering is value-first (Gallery next), not vision-order — adjustable.** Photos are the
highest emotional payoff for a family app; timeline and map follow. Confirm/revisit at roadmap time.

## Explicitly OUT of MVP (resist the creep)
- Timeline, map, and the full gallery views and their entities (Phases 2–4).
- **Gallery mechanics beyond avatars** — face **tagging**, **albums**, gallery browse, and
  attaching media to events/places are Phase 2. MVP media = **one avatar per person**, nothing else.
- Formal access-request / suggested-edit UI — MVP members ask a Super out-of-band; Supers grant via
  [[journey-J4-grant-role]].
- Merge-duplicates tool (mitigated by the add-person duplicate *warning*, which IS in MVP).
- Offline **write** queue (MVP: offline read cache only, AD-1); video; migration-path map.

## Dependency chain / extensibility check
The MVP schema accommodates every deferred phase **without breaking changes**:
- Media exists in MVP (avatar slice); Phase 2 **adds** `media_tag`/`album`/`event`/`place` links to
  it — additive, and no `photoUrl`-string migration ever needed (D-M1 honored).
- Event / Place all **reference `person`**, which exists in MVP — additive, no back-changes.
- **Supabase Storage is now an MVP infra dependency** (avatar uploads) — note for
  [Stage 7](../07-implementation/implementation-plan.md).
- RLS is built around `can_edit` for tree entities + an **author rule for content** (AD-10); Phases
  2–4 content entities slot into the author rule with no change to the branch model.
- Collaboration entities (Phase 5) are **standalone**, referencing existing users/persons.

No deferred feature requires reshaping an MVP table → the scope line is safe.

## Validation
If we wouldn't switch to using this at MVP scope, it's a demo, not an MVP. **We would** — a private,
permissioned, multi-user family tree the whole family can grow is genuinely useful on its own, and
it's the slice that proves the hardest architecture. ✅
