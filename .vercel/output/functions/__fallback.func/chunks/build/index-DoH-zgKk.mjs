import { _ as __nuxt_component_0 } from './screen-header-ugST2aQ7.mjs';
import { _ as __nuxt_component_2$1 } from './money-text-BOdOvFz2.mjs';
import { _ as __nuxt_component_1 } from './avatar-stack-BSc6BmaN.mjs';
import { defineComponent, withAsyncContext, computed, ref, unref, withCtx, createVNode, createTextVNode, toDisplayString, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderAttrs } from 'vue/server-renderer';
import { b as billStats, e as entryTotalOf } from '../_/stats.mjs';
import { _ as __nuxt_component_2$2 } from './core-button-CuYm2Y1l.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-7EAqBWen.mjs';
import { _ as __nuxt_component_9 } from './bottom-nav-7_y_YlMr.mjs';
import { a as useRoute, n as navigateTo } from './server.mjs';
import { u as useBill, a as formatDateShort } from './useBill-_9lklAAl.mjs';
import { c as copyShareLink } from './useShare-CrYWl9Lt.mjs';
import './avatar-badge-bLaz6-lC.mjs';
import '../_/schemas.mjs';
import 'zod';
import '../_/settle.mjs';
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
import 'pinia';
import 'vue-router';
import 'perfect-debounce';
import '@vue/shared';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "entry-card",
  __ssrInlineRender: true,
  props: {
    entry: {},
    participants: {}
  },
  emits: ["edit"],
  setup(__props) {
    const props = __props;
    const nameOf = (id) => props.participants.find((p) => p.id === id)?.name ?? "?";
    const total = computed(() => entryTotalOf(props.entry));
    const payerName = computed(
      () => props.entry.type === "simple" ? nameOf(props.entry.payers[0]?.participantId) : nameOf(props.entry.payerId)
    );
    const splitWays = computed(
      () => props.entry.type === "simple" ? props.entry.sharers.length : 0
    );
    const orderers = computed(() => {
      if (props.entry.type !== "shared_order") return [];
      const ids = /* @__PURE__ */ new Set();
      for (const it of props.entry.items) for (const id of it.orderedBy) ids.add(id);
      return [...ids].map((id) => props.participants.find((p) => p.id === id)).filter((p) => !!p);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_avatar_stack = __nuxt_component_1;
      const _component_money_text = __nuxt_component_2$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card-parchment flex items-start gap-3 p-3.5" }, _attrs))}><div class="min-w-0 flex-1"><span class="${ssrRenderClass(__props.entry.type === "simple" ? "chip-pos" : "chip-warn")}">${ssrInterpolate(__props.entry.type === "simple" ? "Simple" : "Shared order")}</span><h3 class="mt-1.5 font-serif text-[15px] font-600 text-ink">${ssrInterpolate(__props.entry.title)}</h3>`);
      if (__props.entry.type === "simple") {
        _push(`<p class="mt-0.5 text-xs text-muted"> Paid by <span class="font-600 text-body">${ssrInterpolate(unref(payerName))}</span> · split ${ssrInterpolate(unref(splitWays))} ways </p>`);
      } else {
        _push(`<div class="mt-1 flex items-center gap-2">`);
        _push(ssrRenderComponent(_component_avatar_stack, {
          participants: unref(orderers),
          max: 4,
          size: 20
        }, null, _parent));
        _push(`<span class="text-xs text-muted">Paid by ${ssrInterpolate(unref(payerName))}</span></div>`);
      }
      _push(`</div><div class="flex flex-col items-end gap-1.5">`);
      _push(ssrRenderComponent(_component_money_text, {
        value: unref(total),
        class: "text-[15px] font-600"
      }, null, _parent));
      _push(`<button type="button" class="text-muted" aria-label="Edit"><span class="i-tabler-pencil text-sm"></span></button></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/entry-card.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$1, { __name: "EntryCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const id = route.params.id;
    const { data: bill } = ([__temp, __restore] = withAsyncContext(() => useBill(id)), __temp = await __temp, __restore(), __temp);
    const stats = computed(() => bill.value ? billStats(bill.value) : null);
    const copied = ref(false);
    async function onCopy() {
      copied.value = await copyShareLink(id);
      setTimeout(() => copied.value = false, 1800);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_screen_header = __nuxt_component_0;
      const _component_money_text = __nuxt_component_2$1;
      const _component_entry_card = __nuxt_component_2;
      const _component_core_button = __nuxt_component_2$2;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_bottom_nav = __nuxt_component_9;
      if (unref(bill)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_screen_header, {
          back: "",
          eyebrow: "Ledger",
          title: unref(bill).title,
          meta: `${unref(stats)?.souls} souls · ${unref(stats)?.entries} entries · ${unref(formatDateShort)(unref(bill).createdAt)}`,
          onBack: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="rule-double mt-3 flex items-center justify-between pt-3"${_scopeId}><span class="eyebrow"${_scopeId}>Total tally</span>`);
              _push2(ssrRenderComponent(_component_money_text, {
                value: unref(stats)?.total ?? 0,
                class: "text-2xl font-600"
              }, null, _parent2, _scopeId));
              _push2(`</div><button type="button" class="mt-3 inline-flex items-center gap-1.5 rounded-control border border-line-medium bg-surface-card px-3 py-1.5 text-xs font-600 text-ink"${_scopeId}><span class="${ssrRenderClass(unref(copied) ? "i-tabler-check text-forest" : "i-tabler-link")}"${_scopeId}></span> ${ssrInterpolate(unref(copied) ? "Link copied" : "Copy link")}</button>`);
            } else {
              return [
                createVNode("div", { class: "rule-double mt-3 flex items-center justify-between pt-3" }, [
                  createVNode("span", { class: "eyebrow" }, "Total tally"),
                  createVNode(_component_money_text, {
                    value: unref(stats)?.total ?? 0,
                    class: "text-2xl font-600"
                  }, null, 8, ["value"])
                ]),
                createVNode("button", {
                  type: "button",
                  class: "mt-3 inline-flex items-center gap-1.5 rounded-control border border-line-medium bg-surface-card px-3 py-1.5 text-xs font-600 text-ink",
                  onClick: onCopy
                }, [
                  createVNode("span", {
                    class: unref(copied) ? "i-tabler-check text-forest" : "i-tabler-link"
                  }, null, 2),
                  createTextVNode(" " + toDisplayString(unref(copied) ? "Link copied" : "Copy link"), 1)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<main class="app-col relative flex-1 overflow-y-auto px-5 pb-28 pt-4"><p class="eyebrow mb-2">Entries</p>`);
        if (unref(bill).entries.length) {
          _push(`<div class="flex flex-col gap-2.5"><!--[-->`);
          ssrRenderList(unref(bill).entries, (e) => {
            _push(ssrRenderComponent(_component_entry_card, {
              key: e.id,
              entry: e,
              participants: unref(bill).participants,
              onEdit: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/bill/${unref(id)}/add?entry=${e.id}`)
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="card-parchment mt-2 p-6 text-center"><span class="i-tabler-receipt mx-auto block text-2xl text-muted"></span><p class="mt-2 text-sm text-body">No entries yet. Add your first expense.</p></div>`);
        }
        _push(ssrRenderComponent(_component_core_button, {
          variant: "ghost",
          block: "",
          to: `/bill/${unref(id)}/settle`,
          class: "mt-5"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="i-tabler-arrow-right"${_scopeId}></span> Settle up `);
            } else {
              return [
                createVNode("span", { class: "i-tabler-arrow-right" }),
                createTextVNode(" Settle up ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/bill/${unref(id)}/add`,
          class: "absolute bottom-6 right-5 z-20 flex size-14 items-center justify-center rounded-full bg-ochre text-white shadow-card",
          "aria-label": "Add expense"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="i-tabler-plus text-2xl"${_scopeId}></span>`);
            } else {
              return [
                createVNode("span", { class: "i-tabler-plus text-2xl" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</main>`);
        _push(ssrRenderComponent(_component_bottom_nav, {
          active: "receipt",
          "bill-id": unref(id)
        }, null, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-1 items-center justify-center p-8 text-center text-muted" }, _attrs))}> Expedition not found. </div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/bill/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DoH-zgKk.mjs.map
