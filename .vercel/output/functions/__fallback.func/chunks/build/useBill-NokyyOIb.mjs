import { f as useFetch } from './server.mjs';
import { computed, unref } from 'vue';
import { defineStore } from 'pinia';

const idGroup = new Intl.NumberFormat("id-ID");
function formatRupiah(n) {
  return "Rp " + idGroup.format(Math.round(n));
}
function formatAmount(n) {
  return idGroup.format(Math.round(n));
}
function formatCompact(n) {
  const abs = Math.abs(n);
  if (abs >= 1e6) return trimComma(n / 1e6) + "jt";
  if (abs >= 1e3) return Math.round(n / 1e3) + "rb";
  return String(Math.round(n));
}
function trimComma(v) {
  return v.toFixed(2).replace(/\.?0+$/, "").replace(".", ",");
}
function formatSignedCompact(n) {
  if (n === 0) return "0";
  const sign = n > 0 ? "+" : "\u2212";
  return sign + formatCompact(Math.abs(n));
}
const dateFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" });
function formatDateShort(iso) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : dateFmt.format(d);
}

const useIdentityStore = defineStore("identity", {
  state: () => ({
    byBill: {}
  }),
  getters: {
    forBill: (state) => (billId) => state.byBill[billId] ?? null
  },
  actions: {
    setForBill(billId, participantId) {
      this.byBill = { ...this.byBill, [billId]: participantId };
    },
    clearForBill(billId) {
      const next = { ...this.byBill };
      delete next[billId];
      this.byBill = next;
    }
  },
  persist: true
});
function useBill(id) {
  return useFetch(
    `/api/bills/${id}`,
    { key: `bill:${id}` },
    "$q8GuZf943i"
    /* nuxt-injected */
  );
}
function useBills() {
  return useFetch(
    "/api/bills",
    { key: "bills" },
    "$WzOt76i4Yj"
    /* nuxt-injected */
  );
}
function useIdentity(bill) {
  const store = useIdentityStore();
  const me = computed(() => {
    const b = unref(bill);
    if (!b || b.participants.length === 0) return null;
    const id = store.forBill(b.id);
    return b.participants.find((p) => p.id === id) ?? b.participants[0];
  });
  function setMe(participantId) {
    const b = unref(bill);
    if (b) store.setForBill(b.id, participantId);
  }
  return { me, setMe };
}

export { formatDateShort as a, formatAmount as b, useIdentity as c, formatSignedCompact as d, useBills as e, formatRupiah as f, formatCompact as g, useBill as u };
//# sourceMappingURL=useBill-NokyyOIb.mjs.map
