<script setup lang="ts">
import { billStats } from '~~/shared/stats'
import { formatDateShort } from '~~/shared/format'
import { copyShareLink } from '~/composables/useShare'

const route = useRoute()
const id = route.params.id as string
const { data: bill } = await useBill(id)

const stats = computed(() => (bill.value ? billStats(bill.value) : null))

const copied = ref(false)
async function onCopy() {
  copied.value = await copyShareLink(id)
  setTimeout(() => (copied.value = false), 1800)
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

    <main class="app-col relative flex-1 overflow-y-auto px-5 pb-28 pt-4">
      <p class="eyebrow mb-2">Entries</p>

      <div v-if="bill.entries.length" class="flex flex-col gap-2.5">
        <entry-card
          v-for="e in bill.entries"
          :key="e.id"
          :entry="e"
          :participants="bill.participants"
          @edit="navigateTo(`/bill/${id}/add?entry=${e.id}`)"
        />
      </div>
      <div v-else class="card-parchment mt-2 p-6 text-center">
        <span class="i-tabler-receipt mx-auto block text-2xl text-muted" />
        <p class="mt-2 text-sm text-body">No entries yet. Add your first expense.</p>
      </div>

      <core-button variant="forest" block :to="`/bill/${id}/settle`" class="mt-5">
        <span class="i-tabler-arrow-right" /> Settle up
      </core-button>

      <!-- FAB -->
      <NuxtLink
        :to="`/bill/${id}/add`"
        class="absolute bottom-6 right-5 z-20 flex size-14 items-center justify-center rounded-full bg-ochre text-white shadow-card"
        aria-label="Add expense"
      >
        <span class="i-tabler-plus text-2xl" />
      </NuxtLink>
    </main>

    <bottom-nav active="receipt" :bill-id="id" />
  </template>

  <div v-else class="flex flex-1 items-center justify-center p-8 text-center text-muted">
    Expedition not found.
  </div>
</template>
