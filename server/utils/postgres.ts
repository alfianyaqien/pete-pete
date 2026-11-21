import pg from 'pg'
import type { H3Event } from 'h3'

/**
 * Server-only Postgres pool for a self-hosted database, built from
 * runtimeConfig.databaseUrl (env: NUXT_DATABASE_URL). Used instead of Supabase
 * when set, e.g. on the VPS:
 *
 *   NUXT_DATABASE_URL=postgresql://petepete@/petepete?host=/var/run/postgresql
 *
 * (Unix socket + peer auth - no password needed when the OS user matches.)
 */
let pool: pg.Pool | null = null

export function usePostgres(event?: H3Event): pg.Pool {
  const url = useRuntimeConfig(event).databaseUrl as string
  if (!url) {
    throw createError({ statusCode: 500, statusMessage: 'Postgres is not configured' })
  }
  if (!pool) {
    // Small pool: this is a low-traffic app on a shared 2 GB box.
    pool = new pg.Pool({ connectionString: url, max: 5, idleTimeoutMillis: 30_000 })
  }
  return pool
}
