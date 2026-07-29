<script setup lang="ts">
import type { Participant } from '~~/shared/types'

/**
 * PayerRows - the "several people paid" editor: one row per payer (avatar +
 * who + amount), add/remove, at least one row always stays. Used for both
 * entry types since they share the same `payers` shape.
 */
const payers = defineModel<{ participantId: string; amount: number }[]>({ required: true })
const props = defineProps<{ participants: Participant[] }>()

const usedIds = computed(() => new Set(payers.value.map((p) => p.participantId)))
const unusedParticipants = computed(() => props.participants.filter((p) => !usedIds.value.has(p.id)))

function optionsFor(participantId: string) {
  return props.participants
    .filter((p) => p.id === participantId || !usedIds.value.has(p.id))
    .map((p) => ({ label: p.name, value: p.id }))
}
function badgeOf(participantId: string) {
  return props.participants.find((p) => p.id === participantId)?.badgeKey
}
function setParticipant(i: number, participantId: string) {
  payers.value = payers.value.map((p, idx) => (idx === i ? { ...p, participantId } : p))
}
function setAmount(i: number, amount: number) {
  payers.value = payers.value.map((p, idx) => (idx === i ? { ...p, amount } : p))
}
function addPayer() {
  const next = unusedParticipants.value[0]
  if (!next) return
  payers.value = [...payers.value, { participantId: next.id, amount: 0 }]
}
function removePayer(i: number) {
  if (payers.value.length <= 1) return
  payers.value = payers.value.filter((_, idx) => idx !== i)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="(p, i) in payers"
      :key="i"
      class="flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2"
    >
      <avatar-badge v-if="p.participantId" :badge-key="badgeOf(p.participantId)!" :size="28" />
      <div class="flex-1">
        <core-select
          :model-value="p.participantId"
          :options="optionsFor(p.participantId)"
          variant="bare"
          @update:model-value="setParticipant(i, $event as string)"
        />
      </div>
      <div class="w-28">
        <core-money-input
          :model-value="p.amount"
          variant="compact"
          class="text-right"
          @update:model-value="setAmount(i, $event)"
        />
      </div>
      <button
        v-if="payers.length > 1"
        type="button"
        class="btn-remove"
        aria-label="Remove payer"
        @click="removePayer(i)"
      >
        <span class="i-tabler-x" />
      </button>
    </div>
    <button
      v-if="unusedParticipants.length"
      type="button"
      class="flex items-center justify-center gap-2 rounded-card border border-dashed border-line-medium bg-surface-subtle py-2.5 text-sm font-600 text-forest"
      @click="addPayer"
    >
      <span class="i-tabler-plus" /> Add payer
    </button>
  </div>
</template>
