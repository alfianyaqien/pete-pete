<script setup lang="ts">
import type { Participant } from '~~/shared/types'

/**
 * "You're <name>" identity picker. The option list is TELEPORTED and
 * fixed-positioned off the trigger's own rect - the hero panel it sits in is
 * `overflow-hidden` (for the rounded contour art), which would otherwise clip
 * an absolutely-positioned dropdown.
 */
const props = withDefaults(
  defineProps<{ participants: Participant[]; modelValue: string | null; tone?: 'dark' | 'light' }>(),
  { tone: 'dark' },
)
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const open = ref(false)
// No default: unset stays unset so the viewer must deliberately pick.
const current = computed(() => props.participants.find((p) => p.id === props.modelValue) ?? null)

const triggerRef = ref<HTMLButtonElement>()
const panelStyle = ref<Record<string, string>>({})
const panelUpward = ref(false)

function reposition() {
  const el = triggerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const gap = 6
  const estHeight = Math.min(280, props.participants.length * 44 + 12)
  const width = Math.min(Math.max(rect.width, 200), window.innerWidth - 16)
  const upward = rect.bottom + gap + estHeight > window.innerHeight && rect.top > estHeight

  panelUpward.value = upward
  panelStyle.value = {
    // right-align to the trigger, clamped into the viewport
    left: `${Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8))}px`,
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

function pick(id: string) {
  emit('update:modelValue', id)
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
  <button
    ref="triggerRef"
    type="button"
    class="inline-flex items-center gap-1.5 rounded-pill py-1.5 pl-1.5 pr-2.5 text-sm font-600"
    :class="[
      tone === 'dark'
        ? 'bg-white/12 text-surface-card'
        : 'border bg-surface-card text-ink',
      // when unset (light tone), nudge with a dashed ochre ring
      current || tone === 'dark' ? 'border-line-light' : 'border-dashed border-ochre text-ochre',
    ]"
    aria-haspopup="listbox"
    :aria-expanded="open"
    @click="toggle"
  >
    <avatar-badge v-if="current" :badge-key="current.badgeKey" :size="24" />
    <span v-else class="i-tabler-user-question ml-0.5 text-base" />
    <span>{{ current ? `You're ${current.name}` : 'Who are you?' }}</span>
    <span class="i-tabler-chevron-down text-xs transition-transform" :class="open ? 'rotate-180' : ''" />
  </button>

  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[60]" @click="open = false">
      <Transition name="pop">
        <div
          class="absolute max-h-[280px] overflow-y-auto rounded-card border border-line-light bg-surface-card p-1.5 text-ink shadow-card"
          :style="panelStyle"
          :class="panelUpward ? 'origin-bottom' : 'origin-top'"
          role="listbox"
          aria-label="Who are you?"
          @click.stop
        >
          <p class="px-2 pb-1 pt-0.5 text-[10px] font-700 uppercase tracking-wide text-muted">
            You're on this trip as
          </p>
          <button
            v-for="p in participants"
            :key="p.id"
            type="button"
            role="option"
            :aria-selected="p.id === current?.id"
            class="flex w-full items-center gap-2.5 rounded-control border-none px-2 py-2 text-left text-sm cursor-pointer"
            :class="
              p.id === current?.id
                ? 'bg-surface-input font-600 text-ink'
                : 'bg-transparent text-body hover:bg-surface-subtle'
            "
            @click="pick(p.id)"
          >
            <avatar-badge :badge-key="p.badgeKey" :size="26" />
            <span class="flex-1 truncate">{{ p.name }}</span>
            <span v-if="p.id === current?.id" class="i-tabler-check text-forest" />
          </button>
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
