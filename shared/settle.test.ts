import { describe, it, expect } from 'vitest'
import {
  splitProportional,
  allocateEntry,
  sharedOrderTotal,
  computeBalances,
  settle,
  settleBill,
} from './settle'
import { setItemClaim } from './operations'
import type { Bill, Participant, Transfer, Balance } from './types'

const P = (id: string): Participant => ({ id, name: id, badgeKey: 'fox' })

/** Net position of each participant after applying a transfer set. Should be
 *  the negative of their starting balance (i.e. transfers clear everyone). */
function netAfterTransfers(transfers: Transfer[]): Record<string, number> {
  const net: Record<string, number> = {}
  for (const t of transfers) {
    net[t.from] = (net[t.from] ?? 0) - t.amount
    net[t.to] = (net[t.to] ?? 0) + t.amount
  }
  return net
}

function assertClears(balances: Balance[], transfers: Transfer[]) {
  const net = netAfterTransfers(transfers)
  for (const b of balances) {
    // a creditor (+) receives exactly their credit; a debtor (−) sends it
    expect(net[b.participantId] ?? 0).toBe(b.balance)
  }
}

describe('splitProportional', () => {
  it('always sums back to the total', () => {
    expect(splitProportional(100, [1, 1, 1])).toEqual([34, 33, 33])
    expect(splitProportional(10001, [1, 1]).reduce((a, b) => a + b)).toBe(10001)
    expect(splitProportional(642000, [3, 5, 1]).reduce((a, b) => a + b)).toBe(642000)
  })
  it('splits equally when all weights are zero', () => {
    expect(splitProportional(9, [0, 0, 0])).toEqual([3, 3, 3])
  })
})

describe('simple entry — equal split', () => {
  const bill: Bill = {
    id: 'b1',
    title: 'Argopuro',
    createdAt: new Date().toISOString(),
    lunas: false,
    participants: ['A', 'B', 'C', 'D'].map(P),
    entries: [
      {
        id: 'e1',
        type: 'simple',
        title: 'Lodging',
        date: '2026-06-19',
        amount: 400_000,
        payers: [{ participantId: 'A', amount: 400_000 }],
        shareMethod: 'equally',
        sharers: ['A', 'B', 'C', 'D'].map((id) => ({ participantId: id, share: 100_000 })),
      },
    ],
  }

  it('computes balances: payer +300k, others −100k', () => {
    const balances = computeBalances(bill)
    const byId = Object.fromEntries(balances.map((b) => [b.participantId, b]))
    expect(byId.A.balance).toBe(300_000)
    expect(byId.B.balance).toBe(-100_000)
    expect(byId.C.balance).toBe(-100_000)
    expect(byId.D.balance).toBe(-100_000)
    // balances always sum to zero
    expect(balances.reduce((a, b) => a + b.balance, 0)).toBe(0)
  })

  it('settles in 3 transfers, all to A, and clears everyone', () => {
    const { balances, transfers } = settleBill(bill)
    expect(transfers).toHaveLength(3)
    expect(transfers.every((t) => t.to === 'A' && t.amount === 100_000)).toBe(true)
    expect(new Set(transfers.map((t) => t.from))).toEqual(new Set(['B', 'C', 'D']))
    assertClears(balances, transfers)
  })
})

describe('shared order — items + proportional fees', () => {
  // a orders 70k of items, b orders 30k; net fees +10k → total 110k
  const entry = {
    id: 'e2',
    type: 'shared_order' as const,
    title: 'Warung dinner',
    date: '2026-06-19',
    payers: [{ participantId: 'Q', amount: 110_000 }],
    items: [
      { id: 'i1', name: 'Nasi goreng', qty: 2, priceEach: 30_000, orderedBy: ['a', 'b'] }, // 60k → 30k each
      { id: 'i2', name: 'Sate', qty: 1, priceEach: 40_000, orderedBy: ['a'] }, // 40k → a
    ],
    fees: { taxPercent: 10, service: 5_000, other: 0 }, // tax 10k
    discount: 5_000,
  }

  it('totals items + tax + service − discount', () => {
    expect(sharedOrderTotal(entry)).toBe(110_000) // 100k + 10k + 5k − 5k
  })

  it('allocates fees proportionally to each person’s items', () => {
    const { shares, payments, total } = allocateEntry(entry)
    expect(total).toBe(110_000)
    expect(shares.a).toBe(77_000) // 70k items + 7k fees
    expect(shares.b).toBe(33_000) // 30k items + 3k fees
    expect(Object.values(shares).reduce((x, y) => x + y, 0)).toBe(total)
    expect(payments.Q).toBe(110_000)
  })
})

