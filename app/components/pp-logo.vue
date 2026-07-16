<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 28 })
</script>

<template>
  <svg :width.attr="size" :height.attr="size" viewBox="0 0 32 32" aria-label="PetePete">
    <circle cx="16" cy="16" r="15" fill="#1E4D3A" />
    <!-- compass peak -->
    <path d="M16 7 L23 22 L16 18 L9 22 Z" fill="#F8F1DF" />
    <path d="M16 7 L16 18 L9 22 Z" fill="#C2902F" />
    <circle cx="16" cy="16" r="15" fill="none" stroke="#143729" stroke-width="1" />
  </svg>
</template>
