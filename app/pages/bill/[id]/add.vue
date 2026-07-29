<script setup lang="ts">
import { splitProportional, sharedOrderTotal } from '~~/shared/settle'
import { entryInputSchema } from '~~/shared/schemas'
import { formatRupiah, todayISO } from '~~/shared/format'
import type { Entry, EntryInput } from '~~/shared/types'
import type { OrderItemDraft } from '~/components/add-order-item.vue'

const route = useRoute()
const id = route.params.id as string
const editId = route.query.entry as string | undefined
const { data: bill } = await useBill(id)

useHead({ title: editId ? 'Edit Expense' : 'Add Expense' })
const { me } = useIdentity(bill)
const toast = useToast()

interface ItemRow extends OrderItemDraft {
  id: string
}
interface FormShape {
  type: 'simple' | 'shared_order'
  title: string
  date: string
  amount: number
  payerMode: 'one' | 'several'
  payers: { participantId: string; amount: number }[]
  shareMethod: 'equally' | 'exact'
  sharerIds: string[]
  exactShares: Record<string, number>
  items: ItemRow[]
  fees: { taxPercent: number; service: number; other: number }
  discount: number
}

const participants = computed(() => bill.value?.participants ?? [])
const meId = me.value?.id ?? participants.value[0]?.id ?? ''

function blank(): FormShape {
  return {
    type: 'simple',
    title: '',
    date: todayISO(),
    amount: 0,
    payerMode: 'one',
    payers: meId ? [{ participantId: meId, amount: 0 }] : [],
    shareMethod: 'equally',
    sharerIds: participants.value.map((p) => p.id),
    exactShares: {},
    items: [],
    fees: { taxPercent: 0, service: 0, other: 0 },
    discount: 0,
  }
}
function fromEntry(e: Entry): FormShape {
  const base = blank()
  base.type = e.type
  base.title = e.title
  base.date = e.date
  base.payerMode = e.payers.length > 1 ? 'several' : 'one'
  base.payers = e.payers.map((p) => ({ ...p }))
  if (e.type === 'simple') {
    base.amount = e.amount
    base.shareMethod = e.shareMethod
    base.sharerIds = e.sharers.map((s) => s.participantId)
    base.exactShares = Object.fromEntries(e.sharers.map((s) => [s.participantId, s.share]))
  } else {
    base.items = e.items.map((it) => ({ ...it }))
    base.fees = { ...e.fees }
    base.discount = e.discount
  }
  return base
}

const editEntry = editId ? bill.value?.entries.find((e) => e.id === editId) : undefined
const { values, setFieldValue, handleSubmit, isSubmitting } = useForm<FormShape>({
  initialValues: editEntry ? fromEntry(editEntry) : blank(),
})

// v-model bridges (form state via setFieldValue — no local refs)
const typeModel = computed({ get: () => values.type, set: (v) => setFieldValue('type', v) })
const payerModeModel = computed({ get: () => values.payerMode, set: (v) => setFieldValue('payerMode', v) })
const shareMethodModel = computed({ get: () => values.shareMethod, set: (v) => setFieldValue('shareMethod', v) })
const payerIdModel = computed({
  get: () => values.payers[0]?.participantId ?? meId,
  set: (pid: string) => setFieldValue('payers', [{ participantId: pid, amount: 0 }]),
})
const payersModel = computed({ get: () => values.payers, set: (v) => setFieldValue('payers', v) })

// UI wording only — the stored entry types stay 'simple' / 'shared_order'.
const typeOptions = [
  { label: 'Single', value: 'simple' as const },
  { label: 'Bill', value: 'shared_order' as const },
]
const payerModeOptions = [
  { label: 'One person', value: 'one' as const },
  { label: 'Several people', value: 'several' as const },
]
const shareMethodOptions = [
  { label: 'Equally', value: 'equally' as const },
  { label: 'By exact amount', value: 'exact' as const },
]
const participantOptions = computed(() =>
  participants.value.map((p) => ({ label: p.name, value: p.id, badgeKey: p.badgeKey })),
)
const nameOf = (pid: string) => participants.value.find((p) => p.id === pid)?.name ?? '?'

// ── live split (simple) ─────────────────────────────────────────────────
const equalSplit = computed<Record<string, number>>(() => {
  if (!values.sharerIds.length) return {}
  const parts = splitProportional(values.amount || 0, values.sharerIds.map(() => 1))
  return Object.fromEntries(values.sharerIds.map((pid, i) => [pid, parts[i]]))
})
const shareOf = (pid: string) =>
  values.shareMethod === 'equally' ? (equalSplit.value[pid] ?? 0) : (values.exactShares[pid] ?? 0)

function setExactShare(pid: string, n: number) {
  setFieldValue('exactShares', { ...values.exactShares, [pid]: n })
}
function toggleSharer(pid: string) {
  const next = [...values.sharerIds]
  const i = next.indexOf(pid)
  if (i >= 0) next.splice(i, 1)
  else next.push(pid)
  setFieldValue('sharerIds', next)
}
const allShared = computed(() => values.sharerIds.length === participants.value.length)
function selectAllSharers() {
  setFieldValue('sharerIds', allShared.value ? [] : participants.value.map((p) => p.id))
}

