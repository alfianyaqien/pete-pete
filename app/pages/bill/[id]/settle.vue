<script setup lang="ts">
import { settleBill } from '~~/shared/settle'
import { billStats } from '~~/shared/stats'

const route = useRoute()
const id = route.params.id as string
const { data: bill } = await useBill(id)
const { me, setMe } = useIdentity(bill)

const stats = computed(() => (bill.value ? billStats(bill.value) : null))

useHead({ title: 'Settle Up' })

const result = computed(() =>
  bill.value ? settleBill(bill.value) : { balances: [], transfers: [] },
)
const balances = computed(() =>
  [...result.value.balances].sort((a, b) => b.balance - a.balance),
)
const transfers = computed(() => result.value.transfers)

const nameOf = (pid: string) => bill.value?.participants.find((p) => p.id === pid)?.name ?? '?'
const badgeOf = (pid: string) => bill.value?.participants.find((p) => p.id === pid)?.badgeKey

const myBalance = computed(() => result.value.balances.find((b) => b.participantId === me.value?.id))
const owedBack = computed(() => Math.max(0, myBalance.value?.balance ?? 0))
const iOwe = computed(() => Math.max(0, -(myBalance.value?.balance ?? 0)))
const peopleOweMe = computed(() => transfers.value.filter((t) => t.to === me.value?.id).length)

const fronters = computed(() =>
  result.value.balances.filter((b) => b.paid > 0).map((b) => nameOf(b.participantId)),
)
const frontedBy = computed(() =>
  fronters.value.length
    ? `${fronters.value[0]}${fronters.value.length > 1 ? ` & ${fronters.value.length - 1}` : ''}`
    : '—',
)

const shareOpen = ref(false)
</script>

<template>
  <template v-if="bill">
    <screen-header back eyebrow="Settle up" :title="bill.title" @back="navigateTo(`/bill/${id}`)">
      <div class="rule-double mt-3 flex items-center justify-between pt-3">
        <span class="eyebrow">Total tally</span>
        <money-text :value="stats?.total ?? 0" class="text-xl font-600" />
      </div>
      <p class="mt-1 text-xs text-muted">fronted by {{ frontedBy }}</p>
    </screen-header>

    <main class="app-col flex-1 overflow-y-auto px-5 pb-28 pt-4">
      <!-- Your standing -->
      <hero-panel>
        <div class="flex items-center justify-between">
          <p class="text-[10px] font-600 uppercase tracking-[.1em]" style="color: #9dc2ae">
            Your standing here
          </p>
          <identity-chip
            :participants="bill.participants"
            :model-value="me?.id ?? null"
            @update:model-value="setMe"
          />
        </div>
        <div class="mt-3 flex gap-5">
          <div>
            <p class="text-[11px]" style="color: #9dc2ae">You're owed back</p>
            <p class="text-xl font-700" style="color: #e7b968"><money-text :value="owedBack" /></p>
          </div>
          <div>
            <p class="text-[11px]" style="color: #9dc2ae">You owe</p>
            <p class="text-xl font-700" style="color: #9ddfb6"><money-text :value="iOwe" /></p>
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2 text-[11px] font-600">
          <span class="rounded-chip-sm bg-white/12 px-2 py-1">{{ peopleOweMe }} people owe you</span>
          <span class="rounded-chip-sm bg-white/12 px-2 py-1">
            fronted <money-text :value="myBalance?.paid ?? 0" />
          </span>
        </div>
      </hero-panel>

      <!-- Where everyone stands -->
      <p class="eyebrow mb-2 mt-5">Where everyone stands</p>
      <div class="card-parchment overflow-hidden">
        <div class="grid grid-cols-[1fr_auto_auto] gap-x-4 px-4 py-2 text-[10px] uppercase tracking-wide text-muted">
          <span>Person</span>
          <span class="text-right">Paid</span>
          <span class="text-right">Balance</span>
        </div>
        <div
          v-for="b in balances"
          :key="b.participantId"
          class="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-t border-line-faint px-4 py-2.5"
        >
          <div class="flex items-center gap-2">
            <avatar-badge :badge-key="badgeOf(b.participantId)!" :size="24" />
            <span class="text-sm">{{ nameOf(b.participantId) }}</span>
          </div>
          <money-text :value="b.paid" :prefix="false" class="text-right text-sm" />
          <money-text :value="b.balance" :prefix="false" signed class="text-right text-sm font-600" />
        </div>
      </div>

      <!-- Who settles whom -->
      <p class="eyebrow mb-2 mt-5">Who settles whom</p>
      <p class="mb-2 text-sm text-body">
        {{ transfers.length }} transfer{{ transfers.length === 1 ? '' : 's' }} clear{{
          transfers.length === 1 ? 's' : ''
        }}
        everyone
      </p>
      <div class="flex flex-col gap-2">
        <div
          v-for="(t, i) in transfers"
          :key="i"
          class="flex items-center gap-2 rounded-card border border-line-light bg-surface-card px-3 py-2.5"
        >
          <avatar-badge :badge-key="badgeOf(t.from)!" :size="26" />
          <span class="text-sm font-600">{{ nameOf(t.from) }}</span>
          <span class="mx-1 flex-1 border-t border-dashed border-line-medium" />
          <span class="i-tabler-arrow-right text-muted" />
          <span class="text-sm font-600">{{ nameOf(t.to) }}</span>
          <avatar-badge :badge-key="badgeOf(t.to)!" :size="26" />
          <money-text :value="t.amount" :prefix="false" class="ml-2 text-sm font-600" />
        </div>
        <p v-if="!transfers.length" class="py-4 text-center text-sm text-muted">
          Everyone is square — nothing to settle.
        </p>
      </div>

      <!-- actions -->
      <div class="mt-6 flex gap-2">
        <core-button class="flex-1" @click="shareToWhatsApp(settlementRecap(bill, transfers))">
          <span class="i-tabler-brand-whatsapp" /> Share
        </core-button>
        <core-button variant="ghost" class="flex-1" @click="shareOpen = true">
          <span class="i-tabler-download" /> Export
        </core-button>
      </div>
    </main>

    <bottom-nav active="settle" :bill-id="id" />
    <share-export-sheet v-model:open="shareOpen" :bill="bill" :transfers="transfers" />
  </template>

  <div v-else class="flex flex-1 items-center justify-center p-8 text-muted">Not found.</div>
</template>
