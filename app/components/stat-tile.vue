<script setup lang="ts">
defineProps<{ icon: string; label: string; value: string }>()
</script>

<template>
  <div class="card-parchment p-3 text-center">
    <span :class="`i-tabler-${icon}`" class="text-lg text-forest" />
    <div class="num mt-1 text-lg font-600 text-ink">{{ value }}</div>
    <div class="text-[10px] uppercase tracking-wide text-muted">{{ label }}</div>
  </div>
</template>
