<script setup lang="ts">
import { useField } from 'vee-validate'
import { formatDateMedium } from '~~/shared/format'

/**
 * CoreDateInput — a field-styled trigger that opens core-calendar in an
 * anchored floating panel (no native date input). Same dual mode as CoreInput:
 * `name` binds to the surrounding useForm(), otherwise v-model. Value is a
 * 'YYYY-MM-DD' string.
 */
const props = withDefaults(
  defineProps<{
    name?: string
    modelValue?: string
    label?: string
    variant?: 'field' | 'bare'
  }>(),
  { variant: 'field' },
)
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const field = props.name ? useField<string>(() => props.name!) : null
const value = computed<string>({
  get: () => (field ? (field.value.value ?? '') : (props.modelValue ?? '')),
  set: (v) => {
    if (field) field.value.value = v
    else emit('update:modelValue', v)
  },
})
const error = computed(() => field?.errorMessage.value)
const display = computed(() => (value.value ? formatDateMedium(value.value) : 'Select date'))

const open = ref(false)
const triggerRef = ref<HTMLButtonElement>()
const panelUpward = ref(false)
const panelStyle = ref<Record<string, string>>({})

function reposition() {
  const el = triggerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const gap = 6
  const panelH = 340
  const panelW = 288
  const upward = rect.bottom + gap + panelH > window.innerHeight && rect.top > panelH
  panelUpward.value = upward
  panelStyle.value = {
    left: `${Math.min(rect.left, window.innerWidth - panelW - 8)}px`,
    width: `${panelW}px`,
    ...(upward
      ? { bottom: `${window.innerHeight - rect.top + gap}px` }
      : { top: `${rect.bottom + gap}px` }),
  }
}
function toggle() {
  if (open.value) {
    open.value = false
    return
  }
  reposition()
  open.value = true
}
function onPicked(v: string) {
  value.value = v
  open.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (open.value && e.key === 'Escape') open.value = false
}
function onWinChange() {
  if (open.value) reposition()
}
onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onWinChange)
  window.addEventListener('scroll', onWinChange, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onWinChange)
  window.removeEventListener('scroll', onWinChange, true)
})
</script>

<template>
  <label class="block">
    <span v-if="label" class="eyebrow">{{ label }}</span>
    <div class="relative" :class="[variant === 'bare' ? 'flex-1 w-full' : 'w-full', label ? 'mt-1.5' : '']">
      <button
        ref="triggerRef"
        type="button"
        class="flex items-center text-left"
        :class="variant === 'bare' ? 'select-bare' : 'select-field'"
        :aria-expanded="open"
        @click="toggle"
      >
        <span class="truncate" :class="value ? 'text-ink' : 'text-muted'">{{ display }}</span>
      </button>
      <span
        class="i-tabler-calendar pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted"
        :class="variant === 'bare' ? 'right-0 text-sm' : 'right-3 text-sm'"
      />
    </div>
    <span v-if="error" class="mt-1 block text-xs text-terracotta">{{ error }}</span>
  </label>

  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50" @click="open = false">
      <Transition name="pop">
        <div
          class="absolute rounded-card border border-line-light bg-surface-card p-3 shadow-card"
          :style="panelStyle"
          :class="panelUpward ? 'origin-bottom' : 'origin-top'"
          @click.stop
        >
          <core-calendar :model-value="value" @update:model-value="onPicked" />
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
