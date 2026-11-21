import type { H3Event } from 'h3'
import type { Repositories } from '../repositories/types'
import { SupabaseBillRepository } from '../repositories/supabase/billRepository'
import { MemoryBillRepository } from '../repositories/memory/billRepository'
import { PostgresBillRepository } from '../repositories/postgres/billRepository'
import { useSupabase } from './supabase'
import { usePostgres } from './postgres'

let memoryRepos: Repositories | null = null

/**
 * THE SINGLE DB SWAP POINT. Routes call `useRepositories(event)` and depend only
 * on the Repositories interface. To change databases, change what this function
 * returns - nothing in server/api/** or app/** needs to be touched.
 *
 * Order: self-hosted Postgres when NUXT_DATABASE_URL is set, else Supabase when
 * its credentials are configured, otherwise an in-memory store (dev fallback).
 */
export function useRepositories(event: H3Event): Repositories {
  const cfg = useRuntimeConfig(event)
  if (cfg.databaseUrl) {
    return { bills: new PostgresBillRepository(usePostgres(event)) }
  }
  if (cfg.supabaseUrl && cfg.supabaseServiceKey) {
    const sb = useSupabase(event)
    return { bills: new SupabaseBillRepository(sb) }
  }
  if (!memoryRepos) memoryRepos = { bills: new MemoryBillRepository() }
  return memoryRepos
}
