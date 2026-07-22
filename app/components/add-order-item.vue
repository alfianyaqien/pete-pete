<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { orderItemSchema } from '~~/shared/schemas'
import { formatRupiah } from '~~/shared/format'
import type { Participant } from '~~/shared/types'

export interface OrderItemDraft {
  name: string
  qty: number
  priceEach: number
  orderedBy: string[]
}

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{ participants: Participant[] }>()
const emit = defineEmits<{ save: [OrderItemDraft] }>()

const { handleSubmit, values, setFieldValue, resetForm } = useForm<OrderItemDraft>({
  validationSchema: toTypedSchema(orderItemSchema.omit({ id: true })),
  initialValues: { name: '', qty: 1, priceEach: 0, orderedBy: [] },
})

watch(open, (o) => {
  if (o) resetForm({ values: { name: '', qty: 1, priceEach: 0, orderedBy: [] } })
})

function setQty(n: number) {
  setFieldValue('qty', Math.max(1, n))
}
function toggle(id: string) {
  const next = [...values.orderedBy]
  const i = next.indexOf(id)
  if (i >= 0) next.splice(i, 1)
  else next.push(id)
  setFieldValue('orderedBy', next)
}
const allChecked = computed(() => values.orderedBy.length === props.participants.length)
function checkAll() {
  setFieldValue('orderedBy', allChecked.value ? [] : props.participants.map((p) => p.id))
}

const lineTotal = computed(() => (values.qty || 0) * (values.priceEach || 0))
const canSave = computed(() => values.name.trim().length > 0 && values.orderedBy.length > 0)

const save = handleSubmit((v) => {
  emit('save', { ...v, name: v.name.trim(), orderedBy: [...v.orderedBy] })
  open.value = false
})
</script>

<template>
  <core-modal v-model:open="open" title="Add order item">
    <form @submit.prevent="save">
      <core-input name="name" label="Item" placeholder="Ayam bakar" />

      <div class="mt-3 flex gap-3">
        <div>
          <span class="eyebrow">Qty</span>
          <div
            class="mt-1.5 flex items-center gap-2 rounded-control border border-line-light bg-surface-input px-2 py-1.5"
          >
            <button type="button" class="text-forest" @click="setQty(values.qty - 1)">
              <span class="i-tabler-minus" />
            </button>
            <span class="num w-6 text-center font-600">{{ values.qty }}</span>
            <button type="button" class="text-forest" @click="setQty(values.qty + 1)">
              <span class="i-tabler-plus" />
            </button>
          </div>
        </div>
        <div class="flex-1">
          <core-money-input name="priceEach" label="Price each" placeholder="45000" />
        </div>
      </div>

      <div class="mb-2 mt-4 flex items-center justify-between">
        <span class="eyebrow">Ordered by</span>
        <button type="button" class="text-xs font-600 text-forest" @click="checkAll">
          <span class="i-tabler-checks" /> {{ allChecked ? 'Clear' : 'Check all' }}
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="p in participants"
          :key="p.id"
          type="button"
          class="flex items-center gap-1.5 rounded-control border px-2 py-1.5 text-xs font-600 transition-colors"
          :class="
            values.orderedBy.includes(p.id)
              ? 'border-forest bg-forest text-white'
              : 'border-line-light bg-surface-card text-body'
          "
          @click="toggle(p.id)"
        >
          <avatar-badge :badge-key="p.badgeKey" :size="22" />
          <span class="truncate">{{ p.name }}</span>
        </button>
      </div>

      <div class="rule-double mt-4 flex items-center justify-between pt-3">
        <span class="text-sm text-body">Line total · split {{ values.orderedBy.length }} ways</span>
        <span class="num font-600">{{ formatRupiah(lineTotal) }}</span>
      </div>

      <div class="mt-4 flex gap-2">
        <core-button variant="ghost" block @click="open = false">Cancel</core-button>
        <core-button type="submit" block :disabled="!canSave">Save item</core-button>
      </div>
    </form>
  </core-modal>
</template>
