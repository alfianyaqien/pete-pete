import { sharedOrderTotal, computeBalances } from './settle'
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
