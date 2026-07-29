<script setup lang="ts">
import { useField } from 'vee-validate'
import { formatAmount } from '~~/shared/format'

/**
 * CoreMoneyInput - a text input that DISPLAYS grouped digits ("1000" → "1.000",
 * Indonesian thousands) while the bound value stays a plain integer number.
 * Same dual mode as CoreInput: `name` binds to the surrounding useForm(),
 * otherwise v-model. The form always extracts a number, never a string.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    name?: string
    modelValue?: number
    label?: string
    placeholder?: string
    variant?: 'default' | 'compact' | 'emphasis' | 'bare'
  }>(),
  { variant: 'default' },
)
const emit = defineEmits<{ 'update:modelValue': [number] }>()

const field = props.name ? useField<number>(() => props.name!) : null
const num = computed<number>({
  get: () => (field ? Number(field.value.value ?? 0) : Number(props.modelValue ?? 0)),
  set: (v) => {
    if (field) field.value.value = v
    else emit('update:modelValue', v)
  },
})
const error = computed(() => field?.errorMessage.value)

// Empty (0) shows nothing so the placeholder is visible.
const display = computed(() => (num.value > 0 ? formatAmount(num.value) : ''))

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  const raw = el.value
  const caret = el.selectionStart ?? raw.length
  const digitsBeforeCaret = raw.slice(0, caret).replace(/\D/g, '').length

  const digits = raw.replace(/\D/g, '')
  const n = digits ? Number(digits) : 0
  num.value = n

  // Force the DOM to the formatted value (covers no-op reactivity + stray chars).
  const formatted = n > 0 ? formatAmount(n) : ''
  el.value = formatted

  // Restore the caret to just after the same count of digits the user was at.
  let pos = formatted.length
  if (digitsBeforeCaret <= 0) {
    pos = 0
  } else {
    let count = 0
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i]!)) count++
      if (count === digitsBeforeCaret) {
        pos = i + 1
        break
      }
    }
  }
  el.setSelectionRange(pos, pos)
}

const fieldClass = computed(
  () =>
    ({
      default: 'field',
      compact: 'field-compact',
      emphasis: 'field-emphasis',
      bare: 'field-bare',
    })[props.variant],
)
</script>

<template>
  <label class="block">
    <span v-if="label" class="eyebrow">{{ label }}</span>
    <div class="relative" :class="label ? 'mt-1.5' : ''">
      <!-- money is always shown with its unit, so the field wears "Rp" too -->
      <span
        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted"
        :class="variant === 'compact' ? 'left-2 text-xs' : ''"
      >
        Rp
      </span>
      <input
        type="text"
        inputmode="numeric"
        :placeholder="placeholder"
        :class="[fieldClass, error ? 'border-terracotta' : '', variant === 'compact' ? 'pl-7' : 'pl-9']"
        :value="display"
        v-bind="$attrs"
        @input="onInput"
      />
    </div>
    <span v-if="error" class="mt-1 block text-xs text-terracotta">{{ error }}</span>
  </label>
</template>
