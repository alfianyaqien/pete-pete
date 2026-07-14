import { _ as __nuxt_component_1 } from './PpLogo-CpDQ3Vg1.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { a as settleBill } from '../_/settle.mjs';
import { b as billStats, e as entryTotalOf } from '../_/stats.mjs';
import { u as useBill, a as formatDateShort, f as formatRupiah, b as formatAmount } from './useBill-NokyyOIb.mjs';
import { _ as _export_sfc, a as useRoute } from './server.mjs';
import 'pinia';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import 'perfect-debounce';
import '@vue/shared';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "pdf",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const id = route.params.id;
    const { data: bill } = ([__temp, __restore] = withAsyncContext(() => useBill(id)), __temp = await __temp, __restore(), __temp);
    const stats = computed(() => bill.value ? billStats(bill.value) : null);
    const settlement = computed(
      () => bill.value ? settleBill(bill.value) : { balances: [], transfers: [] }
    );
    const nameOf = (pid) => bill.value?.participants.find((p) => p.id === pid)?.name ?? "?";
    function paidBy(e) {
      if (e.type === "simple") {
        const first = nameOf(e.payers[0]?.participantId);
        return e.payers.length > 1 ? `${first} & ${e.payers.length - 1}` : first;
      }
      return nameOf(e.payerId);
    }
    const splitLabel = (e) => e.type === "simple" ? `${e.sharers.length} ways` : "shared";
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PpLogo = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "min-h-screen p-6",
        style: { "background": "var(--pp-canvas)" }
      }, _attrs))} data-v-b2017abe><div class="no-print mx-auto mb-4 flex max-w-[794px] items-center justify-between" data-v-b2017abe><button class="btn-ghost" data-v-b2017abe><span class="i-tabler-arrow-left" data-v-b2017abe></span> Back </button><button class="btn-terra" data-v-b2017abe><span class="i-tabler-download" data-v-b2017abe></span> Download PDF </button></div>`);
      if (unref(bill)) {
        _push(`<article id="pdf-page" class="mx-auto max-w-[794px] overflow-hidden rounded-card bg-white shadow-card" style="${ssrRenderStyle({ "background": "#fffdf7" })}" data-v-b2017abe><div style="${ssrRenderStyle({ "height": "6px", "background": "#1e4d3a" })}" data-v-b2017abe></div><div class="p-9 text-ink" data-v-b2017abe><header class="flex items-start justify-between" data-v-b2017abe><div data-v-b2017abe><div class="flex items-center gap-2" data-v-b2017abe>`);
        _push(ssrRenderComponent(_component_PpLogo, { size: 24 }, null, _parent));
        _push(`<span class="text-xs font-700 uppercase tracking-[.2em]" data-v-b2017abe>PetePete</span></div><h1 class="mt-2 font-serif text-3xl font-700" data-v-b2017abe>${ssrInterpolate(unref(bill).title)}</h1><p class="text-xs text-muted" data-v-b2017abe>Expedition ledger · ${ssrInterpolate(unref(formatDateShort)(unref(bill).createdAt))}</p></div><div class="text-right" data-v-b2017abe><p class="eyebrow" data-v-b2017abe>Total tally</p><p class="num text-xl font-700" data-v-b2017abe>${ssrInterpolate(unref(formatRupiah)(unref(stats)?.total ?? 0))}</p><p class="text-xs text-muted" data-v-b2017abe>${ssrInterpolate(unref(stats)?.souls)} souls · ${ssrInterpolate(unref(stats)?.entries)} entries</p></div></header><h2 class="eyebrow mb-2 mt-7" data-v-b2017abe>Expenses</h2><table class="w-full text-sm" data-v-b2017abe><thead data-v-b2017abe><tr class="border-b border-line-medium text-left text-[11px] uppercase text-muted" data-v-b2017abe><th class="py-1.5 font-600" data-v-b2017abe>Entry</th><th class="py-1.5 font-600" data-v-b2017abe>Paid by</th><th class="py-1.5 font-600" data-v-b2017abe>Split</th><th class="py-1.5 text-right font-600" data-v-b2017abe>Amount</th></tr></thead><tbody data-v-b2017abe><!--[-->`);
        ssrRenderList(unref(bill).entries, (e) => {
          _push(`<tr class="border-b border-line-faint" data-v-b2017abe><td class="py-1.5" data-v-b2017abe>${ssrInterpolate(e.title)} `);
          if (e.type === "shared_order") {
            _push(`<span class="ml-1 rounded-chip-sm bg-warn-fill px-1 py-0.5 text-[9px] font-600 text-warn-text" data-v-b2017abe>shared</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="py-1.5" data-v-b2017abe>${ssrInterpolate(paidBy(e))}</td><td class="py-1.5 text-muted" data-v-b2017abe>${ssrInterpolate(splitLabel(e))}</td><td class="num py-1.5 text-right font-600" data-v-b2017abe>${ssrInterpolate(unref(formatAmount)(unref(entryTotalOf)(e)))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table><h2 class="eyebrow mb-2 mt-7" data-v-b2017abe>Balances</h2><table class="w-full text-sm" data-v-b2017abe><thead data-v-b2017abe><tr class="border-b border-line-medium text-left text-[11px] uppercase text-muted" data-v-b2017abe><th class="py-1.5 font-600" data-v-b2017abe>Person</th><th class="py-1.5 text-right font-600" data-v-b2017abe>Spent</th><th class="py-1.5 text-right font-600" data-v-b2017abe>Paid</th><th class="py-1.5 text-right font-600" data-v-b2017abe>Balance</th></tr></thead><tbody data-v-b2017abe><!--[-->`);
        ssrRenderList(unref(settlement).balances, (b) => {
          _push(`<tr class="border-b border-line-faint" data-v-b2017abe><td class="py-1.5" data-v-b2017abe>${ssrInterpolate(nameOf(b.participantId))}</td><td class="num py-1.5 text-right" data-v-b2017abe>${ssrInterpolate(unref(formatAmount)(b.spent))}</td><td class="num py-1.5 text-right" data-v-b2017abe>${ssrInterpolate(unref(formatAmount)(b.paid))}</td><td class="${ssrRenderClass([b.balance >= 0 ? "text-forest" : "text-terracotta", "num py-1.5 text-right font-600"])}" data-v-b2017abe>${ssrInterpolate(b.balance >= 0 ? "+" : "−")}${ssrInterpolate(unref(formatAmount)(Math.abs(b.balance)))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table><div class="mt-7 rounded-card border border-line-medium bg-surface-subtle p-4" data-v-b2017abe><h2 class="eyebrow mb-2" data-v-b2017abe>Settlement · ${ssrInterpolate(unref(settlement).transfers.length)} transfers</h2><div class="flex flex-col gap-1.5 text-sm" data-v-b2017abe><!--[-->`);
        ssrRenderList(unref(settlement).transfers, (t, i) => {
          _push(`<div class="flex justify-between" data-v-b2017abe><span data-v-b2017abe>${ssrInterpolate(nameOf(t.from))} → ${ssrInterpolate(nameOf(t.to))}</span><span class="num font-600" data-v-b2017abe>${ssrInterpolate(unref(formatRupiah)(t.amount))}</span></div>`);
        });
        _push(`<!--]--></div></div><footer class="mt-8 border-t border-line-faint pt-3 text-center text-[11px] text-muted" data-v-b2017abe> Generated by PetePete · petepete.app · Page 1 of 1 </footer></div></article>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/bill/[id]/export/pdf.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const pdf = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b2017abe"]]);

export { pdf as default };
//# sourceMappingURL=pdf-Cj0lCRoO.mjs.map
