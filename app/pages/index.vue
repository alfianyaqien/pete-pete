<script setup lang="ts">
import { seasonStats } from '~~/shared/stats'
import { formatRupiah, formatCompact } from '~~/shared/format'

const { data: bills } = useBills()

const filter = ref<'all' | 'open' | 'lunas'>('all')
const filterOptions = [
  { label: 'All', value: 'all' as const },
  { label: 'Open', value: 'open' as const },
  { label: 'Lunas', value: 'lunas' as const },
]

const hasBills = computed(() => (bills.value?.length ?? 0) > 0)
const season = computed(() => seasonStats(bills.value ?? []))
const avgPerTrip = computed(() => season.value.total / Math.max(1, bills.value?.length ?? 1))

const filtered = computed(() => {
  const list = bills.value ?? []
  if (filter.value === 'open') return list.filter((b) => !b.lunas)
  if (filter.value === 'lunas') return list.filter((b) => b.lunas)
  return list
})

const monthChip = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(
  new Date(),
)
</script>

<template>
  <screen-header eyebrow="Ledger" title="Your expeditions">
    <template #brand>
      <pp-logo :size="34" />
    </template>
  </screen-header>

  <main class="app-col relative flex-1 overflow-y-auto px-5 pb-24 pt-4">
    <!-- empty state -->
    <div v-if="!hasBills" class="flex flex-col items-center pt-16 text-center">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <circle cx="60" cy="60" r="52" stroke="#C9B894" stroke-width="2" stroke-dasharray="5 7" />
        <path
          d="M44 50 Q44 40 60 40 Q76 40 76 50 L80 84 Q80 90 74 90 L46 90 Q40 90 40 84 Z"
          fill="#E7D9BC"
          stroke="#1E4D3A"
          stroke-width="2"
        />
        <path d="M52 40 Q52 32 60 32 Q68 32 68 40" stroke="#1E4D3A" stroke-width="2" fill="none" />
        <path d="M50 64 L70 64" stroke="#1E4D3A" stroke-width="2" />
      </svg>
      <h2 class="mt-5 font-serif text-xl font-700 text-ink">No expeditions logged yet</h2>
      <p class="mt-2 max-w-xs text-sm text-body">
        Start a trip ledger, add who came along, and split your first expense.
      </p>
      <core-button to="/bill/new" class="mt-6">
        <span class="i-tabler-plus" /> Create bill
      </core-button>
    </div>

    <!-- populated dashboard -->
    <template v-else>
      <hero-panel>
        <div class="flex items-center justify-between">
          <p class="text-[10px] font-600 uppercase tracking-[.1em]" style="color: #9dc2ae">
            Trip ledger · this season
          </p>
          <span class="rounded-pill bg-white/12 px-2 py-0.5 text-[11px] font-600">{{ monthChip }}</span>
        </div>
        <div class="num mt-2 text-3xl font-700">{{ formatRupiah(season.total) }}</div>
        <p class="mt-1 text-xs" style="color: #9dc2ae">
          logged across {{ bills?.length }} expeditions · {{ season.souls }} souls
        </p>

        <div class="mt-4 flex gap-4 text-sm">
          <div>
            <p class="text-[11px]" style="color: #9dc2ae">Still unsettled</p>
            <p class="num font-600" style="color: #e7b968">{{ formatRupiah(season.unsettled) }}</p>
          </div>
          <div>
            <p class="text-[11px]" style="color: #9dc2ae">Cleared</p>
            <p class="num font-600" style="color: #9ddfb6">{{ formatRupiah(season.cleared) }}</p>
          </div>
        </div>
        <div class="mt-3">
          <progress-bar
            :segments="[
              { value: season.cleared, color: '#5FB07E' },
              { value: season.unsettled, color: '#E0A53C' },
            ]"
          />
        </div>
        <div class="mt-3 flex flex-wrap gap-2 text-[11px] font-600">
          <span class="rounded-chip-sm bg-white/12 px-2 py-1">{{ season.open }} open</span>
          <span class="rounded-chip-sm bg-white/12 px-2 py-1">🟫 {{ season.lunas }} lunas</span>
          <span class="rounded-chip-sm bg-white/12 px-2 py-1">{{ season.souls }} souls</span>
        </div>
      </hero-panel>

      <div class="mt-4 grid grid-cols-3 gap-2">
        <stat-tile icon="mountain" label="Expeditions" :value="String(bills?.length ?? 0)" />
        <stat-tile icon="users" label="Souls along" :value="String(season.souls)" />
        <stat-tile icon="route" label="Avg / trip" :value="formatCompact(avgPerTrip)" />
      </div>

      <div class="mb-3 mt-6 flex items-center justify-between gap-3">
        <h2 class="font-serif text-lg font-600 text-ink">Expeditions</h2>
        <div class="w-44">
          <core-segmented-control v-model="filter" :options="filterOptions" />
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <bill-card v-for="b in filtered" :key="b.id" :bill="b" />
        <p v-if="filtered.length === 0" class="py-6 text-center text-sm text-muted">
          No {{ filter }} expeditions.
        </p>
      </div>
    </template>

  </main>

  <!-- FAB (anchored to the column) -->
  <NuxtLink
    v-if="hasBills"
    to="/bill/new"
    class="absolute bottom-20 right-5 z-20 flex size-14 items-center justify-center rounded-full bg-forest text-surface-card shadow-card"
    aria-label="Create bill"
  >
    <span class="i-tabler-plus text-2xl" />
  </NuxtLink>

  <bottom-nav active="home" />
</template>
