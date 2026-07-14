<script setup lang="ts">
import type { Bill, BadgeKey } from '~~/shared/types'
import { BADGE_KEYS } from '~~/shared/schemas'
import { nextBadge } from '~~/shared/badges'

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{ billId: string; taken: BadgeKey[] }>()
const emit = defineEmits<{ done: [Bill] }>()

const draft = reactive({ name: '', badgeKey: BADGE_KEYS[0] as BadgeKey })
const error = ref('')
const saving = ref(false)

watch(open, (o) => {
  if (o) {
    draft.name = ''
    draft.badgeKey = nextBadge(props.taken)
    error.value = ''
  }
})

function dice() {
  const pool = BADGE_KEYS.filter((k) => k !== draft.badgeKey)
  draft.badgeKey = pool[Math.floor(Math.random() * pool.length)]
}

async function add() {
  if (!draft.name.trim()) {
    error.value = 'Name is required'
    return
  }
  saving.value = true
  error.value = ''
  try {
    const bill = await $fetch<Bill>(`/api/bills/${props.billId}/participants`, {
      method: 'POST',
      body: { name: draft.name.trim(), badgeKey: draft.badgeKey },
    })
    emit('done', bill)
    open.value = false
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Could not add participant'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <BottomSheet v-model:open="open" title="Add participant">
    <label class="block">
      <span class="eyebrow">Name</span>
      <input
        v-model="draft.name"
        placeholder="Rama"
        class="mt-1.5 w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 text-ink focus:border-forest focus:outline-none"
        @keydown.enter.prevent="add"
      />
    </label>

    <div class="mb-2 mt-4 flex items-center justify-between">
      <span class="eyebrow">Trail badge</span>
      <button type="button" class="flex items-center gap-1 text-xs font-600 text-muted" @click="dice">
        <span class="i-tabler-dice-5" /> Auto-picked · tap to change
      </button>
    </div>
    <BadgePicker v-model="draft.badgeKey" />

    <p v-if="error" class="chip-neg mt-3">{{ error }}</p>

    <div class="mt-4 flex gap-2">
      <button type="button" class="btn-ghost flex-1" @click="open = false">Cancel</button>
      <button type="button" class="btn-forest flex-1" :disabled="saving" @click="add">
        Add to trip
      </button>
    </div>
  </BottomSheet>
</template>
