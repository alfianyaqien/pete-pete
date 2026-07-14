import { _ as __nuxt_component_1 } from './PpLogo-CpDQ3Vg1.mjs';
import { _ as __nuxt_component_0 } from './AvatarBadge-Db5SDNyy.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { a as settleBill } from '../_/settle.mjs';
import { b as billStats } from '../_/stats.mjs';
import { u as useBill, f as formatRupiah } from './useBill-NokyyOIb.mjs';
import { _ as _export_sfc, a as useRoute } from './server.mjs';
import '../_/schemas.mjs';
import 'zod';
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
  __name: "image",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const id = route.params.id;
    const { data: bill } = ([__temp, __restore] = withAsyncContext(() => useBill(id)), __temp = await __temp, __restore(), __temp);
    const stats = computed(() => bill.value ? billStats(bill.value) : null);
    const transfers = computed(() => bill.value ? settleBill(bill.value).transfers : []);
    const nameOf = (pid) => bill.value?.participants.find((p) => p.id === pid)?.name ?? "?";
    const badgeOf = (pid) => bill.value?.participants.find((p) => p.id === pid)?.badgeKey;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PpLogo = __nuxt_component_1;
      const _component_AvatarBadge = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "flex min-h-screen flex-col items-center justify-center gap-5 p-6",
        style: { "background": "var(--pp-canvas)" }
      }, _attrs))} data-v-b080ee12><div class="no-print flex w-[380px] items-center justify-between" data-v-b080ee12><button class="btn-ghost" data-v-b080ee12><span class="i-tabler-arrow-left" data-v-b080ee12></span> Back </button><button class="btn-ochre" data-v-b080ee12><span class="i-tabler-download" data-v-b080ee12></span> Save as image </button></div>`);
      if (unref(bill)) {
        _push(`<div id="settle-card" class="relative w-[380px] overflow-hidden rounded-card-lg px-7 py-8 text-center" style="${ssrRenderStyle({ "background": "#f4ead7", "box-shadow": "0 10px 30px -12px rgba(46, 37, 25, 0.4)" })}" data-v-b080ee12><span class="corner" style="${ssrRenderStyle({ "top": "12px", "left": "12px", "border-width": "2px 0 0 2px" })}" data-v-b080ee12></span><span class="corner" style="${ssrRenderStyle({ "top": "12px", "right": "12px", "border-width": "2px 2px 0 0" })}" data-v-b080ee12></span><span class="corner" style="${ssrRenderStyle({ "bottom": "12px", "left": "12px", "border-width": "0 0 2px 2px" })}" data-v-b080ee12></span><span class="corner" style="${ssrRenderStyle({ "bottom": "12px", "right": "12px", "border-width": "0 2px 2px 0" })}" data-v-b080ee12></span><div class="flex items-center justify-center gap-2" data-v-b080ee12>`);
        _push(ssrRenderComponent(_component_PpLogo, { size: 22 }, null, _parent));
        _push(`<span class="text-sm font-700 uppercase tracking-[.2em] text-ink" data-v-b080ee12>PetePete</span></div><p class="eyebrow mt-4" data-v-b080ee12>Settle up</p><h1 class="font-serif text-3xl font-700 text-ink" data-v-b080ee12>${ssrInterpolate(unref(bill).title)}</h1><p class="mt-1 text-xs text-muted" data-v-b080ee12>${ssrInterpolate(unref(transfers).length)} transfers clear all ${ssrInterpolate(unref(stats)?.souls)} · ${ssrInterpolate(unref(formatRupiah)(unref(stats)?.total ?? 0))}</p><div class="rule-double mt-5 flex flex-col gap-3 pt-5" data-v-b080ee12><!--[-->`);
        ssrRenderList(unref(transfers), (t, i) => {
          _push(`<div class="flex items-center gap-2" data-v-b080ee12>`);
          _push(ssrRenderComponent(_component_AvatarBadge, {
            "badge-key": badgeOf(t.from),
            size: 26
          }, null, _parent));
          _push(`<span class="text-sm font-600 text-ink" data-v-b080ee12>${ssrInterpolate(nameOf(t.from))}</span><span class="mx-1 flex-1 border-t border-dashed" style="${ssrRenderStyle({ "border-color": "#c2902f" })}" data-v-b080ee12></span><span class="text-sm font-600 text-ink" data-v-b080ee12>${ssrInterpolate(nameOf(t.to))}</span>`);
          _push(ssrRenderComponent(_component_AvatarBadge, {
            "badge-key": badgeOf(t.to),
            size: 26
          }, null, _parent));
          _push(`<span class="num ml-2 text-sm font-700 text-ink" data-v-b080ee12>${ssrInterpolate(unref(formatRupiah)(t.amount))}</span></div>`);
        });
        _push(`<!--]-->`);
        if (!unref(transfers).length) {
          _push(`<p class="text-sm text-muted" data-v-b080ee12>Everyone is square.</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><p class="mt-6 text-[11px] text-muted" data-v-b080ee12>PetePete · settle up, then climb on</p></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/bill/[id]/export/image.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const image = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b080ee12"]]);

export { image as default };
//# sourceMappingURL=image-0L3DHydR.mjs.map
