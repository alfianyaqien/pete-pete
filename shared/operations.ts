import { splitProportional, sharedOrderTotal } from './settle'
import { nextBadge } from './badges'
import { todayISO } from './format'
import type {
  Bill,
  Entry,
  SimpleEntry,
  SharedOrderEntry,
  Sharer,
  ParticipantInput,
  EntryInput,
  BadgeKey,
} from './types'

/**
 * Pure bill mutations. Both repository implementations (memory + supabase) call
 * these so behavior is identical regardless of backend. Every mutation returns a
 * NEW Bill and preserves the invariant that, per entry, the cost shares and the
 * payments both sum to the entry total — otherwise settlement wouldn't net to
 * zero (see shared/settle.ts).
 */

export interface ParticipantPatch {
  name?: string
  badgeKey?: BadgeKey
}

function uid(): string {
  const c = (globalThis as any).crypto
  return c?.randomUUID ? c.randomUUID() : 'id-' + Math.random().toString(36).slice(2, 11)
}

const norm = (s: string) => s.trim().toLowerCase()

// ── participants ──────────────────────────────────────────────────────────
export function addParticipant(bill: Bill, input: ParticipantInput): Bill {
  if (bill.participants.some((p) => norm(p.name) === norm(input.name))) {
    throw new Error('Participant names must be unique')
  }
  const taken = bill.participants.map((p) => p.badgeKey)
  const badgeKey =
    input.badgeKey && !taken.includes(input.badgeKey) ? input.badgeKey : nextBadge(taken)
  return {
    ...bill,
    participants: [...bill.participants, { id: uid(), name: input.name.trim(), badgeKey }],
  }
}

export function updateParticipant(bill: Bill, pid: string, patch: ParticipantPatch): Bill {
  if (
    patch.name !== undefined &&
    bill.participants.some((p) => p.id !== pid && norm(p.name) === norm(patch.name!))
  ) {
    throw new Error('Participant names must be unique')
  }
  return {
    ...bill,
    participants: bill.participants.map((p) =>
      p.id === pid
        ? {
            ...p,
            ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
            ...(patch.badgeKey !== undefined ? { badgeKey: patch.badgeKey } : {}),
          }
        : p,
    ),
  }
}

/** Remove a participant and re-balance every expense they were part of. */
export function removeParticipant(bill: Bill, pid: string): Bill {
  const participants = bill.participants.filter((p) => p.id !== pid)
  const entries = bill.entries
    .map((e) => stripParticipant(e, pid))
    .filter((e): e is Entry => e !== null)
  return { ...bill, participants, entries }
}

function stripParticipant(entry: Entry, pid: string): Entry | null {
  return entry.type === 'simple'
    ? stripFromSimple(entry, pid)
    : stripFromShared(entry, pid)
}

function equalShares(amount: number, ids: string[]): Sharer[] {
  const parts = splitProportional(amount, ids.map(() => 1))
  return ids.map((participantId, i) => ({ participantId, share: parts[i] }))
}

function stripFromSimple(e: SimpleEntry, pid: string): SimpleEntry | null {
  let sharers = e.sharers.filter((s) => s.participantId !== pid)
  if (sharers.length === 0) return null // nobody left to owe → drop the entry

  // keep sum(shares) === amount
  sharers =
    e.shareMethod === 'equally'
      ? equalShares(e.amount, sharers.map((s) => s.participantId))
      : rebalance(e.amount, sharers, (s) => s.share, (s, v) => ({ ...s, share: v }))

  // keep sum(payments) === amount
  let payers = e.payers.filter((p) => p.participantId !== pid)
  payers =
    payers.length === 0
      ? [{ participantId: sharers[0].participantId, amount: e.amount }]
      : rebalance(e.amount, payers, (p) => p.amount, (p, v) => ({ ...p, amount: v }))

  return { ...e, sharers, payers }
}

function stripFromShared(e: SharedOrderEntry, pid: string): SharedOrderEntry | null {
  const items = e.items
    .map((it) => ({ ...it, orderedBy: it.orderedBy.filter((x) => x !== pid) }))
    .filter((it) => it.orderedBy.length > 0)
  if (items.length === 0) return null

  // keep sum(payers.amount) === total (removing a payer never changes the total)
  const total = sharedOrderTotal(e)
  let payers = e.payers.filter((p) => p.participantId !== pid)
  payers =
    payers.length === 0
      ? [{ participantId: items[0].orderedBy[0], amount: total }]
      : rebalance(total, payers, (p) => p.amount, (p, v) => ({ ...p, amount: v }))

  return { ...e, items, payers }
}

/** Re-spread `total` across rows proportionally to their current value. */
function rebalance<T>(
  total: number,
  rows: T[],
  get: (r: T) => number,
  set: (r: T, v: number) => T,
): T[] {
  const parts = splitProportional(total, rows.map(get))
  return rows.map((r, i) => set(r, parts[i]))
}

// ── entries ───────────────────────────────────────────────────────────────
function materializeEntry(input: EntryInput, id: string): Entry {
  const date = input.date ?? todayISO() // required once stored; default today
  if (input.type === 'simple') {
    return { ...input, id, date }
  }
  return { ...input, id, date, items: input.items.map((it) => ({ ...it, id: uid() })) }
}

export function addEntry(bill: Bill, input: EntryInput): Bill {
  return { ...bill, entries: [...bill.entries, materializeEntry(input, uid())] }
}

export function updateEntry(bill: Bill, entryId: string, input: EntryInput): Bill {
  return {
    ...bill,
    entries: bill.entries.map((e) => (e.id === entryId ? materializeEntry(input, entryId) : e)),
  }
}

export function removeEntry(bill: Bill, entryId: string): Bill {
  return { ...bill, entries: bill.entries.filter((e) => e.id !== entryId) }
}
