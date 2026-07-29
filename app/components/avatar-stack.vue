<script setup lang="ts">
import type { Participant } from '~~/shared/types'

/**
 * Overlapping row of travel badges. Each badge carries its owner's name as a
 * tooltip (and the "+N" chip lists the hidden ones), so hovering identifies
 * people without spending any layout on labels.
 */
const props = withDefaults(
  defineProps<{ participants: Participant[]; max?: number; size?: number }>(),
  { max: 5, size: 28 },
)

const shown = computed(() => props.participants.slice(0, props.max))
const overflow = computed(() => Math.max(0, props.participants.length - props.max))
/** Names hidden behind the "+N" chip - surfaced as its tooltip. */
const overflowNames = computed(() =>
  props.participants.slice(props.max).map((p) => p.name).join(', '),
)
/** Keep the overlap proportional so it reads the same at any badge size. */
const overlapPx = computed(() => -Math.round(props.size * 0.3))
</script>

<template>
  <!-- `isolate` keeps the per-badge z-index (used only for overlap order) inside
       this stack, so it can never paint over layout chrome like the bottom nav. -->
  <div class="flex items-center isolate">
    <div
      v-for="(p, i) in shown"
      :key="p.id"
      class="rounded-full ring-2 ring-surface-card"
      :style="{
        width: size + 'px',
        height: size + 'px',
        marginLeft: i ? overlapPx + 'px' : '0',
        zIndex: shown.length - i,
      }"
      :title="p.name"
    >
      <avatar-badge :badge-key="p.badgeKey" :size="size" />
    </div>
    <span
      v-if="overflow"
      class="flex items-center justify-center rounded-full bg-surface-input font-600 text-muted ring-2 ring-surface-card"
      :title="overflowNames"
      :style="{
        marginLeft: overlapPx + 'px',
        width: size + 'px',
        height: size + 'px',
        fontSize: Math.round(size * 0.38) + 'px',
      }"
    >
      +{{ overflow }}
    </span>
  </div>
</template>
