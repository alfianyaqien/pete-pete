<script setup lang="ts">
import { billStats, groupEntriesByDate } from '~~/shared/stats'
import { formatDateShort, formatDayHeader, formatRupiah } from '~~/shared/format'
import { copyShareLink } from '~/composables/useShare'
import type { Entry } from '~~/shared/types'

const route = useRoute()
const id = route.params.id as string
const { data: bill } = await useBill(id)
console.log("🚀 ~ bill:", bill)

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
  detailOpen.value = true
}
function editFromDetail() {
  // Navigate straight away: closing first would start the sheet's leave
  // transition, and unmounting the page mid-transition strands the teleported
  // modal in <body> on top of the edit form. Unmount tears it down cleanly.
  navigateTo(`/bill/${id}/add?entry=${detailEntry.value?.id}`)
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
      <button
        type="button"
        class="mt-3 inline-flex items-center gap-1.5 rounded-control border border-line-medium bg-surface-card px-3 py-1.5 text-xs font-600 text-ink border-solid"
        @click="onCopy"
      >
        <span :class="copied ? 'i-tabler-check text-forest' : 'i-tabler-link'" />
        {{ copied ? 'Link copied' : 'Copy link' }}
      </button>
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
              @edit="navigateTo(`/bill/${id}/add?entry=${e.id}`)"
            />
          </div>
        </section>
      </div>
      <div v-else class="card-parchment mt-2 p-6 text-center">
        <span class="i-tabler-receipt mx-auto block text-2xl text-muted" />
        <p class="mt-2 text-sm text-body">No entries yet. Add your first expense.</p>
      </div>
    </main>

    <entry-detail-sheet
      v-model:open="detailOpen"
      :entry="detailEntry"
      :participants="bill.participants"
      @edit="editFromDetail"
    />

    <bottom-nav active="entries" :bill-id="id" />
  </template>

  <div v-else class="flex flex-1 items-center justify-center p-8 text-center text-muted">
    Expedition not found.
  </div>
</template>
