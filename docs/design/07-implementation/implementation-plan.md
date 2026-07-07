# Stage 7 — Implementation Plan

> Bridges design → code: sequence, atomic server functions, routes, seed data, infrastructure. The
> roadmap for [Stage 8 (Build)](../README.md). Status: 🟢 validated (2026-07-06). Related: [[README]],
> [[mvp-scope]], [[decisions]], [[_erd]], [[_index]].

## 7a — Implementation sequence: **Hybrid**
Foundation DB first, then vertical journeys — best of both (playbook 7a).

1. **Foundation DB** (all MVP tables in dependency order, per [[_erd]]): `person`, `user_account`,
   `relationship`, `grant`, `invitation`, `media` (avatar slice). Each with audit/soft-delete
   ([[_patterns]]), then **RLS policies + `can_edit()`** (AD-12). Validate the schema + policies
   with SQL before any UI.
2. **Vertical journeys** (each: types → data layer → state → UI → route → test end-to-end):
   auth+invite ([[journey-J1-accept-invite]]) → graph read ([[journey-J17-explore-graph]]) →
   profile ([[journey-J16-person-profile]]) → add/edit person + relationship (J5/J6/J7) → avatars
   → admin invite/grant (J3/J4). Auth first so RLS is exercised from the start.

## 7b — Server-function inventory (atomicity)
Classified: **RPC** = Postgres function in a transaction; **Edge** = needs an external call;
**Client** = single-table, RLS-guarded.

| Operation | Why atomic | Type |
|-----------|-----------|------|
| `accept_invitation(token)` | validate token → link `user_account` → insert `grant` → mark `accepted_at`, all-or-nothing | **RPC** (as auth user) |
| `invite_relative(...)` | insert `invitation` **+ send email** | **Edge** (insert + Resend) |
| `add_person_with_relationship(...)` | `person` + `relationship` insert together (+ `can_edit` check) so no orphan | **RPC** |
| `set_avatar(person_id, path)` | insert `media` + set `person.avatar_media_id` together | **RPC** (after Storage upload) |
| `delete_person(id)` | soft-delete person + dependent ties consistently | **RPC** |
| Grant / revoke role | single row, super-only via RLS | **Client** |
| Edit person / link relationship | single table, RLS `can_edit` | **Client** |
| Avatar file upload | binary to bucket | **Client → Storage** |
| *(Phase 5)* `merge_people`, `accept_suggested_edit` | multi-row re-point / apply diff | **RPC** |

## 7c — Route map (by auth state)
**Public:** `/` (sign-in; redirects to `/tree` if authed) · `/invite/:token`
([[journey-J1-accept-invite]]) · `/auth/callback` (magic-link / OAuth return).
**Authenticated:** `/tree` (default, [[journey-J17-explore-graph]]) · `/person/:id`
([[journey-J16-person-profile]]) · add/edit person as modals over `/tree` (J5/J6/J7) · `/admin`
(invites + grants, **Super-only**, J3/J4) · `/settings` (account/link).
**Deferred:** `/timeline`, `/map`, `/gallery`, `/album/:id` (Phases 2–4).
→ Adds **client routing** (`react-router-dom`) the scaffold lacks; an auth guard wraps
authenticated routes.

## 7d — Seed-data strategy
- **Reference data:** *none* — kinship types, roles, event types are **enums in the schema**, not
  rows. No reference migration needed.
- **Default content:** the scaffold's sample "Walker" family as a **dev-only seed** (script /
  local migration) for testing RLS and layout — **not** shipped to production.
- **Catalog data:** *none* — Bonzai is one private family, no external dataset/pipeline.
- **Bootstrap the first Super (chicken-and-egg):** only Supers grant, so the founder's
  `grant(role='super')` is **seeded once** (migration keyed to the founder's email/`auth.uid()`
  after first sign-in), or via a one-off admin script. The founder then invites everyone else.

## 7e — Infrastructure
| Concern | Choice | Notes |
|---------|--------|-------|
| Repo | GitHub `djwalker15/bonzai` | exists |
| Hosting | **Vercel** | connect repo, env vars, PR preview deploys |
| Backend | **Supabase** (Postgres + Auth + Storage) | migrations via `supabase` CLI; RLS + `can_edit` |
| Auth | Supabase Auth — **magic link + Google OAuth** | Google needs an OAuth client; magic link via Resend SMTP |
| Email | **Resend** | verify sending domain; wire as Supabase Auth custom SMTP **and** the `invite_relative` edge fn |
| Storage | Supabase Storage bucket `avatars` | RLS on bucket; signed or public read |
| CI/CD | GitHub Actions (exists: lint + build) | add typecheck; Vercel deploys; migrations on merge |
| Env | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (exist) | add service-role (edge), `RESEND_API_KEY`, Google OAuth creds |

**Frontend additions for Stage 8:** `react-router-dom` (routing), a server-data layer
(**TanStack Query** recommended over the scaffold's hand-rolled `localStorage` store, which becomes
the offline read cache), and `shadcn` primitives as needed (`components.json` already configured).

## Deferred-phase infra (not MVP)
Geocoding provider (Phase 3 map) · video transcoding/storage limits (Phase 5) · offline **write**
queue (post-MVP, AD-1).

## Design phase complete
Stages 1–7 are done. Stage 8 (Build) executes this plan: foundation DB → vertical journeys, keeping
[`src/types/family.ts`](../../../src/types/family.ts) ↔ the Supabase migration in lockstep, and
updating this vault as implementation reveals changes (the vault is alive).
