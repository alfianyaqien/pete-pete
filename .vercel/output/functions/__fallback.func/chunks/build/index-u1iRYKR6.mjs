import { _ as __nuxt_component_0 } from './ScreenHeader-B5cKO51D.mjs';
import { _ as __nuxt_component_1 } from './PpLogo-CpDQ3Vg1.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-BipftbZ7.mjs';
import { _ as __nuxt_component_3 } from './HeroPanel-COg6i5Y_.mjs';
import { defineComponent, ref, computed, withCtx, createVNode, unref, createTextVNode, toDisplayString, isRef, mergeProps, openBlock, createBlock, Fragment, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderAttrs, ssrRenderClass } from 'vue/server-renderer';
import { _ as __nuxt_component_6 } from './SegmentedControl-D3SHLJtL.mjs';
import { _ as __nuxt_component_1$1 } from './AvatarStack-DroGeiEm.mjs';
import { _ as __nuxt_component_2 } from './MoneyText-7CLQgLmQ.mjs';
import { s as seasonStats, b as billStats } from '../_/stats.mjs';
import { e as useBills, f as formatRupiah, g as formatCompact, a as formatDateShort } from './useBill-NokyyOIb.mjs';
import { _ as __nuxt_component_8 } from './BottomNav-D9s6ml1v.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import 'perfect-debounce';
import '@vue/shared';
import './AvatarBadge-Db5SDNyy.mjs';
import '../_/schemas.mjs';
import 'zod';
import '../_/settle.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ProgressBar",
  __ssrInlineRender: true,
  props: {
    segments: {},
    height: { default: 6 }
  },
  setup(__props) {
    const props = __props;
    const total = computed(() => props.segments.reduce((a, s) => a + s.value, 0) || 1);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "flex w-full overflow-hidden rounded-full bg-surface-input",
        style: { height: __props.height + "px" }
      }, _attrs))}><!--[-->`);
      ssrRenderList(__props.segments, (s, i) => {
        _push(`<div style="${ssrRenderStyle({ width: s.value / unref(total) * 100 + "%", background: s.color })}"></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProgressBar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$3, { __name: "ProgressBar" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "StatTile",
  __ssrInlineRender: true,
  props: {
    icon: {},
    label: {},
    value: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card-parchment p-3 text-center" }, _attrs))}><span class="${ssrRenderClass([`i-tabler-${__props.icon}`, "text-lg text-forest"])}"></span><div class="num mt-1 text-lg font-600 text-ink">${ssrInterpolate(__props.value)}</div><div class="text-[10px] uppercase tracking-wide text-muted">${ssrInterpolate(__props.label)}</div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatTile.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$2, { __name: "StatTile" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BillCard",
  __ssrInlineRender: true,
  props: {
    bill: {}
  },
  setup(__props) {
    const props = __props;
    const s = computed(() => billStats(props.bill));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_AvatarStack = __nuxt_component_1$1;
      const _component_MoneyText = __nuxt_component_2;
      const _component_ProgressBar = __nuxt_component_4;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/bill/${__props.bill.id}`,
        class: "block card-parchment p-4"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-start justify-between gap-3"${_scopeId}><div class="min-w-0"${_scopeId}><h3 class="font-serif text-base font-600 text-ink"${_scopeId}>${ssrInterpolate(__props.bill.title)}</h3><p class="mt-0.5 text-xs text-muted"${_scopeId}>${ssrInterpolate(unref(s).souls)} souls · ${ssrInterpolate(unref(s).entries)} entries · ${ssrInterpolate(unref(formatDateShort)(__props.bill.createdAt))}</p><div class="mt-2.5"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AvatarStack, {
              participants: __props.bill.participants,
              max: 6,
              size: 24
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex flex-col items-end gap-1 text-right"${_scopeId}><span class="eyebrow"${_scopeId}>Total</span>`);
            _push2(ssrRenderComponent(_component_MoneyText, {
              value: unref(s).total,
              class: "text-base font-600"
            }, null, _parent2, _scopeId));
            if (__props.bill.lunas) {
              _push2(`<span class="mt-1 flex size-8 items-center justify-center rounded-full border-2 border-terracotta text-[8px] font-700 uppercase leading-none text-terracotta"${_scopeId}> Lunas </span>`);
            } else {
              _push2(`<span class="i-tabler-chevron-right text-muted"${_scopeId}></span>`);
            }
            _push2(`</div></div><div class="mt-3"${_scopeId}>`);
            if (__props.bill.lunas) {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_ProgressBar, { segments: [{ value: 1, color: "#A6492C" }, { value: 1, color: "#C2902F" }] }, null, _parent2, _scopeId));
              _push2(`<p class="mt-1 text-[11px] font-600 text-terracotta"${_scopeId}>🟫 Lunas · cleared</p><!--]-->`);
            } else {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_ProgressBar, {
                segments: [
                  { value: unref(s).settled, color: "#1E4D3A" },
                  { value: Math.max(0, unref(s).souls - unref(s).settled), color: "#C2902F" }
                ]
              }, null, _parent2, _scopeId));
              _push2(`<p class="mt-1 text-[11px] text-muted"${_scopeId}>${ssrInterpolate(unref(s).settled)} / ${ssrInterpolate(unref(s).souls)} settled</p><!--]-->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                createVNode("div", { class: "min-w-0" }, [
                  createVNode("h3", { class: "font-serif text-base font-600 text-ink" }, toDisplayString(__props.bill.title), 1),
                  createVNode("p", { class: "mt-0.5 text-xs text-muted" }, toDisplayString(unref(s).souls) + " souls · " + toDisplayString(unref(s).entries) + " entries · " + toDisplayString(unref(formatDateShort)(__props.bill.createdAt)), 1),
                  createVNode("div", { class: "mt-2.5" }, [
                    createVNode(_component_AvatarStack, {
                      participants: __props.bill.participants,
                      max: 6,
                      size: 24
                    }, null, 8, ["participants"])
                  ])
                ]),
                createVNode("div", { class: "flex flex-col items-end gap-1 text-right" }, [
                  createVNode("span", { class: "eyebrow" }, "Total"),
                  createVNode(_component_MoneyText, {
                    value: unref(s).total,
                    class: "text-base font-600"
                  }, null, 8, ["value"]),
                  __props.bill.lunas ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "mt-1 flex size-8 items-center justify-center rounded-full border-2 border-terracotta text-[8px] font-700 uppercase leading-none text-terracotta"
                  }, " Lunas ")) : (openBlock(), createBlock("span", {
                    key: 1,
                    class: "i-tabler-chevron-right text-muted"
                  }))
                ])
              ]),
              createVNode("div", { class: "mt-3" }, [
                __props.bill.lunas ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                  createVNode(_component_ProgressBar, { segments: [{ value: 1, color: "#A6492C" }, { value: 1, color: "#C2902F" }] }),
                  createVNode("p", { class: "mt-1 text-[11px] font-600 text-terracotta" }, "🟫 Lunas · cleared")
                ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                  createVNode(_component_ProgressBar, {
                    segments: [
                      { value: unref(s).settled, color: "#1E4D3A" },
                      { value: Math.max(0, unref(s).souls - unref(s).settled), color: "#C2902F" }
                    ]
                  }, null, 8, ["segments"]),
                  createVNode("p", { class: "mt-1 text-[11px] text-muted" }, toDisplayString(unref(s).settled) + " / " + toDisplayString(unref(s).souls) + " settled", 1)
                ], 64))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BillCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$1, { __name: "BillCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { data: bills } = useBills();
    const filter = ref("all");
    const filterOptions = [
      { label: "All", value: "all" },
      { label: "Open", value: "open" },
      { label: "Lunas", value: "lunas" }
    ];
    const hasBills = computed(() => (bills.value?.length ?? 0) > 0);
    const season = computed(() => seasonStats(bills.value ?? []));
    const avgPerTrip = computed(() => season.value.total / Math.max(1, bills.value?.length ?? 1));
    const filtered = computed(() => {
      const list = bills.value ?? [];
      if (filter.value === "open") return list.filter((b) => !b.lunas);
      if (filter.value === "lunas") return list.filter((b) => b.lunas);
      return list;
    });
    const monthChip = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(
      /* @__PURE__ */ new Date()
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ScreenHeader = __nuxt_component_0;
      const _component_PpLogo = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_HeroPanel = __nuxt_component_3;
      const _component_ProgressBar = __nuxt_component_4;
      const _component_StatTile = __nuxt_component_5;
      const _component_SegmentedControl = __nuxt_component_6;
      const _component_BillCard = __nuxt_component_7;
      const _component_BottomNav = __nuxt_component_8;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_ScreenHeader, {
        eyebrow: "Ledger",
        title: "Your expeditions"
      }, {
        brand: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_PpLogo, { size: 34 }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_PpLogo, { size: 34 })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<main class="relative flex-1 overflow-y-auto px-5 pb-24 pt-4">`);
      if (!unref(hasBills)) {
        _push(`<div class="flex flex-col items-center pt-16 text-center"><svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true"><circle cx="60" cy="60" r="52" stroke="#C9B894" stroke-width="2" stroke-dasharray="5 7"></circle><path d="M44 50 Q44 40 60 40 Q76 40 76 50 L80 84 Q80 90 74 90 L46 90 Q40 90 40 84 Z" fill="#E7D9BC" stroke="#1E4D3A" stroke-width="2"></path><path d="M52 40 Q52 32 60 32 Q68 32 68 40" stroke="#1E4D3A" stroke-width="2" fill="none"></path><path d="M50 64 L70 64" stroke="#1E4D3A" stroke-width="2"></path></svg><h2 class="mt-5 font-serif text-xl font-700 text-ink">No expeditions logged yet</h2><p class="mt-2 max-w-xs text-sm text-body"> Start a trip ledger, add who came along, and split your first expense. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/bill/new",
          class: "btn-forest mt-6"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="i-tabler-plus"${_scopeId}></span> Create bill `);
            } else {
              return [
                createVNode("span", { class: "i-tabler-plus" }),
                createTextVNode(" Create bill ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_HeroPanel, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center justify-between"${_scopeId}><p class="text-[10px] font-600 uppercase tracking-[.1em]" style="${ssrRenderStyle({ "color": "#9dc2ae" })}"${_scopeId}> Trip ledger · this season </p><span class="rounded-pill bg-white/12 px-2 py-0.5 text-[11px] font-600"${_scopeId}>${ssrInterpolate(unref(monthChip))}</span></div><div class="num mt-2 text-3xl font-700"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(unref(season).total))}</div><p class="mt-1 text-xs" style="${ssrRenderStyle({ "color": "#9dc2ae" })}"${_scopeId}> logged across ${ssrInterpolate(unref(bills)?.length)} expeditions · ${ssrInterpolate(unref(season).souls)} souls </p><div class="mt-4 flex gap-4 text-sm"${_scopeId}><div${_scopeId}><p class="text-[11px]" style="${ssrRenderStyle({ "color": "#9dc2ae" })}"${_scopeId}>Still unsettled</p><p class="num font-600" style="${ssrRenderStyle({ "color": "#e7b968" })}"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(unref(season).unsettled))}</p></div><div${_scopeId}><p class="text-[11px]" style="${ssrRenderStyle({ "color": "#9dc2ae" })}"${_scopeId}>Cleared</p><p class="num font-600" style="${ssrRenderStyle({ "color": "#9ddfb6" })}"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(unref(season).cleared))}</p></div></div><div class="mt-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_ProgressBar, {
                segments: [
                  { value: unref(season).cleared, color: "#5FB07E" },
                  { value: unref(season).unsettled, color: "#E0A53C" }
                ]
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="mt-3 flex flex-wrap gap-2 text-[11px] font-600"${_scopeId}><span class="rounded-chip-sm bg-white/12 px-2 py-1"${_scopeId}>${ssrInterpolate(unref(season).open)} open</span><span class="rounded-chip-sm bg-white/12 px-2 py-1"${_scopeId}>🟫 ${ssrInterpolate(unref(season).lunas)} lunas</span><span class="rounded-chip-sm bg-white/12 px-2 py-1"${_scopeId}>${ssrInterpolate(unref(season).souls)} souls</span></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("p", {
                    class: "text-[10px] font-600 uppercase tracking-[.1em]",
                    style: { "color": "#9dc2ae" }
                  }, " Trip ledger · this season "),
                  createVNode("span", { class: "rounded-pill bg-white/12 px-2 py-0.5 text-[11px] font-600" }, toDisplayString(unref(monthChip)), 1)
                ]),
                createVNode("div", { class: "num mt-2 text-3xl font-700" }, toDisplayString(unref(formatRupiah)(unref(season).total)), 1),
                createVNode("p", {
                  class: "mt-1 text-xs",
                  style: { "color": "#9dc2ae" }
                }, " logged across " + toDisplayString(unref(bills)?.length) + " expeditions · " + toDisplayString(unref(season).souls) + " souls ", 1),
                createVNode("div", { class: "mt-4 flex gap-4 text-sm" }, [
                  createVNode("div", null, [
                    createVNode("p", {
                      class: "text-[11px]",
                      style: { "color": "#9dc2ae" }
                    }, "Still unsettled"),
                    createVNode("p", {
                      class: "num font-600",
                      style: { "color": "#e7b968" }
                    }, toDisplayString(unref(formatRupiah)(unref(season).unsettled)), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("p", {
                      class: "text-[11px]",
                      style: { "color": "#9dc2ae" }
                    }, "Cleared"),
                    createVNode("p", {
                      class: "num font-600",
                      style: { "color": "#9ddfb6" }
                    }, toDisplayString(unref(formatRupiah)(unref(season).cleared)), 1)
                  ])
                ]),
                createVNode("div", { class: "mt-3" }, [
                  createVNode(_component_ProgressBar, {
                    segments: [
                      { value: unref(season).cleared, color: "#5FB07E" },
                      { value: unref(season).unsettled, color: "#E0A53C" }
                    ]
                  }, null, 8, ["segments"])
                ]),
                createVNode("div", { class: "mt-3 flex flex-wrap gap-2 text-[11px] font-600" }, [
                  createVNode("span", { class: "rounded-chip-sm bg-white/12 px-2 py-1" }, toDisplayString(unref(season).open) + " open", 1),
                  createVNode("span", { class: "rounded-chip-sm bg-white/12 px-2 py-1" }, "🟫 " + toDisplayString(unref(season).lunas) + " lunas", 1),
                  createVNode("span", { class: "rounded-chip-sm bg-white/12 px-2 py-1" }, toDisplayString(unref(season).souls) + " souls", 1)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="mt-4 grid grid-cols-3 gap-2">`);
        _push(ssrRenderComponent(_component_StatTile, {
          icon: "mountain",
          label: "Expeditions",
          value: String(unref(bills)?.length ?? 0)
        }, null, _parent));
        _push(ssrRenderComponent(_component_StatTile, {
          icon: "users",
          label: "Souls along",
          value: String(unref(season).souls)
        }, null, _parent));
        _push(ssrRenderComponent(_component_StatTile, {
          icon: "route",
          label: "Avg / trip",
          value: unref(formatCompact)(unref(avgPerTrip))
        }, null, _parent));
        _push(`</div><div class="mb-3 mt-6 flex items-center justify-between gap-3"><h2 class="font-serif text-lg font-600 text-ink">Expeditions</h2><div class="w-44">`);
        _push(ssrRenderComponent(_component_SegmentedControl, {
          modelValue: unref(filter),
          "onUpdate:modelValue": ($event) => isRef(filter) ? filter.value = $event : null,
          options: filterOptions
        }, null, _parent));
        _push(`</div></div><div class="flex flex-col gap-3"><!--[-->`);
        ssrRenderList(unref(filtered), (b) => {
          _push(ssrRenderComponent(_component_BillCard, {
            key: b.id,
            bill: b
          }, null, _parent));
        });
        _push(`<!--]-->`);
        if (unref(filtered).length === 0) {
          _push(`<p class="py-6 text-center text-sm text-muted"> No ${ssrInterpolate(unref(filter))} expeditions. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><!--]-->`);
      }
      _push(`</main>`);
      if (unref(hasBills)) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/bill/new",
          class: "absolute bottom-20 right-5 z-20 flex size-14 items-center justify-center rounded-full bg-forest text-surface-card shadow-card",
          "aria-label": "Create bill"
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
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_BottomNav, { active: "home" }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-u1iRYKR6.mjs.map
