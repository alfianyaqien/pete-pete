-- PetePete initial schema.
--
-- A bill ("expedition") is always loaded and saved as a whole, addressed by its
-- share-link id, with no relational queries across bills. So participants and
-- entries are stored as JSONB on the bill row; the application layer (Zod
-- schemas in shared/) enforces their shape on read. This keeps the data access
-- a single table behind the repository abstraction — swap to normalized tables
-- later by writing a new repository implementation, no API/frontend changes.

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

create table if not exists public.bills (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  created_at    timestamptz not null default now(),
  lunas         boolean not null default false,
  participants  jsonb not null default '[]'::jsonb,
  entries       jsonb not null default '[]'::jsonb
);

-- The app is no-login and reaches Supabase ONLY through server routes using the
-- service-role key (which bypasses RLS). Enable RLS with no policies so the
-- anon/public API surface has zero access — the database is server-only.
alter table public.bills enable row level security;
