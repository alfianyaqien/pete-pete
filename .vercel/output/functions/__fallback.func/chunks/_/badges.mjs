import { B as BADGE_KEYS } from './schemas.mjs';

function nextBadge(taken) {
  var _a, _b;
  const free = BADGE_KEYS.find((k) => !taken.includes(k));
  if (free) return free;
  const counts = new Map(BADGE_KEYS.map((k) => [k, 0]));
  for (const k of taken) counts.set(k, ((_a = counts.get(k)) != null ? _a : 0) + 1);
  let best = BADGE_KEYS[0];
  let bestCount = Infinity;
  for (const k of BADGE_KEYS) {
    const c = (_b = counts.get(k)) != null ? _b : 0;
    if (c < bestCount) {
      bestCount = c;
      best = k;
    }
  }
  return best;
}

export { nextBadge as n };
//# sourceMappingURL=badges.mjs.map
