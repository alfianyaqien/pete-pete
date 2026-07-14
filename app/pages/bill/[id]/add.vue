<script setup lang="ts">
import { splitProportional, sharedOrderTotal } from '~~/shared/settle'
import { entryInputSchema } from '~~/shared/schemas'
import { formatRupiah } from '~~/shared/format'
import type { EntryInput } from '~~/shared/types'
import type { OrderItemDraft } from '~/components/AddOrderItem.vue'

const route = useRoute()
const id = route.params.id as string
const editId = route.query.entry as string | undefined
const { data: bill } = await useBill(id)
const { me } = useIdentity(bill)

interface ItemRow extends OrderItemDraft {
  id: string
}

const f = reactive({
  type: 'simple' as 'simple' | 'shared_order',
  title: '',
  amount: 0,
  // simple
  payerMode: 'one' as 'one' | 'several',
  payerId: '',
  payers: [] as { participantId: string; amount: number }[],
  shareMethod: 'equally' as 'equally' | 'exact',
  sharerIds: [] as string[],
  exactShares: {} as Record<string, number>,
  // shared order
  items: [] as ItemRow[],
  fees: { taxPercent: 0, service: 0, other: 0 },
  discount: 0,
})

const typeOptions = [
  { label: 'Simple', value: 'simple' as const },
  { label: 'Shared order', value: 'shared_order' as const },
]
const payerModeOptions = [
  { label: 'One person', value: 'one' as const },
  { label: 'Several people', value: 'several' as const },
]
const shareMethodOptions = [
  { label: 'Equally', value: 'equally' as const },
  { label: 'By exact amount', value: 'exact' as const },
]

let initialized = false
watch(
  bill,
  (b) => {
    if (!b || initialized) return
    f.payerId = me.value?.id ?? b.participants[0]?.id ?? ''
    f.sharerIds = b.participants.map((p) => p.id)
    f.payers = b.participants.map((p) => ({ participantId: p.id, amount: 0 }))
    if (editId) prefill()
    initialized = true
  },
  { immediate: true },
)

function prefill() {
  const e = bill.value?.entries.find((x) => x.id === editId)
  if (!e) return
  f.type = e.type
  f.title = e.title
  if (e.type === 'simple') {
    f.amount = e.amount
    f.payerMode = e.payers.length > 1 ? 'several' : 'one'
    f.payerId = e.payers[0]?.participantId ?? f.payerId
    f.payers = (bill.value?.participants ?? []).map((p) => ({
      participantId: p.id,
      amount: e.payers.find((x) => x.participantId === p.id)?.amount ?? 0,
    }))
    f.shareMethod = e.shareMethod
    f.sharerIds = e.sharers.map((s) => s.participantId)
    f.exactShares = Object.fromEntries(e.sharers.map((s) => [s.participantId, s.share]))
  } else {
    f.payerId = e.payerId
    f.items = e.items.map((it) => ({ ...it }))
    f.fees = { ...e.fees }
    f.discount = e.discount
  }
}

const nameOf = (pid: string) => bill.value?.participants.find((p) => p.id === pid)?.name ?? '?'

// ── live split (simple) ───────────────────────────────────────────────────
const equalSplit = computed<Record<string, number>>(() => {
  if (!f.sharerIds.length) return {}
  const parts = splitProportional(f.amount || 0, f.sharerIds.map(() => 1))
  return Object.fromEntries(f.sharerIds.map((pid, i) => [pid, parts[i]]))
})
const shareOf = (pid: string) =>
  f.shareMethod === 'equally' ? (equalSplit.value[pid] ?? 0) : (f.exactShares[pid] ?? 0)

function toggleSharer(pid: string) {
  const i = f.sharerIds.indexOf(pid)
  if (i >= 0) f.sharerIds.splice(i, 1)
  else f.sharerIds.push(pid)
}
const allShared = computed(() => f.sharerIds.length === (bill.value?.participants.length ?? 0))
function selectAllSharers() {
  f.sharerIds = allShared.value ? [] : (bill.value?.participants.map((p) => p.id) ?? [])
}

// ── shared order live ─────────────────────────────────────────────────────
const sheetOpen = ref(false)
function onSaveItem(item: OrderItemDraft) {
  f.items.push({ ...item, id: 'tmp-' + Math.random().toString(36).slice(2) })
}
const sharedSubtotal = computed(() =>
  sharedOrderTotal({
    id: 'x',
    type: 'shared_order',
    title: f.title || 'x',
    payerId: f.payerId || 'x',
    items: f.items.length
      ? f.items.map((it) => ({ ...it, id: it.id }))
      : [{ id: 'z', name: 'z', qty: 1, priceEach: 0, orderedBy: ['z'] }],
    fees: f.fees,
    discount: f.discount,
  }),
)

// ── submit ────────────────────────────────────────────────────────────────
const error = ref('')
const submitting = ref(false)

