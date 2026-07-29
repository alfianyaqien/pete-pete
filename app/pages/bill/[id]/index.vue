<script setup lang="ts">
import { billStats, groupEntriesByDate } from '~~/shared/stats'
import { formatDateShort, formatDayHeader, formatRupiah } from '~~/shared/format'
import { copyShareLink } from '~/composables/useShare'
import type { Bill, Entry } from '~~/shared/types'

const route = useRoute()
const id = route.params.id as string
const { data: bill } = await useBill(id)
const { me, setMe } = useIdentity(bill)
const toast = useToast()

const stats = computed(() => (bill.value ? billStats(bill.value) : null))
const groups = computed(() => (bill.value ? groupEntriesByDate(bill.value.entries) : []))

useHead({ title: computed(() => bill.value?.title ?? 'Bill') })
useSeoMeta({
  ogTitle: () => (bill.value ? `${bill.value.title} · PetePete` : 'PetePete'),
  ogDescription: () =>
    bill.value
      ? `Trip ledger — ${stats.value?.souls ?? 0} souls · total ${formatRupiah(stats.value?.total ?? 0)}.`
      : '',
})

const copied = ref(false)
async function onCopy() {
  copied.value = await copyShareLink(id)
  setTimeout(() => (copied.value = false), 1800)
}

// Tapping an entry opens a read-only summary; the sheet's Edit goes to the form.
const detailOpen = ref(false)
const detailEntry = ref<Entry | null>(null)
function openDetail(e: Entry) {
  detailEntry.value = e
  claimError.value = ''
  detailOpen.value = true
}
function editFromDetail() {
  // Navigate straight away: closing first would start the sheet's leave
  // transition, and unmounting the page mid-transition strands the teleported
  // modal in <body> on top of the edit form. Unmount tears it down cleanly.
  navigateTo(`/bill/${id}/add?entry=${detailEntry.value?.id}`)
}

// Claim / unclaim an item as the current viewer. The PATCH returns the updated
// bill; patch it in and re-point the open sheet at the fresh entry so its buttons
// and the "to claim" chips update instantly.
const claiming = ref<string | null>(null)
const claimError = ref('')
function onSetIdentity(pid: string) {
  setMe(pid)
  claimError.value = '' // resolving identity clears the “pick who you are” error
}
async function claimFromDetail({ itemId, claimed }: { itemId: string; claimed: boolean }) {
  const entry = detailEntry.value
  if (!entry) return
  if (!me.value) {
    claimError.value = 'Pick who you are first — tap “Who are you?” above.'
    return
  }
  claimError.value = ''
  claiming.value = itemId
  try {
    const updated = await $fetch<Bill>(
      `/api/bills/${id}/entries/${entry.id}/items/${itemId}`,
      { method: 'PATCH', body: { participantId: me.value.id, claimed } },
    )
    bill.value = updated
    detailEntry.value = updated.entries.find((e) => e.id === entry.id) ?? null
    const item = entry.type === 'shared_order' ? entry.items.find((i) => i.id === itemId) : null
    toast.success(claimed ? 'Item claimed' : 'Item unclaimed', item?.name)
  } catch {
    toast.error('Couldn’t update claim', 'Please try again')
  } finally {
    claiming.value = null
  }
}

// The DELETE route returns the updated bill, so patch it in directly — no refetch.
const deleting = ref(false)
const deleteError = ref('')
async function deleteFromDetail() {
  const entry = detailEntry.value
  if (!entry) return
  deleting.value = true
  deleteError.value = ''
  try {
    bill.value = await $fetch<Bill>(`/api/bills/${id}/entries/${entry.id}`, { method: 'DELETE' })
    detailOpen.value = false
    detailEntry.value = null
    toast.success('Expense deleted', entry.title)
  } catch (e: any) {
    deleteError.value = e?.data?.statusMessage || 'Could not delete this expense'
    toast.error('Couldn’t delete expense', deleteError.value)
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <template v-if="bill">
    <screen-header
      back
      eyebrow="Ledger"
      :title="bill.title"
      :meta="`${stats?.souls} souls · ${stats?.entries} entries · ${formatDateShort(bill.createdAt)}`"
      @back="navigateTo('/')"
    >
      <div class="rule-double mt-3 flex items-center justify-between pt-3">
        <span class="eyebrow">Total tally</span>
        <money-text :value="stats?.total ?? 0" class="text-2xl font-600" />
      </div>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-control border border-line-medium bg-surface-card px-3 py-1.5 text-xs font-600 text-ink border-solid"
          @click="onCopy"
        >
          <span :class="copied ? 'i-tabler-check text-forest' : 'i-tabler-link'" />
          {{ copied ? 'Link copied' : 'Copy link' }}
        </button>
        <identity-chip
          :participants="bill.participants"
          :model-value="me?.id ?? null"
          tone="light"
          @update:model-value="setMe"
        />
      </div>
    </screen-header>

    <main class="app-col flex-1 overflow-y-auto px-5 pb-28 pt-4">
      <div class="mb-3 flex items-center justify-between gap-3">
        <p class="eyebrow">Entries</p>
        <core-button :to="`/bill/${id}/add`">
          <span class="i-tabler-plus" /> Add expense
        </core-button>
      </div>

      <div v-if="bill.entries.length" class="flex flex-col gap-5">
        <section v-for="g in groups" :key="g.date">
          <div class="mb-2 flex items-center justify-between border-b border-line-faint pb-1.5">
            <p class="text-[11px] font-700 uppercase tracking-wide text-body">
              {{ formatDayHeader(g.date) }}
            </p>
            <span class="num text-[11px] text-muted">{{ formatRupiah(g.total) }}</span>
          </div>
          <div class="flex flex-col gap-2.5">
            <entry-card
              v-for="e in g.entries"
              :key="e.id"
              :entry="e"
              :participants="bill.participants"
              @open="openDetail(e)"
            />
          </div>
        </section>
      </div>
      <div v-else class="card-parchment mt-2 p-6 text-center">
        <span class="i-tabler-receipt mx-auto block text-2xl text-muted" />
        <p class="mt-2 text-sm text-body">No entries yet. Add your first expense.</p>
      </div>

      <made-by class="mt-8" />
    </main>

    <entry-detail-sheet
      v-model:open="detailOpen"
      :entry="detailEntry"
      :participants="bill.participants"
      :me="me"
      :claiming="claiming"
      :claim-error="claimError"
      :deleting="deleting"
      :error="deleteError"
      @edit="editFromDetail"
      @delete="deleteFromDetail"
      @claim="claimFromDetail"
      @set-identity="onSetIdentity"
    />

    <bottom-nav active="entries" :bill-id="id" />
  </template>

  <div v-else class="flex flex-1 items-center justify-center p-8 text-center text-muted">
    Trip not found.
  </div>
</template>
