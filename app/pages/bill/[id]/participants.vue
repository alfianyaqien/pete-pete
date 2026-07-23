<script setup lang="ts">
import { computeBalances } from '~~/shared/settle'
import { formatRupiah, formatSignedCompact } from '~~/shared/format'
import type { Bill, Participant } from '~~/shared/types'

const route = useRoute()
const id = route.params.id as string
const { data: bill, refresh } = await useBill(id)
const { me } = useIdentity(bill)

useHead({ title: 'Participants' })

const balances = computed(() => (bill.value ? computeBalances(bill.value) : []))
const balanceOf = (pid: string) => balances.value.find((b) => b.participantId === pid)
const frontedCount = computed(() => balances.value.filter((b) => b.paid > 0).length)
const takenBadges = computed(() => bill.value?.participants.map((p) => p.badgeKey) ?? [])

function involvedCount(pid: string): number {
  return (bill.value?.entries ?? []).filter(
    (e) =>
      e.payers.some((p) => p.participantId === pid) ||
      (e.type === 'simple'
        ? e.sharers.some((s) => s.participantId === pid)
        : e.items.some((it) => it.orderedBy.includes(pid))),
  ).length
}

const addOpen = ref(false)
const editOpen = ref(false)
const editTarget = ref<Participant | null>(null)
function openEdit(p: Participant) {
  editTarget.value = p
  editOpen.value = true
}
function onDone(updated: Bill) {
  bill.value = updated
}
</script>

<template>
  <template v-if="bill">
    <screen-header back eyebrow="Roster" title="Souls on this trip" @back="navigateTo(`/bill/${id}`)">
      <div class="mt-3 flex items-center gap-3">
        <avatar-stack :participants="bill.participants" :max="7" :size="32" />
        <span class="text-xs text-muted">
          {{ bill.participants.length }} souls · {{ frontedCount }} fronted cash
        </span>
      </div>
    </screen-header>

    <main class="app-col flex-1 overflow-y-auto px-5 pb-28 pt-4">
      <div class="flex flex-col gap-2">
        <div
          v-for="p in bill.participants"
          :key="p.id"
          class="flex items-center gap-3 rounded-card border bg-surface-card px-3 py-2.5"
          :class="p.id === me?.id ? 'border-forest' : 'border-line-light'"
        >
          <avatar-badge :badge-key="p.badgeKey" :size="38" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="text-sm font-600 text-ink">{{ p.name }}</span>
              <span
                v-if="p.id === me?.id"
                class="rounded-chip-sm bg-forest px-1.5 py-0.5 text-[9px] font-700 uppercase text-surface-card"
              >
                You
              </span>
            </div>
            <p class="text-xs text-muted">
              <template v-if="(balanceOf(p.id)?.paid ?? 0) > 0">
                Fronted {{ formatRupiah(balanceOf(p.id)!.paid) }}
              </template>
              <template v-else>In {{ involvedCount(p.id) }} expenses</template>
            </p>
          </div>
          <div class="text-right">
            <p
              class="num text-sm font-600"
              :class="(balanceOf(p.id)?.balance ?? 0) >= 0 ? 'text-forest' : 'text-terracotta'"
            >
              {{ formatSignedCompact(balanceOf(p.id)?.balance ?? 0) }}
            </p>
            <p class="text-[10px] text-muted">
              {{
                (balanceOf(p.id)?.balance ?? 0) > 0
                  ? 'owed back'
                  : (balanceOf(p.id)?.balance ?? 0) < 0
                    ? 'owes'
                    : 'square'
              }}
            </p>
          </div>
          <button type="button" class="border border-line-medium bg-surface-card border-solid rounded-md text-muted" aria-label="Edit" @click="openEdit(p)">
            <span class="i-tabler-pencil text-sm" />
          </button>
        </div>

        <!-- dashed add row -->
        <button
          type="button"
          class="flex items-center justify-center gap-2 rounded-card border border-dashed border-line-medium bg-surface-subtle py-3 text-sm font-600 text-forest"
          @click="addOpen = true"
        >
          <span class="i-tabler-plus" /> Add participant
        </button>
      </div>

      <div
        class="mt-4 flex items-start gap-2 rounded-control border border-line-light bg-surface-subtle px-3 py-3 text-xs leading-relaxed text-body"
      >
        <span class="i-tabler-info-circle mt-0.5 text-ochre" />
        <span>
          Names must be unique — each gets its own travel badge. Removing someone re-balances every
          expense they were in.
        </span>
      </div>

      <made-by class="mt-8" />
    </main>

    <bottom-nav active="souls" :bill-id="id" />

    <add-participant-sheet
      v-model:open="addOpen"
      :bill-id="id"
      :taken="takenBadges"
      @done="onDone"
    />
    <edit-participant-sheet
      v-model:open="editOpen"
      :bill-id="id"
      :participant="editTarget"
      @done="onDone"
    />
  </template>

  <div v-else class="flex flex-1 items-center justify-center p-8 text-muted">Not found.</div>
</template>
