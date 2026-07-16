<script setup lang="ts">
import { settleBill } from '~~/shared/settle'
import { billStats, entryTotalOf } from '~~/shared/stats'
import { formatRupiah, formatAmount, formatDateShort } from '~~/shared/format'
import type { Entry } from '~~/shared/types'

definePageMeta({ layout: false })

const route = useRoute()
const id = route.params.id as string
const { data: bill } = await useBill(id)

const stats = computed(() => (bill.value ? billStats(bill.value) : null))
const settlement = computed(() =>
  bill.value ? settleBill(bill.value) : { balances: [], transfers: [] },
)
const nameOf = (pid: string) => bill.value?.participants.find((p) => p.id === pid)?.name ?? '?'

function paidBy(e: Entry): string {
  if (e.type === 'simple') {
    const first = nameOf(e.payers[0]?.participantId)
    return e.payers.length > 1 ? `${first} & ${e.payers.length - 1}` : first
  }
  return nameOf(e.payerId)
}
const splitLabel = (e: Entry) => (e.type === 'simple' ? `${e.sharers.length} ways` : 'shared')

function save() {
  if (import.meta.client) window.print()
}
</script>

<template>
  <div class="min-h-screen p-6" style="background: var(--pp-canvas)">
    <div class="no-print mx-auto mb-4 flex max-w-[794px] items-center justify-between">
      <core-button variant="ghost" @click="navigateTo(`/bill/${id}/settle`)">
        <span class="i-tabler-arrow-left" /> Back
      </core-button>
      <core-button variant="danger" @click="save">
        <span class="i-tabler-download" /> Download PDF
      </core-button>
    </div>

    <article
      v-if="bill"
      id="pdf-page"
      class="mx-auto max-w-[794px] overflow-hidden rounded-card bg-white shadow-card"
      style="background: #fffdf7"
    >
      <div style="height: 6px; background: #1e4d3a" />
      <div class="p-9 text-ink">
        <header class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2">
              <pp-logo :size="24" />
              <span class="text-xs font-700 uppercase tracking-[.2em]">PetePete</span>
            </div>
            <h1 class="mt-2 font-serif text-3xl font-700">{{ bill.title }}</h1>
            <p class="text-xs text-muted">Expedition ledger · {{ formatDateShort(bill.createdAt) }}</p>
          </div>
          <div class="text-right">
            <p class="eyebrow">Total tally</p>
            <p class="num text-xl font-700">{{ formatRupiah(stats?.total ?? 0) }}</p>
            <p class="text-xs text-muted">{{ stats?.souls }} souls · {{ stats?.entries }} entries</p>
          </div>
        </header>

        <!-- Expenses -->
        <h2 class="eyebrow mb-2 mt-7">Expenses</h2>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-line-medium text-left text-[11px] uppercase text-muted">
              <th class="py-1.5 font-600">Entry</th>
              <th class="py-1.5 font-600">Paid by</th>
              <th class="py-1.5 font-600">Split</th>
              <th class="py-1.5 text-right font-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in bill.entries" :key="e.id" class="border-b border-line-faint">
              <td class="py-1.5">
                {{ e.title }}
                <span
                  v-if="e.type === 'shared_order'"
                  class="ml-1 rounded-chip-sm bg-warn-fill px-1 py-0.5 text-[9px] font-600 text-warn-text"
                  >shared</span
                >
              </td>
              <td class="py-1.5">{{ paidBy(e) }}</td>
              <td class="py-1.5 text-muted">{{ splitLabel(e) }}</td>
              <td class="num py-1.5 text-right font-600">{{ formatAmount(entryTotalOf(e)) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Balances -->
        <h2 class="eyebrow mb-2 mt-7">Balances</h2>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-line-medium text-left text-[11px] uppercase text-muted">
              <th class="py-1.5 font-600">Person</th>
              <th class="py-1.5 text-right font-600">Spent</th>
              <th class="py-1.5 text-right font-600">Paid</th>
              <th class="py-1.5 text-right font-600">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in settlement.balances" :key="b.participantId" class="border-b border-line-faint">
              <td class="py-1.5">{{ nameOf(b.participantId) }}</td>
              <td class="num py-1.5 text-right">{{ formatAmount(b.spent) }}</td>
              <td class="num py-1.5 text-right">{{ formatAmount(b.paid) }}</td>
              <td
                class="num py-1.5 text-right font-600"
                :class="b.balance >= 0 ? 'text-forest' : 'text-terracotta'"
              >
                {{ b.balance >= 0 ? '+' : '−' }}{{ formatAmount(Math.abs(b.balance)) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Settlement -->
        <div class="mt-7 rounded-card border border-line-medium bg-surface-subtle p-4">
          <h2 class="eyebrow mb-2">Settlement · {{ settlement.transfers.length }} transfers</h2>
          <div class="flex flex-col gap-1.5 text-sm">
            <div v-for="(t, i) in settlement.transfers" :key="i" class="flex justify-between">
              <span>{{ nameOf(t.from) }} → {{ nameOf(t.to) }}</span>
              <span class="num font-600">{{ formatRupiah(t.amount) }}</span>
            </div>
          </div>
        </div>

        <footer class="mt-8 border-t border-line-faint pt-3 text-center text-[11px] text-muted">
          Generated by PetePete · petepete.app · Page 1 of 1
        </footer>
      </div>
    </article>
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  #pdf-page {
    box-shadow: none;
    max-width: none;
  }
}
@page {
  margin: 1cm;
}
</style>
