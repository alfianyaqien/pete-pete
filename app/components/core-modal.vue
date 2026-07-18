<script setup lang="ts">
/**
 * CoreModal — bottom-sheet dialog. v-model:open, dimmed scrim, grab handle,
 * optional title or #header slot. Used for every sheet in the app.
 */
const open = defineModel<boolean>('open', { default: false })
defineProps<{ title?: string }>()

function close() {
  open.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="fixed inset-0 z-50 flex items-end justify-center">
        <div class="absolute inset-0" style="background: rgba(46, 37, 25, 0.42)" @click="close" />
        <div
          class="relative w-full max-w-[460px] rounded-t-sheet bg-surface-card px-5 pb-7 pt-3 text-ink shadow-card"
          style="padding-bottom: calc(1.75rem + env(safe-area-inset-bottom))"
        >
          <div class="mx-auto mb-3 h-1 w-[38px] rounded-full bg-line-medium" />
          <div v-if="title || $slots.header" class="mb-3 flex items-center justify-between">
            <slot name="header">
              <h2 class="font-serif text-lg font-600">{{ title }}</h2>
            </slot>
            <button type="button" aria-label="Close" @click="close" class="appearance-none border-none bg-transparent">
              <span class="i-tabler-x text-muted size-5" />
            </button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.2s ease;
}
.sheet-enter-active > div:last-child,
.sheet-leave-active > div:last-child {
  transition: transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from > div:last-child,
.sheet-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
