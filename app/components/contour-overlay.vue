<script setup lang="ts">
// Topographic contour-line motif behind headers and the dark hero.
withDefaults(defineProps<{ opacity?: number; stroke?: string }>(), {
  opacity: 0.14,
  stroke: '#1E4D3A',
})
</script>

<template>
  <svg
    class="pointer-events-none absolute inset-0 h-full w-full"
    :style="{ opacity }"
    preserveAspectRatio="none"
    viewBox="0 0 400 120"
    fill="none"
    :stroke="stroke"
    stroke-width="1"
    aria-hidden="true"
  >
    <path d="M-10 78 Q90 30 200 62 T410 44" />
    <path d="M-10 98 Q90 52 200 84 T410 66" />
    <path d="M-10 56 Q100 14 210 42 T410 22" />
    <path d="M-10 116 Q110 74 220 104 T410 88" />
  </svg>
</template>
