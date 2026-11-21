import type pg from 'pg'
import type { BillRepository } from '../types'
import type {
  Bill,
  CreateBillInput,
  UpdateBillInput,
  ParticipantInput,
  EntryInput,
  PaymentInput,
} from '../../../shared/types'
import { billSchema } from '../../../shared/schemas'
import {
  addParticipant,
  updateParticipant,
  removeParticipant,
  addEntry,
  updateEntry,
  removeEntry,
  setItemClaim,
  addPayment,
  removePayment,
  type ParticipantPatch,
} from '../../../shared/operations'
import { buildBill } from '../../utils/buildBill'

/**
 * Plain-Postgres implementation over the same `bills` table as the Supabase
 * one (supabase/migrations/*.sql apply unchanged). Same optimistic-concurrency
 * strategy: every mutation is a compare-and-set on `version`.
 */

const COLUMNS = 'id, title, created_at, lunas, participants, entries, payments, version'

type Row = {
  id: string
  title: string
  created_at: Date | string
  lunas: boolean
  participants: unknown
  entries: unknown
  payments: unknown
  version: number
}

function mapRow(row: Row): Bill {
  return billSchema.parse({
    id: row.id,
    title: row.title,
    // node-postgres returns timestamptz as a Date; the domain wants ISO 8601.
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    participants: row.participants ?? [],
    entries: row.entries ?? [],
    payments: row.payments ?? [],
    lunas: row.lunas ?? false,
  })
}

// JSONB params must be passed as JSON text: node-postgres would otherwise
// serialize a JS array as a Postgres array literal.
const json = (v: unknown) => JSON.stringify(v)

export class PostgresBillRepository implements BillRepository {
  constructor(private readonly db: pg.Pool) {}

  async create(input: CreateBillInput): Promise<Bill> {
    // Fresh short slug per attempt; retry on the rare primary-key collision.
    for (let attempt = 0; attempt < 5; attempt++) {
      const bill = buildBill(input)
      try {
        const { rows } = await this.db.query<Row>(
          `insert into bills (id, title, created_at, lunas, participants, entries, payments)
           values ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb)
           returning ${COLUMNS}`,
          [
            bill.id,
            bill.title,
            bill.createdAt,
            bill.lunas,
            json(bill.participants),
            json(bill.entries),
            json(bill.payments),
          ],
        )
        return mapRow(rows[0]!)
      } catch (err) {
        if ((err as { code?: string }).code !== '23505') throw err
      }
    }
    throw new Error('Could not generate a unique share link - please try again')
  }

  async get(id: string): Promise<Bill | null> {
    const row = await this.read(id)
    return row ? mapRow(row) : null
  }

  async update(id: string, patch: UpdateBillInput): Promise<Bill | null> {
    return this.mutate(id, (b) => ({
      ...b,
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.lunas !== undefined ? { lunas: patch.lunas } : {}),
    }))
  }

  private async read(id: string): Promise<Row | null> {
    const { rows } = await this.db.query<Row>(`select ${COLUMNS} from bills where id = $1`, [id])
    return rows[0] ?? null
  }

  /** Read → apply pure op → UPDATE only if `version` is unchanged; else retry. */
  private async mutate(id: string, fn: (bill: Bill) => Bill): Promise<Bill | null> {
    for (let attempt = 0; attempt < 4; attempt++) {
      const row = await this.read(id)
      if (!row) return null

      const version = row.version ?? 0
      const next = fn(mapRow(row))
      const { rows } = await this.db.query<Row>(
        `update bills
            set title = $3, lunas = $4,
                participants = $5::jsonb, entries = $6::jsonb, payments = $7::jsonb,
                version = $2 + 1
          where id = $1 and version = $2
          returning ${COLUMNS}`,
        [
          id,
          version,
          next.title,
          next.lunas,
          json(next.participants),
          json(next.entries),
          json(next.payments),
        ],
      )
      if (rows[0]) return mapRow(rows[0])
      // a concurrent write bumped the version; retry
    }
    throw new Error('Bill was modified by someone else - please try again')
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
  claimItem(id: string, eid: string, itemId: string, pid: string, claimed: boolean) {
    return this.mutate(id, (b) => setItemClaim(b, eid, itemId, pid, claimed))
  }
  addPayment(id: string, input: PaymentInput) {
    return this.mutate(id, (b) => addPayment(b, input))
  }
  removePayment(id: string, paymentId: string) {
    return this.mutate(id, (b) => removePayment(b, paymentId))
  }
}
