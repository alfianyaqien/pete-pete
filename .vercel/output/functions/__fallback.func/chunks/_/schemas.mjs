import { z } from 'zod';

const idSchema = z.string().min(1);
const rupiah = z.number().int().nonnegative();
const personName = z.string().trim().min(1, "Name is required").max(40);
const entryTitle = z.string().trim().min(1, "Required").max(80);
const BADGE_KEYS = [
  "ibex",
  "owl",
  "fox",
  "bear",
  "stag",
  "hare",
  "eagle",
  "boar",
  "raven",
  "tortoise",
  "frog",
  "macan",
  "lynx",
  "wolf",
  "badger",
  "hedgehog",
  "marmot",
  "squirrel",
  "mouse",
  "salamander",
  "snake",
  "beetle",
  "moth",
  "trout",
  "heron",
  "goat",
  "naga",
  "garuda",
  "butterfly",
  "mantis"
];
const badgeKeySchema = z.enum(BADGE_KEYS);
const participantSchema = z.object({
  id: idSchema,
  name: personName,
  badgeKey: badgeKeySchema
});
const payerShareSchema = z.object({
  participantId: idSchema,
  amount: rupiah
});
const sharerSchema = z.object({
  participantId: idSchema,
  share: rupiah
});
const simpleEntrySchema = z.object({
  id: idSchema,
  type: z.literal("simple"),
  title: entryTitle,
  amount: rupiah,
  payers: z.array(payerShareSchema).min(1),
  shareMethod: z.enum(["equally", "exact"]),
  sharers: z.array(sharerSchema).min(1)
});
const orderItemSchema = z.object({
  id: idSchema,
  name: entryTitle,
  qty: z.number().int().positive(),
  priceEach: rupiah,
  orderedBy: z.array(idSchema).min(1)
});
const feesSchema = z.object({
  taxPercent: z.number().min(0).max(100),
  service: rupiah,
  other: rupiah
});
const sharedOrderEntrySchema = z.object({
  id: idSchema,
  type: z.literal("shared_order"),
  title: entryTitle,
  payerId: idSchema,
  items: z.array(orderItemSchema).min(1),
  fees: feesSchema,
  discount: rupiah
});
const entrySchema = z.discriminatedUnion("type", [
  simpleEntrySchema,
  sharedOrderEntrySchema
]);
const billSchema = z.object({
  id: idSchema,
  title: entryTitle,
  createdAt: z.string(),
  // ISO 8601
  participants: z.array(participantSchema),
  entries: z.array(entrySchema),
  lunas: z.boolean()
});
const participantInputSchema = z.object({
  name: personName,
  badgeKey: badgeKeySchema.optional()
});
const participantPatchSchema = z.object({
  name: personName.optional(),
  badgeKey: badgeKeySchema.optional()
}).refine((v) => v.name !== void 0 || v.badgeKey !== void 0, {
  message: "Nothing to update"
});
const createBillInputSchema = z.object({
  title: entryTitle,
  // NOTE: no .default() here — @vee-validate/zod's getDefaults reads a Zod v3
  // internal that breaks on Zod v4. Callers pass [] / forms supply initialValues.
  participants: z.array(participantInputSchema).optional()
});
const updateBillInputSchema = z.object({
  title: entryTitle.optional(),
  lunas: z.boolean().optional()
}).refine((v) => v.title !== void 0 || v.lunas !== void 0, {
  message: "Nothing to update"
});
const simpleEntryInputSchema = simpleEntrySchema.omit({ id: true });
const sharedOrderEntryInputSchema = sharedOrderEntrySchema.omit({ id: true }).extend({ items: z.array(orderItemSchema.omit({ id: true })).min(1) });
const entryInputSchema = z.discriminatedUnion("type", [
  simpleEntryInputSchema,
  sharedOrderEntryInputSchema
]);

export { BADGE_KEYS as B, participantPatchSchema as a, billSchema as b, createBillInputSchema as c, entryInputSchema as e, orderItemSchema as o, participantInputSchema as p, updateBillInputSchema as u };
//# sourceMappingURL=schemas.mjs.map
