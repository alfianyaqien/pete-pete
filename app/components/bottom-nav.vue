<script setup lang="ts">
const props = defineProps<{
  active: 'home' | 'receipt' | 'users' | 'settings'
  billId?: string
}>()

const items = computed(() => [
  { key: 'home', icon: 'mountain', to: '/', label: 'Trips' },
  { key: 'receipt', icon: 'receipt', to: props.billId ? `/bill/${props.billId}` : '/', label: 'Ledger' },
  {
    key: 'users',
    icon: 'users',
    to: props.billId ? `/bill/${props.billId}/participants` : '/',
    label: 'Souls',
  },
  { key: 'settings', icon: 'settings', to: '/', label: 'Settings' },
])
</script>

<template>
  <!-- Floating navbar, centered at the bottom over the content. -->
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
