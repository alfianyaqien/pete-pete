<script setup lang="ts">
/**
 * CoreButton - the single reusable button. Renders a <NuxtLink> when `to` is
 * given, otherwise a <button>. Styling comes from the btn-* design-token
 * shortcuts so every button in the app is consistent.
 */
const props = withDefaults(
  defineProps<{
    variant?: 'forest' | 'ochre' | 'ghost' | 'danger'
    to?: string
    type?: 'button' | 'submit' | 'reset'
    block?: boolean
    disabled?: boolean
    loading?: boolean
  }>(),
  { variant: 'forest', type: 'button' },
)

const classes = computed(() => [
  { forest: 'btn-forest', ochre: 'btn-ochre', ghost: 'btn-ghost', danger: 'btn-danger' }[
    props.variant
  ],
  props.block ? 'w-full' : '',
])
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="['no-underline', classes]">
    <slot />
  </NuxtLink>
  <button v-else :type="type" :class="[classes]" :disabled="disabled || loading">
    <span v-if="loading" class="i-tabler-loader-2 animate-spin " />
    <slot />
  </button>
</template>
