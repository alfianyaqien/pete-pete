<script setup lang="ts">
import { formatRupiah, formatAmount } from '~~/shared/format'

const props = withDefaults(
  defineProps<{ value: number; prefix?: boolean; signed?: boolean }>(),
  { prefix: true, signed: false },
)

const text = computed(() => {
  if (props.signed) {
    const sign = props.value > 0 ? '+' : props.value < 0 ? '−' : ''
    return sign + (props.prefix ? 'Rp ' : '') + formatAmount(Math.abs(props.value || 0))
  }
  return props.prefix ? formatRupiah(props.value) : formatAmount(props.value)
})

const tone = computed(() =>
  props.signed
    ? props.value > 0
      ? 'text-forest'
      : props.value < 0
        ? 'text-terracotta'
        : 'text-muted'
    : '',
)
</script>

<template>
  <span class="num" :class="tone">{{ text }}</span>
</template>
