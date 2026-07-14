<script setup lang="ts">
const props = defineProps<{
  active: 'home' | 'receipt' | 'users' | 'settings'
  billId?: string
}>()

const items = computed(() => [
  { key: 'home', icon: 'mountain', to: '/' },
  { key: 'receipt', icon: 'receipt', to: props.billId ? `/bill/${props.billId}` : '/' },
  {
    key: 'users',
    icon: 'users',
    to: props.billId ? `/bill/${props.billId}/participants` : '/',
  },
  { key: 'settings', icon: 'settings', to: '/' },
])
</script>

<template>
  <nav
    class="flex border-t border-line-light bg-surface-card"
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <NuxtLink
      v-for="it in items"
      :key="it.key"
      :to="it.to"
      class="flex flex-1 flex-col items-center gap-0.5 py-2.5"
      :class="active === it.key ? 'text-forest' : 'text-muted'"
    >
      <span :class="`i-tabler-${it.icon}`" class="text-xl" />
    </NuxtLink>
  </nav>
</template>
