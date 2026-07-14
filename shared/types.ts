import type { z } from 'zod'
import type {
  badgeKeySchema,
  participantSchema,
  payerShareSchema,
  sharerSchema,
  simpleEntrySchema,
  orderItemSchema,
  feesSchema,
  sharedOrderEntrySchema,
  entrySchema,
  billSchema,
  createBillInputSchema,
  updateBillInputSchema,
  participantInputSchema,
  entryInputSchema,
} from './schemas'

/** All domain types are inferred from the Zod schemas — one source of truth. */
export type BadgeKey = z.infer<typeof badgeKeySchema>
export type Participant = z.infer<typeof participantSchema>
export type PayerShare = z.infer<typeof payerShareSchema>
export type Sharer = z.infer<typeof sharerSchema>
export type SimpleEntry = z.infer<typeof simpleEntrySchema>
export type OrderItem = z.infer<typeof orderItemSchema>
export type Fees = z.infer<typeof feesSchema>
export type SharedOrderEntry = z.infer<typeof sharedOrderEntrySchema>
export type Entry = z.infer<typeof entrySchema>
export type Bill = z.infer<typeof billSchema>

export type CreateBillInput = z.infer<typeof createBillInputSchema>
export type UpdateBillInput = z.infer<typeof updateBillInputSchema>
export type ParticipantInput = z.infer<typeof participantInputSchema>
export type EntryInput = z.infer<typeof entryInputSchema>

// ── derived (computed, never stored) ──────────────────────────────────────
/** Per-person standing within a bill. */
export interface Balance {
  participantId: string
  spent: number // total cost allocated to them (their share of every entry)
  paid: number // total they fronted across entries
  balance: number // paid - spent ( >0 owed back, <0 owes )
}

/** One transfer in the minimal-settlement set: `from` pays `to` `amount`. */
export interface Transfer {
  from: string // participantId
  to: string // participantId
  amount: number
}