function buildPayload(): EntryInput {
  if (f.type === 'simple') {
    const sharers = f.sharerIds.map((pid) => ({ participantId: pid, share: shareOf(pid) }))
    const amount =
      f.shareMethod === 'exact' ? sharers.reduce((a, s) => a + s.share, 0) : f.amount
    const payers =
      f.payerMode === 'one'
        ? [{ participantId: f.payerId, amount }]
        : f.payers.filter((p) => p.amount > 0)
    return { type: 'simple', title: f.title, amount, payers, shareMethod: f.shareMethod, sharers }
  }
  return {
    type: 'shared_order',
    title: f.title,
    payerId: f.payerId,
    items: f.items.map(({ name, qty, priceEach, orderedBy }) => ({ name, qty, priceEach, orderedBy })),
    fees: f.fees,
    discount: f.discount,
  }
}

async function submit() {
  error.value = ''
  const parsed = entryInputSchema.safeParse(buildPayload())
  if (!parsed.success) {
    error.value = parsed.error.issues[0]?.message ?? 'Please complete the expense'
    return
  }
  submitting.value = true
  try {
    await $fetch(editId ? `/api/bills/${id}/entries/${editId}` : `/api/bills/${id}/entries`, {
      method: editId ? 'PUT' : 'POST',
      body: parsed.data,
    })
    await navigateTo(`/bill/${id}`)
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Could not save expense'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <ScreenHeader back :title="editId ? 'Edit expense' : 'Add expense'" @back="navigateTo(`/bill/${id}`)" />

  <main v-if="bill" class="flex-1 overflow-y-auto px-5 pb-28 pt-4">
    <SegmentedControl v-model="f.type" :options="typeOptions" :accent="f.type === 'shared_order' ? 'ochre' : 'forest'" />

    <label class="mt-4 block">
      <span class="eyebrow">What for</span>
      <input
        v-model="f.title"
        :placeholder="f.type === 'simple' ? 'Gasoline' : 'Warung dinner'"
        class="mt-1.5 w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 text-ink focus:border-forest focus:outline-none"
      />
    </label>

    <!-- ───────── SIMPLE ───────── -->
    <template v-if="f.type === 'simple'">
      <label class="mt-3 block">
        <span class="eyebrow">Amount</span>
        <input
          v-model.number="f.amount"
          type="number"
          min="0"
          placeholder="320000"
          class="mt-1.5 w-full rounded-control border-2 border-forest bg-surface-input px-3 py-2.5 text-ink focus:outline-none"
        />
      </label>

      <!-- Step 1 -->
      <div class="mt-5 flex items-center gap-2">
        <span class="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-700 text-surface-card">1</span>
        <span class="font-serif text-base font-600">Who paid up front</span>
      </div>
      <div class="mt-2">
        <SegmentedControl v-model="f.payerMode" :options="payerModeOptions" />
      </div>
      <div v-if="f.payerMode === 'one'" class="mt-2 flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2.5">
        <AvatarBadge v-if="f.payerId" :badge-key="bill.participants.find((p) => p.id === f.payerId)!.badgeKey" :size="34" />
        <div class="flex-1">
          <select v-model="f.payerId" class="w-full bg-transparent font-600 text-ink focus:outline-none">
            <option v-for="p in bill.participants" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
          <p class="text-xs text-muted">fronts the whole amount</p>
        </div>
        <MoneyText :value="f.amount" class="text-sm font-600" />
      </div>
      <div v-else class="mt-2 flex flex-col gap-2">
        <div v-for="p in bill.participants" :key="p.id" class="flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2">
          <AvatarBadge :badge-key="p.badgeKey" :size="28" />
          <span class="flex-1 text-sm">{{ p.name }}</span>
          <input
            v-model.number="f.payers.find((x) => x.participantId === p.id)!.amount"
            type="number"
            min="0"
            class="w-28 rounded-control bg-surface-input px-2 py-1.5 text-right text-sm"
          />
        </div>
      </div>

      <!-- Step 2 -->
      <div class="mt-5 flex items-center gap-2">
        <span class="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-700 text-surface-card">2</span>
        <span class="font-serif text-base font-600">Who shares the cost</span>
      </div>
      <div class="mt-2">
        <SegmentedControl v-model="f.shareMethod" :options="shareMethodOptions" />
      </div>
      <div class="chip-pos mt-3 w-full justify-center py-2 text-center">
        Split <b class="mx-1">{{ f.sharerIds.length }} ways</b>
        <template v-if="f.shareMethod === 'equally' && f.payerMode === 'one'">
          · each owes {{ nameOf(f.payerId) }} {{ formatRupiah(equalSplit[f.sharerIds[0]] ?? 0) }}
        </template>
      </div>
      <button type="button" class="mt-3 text-xs font-600 text-forest" @click="selectAllSharers">
        <span class="i-tabler-check" /> {{ allShared ? 'Clear all' : 'Select all' }}
      </button>
      <div class="mt-2 flex flex-col gap-2">
        <div
          v-for="p in bill.participants"
          :key="p.id"
          class="flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2 transition-opacity"
          :class="f.sharerIds.includes(p.id) ? '' : 'opacity-70'"
        >
          <AvatarBadge :badge-key="p.badgeKey" :size="28" />
          <div class="flex-1">
            <span class="text-sm font-600">{{ p.name }}</span>
            <p v-if="!f.sharerIds.includes(p.id)" class="text-xs text-muted">not sharing</p>
          </div>
          <input
            v-if="f.sharerIds.includes(p.id) && f.shareMethod === 'exact'"
            v-model.number="f.exactShares[p.id]"
            type="number"
            min="0"
            class="w-24 rounded-control bg-surface-input px-2 py-1 text-right text-sm"
          />
          <MoneyText v-else-if="f.sharerIds.includes(p.id)" :value="shareOf(p.id)" class="text-sm" />
          <button
            type="button"
            class="flex size-6 items-center justify-center rounded-chip-sm border"
            :class="f.sharerIds.includes(p.id) ? 'border-forest bg-forest text-white' : 'border-line-medium text-transparent'"
            @click="toggleSharer(p.id)"
          >
            <span class="i-tabler-check text-xs" />
          </button>
        </div>
      </div>
    </template>

    <!-- ───────── SHARED ORDER ───────── -->
    <template v-else>
      <div class="mt-3 flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2.5">
        <span class="eyebrow">Paid by</span>
        <AvatarBadge v-if="f.payerId" :badge-key="bill.participants.find((p) => p.id === f.payerId)!.badgeKey" :size="28" />
        <select v-model="f.payerId" class="flex-1 bg-transparent font-600 text-ink focus:outline-none">
          <option v-for="p in bill.participants" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>

      <button
        type="button"
        class="mt-3 flex w-full items-center justify-center gap-2 rounded-card border border-dashed border-line-medium bg-surface-subtle py-3 text-sm font-600 text-body"
        @click="error = 'Receipt scan is coming soon'"
      >
        <span class="i-tabler-camera text-ochre" /> Scan receipt · auto-fill items
      </button>

      <div class="mb-2 mt-5 flex items-center justify-between">
        <span class="eyebrow">Orders</span>
        <span class="text-xs text-muted">{{ f.items.length }} items</span>
      </div>
      <div class="flex flex-col gap-2">
        <div v-for="(it, i) in f.items" :key="it.id" class="flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2">
          <div class="flex-1">
            <p class="text-sm font-600">{{ it.name }} ×{{ it.qty }}</p>
            <AvatarStack :participants="it.orderedBy.map((pid) => bill.participants.find((p) => p.id === pid)!).filter(Boolean)" :max="5" :size="18" />
          </div>
          <MoneyText :value="it.qty * it.priceEach" class="text-sm font-600" />
          <button type="button" class="text-terracotta" @click="f.items.splice(i, 1)">
            <span class="i-tabler-x" />
          </button>
        </div>
        <button
          type="button"
          class="flex items-center justify-center gap-2 rounded-card border border-dashed border-line-medium bg-surface-subtle py-2.5 text-sm font-600 text-forest"
          @click="sheetOpen = true"
        >
          <span class="i-tabler-plus" /> Add order
        </button>
      </div>

      <div class="mt-5">
        <span class="eyebrow">Fees &amp; discount</span>
        <div class="mt-2 flex flex-col gap-2 rounded-card border border-line-light bg-surface-card p-3 text-sm">
          <label class="flex items-center justify-between gap-2">
            <span>Tax (%)</span>
            <input v-model.number="f.fees.taxPercent" type="number" min="0" class="w-24 rounded-control bg-surface-input px-2 py-1 text-right" />
          </label>
          <label class="flex items-center justify-between gap-2">
            <span>Service</span>
            <input v-model.number="f.fees.service" type="number" min="0" class="w-28 rounded-control bg-surface-input px-2 py-1 text-right" />
          </label>
          <label class="flex items-center justify-between gap-2">
            <span>Other fee</span>
            <input v-model.number="f.fees.other" type="number" min="0" class="w-28 rounded-control bg-surface-input px-2 py-1 text-right" />
          </label>
          <label class="flex items-center justify-between gap-2 text-terracotta">
            <span>Discount</span>
            <input v-model.number="f.discount" type="number" min="0" class="w-28 rounded-control bg-surface-input px-2 py-1 text-right" />
          </label>
        </div>
      </div>

      <div class="rule-double mt-4 flex items-center justify-between pt-3">
        <span class="eyebrow">Subtotal</span>
        <MoneyText :value="sharedSubtotal" class="text-xl font-600" />
      </div>

      <AddOrderItem v-model:open="sheetOpen" :participants="bill.participants" @save="onSaveItem" />
    </template>

    <p v-if="error" class="chip-neg mt-4">{{ error }}</p>
  </main>

  <div class="border-t border-line-light bg-surface-card px-5 py-3">
    <button class="btn-forest w-full" :disabled="submitting" @click="submit">
      {{ editId ? 'Save changes' : 'Add expense' }}
    </button>
  </div>
</template>
