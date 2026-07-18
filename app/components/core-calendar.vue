<script setup lang="ts">
import { parseISODate, todayISO } from '~~/shared/format'

/** Custom month-grid calendar (no native input). v-model is a 'YYYY-MM-DD' string. */
const model = defineModel<string>()

const today = todayISO()
const pad = (n: number) => String(n).padStart(2, '0')
const toISO = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

const init = parseISODate(model.value || today)
const viewY = ref(init.getFullYear())
const viewM = ref(init.getMonth()) // 0–11

// keep the view in sync if the bound value jumps to another month
watch(model, (v) => {
  if (!v) return
  const d = parseISODate(v)
  viewY.value = d.getFullYear()
  viewM.value = d.getMonth()
})

const monthLabel = computed(() =>
  new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(
    new Date(viewY.value, viewM.value, 1),
  ),
)

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const cells = computed<({ day: number; iso: string } | null)[]>(() => {
  const offset = new Date(viewY.value, viewM.value, 1).getDay() // 0=Sun
  const days = new Date(viewY.value, viewM.value + 1, 0).getDate()
  const out: ({ day: number; iso: string } | null)[] = Array(offset).fill(null)
  for (let d = 1; d <= days; d++) out.push({ day: d, iso: toISO(viewY.value, viewM.value, d) })
  return out
})

function prevMonth() {
  if (viewM.value === 0) {
    viewM.value = 11
    viewY.value--
  } else viewM.value--
}
function nextMonth() {
  if (viewM.value === 11) {
    viewM.value = 0
    viewY.value++
  } else viewM.value++
}
</script>

<template>
  <div class="w-[268px] select-none">
    <div class="mb-2 flex items-center justify-between">
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-control border-none bg-transparent text-ink hover:bg-surface-subtle"
        aria-label="Previous month"
        @click="prevMonth"
      >
        <span class="i-tabler-chevron-left" />
      </button>
      <span class="font-serif text-sm font-600 text-ink">{{ monthLabel }}</span>
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-control border-none bg-transparent text-ink hover:bg-surface-subtle"
        aria-label="Next month"
        @click="nextMonth"
      >
        <span class="i-tabler-chevron-right" />
      </button>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <span
        v-for="(w, i) in weekdays"
        :key="i"
        class="flex h-7 items-center justify-center text-[10px] font-600 uppercase text-muted"
      >
        {{ w }}
      </span>

      <template v-for="(c, i) in cells" :key="i">
        <span v-if="!c" />
        <button
          v-else
          type="button"
          class="num flex h-9 items-center justify-center rounded-control border-none bg-transparent text-sm text-ink transition-colors"
          :class="
            c.iso === model
              ? 'bg-forest text-surface-card font-600'
              : c.iso === today
                ? 'ring-1 ring-inset ring-line-medium hover:bg-surface-subtle'
                : 'hover:bg-surface-subtle'
          "
          @click="model = c.iso"
        >
          {{ c.day }}
        </button>
      </template>
    </div>

    <button
      type="button"
      class="mt-2 w-full rounded-control border-none bg-surface-subtle py-1.5 text-xs font-600 text-forest hover:bg-surface-input"
      @click="model = today"
    >
      Today
    </button>
  </div>
</template>