// ── shared order ────────────────────────────────────────────────────────
const sheetOpen = ref(false)
function onSaveItem(item: OrderItemDraft) {
  setFieldValue('items', [
    ...values.items,
    { ...item, id: 'tmp-' + Math.random().toString(36).slice(2) },
  ])
}
function removeItem(i: number) {
  setFieldValue('items', values.items.filter((_, idx) => idx !== i))
}
const sharedSubtotal = computed(() =>
  sharedOrderTotal({
    id: 'x',
    type: 'shared_order',
    title: values.title || 'x',
    date: values.date,
    payers: [{ participantId: 'x', amount: 0 }],
    items: values.items.length
      ? values.items.map((it) => ({ ...it }))
      : [{ id: 'z', name: 'z', qty: 1, priceEach: 0, orderedBy: ['z'] }],
    fees: values.fees,
    discount: values.discount,
  }),
)

// ── submit ──────────────────────────────────────────────────────────────
const error = ref('')

function payersFor(totalAmount: number): { participantId: string; amount: number }[] {
  return values.payerMode === 'one'
    ? [{ participantId: payerIdModel.value, amount: totalAmount }]
    : values.payers.filter((p) => p.amount > 0)
}

function buildPayload(): EntryInput {
  if (values.type === 'simple') {
    const sharers = values.sharerIds.map((pid) => ({ participantId: pid, share: shareOf(pid) }))
    const amount =
      values.shareMethod === 'exact' ? sharers.reduce((a, s) => a + s.share, 0) : values.amount
    return {
      type: 'simple',
      title: values.title,
      date: values.date,
      amount,
      payers: payersFor(amount),
      shareMethod: values.shareMethod,
      sharers,
    }
  }
  return {
    type: 'shared_order',
    title: values.title,
    date: values.date,
    payers: payersFor(sharedSubtotal.value),
    items: values.items.map(({ name, qty, priceEach, orderedBy }) => ({ name, qty, priceEach, orderedBy })),
    fees: values.fees,
    discount: values.discount,
  }
}

const onSubmit = handleSubmit(async () => {
  error.value = ''
  const parsed = entryInputSchema.safeParse(buildPayload())
  if (!parsed.success) {
    error.value = parsed.error.issues[0]?.message ?? 'Please complete the expense'
    return
  }
  try {
    await $fetch(editId ? `/api/bills/${id}/entries/${editId}` : `/api/bills/${id}/entries`, {
      method: editId ? 'PUT' : 'POST',
      body: parsed.data,
    })
    toast.success(editId ? 'Expense updated' : 'Expense added', values.title)
    await navigateTo(`/bill/${id}`)
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Could not save expense'
    toast.error('Couldn’t save expense', error.value)
  }
})
</script>

