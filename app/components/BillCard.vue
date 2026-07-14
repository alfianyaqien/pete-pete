<script setup lang="ts">
import type { Bill } from '~~/shared/types'
import { billStats } from '~~/shared/stats'
import { formatDateShort } from '~~/shared/format'

const props = defineProps<{ bill: Bill }>()
const s = computed(() => billStats(props.bill))
</script>

<template>
  <NuxtLink :to="`/bill/${bill.id}`" class="block card-parchment p-4">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="font-serif text-base font-600 text-ink">{{ bill.title }}</h3>
        <p class="mt-0.5 text-xs text-muted">
          {{ s.souls }} souls · {{ s.entries }} entries · {{ formatDateShort(bill.createdAt) }}
        </p>
        <div class="mt-2.5">
          <AvatarStack :participants="bill.participants" :max="6" :size="24" />
        </div>
      </div>
      <div class="flex flex-col items-end gap-1 text-right">
        <span class="eyebrow">Total</span>
        <MoneyText :value="s.total" class="text-base font-600" />
        <span
          v-if="bill.lunas"
          class="mt-1 flex size-8 items-center justify-center rounded-full border-2 border-terracotta text-[8px] font-700 uppercase leading-none text-terracotta"
        >
          Lunas
        </span>
        <span v-else class="i-tabler-chevron-right text-muted" />
      </div>
    </div>

    <div class="mt-3">
      <template v-if="bill.lunas">
        <ProgressBar :segments="[{ value: 1, color: '#A6492C' }, { value: 1, color: '#C2902F' }]" />
        <p class="mt-1 text-[11px] font-600 text-terracotta">🟫 Lunas · cleared</p>
      </template>
      <template v-else>
        <ProgressBar
          :segments="[
            { value: s.settled, color: '#1E4D3A' },
            { value: Math.max(0, s.souls - s.settled), color: '#C2902F' },
          ]"
        />
        <p class="mt-1 text-[11px] text-muted">{{ s.settled }} / {{ s.souls }} settled</p>
      </template>
    </div>
  </NuxtLink>
</template>
