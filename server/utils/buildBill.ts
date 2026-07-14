import { randomUUID } from 'node:crypto'
import { nextBadge } from '../../shared/badges'
import type { Bill, BadgeKey, CreateBillInput } from '../../shared/types'

/**
 * Materialize a full Bill from create-input: generate ids, auto-assign trail
 * badges (honoring any explicit badgeKey unless already taken), stamp createdAt.
 * Shared by every repository implementation so the persisted shape is identical
 * regardless of backend.
 */
export function buildBill(input: CreateBillInput): Bill {
  const taken: BadgeKey[] = []
  const participants = (input.participants ?? []).map((p) => {
    const badgeKey =
      p.badgeKey && !taken.includes(p.badgeKey) ? p.badgeKey : nextBadge(taken)
    taken.push(badgeKey)
    return { id: randomUUID(), name: p.name, badgeKey }
  })

  return {
    id: randomUUID(),
    title: input.title,
    createdAt: new Date().toISOString(),
    participants,
    entries: [],
    lunas: false,
  }
}
