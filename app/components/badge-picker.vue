<script setup lang="ts">
import { AVATARS } from '~~/shared/avatars'
import type { BadgeKey } from '~~/shared/types'

const model = defineModel<BadgeKey>()
</script>

<template>
  <div class="grid max-h-56 grid-cols-5 gap-2 overflow-y-auto p-0.5">
    <button
      v-for="a in AVATARS"
      :key="a.key"
      type="button"
      class="relative flex items-center justify-center rounded-card p-1 transition-colors"
      :class="model === a.key ? 'bg-forest' : 'bg-surface-input'"
      :title="a.label"
      @click="model = a.key"
    >
      <avatar-badge :badge-key="a.key" :size="40" />
      <span
        v-if="model === a.key"
        class="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-forest text-white ring-2 ring-surface-card"
      >
        <span class="i-tabler-check text-[11px]" />
      </span>
    </button>
  </div>
</template>
