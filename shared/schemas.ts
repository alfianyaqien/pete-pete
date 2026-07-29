import { z } from 'zod'

/**
 * Canonical domain schemas for PetePete. These are the single source of truth:
 *  - server routes (server/api/**) validate request/response against them
 *  - VeeValidate forms use `toTypedSchema(...)` of the *input* variants
 *  - all TS types are inferred from here (see shared/types.ts)
 *
 * Money is integer Indonesian Rupiah (no minor units).
 */

// ── primitives ────────────────────────────────────────────────────────────
export const idSchema = z.string().min(1)
export const rupiah = z.number().int().nonnegative()
export const personName = z.string().trim().min(1, 'Name is required').max(40)
const entryTitle = z.string().trim().min(1, 'Required').max(80)
/** Local calendar date, 'YYYY-MM-DD'. */
export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date')

/** The 30 travel-badge animal keys, in handoff order. avatars.ts attaches SVG
 *  path data keyed by these. */
export const BADGE_KEYS = [
  'ibex', 'owl', 'fox', 'bear', 'stag', 'hare', 'eagle', 'boar', 'raven', 'tortoise',
  'frog', 'macan', 'lynx', 'wolf', 'badger', 'hedgehog', 'marmot', 'squirrel', 'mouse', 'salamander',
  'snake', 'beetle', 'moth', 'trout', 'heron', 'goat', 'naga', 'garuda', 'butterfly', 'mantis',
] as const
export const badgeKeySchema = z.enum(BADGE_KEYS)

// ── participant ───────────────────────────────────────────────────────────
export const participantSchema = z.object({
  id: idSchema,
  name: personName,
  badgeKey: badgeKeySchema,
})

// ── entry: simple split ───────────────────────────────────────────────────
/** Who fronted cash, and how much each fronted (≥1 payer). */
export const payerShareSchema = z.object({
  participantId: idSchema,
  amount: rupiah,
})
/** Who shares the cost, and what each owes for this entry. */
export const sharerSchema = z.object({
  participantId: idSchema,
  share: rupiah,
})
export const simpleEntrySchema = z.object({
  id: idSchema,
  type: z.literal('simple'),
  title: entryTitle,
  date: isoDate,
  amount: rupiah,
  payers: z.array(payerShareSchema).min(1),
  shareMethod: z.enum(['equally', 'exact']),
  sharers: z.array(sharerSchema).min(1),
})

// ── entry: shared order (itemized) ────────────────────────────────────────
export const orderItemSchema = z.object({
  id: idSchema,
  name: entryTitle,
  qty: z.number().int().positive(),
  priceEach: rupiah,
  // May be empty: an UNCLAIMED item nobody has assigned yet. It's provisionally
  // held by whoever paid until someone claims it (see shared/settle.ts).
  orderedBy: z.array(idSchema),
})
export const feesSchema = z.object({
  taxPercent: z.number().min(0).max(100),
  service: rupiah,
  other: rupiah,
})
export const sharedOrderEntrySchema = z.object({
  id: idSchema,
  type: z.literal('shared_order'),
  title: entryTitle,
  date: isoDate,
  payers: z.array(payerShareSchema).min(1),
  items: z.array(orderItemSchema).min(1),
  fees: feesSchema,
  discount: rupiah,
})

export const entrySchema = z.discriminatedUnion('type', [
  simpleEntrySchema,
  sharedOrderEntrySchema,
])

// ── settlement payment (a real person-to-person transfer to clear a debt) ──
export const settlementPaymentSchema = z.object({
  id: idSchema,
  from: idSchema, // participant who handed over the cash
  to: idSchema, // participant who received it
  amount: z.number().int().positive(),
  date: isoDate,
  note: z.string().trim().max(120).optional(),
})

// ── bill (trip) ─────────────────────────────────────────────────────
export const billSchema = z.object({
  id: idSchema,
  title: entryTitle,
  createdAt: z.string(), // ISO 8601
  participants: z.array(participantSchema),
  entries: z.array(entrySchema),
  // real transfers people have made to settle up. Optional: older bills predate
  // it, so every reader treats a missing list as [] (see shared/settle.ts).
  payments: z.array(settlementPaymentSchema).optional(),
  lunas: z.boolean(),
})

// ── API input variants (server assigns ids; badge optional → auto-picked) ──
export const participantInputSchema = z.object({
  name: personName,
  badgeKey: badgeKeySchema.optional(),
})

export const participantPatchSchema = z
  .object({
    name: personName.optional(),
    badgeKey: badgeKeySchema.optional(),
  })
  .refine((v) => v.name !== undefined || v.badgeKey !== undefined, {
    message: 'Nothing to update',
  })

export const createBillInputSchema = z.object({
  title: entryTitle,
  // NOTE: no .default() here - @vee-validate/zod's getDefaults reads a Zod v3
  // internal that breaks on Zod v4. Callers pass [] / forms supply initialValues.
  participants: z.array(participantInputSchema).optional(),
})

export const updateBillInputSchema = z
  .object({
    title: entryTitle.optional(),
    lunas: z.boolean().optional(),
  })
  .refine((v) => v.title !== undefined || v.lunas !== undefined, {
    message: 'Nothing to update',
  })

/** Entry as submitted by a form: no entry/item ids yet, and `date` is optional
 *  (the server defaults it to today) - required once stored. */
export const simpleEntryInputSchema = simpleEntrySchema
  .omit({ id: true })
  .extend({ date: isoDate.optional() })
export const sharedOrderEntryInputSchema = sharedOrderEntrySchema
  .omit({ id: true })
  .extend({
    date: isoDate.optional(),
    items: z.array(orderItemSchema.omit({ id: true })).min(1),
  })
export const entryInputSchema = z.discriminatedUnion('type', [
  simpleEntryInputSchema,
  sharedOrderEntryInputSchema,
])

/** Claim / unclaim one shared-order item as a given participant. */
export const itemClaimInputSchema = z.object({
  participantId: idSchema,
  claimed: z.boolean(),
})

/** Record a settlement payment (server assigns id; date defaults to today). */
export const paymentInputSchema = z
  .object({
    from: idSchema,
    to: idSchema,
    amount: z.number().int().positive(),
    date: isoDate.optional(),
    note: z.string().trim().max(120).optional(),
  })
  .refine((v) => v.from !== v.to, { message: 'Payer and receiver must differ' })
