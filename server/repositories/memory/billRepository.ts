import type { BillRepository } from '../types'
import type {
  Bill,
  CreateBillInput,
  UpdateBillInput,
  ParticipantInput,
  EntryInput,
} from '../../../shared/types'
import {
  addParticipant,
  updateParticipant,
  removeParticipant,
  addEntry,
  updateEntry,
  removeEntry,
  setItemClaim,
  type ParticipantPatch,
} from '../../../shared/operations'
import { buildBill } from '../../utils/buildBill'

/**
 * In-memory BillRepository. Dev fallback when no Supabase credentials are
 * configured, and living proof the data backend is swappable behind the
 * interface (API/frontend identical). State resets on server restart.
 */
const store = new Map<string, Bill>()

export class MemoryBillRepository implements BillRepository {
  async create(input: CreateBillInput): Promise<Bill> {
    const bill = buildBill(input)
    store.set(bill.id, bill)
    return bill
  }

  async get(id: string): Promise<Bill | null> {
    return store.get(id) ?? null
  }

  private mutate(id: string, fn: (bill: Bill) => Bill): Bill | null {
    const existing = store.get(id)
    if (!existing) return null
    const updated = fn(existing)
    store.set(id, updated)
    return updated
  }

  async update(id: string, patch: UpdateBillInput): Promise<Bill | null> {
    return this.mutate(id, (b) => ({
      ...b,
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.lunas !== undefined ? { lunas: patch.lunas } : {}),
    }))
  }

  async addParticipant(id: string, input: ParticipantInput): Promise<Bill | null> {
    return this.mutate(id, (b) => addParticipant(b, input))
  }
  async updateParticipant(id: string, pid: string, patch: ParticipantPatch): Promise<Bill | null> {
    return this.mutate(id, (b) => updateParticipant(b, pid, patch))
  }
  async removeParticipant(id: string, pid: string): Promise<Bill | null> {
    return this.mutate(id, (b) => removeParticipant(b, pid))
  }

  async addEntry(id: string, input: EntryInput): Promise<Bill | null> {
    return this.mutate(id, (b) => addEntry(b, input))
  }
  async updateEntry(id: string, entryId: string, input: EntryInput): Promise<Bill | null> {
    return this.mutate(id, (b) => updateEntry(b, entryId, input))
  }
  async removeEntry(id: string, entryId: string): Promise<Bill | null> {
    return this.mutate(id, (b) => removeEntry(b, entryId))
  }
  async claimItem(id: string, eid: string, itemId: string, pid: string, claimed: boolean) {
    return this.mutate(id, (b) => setItemClaim(b, eid, itemId, pid, claimed))
  }
}
