<script setup lang="ts">
import { settleBill, remainingDirectTransfers } from '~~/shared/settle'
import { billStats, personLedgers } from '~~/shared/stats'
import { formatRupiah } from '~~/shared/format'
import type { Bill, Transfer } from '~~/shared/types'

const route = useRoute()
const id = route.params.id as string
const { data: bill } = await useBill(id)
const { me, setMe } = useIdentity(bill)

const stats = computed(() => (bill.value ? billStats(bill.value) : null))

useHead({ title: 'Settle Up' })

const result = computed(() =>
  bill.value ? settleBill(bill.value) : { balances: [], transfers: [] },
)
const balances = computed(() =>
  [...result.value.balances].sort((a, b) => b.balance - a.balance),
)
const transfers = computed(() => result.value.transfers)

/** Two ways to read the same debts: 'efficient' = fewest transfers (may route
 *  through a middle person), 'direct' = pay who you actually shared with. */
const transferMode = ref<'efficient' | 'direct'>('efficient')
const directTransfers = computed(() => (bill.value ? remainingDirectTransfers(bill.value) : []))
const shownTransfers = computed(() =>
  transferMode.value === 'efficient' ? transfers.value : directTransfers.value,
)

const nameOf = (pid: string) => bill.value?.participants.find((p) => p.id === pid)?.name ?? '?'
const badgeOf = (pid: string) => bill.value?.participants.find((p) => p.id === pid)?.badgeKey

const ledgers = computed(() => (bill.value ? personLedgers(bill.value) : []))
/** Signed money for owed lines (a discount line is negative). */
const owedText = (n: number) => (n < 0 ? '−' : '') + formatRupiah(Math.abs(n))

const myBalance = computed(() => result.value.balances.find((b) => b.participantId === me.value?.id))
const owedBack = computed(() => Math.max(0, myBalance.value?.balance ?? 0))
const iOwe = computed(() => Math.max(0, -(myBalance.value?.balance ?? 0)))
const peopleOweMe = computed(() => transfers.value.filter((t) => t.to === me.value?.id).length)

/** Items nobody has claimed yet - the settlement holds them on the payer until
 *  claimed, so flag it so people know to go tap "that's mine". */
const unclaimed = computed(() => {
  let count = 0
  let amount = 0
  for (const e of bill.value?.entries ?? []) {
    if (e.type !== 'shared_order') continue
    for (const it of e.items) {
      if (it.orderedBy.length === 0) {
        count++
        amount += it.qty * it.priceEach
      }
    }
  }
  return { count, amount }
})

const fronters = computed(() =>
  result.value.balances.filter((b) => b.paid > 0).map((b) => nameOf(b.participantId)),
)
const frontedBy = computed(() =>
  fronters.value.length
    ? `${fronters.value[0]}${fronters.value.length > 1 ? ` & ${fronters.value.length - 1}` : ''}`
    : '-',
)

const shareOpen = ref(false)

// ── recorded settlement payments ──────────────────────────────────────────
const toast = useToast()
const payments = computed(() => bill.value?.payments ?? [])
const recordOpen = ref(false)
const prefill = ref<{ from: string; to: string; amount: number } | null>(null)
const busy = ref<string | null>(null) // id/key of the row currently mutating

function openRecord() {
  prefill.value = null
  recordOpen.value = true
}
/** Open the sheet pre-filled from a suggested transfer, for a partial amount. */
function openPartial(t: Transfer) {
  prefill.value = { from: t.from, to: t.to, amount: t.amount }
  recordOpen.value = true
}
function onPaymentDone(updated: Bill) {
  bill.value = updated
}

/** One tap: record the full suggested transfer as a real payment. */
async function markPaid(t: Transfer) {
  const key = `${t.from}:${t.to}:${t.amount}`
  busy.value = key
  try {
    bill.value = await $fetch<Bill>(`/api/bills/${id}/payments`, {
      method: 'POST',
      body: { from: t.from, to: t.to, amount: t.amount },
    })
    toast.success('Marked paid', `${nameOf(t.from)} to ${nameOf(t.to)}`)
  } catch (e: any) {
    toast.error('Couldn’t record payment', e?.data?.statusMessage || 'Please try again')
  } finally {
    busy.value = null
  }
}
const transferKey = (t: Transfer) => `${t.from}:${t.to}:${t.amount}`

