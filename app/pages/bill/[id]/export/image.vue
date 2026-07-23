<script setup lang="ts">
import { settleBill } from '~~/shared/settle'
import { billStats } from '~~/shared/stats'
import { formatRupiah } from '~~/shared/format'

definePageMeta({ layout: false })
useHead({ title: 'Settlement Image' })

const route = useRoute()
const id = route.params.id as string
const { data: bill } = await useBill(id)

const stats = computed(() => (bill.value ? billStats(bill.value) : null))
const transfers = computed(() => (bill.value ? settleBill(bill.value).transfers : []))
const nameOf = (pid: string) => bill.value?.participants.find((p) => p.id === pid)?.name ?? '?'
const badgeOf = (pid: string) => bill.value?.participants.find((p) => p.id === pid)?.badgeKey

function save() {
  if (import.meta.client) window.print()
}
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center gap-5 p-6"
    style="background: var(--pp-canvas)"
  >
    <!-- toolbar (hidden when printing) -->
    <div class="no-print flex w-[380px] items-center justify-between">
      <core-button variant="ghost" @click="navigateTo(`/bill/${id}/settle`)">
        <span class="i-tabler-arrow-left" /> Back
      </core-button>
      <core-button variant="ochre" @click="save">
        <span class="i-tabler-download" /> Save as image
      </core-button>
    </div>

    <!-- settlement card artifact -->
    <div
      v-if="bill"
      id="settle-card"
      class="relative w-[380px] overflow-hidden rounded-card-lg px-7 py-8 text-center"
      style="background: #f4ead7; box-shadow: 0 10px 30px -12px rgba(46, 37, 25, 0.4)"
    >
      <!-- L-corner ornaments -->
      <span class="corner" style="top: 12px; left: 12px; border-width: 2px 0 0 2px" />
      <span class="corner" style="top: 12px; right: 12px; border-width: 2px 2px 0 0" />
      <span class="corner" style="bottom: 12px; left: 12px; border-width: 0 0 2px 2px" />
      <span class="corner" style="bottom: 12px; right: 12px; border-width: 0 2px 2px 0" />

      <div class="flex items-center justify-center gap-2">
        <pp-logo :size="22" />
        <span class="text-sm font-700 uppercase tracking-[.2em] text-ink">PetePete</span>
      </div>
      <p class="eyebrow mt-4">Settle up</p>
      <h1 class="font-serif text-3xl font-700 text-ink">{{ bill.title }}</h1>
      <p class="mt-1 text-xs text-muted">
        {{ transfers.length }} transfers clear all {{ stats?.souls }} ·
        {{ formatRupiah(stats?.total ?? 0) }}
      </p>

      <div class="rule-double mt-5 flex flex-col gap-3 pt-5">
        <div v-for="(t, i) in transfers" :key="i" class="flex items-center gap-2">
          <avatar-badge :badge-key="badgeOf(t.from)!" :size="26" />
          <span class="text-sm font-600 text-ink">{{ nameOf(t.from) }}</span>
          <span class="mx-1 flex-1 border-t border-dashed" style="border-color: #c2902f" />
          <span class="text-sm font-600 text-ink">{{ nameOf(t.to) }}</span>
          <avatar-badge :badge-key="badgeOf(t.to)!" :size="26" />
          <span class="num ml-2 text-sm font-700 text-ink">{{ formatRupiah(t.amount) }}</span>
        </div>
        <p v-if="!transfers.length" class="text-sm text-muted">Everyone is square.</p>
      </div>

      <p class="mt-6 text-[11px] text-muted">PetePete · settle up, stay friends</p>
    </div>
  </div>
</template>

<style scoped>
.corner {
  position: absolute;
  width: 22px;
  height: 22px;
  border-color: #c2902f;
  border-style: solid;
}
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
