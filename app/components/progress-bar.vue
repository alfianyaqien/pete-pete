<script setup lang="ts">
const props = withDefaults(
  defineProps<{ segments: { value: number; color: string }[]; height?: number }>(),
  { height: 6 },
)
const total = computed(() => props.segments.reduce((a, s) => a + s.value, 0) || 1)
</script>

<template>
  <div
    class="flex w-full overflow-hidden rounded-full bg-surface-input"
    :style="{ height: height + 'px' }"
  >
    <div
      v-for="(s, i) in segments"
      :key="i"
      :style="{ width: (s.value / total) * 100 + '%', background: s.color }"
    />
  </div>
</template>
