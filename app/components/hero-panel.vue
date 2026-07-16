<script setup lang="ts">
// Dark forest "hero" panel (Home ledger standing, Settle-up "your standing").
</script>

<template>
  <div
    class="relative overflow-hidden rounded-card-lg text-surface-card shadow-hero"
    style="background: var(--pp-hero); border: 1px solid #163a2c"
  >
    <contour-overlay :opacity="0.16" stroke="#9DC2AE" />
    <div class="relative p-5">
      <slot />
    </div>
  </div>
</template>
