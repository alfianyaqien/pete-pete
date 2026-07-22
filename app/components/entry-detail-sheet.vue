<script setup lang="ts">
import type { Entry, Participant } from '~~/shared/types'
import { allocateEntry, itemsSubtotal } from '~~/shared/settle'
import { formatRupiah, formatDateMedium } from '~~/shared/format'

/**
 * Read-only summary of one expense — opened from the entry list so details are
 * visible without entering the edit form. Shows who paid, the per-person split,
 * and (for a Bill) the itemised order with who ordered what.
 */
const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{
  entry: Entry | null
  participants: Participant[]
  deleting?: boolean
  error?: string
}>()
defineEmits<{ edit: []; delete: [] }>()

// Deleting is irreversible and there's no undo, so require a second tap.
const confirming = ref(false)
watch([open, () => props.entry], () => (confirming.value = false))

const nameOf = (id: string) => props.participants.find((p) => p.id === id)?.name ?? '?'
const personOf = (id: string) => props.participants.find((p) => p.id === id)
const peopleOf = (ids: string[]) =>
  ids.map(personOf).filter((p): p is Participant => !!p)

const typeLabel = computed(() => (props.entry?.type === 'simple' ? 'Single' : 'Bill'))

const alloc = computed(() =>
  props.entry ? allocateEntry(props.entry) : { shares: {}, payments: {}, total: 0 },
)

/** Per-person cost share, biggest first. */
const shareRows = computed(() =>
  Object.entries(alloc.value.shares)
    .map(([id, amount]) => ({ id, amount }))
    .sort((a, b) => b.amount - a.amount),
)

const subtotal = computed(() =>
  props.entry?.type === 'shared_order' ? itemsSubtotal(props.entry) : 0,
)
const taxAmount = computed(() =>
  props.entry?.type === 'shared_order'
    ? Math.round((subtotal.value * props.entry.fees.taxPercent) / 100)
    : 0,
)
</script>

<template>
  <core-modal v-model:open="open" :title="entry?.title ?? 'Expense'">
    <div v-if="entry" class="max-h-[70vh] overflow-y-auto">
      <div class="flex items-center justify-between gap-3">
        <span class="text-xs text-muted">{{ typeLabel }} · {{ formatDateMedium(entry.date) }}</span>
        <money-text :value="alloc.total" class="text-xl font-600" />
      </div>

      <!-- who paid -->
      <p class="eyebrow mt-4">Paid by</p>
      <div class="mt-1.5 flex flex-col gap-1.5">
        <div
          v-for="p in entry.payers"
          :key="p.participantId"
          class="flex items-center gap-2.5 rounded-card border border-line-light bg-surface-card px-3 py-2"
        >
          <avatar-badge
            v-if="personOf(p.participantId)"
            :badge-key="personOf(p.participantId)!.badgeKey"
            :size="24"
          />
          <span class="flex-1 text-sm font-600">{{ nameOf(p.participantId) }}</span>
          <money-text :value="p.amount" class="text-sm" />
        </div>
      </div>

      <!-- itemised order -->
      <template v-if="entry.type === 'shared_order'">
        <p class="eyebrow mt-4">Orders</p>
        <div class="mt-1.5 flex flex-col gap-2">
          <div
            v-for="it in entry.items"
            :key="it.id"
            class="rounded-card border border-line-light bg-surface-card px-3 py-2"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="text-sm font-600">{{ it.name }} ×{{ it.qty }}</span>
              <money-text :value="it.qty * it.priceEach" class="text-sm" />
            </div>
            <avatar-stack
              :participants="peopleOf(it.orderedBy)"
              :max="6"
              :size="26"
              class="mt-1.5"
            />
          </div>
        </div>

        <div class="mt-3 flex flex-col gap-1 rounded-card bg-surface-subtle px-3 py-2 text-xs">
          <div class="flex justify-between"><span>Subtotal</span><span class="num">{{ formatRupiah(subtotal) }}</span></div>
          <div v-if="entry.fees.taxPercent" class="flex justify-between">
            <span>Tax ({{ entry.fees.taxPercent }}%)</span><span class="num">{{ formatRupiah(taxAmount) }}</span>
          </div>
          <div v-if="entry.fees.service" class="flex justify-between"><span>Service</span><span class="num">{{ formatRupiah(entry.fees.service) }}</span></div>
          <div v-if="entry.fees.other" class="flex justify-between"><span>Other</span><span class="num">{{ formatRupiah(entry.fees.other) }}</span></div>
          <div v-if="entry.discount" class="flex justify-between text-terracotta">
            <span>Discount</span><span class="num">−{{ formatRupiah(entry.discount) }}</span>
          </div>
        </div>
      </template>

      <!-- per-person split -->
      <p class="eyebrow mt-4">
        Split · {{ shareRows.length }} {{ shareRows.length === 1 ? 'person' : 'people' }}
      </p>
      <div class="mt-1.5 flex flex-col gap-1.5">
        <div
          v-for="row in shareRows"
          :key="row.id"
          class="flex items-center gap-2.5 rounded-card border border-line-light bg-surface-card px-3 py-2"
        >
          <avatar-badge v-if="personOf(row.id)" :badge-key="personOf(row.id)!.badgeKey" :size="24" />
          <span class="flex-1 text-sm">{{ nameOf(row.id) }}</span>
          <money-text :value="row.amount" class="text-sm font-600" />
        </div>
      </div>

      <p v-if="error" class="chip-neg mt-4">{{ error }}</p>

      <template v-if="!confirming">
        <core-button variant="danger" block class="mt-4" @click="confirming = true">
          <span class="i-tabler-trash" /> Delete expense
        </core-button>
        <div class="mt-2 flex gap-2">
          <core-button variant="ghost" block @click="open = false">Close</core-button>
          <core-button block @click="$emit('edit')">
            <span class="i-tabler-pencil" /> Edit
          </core-button>
        </div>
      </template>
      <template v-else>
        <p class="mt-4 text-center text-xs text-body">
          Delete <b>{{ entry.title }}</b>? This can't be undone.
        </p>
        <div class="mt-2 flex gap-2">
          <core-button variant="ghost" block @click="confirming = false">Cancel</core-button>
          <core-button variant="danger" block :loading="deleting" @click="$emit('delete')">
            Delete
          </core-button>
        </div>
      </template>
    </div>
  </core-modal>
</template>
