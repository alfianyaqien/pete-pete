<script setup lang="ts" generic="T extends string | number">
import { useField } from 'vee-validate'

/**
 * CoreSelect — styled <select> with no native chrome (appearance-none + a
 * drawn Tabler chevron). Same dual mode as CoreInput: `name` binds to the
 * surrounding useForm(), otherwise v-model.
 *  - variant="field": bordered standalone control.
 *  - variant="bare": borderless, for embedding in an already-styled row.
 */
const props = withDefaults(
  defineProps<{
    options: { label: string; value: T }[]
    name?: string
    modelValue?: T
    label?: string
    variant?: 'field' | 'bare'
  }>(),
  { variant: 'field' },
)
const emit = defineEmits<{ 'update:modelValue': [T] }>()

const field = props.name ? useField<T>(() => props.name!) : null

const value = computed<T | undefined>({
  get: () => (field ? field.value.value : props.modelValue),
  set: (v) => {
    if (field) field.value.value = v as T
    else emit('update:modelValue', v as T)
  },
})
const error = computed(() => field?.errorMessage.value)
</script>

<template>
  <label class="block">
    <span v-if="label" class="eyebrow">{{ label }}</span>
    <div class="relative" :class="[variant === 'bare' ? 'flex-1' : 'w-full', label ? 'mt-1.5' : '']">
      <select v-model="value" :class="variant === 'bare' ? 'select-bare' : 'select-field'">
        <option v-for="o in options" :key="String(o.value)" :value="o.value">{{ o.label }}</option>
      </select>
      <span
        class="i-tabler-chevron-down pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted"
        :class="variant === 'bare' ? 'right-0 text-xs' : 'right-3 text-sm'"
      />
    </div>
    <span v-if="error" class="mt-1 block text-xs text-terracotta">{{ error }}</span>
  </label>
</template>
