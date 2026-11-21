/**
 * GET /api/health - lightweight liveness check that also touches Supabase, so it
 * doubles as a keep-alive an external cron (GitHub Actions, cron-job.org, ...)
 * can hit. Returns 503 if the database is unreachable.
 */
export default defineEventHandler(async (event) => {
  if (useRuntimeConfig(event).databaseUrl) {
    try {
      await usePostgres(event).query('select 1 from bills limit 1')
    } catch (err) {
      throw createError({ statusCode: 503, statusMessage: `Database unreachable: ${(err as Error).message}` })
    }
    return { ok: true, checkedAt: new Date().toISOString() }
  }
  const sb = useSupabase(event)
  const { error } = await sb.from('bills').select('id').limit(1)
  if (error) {
    throw createError({ statusCode: 503, statusMessage: `Supabase unreachable: ${error.message}` })
  }
  return { ok: true, checkedAt: new Date().toISOString() }
})