async function voidPayment(pid: string) {
  busy.value = pid
  try {
    bill.value = await $fetch<Bill>(`/api/bills/${id}/payments/${pid}`, { method: 'DELETE' })
    toast.success('Payment voided')
  } catch (e: any) {
    toast.error('Couldn’t void payment', e?.data?.statusMessage || 'Please try again')
  } finally {
    busy.value = null
  }
}

/** The settle page carries a lot - split its three sections into tabs. Default
 *  to the transfers ("who settles whom"), the headline result of settling. */
const tab = ref<'balances' | 'transfers' | 'breakdown'>('transfers')
const tabs = [
  { label: 'Balances', value: 'balances' as const },
  { label: 'Transfers', value: 'transfers' as const },
  { label: 'Breakdown', value: 'breakdown' as const },
]
</script>

<template>
  <template v-if="bill">
    <screen-header back eyebrow="Settle up" :title="bill.title" @back="navigateTo(`/bill/${id}`)">
      <div class="rule-double mt-3 flex items-center justify-between pt-3">
        <span class="eyebrow">Total tally</span>
        <money-text :value="stats?.total ?? 0" class="text-xl font-600" />
      </div>
      <p class="mt-1 text-xs text-muted">fronted by {{ frontedBy }}</p>
    </screen-header>

    <main class="app-col flex-1 overflow-y-auto px-5 pb-28 pt-4">
      <!-- unclaimed nudge: settlement is provisional until everything is claimed -->
      <button
        v-if="unclaimed.count"
        type="button"
        class="mb-4 flex w-full items-center gap-2.5 rounded-card border border-ochre/50 bg-ochre/10 px-3.5 py-2.5 text-left border-solid"
        @click="navigateTo(`/bill/${id}`)"
      >
        <span class="i-tabler-hand-finger shrink-0 text-lg text-ochre" />
        <span class="flex-1 text-xs text-body">
          <b>{{ unclaimed.count }} item{{ unclaimed.count === 1 ? '' : 's' }} unclaimed</b>
          ({{ formatRupiah(unclaimed.amount) }}) - held by whoever paid until claimed. Tap to open the ledger and claim.
        </span>
        <span class="i-tabler-chevron-right text-muted" />
      </button>

      <!-- Your standing -->
      <hero-panel>
        <div class="flex items-center justify-between">
          <p class="text-[10px] font-600 uppercase tracking-[.1em]" style="color: #9dc2ae">
            Your standing here
          </p>
          <identity-chip
            :participants="bill.participants"
            :model-value="me?.id ?? null"
            @update:model-value="setMe"
          />
        </div>
        <div class="mt-3 flex gap-5">
          <div>
            <p class="text-[11px]" style="color: #9dc2ae">You're owed back</p>
            <p class="text-xl font-700" style="color: #e7b968"><money-text :value="owedBack" /></p>
          </div>
          <div>
            <p class="text-[11px]" style="color: #9dc2ae">You owe</p>
            <p class="text-xl font-700" style="color: #9ddfb6"><money-text :value="iOwe" /></p>
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2 text-[11px] font-600">
          <span class="rounded-chip-sm bg-white/12 px-2 py-1">{{ peopleOweMe }} people owe you</span>
          <span class="rounded-chip-sm bg-white/12 px-2 py-1">
            fronted <money-text :value="myBalance?.paid ?? 0" />
          </span>
        </div>
      </hero-panel>

      <!-- section tabs -->
      <core-segmented-control v-model="tab" class="mt-5" :options="tabs" />

      <!-- Where everyone stands -->
      <section v-show="tab === 'balances'" class="mt-4">
        <p class="eyebrow mb-2">Where everyone stands</p>
        <div class="card-parchment overflow-hidden">
        <div class="grid grid-cols-[1fr_auto_auto] gap-x-4 px-4 py-2 text-[10px] uppercase tracking-wide text-muted">
          <span>Person</span>
          <span class="text-right">Paid</span>
          <span class="text-right">Balance</span>
        </div>
        <div
          v-for="b in balances"
          :key="b.participantId"
          class="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-t border-line-faint px-4 py-2.5"
        >
          <div class="flex items-center gap-2">
            <avatar-badge :badge-key="badgeOf(b.participantId)!" :size="28" />
            <span class="text-sm">{{ nameOf(b.participantId) }}</span>
          </div>
          <money-text :value="b.paid" class="text-right text-sm" />
          <money-text :value="b.balance" signed class="text-right text-sm font-600" />
        </div>
        </div>
      </section>

      <!-- Who settles whom -->
      <section v-show="tab === 'transfers'" class="mt-4">
        <div class="mb-2 flex items-center justify-between gap-2">
          <p class="eyebrow">Who settles whom</p>
          <div class="flex rounded-control bg-surface-input p-0.5">
            <button
              type="button"
              class="rounded-chip px-2.5 py-1 text-xs font-600 transition-colors border-none cursor-pointer"
              :class="transferMode === 'efficient' ? 'bg-forest text-surface-card' : 'bg-transparent text-body'"
              @click="transferMode = 'efficient'"
            >
              Efficient
            </button>
            <button
              type="button"
              class="rounded-chip px-2.5 py-1 text-xs font-600 transition-colors border-none cursor-pointer"
              :class="transferMode === 'direct' ? 'bg-forest text-surface-card' : 'bg-transparent text-body'"
              @click="transferMode = 'direct'"
            >
              Direct
            </button>
          </div>
        </div>
        <p class="mb-2 text-xs text-muted">
          <template v-if="transferMode === 'efficient'">
            {{ shownTransfers.length }} transfer{{ shownTransfers.length === 1 ? '' : 's' }} - fewest
            payments to clear everyone, so money may pass through someone in the middle.
          </template>
          <template v-else>
            {{ shownTransfers.length }} transfer{{ shownTransfers.length === 1 ? '' : 's' }} - everyone
            pays who they actually shared an expense with. No middle-man, usually more payments.
          </template>
        </p>
        <div class="flex flex-col gap-2">
          <div
            v-for="(t, i) in shownTransfers"
            :key="i"
            class="rounded-card border border-line-light bg-surface-card px-3 py-2.5"
          >
            <div class="flex items-center gap-2">
              <avatar-badge :badge-key="badgeOf(t.from)!" :size="26" />
              <span class="text-sm font-600">{{ nameOf(t.from) }}</span>
              <span class="mx-1 flex-1 border-t border-dashed border-line-medium" />
              <span class="i-tabler-arrow-right text-muted" />
              <span class="text-sm font-600">{{ nameOf(t.to) }}</span>
              <avatar-badge :badge-key="badgeOf(t.to)!" :size="26" />
              <money-text :value="t.amount" class="ml-2 text-sm font-600" />
            </div>
            <div class="mt-2 flex justify-end gap-2">
              <button
                type="button"
                class="rounded-control border border-line-medium bg-surface-card px-2.5 py-1 text-[11px] font-600 text-forest border-solid disabled:opacity-60"
                :disabled="busy === transferKey(t)"
                @click="openPartial(t)"
              >
                Partial
              </button>
              <button
                type="button"
                class="rounded-control bg-forest px-2.5 py-1 text-[11px] font-600 text-surface-card disabled:opacity-60"
                :disabled="busy === transferKey(t)"
                @click="markPaid(t)"
              >
                <span v-if="busy === transferKey(t)" class="i-tabler-loader-2 animate-spin" />
                <template v-else>Mark paid</template>
              </button>
            </div>
          </div>
          <p v-if="!shownTransfers.length" class="py-4 text-center text-sm text-muted">
            Everyone is square - nothing to settle.
          </p>
        </div>

        <button
          type="button"
          class="mt-3 flex w-full items-center justify-center gap-2 rounded-card border border-dashed border-line-medium bg-surface-subtle py-2.5 text-sm font-600 text-forest"
          @click="openRecord"
        >
          <span class="i-tabler-plus" /> Record a payment
        </button>

        <!-- recorded payments history -->
        <div v-if="payments.length" class="mt-5">
          <p class="eyebrow mb-2">Recorded payments</p>
          <div class="flex flex-col gap-2">
            <div
              v-for="p in payments"
              :key="p.id"
              class="flex items-center gap-2 rounded-card border border-line-light bg-surface-card px-3 py-2"
            >
              <avatar-badge :badge-key="badgeOf(p.from)!" :size="22" />
              <span class="text-xs font-600">{{ nameOf(p.from) }}</span>
              <span class="i-tabler-arrow-right text-xs text-muted" />
              <span class="text-xs font-600">{{ nameOf(p.to) }}</span>
              <avatar-badge :badge-key="badgeOf(p.to)!" :size="22" />
              <money-text :value="p.amount" class="ml-auto text-xs font-600" />
              <button
                type="button"
                aria-label="Void payment"
                class="shrink-0 text-muted hover:text-terracotta disabled:opacity-60"
                :disabled="busy === p.id"
                @click="voidPayment(p.id)"
              >
                <span :class="busy === p.id ? 'i-tabler-loader-2 animate-spin' : 'i-tabler-x'" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- What each paid & owes -->
      <section v-show="tab === 'breakdown'" class="mt-4">
        <p class="eyebrow mb-2">What each paid &amp; owes</p>
        <div class="flex flex-col gap-2">
        <details
          v-for="l in ledgers"
          :key="l.participantId"
          class="card-parchment overflow-hidden px-3.5 py-2.5"
        >
          <summary class="flex cursor-pointer select-none items-center gap-2.5">
            <avatar-badge :badge-key="badgeOf(l.participantId)!" :size="28" />
            <span class="flex-1 text-sm font-600">{{ l.name }}</span>
            <money-text :value="l.net" signed class="text-sm font-600" />
            <span class="chev i-tabler-chevron-down text-muted transition-transform" />
          </summary>
          <div class="mt-2.5 flex flex-col gap-3 border-t border-line-faint pt-2.5">
            <div v-if="l.paid.length">
              <p class="text-[10px] font-700 uppercase tracking-wide text-forest">Paid up front</p>
              <div
                v-for="(p, i) in l.paid"
                :key="'p' + i"
                class="mt-0.5 flex items-baseline text-xs"
              >
                <span class="min-w-0 truncate text-body">{{ p.title }}</span>
                <span class="leader" />
                <money-text :value="p.amount" class="shrink-0 text-body" />
              </div>
            </div>
            <div v-if="l.owed.length">
              <p class="text-[10px] font-700 uppercase tracking-wide text-muted">Owes</p>
              <div
                v-for="(o, i) in l.owed"
                :key="'o' + i"
                class="mt-0.5 flex items-baseline text-xs"
              >
                <span class="min-w-0 truncate text-body">{{ o.label }}</span>
                <span class="leader" />
                <span class="num shrink-0 text-body">{{ owedText(o.amount) }}</span>
              </div>
            </div>
            <p v-if="!l.paid.length && !l.owed.length" class="text-xs text-muted">
              Not involved in any expense.
            </p>
          </div>
        </details>
        </div>
      </section>

      <!-- actions -->
      <div class="mt-6 flex gap-2">
        <core-button class="flex-1" @click="navigateTo(`/bill/${id}/export/image`)">
          <span class="i-tabler-share-2" /> Share
        </core-button>
        <core-button variant="ghost" class="flex-1" @click="shareOpen = true">
          <span class="i-tabler-download" /> Export
        </core-button>
      </div>

      <made-by class="mt-8" />
    </main>

    <bottom-nav active="settle" :bill-id="id" />
    <share-export-sheet v-model:open="shareOpen" :bill="bill" :transfers="transfers" />
    <record-payment-sheet
      v-model:open="recordOpen"
      :bill-id="id"
      :participants="bill.participants"
      :prefill="prefill"
      @done="onPaymentDone"
    />
  </template>

  <div v-else class="flex flex-1 items-center justify-center p-8 text-muted">Not found.</div>
</template>

<style scoped>
/* accordion: hide the native disclosure triangle, flip our chevron when open */
summary {
  list-style: none;
}
summary::-webkit-details-marker {
  display: none;
}
details[open] .chev {
  transform: rotate(180deg);
}
/* dotted leader connecting a label to its amount */
.leader {
  flex: 1 1 auto;
  align-self: flex-end;
  min-width: 14px;
  margin: 0 6px 3px;
  border-bottom: 1px dotted var(--pp-line-medium, #c2b79a);
}
</style>
