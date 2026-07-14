<script setup lang="ts">
import type { Bill, BadgeKey, Participant } from '~~/shared/types'

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{ billId: string; participant: Participant | null }>()
const emit = defineEmits<{ done: [Bill] }>()

const draft = reactive({ name: '', badgeKey: 'ibex' as BadgeKey })
const error = ref('')
const saving = ref(false)

watch(
  [open, () => props.participant],
  () => {
    if (open.value && props.participant) {
      draft.name = props.participant.name
      draft.badgeKey = props.participant.badgeKey
      error.value = ''
    }
  },
  { immediate: true },
)

async function save() {
  if (!props.participant) return
  if (!draft.name.trim()) {
    error.value = 'Name is required'
    return
  }
  saving.value = true
  error.value = ''
  try {
    const bill = await $fetch<Bill>(
      `/api/bills/${props.billId}/participants/${props.participant.id}`,
      { method: 'PATCH', body: { name: draft.name.trim(), badgeKey: draft.badgeKey } },
    )
    emit('done', bill)
    open.value = false
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Could not save'
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!props.participant) return
  saving.value = true
  try {
    const bill = await $fetch<Bill>(
      `/api/bills/${props.billId}/participants/${props.participant.id}`,
      { method: 'DELETE' },
    )
    emit('done', bill)
    open.value = false
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Could not remove'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <BottomSheet v-model:open="open" title="Edit participant">
    <label class="block">
      <span class="eyebrow">Name</span>
      <div class="relative mt-1.5">
        <input
          v-model="draft.name"
          class="w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 pr-9 text-ink focus:border-forest focus:outline-none"
        />
        <span class="i-tabler-pencil absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
      </div>
    </label>

    <div class="mb-2 mt-4 flex items-center justify-between">
      <span class="eyebrow">Trail badge</span>
      <span class="text-xs text-muted">{{ participant?.name }} · current</span>
    </div>
    <BadgePicker v-model="draft.badgeKey" />

    <button
      type="button"
      class="mt-4 flex w-full items-center justify-center gap-2 rounded-control border border-neg-border bg-neg-fill py-2.5 text-sm font-600 text-terracotta"
      :disabled="saving"
      @click="remove"
    >
      <span class="i-tabler-trash" /> Remove from trip
    </button>

    <p v-if="error" class="chip-neg mt-3">{{ error }}</p>

    <div class="mt-4 flex gap-2">
      <button type="button" class="btn-ghost flex-1" @click="open = false">Cancel</button>
      <button type="button" class="btn-forest flex-1" :disabled="saving" @click="save">
        Save changes
      </button>
    </div>
  </BottomSheet>
</template>
