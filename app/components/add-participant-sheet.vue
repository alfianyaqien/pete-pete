<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { participantInputSchema, BADGE_KEYS } from '~~/shared/schemas'
import { nextBadge } from '~~/shared/badges'
import type { Bill, BadgeKey } from '~~/shared/types'

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{ billId: string; taken: BadgeKey[] }>()
const emit = defineEmits<{ done: [Bill] }>()

// Form state is owned by VeeValidate + Zod — no local refs for field values.
const { handleSubmit, values, setFieldValue, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(participantInputSchema),
  initialValues: { name: '', badgeKey: BADGE_KEYS[0] as BadgeKey },
})

const serverError = ref('')
const toast = useToast()

watch(open, (o) => {
  if (o) {
    resetForm({ values: { name: '', badgeKey: nextBadge(props.taken) } })
    serverError.value = ''
  }
})

function dice() {
  const pool = BADGE_KEYS.filter((k) => k !== values.badgeKey)
  setFieldValue('badgeKey', pool[Math.floor(Math.random() * pool.length)])
}

const submit = handleSubmit(async (v) => {
  serverError.value = ''
  try {
    const bill = await $fetch<Bill>(`/api/bills/${props.billId}/participants`, {
      method: 'POST',
      body: v,
    })
    toast.success('Participant added', v.name)
    emit('done', bill)
    open.value = false
  } catch (e: any) {
    serverError.value = e?.data?.statusMessage || 'Could not add participant'
    toast.error('Couldn’t add participant', serverError.value)
  }
})
</script>

<template>
  <core-modal v-model:open="open" title="Add participant">
    <form @submit.prevent="submit">
      <core-input name="name" label="Name" placeholder="Rama" @keydown.enter.prevent="submit" />

      <div class="mb-2 mt-4 flex items-center justify-between">
        <span class="eyebrow">Travel badge</span>
        <button
          type="button"
          class="flex items-center gap-1 text-xs font-600 text-muted"
          @click="dice"
        >
          <span class="i-tabler-dice-5" /> Auto-picked · tap to change
        </button>
      </div>
      <badge-picker
        :model-value="values.badgeKey"
        @update:model-value="setFieldValue('badgeKey', $event)"
      />

      <p v-if="serverError" class="chip-neg mt-3">{{ serverError }}</p>

      <div class="mt-4 flex gap-2">
        <core-button variant="ghost" block @click="open = false">Cancel</core-button>
        <core-button type="submit" block :loading="isSubmitting">Add to trip</core-button>
      </div>
    </form>
  </core-modal>
</template>
