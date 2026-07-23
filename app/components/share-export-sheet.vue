<script setup lang="ts">
import type { Bill, Transfer } from '~~/shared/types'
import { settlementRecap, shareToWhatsApp } from '~/composables/useShare'

const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{ bill: Bill; transfers: Transfer[] }>()

const selected = ref<'whatsapp' | 'image' | 'pdf'>('pdf')

function onWhatsApp() {
  shareToWhatsApp(settlementRecap(props.bill, props.transfers))
  open.value = false
}
function goImage() {
  open.value = false
  navigateTo(`/bill/${props.bill.id}/export/image`)
}
function goPdf() {
  open.value = false
  navigateTo(`/bill/${props.bill.id}/export/pdf`)
}

const rows = computed(() => [
  {
    key: 'whatsapp' as const,
    icon: 'brand-whatsapp',
    tone: 'text-forest',
    title: 'Share to WhatsApp',
    sub: 'Settlement as a text recap + link',
    arrow: 'i-tabler-arrow-right',
    act: onWhatsApp,
  },
  {
    key: 'image' as const,
    icon: 'photo',
    tone: 'text-ochre',
    title: 'Download settlement PNG',
    sub: 'Who pays whom · square card for chat',
    arrow: 'i-tabler-arrow-down',
    act: goImage,
  },
  {
    key: 'pdf' as const,
    icon: 'file-text',
    tone: 'text-terracotta',
    title: 'Full PDF summary',
    sub: 'Every expense, balances & transfers',
    arrow: 'i-tabler-arrow-down',
    act: goPdf,
  },
])
</script>

<template>
  <core-modal v-model:open="open">
    <template #header>
      <div>
        <h2 class="font-serif text-lg font-600">Share &amp; export</h2>
        <p class="text-xs text-muted">{{ bill.title }} · settlement &amp; ledger</p>
      </div>
    </template>

    <div class="flex flex-col gap-2">
      <button
        v-for="r in rows"
        :key="r.key"
        type="button"
        class="flex items-center gap-3 rounded-card border bg-surface-card px-3 py-3 text-left"
        :class="selected === r.key ? 'border-forest' : 'border-line-light'"
        @mouseenter="selected = r.key"
        @click="r.act"
      >
        <span :class="[`i-tabler-${r.icon}`, r.tone]" class="text-xl" />
        <div class="flex-1">
          <p class="text-sm font-600 text-ink">{{ r.title }}</p>
          <p class="text-xs text-muted">{{ r.sub }}</p>
        </div>
        <span :class="r.arrow" class="text-muted" />
      </button>
    </div>

    <div
      class="mt-3 flex items-start gap-2 rounded-control border border-line-light bg-surface-subtle px-3 py-2.5 text-xs text-body"
    >
      <span class="i-tabler-info-circle mt-0.5 text-ochre" />
      <span>No account needed — files save straight to your device.</span>
    </div>
  </core-modal>
</template>
