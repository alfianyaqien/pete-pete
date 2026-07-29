import type { Bill, Transfer } from '~~/shared/types'
import { formatRupiah } from '~~/shared/format'
import { downloadBlob } from '~/utils/exporters'

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

/**
 * Share an image via the OS share sheet (WhatsApp, Telegram, AirDrop, …) using
 * the Web Share API with a file attachment. Where that isn't supported (most
 * desktop browsers) it falls back to a plain download. Returns what happened so
 * the caller can show the right toast. A user-cancelled share is treated as
 * done — we don't then dump a download on them.
 */
export async function shareImageFile(
  blob: Blob,
  filename: string,
  text?: string,
): Promise<'shared' | 'downloaded'> {
  const file = new File([blob], filename, { type: blob.type || 'image/png' })
  const nav = navigator as Navigator & {
    canShare?: (d: ShareData) => boolean
    share?: (d: ShareData) => Promise<void>
  }
  if (nav.canShare?.({ files: [file] }) && nav.share) {
    try {
      await nav.share({ files: [file], title: 'PetePete', text })
      return 'shared'
    } catch (e) {
      if ((e as DOMException)?.name === 'AbortError') return 'shared' // user dismissed
      // any real failure → fall through to a download so they still get the file
    }
  }
  downloadBlob(blob, filename)
  return 'downloaded'
}
