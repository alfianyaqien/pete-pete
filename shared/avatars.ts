import { BADGE_KEYS } from './schemas'
import type { BadgeKey } from './types'

/**
 * The 30 "travel badge" woodcut avatars, ported verbatim from the design handoff
 * (PetePete.dc.html "Avatar set" block). Each entry is the inner line-drawing
 * markup of an SVG `<g>`; the AvatarBadge component wraps it with the shared
 * parchment disc + stroke group. The colored ring rotates forest → ochre →
 * terracotta by position in the set (index % 3), matching the design sheet.
 */
const RING = ['#1E4D3A', '#C2902F', '#A6492C'] as const

const ART: Record<BadgeKey, { label: string; art: string }> = {
  ibex: {
    label: 'Ibex',
    art: '<path d="M22 18 Q14 14 13 24 Q12 32 18 33"/><path d="M38 18 Q46 14 47 24 Q48 32 42 33"/><path d="M24 26 L24 38 Q30 44 36 38 L36 26"/><path d="M24 30 L36 30"/><circle cx="26" cy="32" r="1.3" fill="#2E2519"/><circle cx="34" cy="32" r="1.3" fill="#2E2519"/><path d="M28 44 Q30 47 32 44"/>',
  },
  owl: {
    label: 'Owl',
    art: '<path d="M16 20 L20 26 M44 20 L40 26"/><path d="M18 24 Q18 44 30 44 Q42 44 42 24 Q42 16 30 16 Q18 16 18 24Z"/><circle cx="23" cy="27" r="5"/><circle cx="37" cy="27" r="5"/><circle cx="23" cy="27" r="1.4" fill="#2E2519"/><circle cx="37" cy="27" r="1.4" fill="#2E2519"/><path d="M28 33 L30 36 L32 33Z" fill="#2E2519" stroke="none"/>',
  },
  fox: {
    label: 'Fox',
    art: '<path d="M18 18 L23 28 M42 18 L37 28"/><path d="M20 26 Q20 34 30 42 Q40 34 40 26 Q40 22 30 24 Q20 22 20 26Z"/><circle cx="25" cy="29" r="1.3" fill="#2E2519"/><circle cx="35" cy="29" r="1.3" fill="#2E2519"/><circle cx="30" cy="38" r="1.6" fill="#2E2519"/>',
  },
  bear: {
    label: 'Bear',
    art: '<circle cx="20" cy="20" r="5"/><circle cx="40" cy="20" r="5"/><path d="M19 27 Q19 42 30 42 Q41 42 41 27 Q41 20 30 22 Q19 20 19 27Z"/><circle cx="25" cy="30" r="1.3" fill="#2E2519"/><circle cx="35" cy="30" r="1.3" fill="#2E2519"/><ellipse cx="30" cy="36" rx="3" ry="2.4"/>',
  },
  stag: {
    label: 'Stag',
    art: '<path d="M22 20 Q16 10 12 14 M22 20 Q18 12 14 20 M22 20 L22 26"/><path d="M38 20 Q44 10 48 14 M38 20 Q42 12 46 20 M38 20 L38 26"/><path d="M24 26 Q24 40 30 44 Q36 40 36 26"/><circle cx="27" cy="31" r="1.3" fill="#2E2519"/><circle cx="33" cy="31" r="1.3" fill="#2E2519"/><path d="M28 40 Q30 42 32 40"/>',
  },
  hare: {
    label: 'Hare',
    art: '<path d="M24 24 Q20 8 25 8 Q29 8 27 24"/><path d="M36 24 Q40 8 35 8 Q31 8 33 24"/><path d="M24 26 Q24 42 30 44 Q36 42 36 26 Q36 22 30 23 Q24 22 24 26Z"/><circle cx="26" cy="31" r="1.3" fill="#2E2519"/><circle cx="34" cy="31" r="1.3" fill="#2E2519"/><path d="M29 37 L31 37"/>',
  },
  eagle: {
    label: 'Eagle',
    art: '<path d="M20 22 Q22 16 30 16 Q38 16 40 22"/><path d="M19 24 Q19 34 24 34 L36 34 Q41 34 41 24 Q41 30 36 30 L24 30 Q19 30 19 24Z"/><circle cx="25" cy="26" r="1.4" fill="#2E2519"/><circle cx="35" cy="26" r="1.4" fill="#2E2519"/><path d="M28 34 Q26 42 30 44 Q34 42 32 34"/><path d="M27 38 L33 38"/>',
  },
  boar: {
    label: 'Boar',
    art: '<path d="M20 22 L17 16 M40 22 L43 16"/><path d="M22 26 Q22 38 30 42 Q38 38 38 26 Q38 32 30 33 Q22 32 22 26Z"/><circle cx="26" cy="29" r="1.2" fill="#2E2519"/><circle cx="34" cy="29" r="1.2" fill="#2E2519"/><ellipse cx="30" cy="37" rx="4" ry="3"/><path d="M28 37 L28 35 M32 37 L32 35"/>',
  },
  raven: {
    label: 'Raven',
    art: '<path d="M22 20 Q22 16 28 18 Q34 20 34 24"/><path d="M22 20 Q16 28 22 36 Q30 42 38 34 Q42 28 34 24"/><path d="M34 24 L42 22"/><circle cx="27" cy="26" r="1.4" fill="#2E2519"/>',
  },
  tortoise: {
    label: 'Tortoise',
    art: '<path d="M16 34 Q16 22 30 22 Q44 22 44 34 Q44 38 40 38 L20 38 Q16 38 16 34Z"/><path d="M30 22 L30 38 M23 24 L20 32 M37 24 L40 32"/><path d="M16 34 Q12 34 11 30"/><circle cx="12" cy="31" r="1.2" fill="#2E2519"/><path d="M20 38 L20 42 M40 38 L40 42"/>',
  },
  frog: {
    label: 'Frog',
    art: '<circle cx="22" cy="24" r="5"/><circle cx="38" cy="24" r="5"/><circle cx="22" cy="24" r="1.4" fill="#2E2519"/><circle cx="38" cy="24" r="1.4" fill="#2E2519"/><path d="M17 30 Q17 40 30 40 Q43 40 43 30"/><path d="M24 35 Q30 39 36 35"/>',
  },
  macan: {
    label: 'Macan',
    art: '<circle cx="21" cy="22" r="4"/><circle cx="39" cy="22" r="4"/><path d="M20 26 Q20 40 30 44 Q40 40 40 26 Q40 22 30 23 Q20 22 20 26Z"/><path d="M27 22 L25 28 M33 22 L35 28 M30 24 L30 29"/><circle cx="26" cy="31" r="1.3" fill="#2E2519"/><circle cx="34" cy="31" r="1.3" fill="#2E2519"/><path d="M30 35 L30 38 M27 37 L24 37 M33 37 L36 37"/>',
  },
  lynx: {
    label: 'Lynx',
    art: '<path d="M19 22 L16 11 L24 19"/><path d="M41 22 L44 11 L36 19"/><path d="M20 25 Q20 38 30 43 Q40 38 40 25 Q40 21 30 22 Q20 21 20 25Z"/><path d="M14 28 L20 30 M14 33 L20 32"/><path d="M46 28 L40 30 M46 33 L40 32"/><circle cx="25" cy="29" r="1.3" fill="#2E2519"/><circle cx="35" cy="29" r="1.3" fill="#2E2519"/><path d="M28 36 L30 34 L32 36"/>',
  },
  wolf: {
    label: 'Wolf',
    art: '<path d="M18 17 L23 27 M42 17 L37 27"/><path d="M20 24 Q18 36 30 44 Q42 36 40 24 Q40 21 30 23 Q20 21 20 24Z"/><circle cx="25" cy="29" r="1.3" fill="#2E2519"/><circle cx="35" cy="29" r="1.3" fill="#2E2519"/><path d="M26 35 Q30 33 34 35"/><path d="M30 35 L30 40 M30 40 L27 42 M30 40 L33 42"/>',
  },
  badger: {
    label: 'Badger',
    art: '<path d="M21 21 Q19 16 24 18"/><path d="M39 21 Q41 16 36 18"/><path d="M19 24 Q19 40 30 43 Q41 40 41 24 Q41 20 30 22 Q19 20 19 24Z"/><path d="M26 22 L25 38"/><path d="M34 22 L35 38"/><circle cx="24" cy="30" r="1.2" fill="#2E2519"/><circle cx="36" cy="30" r="1.2" fill="#2E2519"/><path d="M28 39 Q30 41 32 39"/>',
  },
  hedgehog: {
    label: 'Hedgehog',
    art: '<path d="M13 30 L9 23 M18 24 L15 15 M24 20 L23 11 M31 19 L31 10 M37 20 L39 12 M43 24 L46 16 M48 30 L52 24"/><path d="M14 31 Q14 40 23 42 L27 47 L31 42 Q44 40 45 31 Q38 27 30 27 Q20 27 14 31Z"/><circle cx="24" cy="35" r="1.1" fill="#2E2519"/><circle cx="34" cy="35" r="1.1" fill="#2E2519"/><circle cx="29" cy="46" r="1.5" fill="#2E2519"/>',
  },
  marmot: {
    label: 'Marmot',
    art: '<circle cx="21" cy="22" r="3.4"/><circle cx="39" cy="22" r="3.4"/><path d="M20 26 Q20 40 30 43 Q40 40 40 26 Q40 22 30 23 Q20 22 20 26Z"/><circle cx="26" cy="29" r="1.3" fill="#2E2519"/><circle cx="34" cy="29" r="1.3" fill="#2E2519"/><path d="M28 34 Q30 36 32 34"/><path d="M29 37 L29 40 M31 37 L31 40"/>',
  },
  squirrel: {
    label: 'Squirrel',
    art: '<path d="M42 40 Q53 33 47 19 Q44 12 38 16"/><path d="M22 21 Q19 13 26 16"/><path d="M37 21 Q40 13 33 16"/><path d="M22 25 Q22 38 30 42 Q38 38 38 25 Q38 22 30 23 Q22 22 22 25Z"/><circle cx="27" cy="29" r="1.2" fill="#2E2519"/><circle cx="35" cy="29" r="1.2" fill="#2E2519"/><path d="M30 33 L30 36 M28 38 L30 36 L32 38"/>',
  },
  mouse: {
    label: 'Mouse',
    art: '<circle cx="20" cy="20" r="6"/><circle cx="40" cy="20" r="6"/><path d="M22 26 Q22 38 30 43 Q38 38 38 26 Q38 24 30 25 Q22 24 22 26Z"/><circle cx="26" cy="30" r="1.2" fill="#2E2519"/><circle cx="34" cy="30" r="1.2" fill="#2E2519"/><circle cx="30" cy="37" r="1.4" fill="#2E2519"/><path d="M30 38 L22 40 M30 38 L24 43 M30 38 L38 40 M30 38 L36 43"/>',
  },
  salamander: {
    label: 'Salamander',
    art: '<ellipse cx="30" cy="15" rx="6" ry="5"/><path d="M30 20 Q24 27 30 33 Q36 40 30 48"/><path d="M26 23 L17 19 M34 23 L43 19 M27 35 L18 39 M33 35 L42 39"/><circle cx="27" cy="14" r="1.2" fill="#2E2519"/><circle cx="33" cy="14" r="1.2" fill="#2E2519"/><circle cx="28" cy="28" r="1.3" fill="#2E2519"/><circle cx="32" cy="38" r="1.3" fill="#2E2519"/>',
  },
  snake: {
    label: 'Snake',
    art: '<path d="M31 14 Q45 18 41 30 Q35 43 24 38 Q15 33 21 27 Q26 23 31 28"/><circle cx="31" cy="14" r="3.4"/><circle cx="31" cy="14" r="1.1" fill="#2E2519"/><path d="M30 11 L30 7 M30 7 L28 5 M30 7 L32 5"/>',
  },
  beetle: {
    label: 'Beetle',
    art: '<ellipse cx="30" cy="31" rx="11" ry="14"/><path d="M30 18 L30 45"/><path d="M26 17 Q30 13 34 17"/><path d="M27 15 L23 9 M33 15 L37 9"/><path d="M19 25 L13 21 M19 31 L12 31 M19 37 L13 41 M41 25 L47 21 M41 31 L48 31 M41 37 L47 41"/>',
  },
  moth: {
    label: 'Moth',
    art: '<ellipse cx="30" cy="30" rx="2.6" ry="9"/><path d="M28 24 Q12 17 14 30 Q14 37 28 32"/><path d="M32 24 Q48 17 46 30 Q46 37 32 32"/><path d="M28 33 Q19 39 25 45 Q29 45 29 38"/><path d="M32 33 Q41 39 35 45 Q31 45 31 38"/><path d="M28 22 Q24 14 19 14"/><path d="M32 22 Q36 14 41 14"/><circle cx="20" cy="28" r="2"/><circle cx="40" cy="28" r="2"/>',
  },
  trout: {
    label: 'Trout',
    art: '<path d="M15 30 Q27 18 41 24 Q49 27 49 30 Q49 33 41 36 Q27 42 15 30Z"/><path d="M15 30 L9 23 M15 30 L9 37 M9 23 L9 37"/><circle cx="41" cy="28" r="1.3" fill="#2E2519"/><path d="M37 24 Q35 30 37 36"/><path d="M28 21 L30 15 L34 22"/><circle cx="30" cy="29" r="1" fill="#2E2519"/><circle cx="34" cy="32" r="1" fill="#2E2519"/>',
  },
  heron: {
    label: 'Heron',
    art: '<circle cx="38" cy="16" r="3"/><path d="M40 16 L50 13"/><path d="M37 13 L32 10"/><path d="M37 19 Q33 25 38 31 Q43 37 35 43"/><ellipse cx="29" cy="43" rx="9" ry="5"/><path d="M27 48 L25 55 M32 48 L34 55"/><circle cx="38" cy="15" r="0.9" fill="#2E2519"/>',
  },
  goat: {
    label: 'Goat',
    art: '<path d="M23 19 Q13 18 15 27 Q17 31 21 29"/><path d="M37 19 Q47 18 45 27 Q43 31 39 29"/><path d="M24 22 Q24 38 30 44 Q36 38 36 22 Q36 19 30 20 Q24 19 24 22Z"/><circle cx="27" cy="28" r="1.2" fill="#2E2519"/><circle cx="33" cy="28" r="1.2" fill="#2E2519"/><path d="M29 37 L29 39 M31 37 L31 39"/><path d="M30 44 L30 48"/>',
  },
  naga: {
    label: 'Naga',
    art: '<path d="M22 42 Q13 37 18 28 Q23 19 32 23"/><path d="M32 23 Q41 20 42 28 Q42 35 35 34 Q30 33 31 28"/><path d="M35 16 L33 11 M39 18 L40 12 M42 23 L47 20"/><path d="M41 28 Q47 26 49 30"/><path d="M40 32 Q46 34 47 38"/><circle cx="36" cy="26" r="1.1" fill="#2E2519"/><path d="M22 36 Q26 34 28 36"/>',
  },
  garuda: {
    label: 'Garuda',
    art: '<circle cx="30" cy="22" r="5"/><path d="M30 24 L29 29 L33 27Z" fill="#2E2519" stroke="none"/><path d="M26 16 L25 11 M30 15 L30 9 M34 16 L35 11"/><path d="M25 24 Q12 22 11 33 Q19 30 24 33"/><path d="M35 24 Q48 22 49 33 Q41 30 36 33"/><path d="M28 30 L28 44 M32 30 L32 44 M30 30 L30 46"/><circle cx="28" cy="21" r="1" fill="#2E2519"/><circle cx="32" cy="21" r="1" fill="#2E2519"/>',
  },
  butterfly: {
    label: 'Butterfly',
    art: '<ellipse cx="30" cy="30" rx="2" ry="10"/><path d="M29 24 Q13 13 16 28 L29 31"/><path d="M31 24 Q47 13 44 28 L31 31"/><path d="M29 32 Q18 41 25 47 L30 34"/><path d="M31 32 Q42 41 35 47 L30 34"/><path d="M28 21 Q24 13 22 12"/><path d="M32 21 Q36 13 38 12"/><circle cx="22" cy="23" r="2"/><circle cx="38" cy="23" r="2"/>',
  },
  mantis: {
    label: 'Mantis',
    art: '<path d="M24 16 L30 23 L36 16 Q30 12 24 16Z"/><circle cx="26" cy="17" r="1.5" fill="#2E2519"/><circle cx="34" cy="17" r="1.5" fill="#2E2519"/><path d="M27 14 L24 9 M33 14 L36 9"/><path d="M30 23 Q28 35 30 45"/><path d="M28 27 L20 23 L18 29 L24 31"/><path d="M32 27 L40 23 L42 29 L36 31"/><path d="M30 37 L23 41 M30 41 L25 47 M30 37 L37 41 M30 41 L35 47"/>',
  },
}

export interface AvatarDef {
  key: BadgeKey
  label: string
  /** inner SVG markup of the woodcut line drawing (no surrounding <g>) */
  art: string
  /** ring stroke color (forest / ochre / terracotta) */
  ring: string
}

/** All 30 avatars in handoff order, with their rotating ring color. */
export const AVATARS: AvatarDef[] = BADGE_KEYS.map((key, i) => ({
  key,
  label: ART[key].label,
  art: ART[key].art,
  ring: RING[i % 3],
}))

export const AVATAR_BY_KEY: Record<BadgeKey, AvatarDef> = Object.fromEntries(
  AVATARS.map((a) => [a.key, a]),
) as Record<BadgeKey, AvatarDef>
