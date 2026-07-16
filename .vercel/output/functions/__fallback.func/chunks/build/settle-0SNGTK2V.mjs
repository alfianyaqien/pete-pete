import { _ as __nuxt_component_0 } from './screen-header-ugST2aQ7.mjs';
import { _ as __nuxt_component_2 } from './money-text-BOdOvFz2.mjs';
import { _ as __nuxt_component_3$1 } from './hero-panel-C8Sdz9jx.mjs';
import { _ as __nuxt_component_0$1 } from './avatar-badge-bLaz6-lC.mjs';
import { defineComponent, withAsyncContext, computed, ref, unref, withCtx, createVNode, toDisplayString, createTextVNode, isRef, mergeProps, useModel, openBlock, createBlock, Fragment, renderList, mergeModels, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderAttrs, ssrRenderClass } from 'vue/server-renderer';
import { _ as __nuxt_component_2$1 } from './core-button-CuYm2Y1l.mjs';
import { _ as __nuxt_component_0$2 } from './core-modal-WUn7wjMe.mjs';
import { s as shareToWhatsApp, a as settlementRecap } from './useShare-CrYWl9Lt.mjs';
import { a as useRoute, n as navigateTo } from './server.mjs';
import { a as settleBill } from '../_/settle.mjs';
import { b as billStats } from '../_/stats.mjs';
import { u as useBill, c as useIdentity } from './useBill-_9lklAAl.mjs';
import '../_/schemas.mjs';
import 'zod';
import './nuxt-link-7EAqBWen.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "identity-chip",
  __ssrInlineRender: true,
  props: {
    participants: {},
    modelValue: {},
    tone: { default: "dark" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const open = ref(false);
    const current = computed(
      () => props.participants.find((p) => p.id === props.modelValue) ?? props.participants[0] ?? null
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_avatar_badge = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative inline-block" }, _attrs))}><button type="button" class="${ssrRenderClass([
        __props.tone === "dark" ? "bg-white/12 text-surface-card" : "border border-line-light bg-surface-card text-ink",
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-sm font-600"
      ])}">`);
      if (unref(current)) {
        _push(ssrRenderComponent(_component_avatar_badge, {
          "badge-key": unref(current).badgeKey,
          size: 20
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<span>You&#39;re ${ssrInterpolate(unref(current)?.name ?? "—")}</span><span class="i-tabler-chevron-down text-xs"></span></button>`);
      if (unref(open)) {
        _push(`<div class="absolute right-0 z-30 mt-1 max-h-60 w-44 overflow-auto rounded-card bg-surface-card p-1 text-ink shadow-card"><!--[-->`);
        ssrRenderList(__props.participants, (p) => {
          _push(`<button type="button" class="${ssrRenderClass([p.id === unref(current)?.id ? "bg-surface-subtle font-600" : "", "flex w-full items-center gap-2 rounded-chip px-2 py-1.5 text-left text-sm hover:bg-surface-subtle"])}">`);
          _push(ssrRenderComponent(_component_avatar_badge, {
            "badge-key": p.badgeKey,
            size: 20
          }, null, _parent));
          _push(`<span>${ssrInterpolate(p.name)}</span></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/identity-chip.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$2, { __name: "IdentityChip" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "share-export-sheet",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    bill: {},
    transfers: {}
  }, {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {}
  }),
  emits: ["update:open"],
  setup(__props) {
    const open = useModel(__props, "open");
    const props = __props;
    const selected = ref("pdf");
    function onWhatsApp() {
      shareToWhatsApp(settlementRecap(props.bill, props.transfers));
      open.value = false;
    }
    function goImage() {
      open.value = false;
      navigateTo(`/bill/${props.bill.id}/export/image`);
    }
    function goPdf() {
      open.value = false;
      navigateTo(`/bill/${props.bill.id}/export/pdf`);
    }
    const rows = computed(() => [
      {
        key: "whatsapp",
        icon: "brand-whatsapp",
        tone: "text-forest",
        title: "Share to WhatsApp",
        sub: "Settlement as a text recap + link",
        arrow: "i-tabler-arrow-right",
        act: onWhatsApp
      },
      {
        key: "image",
        icon: "photo",
        tone: "text-ochre",
        title: "Settlement image",
        sub: "Who pays whom · square card for chat",
        arrow: "i-tabler-arrow-down",
        act: goImage
      },
      {
        key: "pdf",
        icon: "file-text",
        tone: "text-terracotta",
        title: "Full PDF summary",
        sub: "Every expense, balances & transfers",
        arrow: "i-tabler-arrow-down",
        act: goPdf
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_core_modal = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_core_modal, mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event
      }, _attrs), {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2 class="font-serif text-lg font-600"${_scopeId}>Share &amp; export</h2><p class="text-xs text-muted"${_scopeId}>${ssrInterpolate(__props.bill.title)} · settlement &amp; ledger</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", { class: "font-serif text-lg font-600" }, "Share & export"),
                createVNode("p", { class: "text-xs text-muted" }, toDisplayString(__props.bill.title) + " · settlement & ledger", 1)
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(unref(rows), (r) => {
              _push2(`<button type="button" class="${ssrRenderClass([unref(selected) === r.key ? "border-forest" : "border-line-light", "flex items-center gap-3 rounded-card border bg-surface-card px-3 py-3 text-left"])}"${_scopeId}><span class="${ssrRenderClass([[`i-tabler-${r.icon}`, r.tone], "text-xl"])}"${_scopeId}></span><div class="flex-1"${_scopeId}><p class="text-sm font-600 text-ink"${_scopeId}>${ssrInterpolate(r.title)}</p><p class="text-xs text-muted"${_scopeId}>${ssrInterpolate(r.sub)}</p></div><span class="${ssrRenderClass([r.arrow, "text-muted"])}"${_scopeId}></span></button>`);
            });
            _push2(`<!--]--></div><div class="mt-3 flex items-start gap-2 rounded-control border border-line-light bg-surface-subtle px-3 py-2.5 text-xs text-body"${_scopeId}><span class="i-tabler-info-circle mt-0.5 text-ochre"${_scopeId}></span><span${_scopeId}>No account needed — files save straight to your device.</span></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col gap-2" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(rows), (r) => {
                  return openBlock(), createBlock("button", {
                    key: r.key,
                    type: "button",
                    class: ["flex items-center gap-3 rounded-card border bg-surface-card px-3 py-3 text-left", unref(selected) === r.key ? "border-forest" : "border-line-light"],
                    onMouseenter: ($event) => selected.value = r.key,
                    onClick: r.act
                  }, [
                    createVNode("span", {
                      class: [[`i-tabler-${r.icon}`, r.tone], "text-xl"]
                    }, null, 2),
                    createVNode("div", { class: "flex-1" }, [
                      createVNode("p", { class: "text-sm font-600 text-ink" }, toDisplayString(r.title), 1),
                      createVNode("p", { class: "text-xs text-muted" }, toDisplayString(r.sub), 1)
                    ]),
                    createVNode("span", {
                      class: [r.arrow, "text-muted"]
                    }, null, 2)
                  ], 42, ["onMouseenter", "onClick"]);
                }), 128))
              ]),
              createVNode("div", { class: "mt-3 flex items-start gap-2 rounded-control border border-line-light bg-surface-subtle px-3 py-2.5 text-xs text-body" }, [
                createVNode("span", { class: "i-tabler-info-circle mt-0.5 text-ochre" }),
                createVNode("span", null, "No account needed — files save straight to your device.")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/share-export-sheet.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$1, { __name: "ShareExportSheet" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settle",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const id = route.params.id;
    const { data: bill } = ([__temp, __restore] = withAsyncContext(() => useBill(id)), __temp = await __temp, __restore(), __temp);
    const { me, setMe } = useIdentity(bill);
    const stats = computed(() => bill.value ? billStats(bill.value) : null);
    const result = computed(
      () => bill.value ? settleBill(bill.value) : { balances: [], transfers: [] }
    );
    const balances = computed(
      () => [...result.value.balances].sort((a, b) => b.balance - a.balance)
    );
    const transfers = computed(() => result.value.transfers);
    const nameOf = (pid) => bill.value?.participants.find((p) => p.id === pid)?.name ?? "?";
    const badgeOf = (pid) => bill.value?.participants.find((p) => p.id === pid)?.badgeKey;
    const myBalance = computed(() => result.value.balances.find((b) => b.participantId === me.value?.id));
    const owedBack = computed(() => Math.max(0, myBalance.value?.balance ?? 0));
    const iOwe = computed(() => Math.max(0, -(myBalance.value?.balance ?? 0)));
    const peopleOweMe = computed(() => transfers.value.filter((t) => t.to === me.value?.id).length);
    const fronters = computed(
      () => result.value.balances.filter((b) => b.paid > 0).map((b) => nameOf(b.participantId))
    );
    const frontedBy = computed(
      () => fronters.value.length ? `${fronters.value[0]}${fronters.value.length > 1 ? ` & ${fronters.value.length - 1}` : ""}` : "—"
    );
    const shareOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_screen_header = __nuxt_component_0;
      const _component_money_text = __nuxt_component_2;
      const _component_hero_panel = __nuxt_component_3$1;
      const _component_identity_chip = __nuxt_component_3;
      const _component_avatar_badge = __nuxt_component_0$1;
      const _component_core_button = __nuxt_component_2$1;
      const _component_share_export_sheet = __nuxt_component_6;
      if (unref(bill)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_screen_header, {
          back: "",
          eyebrow: "Settle up",
          title: unref(bill).title,
          onBack: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/bill/${unref(id)}`)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="rule-double mt-3 flex items-center justify-between pt-3"${_scopeId}><span class="eyebrow"${_scopeId}>Total tally</span>`);
              _push2(ssrRenderComponent(_component_money_text, {
                value: unref(stats)?.total ?? 0,
                class: "text-xl font-600"
              }, null, _parent2, _scopeId));
              _push2(`</div><p class="mt-1 text-xs text-muted"${_scopeId}>fronted by ${ssrInterpolate(unref(frontedBy))}</p>`);
            } else {
              return [
                createVNode("div", { class: "rule-double mt-3 flex items-center justify-between pt-3" }, [
                  createVNode("span", { class: "eyebrow" }, "Total tally"),
                  createVNode(_component_money_text, {
                    value: unref(stats)?.total ?? 0,
                    class: "text-xl font-600"
                  }, null, 8, ["value"])
                ]),
                createVNode("p", { class: "mt-1 text-xs text-muted" }, "fronted by " + toDisplayString(unref(frontedBy)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<main class="app-col flex-1 overflow-y-auto px-5 pb-28 pt-4">`);
        _push(ssrRenderComponent(_component_hero_panel, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center justify-between"${_scopeId}><p class="text-[10px] font-600 uppercase tracking-[.1em]" style="${ssrRenderStyle({ "color": "#9dc2ae" })}"${_scopeId}> Your standing here </p>`);
              _push2(ssrRenderComponent(_component_identity_chip, {
                participants: unref(bill).participants,
                "model-value": unref(me)?.id ?? null,
                "onUpdate:modelValue": unref(setMe)
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="mt-3 flex gap-5"${_scopeId}><div${_scopeId}><p class="text-[11px]" style="${ssrRenderStyle({ "color": "#9dc2ae" })}"${_scopeId}>You&#39;re owed back</p><p class="text-xl font-700" style="${ssrRenderStyle({ "color": "#e7b968" })}"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_money_text, { value: unref(owedBack) }, null, _parent2, _scopeId));
              _push2(`</p></div><div${_scopeId}><p class="text-[11px]" style="${ssrRenderStyle({ "color": "#9dc2ae" })}"${_scopeId}>You owe</p><p class="text-xl font-700" style="${ssrRenderStyle({ "color": "#9ddfb6" })}"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_money_text, { value: unref(iOwe) }, null, _parent2, _scopeId));
              _push2(`</p></div></div><div class="mt-3 flex flex-wrap gap-2 text-[11px] font-600"${_scopeId}><span class="rounded-chip-sm bg-white/12 px-2 py-1"${_scopeId}>${ssrInterpolate(unref(peopleOweMe))} people owe you</span><span class="rounded-chip-sm bg-white/12 px-2 py-1"${_scopeId}> fronted `);
              _push2(ssrRenderComponent(_component_money_text, {
                value: unref(myBalance)?.paid ?? 0
              }, null, _parent2, _scopeId));
              _push2(`</span></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("p", {
                    class: "text-[10px] font-600 uppercase tracking-[.1em]",
                    style: { "color": "#9dc2ae" }
                  }, " Your standing here "),
                  createVNode(_component_identity_chip, {
                    participants: unref(bill).participants,
                    "model-value": unref(me)?.id ?? null,
                    "onUpdate:modelValue": unref(setMe)
                  }, null, 8, ["participants", "model-value", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "mt-3 flex gap-5" }, [
                  createVNode("div", null, [
                    createVNode("p", {
                      class: "text-[11px]",
                      style: { "color": "#9dc2ae" }
                    }, "You're owed back"),
                    createVNode("p", {
                      class: "text-xl font-700",
                      style: { "color": "#e7b968" }
                    }, [
                      createVNode(_component_money_text, { value: unref(owedBack) }, null, 8, ["value"])
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("p", {
                      class: "text-[11px]",
                      style: { "color": "#9dc2ae" }
                    }, "You owe"),
                    createVNode("p", {
                      class: "text-xl font-700",
                      style: { "color": "#9ddfb6" }
                    }, [
                      createVNode(_component_money_text, { value: unref(iOwe) }, null, 8, ["value"])
                    ])
                  ])
                ]),
                createVNode("div", { class: "mt-3 flex flex-wrap gap-2 text-[11px] font-600" }, [
                  createVNode("span", { class: "rounded-chip-sm bg-white/12 px-2 py-1" }, toDisplayString(unref(peopleOweMe)) + " people owe you", 1),
                  createVNode("span", { class: "rounded-chip-sm bg-white/12 px-2 py-1" }, [
                    createTextVNode(" fronted "),
                    createVNode(_component_money_text, {
                      value: unref(myBalance)?.paid ?? 0
                    }, null, 8, ["value"])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<p class="eyebrow mb-2 mt-5">Where everyone stands</p><div class="card-parchment overflow-hidden"><div class="grid grid-cols-[1fr_auto_auto] gap-x-4 px-4 py-2 text-[10px] uppercase tracking-wide text-muted"><span>Person</span><span class="text-right">Paid</span><span class="text-right">Balance</span></div><!--[-->`);
        ssrRenderList(unref(balances), (b) => {
          _push(`<div class="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-t border-line-faint px-4 py-2.5"><div class="flex items-center gap-2">`);
          _push(ssrRenderComponent(_component_avatar_badge, {
            "badge-key": badgeOf(b.participantId),
            size: 24
          }, null, _parent));
          _push(`<span class="text-sm">${ssrInterpolate(nameOf(b.participantId))}</span></div>`);
          _push(ssrRenderComponent(_component_money_text, {
            value: b.paid,
            prefix: false,
            class: "text-right text-sm"
          }, null, _parent));
          _push(ssrRenderComponent(_component_money_text, {
            value: b.balance,
            prefix: false,
            signed: "",
            class: "text-right text-sm font-600"
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div><p class="eyebrow mb-2 mt-5">Who settles whom</p><p class="mb-2 text-sm text-body">${ssrInterpolate(unref(transfers).length)} transfer${ssrInterpolate(unref(transfers).length === 1 ? "" : "s")} clear${ssrInterpolate(unref(transfers).length === 1 ? "s" : "")} everyone </p><div class="flex flex-col gap-2"><!--[-->`);
        ssrRenderList(unref(transfers), (t, i) => {
          _push(`<div class="flex items-center gap-2 rounded-card border border-line-light bg-surface-card px-3 py-2.5">`);
          _push(ssrRenderComponent(_component_avatar_badge, {
            "badge-key": badgeOf(t.from),
            size: 26
          }, null, _parent));
          _push(`<span class="text-sm font-600">${ssrInterpolate(nameOf(t.from))}</span><span class="mx-1 flex-1 border-t border-dashed border-line-medium"></span><span class="i-tabler-arrow-right text-muted"></span><span class="text-sm font-600">${ssrInterpolate(nameOf(t.to))}</span>`);
          _push(ssrRenderComponent(_component_avatar_badge, {
            "badge-key": badgeOf(t.to),
            size: 26
          }, null, _parent));
          _push(ssrRenderComponent(_component_money_text, {
            value: t.amount,
            prefix: false,
            class: "ml-2 text-sm font-600"
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]-->`);
        if (!unref(transfers).length) {
          _push(`<p class="py-4 text-center text-sm text-muted"> Everyone is square — nothing to settle. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></main><div class="flex-none border-t border-line-light bg-surface-card px-5 py-3"><div class="app-col flex gap-2">`);
        _push(ssrRenderComponent(_component_core_button, {
          class: "flex-1",
          onClick: ($event) => ("shareToWhatsApp" in _ctx ? _ctx.shareToWhatsApp : unref(shareToWhatsApp))(("settlementRecap" in _ctx ? _ctx.settlementRecap : unref(settlementRecap))(unref(bill), unref(transfers)))
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="i-tabler-brand-whatsapp"${_scopeId}></span> Share `);
            } else {
              return [
                createVNode("span", { class: "i-tabler-brand-whatsapp" }),
                createTextVNode(" Share ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_core_button, {
          variant: "ghost",
          class: "flex-1",
          onClick: ($event) => shareOpen.value = true
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="i-tabler-download"${_scopeId}></span> Export `);
            } else {
              return [
                createVNode("span", { class: "i-tabler-download" }),
                createTextVNode(" Export ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
        _push(ssrRenderComponent(_component_share_export_sheet, {
          open: unref(shareOpen),
          "onUpdate:open": ($event) => isRef(shareOpen) ? shareOpen.value = $event : null,
          bill: unref(bill),
          transfers: unref(transfers)
        }, null, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-1 items-center justify-center p-8 text-muted" }, _attrs))}>Not found.</div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/bill/[id]/settle.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settle-0SNGTK2V.mjs.map
