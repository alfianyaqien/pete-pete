import type { Bill, Entry, Balance, Transfer } from './types'

/**
 * Pure, framework-agnostic ledger math for PetePete. Runs on the server
 * (authoritative) and may also run client-side for live previews in the
 * add-expense flow. All amounts are integer Rupiah.
 */

// ── rounding helper ───────────────────────────────────────────────────────
/**
 * Allocate an integer `total` across `weights` proportionally, using the
 * largest-remainder method so the parts always sum back to `total` exactly
 * (no rounding drift). If all weights are 0, splits equally.
 */
export function splitProportional(total: number, weights: number[]): number[] {
  const n = weights.length
  if (n === 0) return []
  const sum = weights.reduce((a, b) => a + b, 0)
  const w = sum === 0 ? weights.map(() => 1) : weights
  const wSum = sum === 0 ? n : sum

  const exact = w.map((x) => (total * x) / wSum)
  const floored = exact.map(Math.floor)
  let remainder = total - floored.reduce((a, b) => a + b, 0)

  // hand out the leftover units to the largest fractional parts
  const order = exact
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac)
  const out = floored.slice()
  for (let k = 0; k < order.length && remainder > 0; k++, remainder--) {
    out[order[k].i]++
  }
  return out
}

// ── per-entry allocation ──────────────────────────────────────────────────
export interface EntryAllocation {
  /** participantId -> amount they owe for this entry (their cost share) */
  shares: Record<string, number>
  /** participantId -> amount they fronted for this entry */
  payments: Record<string, number>
  /** entry grand total (what was actually paid out) */
  total: number
}

/** Sum of qty*priceEach across a shared order's items. */
export function itemsSubtotal(entry: Extract<Entry, { type: 'shared_order' }>): number {
  return entry.items.reduce((a, it) => a + it.qty * it.priceEach, 0)
}

/** Grand total of a shared order: items + tax + service + other − discount. */
export function sharedOrderTotal(entry: Extract<Entry, { type: 'shared_order' }>): number {
  const sub = itemsSubtotal(entry)
  const tax = Math.round((sub * entry.fees.taxPercent) / 100)
  return sub + tax + entry.fees.service + entry.fees.other - entry.discount
}

/**
 * Who a shared-order item is charged to. Normally its `orderedBy`, but an
 * UNCLAIMED item (empty `orderedBy`) is provisionally held by whoever fronted
 * the cash - so its cost is covered by the payer(s) and the ledger stays
 * zero-sum until someone claims it. Since `payerIds` is always non-empty, every
 * rupiah of every item is allocated to a real person. Claiming an item just
 * moves that cost from the payer(s) to the claimer(s).
 */
export function itemOwners(orderedBy: string[], payerIds: string[]): string[] {
  return orderedBy.length ? orderedBy : payerIds
}

export function allocateEntry(entry: Entry): EntryAllocation {
  const shares: Record<string, number> = {}
  const payments: Record<string, number> = {}
  const add = (rec: Record<string, number>, id: string, amt: number) => {
    rec[id] = (rec[id] ?? 0) + amt
  }

  if (entry.type === 'simple') {
    for (const s of entry.sharers) add(shares, s.participantId, s.share)
    for (const p of entry.payers) add(payments, p.participantId, p.amount)
    const total = entry.payers.reduce((a, p) => a + p.amount, 0)
    return { shares, payments, total }
  }

  // shared_order: split each item among its orderers, then allocate the net
  // fees (tax+service+other−discount) proportionally to each person's items.
  const sub = itemsSubtotal(entry)
  const total = sharedOrderTotal(entry)
  const perPersonItems: Record<string, number> = {}
  const payerIds = entry.payers.map((p) => p.participantId)

  for (const item of entry.items) {
    const cost = item.qty * item.priceEach
    const owners = itemOwners(item.orderedBy, payerIds)
    const parts = splitProportional(cost, owners.map(() => 1))
    owners.forEach((id, i) => {
      add(perPersonItems, id, parts[i])
      add(shares, id, parts[i])
    })
  }

  const feesNet = total - sub // tax + service + other − discount
  if (feesNet !== 0) {
    const ids = Object.keys(perPersonItems)
    const feeParts = splitProportional(
      Math.abs(feesNet),
      ids.map((id) => perPersonItems[id]),
    )
    ids.forEach((id, i) => add(shares, id, feesNet < 0 ? -feeParts[i] : feeParts[i]))
  }

  for (const p of entry.payers) add(payments, p.participantId, p.amount)
  return { shares, payments, total }
}

