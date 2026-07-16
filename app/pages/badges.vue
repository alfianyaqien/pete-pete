<script setup lang="ts">
// Verification gallery for the 30 trail-badge avatars. Temporary; the picker
// grid (Add/Edit participant sheets) reuses <avatar-badge> later.
import { AVATARS } from '~~/shared/avatars'
</script>

<template>
  <main class="mx-auto max-w-2xl p-6 font-sans text-ink">
    <p class="eyebrow">Signature asset</p>
    <h1 class="font-serif text-2xl font-700 mb-1">Trail badges · {{ AVATARS.length }} in the set</h1>
    <p class="text-body text-sm mb-6">Woodcut line on parchment · ring rotates forest / ochre / terracotta.</p>

    <div class="grid grid-cols-6 gap-x-3 gap-y-5">
      <div v-for="a in AVATARS" :key="a.key" class="text-center">
        <avatar-badge :badge-key="a.key" :size="60" />
        <div class="text-[11px] text-body mt-1">{{ a.label }}</div>
      </div>
    </div>
  </main>
</template>
