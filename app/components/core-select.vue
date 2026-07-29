<script setup lang="ts" generic="T extends string | number">
import { useField } from 'vee-validate'
import type { BadgeKey } from '~~/shared/types'

/**
 * CoreSelect - custom listbox, not a native <select>. A real <select> can't
 * be themed once its dropdown opens (OS chrome), so the option list renders
 * as an anchored floating panel positioned off the trigger's own rect (flips
 * above it when there's no room below). Same dual mode as CoreInput: `name`
 * binds to the surrounding useForm(), otherwise v-model.
 *  - variant="field": bordered standalone control.
 *  - variant="bare": borderless, for embedding in an already-styled row.
 */
const props = withDefaults(
  defineProps<{
    /** `badgeKey` is optional - when present the option shows that person's
     *  travel badge on the left, in both the trigger and the list. */
    options: { label: string; value: T; badgeKey?: BadgeKey }[]
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

const open = ref(false)
const selected = computed(() => props.options.find((o) => o.value === value.value))
const selectedLabel = computed(() => selected.value?.label ?? '')

const triggerRef = ref<HTMLButtonElement>()
const panelUpward = ref(false)
const panelStyle = ref<Record<string, string>>({})

function reposition() {
  const el = triggerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const gap = 6
  const estPanelHeight = Math.min(260, props.options.length * 40 + 12)
  const upward = rect.bottom + gap + estPanelHeight > window.innerHeight && rect.top > estPanelHeight
  const width = Math.min(Math.max(rect.width, 200), window.innerWidth - 16)

  panelUpward.value = upward
  panelStyle.value = {
    left: `${Math.min(rect.left, window.innerWidth - width - 8)}px`,
    width: `${width}px`,
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

function select(v: T) {
  value.value = v
  open.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (open.value && e.key === 'Escape') open.value = false
}
function onWindowChange() {
  if (open.value) reposition()
}
onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onWindowChange)
  window.addEventListener('scroll', onWindowChange, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onWindowChange)
  window.removeEventListener('scroll', onWindowChange, true)
})
</script>

<template>
  <label class="block grow">
    <span v-if="label" class="eyebrow">{{ label }}</span>
    <div class="relative" :class="[variant === 'bare' ? 'flex-1 w-full' : 'w-full', label ? 'mt-1.5' : '']">
      <button
        ref="triggerRef"
        type="button"
        class="flex items-center gap-2 text-left"
        :class="variant === 'bare' ? 'select-bare' : 'select-field'"
        aria-haspopup="listbox"
        :aria-expanded="open"
        @click="toggle"
      >
        <avatar-badge v-if="selected?.badgeKey" :badge-key="selected.badgeKey" :size="24" />
        <span class="truncate">{{ selectedLabel }}</span>
      </button>
      <span
        class="i-tabler-chevron-down pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted transition-transform"
        :class="[variant === 'bare' ? 'right-0 text-xs' : 'right-3 text-sm', open ? 'rotate-180' : '']"
      />
    </div>
    <span v-if="error" class="mt-1 block text-xs text-terracotta">{{ error }}</span>
  </label>

  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50" @click="open = false">
      <Transition name="pop">
        <ul
          class="absolute max-h-[260px] overflow-y-auto rounded-card border border-line-light bg-surface-card p-1.5 shadow-card appearance-none"
          :style="panelStyle"
          :class="panelUpward ? 'origin-bottom' : 'origin-top'"
          role="listbox"
          :aria-label="label"
          @click.stop
        >
          <li v-for="o in options" :key="String(o.value)">
            <button
              type="button"
              role="option"
              :aria-selected="o.value === value"
              class="flex w-full items-center gap-2.5 rounded-control border-none px-2.5 py-2 text-left text-sm font-600 cursor-pointer"
              :class="o.value === value ? 'bg-surface-input text-ink' : 'bg-transparent text-body hover:bg-surface-subtle'"
              @click="select(o.value)"
            >
              <avatar-badge v-if="o.badgeKey" :badge-key="o.badgeKey" :size="26" />
              <span class="flex-1 truncate">{{ o.label }}</span>
              <span v-if="o.value === value" class="i-tabler-check text-forest" />
            </button>
          </li>
        </ul>
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
