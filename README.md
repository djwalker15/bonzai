# Bonzai

A **private family app** for the Walker family — built to *deepen connection
among relatives we already know*, not for genealogy discovery. Started as the
Tenacious Tech [Idea Incubator](https://github.com/djwalker15) idea
`project-bonzai`, Greenlit 2026-07-01 with a ship target of the **family reunion
(July 10–12, 2026)**.

> MVP scope: the **graph view** (an interactive family tree) + **manual data
> entry**. The timeline, map, and gallery views are the post-MVP vision.

## Stack

- **Vite + React + TypeScript** (SPA)
- **Tailwind CSS v4** + **shadcn/ui** foundation (New York style, neutral base)
- **[React Flow](https://reactflow.dev) (`@xyflow/react`)** — the family-tree graph
- **Supabase** — shared persistence (optional; MVP runs offline on `localStorage`)

## Layout

| Path | Purpose |
|---|---|
| `src/` | the app (see below) |
| `src/components/` | UI: `FamilyGraph`, `PersonNode`, `AddPersonForm` |
| `src/lib/` | `useFamilyStore` (local-first store), `layout` (generational tree layout), `supabase` client, `utils` (`cn`) |
| `src/types/` | domain types (`Person`, `Relationship`) |
| `supabase/` | **canonical** DB schema as migrations |
| `docs/CLAUDE.md` | **authoritative brief** — architecture, data model, decisions |
| `.github/workflows/` | CI (lint + typecheck + build) |

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

## Environments

- **Local:** works offline with no config (seed family in `useFamilyStore`).
- **Shared (optional):** copy `.env.example` → `.env` and set
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` to enable Supabase.
  Real secrets never get committed; build-time `VITE_*` values come from CI env.

## CI

`.github/workflows/ci.yml` runs `npm ci`, `npm run lint`, and `npm run build`
on every PR and push to `main`.

---

Part of [Tenacious Tech](https://tenacioustech.net). Deep build context for this
project lives in its own Claude context (hub model); the company control plane
only tracks it in the Projects Registry + Portfolio.