// ── balances ──────────────────────────────────────────────────────────────
/** Per-person spent / paid / balance across every entry in the bill. */
export function computeBalances(bill: Bill): Balance[] {
  const spent: Record<string, number> = {}
  const paid: Record<string, number> = {}
  for (const p of bill.participants) {
    spent[p.id] = 0
    paid[p.id] = 0
  }
  for (const entry of bill.entries) {
    const { shares, payments } = allocateEntry(entry)
    for (const [id, amt] of Object.entries(shares)) spent[id] = (spent[id] ?? 0) + amt
    for (const [id, amt] of Object.entries(payments)) paid[id] = (paid[id] ?? 0) + amt
  }
  return bill.participants.map((p) => ({
    participantId: p.id,
    spent: spent[p.id] ?? 0,
    paid: paid[p.id] ?? 0,
    balance: (paid[p.id] ?? 0) - (spent[p.id] ?? 0),
  }))
}

// ── minimal settlement (greedy min cash flow) ─────────────────────────────
/**
 * Reduce balances to a small, clean set of transfers that clears everyone.
 *
 * Opposite-sort greedy: match the LARGEST creditors against the SMALLEST
 * debtors. A small debtor is then swallowed whole in one clean transfer instead
 * of being shaved into tiny "sliver" transfers (e.g. Rp 6.990), while the
 * leftover accumulates on a large creditor that has room to absorb it. This
 * costs the same as a plain greedy and yields the same (minimum, n−1 when no
 * zero-sum subgroup exists) transfer count - it only makes the smallest transfer
 * larger. Amounts are integer rupiah, so this is exact.
 *
 * Ties are broken by participantId, so the output is fully deterministic: the
 * same balances always produce the same transfers, whatever order they arrive in.
 */
export function settle(balances: Balance[]): Transfer[] {
  const creditors = balances
    .filter((b) => b.balance > 0)
    .map((b) => ({ id: b.participantId, amt: b.balance }))
  const debtors = balances
    .filter((b) => b.balance < 0)
    .map((b) => ({ id: b.participantId, amt: -b.balance }))

  creditors.sort((a, b) => b.amt - a.amt || a.id.localeCompare(b.id)) // largest first
  debtors.sort((a, b) => a.amt - b.amt || a.id.localeCompare(b.id)) // smallest first

  const transfers: Transfer[] = []
  let ci = 0
  let di = 0
  while (ci < creditors.length && di < debtors.length) {
    const c = creditors[ci]
    const d = debtors[di]
    const amount = Math.min(c.amt, d.amt)
    if (amount > 0) transfers.push({ from: d.id, to: c.id, amount })
    c.amt -= amount
    d.amt -= amount
    if (c.amt === 0) ci++
    if (d.amt === 0) di++
  }
  return transfers
}

/** Convenience: balances + transfers for a bill in one call. */
export function settleBill(bill: Bill): { balances: Balance[]; transfers: Transfer[] } {
  const balances = computeBalances(bill)
  return { balances, transfers: settle(balances) }
}

// ── direct settlement ("who actually owes whom") ──────────────────────────
/**
 * Direct settlement: unlike `settle`, this never routes money through an
 * uninvolved third party. For each expense, whoever owes their share pays it to
 * that expense's actual payer(s), split in proportion to what each fronted. Those
 * per-expense obligations are summed across the bill and netted per pair (if two
 * people owe each other, only the difference remains). The result usually has
 * MORE transfers than `settle`, but every transfer reflects a real shared
 * expense. Deterministic - edges are keyed by id and the output is id-sorted.
 */
export function directSettle(bill: Bill): Transfer[] {
  const SEP = ' '
  const edges = new Map<string, number>()
  const add = (from: string, to: string, amt: number) => {
    if (amt <= 0 || from === to) return
    const key = from + SEP + to
    edges.set(key, (edges.get(key) ?? 0) + amt)
  }

  for (const entry of bill.entries) {
    const { shares, payments } = allocateEntry(entry)
    const ids = new Set([...Object.keys(shares), ...Object.keys(payments)])
    const creditors: { id: string; amt: number }[] = []
    const debtors: { id: string; amt: number }[] = []
    for (const id of ids) {
      const net = (payments[id] ?? 0) - (shares[id] ?? 0)
      if (net > 0) creditors.push({ id, amt: net })
      else if (net < 0) debtors.push({ id, amt: -net })
    }
    if (!creditors.length || !debtors.length) continue
    creditors.sort((a, b) => a.id.localeCompare(b.id))
    debtors.sort((a, b) => a.id.localeCompare(b.id))
    // each debtor pays the entry's payers, split by how much each fronted
    const creditAmts = creditors.map((c) => c.amt)
    for (const d of debtors) {
      const parts = splitProportional(d.amt, creditAmts)
      creditors.forEach((c, i) => add(d.id, c.id, parts[i]))
    }
  }

  // net each pair: only the larger direction survives
  const out: Transfer[] = []
  const done = new Set<string>()
  for (const [key, amt] of edges) {
    if (done.has(key)) continue
    const [from, to] = key.split(SEP) as [string, string]
    const revKey = to + SEP + from
    done.add(key)
    done.add(revKey)
    const rev = edges.get(revKey) ?? 0
    if (amt > rev) out.push({ from, to, amount: amt - rev })
    else if (rev > amt) out.push({ from: to, to: from, amount: rev - amt })
  }
  out.sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to))
  return out
}
