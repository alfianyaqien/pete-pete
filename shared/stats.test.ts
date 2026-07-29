import { describe, it, expect } from 'vitest'
import { personLedgers, billTotal, payersLabel } from './stats'
import { computeBalances } from './settle'
import type { Bill, Entry } from './types'

const P = (id: string, name: string) => ({ id, name, badgeKey: 'fox' as const })

// One simple split + one itemised bill with fees, across 3 people.
const bill: Bill = {
  id: 'b1',
  title: 'Trip',
  createdAt: '2026-07-23T00:00:00.000Z',
  lunas: false,
  participants: [P('a', 'Ana'), P('b', 'Bud'), P('c', 'Cy')],
  entries: [
    {
      id: 'e1',
      type: 'simple',
      title: 'Bensin',
      date: '2026-07-23',
      amount: 90000,
      payers: [{ participantId: 'a', amount: 90000 }],
      shareMethod: 'equally',
      sharers: [
        { participantId: 'a', share: 30000 },
        { participantId: 'b', share: 30000 },
        { participantId: 'c', share: 30000 },
      ],
    },
    {
      id: 'e2',
      type: 'shared_order',
      title: 'Warung',
      date: '2026-07-23',
      // items 65.000 + 10% tax 6.500 + service 5.000 = 76.500 total
      payers: [{ participantId: 'b', amount: 76500 }],
      items: [
        { id: 'i1', name: 'Nasi Goreng', qty: 2, priceEach: 25000, orderedBy: ['a', 'b'] },
        { id: 'i2', name: 'Es Teh', qty: 3, priceEach: 5000, orderedBy: ['a', 'b', 'c'] },
      ],
      fees: { taxPercent: 10, service: 5000, other: 0 },
      discount: 0,
    },
  ],
}

describe('personLedgers', () => {
  const ledgers = personLedgers(bill)
  const byId = Object.fromEntries(ledgers.map((l) => [l.participantId, l]))
  const balances = Object.fromEntries(computeBalances(bill).map((b) => [b.participantId, b.balance]))

  it('net matches each person’s settlement balance', () => {
    for (const l of ledgers) expect(l.net).toBe(balances[l.participantId])
  })

  it('all owed sums to all paid, and to the bill total', () => {
    const owed = ledgers.reduce((a, l) => a + l.owedTotal, 0)
    const paid = ledgers.reduce((a, l) => a + l.paidTotal, 0)
    expect(owed).toBe(paid)
    expect(paid).toBe(billTotal(bill))
  })

  it('itemises bill lines as "Bill — Item" and adds a fees line', () => {
    const ana = byId['a']!
    const labels = ana.owed.map((o) => o.label)
    expect(labels).toContain('Warung — Nasi Goreng')
    expect(labels).toContain('Warung — Es Teh')
    expect(labels.some((l) => l.startsWith('Warung — fees'))).toBe(true)
    // Ana paid the Bensin, so it shows under paid, not owed twice
    expect(ana.paid.map((p) => p.title)).toContain('Bensin')
  })

  it('excludes people from items they did not order', () => {
    // Cy only ordered Es Teh, never Nasi Goreng
    const cy = byId['c']!
    expect(cy.owed.map((o) => o.label)).not.toContain('Warung — Nasi Goreng')
    expect(cy.owed.map((o) => o.label)).toContain('Warung — Es Teh')
  })
})

describe('personLedgers — unclaimed items', () => {
  const withUnclaimed: Bill = {
    id: 'b2',
    title: 'Trip',
    createdAt: '2026-07-24T00:00:00.000Z',
    lunas: false,
    participants: [P('a', 'Ana'), P('b', 'Bud'), P('c', 'Cy')],
    entries: [
      {
        id: 'e1',
        type: 'shared_order',
        title: 'Warung',
        date: '2026-07-24',
        payers: [{ participantId: 'a', amount: 100000 }],
        items: [
          { id: 'i1', name: 'Nasi', qty: 1, priceEach: 40000, orderedBy: ['b'] },
          { id: 'i2', name: 'Mystery', qty: 1, priceEach: 60000, orderedBy: [] },
        ],
        fees: { taxPercent: 0, service: 0, other: 0 },
        discount: 0,
      },
    ],
  }

  it('net still equals each person’s balance, and the payer holds the unclaimed line', () => {
    const ledgers = personLedgers(withUnclaimed)
    const balances = Object.fromEntries(
      computeBalances(withUnclaimed).map((b) => [b.participantId, b.balance]),
    )
    for (const l of ledgers) expect(l.net).toBe(balances[l.participantId])

    const ana = ledgers.find((l) => l.participantId === 'a')!
    // Ana fronted the whole bill and holds the unclaimed item as an owed line
    expect(ana.owed.map((o) => o.label)).toContain('Warung — Mystery (unclaimed)')
  })
})

describe('payersLabel', () => {
  const parts = bill.participants
  const mk = (payerIds: string[]): Entry => ({
    id: 'x',
    type: 'simple',
    title: 't',
    date: '2026-07-23',
    amount: 0,
    payers: payerIds.map((participantId) => ({ participantId, amount: 0 })),
    shareMethod: 'equally',
    sharers: [],
  })

  it('names one, two, and abbreviates three+ payers', () => {
    expect(payersLabel(mk(['a']), parts)).toBe('Ana')
    expect(payersLabel(mk(['a', 'b']), parts)).toBe('Ana & Bud')
    expect(payersLabel(mk(['a', 'b', 'c']), parts)).toBe('Ana, Bud +1')
  })
})
