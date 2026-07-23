<script setup lang="ts">
import { AVATAR_BY_KEY } from '~~/shared/avatars'
import type { BadgeKey } from '~~/shared/types'

const props = withDefaults(
  defineProps<{ badgeKey: BadgeKey; size?: number; strokeWidth?: number }>(),
  { size: 60, strokeWidth: 1.8 },
)

const avatar = computed(() => AVATAR_BY_KEY[props.badgeKey] ?? AVATAR_BY_KEY.ibex)
</script>

<template>
  <svg
    :width.attr="size"
    :height.attr="size"
    viewBox="0 0 60 60"
    role="img"
    :aria-label="`${avatar.label} travel badge`"
  >
    <circle cx="30" cy="30" r="28" fill="#E7D9BC" :stroke="avatar.ring" stroke-width="2" />
    <!-- art is trusted static markup ported from the design handoff -->
    <g
      fill="none"
      stroke="#2E2519"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      v-html="avatar.art"
    />
  </svg>
</template>
