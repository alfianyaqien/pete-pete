/**
 * "Who am I" per bill. Because PetePete has no login, the viewer picks which
 * participant they are for a given bill via the identity chip. Persisted to
 * localStorage (pinia-plugin-persistedstate) keyed by bill id.
 */
export const useIdentityStore = defineStore('identity', {
  state: () => ({
    byBill: {} as Record<string, string>,
  }),
  getters: {
    forBill: (state) => (billId: string): string | null => state.byBill[billId] ?? null,
  },
  actions: {
    setForBill(billId: string, participantId: string) {
      this.byBill = { ...this.byBill, [billId]: participantId }
    },
    clearForBill(billId: string) {
      const next = { ...this.byBill }
      delete next[billId]
      this.byBill = next
    },
  },
  persist: true,
})
