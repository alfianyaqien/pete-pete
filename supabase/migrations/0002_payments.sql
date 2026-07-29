-- Add settlement payments to the bill row.
--
-- A settlement payment is a real person-to-person transfer recorded to clear a
-- debt. Like participants and entries, the whole list lives as JSONB on the bill
-- row (the app is always loaded/saved as a whole; the Zod schema in shared/
-- enforces the shape). Existing rows default to an empty list.

alter table public.bills
  add column if not exists payments jsonb not null default '[]'::jsonb;
