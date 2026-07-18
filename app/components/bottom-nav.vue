<script setup lang="ts">
/**
 * Bill-scoped floating nav. The app has no login, so there is no global
 * navigation — this only appears inside a bill and only links to that bill's
 * own screens (Entries / Souls / Settle).
 */
const props = defineProps<{
  active: 'entries' | 'souls' | 'settle'
  billId: string
}>()

const items = computed(() => [
  { key: 'entries', icon: 'receipt', to: `/bill/${props.billId}`, label: 'Entries' },
  { key: 'souls', icon: 'users', to: `/bill/${props.billId}/participants`, label: 'Souls' },
  { key: 'settle', icon: 'arrows-left-right', to: `/bill/${props.billId}/settle`, label: 'Settle' },
])
</script>

<template>
  <nav
    class="fixed bottom-5 left-1/2 z-40 -translate-x-1/2"
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <div
      class="flex items-center gap-1 rounded-full border border-line-light px-2 py-1.5 shadow-card backdrop-blur-md"
      style="background: rgba(248, 241, 223, 0.92)"
    >
      <NuxtLink
        v-for="it in items"
        :key="it.key"
        :to="it.to"
        class="flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors"
        :class="active === it.key ? 'bg-forest text-surface-card' : 'text-muted hover:text-ink'"
        :aria-label="it.label"
      >
        <span :class="`i-tabler-${it.icon}`" class="text-xl" />
        <span v-if="active === it.key" class="text-xs font-600">{{ it.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
