import type { Bill, Transfer } from '~~/shared/types'
import { formatRupiah } from '~~/shared/format'

/** The canonical share link for a bill. */
export function billLink(billId: string): string {
  if (import.meta.client) return `${window.location.origin}/bill/${billId}`
  return `/bill/${billId}`
}

export async function copyShareLink(billId: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(billLink(billId))
    return true
  } catch {
    return false
  }
}

/** Plain-text settlement recap for WhatsApp / messaging. */
export function settlementRecap(bill: Bill, transfers: Transfer[]): string {
  const name = (id: string) => bill.participants.find((p) => p.id === id)?.name ?? '?'
  const lines = transfers.map((t) => `• ${name(t.from)} → ${name(t.to)}: ${formatRupiah(t.amount)}`)
  return [
    `🏔️ ${bill.title} — settle up`,
    `${transfers.length} transfer${transfers.length === 1 ? '' : 's'} clears everyone:`,
    ...lines,
    '',
    billLink(bill.id),
  ].join('\n')
}

export function shareToWhatsApp(text: string) {
  if (import.meta.client) {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }
}
