import type { SupabaseClient } from '@supabase/supabase-js'
import type { BillRepository } from '../types'
import type {
  Bill,
  CreateBillInput,
  UpdateBillInput,
  ParticipantInput,
  EntryInput,
} from '../../../shared/types'
import { billSchema } from '../../../shared/schemas'
import {
  addParticipant,
  updateParticipant,
  removeParticipant,
  addEntry,
  updateEntry,
  removeEntry,
  type ParticipantPatch,
} from '../../../shared/operations'
import { buildBill } from '../../utils/buildBill'

const TABLE = 'bills'

/** Map a DB row (snake_case, JSONB columns) to a validated domain Bill. */
function mapRow(row: Record<string, unknown>): Bill {
  return billSchema.parse({
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    participants: row.participants ?? [],
    entries: row.entries ?? [],
    lunas: row.lunas ?? false,
  })
}

export class SupabaseBillRepository implements BillRepository {
  constructor(private readonly sb: SupabaseClient) {}

  async create(input: CreateBillInput): Promise<Bill> {
    const bill = buildBill(input)
    const { data, error } = await this.sb.from(TABLE).insert(toRow(bill)).select().single()
    if (error) throw error
    return mapRow(data)
  }

  async get(id: string): Promise<Bill | null> {
    const { data, error } = await this.sb.from(TABLE).select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? mapRow(data) : null
  }

  async update(id: string, patch: UpdateBillInput): Promise<Bill | null> {
    return this.mutate(id, (b) => ({
      ...b,
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.lunas !== undefined ? { lunas: patch.lunas } : {}),
    }))
  }

  /**
   * Read-modify-write with optimistic concurrency. Every write is a
   * compare-and-set on the row's `version`: read (with version) → apply the
   * pure operation → conditionally UPDATE only if `version` is unchanged,
   * bumping it. If a concurrent editor moved it, the update matches 0 rows and
   * we re-read and retry — so two people editing the same bill never clobber
   * each other's changes.
   */
  private async mutate(id: string, fn: (bill: Bill) => Bill): Promise<Bill | null> {
    for (let attempt = 0; attempt < 4; attempt++) {
      const { data: row, error } = await this.sb
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      if (!row) return null

      const version = (row.version as number) ?? 0
      const next = fn(mapRow(row))
      const { data, error: updErr } = await this.sb
        .from(TABLE)
        .update({
          title: next.title,
          lunas: next.lunas,
          participants: next.participants,
          entries: next.entries,
          version: version + 1,
        })
        .eq('id', id)
        .eq('version', version)
        .select()
        .maybeSingle()
      if (updErr) throw updErr
      if (data) return mapRow(data)
      // version changed under us → a concurrent write landed; retry
    }
    throw new Error('Bill was modified by someone else — please try again')
  }

  addParticipant(id: string, input: ParticipantInput) {
    return this.mutate(id, (b) => addParticipant(b, input))
  }
  updateParticipant(id: string, pid: string, patch: ParticipantPatch) {
    return this.mutate(id, (b) => updateParticipant(b, pid, patch))
  }
  removeParticipant(id: string, pid: string) {
    return this.mutate(id, (b) => removeParticipant(b, pid))
  }
  addEntry(id: string, input: EntryInput) {
    return this.mutate(id, (b) => addEntry(b, input))
  }
  updateEntry(id: string, entryId: string, input: EntryInput) {
    return this.mutate(id, (b) => updateEntry(b, entryId, input))
  }
  removeEntry(id: string, entryId: string) {
    return this.mutate(id, (b) => removeEntry(b, entryId))
  }
}

function toRow(bill: Bill) {
  return {
    id: bill.id,
    title: bill.title,
    created_at: bill.createdAt,
    participants: bill.participants,
    entries: bill.entries,
    lunas: bill.lunas,
  }
}
