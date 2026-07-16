<script setup lang="ts">
import { useField } from 'vee-validate'

defineOptions({ inheritAttrs: false })

/**
 * CoreInput — reusable field. Two modes:
 *  - VeeValidate mode: pass `name` and it wires itself to the surrounding
 *    useForm() via useField(name) — value + error are managed by the form
 *    library, never by a local ref.
 *  - plain mode: use v-model (for transient, non-validated inputs).
 */
const props = withDefaults(
  defineProps<{
    name?: string
    modelValue?: string | number
    label?: string
    type?: string
    placeholder?: string
    variant?: 'default' | 'compact' | 'emphasis' | 'bare'
    numeric?: boolean
  }>(),
  { type: 'text', variant: 'default' },
)
const emit = defineEmits<{ 'update:modelValue': [string | number] }>()

// Only bind to a form field when a name is supplied.
const field = props.name ? useField<string | number>(() => props.name!) : null

const coerce = (raw: string): string | number =>
  props.numeric ? (raw === '' ? 0 : Number(raw)) : raw

const value = computed<string | number>({
  get: () => (field ? (field.value.value ?? '') : (props.modelValue ?? '')),
  set: (v) => {
    if (field) field.value.value = v
    else emit('update:modelValue', v)
  },
})

function onInput(e: Event) {
  value.value = coerce((e.target as HTMLInputElement).value)
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
const error = computed(() => field?.errorMessage.value)
</script>

<template>
  <label class="block">
    <span v-if="label" class="eyebrow">{{ label }}</span>
    <div class="relative" :class="label ? 'mt-1.5' : ''">
      <input
        :type="type"
        :inputmode="numeric ? 'numeric' : undefined"
        :placeholder="placeholder"
        :class="[fieldClass, error ? 'border-terracotta' : '']"
        :value="value"
        v-bind="$attrs"
        @input="onInput"
      />
      <slot name="suffix" />
    </div>
    <span v-if="error" class="mt-1 block text-xs text-terracotta">{{ error }}</span>
  </label>
</template>
