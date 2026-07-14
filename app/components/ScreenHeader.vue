<script setup lang="ts">
defineProps<{ eyebrow?: string; title?: string; meta?: string; back?: boolean }>()
defineEmits<{ back: [] }>()
</script>

<template>
  <header class="relative overflow-hidden bg-surface-header">
    <ContourOverlay />
    <div class="relative px-5 pt-3 pb-4">
      <div class="flex items-start gap-3">
        <button
          v-if="back"
          type="button"
          class="mt-0.5 flex size-9 flex-none items-center justify-center rounded-control bg-surface-card/70 text-ink"
          aria-label="Back"
          @click="$emit('back')"
        >
          <span class="i-tabler-arrow-left text-lg" />
        </button>
        <slot name="brand" />
        <div class="min-w-0 flex-1">
          <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
          <slot name="title">
            <h1 v-if="title" class="font-serif text-2xl font-700 leading-tight text-ink">
              {{ title }}
            </h1>
          </slot>
          <p v-if="meta" class="mt-0.5 text-xs text-muted">{{ meta }}</p>
        </div>
        <div class="flex-none">
          <slot name="right" />
        </div>
      </div>
      <slot />
    </div>
  </header>
</template>
