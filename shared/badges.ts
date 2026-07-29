import { BADGE_KEYS } from './schemas'
import type { BadgeKey } from './types'

/**
 * Auto-assign a travel badge to a new participant, preferring an unused one.
 * With more than 30 souls the keys repeat - then we pick the least-used badge.
 */
export function nextBadge(taken: readonly BadgeKey[]): BadgeKey {
  const free = BADGE_KEYS.find((k) => !taken.includes(k))
  if (free) return free

  const counts = new Map<BadgeKey, number>(BADGE_KEYS.map((k) => [k, 0]))
  for (const k of taken) counts.set(k, (counts.get(k) ?? 0) + 1)

  let best: BadgeKey = BADGE_KEYS[0]
  let bestCount = Infinity
  for (const k of BADGE_KEYS) {
    const c = counts.get(k) ?? 0
    if (c < bestCount) {
      bestCount = c
      best = k
    }
  }
  return best
}
