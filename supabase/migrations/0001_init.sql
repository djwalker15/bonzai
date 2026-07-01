-- Bonzai — initial schema (canonical source of truth for the family data model).
-- Mirrors src/types/family.ts. Apply via the Supabase CLI once a project exists:
--   supabase db push
--
-- The MVP runs offline against the local store; this schema is the shared-
-- persistence target the store syncs to next.

create extension if not exists "pgcrypto";

create table if not exists people (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null,
  last_name   text not null default '',
  birth_date  date,
  death_date  date,
  location    text,
  notes       text,
  photo_url   text,
  created_at  timestamptz not null default now()
);

-- 'parent': from_id is the parent, to_id is the child.
-- 'spouse': order is not meaningful.
create table if not exists relationships (
  id        uuid primary key default gen_random_uuid(),
  from_id   uuid not null references people(id) on delete cascade,
  to_id     uuid not null references people(id) on delete cascade,
  type      text not null check (type in ('parent', 'spouse')),
  created_at timestamptz not null default now(),
  constraint no_self_relationship check (from_id <> to_id),
  unique (from_id, to_id, type)
);

create index if not exists relationships_from_idx on relationships (from_id);
create index if not exists relationships_to_idx on relationships (to_id);

-- NOTE: RLS is intentionally NOT enabled yet. Before this holds real family
-- data behind auth, enable RLS on both tables and add policies scoping rows to
-- the family (e.g. a family_id + membership table). See docs/CLAUDE.md.
