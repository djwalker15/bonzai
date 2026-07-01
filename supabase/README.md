# supabase/

Canonical database schema for Bonzai, as versioned migrations. This directory
is the **source of truth** for the data model — change the schema here (a new
migration), not by clicking in the Supabase dashboard.

## Migrations

- `migrations/0001_init.sql` — `people` + `relationships` tables (mirrors
  `src/types/family.ts`).

## Applying (once a Supabase project exists)

```bash
supabase link --project-ref <ref>
supabase db push
```

## Not done yet (MVP scope)

- **RLS is off.** Enable Row Level Security + policies before any real family
  data lands behind auth (see the note at the bottom of `0001_init.sql`).
- The app currently runs offline against `localStorage`; wiring the store to
  these tables is the next step after the graph MVP.
