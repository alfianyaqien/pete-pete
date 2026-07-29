<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { paymentInputSchema } from '~~/shared/schemas'
import type { Bill, Participant } from '~~/shared/types'

/**
 * Record a real money transfer between two people to settle up. The payment is a
 * first-class ledger record, so the settle screen recomputes what is still left
 * to pay (see shared/settle.ts). `prefill` lets a suggested transfer open this
 * with from/to/amount already filled (e.g. for a partial payment).
 */
const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{
  billId: string
  participants: Participant[]
  prefill?: { from: string; to: string; amount: number } | null
}>()
const emit = defineEmits<{ done: [Bill] }>()

interface Shape {
  from: string
  to: string
  amount: number
  note?: string
}

const { handleSubmit, resetForm, isSubmitting } = useForm<Shape>({
  validationSchema: toTypedSchema(paymentInputSchema),
  initialValues: { from: '', to: '', amount: 0, note: '' },
})

const serverError = ref('')
const toast = useToast()

const options = computed(() =>
  props.participants.map((p) => ({ label: p.name, value: p.id, badgeKey: p.badgeKey })),
)

watch(open, (o) => {
  if (!o) return
  serverError.value = ''
  resetForm({
    values: {
      from: props.prefill?.from ?? '',
      to: props.prefill?.to ?? '',
      amount: props.prefill?.amount ?? 0,
      note: '',
    },
  })
})

const submit = handleSubmit(async (v) => {
  serverError.value = ''
  try {
    const bill = await $fetch<Bill>(`/api/bills/${props.billId}/payments`, {
      method: 'POST',
      body: v,
    })
    toast.success('Payment recorded')
    emit('done', bill)
    open.value = false
  } catch (e: any) {
    serverError.value = e?.data?.statusMessage || 'Could not record payment'
    toast.error('Couldn’t record payment', serverError.value)
  }
})
</script>

<template>
  <core-modal v-model:open="open" title="Record a payment">
    <form @submit.prevent="submit">
      <div class="flex items-end gap-2">
        <core-select name="from" label="From (paid)" :options="options" />
        <span class="i-tabler-arrow-right mb-2.5 shrink-0 text-muted" />
        <core-select name="to" label="To (received)" :options="options" />
      </div>

      <div class="mt-3">
        <core-money-input name="amount" label="Amount" placeholder="50000" />
      </div>

      <div class="mt-3">
        <core-input name="note" label="Note (optional)" placeholder="cash, transfer, ..." />
      </div>

      <p v-if="serverError" class="chip-neg mt-3">{{ serverError }}</p>

      <div class="mt-4 flex gap-2">
        <core-button variant="ghost" block @click="open = false">Cancel</core-button>
        <core-button type="submit" block :loading="isSubmitting">Record payment</core-button>
      </div>
    </form>
  </core-modal>
</template>
