import { _ as __nuxt_component_0 } from './ScreenHeader-B5cKO51D.mjs';
import { _ as __nuxt_component_6 } from './SegmentedControl-D3SHLJtL.mjs';
import { _ as __nuxt_component_0$1 } from './AvatarBadge-Db5SDNyy.mjs';
import { _ as __nuxt_component_2 } from './MoneyText-7CLQgLmQ.mjs';
import { _ as __nuxt_component_1 } from './AvatarStack-DroGeiEm.mjs';
import { _ as __nuxt_component_0$2 } from './BottomSheet-Cu9tTmnK.mjs';
import { defineComponent, withAsyncContext, reactive, watch, computed, ref, unref, isRef, useModel, mergeProps, withCtx, createVNode, withDirectives, vModelText, toDisplayString, createTextVNode, openBlock, createBlock, Fragment, renderList, mergeModels, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useBill, c as useIdentity, f as formatRupiah } from './useBill-NokyyOIb.mjs';
import { a as useRoute, n as navigateTo } from './server.mjs';
import { s as splitProportional, b as sharedOrderTotal } from '../_/settle.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AddOrderItem",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    participants: {}
  }, {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["save"], ["update:open"]),
  setup(__props, { emit: __emit }) {
    const open = useModel(__props, "open");
    const props = __props;
    const emit = __emit;
    const draft = reactive({ name: "", qty: 1, priceEach: 0, orderedBy: [] });
    watch(open, (o) => {
      if (o) Object.assign(draft, { name: "", qty: 1, priceEach: 0, orderedBy: [] });
    });
    function toggle(id) {
      const i = draft.orderedBy.indexOf(id);
      if (i >= 0) draft.orderedBy.splice(i, 1);
      else draft.orderedBy.push(id);
    }
    const allChecked = computed(() => draft.orderedBy.length === props.participants.length);
    function checkAll() {
      draft.orderedBy = allChecked.value ? [] : props.participants.map((p) => p.id);
    }
    const lineTotal = computed(() => draft.qty * draft.priceEach);
    const valid = computed(
      () => draft.name.trim().length > 0 && draft.qty > 0 && draft.orderedBy.length > 0
    );
    function save() {
      if (!valid.value) return;
      emit("save", {
        name: draft.name.trim(),
        qty: draft.qty,
        priceEach: draft.priceEach,
        orderedBy: [...draft.orderedBy]
      });
      open.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BottomSheet = __nuxt_component_0$2;
      const _component_AvatarBadge = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_BottomSheet, mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event,
        title: "Add order item"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<label class="block"${_scopeId}><span class="eyebrow"${_scopeId}>Item</span><input${ssrRenderAttr("value", unref(draft).name)} placeholder="Ayam bakar" class="mt-1.5 w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 text-ink focus:border-forest focus:outline-none"${_scopeId}></label><div class="mt-3 flex gap-3"${_scopeId}><div${_scopeId}><span class="eyebrow"${_scopeId}>Qty</span><div class="mt-1.5 flex items-center gap-2 rounded-control bg-surface-input px-2 py-1.5"${_scopeId}><button type="button" class="text-forest"${_scopeId}><span class="i-tabler-minus"${_scopeId}></span></button><span class="num w-6 text-center font-600"${_scopeId}>${ssrInterpolate(unref(draft).qty)}</span><button type="button" class="text-forest"${_scopeId}><span class="i-tabler-plus"${_scopeId}></span></button></div></div><label class="flex-1"${_scopeId}><span class="eyebrow"${_scopeId}>Price each</span><input${ssrRenderAttr("value", unref(draft).priceEach)} type="number" min="0" placeholder="45000" class="mt-1.5 w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 text-ink focus:border-forest focus:outline-none"${_scopeId}></label></div><div class="mb-2 mt-4 flex items-center justify-between"${_scopeId}><span class="eyebrow"${_scopeId}>Ordered by</span><button type="button" class="text-xs font-600 text-forest"${_scopeId}><span class="i-tabler-checks"${_scopeId}></span> ${ssrInterpolate(unref(allChecked) ? "Clear" : "Check all")}</button></div><div class="grid grid-cols-3 gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(__props.participants, (p) => {
              _push2(`<button type="button" class="${ssrRenderClass([
                unref(draft).orderedBy.includes(p.id) ? "border-forest bg-forest text-white" : "border-line-light bg-surface-card text-body",
                "flex items-center gap-1.5 rounded-control border px-2 py-1.5 text-xs font-600 transition-colors"
              ])}"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_AvatarBadge, {
                "badge-key": p.badgeKey,
                size: 18
              }, null, _parent2, _scopeId));
              _push2(`<span class="truncate"${_scopeId}>${ssrInterpolate(p.name)}</span></button>`);
            });
            _push2(`<!--]--></div><div class="rule-double mt-4 flex items-center justify-between pt-3"${_scopeId}><span class="text-sm text-body"${_scopeId}> Line total · split ${ssrInterpolate(unref(draft).orderedBy.length || 0)} ways </span><span class="num font-600"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(unref(lineTotal)))}</span></div><div class="mt-4 flex gap-2"${_scopeId}><button type="button" class="btn-ghost flex-1"${_scopeId}>Cancel</button><button type="button" class="btn-forest flex-1"${ssrIncludeBooleanAttr(!unref(valid)) ? " disabled" : ""}${_scopeId}> Save item </button></div>`);
          } else {
            return [
              createVNode("label", { class: "block" }, [
                createVNode("span", { class: "eyebrow" }, "Item"),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => unref(draft).name = $event,
                  placeholder: "Ayam bakar",
                  class: "mt-1.5 w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 text-ink focus:border-forest focus:outline-none"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, unref(draft).name]
                ])
              ]),
              createVNode("div", { class: "mt-3 flex gap-3" }, [
                createVNode("div", null, [
                  createVNode("span", { class: "eyebrow" }, "Qty"),
                  createVNode("div", { class: "mt-1.5 flex items-center gap-2 rounded-control bg-surface-input px-2 py-1.5" }, [
                    createVNode("button", {
                      type: "button",
                      class: "text-forest",
                      onClick: ($event) => unref(draft).qty = Math.max(1, unref(draft).qty - 1)
                    }, [
                      createVNode("span", { class: "i-tabler-minus" })
                    ], 8, ["onClick"]),
                    createVNode("span", { class: "num w-6 text-center font-600" }, toDisplayString(unref(draft).qty), 1),
                    createVNode("button", {
                      type: "button",
                      class: "text-forest",
                      onClick: ($event) => unref(draft).qty++
                    }, [
                      createVNode("span", { class: "i-tabler-plus" })
                    ], 8, ["onClick"])
                  ])
                ]),
                createVNode("label", { class: "flex-1" }, [
                  createVNode("span", { class: "eyebrow" }, "Price each"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(draft).priceEach = $event,
                    type: "number",
                    min: "0",
                    placeholder: "45000",
                    class: "mt-1.5 w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 text-ink focus:border-forest focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [
                      vModelText,
                      unref(draft).priceEach,
                      void 0,
                      { number: true }
                    ]
                  ])
                ])
              ]),
              createVNode("div", { class: "mb-2 mt-4 flex items-center justify-between" }, [
                createVNode("span", { class: "eyebrow" }, "Ordered by"),
                createVNode("button", {
                  type: "button",
                  class: "text-xs font-600 text-forest",
                  onClick: checkAll
                }, [
                  createVNode("span", { class: "i-tabler-checks" }),
                  createTextVNode(" " + toDisplayString(unref(allChecked) ? "Clear" : "Check all"), 1)
                ])
              ]),
              createVNode("div", { class: "grid grid-cols-3 gap-2" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.participants, (p) => {
                  return openBlock(), createBlock("button", {
                    key: p.id,
                    type: "button",
                    class: [
                      "flex items-center gap-1.5 rounded-control border px-2 py-1.5 text-xs font-600 transition-colors",
                      unref(draft).orderedBy.includes(p.id) ? "border-forest bg-forest text-white" : "border-line-light bg-surface-card text-body"
                    ],
                    onClick: ($event) => toggle(p.id)
                  }, [
                    createVNode(_component_AvatarBadge, {
                      "badge-key": p.badgeKey,
                      size: 18
                    }, null, 8, ["badge-key"]),
                    createVNode("span", { class: "truncate" }, toDisplayString(p.name), 1)
                  ], 10, ["onClick"]);
                }), 128))
              ]),
              createVNode("div", { class: "rule-double mt-4 flex items-center justify-between pt-3" }, [
                createVNode("span", { class: "text-sm text-body" }, " Line total · split " + toDisplayString(unref(draft).orderedBy.length || 0) + " ways ", 1),
                createVNode("span", { class: "num font-600" }, toDisplayString(unref(formatRupiah)(unref(lineTotal))), 1)
              ]),
              createVNode("div", { class: "mt-4 flex gap-2" }, [
                createVNode("button", {
                  type: "button",
                  class: "btn-ghost flex-1",
                  onClick: ($event) => open.value = false
                }, "Cancel", 8, ["onClick"]),
                createVNode("button", {
                  type: "button",
                  class: "btn-forest flex-1",
                  disabled: !unref(valid),
                  onClick: save
                }, " Save item ", 8, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddOrderItem.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "AddOrderItem" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "add",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const id = route.params.id;
    const editId = route.query.entry;
    const { data: bill } = ([__temp, __restore] = withAsyncContext(() => useBill(id)), __temp = await __temp, __restore(), __temp);
    const { me } = useIdentity(bill);
    const f = reactive({
      type: "simple",
      title: "",
      amount: 0,
      // simple
      payerMode: "one",
      payerId: "",
      payers: [],
      shareMethod: "equally",
      sharerIds: [],
      exactShares: {},
      // shared order
      items: [],
      fees: { taxPercent: 0, service: 0, other: 0 },
      discount: 0
    });
    const typeOptions = [
      { label: "Simple", value: "simple" },
      { label: "Shared order", value: "shared_order" }
    ];
    const payerModeOptions = [
      { label: "One person", value: "one" },
      { label: "Several people", value: "several" }
    ];
    const shareMethodOptions = [
      { label: "Equally", value: "equally" },
      { label: "By exact amount", value: "exact" }
    ];
    let initialized = false;
    watch(
      bill,
      (b) => {
        if (!b || initialized) return;
        f.payerId = me.value?.id ?? b.participants[0]?.id ?? "";
        f.sharerIds = b.participants.map((p) => p.id);
        f.payers = b.participants.map((p) => ({ participantId: p.id, amount: 0 }));
        if (editId) prefill();
        initialized = true;
      },
      { immediate: true }
    );
    function prefill() {
      const e = bill.value?.entries.find((x) => x.id === editId);
      if (!e) return;
      f.type = e.type;
      f.title = e.title;
      if (e.type === "simple") {
        f.amount = e.amount;
        f.payerMode = e.payers.length > 1 ? "several" : "one";
        f.payerId = e.payers[0]?.participantId ?? f.payerId;
        f.payers = (bill.value?.participants ?? []).map((p) => ({
          participantId: p.id,
          amount: e.payers.find((x) => x.participantId === p.id)?.amount ?? 0
        }));
        f.shareMethod = e.shareMethod;
        f.sharerIds = e.sharers.map((s) => s.participantId);
        f.exactShares = Object.fromEntries(e.sharers.map((s) => [s.participantId, s.share]));
      } else {
        f.payerId = e.payerId;
        f.items = e.items.map((it) => ({ ...it }));
        f.fees = { ...e.fees };
        f.discount = e.discount;
      }
    }
    const nameOf = (pid) => bill.value?.participants.find((p) => p.id === pid)?.name ?? "?";
    const equalSplit = computed(() => {
      if (!f.sharerIds.length) return {};
      const parts = splitProportional(f.amount || 0, f.sharerIds.map(() => 1));
      return Object.fromEntries(f.sharerIds.map((pid, i) => [pid, parts[i]]));
    });
    const shareOf = (pid) => f.shareMethod === "equally" ? equalSplit.value[pid] ?? 0 : f.exactShares[pid] ?? 0;
    const allShared = computed(() => f.sharerIds.length === (bill.value?.participants.length ?? 0));
    const sheetOpen = ref(false);
    function onSaveItem(item) {
      f.items.push({ ...item, id: "tmp-" + Math.random().toString(36).slice(2) });
    }
    const sharedSubtotal = computed(
      () => sharedOrderTotal({
        title: f.title || "x",
        payerId: f.payerId || "x",
        items: f.items.length ? f.items.map((it) => ({ ...it, id: it.id })) : [{ id: "z", name: "z", qty: 1, priceEach: 0, orderedBy: ["z"] }],
        fees: f.fees,
        discount: f.discount
      })
    );
    const error = ref("");
    const submitting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ScreenHeader = __nuxt_component_0;
      const _component_SegmentedControl = __nuxt_component_6;
      const _component_AvatarBadge = __nuxt_component_0$1;
      const _component_MoneyText = __nuxt_component_2;
      const _component_AvatarStack = __nuxt_component_1;
      const _component_AddOrderItem = __nuxt_component_5;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_ScreenHeader, {
        back: "",
        title: unref(editId) ? "Edit expense" : "Add expense",
        onBack: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/bill/${unref(id)}`)
      }, null, _parent));
      if (unref(bill)) {
        _push(`<main class="flex-1 overflow-y-auto px-5 pb-28 pt-4">`);
        _push(ssrRenderComponent(_component_SegmentedControl, {
          modelValue: unref(f).type,
          "onUpdate:modelValue": ($event) => unref(f).type = $event,
          options: typeOptions,
          accent: unref(f).type === "shared_order" ? "ochre" : "forest"
        }, null, _parent));
        _push(`<label class="mt-4 block"><span class="eyebrow">What for</span><input${ssrRenderAttr("value", unref(f).title)}${ssrRenderAttr("placeholder", unref(f).type === "simple" ? "Gasoline" : "Warung dinner")} class="mt-1.5 w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 text-ink focus:border-forest focus:outline-none"></label>`);
        if (unref(f).type === "simple") {
          _push(`<!--[--><label class="mt-3 block"><span class="eyebrow">Amount</span><input${ssrRenderAttr("value", unref(f).amount)} type="number" min="0" placeholder="320000" class="mt-1.5 w-full rounded-control border-2 border-forest bg-surface-input px-3 py-2.5 text-ink focus:outline-none"></label><div class="mt-5 flex items-center gap-2"><span class="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-700 text-surface-card">1</span><span class="font-serif text-base font-600">Who paid up front</span></div><div class="mt-2">`);
          _push(ssrRenderComponent(_component_SegmentedControl, {
            modelValue: unref(f).payerMode,
            "onUpdate:modelValue": ($event) => unref(f).payerMode = $event,
            options: payerModeOptions
          }, null, _parent));
          _push(`</div>`);
          if (unref(f).payerMode === "one") {
            _push(`<div class="mt-2 flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2.5">`);
            if (unref(f).payerId) {
              _push(ssrRenderComponent(_component_AvatarBadge, {
                "badge-key": unref(bill).participants.find((p) => p.id === unref(f).payerId).badgeKey,
                size: 34
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="flex-1"><select class="w-full bg-transparent font-600 text-ink focus:outline-none"><!--[-->`);
            ssrRenderList(unref(bill).participants, (p) => {
              _push(`<option${ssrRenderAttr("value", p.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(f).payerId) ? ssrLooseContain(unref(f).payerId, p.id) : ssrLooseEqual(unref(f).payerId, p.id)) ? " selected" : ""}>${ssrInterpolate(p.name)}</option>`);
            });
            _push(`<!--]--></select><p class="text-xs text-muted">fronts the whole amount</p></div>`);
            _push(ssrRenderComponent(_component_MoneyText, {
              value: unref(f).amount,
              class: "text-sm font-600"
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<div class="mt-2 flex flex-col gap-2"><!--[-->`);
            ssrRenderList(unref(bill).participants, (p) => {
              _push(`<div class="flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2">`);
              _push(ssrRenderComponent(_component_AvatarBadge, {
                "badge-key": p.badgeKey,
                size: 28
              }, null, _parent));
              _push(`<span class="flex-1 text-sm">${ssrInterpolate(p.name)}</span><input${ssrRenderAttr("value", unref(f).payers.find((x) => x.participantId === p.id).amount)} type="number" min="0" class="w-28 rounded-control bg-surface-input px-2 py-1.5 text-right text-sm"></div>`);
            });
            _push(`<!--]--></div>`);
          }
          _push(`<div class="mt-5 flex items-center gap-2"><span class="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-700 text-surface-card">2</span><span class="font-serif text-base font-600">Who shares the cost</span></div><div class="mt-2">`);
          _push(ssrRenderComponent(_component_SegmentedControl, {
            modelValue: unref(f).shareMethod,
            "onUpdate:modelValue": ($event) => unref(f).shareMethod = $event,
            options: shareMethodOptions
          }, null, _parent));
          _push(`</div><div class="chip-pos mt-3 w-full justify-center py-2 text-center"> Split <b class="mx-1">${ssrInterpolate(unref(f).sharerIds.length)} ways</b>`);
          if (unref(f).shareMethod === "equally" && unref(f).payerMode === "one") {
            _push(`<!--[--> · each owes ${ssrInterpolate(nameOf(unref(f).payerId))} ${ssrInterpolate(unref(formatRupiah)(unref(equalSplit)[unref(f).sharerIds[0]] ?? 0))}<!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><button type="button" class="mt-3 text-xs font-600 text-forest"><span class="i-tabler-check"></span> ${ssrInterpolate(unref(allShared) ? "Clear all" : "Select all")}</button><div class="mt-2 flex flex-col gap-2"><!--[-->`);
          ssrRenderList(unref(bill).participants, (p) => {
            _push(`<div class="${ssrRenderClass([unref(f).sharerIds.includes(p.id) ? "" : "opacity-70", "flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2 transition-opacity"])}">`);
            _push(ssrRenderComponent(_component_AvatarBadge, {
              "badge-key": p.badgeKey,
              size: 28
            }, null, _parent));
            _push(`<div class="flex-1"><span class="text-sm font-600">${ssrInterpolate(p.name)}</span>`);
            if (!unref(f).sharerIds.includes(p.id)) {
              _push(`<p class="text-xs text-muted">not sharing</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
            if (unref(f).sharerIds.includes(p.id) && unref(f).shareMethod === "exact") {
              _push(`<input${ssrRenderAttr("value", unref(f).exactShares[p.id])} type="number" min="0" class="w-24 rounded-control bg-surface-input px-2 py-1 text-right text-sm">`);
            } else if (unref(f).sharerIds.includes(p.id)) {
              _push(ssrRenderComponent(_component_MoneyText, {
                value: shareOf(p.id),
                class: "text-sm"
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`<button type="button" class="${ssrRenderClass([unref(f).sharerIds.includes(p.id) ? "border-forest bg-forest text-white" : "border-line-medium text-transparent", "flex size-6 items-center justify-center rounded-chip-sm border"])}"><span class="i-tabler-check text-xs"></span></button></div>`);
          });
          _push(`<!--]--></div><!--]-->`);
        } else {
          _push(`<!--[--><div class="mt-3 flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2.5"><span class="eyebrow">Paid by</span>`);
          if (unref(f).payerId) {
            _push(ssrRenderComponent(_component_AvatarBadge, {
              "badge-key": unref(bill).participants.find((p) => p.id === unref(f).payerId).badgeKey,
              size: 28
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<select class="flex-1 bg-transparent font-600 text-ink focus:outline-none"><!--[-->`);
          ssrRenderList(unref(bill).participants, (p) => {
            _push(`<option${ssrRenderAttr("value", p.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(f).payerId) ? ssrLooseContain(unref(f).payerId, p.id) : ssrLooseEqual(unref(f).payerId, p.id)) ? " selected" : ""}>${ssrInterpolate(p.name)}</option>`);
          });
          _push(`<!--]--></select></div><button type="button" class="mt-3 flex w-full items-center justify-center gap-2 rounded-card border border-dashed border-line-medium bg-surface-subtle py-3 text-sm font-600 text-body"><span class="i-tabler-camera text-ochre"></span> Scan receipt · auto-fill items </button><div class="mb-2 mt-5 flex items-center justify-between"><span class="eyebrow">Orders</span><span class="text-xs text-muted">${ssrInterpolate(unref(f).items.length)} items</span></div><div class="flex flex-col gap-2"><!--[-->`);
          ssrRenderList(unref(f).items, (it, i) => {
            _push(`<div class="flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2"><div class="flex-1"><p class="text-sm font-600">${ssrInterpolate(it.name)} ×${ssrInterpolate(it.qty)}</p>`);
            _push(ssrRenderComponent(_component_AvatarStack, {
              participants: it.orderedBy.map((pid) => unref(bill).participants.find((p) => p.id === pid)).filter(Boolean),
              max: 5,
              size: 18
            }, null, _parent));
            _push(`</div>`);
            _push(ssrRenderComponent(_component_MoneyText, {
              value: it.qty * it.priceEach,
              class: "text-sm font-600"
            }, null, _parent));
            _push(`<button type="button" class="text-terracotta"><span class="i-tabler-x"></span></button></div>`);
          });
          _push(`<!--]--><button type="button" class="flex items-center justify-center gap-2 rounded-card border border-dashed border-line-medium bg-surface-subtle py-2.5 text-sm font-600 text-forest"><span class="i-tabler-plus"></span> Add order </button></div><div class="mt-5"><span class="eyebrow">Fees &amp; discount</span><div class="mt-2 flex flex-col gap-2 rounded-card border border-line-light bg-surface-card p-3 text-sm"><label class="flex items-center justify-between gap-2"><span>Tax (%)</span><input${ssrRenderAttr("value", unref(f).fees.taxPercent)} type="number" min="0" class="w-24 rounded-control bg-surface-input px-2 py-1 text-right"></label><label class="flex items-center justify-between gap-2"><span>Service</span><input${ssrRenderAttr("value", unref(f).fees.service)} type="number" min="0" class="w-28 rounded-control bg-surface-input px-2 py-1 text-right"></label><label class="flex items-center justify-between gap-2"><span>Other fee</span><input${ssrRenderAttr("value", unref(f).fees.other)} type="number" min="0" class="w-28 rounded-control bg-surface-input px-2 py-1 text-right"></label><label class="flex items-center justify-between gap-2 text-terracotta"><span>Discount</span><input${ssrRenderAttr("value", unref(f).discount)} type="number" min="0" class="w-28 rounded-control bg-surface-input px-2 py-1 text-right"></label></div></div><div class="rule-double mt-4 flex items-center justify-between pt-3"><span class="eyebrow">Subtotal</span>`);
          _push(ssrRenderComponent(_component_MoneyText, {
            value: unref(sharedSubtotal),
            class: "text-xl font-600"
          }, null, _parent));
          _push(`</div>`);
          _push(ssrRenderComponent(_component_AddOrderItem, {
            open: unref(sheetOpen),
            "onUpdate:open": ($event) => isRef(sheetOpen) ? sheetOpen.value = $event : null,
            participants: unref(bill).participants,
            onSave: onSaveItem
          }, null, _parent));
          _push(`<!--]-->`);
        }
        if (unref(error)) {
          _push(`<p class="chip-neg mt-4">${ssrInterpolate(unref(error))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</main>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="border-t border-line-light bg-surface-card px-5 py-3"><button class="btn-forest w-full"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}>${ssrInterpolate(unref(editId) ? "Save changes" : "Add expense")}</button></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/bill/[id]/add.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=add-gG_Up2Z8.mjs.map
