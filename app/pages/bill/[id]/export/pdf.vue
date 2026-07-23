<script setup lang="ts">
import { settleBill } from '~~/shared/settle'
import { billStats, entryTotalOf, personLedgers, payersLabel } from '~~/shared/stats'
import { formatRupiah, formatDateShort } from '~~/shared/format'
import { elementToPdf } from '~/utils/exporters'
import type { Entry } from '~~/shared/types'

definePageMeta({ layout: false })
useHead({ title: 'PDF Summary' })

const route = useRoute()
const id = route.params.id as string
const { data: bill } = await useBill(id)

const stats = computed(() => (bill.value ? billStats(bill.value) : null))
const settlement = computed(() =>
  bill.value ? settleBill(bill.value) : { balances: [], transfers: [] },
)
const ledgers = computed(() => (bill.value ? personLedgers(bill.value) : []))
const nameOf = (pid: string) => bill.value?.participants.find((p) => p.id === pid)?.name ?? '?'

const paidBy = (e: Entry) => (bill.value ? payersLabel(e, bill.value.participants) : '')

// chronological (oldest first) for a printed ledger
const sortedEntries = computed(() =>
  [...(bill.value?.entries ?? [])].sort((a, b) => a.date.localeCompare(b.date)),
)

/** Signed money for owed lines (a discount line is negative). */
const owedText = (n: number) => (n < 0 ? '−' : '') + formatRupiah(Math.abs(n))

const saving = ref(false)
const error = ref('')
async function save() {
  const node = document.getElementById('pdf-page')
  if (!node || !bill.value) return
  saving.value = true
  error.value = ''
  try {
    await elementToPdf(node, `PetePete - ${bill.value.title}.pdf`)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not build the PDF'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen p-6" style="background: var(--pp-canvas)">
    <div class="no-print mx-auto mb-4 flex max-w-[794px] items-center justify-between">
      <core-button variant="ghost" @click="navigateTo(`/bill/${id}/settle`)">
        <span class="i-tabler-arrow-left" /> Back
      </core-button>
      <core-button variant="danger" :loading="saving" @click="save">
        <span class="i-tabler-download" /> Download PDF
      </core-button>
    </div>
    <p v-if="error" class="no-print mx-auto mb-4 max-w-[794px] chip-neg">{{ error }}</p>

    <article
      v-if="bill"
      id="pdf-page"
      class="mx-auto max-w-[794px] overflow-hidden bg-white shadow-card"
      style="background: #fffdf7"
    >
      <div class="p-9 text-ink">
        <header data-pdf-block class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2">
              <pp-logo :size="24" />
              <span class="text-xs font-700 uppercase tracking-[.2em]">PetePete</span>
            </div>
            <h1 class="mt-2 font-serif text-3xl font-700">{{ bill.title }}</h1>
            <p class="text-xs text-muted">Trip ledger · {{ formatDateShort(bill.createdAt) }}</p>
          </div>
          <div class="text-right">
            <p class="eyebrow">Total tally</p>
            <p class="num text-xl font-700">{{ formatRupiah(stats?.total ?? 0) }}</p>
            <p class="text-xs text-muted">{{ stats?.souls }} souls · {{ stats?.entries }} entries</p>
          </div>
        </header>

        <!-- 1 · Expenses -->
        <h2 data-pdf-block data-pdf-heading class="eyebrow mb-1 mt-7">1 · Expenses</h2>
        <div class="flex flex-col">
          <div
            v-for="e in sortedEntries"
            :key="e.id"
            data-pdf-block
            class="flex items-baseline border-b border-line-faint py-1.5 text-sm"
          >
            <span class="num w-16 shrink-0 text-muted">{{ formatDateShort(e.date) }}</span>
            <span class="shrink-0 font-500">{{ e.title }}</span>
            <span
              v-if="e.type === 'shared_order'"
              class="ml-1 shrink-0 rounded-chip-sm bg-warn-fill px-1 py-0.5 text-[9px] font-600 text-warn-text"
              >bill</span
            >
            <span class="ml-2 shrink-0 text-xs text-muted">{{ paidBy(e) }}</span>
            <span class="leader" />
            <span class="num shrink-0 font-600">{{ formatRupiah(entryTotalOf(e)) }}</span>
          </div>
        </div>

        <!-- 2 · Settlement transfers -->
        <h2 data-pdf-block data-pdf-heading class="eyebrow mb-1 mt-7">2 · Settlement transfers</h2>
        <div class="flex flex-col">
          <div
            v-for="(t, i) in settlement.transfers"
            :key="i"
            data-pdf-block
            class="flex items-baseline border-b border-line-faint py-1.5 text-sm"
          >
            <span class="shrink-0 font-500">{{ nameOf(t.from) }}</span>
            <span class="mx-1.5 shrink-0 text-ochre">→</span>
            <span class="shrink-0 font-500">{{ nameOf(t.to) }}</span>
            <span class="leader" />
            <span class="num shrink-0 font-600">{{ formatRupiah(t.amount) }}</span>
          </div>
          <p v-if="!settlement.transfers.length" data-pdf-block class="py-1.5 text-sm text-muted">
            Everyone is square — nothing to settle.
          </p>
        </div>

        <!-- 3 · Who paid & who owes -->
        <h2 data-pdf-block data-pdf-heading class="eyebrow mb-2 mt-7">3 · Who paid &amp; who owes</h2>
        <div class="flex flex-col gap-4">
          <div v-for="l in ledgers" :key="l.participantId" data-pdf-block>
            <div class="flex items-baseline justify-between border-b border-line-medium pb-1">
              <span class="font-600">{{ l.name }}</span>
              <span
                class="num text-sm font-600"
                :class="l.net >= 0 ? 'text-forest' : 'text-terracotta'"
              >
                {{ l.net >= 0 ? '+' : '−' }}{{ formatRupiah(Math.abs(l.net)) }}
                {{ l.net >= 0 ? 'owed back' : 'owes' }}
              </span>
            </div>
            <div class="mt-1.5 grid grid-cols-1 gap-x-8 gap-y-1 text-xs sm:grid-cols-2">
              <div v-if="l.paid.length">
                <p class="text-[10px] font-700 uppercase tracking-wide text-forest">Paid</p>
                <div v-for="(p, i) in l.paid" :key="'p' + i" class="flex items-baseline">
                  <span class="text-body">{{ p.title }}</span>
                  <span class="leader" />
                  <span class="num shrink-0">{{ formatRupiah(p.amount) }}</span>
                </div>
              </div>
              <div v-if="l.owed.length">
                <p class="text-[10px] font-700 uppercase tracking-wide text-muted">Owes</p>
                <div v-for="(o, i) in l.owed" :key="'o' + i" class="flex items-baseline">
                  <span class="text-body">{{ o.label }}</span>
                  <span class="leader" />
                  <span class="num shrink-0">{{ owedText(o.amount) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer
          data-pdf-block
          class="mt-8 border-t border-line-faint pt-3 text-center text-[11px] text-muted"
        >
          Generated by PetePete · Made by Ahmad Iqbal · ahmadiqball.com
        </footer>
      </div>
    </article>
  </div>
</template>

<style scoped>
/* dotted leader connecting a label to its price */
.leader {
  flex: 1 1 auto;
  align-self: flex-end;
  min-width: 16px;
  margin: 0 6px 4px;
  border-bottom: 1px dotted #c2b79a;
}
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
