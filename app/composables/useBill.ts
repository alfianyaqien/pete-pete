import type { Bill, Participant } from '~~/shared/types'

/** Fetch a bill by id (SSR + client), keyed for dedupe/refresh. */
export function useBill(id: string) {
  return useFetch<Bill>(`/api/bills/${id}`, { key: `bill:${id}` })
}

/**
 * Resolve "who the viewer is" for a bill from the identity store, falling back
 * to the first participant. Also exposes a setter for the identity chip.
 */
export function useIdentity(bill: Ref<Bill | null | undefined>) {
  const store = useIdentityStore()
  const me = computed<Participant | null>(() => {
    const b = unref(bill)
    if (!b || b.participants.length === 0) return null
    const id = store.forBill(b.id)
    return b.participants.find((p) => p.id === id) ?? b.participants[0]
  })
  function setMe(participantId: string) {
    const b = unref(bill)
    if (b) store.setForBill(b.id, participantId)
  }
  return { me, setMe }
}