describe('multi-entry bill — settlement invariants', () => {
  const bill: Bill = {
    id: 'b2',
    title: 'Villa Puncak',
    createdAt: new Date().toISOString(),
    lunas: false,
    participants: ['Iqbal', 'Qoni', 'Surya', 'Izzam', 'Dewi'].map(P),
    entries: [
      {
        id: 'e1',
        type: 'simple',
        title: 'Gasoline',
        date: '2026-06-19',
        amount: 320_000,
        payers: [{ participantId: 'Iqbal', amount: 320_000 }],
        shareMethod: 'equally',
        sharers: ['Iqbal', 'Qoni', 'Surya', 'Izzam', 'Dewi'].map((id) => ({
          participantId: id,
          share: 64_000,
        })),
      },
      {
        id: 'e2',
        type: 'shared_order',
        title: 'Warung dinner',
        date: '2026-06-20',
        payers: [{ participantId: 'Qoni', amount: 210_900 }], // 190k items + 11% tax
        items: [
          { id: 'i1', name: 'Nasi', qty: 4, priceEach: 25_000, orderedBy: ['Qoni', 'Dewi'] },
          { id: 'i2', name: 'Ayam', qty: 2, priceEach: 45_000, orderedBy: ['Surya', 'Izzam'] },
        ],
        fees: { taxPercent: 11, service: 0, other: 0 },
        discount: 0,
      },
    ],
  }

  it('balances sum to zero, transfers clear everyone in ≤ n−1 moves', () => {
    const { balances, transfers } = settleBill(bill)
    expect(balances.reduce((a, b) => a + b.balance, 0)).toBe(0)
    expect(transfers.length).toBeLessThanOrEqual(bill.participants.length - 1)
    assertClears(balances, transfers)
    // every transfer is a positive integer
    expect(transfers.every((t) => Number.isInteger(t.amount) && t.amount > 0)).toBe(true)
  })
})

describe('settle — opposite-sort greedy + determinism', () => {
  const B = (participantId: string, balance: number): Balance => ({
    participantId,
    spent: 0,
    paid: 0,
    balance,
  })
  // creditors C1=100, C2=30 · debtors D1=90, D2=40 (sums to zero)
  const balances = [B('C1', 100), B('C2', 30), B('D1', -90), B('D2', -40)]

  it('avoids sliver transfers and still clears everyone', () => {
    const transfers = settle(balances)
    expect(transfers).toHaveLength(3)
    // big-vs-big would emit a 10 sliver; opposite-sort's smallest transfer is 30
    expect(Math.min(...transfers.map((t) => t.amount))).toBe(30)
    assertClears(balances, transfers)
  })

  it('is deterministic — same balances, any input order → identical transfers', () => {
    const shuffled = [B('D2', -40), B('C2', 30), B('D1', -90), B('C1', 100)]
    expect(settle(shuffled)).toEqual(settle(balances))
  })
})

describe('unclaimed items — held by payer, moved on claim', () => {
  const bill: Bill = {
    id: 'u1',
    title: 'Warung',
    createdAt: new Date().toISOString(),
    lunas: false,
    participants: ['Ana', 'Bud', 'Cy'].map(P),
    entries: [
      {
        id: 'e1',
        type: 'shared_order',
        title: 'Dinner',
        date: '2026-07-24',
        payers: [{ participantId: 'Ana', amount: 100_000 }],
        items: [
          { id: 'i1', name: 'Nasi', qty: 1, priceEach: 40_000, orderedBy: ['Bud'] },
          { id: 'i2', name: 'Mystery', qty: 1, priceEach: 60_000, orderedBy: [] }, // unclaimed
        ],
        fees: { taxPercent: 0, service: 0, other: 0 },
        discount: 0,
      },
    ],
  }

  const byId = (b: Bill) =>
    Object.fromEntries(computeBalances(b).map((x) => [x.participantId, x.balance]))

  it('keeps balances zero-sum with the payer holding the unclaimed item', () => {
    const balances = computeBalances(bill)
    expect(balances.reduce((a, b) => a + b.balance, 0)).toBe(0)
    const by = byId(bill)
    // Ana fronted 100k and holds the 60k mystery item → net +40k; Bud owes 40k
    expect(by.Ana).toBe(40_000)
    expect(by.Bud).toBe(-40_000)
    expect(by.Cy).toBe(0)
  })

  it('moves the cost onto the claimer when they claim it', () => {
    const by = byId(setItemClaim(bill, 'e1', 'i2', 'Cy', true))
    expect(by.Ana).toBe(100_000) // now owed the full front
    expect(by.Bud).toBe(-40_000)
    expect(by.Cy).toBe(-60_000)
  })

  it('claim then unclaim returns to the held-by-payer state', () => {
    const claimed = setItemClaim(bill, 'e1', 'i2', 'Cy', true)
    const reverted = setItemClaim(claimed, 'e1', 'i2', 'Cy', false)
    expect(byId(reverted)).toEqual(byId(bill))
  })

  it('rejects a claim from someone not on the bill', () => {
    expect(() => setItemClaim(bill, 'e1', 'i2', 'ghost', true)).toThrow()
  })
})
