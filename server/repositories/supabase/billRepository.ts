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
    const upd: Record<string, unknown> = {}
    if (patch.title !== undefined) upd.title = patch.title
    if (patch.lunas !== undefined) upd.lunas = patch.lunas
    const { data, error } = await this.sb
      .from(TABLE)
      .update(upd)
      .eq('id', id)
      .select()
      .maybeSingle()
    if (error) throw error
    return data ? mapRow(data) : null
  }

  // Mutations are read-modify-write: apply the shared pure operation, then
  // persist the participants/entries JSONB.
  private async mutate(id: string, fn: (bill: Bill) => Bill): Promise<Bill | null> {
    const current = await this.get(id)
    if (!current) return null
    const next = fn(current)
    const { data, error } = await this.sb
      .from(TABLE)
      .update({ title: next.title, lunas: next.lunas, participants: next.participants, entries: next.entries })
      .eq('id', id)
      .select()
      .maybeSingle()
    if (error) throw error
    return data ? mapRow(data) : null
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