<template>
  <screen-header
    back
    :title="editId ? 'Edit expense' : 'Add expense'"
    @back="navigateTo(`/bill/${id}`)"
  />

  <main v-if="bill" class="app-col flex-1 overflow-y-auto px-5 pb-28 pt-4">
    <form @submit.prevent="onSubmit">
      <core-segmented-control
        v-model="typeModel"
        :options="typeOptions"
      />

      <core-input
        name="title"
        label="What for"
        :placeholder="values.type === 'simple' ? 'Gasoline' : 'Warung dinner'"
        class="mt-4"
      />

      <div class="mt-3">
        <core-date-input name="date" label="Date" />
      </div>

      <!-- ───────── SIMPLE ───────── -->
      <template v-if="values.type === 'simple'">
        <div class="mt-3">
          <core-money-input name="amount" label="Amount" placeholder="320000" />
        </div>

        <!-- Step 1 -->
        <div class="mt-5 flex items-center gap-2">
          <span class="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-700 text-surface-card">1</span>
          <span class="font-serif text-base font-600">Who paid up front</span>
        </div>
        <div class="mt-2">
          <core-segmented-control v-model="payerModeModel" :options="payerModeOptions" />
        </div>
        <div v-if="values.payerMode === 'one'" class="mt-2 flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2.5">
          <div class="min-w-0 flex-1">
            <core-select v-model="payerIdModel" :options="participantOptions" variant="bare" />
          </div>
          <money-text :value="values.amount" class="text-sm font-600" />
        </div>
        <payer-rows v-else v-model="payersModel" :participants="participants" class="mt-2" />

        <!-- Step 2 -->
        <div class="mt-5 flex items-center gap-2">
          <span class="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-700 text-surface-card">2</span>
          <span class="font-serif text-base font-600">Who shares the cost</span>
        </div>
        <div class="mt-2">
          <core-segmented-control v-model="shareMethodModel" :options="shareMethodOptions" />
        </div>
        <div class="chip-pos mt-3 w-full justify-center py-2 text-center">
          Split <b class="mx-1">{{ values.sharerIds.length }} ways</b>
          <template v-if="values.shareMethod === 'equally' && values.payerMode === 'one'">
            · each owes {{ nameOf(payerIdModel) }} {{ formatRupiah(equalSplit[values.sharerIds[0]] ?? 0) }}
          </template>
        </div>
        <button type="button" class="mt-3 text-xs font-600 text-forest appearance-none border-solid border rounded-md px-2 py-1 border-line-medium bg-surface-card block ml-auto" @click="selectAllSharers">
          <span class="i-tabler-check" /> {{ allShared ? 'Clear all' : 'Select all' }}
        </button>
        <div class="mt-2 flex flex-col gap-2">
          <div
            v-for="p in participants"
            :key="p.id"
            class="flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2 transition-opacity"
            :class="values.sharerIds.includes(p.id) ? '' : 'opacity-70'"
          >
            <avatar-badge :badge-key="p.badgeKey" :size="28" />
            <div class="flex-1">
              <span class="text-sm font-600">{{ p.name }}</span>
            </div>
            <div v-if="values.sharerIds.includes(p.id) && values.shareMethod === 'exact'" class="w-24">
              <core-money-input
                :model-value="values.exactShares[p.id] ?? 0"
                variant="compact"
                class="text-right"
                @update:model-value="setExactShare(p.id, $event)"
              />
            </div>
            <money-text v-else-if="values.sharerIds.includes(p.id)" :value="shareOf(p.id)" class="text-sm" />
            <button
              type="button"
              class="flex size-6 items-center justify-center rounded-chip-sm border appearance-none border-solid"
              :class="values.sharerIds.includes(p.id) ? 'border-forest bg-forest text-white' : 'border-line-medium text-transparent'"
              @click="toggleSharer(p.id)"
            >
              <span class="i-tabler-check text-xs" />
            </button>
          </div>
        </div>
      </template>

      <!-- ───────── SHARED ORDER ───────── -->
      <template v-else>
        <div class="mt-3 flex items-center gap-2">
          <span class="eyebrow">Paid by</span>
        </div>
        <div class="mt-2">
          <core-segmented-control v-model="payerModeModel" :options="payerModeOptions" />
        </div>
        <div v-if="values.payerMode === 'one'" class="mt-2 flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2.5">
          <core-select v-model="payerIdModel" :options="participantOptions" variant="bare" class="w-full" />
        </div>
        <payer-rows v-else v-model="payersModel" :participants="participants" class="mt-2" />

        <!-- <button
          type="button"
          class="mt-3 flex w-full items-center justify-center gap-2 rounded-card border border-dashed border-line-medium bg-surface-subtle py-3 text-sm font-600 text-body"
          @click="error = 'Receipt scan is coming soon'"
        >
          <span class="i-tabler-camera text-ochre" /> Scan receipt · auto-fill items
        </button> -->

        <div class="mb-2 mt-5 flex items-center justify-between">
          <span class="eyebrow">Orders</span>
          <span class="text-xs text-muted">{{ values.items.length }} items</span>
        </div>
        <div class="flex flex-col gap-2">
          <div v-for="(it, i) in values.items" :key="it.id" class="flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2">
            <div class="flex-1">
              <p class="text-sm font-600">{{ it.name }} ×{{ it.qty }}</p>
              <avatar-stack
                :participants="it.orderedBy.map((pid) => participants.find((p) => p.id === pid)!).filter(Boolean)"
                :max="5"
                :size="24"
                class="mt-1"
              />
            </div>
            <money-text :value="it.qty * it.priceEach" class="text-sm font-600" />
            <button type="button" class="btn-remove" @click="removeItem(i)">
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
            <div class="flex items-center justify-between gap-2">
              <span>Tax (%)</span>
              <div class="w-24"><core-input name="fees.taxPercent" numeric type="number" min="0" variant="compact" class="text-right" /></div>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span>Service</span>
              <div class="w-28"><core-money-input name="fees.service" variant="compact" class="text-right" /></div>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span>Other fee</span>
              <div class="w-28"><core-money-input name="fees.other" variant="compact" class="text-right" /></div>
            </div>
            <div class="flex items-center justify-between gap-2 text-terracotta">
              <span>Discount</span>
              <div class="w-28"><core-money-input name="discount" variant="compact" class="text-right" /></div>
            </div>
          </div>
        </div>

        <div class="rule-double mt-4 flex items-center justify-between pt-3">
          <span class="eyebrow">Subtotal</span>
          <money-text :value="sharedSubtotal" class="text-xl font-600" />
        </div>

        <add-order-item v-model:open="sheetOpen" :participants="participants" @save="onSaveItem" />
      </template>

      <p v-if="error" class="chip-neg mt-4">{{ error }}</p>
    </form>
  </main>

  <div class="flex-none border-t border-line-light bg-surface-card px-5 py-3 fixed bottom-0 left-0 w-full">
    <div class="app-col">
      <core-button block :loading="isSubmitting" @click="onSubmit">
        {{ editId ? 'Save changes' : 'Add expense' }}
      </core-button>
    </div>
  </div>
</template>
