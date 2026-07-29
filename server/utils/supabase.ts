import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

/**
 * Server-only Supabase client built from runtimeConfig (service-role key).
 * Never imported by app/ code - the browser never sees these credentials.
 */
let client: SupabaseClient | null = null

export function useSupabase(event: H3Event): SupabaseClient {
  const cfg = useRuntimeConfig(event)
  const url = cfg.supabaseUrl as string
  const key = cfg.supabaseServiceKey as string
  if (!url || !key) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase is not configured' })
  }
  if (!client) {
    client = createClient(url, key, { auth: { persistSession: false } })
  }
  return client
}
