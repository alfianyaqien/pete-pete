<script setup lang="ts">
import type { Participant } from '~~/shared/types'

const props = withDefaults(
  defineProps<{ participants: Participant[]; modelValue: string | null; tone?: 'dark' | 'light' }>(),
  { tone: 'dark' },
)
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const open = ref(false)
const current = computed(
  () => props.participants.find((p) => p.id === props.modelValue) ?? props.participants[0] ?? null,
)
function pick(id: string) {
  emit('update:modelValue', id)
  open.value = false
}
</script>

<template>
  <div class="relative inline-block">
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-sm font-600"
      :class="
        tone === 'dark'
          ? 'bg-white/12 text-surface-card'
          : 'border border-line-light bg-surface-card text-ink'
      "
      @click="open = !open"
    >
      <AvatarBadge v-if="current" :badge-key="current.badgeKey" :size="20" />
      <span>You're {{ current?.name ?? '—' }}</span>
      <span class="i-tabler-chevron-down text-xs" />
    </button>
    <div
      v-if="open"
      class="absolute right-0 z-30 mt-1 max-h-60 w-44 overflow-auto rounded-card bg-surface-card p-1 text-ink shadow-card"
    >
      <button
        v-for="p in participants"
        :key="p.id"
        type="button"
        class="flex w-full items-center gap-2 rounded-chip px-2 py-1.5 text-left text-sm hover:bg-surface-subtle"
        :class="p.id === current?.id ? 'bg-surface-subtle font-600' : ''"
        @click="pick(p.id)"
      >
        <AvatarBadge :badge-key="p.badgeKey" :size="20" />
        <span>{{ p.name }}</span>
      </button>
    </div>
  </div>
</template>
