<script setup lang="ts" generic="T extends string | number">
/** CoreSegmentedControl - pill toggle between a few options. v-model. */
const model = defineModel<T>()
defineProps<{
  options: { label: string; value: T; icon?: string }[]
  accent?: 'forest' | 'ochre'
}>()
</script>

<template>
  <div class="inline-flex w-full gap-1 rounded-control bg-surface-input p-1">
    <button
      v-for="o in options"
      :key="String(o.value)"
      type="button"
      class="flex flex-1 items-center justify-center gap-1 rounded-chip py-2 text-sm font-600 transition-colors border-none cursor-pointer"
      :class="
        model === o.value
          ? accent === 'ochre'
            ? 'bg-ochre text-white'
            : 'bg-forest text-surface-card'
          : 'text-body'
      "
      @click="model = o.value"
    >
      <span v-if="o.icon" :class="`i-tabler-${o.icon}`" />
      {{ o.label }}
    </button>
  </div>
</template>
