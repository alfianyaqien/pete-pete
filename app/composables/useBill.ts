import type { Bill, Participant } from '~~/shared/types'

/** Fetch a bill by id (SSR + client), keyed for dedupe/refresh. */
export function useBill(id: string) {
  // Captured synchronously: at onMounted time this flag has already flipped.
  const hydrating = useNuxtApp().isHydrating
  const result = useFetch<Bill>(`/api/bills/${id}`, { key: `bill:${id}` })

  /**
   * Nuxt caches the bill under `bill:<id>` and shares it across every page that
   * asks for the same key — it does NOT refetch when another page mounts, so
   * returning from the add-expense form re-rendered the stale entry list.
   * Re-sync on each client mount (skipping the hydration pass, whose payload is
   * already fresh): the cached bill paints instantly, then revalidates.
   */
  if (import.meta.client) {
    onMounted(() => {
      if (!hydrating) result.refresh()
    })
  }
  return result
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
