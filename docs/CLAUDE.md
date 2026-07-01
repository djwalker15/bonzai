# Bonzai — Authoritative Brief

> This file is the **source of truth** for Bonzai's architecture, data model,
> and decisions. Where any other note disagrees with it, this wins — say so
> explicitly. Keep it living and **re-dated** on each substantive change.
> Last updated: 2026-07-01

## What this is

A **private family app** for the founder's own family — to *deepen connection*
among relatives who already know each other (vs. Ancestry/FamilySearch, which
are about *discovering* unknown ancestors). Raised by the founder's brother for
the **family reunion, July 10–12, 2026**, which is the ship target.

Company context: this project **graduated from the Tenacious Tech Idea
Incubator** (idea `project-bonzai`, Greenlit 2026-07-01) as the pick off a
build-readiness + time-sensitivity stack-rank. It is a **personal/family build**
and explicitly **does not displace InMan** as TT's primary own-app. Deep build
work lives here, in this repo's own Claude context (hub model) — not in the
`my-agent-team` control plane.

## MVP scope (ruthlessly cut for the ~10-day window)

**In:** the **graph view** (interactive family tree) + **manual data entry**.
**Out (post-MVP):** timeline view, map view, gallery/media, multi-user auth,
Supabase-backed sync. Full four-view vision is in
`my-agent-team/vault/07-Incubator/project-bonzai.md`.

## Architecture

- **SPA:** Vite + React + TypeScript. No server yet.
- **State:** `src/lib/useFamilyStore.ts` is the single store — local-first,
  persisted to `localStorage` (key `bonzai.family.v1`), seeded with a small
  sample family. This is the **seam** where Supabase sync plugs in later.
- **Graph:** `src/components/FamilyGraph.tsx` renders with React Flow
  (`@xyflow/react`). `src/lib/layout.ts` computes a simple **generational
  layout** (roots at top, children drop a row) — a heuristic, not a real layout
  engine; swap for dagre/elk if trees get large. `PersonNode` is the card node.
- **Styling:** Tailwind v4 (`@import "tailwindcss"` in `src/index.css`) with the
  shadcn/ui token set + `cn()` helper. `components.json` is configured so
  `npx shadcn add <component>` works when we want real shadcn primitives.

## Data model (canonical: `supabase/migrations/0001_init.sql` ↔ `src/types/family.ts`)

- **Person:** id, firstName, lastName, birthDate?, deathDate?, location?,
  notes?, photoUrl?.
- **Relationship:** id, fromId, toId, type (`'parent' | 'spouse'`).
  - `parent`: `fromId` is the parent, `toId` is the child (directed).
  - `spouse`: undirected (order not meaningful).

Keep `src/types/family.ts` and the SQL migration **1:1**. Change the model in
both, in the same commit.

## Decisions

- **2026-07-01 — Local-first for the MVP.** Offline `localStorage` store, no
  backend, to hit the reunion deadline. Supabase is wired as an optional seam
  (`src/lib/supabase.ts`) but not required to run.
- **2026-07-01 — Graph before the other three views.** The tree is the thinnest
  thing that's actually useful at the reunion; timeline/map/gallery wait.
- **2026-07-01 — Two relationship types only** (`parent`, `spouse`). Enough to
  draw a tree; siblings are derived (shared parent), not stored.

## Not done / known gaps

- **Supabase RLS is off** and there's no auth. Enable RLS + family-scoped
  policies **before** real family data lands behind login (see the note in
  `0001_init.sql`). Do not ship a public multi-user version without this.
- No photo upload yet (`photoUrl` is a field, not a flow).
- Layout is a heuristic — dense/complex trees (multiple marriages, adoptions)
  will need a real layout pass.
- No tests yet.

## Superseded Guidance

_(none yet — log reversals here as they happen, so stale notes don't mislead.)_
