<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { participantInputSchema } from '~~/shared/schemas'
import type { Bill, Participant } from '~~/shared/types'

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{ billId: string; participant: Participant | null }>()
const emit = defineEmits<{ done: [Bill] }>()

const { handleSubmit, values, setFieldValue, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(participantInputSchema),
  initialValues: { name: '', badgeKey: 'ibex' },
})

const serverError = ref('')
const removing = ref(false)
const toast = useToast()

watch(
  [open, () => props.participant],
  () => {
    if (open.value && props.participant) {
      resetForm({ values: { name: props.participant.name, badgeKey: props.participant.badgeKey } })
      serverError.value = ''
    }
  },
  { immediate: true },
)

const submit = handleSubmit(async (v) => {
  if (!props.participant) return
  serverError.value = ''
  try {
    const bill = await $fetch<Bill>(
      `/api/bills/${props.billId}/participants/${props.participant.id}`,
      { method: 'PATCH', body: v },
    )
    toast.success('Participant saved', v.name)
    emit('done', bill)
    open.value = false
  } catch (e: any) {
    serverError.value = e?.data?.statusMessage || 'Could not save'
    toast.error('Couldn’t save participant', serverError.value)
  }
})

async function remove() {
  if (!props.participant) return
  removing.value = true
  try {
    const bill = await $fetch<Bill>(
      `/api/bills/${props.billId}/participants/${props.participant.id}`,
      { method: 'DELETE' },
    )
    toast.success('Removed from trip', props.participant.name)
    emit('done', bill)
    open.value = false
  } catch (e: any) {
    serverError.value = e?.data?.statusMessage || 'Could not remove'
    toast.error('Couldn’t remove participant', serverError.value)
  } finally {
    removing.value = false
  }
}
</script>

<template>
  <core-modal v-model:open="open" title="Edit participant">
    <form @submit.prevent="submit">
      <core-input name="name" label="Name" style="padding-right: 2.25rem">
        <template #suffix>
          <span
            class="i-tabler-pencil pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          />
        </template>
      </core-input>

      <div class="mb-2 mt-4 flex items-center justify-between">
        <span class="eyebrow">Travel badge</span>
        <span class="text-xs text-muted">{{ participant?.name }} · current</span>
      </div>
      <badge-picker
        :model-value="values.badgeKey"
        @update:model-value="setFieldValue('badgeKey', $event)"
      />

      <core-button variant="danger" block class="mt-4" :loading="removing" @click="remove">
        <span class="i-tabler-trash" /> Remove from trip
      </core-button>

      <p v-if="serverError" class="chip-neg mt-3">{{ serverError }}</p>

      <div class="mt-4 flex gap-2">
        <core-button variant="ghost" block @click="open = false">Cancel</core-button>
        <core-button type="submit" block :loading="isSubmitting">Save changes</core-button>
      </div>
    </form>
  </core-modal>
</template>
