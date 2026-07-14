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

/** Compact stat form: 1280000 → "1,28jt", 96000 → "96rb", 540 → "540". */
export function formatCompact(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return trimComma(n / 1_000_000) + 'jt'
  if (abs >= 1_000) return Math.round(n / 1_000) + 'rb'
  return String(Math.round(n))
}

function trimComma(v: number): string {
  // two decimals, Indonesian comma, trailing zeros trimmed
  return v.toFixed(2).replace(/\.?0+$/, '').replace('.', ',')
}

/** Signed compact balance, e.g. +543000 → "+543rb", -98000 → "−98rb". */
export function formatSignedCompact(n: number): string {
  if (n === 0) return '0'
  const sign = n > 0 ? '+' : '−'
  return sign + formatCompact(Math.abs(n))
}

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' })

/** ISO → "19 Jun" */
export function formatDateShort(iso: string): string {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? '' : dateFmt.format(d)
}
