<script setup lang="ts">
import type { Participant } from '~~/shared/types'

const props = withDefaults(
  defineProps<{ participants: Participant[]; max?: number; size?: number }>(),
  { max: 5, size: 28 },
)

const shown = computed(() => props.participants.slice(0, props.max))
const overflow = computed(() => Math.max(0, props.participants.length - props.max))
</script>

<template>
  <div class="flex items-center">
    <div
      v-for="(p, i) in shown"
      :key="p.id"
      class="rounded-full ring-2 ring-surface-card"
      :style="{ marginLeft: i ? '-8px' : '0', zIndex: shown.length - i }"
    >
      <AvatarBadge :badge-key="p.badgeKey" :size="size" />
    </div>
    <span
      v-if="overflow"
      class="flex items-center justify-center rounded-full bg-surface-input font-600 text-muted ring-2 ring-surface-card"
      :style="{
        marginLeft: '-8px',
        width: size + 'px',
        height: size + 'px',
        fontSize: Math.round(size * 0.38) + 'px',
      }"
    >
      +{{ overflow }}
    </span>
  </div>
</template>
