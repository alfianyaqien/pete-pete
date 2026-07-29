/**
 * App-wide toast queue. A single `<toast-host>` (mounted in the default layout)
 * renders whatever is in this list. Call the helpers from any mutation site:
 *
 *   const toast = useToast()
 *   toast.success('Expense added', 'Bensin · Rp 90k')
 *   toast.error('Couldn’t save', 'Check your connection and retry')
 *
 * Non-error toasts auto-dismiss after ~3.5s; errors persist until dismissed so a
 * failure is never missed. The stack is capped so rapid edits can't bury the UI.
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  type: ToastType
  title: string
  message?: string
  duration: number // ms; 0 = stays until dismissed
}

const MAX = 4
let seq = 0

export function useToasts() {
  return useState<Toast[]>('toasts', () => [])
}

export function useToast() {
  const toasts = useToasts()

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function push(type: ToastType, title: string, message?: string, duration?: number): number {
    const id = ++seq
    const d = duration ?? (type === 'error' ? 0 : 3500)
    toasts.value = [...toasts.value, { id, type, title, message, duration: d }].slice(-MAX)
    if (d > 0 && import.meta.client) setTimeout(() => dismiss(id), d)
    return id
  }

  return {
    toasts,
    dismiss,
    push,
    success: (title: string, message?: string) => push('success', title, message),
    error: (title: string, message?: string) => push('error', title, message),
    warning: (title: string, message?: string) => push('warning', title, message),
    info: (title: string, message?: string) => push('info', title, message),
  }
}
