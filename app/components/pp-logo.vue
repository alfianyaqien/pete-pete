<script setup lang="ts">
/**
 * PetePete mark - a torn receipt carrying a compass rose whose north point
 * (ochre) reads upward: the bill and the travel, in one shape. Geometry is
 * centred on the disc (receipt 36×32 at x14–50, rose centred on 32,27) so it
 * stays balanced at every size.
 */
withDefaults(defineProps<{ size?: number }>(), { size: 28 })
</script>

<template>
  <svg :width.attr="size" :height.attr="size" viewBox="0 0 64 64" aria-label="PetePete">
    <circle cx="32" cy="32" r="31" fill="#1E4D3A" />
    <circle cx="32" cy="32" r="31" fill="none" stroke="#143729" stroke-width="1" />

    <!-- receipt: rounded top, torn zigzag bottom -->
    <path
      d="M17 13 H47 a3 3 0 0 1 3 3 V45
         l-3 5 l-3 -5 l-3 5 l-3 -5 l-3 5 l-3 -5 l-3 5 l-3 -5 l-3 5 l-3 -5 l-3 5 l-3 -5
         V16 a3 3 0 0 1 3 -3 z"
      fill="#F8F1DF"
    />

    <!-- compass rose, north point emphasised in ochre -->
    <path d="M32 16 L36 23 L43 27 L36 31 L32 38 L28 31 L21 27 L28 23 Z" fill="#1E4D3A" />
    <path d="M32 16 L36 23 L28 23 Z" fill="#C2902F" />
    <circle cx="32" cy="27" r="1.6" fill="#F8F1DF" />

    <!-- a line of receipt text -->
    <rect x="25" y="41" width="14" height="2" rx="1" fill="#C9BFA6" />
  </svg>
</template>
