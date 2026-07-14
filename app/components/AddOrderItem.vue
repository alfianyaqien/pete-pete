<script setup lang="ts">
import type { Participant } from '~~/shared/types'
import { formatRupiah } from '~~/shared/format'

export interface OrderItemDraft {
  name: string
  qty: number
  priceEach: number
  orderedBy: string[]
}

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{ participants: Participant[] }>()
const emit = defineEmits<{ save: [OrderItemDraft] }>()

const draft = reactive<OrderItemDraft>({ name: '', qty: 1, priceEach: 0, orderedBy: [] })

watch(open, (o) => {
  if (o) Object.assign(draft, { name: '', qty: 1, priceEach: 0, orderedBy: [] })
})

function toggle(id: string) {
  const i = draft.orderedBy.indexOf(id)
  if (i >= 0) draft.orderedBy.splice(i, 1)
  else draft.orderedBy.push(id)
}
const allChecked = computed(() => draft.orderedBy.length === props.participants.length)
function checkAll() {
  draft.orderedBy = allChecked.value ? [] : props.participants.map((p) => p.id)
}

const lineTotal = computed(() => draft.qty * draft.priceEach)
const valid = computed(
  () => draft.name.trim().length > 0 && draft.qty > 0 && draft.orderedBy.length > 0,
)

function save() {
  if (!valid.value) return
  emit('save', {
    name: draft.name.trim(),
    qty: draft.qty,
    priceEach: draft.priceEach,
    orderedBy: [...draft.orderedBy],
  })
  open.value = false
}
</script>

<template>
  <BottomSheet v-model:open="open" title="Add order item">
    <label class="block">
      <span class="eyebrow">Item</span>
      <input
        v-model="draft.name"
        placeholder="Ayam bakar"
        class="mt-1.5 w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 text-ink focus:border-forest focus:outline-none"
      />
    </label>

    <div class="mt-3 flex gap-3">
      <div>
        <span class="eyebrow">Qty</span>
        <div class="mt-1.5 flex items-center gap-2 rounded-control bg-surface-input px-2 py-1.5">
          <button type="button" class="text-forest" @click="draft.qty = Math.max(1, draft.qty - 1)">
            <span class="i-tabler-minus" />
          </button>
          <span class="num w-6 text-center font-600">{{ draft.qty }}</span>
          <button type="button" class="text-forest" @click="draft.qty++">
            <span class="i-tabler-plus" />
          </button>
        </div>
      </div>
      <label class="flex-1">
        <span class="eyebrow">Price each</span>
        <input
          v-model.number="draft.priceEach"
          type="number"
          min="0"
          placeholder="45000"
          class="mt-1.5 w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 text-ink focus:border-forest focus:outline-none"
        />
      </label>
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
          draft.orderedBy.includes(p.id)
            ? 'border-forest bg-forest text-white'
            : 'border-line-light bg-surface-card text-body'
        "
        @click="toggle(p.id)"
      >
        <AvatarBadge :badge-key="p.badgeKey" :size="18" />
        <span class="truncate">{{ p.name }}</span>
      </button>
    </div>

    <div class="rule-double mt-4 flex items-center justify-between pt-3">
      <span class="text-sm text-body">
        Line total · split {{ draft.orderedBy.length || 0 }} ways
      </span>
      <span class="num font-600">{{ formatRupiah(lineTotal) }}</span>
    </div>

    <div class="mt-4 flex gap-2">
      <button type="button" class="btn-ghost flex-1" @click="open = false">Cancel</button>
      <button type="button" class="btn-forest flex-1" :disabled="!valid" @click="save">
        Save item
      </button>
    </div>
  </BottomSheet>
</template>
