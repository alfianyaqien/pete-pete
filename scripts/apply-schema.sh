#!/usr/bin/env bash
#
# Apply the PetePete SQL migrations to a Supabase (Postgres) database.
#
#   export SUPABASE_DB_URL='postgresql://postgres:PASSWORD@db.<ref>.supabase.co:5432/postgres'
#   ./scripts/apply-schema.sh
#
# Requires the `psql` client:  sudo apt install postgresql-client
#
set -euo pipefail

if [[ -z "${SUPABASE_DB_URL:-}" ]]; then
  echo "error: set SUPABASE_DB_URL to your Supabase connection string (Settings → Database → Connection string → URI, direct connection)." >&2
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "error: psql not found. Install it:  sudo apt install postgresql-client" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
shopt -s nullglob
migrations=("$ROOT"/supabase/migrations/*.sql)

if [[ ${#migrations[@]} -eq 0 ]]; then
  echo "no migrations found in supabase/migrations/" >&2
  exit 1
fi

for f in "${migrations[@]}"; do
  echo "▶ applying $(basename "$f")"
  psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$f"
done

echo "✔ schema applied"
