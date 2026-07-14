import type { H3Event } from 'h3'
import type { Repositories } from '../repositories/types'
import { SupabaseBillRepository } from '../repositories/supabase/billRepository'
import { MemoryBillRepository } from '../repositories/memory/billRepository'
import { useSupabase } from './supabase'

let memoryRepos: Repositories | null = null

/**
 * THE SINGLE DB SWAP POINT. Routes call `useRepositories(event)` and depend only
 * on the Repositories interface. To change databases, change what this function
 * returns — nothing in server/api/** or app/** needs to be touched.
 *
 * Today: Supabase when credentials are configured, otherwise an in-memory store
 * (dev fallback, no credentials required).
 */
export function useRepositories(event: H3Event): Repositories {
  const cfg = useRuntimeConfig(event)
  if (cfg.supabaseUrl && cfg.supabaseServiceKey) {
    const sb = useSupabase(event)
    return { bills: new SupabaseBillRepository(sb) }
  }
  if (!memoryRepos) memoryRepos = { bills: new MemoryBillRepository() }
  return memoryRepos
}
