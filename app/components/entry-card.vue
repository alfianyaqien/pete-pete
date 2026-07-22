<script setup lang="ts">
import type { Entry, Participant } from '~~/shared/types'
import { entryTotalOf } from '~~/shared/stats'

const props = defineProps<{ entry: Entry; participants: Participant[] }>()
defineEmits<{ open: [] }>()

const nameOf = (id: string) => props.participants.find((p) => p.id === id)?.name ?? '?'
const total = computed(() => entryTotalOf(props.entry))

const payerName = computed(() => nameOf(props.entry.payers[0]?.participantId ?? ''))
const splitWays = computed(() =>
  props.entry.type === 'simple' ? props.entry.sharers.length : 0,
)

const peopleOf = (ids: string[]) =>
  ids
    .map((id) => props.participants.find((p) => p.id === id))
    .filter((p): p is Participant => !!p)

/** Who this expense involves: sharers for a Single, orderers for a Bill. */
const people = computed(() => {
  if (props.entry.type === 'simple') {
    return peopleOf(props.entry.sharers.map((s) => s.participantId))
  }
  const ids = new Set<string>()
  for (const it of props.entry.items) for (const id of it.orderedBy) ids.add(id)
  return peopleOf([...ids])
})
</script>

<template>
  <div
    class="card-parchment flex cursor-pointer items-start gap-3 p-3.5 text-left"
    role="button"
    tabindex="0"
    @click="$emit('open')"
    @keydown.enter="$emit('open')"
    @keydown.space.prevent="$emit('open')"
  >
    <div class="min-w-0 flex-1">
      <h3 class="font-serif text-[15px] font-600 text-ink">{{ entry.title }}</h3>
      <p class="mt-0.5 text-xs text-muted">
        Paid by <span class="font-600 text-body">{{ payerName }}</span>
        <template v-if="entry.type === 'simple'"> · split {{ splitWays }} ways</template>
      </p>
      <avatar-stack :participants="people" :max="5" :size="20" class="mt-1.5" />
    </div>
    <!-- the whole card opens the detail sheet; the chevron just signals that -->
    <div class="flex flex-none items-center gap-1.5 self-center">
      <money-text :value="total" class="text-[15px] font-600" />
      <span class="i-tabler-chevron-right text-sm text-muted" />
    </div>
  </div>
</template>
