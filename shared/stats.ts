import { sharedOrderTotal, computeBalances, allocateEntry, splitProportional } from './settle'
import type { Bill, Entry, Balance } from './types'

/** Grand total of a single entry. */
export function entryTotalOf(entry: Entry): number {
  return entry.type === 'simple' ? entry.amount : sharedOrderTotal(entry)
}

export interface EntryGroup {
  date: string
  total: number
  entries: Entry[]
}

/** Group entries by their date, newest day first (entries keep insertion order
 *  within a day). Used for the day-separated entry list. */
export function groupEntriesByDate(entries: Entry[]): EntryGroup[] {
  const map = new Map<string, Entry[]>()
  for (const e of entries) {
    const list = map.get(e.date)
    if (list) list.push(e)
    else map.set(e.date, [e])
  }
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, es]) => ({
      date,
      entries: es,
      total: es.reduce((s, e) => s + entryTotalOf(e), 0),
    }))
}

/** Sum of every entry's total — the bill's "total tally". */
export function billTotal(bill: Bill): number {
  return bill.entries.reduce((sum, e) => sum + entryTotalOf(e), 0)
}

export interface BillStats {
  total: number
  souls: number
  entries: number
  /** participants who are square (zero balance) */
  settled: number
  balances: Balance[]
  fronted: number // total cash fronted across the bill
}

export function billStats(bill: Bill): BillStats {
  const balances = computeBalances(bill)
  return {
    total: billTotal(bill),
    souls: bill.participants.length,
    entries: bill.entries.length,
    settled: balances.filter((b) => b.balance === 0).length,
    balances,
    fronted: balances.reduce((s, b) => s + b.paid, 0),
  }
}

// ── per-person ledger (what each paid / owes, itemised) ────────────────────
export interface PaidLine {
  title: string
  date: string
  amount: number
}
export interface OwedLine {
  /** For a simple entry: the entry title. For a bill: "Bill — Item". */
  label: string
  amount: number // negative for a discount line
}
export interface PersonLedger {
  participantId: string
  name: string
  paid: PaidLine[]
  paidTotal: number
  owed: OwedLine[]
  owedTotal: number
  /** paidTotal − owedTotal, i.e. their settlement balance (>0 owed back). */
  net: number
}

/**
 * Break every entry down per participant: the expenses they fronted (paid) and
 * the line-by-line cost they owe. For a bill (shared order) each ordered item
 * becomes its own owed line ("Bill — Item — price"), plus one line for their
 * share of fees/tax (or discount). By construction `net` equals the person's
 * settlement balance from `computeBalances`.
 */
export function personLedgers(bill: Bill): PersonLedger[] {
  return bill.participants.map((p) => {
    const paid: PaidLine[] = []
    const owed: OwedLine[] = []

    for (const e of bill.entries) {
      const payer = e.payers.find((x) => x.participantId === p.id)
      if (payer && payer.amount > 0) {
        paid.push({ title: e.title, date: e.date, amount: payer.amount })
      }

      if (e.type === 'simple') {
        const s = e.sharers.find((x) => x.participantId === p.id)
        if (s && s.share !== 0) owed.push({ label: e.title, amount: s.share })
        continue
      }

      // shared order: one owed line per item they ordered, then a fee line
      if (!e.items.some((it) => it.orderedBy.includes(p.id))) continue
      let itemSum = 0
      for (const it of e.items) {
        const idx = it.orderedBy.indexOf(p.id)
        if (idx < 0) continue
        const parts = splitProportional(it.qty * it.priceEach, it.orderedBy.map(() => 1))
        const share = parts[idx]!
        itemSum += share
        owed.push({ label: `${e.title} — ${it.name}`, amount: share })
      }
      // remainder vs the authoritative allocation is this person's fee/discount share
      const feeShare = (allocateEntry(e).shares[p.id] ?? 0) - itemSum
      if (feeShare !== 0) {
        owed.push({
          label: `${e.title} — ${feeShare > 0 ? 'fees & tax' : 'discount'}`,
          amount: feeShare,
        })
      }
    }

    const paidTotal = paid.reduce((a, x) => a + x.amount, 0)
    const owedTotal = owed.reduce((a, x) => a + x.amount, 0)
    return { participantId: p.id, name: p.name, paid, paidTotal, owed, owedTotal, net: paidTotal - owedTotal }
  })
}

/** Season-level rollup for the Home ledger hero. */
export interface SeasonStats {
  total: number
  cleared: number // sum of settled ("lunas") bills' totals
  unsettled: number // sum of open bills' totals
  souls: number // total souls across all bills
  open: number
  lunas: number
}

export function seasonStats(bills: Bill[]): SeasonStats {
  let total = 0
  let cleared = 0
  let souls = 0
  let open = 0
  let lunas = 0
  for (const b of bills) {
    const t = billTotal(b)
    total += t
    souls += b.participants.length
    if (b.lunas) {
      cleared += t
      lunas++
    } else {
      open++
    }
  }
  return { total, cleared, unsettled: total - cleared, souls, open, lunas }
}
