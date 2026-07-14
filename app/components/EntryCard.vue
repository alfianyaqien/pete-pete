<script setup lang="ts">
import type { Entry, Participant } from '~~/shared/types'
import { entryTotalOf } from '~~/shared/stats'

const props = defineProps<{ entry: Entry; participants: Participant[] }>()
defineEmits<{ edit: [] }>()

const nameOf = (id: string) => props.participants.find((p) => p.id === id)?.name ?? '?'
const total = computed(() => entryTotalOf(props.entry))

const payerName = computed(() =>
  props.entry.type === 'simple'
    ? nameOf(props.entry.payers[0]?.participantId)
    : nameOf(props.entry.payerId),
)
const splitWays = computed(() =>
  props.entry.type === 'simple' ? props.entry.sharers.length : 0,
)
const orderers = computed(() => {
  if (props.entry.type !== 'shared_order') return []
  const ids = new Set<string>()
  for (const it of props.entry.items) for (const id of it.orderedBy) ids.add(id)
  return [...ids]
    .map((id) => props.participants.find((p) => p.id === id))
    .filter((p): p is Participant => !!p)
})
</script>

<template>
  <div class="card-parchment flex items-start gap-3 p-3.5">
    <div class="min-w-0 flex-1">
      <span :class="entry.type === 'simple' ? 'chip-pos' : 'chip-warn'">
        {{ entry.type === 'simple' ? 'Simple' : 'Shared order' }}
      </span>
      <h3 class="mt-1.5 font-serif text-[15px] font-600 text-ink">{{ entry.title }}</h3>
      <p v-if="entry.type === 'simple'" class="mt-0.5 text-xs text-muted">
        Paid by <span class="font-600 text-body">{{ payerName }}</span> · split {{ splitWays }} ways
      </p>
      <div v-else class="mt-1 flex items-center gap-2">
        <AvatarStack :participants="orderers" :max="4" :size="20" />
        <span class="text-xs text-muted">Paid by {{ payerName }}</span>
      </div>
    </div>
    <div class="flex flex-col items-end gap-1.5">
      <MoneyText :value="total" class="text-[15px] font-600" />
      <button type="button" class="text-muted" aria-label="Edit" @click="$emit('edit')">
        <span class="i-tabler-pencil text-sm" />
      </button>
    </div>
  </div>
</template>
