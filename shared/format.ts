/** Indonesian Rupiah + date formatting helpers. */

const idGroup = new Intl.NumberFormat('id-ID')

/** 1284000 → "Rp 1.284.000" */
export function formatRupiah(n: number): string {
  return 'Rp ' + idGroup.format(Math.round(n))
}

/** 1284000 → "1.284.000" (no prefix) */
export function formatAmount(n: number): string {
  return idGroup.format(Math.round(n))
}

/**
 * Compact stat form, always prefixed: 1280000 → "Rp 1,28jt", 96000 → "Rp 96k",
 * 540 → "Rp 540". Thousands use the "k" people actually type (24k, 30k).
 */
export function formatCompact(n: number): string {
  return 'Rp ' + compactDigits(n)
}

/** The bare compact number, no prefix: 96000 → "96k". */
function compactDigits(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return trimComma(n / 1_000_000) + 'jt'
  if (abs >= 1_000) return Math.round(n / 1_000) + 'k'
  return String(Math.round(n))
}

function trimComma(v: number): string {
  // two decimals, Indonesian comma, trailing zeros trimmed
  return v.toFixed(2).replace(/\.?0+$/, '').replace('.', ',')
}

/** Signed compact balance, e.g. +543000 → "+Rp 543k", -98000 → "−Rp 98k". */
export function formatSignedCompact(n: number): string {
  if (n === 0) return 'Rp 0'
  const sign = n > 0 ? '+' : '−'
  return sign + 'Rp ' + compactDigits(Math.abs(n))
}

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' })

/** ISO → "19 Jun" */
export function formatDateShort(iso: string): string {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? '' : dateFmt.format(d)
}

// ── expense-date helpers (dates are stored as local 'YYYY-MM-DD' strings) ──

/** Local today as 'YYYY-MM-DD'. */
export function todayISO(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/** Parse a 'YYYY-MM-DD' string as a LOCAL date (avoids UTC off-by-one). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

const mediumFmt = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/** 'YYYY-MM-DD' → "19 Jun 2026" */
export function formatDateMedium(iso: string): string {
  if (!iso) return ''
  return mediumFmt.format(parseISODate(iso))
}

const weekdayFmt = new Intl.DateTimeFormat('en', { weekday: 'short' })

/** Day-group header, e.g. "Today · 19 Jun", "Yesterday · 18 Jun", "Fri · 17 Jun". */
export function formatDayHeader(iso: string): string {
  const date = parseISODate(iso)
  const today = parseISODate(todayISO())
  const diff = Math.round((date.getTime() - today.getTime()) / 86_400_000)
  const rel = diff === 0 ? 'Today' : diff === -1 ? 'Yesterday' : weekdayFmt.format(date)
  return `${rel} · ${dateFmt.format(date)}`
}
