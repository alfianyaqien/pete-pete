import { _ as __nuxt_component_0 } from './screen-header-ugST2aQ7.mjs';
import { _ as __nuxt_component_6 } from './core-segmented-control-D0OMPWpk.mjs';
import { u as useForm, _ as __nuxt_component_1, b as useField, t as toTypedSchema } from './vee-validate-zod-BpRQT81S.mjs';
import { _ as __nuxt_component_0$1 } from './avatar-badge-bLaz6-lC.mjs';
import { defineComponent, withAsyncContext, computed, ref, unref, isRef, withCtx, createTextVNode, toDisplayString, mergeProps, useModel, watch, createVNode, withModifiers, openBlock, createBlock, Fragment, renderList, mergeModels, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as __nuxt_component_2 } from './money-text-BOdOvFz2.mjs';
import { _ as __nuxt_component_1$1 } from './avatar-stack-BSc6BmaN.mjs';
import { _ as __nuxt_component_0$2 } from './core-modal-WUn7wjMe.mjs';
import { _ as __nuxt_component_2$1 } from './core-button-CuYm2Y1l.mjs';
import { e as entryInputSchema, o as orderItemSchema } from '../_/schemas.mjs';
import { u as useBill, c as useIdentity, f as formatRupiah } from './useBill-_9lklAAl.mjs';
import { a as useRoute, n as navigateTo } from './server.mjs';
import { s as splitProportional, b as sharedOrderTotal } from '../_/settle.mjs';
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
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import 'perfect-debounce';
import '@vue/shared';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "core-select",
  __ssrInlineRender: true,
  props: {
    options: {},
    name: {},
    modelValue: {},
    label: {},
    variant: { default: "field" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const field = props.name ? useField(() => props.name) : null;
    const value = computed({
      get: () => field ? field.value.value : props.modelValue,
      set: (v) => {
        if (field) field.value.value = v;
        else emit("update:modelValue", v);
      }
    });
    const error = computed(() => field?.errorMessage.value);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<label${ssrRenderAttrs(mergeProps({ class: "block" }, _attrs))}>`);
      if (__props.label) {
        _push(`<span class="eyebrow">${ssrInterpolate(__props.label)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([[__props.variant === "bare" ? "flex-1" : "w-full", __props.label ? "mt-1.5" : ""], "relative"])}"><select class="${ssrRenderClass(__props.variant === "bare" ? "select-bare" : "select-field")}"><!--[-->`);
      ssrRenderList(__props.options, (o) => {
        _push(`<option${ssrRenderAttr("value", o.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(value)) ? ssrLooseContain(unref(value), o.value) : ssrLooseEqual(unref(value), o.value)) ? " selected" : ""}>${ssrInterpolate(o.label)}</option>`);
      });
      _push(`<!--]--></select><span class="${ssrRenderClass([__props.variant === "bare" ? "right-0 text-xs" : "right-3 text-sm", "i-tabler-chevron-down pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted"])}"></span></div>`);
      if (unref(error)) {
        _push(`<span class="mt-1 block text-xs text-terracotta">${ssrInterpolate(unref(error))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/core-select.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$2, { __name: "CoreSelect" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "add-order-item",
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
    const { handleSubmit, values, setFieldValue, resetForm } = useForm({
      validationSchema: toTypedSchema(orderItemSchema.omit({ id: true })),
      initialValues: { name: "", qty: 1, priceEach: 0, orderedBy: [] }
    });
    watch(open, (o) => {
      if (o) resetForm({ values: { name: "", qty: 1, priceEach: 0, orderedBy: [] } });
    });
    function setQty(n) {
      setFieldValue("qty", Math.max(1, n));
    }
    function toggle(id) {
      const next = [...values.orderedBy];
      const i = next.indexOf(id);
      if (i >= 0) next.splice(i, 1);
      else next.push(id);
      setFieldValue("orderedBy", next);
    }
    const allChecked = computed(() => values.orderedBy.length === props.participants.length);
    function checkAll() {
      setFieldValue("orderedBy", allChecked.value ? [] : props.participants.map((p) => p.id));
    }
    const lineTotal = computed(() => (values.qty || 0) * (values.priceEach || 0));
    const canSave = computed(() => values.name.trim().length > 0 && values.orderedBy.length > 0);
    const save = handleSubmit((v) => {
      emit("save", { ...v, name: v.name.trim(), orderedBy: [...v.orderedBy] });
      open.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_core_modal = __nuxt_component_0$2;
      const _component_core_input = __nuxt_component_1;
      const _component_avatar_badge = __nuxt_component_0$1;
      const _component_core_button = __nuxt_component_2$1;
      _push(ssrRenderComponent(_component_core_modal, mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event,
        title: "Add order item"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form${_scopeId}>`);
            _push2(ssrRenderComponent(_component_core_input, {
              name: "name",
              label: "Item",
              placeholder: "Ayam bakar"
            }, null, _parent2, _scopeId));
            _push2(`<div class="mt-3 flex gap-3"${_scopeId}><div${_scopeId}><span class="eyebrow"${_scopeId}>Qty</span><div class="mt-1.5 flex items-center gap-2 rounded-control border border-line-light bg-surface-input px-2 py-1.5"${_scopeId}><button type="button" class="text-forest"${_scopeId}><span class="i-tabler-minus"${_scopeId}></span></button><span class="num w-6 text-center font-600"${_scopeId}>${ssrInterpolate(unref(values).qty)}</span><button type="button" class="text-forest"${_scopeId}><span class="i-tabler-plus"${_scopeId}></span></button></div></div><div class="flex-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_core_input, {
              name: "priceEach",
              numeric: "",
              type: "number",
              min: "0",
              label: "Price each",
              placeholder: "45000"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="mb-2 mt-4 flex items-center justify-between"${_scopeId}><span class="eyebrow"${_scopeId}>Ordered by</span><button type="button" class="text-xs font-600 text-forest"${_scopeId}><span class="i-tabler-checks"${_scopeId}></span> ${ssrInterpolate(unref(allChecked) ? "Clear" : "Check all")}</button></div><div class="grid grid-cols-3 gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(__props.participants, (p) => {
              _push2(`<button type="button" class="${ssrRenderClass([
                unref(values).orderedBy.includes(p.id) ? "border-forest bg-forest text-white" : "border-line-light bg-surface-card text-body",
                "flex items-center gap-1.5 rounded-control border px-2 py-1.5 text-xs font-600 transition-colors"
              ])}"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_avatar_badge, {
                "badge-key": p.badgeKey,
                size: 18
              }, null, _parent2, _scopeId));
              _push2(`<span class="truncate"${_scopeId}>${ssrInterpolate(p.name)}</span></button>`);
            });
            _push2(`<!--]--></div><div class="rule-double mt-4 flex items-center justify-between pt-3"${_scopeId}><span class="text-sm text-body"${_scopeId}>Line total · split ${ssrInterpolate(unref(values).orderedBy.length)} ways</span><span class="num font-600"${_scopeId}>${ssrInterpolate(unref(formatRupiah)(unref(lineTotal)))}</span></div><div class="mt-4 flex gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_core_button, {
              variant: "ghost",
              block: "",
              onClick: ($event) => open.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Cancel`);
                } else {
                  return [
                    createTextVNode("Cancel")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_core_button, {
              type: "submit",
              block: "",
              disabled: !unref(canSave)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Save item`);
                } else {
                  return [
                    createTextVNode("Save item")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(unref(save), ["prevent"])
              }, [
                createVNode(_component_core_input, {
                  name: "name",
                  label: "Item",
                  placeholder: "Ayam bakar"
                }),
                createVNode("div", { class: "mt-3 flex gap-3" }, [
                  createVNode("div", null, [
                    createVNode("span", { class: "eyebrow" }, "Qty"),
                    createVNode("div", { class: "mt-1.5 flex items-center gap-2 rounded-control border border-line-light bg-surface-input px-2 py-1.5" }, [
                      createVNode("button", {
                        type: "button",
                        class: "text-forest",
                        onClick: ($event) => setQty(unref(values).qty - 1)
                      }, [
                        createVNode("span", { class: "i-tabler-minus" })
                      ], 8, ["onClick"]),
                      createVNode("span", { class: "num w-6 text-center font-600" }, toDisplayString(unref(values).qty), 1),
                      createVNode("button", {
                        type: "button",
                        class: "text-forest",
                        onClick: ($event) => setQty(unref(values).qty + 1)
                      }, [
                        createVNode("span", { class: "i-tabler-plus" })
                      ], 8, ["onClick"])
                    ])
                  ]),
                  createVNode("div", { class: "flex-1" }, [
                    createVNode(_component_core_input, {
                      name: "priceEach",
                      numeric: "",
                      type: "number",
                      min: "0",
                      label: "Price each",
                      placeholder: "45000"
                    })
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
                        unref(values).orderedBy.includes(p.id) ? "border-forest bg-forest text-white" : "border-line-light bg-surface-card text-body"
                      ],
                      onClick: ($event) => toggle(p.id)
                    }, [
                      createVNode(_component_avatar_badge, {
                        "badge-key": p.badgeKey,
                        size: 18
                      }, null, 8, ["badge-key"]),
                      createVNode("span", { class: "truncate" }, toDisplayString(p.name), 1)
                    ], 10, ["onClick"]);
                  }), 128))
                ]),
                createVNode("div", { class: "rule-double mt-4 flex items-center justify-between pt-3" }, [
                  createVNode("span", { class: "text-sm text-body" }, "Line total · split " + toDisplayString(unref(values).orderedBy.length) + " ways", 1),
                  createVNode("span", { class: "num font-600" }, toDisplayString(unref(formatRupiah)(unref(lineTotal))), 1)
                ]),
                createVNode("div", { class: "mt-4 flex gap-2" }, [
                  createVNode(_component_core_button, {
                    variant: "ghost",
                    block: "",
                    onClick: ($event) => open.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Cancel")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_core_button, {
                    type: "submit",
                    block: "",
                    disabled: !unref(canSave)
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Save item")
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])
              ], 40, ["onSubmit"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/add-order-item.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$1, { __name: "AddOrderItem" });
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
    const participants = computed(() => bill.value?.participants ?? []);
    const meId = me.value?.id ?? participants.value[0]?.id ?? "";
    function blank() {
      return {
        type: "simple",
        title: "",
        amount: 0,
        payerMode: "one",
        payerId: meId,
        payers: participants.value.map((p) => ({ participantId: p.id, amount: 0 })),
        shareMethod: "equally",
        sharerIds: participants.value.map((p) => p.id),
        exactShares: {},
        items: [],
        fees: { taxPercent: 0, service: 0, other: 0 },
        discount: 0
      };
    }
    function fromEntry(e) {
      const base = blank();
      base.type = e.type;
      base.title = e.title;
      if (e.type === "simple") {
        base.amount = e.amount;
        base.payerMode = e.payers.length > 1 ? "several" : "one";
        base.payerId = e.payers[0]?.participantId ?? meId;
        base.payers = participants.value.map((p) => ({
          participantId: p.id,
          amount: e.payers.find((x) => x.participantId === p.id)?.amount ?? 0
        }));
        base.shareMethod = e.shareMethod;
        base.sharerIds = e.sharers.map((s) => s.participantId);
        base.exactShares = Object.fromEntries(e.sharers.map((s) => [s.participantId, s.share]));
      } else {
        base.payerId = e.payerId;
        base.items = e.items.map((it) => ({ ...it }));
        base.fees = { ...e.fees };
        base.discount = e.discount;
      }
      return base;
    }
    const editEntry = editId ? bill.value?.entries.find((e) => e.id === editId) : void 0;
    const { values, setFieldValue, handleSubmit, isSubmitting } = useForm({
      initialValues: editEntry ? fromEntry(editEntry) : blank()
    });
    const typeModel = computed({ get: () => values.type, set: (v) => setFieldValue("type", v) });
    const payerModeModel = computed({ get: () => values.payerMode, set: (v) => setFieldValue("payerMode", v) });
    const shareMethodModel = computed({ get: () => values.shareMethod, set: (v) => setFieldValue("shareMethod", v) });
    const payerIdModel = computed({ get: () => values.payerId, set: (v) => setFieldValue("payerId", v) });
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
    const participantOptions = computed(
      () => participants.value.map((p) => ({ label: p.name, value: p.id }))
    );
    const nameOf = (pid) => participants.value.find((p) => p.id === pid)?.name ?? "?";
    const badgeOf = (pid) => participants.value.find((p) => p.id === pid)?.badgeKey;
    const equalSplit = computed(() => {
      if (!values.sharerIds.length) return {};
      const parts = splitProportional(values.amount || 0, values.sharerIds.map(() => 1));
      return Object.fromEntries(values.sharerIds.map((pid, i) => [pid, parts[i]]));
    });
    const shareOf = (pid) => values.shareMethod === "equally" ? equalSplit.value[pid] ?? 0 : values.exactShares[pid] ?? 0;
    const payerAmountOf = (pid) => values.payers.find((x) => x.participantId === pid)?.amount ?? 0;
    function setExactShare(pid, n) {
      setFieldValue("exactShares", { ...values.exactShares, [pid]: n });
    }
    function setPayerAmount(pid, n) {
      setFieldValue(
        "payers",
        values.payers.map((x) => x.participantId === pid ? { ...x, amount: n } : x)
      );
    }
    const allShared = computed(() => values.sharerIds.length === participants.value.length);
    const sheetOpen = ref(false);
    function onSaveItem(item) {
      setFieldValue("items", [
        ...values.items,
        { ...item, id: "tmp-" + Math.random().toString(36).slice(2) }
      ]);
    }
    const sharedSubtotal = computed(
      () => sharedOrderTotal({
        title: values.title || "x",
        payerId: values.payerId || "x",
        items: values.items.length ? values.items.map((it) => ({ ...it })) : [{ id: "z", name: "z", qty: 1, priceEach: 0, orderedBy: ["z"] }],
        fees: values.fees,
        discount: values.discount
      })
    );
    const error = ref("");
    function buildPayload() {
      if (values.type === "simple") {
        const sharers = values.sharerIds.map((pid) => ({ participantId: pid, share: shareOf(pid) }));
        const amount = values.shareMethod === "exact" ? sharers.reduce((a, s) => a + s.share, 0) : values.amount;
        const payers = values.payerMode === "one" ? [{ participantId: values.payerId, amount }] : values.payers.filter((p) => p.amount > 0);
        return { type: "simple", title: values.title, amount, payers, shareMethod: values.shareMethod, sharers };
      }
      return {
        type: "shared_order",
        title: values.title,
        payerId: values.payerId,
        items: values.items.map(({ name, qty, priceEach, orderedBy }) => ({ name, qty, priceEach, orderedBy })),
        fees: values.fees,
        discount: values.discount
      };
    }
    const onSubmit = handleSubmit(async () => {
      error.value = "";
      const parsed = entryInputSchema.safeParse(buildPayload());
      if (!parsed.success) {
        error.value = parsed.error.issues[0]?.message ?? "Please complete the expense";
        return;
      }
      try {
        await $fetch(editId ? `/api/bills/${id}/entries/${editId}` : `/api/bills/${id}/entries`, {
          method: editId ? "PUT" : "POST",
          body: parsed.data
        });
        await navigateTo(`/bill/${id}`);
      } catch (e) {
        error.value = e?.data?.statusMessage || "Could not save expense";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_screen_header = __nuxt_component_0;
      const _component_core_segmented_control = __nuxt_component_6;
      const _component_core_input = __nuxt_component_1;
      const _component_avatar_badge = __nuxt_component_0$1;
      const _component_core_select = __nuxt_component_4;
      const _component_money_text = __nuxt_component_2;
      const _component_avatar_stack = __nuxt_component_1$1;
      const _component_add_order_item = __nuxt_component_7;
      const _component_core_button = __nuxt_component_2$1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_screen_header, {
        back: "",
        title: unref(editId) ? "Edit expense" : "Add expense",
        onBack: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/bill/${unref(id)}`)
      }, null, _parent));
      if (unref(bill)) {
        _push(`<main class="app-col flex-1 overflow-y-auto px-5 pb-28 pt-4"><form>`);
        _push(ssrRenderComponent(_component_core_segmented_control, {
          modelValue: unref(typeModel),
          "onUpdate:modelValue": ($event) => isRef(typeModel) ? typeModel.value = $event : null,
          options: typeOptions,
          accent: unref(values).type === "shared_order" ? "ochre" : "forest"
        }, null, _parent));
        _push(ssrRenderComponent(_component_core_input, {
          name: "title",
          label: "What for",
          placeholder: unref(values).type === "simple" ? "Gasoline" : "Warung dinner",
          class: "mt-4"
        }, null, _parent));
        if (unref(values).type === "simple") {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(_component_core_input, {
            name: "amount",
            numeric: "",
            type: "number",
            min: "0",
            label: "Amount",
            placeholder: "320000",
            variant: "emphasis",
            class: "mt-3"
          }, null, _parent));
          _push(`<div class="mt-5 flex items-center gap-2"><span class="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-700 text-surface-card">1</span><span class="font-serif text-base font-600">Who paid up front</span></div><div class="mt-2">`);
          _push(ssrRenderComponent(_component_core_segmented_control, {
            modelValue: unref(payerModeModel),
            "onUpdate:modelValue": ($event) => isRef(payerModeModel) ? payerModeModel.value = $event : null,
            options: payerModeOptions
          }, null, _parent));
          _push(`</div>`);
          if (unref(values).payerMode === "one") {
            _push(`<div class="mt-2 flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2.5">`);
            if (unref(values).payerId) {
              _push(ssrRenderComponent(_component_avatar_badge, {
                "badge-key": badgeOf(unref(values).payerId),
                size: 34
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="flex-1">`);
            _push(ssrRenderComponent(_component_core_select, {
              modelValue: unref(payerIdModel),
              "onUpdate:modelValue": ($event) => isRef(payerIdModel) ? payerIdModel.value = $event : null,
              options: unref(participantOptions),
              variant: "bare"
            }, null, _parent));
            _push(`<p class="text-xs text-muted">fronts the whole amount</p></div>`);
            _push(ssrRenderComponent(_component_money_text, {
              value: unref(values).amount,
              class: "text-sm font-600"
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<div class="mt-2 flex flex-col gap-2"><!--[-->`);
            ssrRenderList(unref(participants), (p) => {
              _push(`<div class="flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2">`);
              _push(ssrRenderComponent(_component_avatar_badge, {
                "badge-key": p.badgeKey,
                size: 28
              }, null, _parent));
              _push(`<span class="flex-1 text-sm">${ssrInterpolate(p.name)}</span><div class="w-28">`);
              _push(ssrRenderComponent(_component_core_input, {
                "model-value": payerAmountOf(p.id),
                numeric: "",
                type: "number",
                min: "0",
                variant: "compact",
                class: "text-right",
                "onUpdate:modelValue": ($event) => setPayerAmount(p.id, $event)
              }, null, _parent));
              _push(`</div></div>`);
            });
            _push(`<!--]--></div>`);
          }
          _push(`<div class="mt-5 flex items-center gap-2"><span class="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-700 text-surface-card">2</span><span class="font-serif text-base font-600">Who shares the cost</span></div><div class="mt-2">`);
          _push(ssrRenderComponent(_component_core_segmented_control, {
            modelValue: unref(shareMethodModel),
            "onUpdate:modelValue": ($event) => isRef(shareMethodModel) ? shareMethodModel.value = $event : null,
            options: shareMethodOptions
          }, null, _parent));
          _push(`</div><div class="chip-pos mt-3 w-full justify-center py-2 text-center"> Split <b class="mx-1">${ssrInterpolate(unref(values).sharerIds.length)} ways</b>`);
          if (unref(values).shareMethod === "equally" && unref(values).payerMode === "one") {
            _push(`<!--[--> · each owes ${ssrInterpolate(nameOf(unref(values).payerId))} ${ssrInterpolate(unref(formatRupiah)(unref(equalSplit)[unref(values).sharerIds[0]] ?? 0))}<!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><button type="button" class="mt-3 text-xs font-600 text-forest"><span class="i-tabler-check"></span> ${ssrInterpolate(unref(allShared) ? "Clear all" : "Select all")}</button><div class="mt-2 flex flex-col gap-2"><!--[-->`);
          ssrRenderList(unref(participants), (p) => {
            _push(`<div class="${ssrRenderClass([unref(values).sharerIds.includes(p.id) ? "" : "opacity-70", "flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2 transition-opacity"])}">`);
            _push(ssrRenderComponent(_component_avatar_badge, {
              "badge-key": p.badgeKey,
              size: 28
            }, null, _parent));
            _push(`<div class="flex-1"><span class="text-sm font-600">${ssrInterpolate(p.name)}</span>`);
            if (!unref(values).sharerIds.includes(p.id)) {
              _push(`<p class="text-xs text-muted">not sharing</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
            if (unref(values).sharerIds.includes(p.id) && unref(values).shareMethod === "exact") {
              _push(`<div class="w-24">`);
              _push(ssrRenderComponent(_component_core_input, {
                "model-value": unref(values).exactShares[p.id] ?? 0,
                numeric: "",
                type: "number",
                min: "0",
                variant: "compact",
                class: "text-right",
                "onUpdate:modelValue": ($event) => setExactShare(p.id, $event)
              }, null, _parent));
              _push(`</div>`);
            } else if (unref(values).sharerIds.includes(p.id)) {
              _push(ssrRenderComponent(_component_money_text, {
                value: shareOf(p.id),
                class: "text-sm"
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`<button type="button" class="${ssrRenderClass([unref(values).sharerIds.includes(p.id) ? "border-forest bg-forest text-white" : "border-line-medium text-transparent", "flex size-6 items-center justify-center rounded-chip-sm border"])}"><span class="i-tabler-check text-xs"></span></button></div>`);
          });
          _push(`<!--]--></div><!--]-->`);
        } else {
          _push(`<!--[--><div class="mt-3 flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2.5"><span class="eyebrow">Paid by</span>`);
          if (unref(values).payerId) {
            _push(ssrRenderComponent(_component_avatar_badge, {
              "badge-key": badgeOf(unref(values).payerId),
              size: 28
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(_component_core_select, {
            modelValue: unref(payerIdModel),
            "onUpdate:modelValue": ($event) => isRef(payerIdModel) ? payerIdModel.value = $event : null,
            options: unref(participantOptions),
            variant: "bare"
          }, null, _parent));
          _push(`</div><button type="button" class="mt-3 flex w-full items-center justify-center gap-2 rounded-card border border-dashed border-line-medium bg-surface-subtle py-3 text-sm font-600 text-body"><span class="i-tabler-camera text-ochre"></span> Scan receipt · auto-fill items </button><div class="mb-2 mt-5 flex items-center justify-between"><span class="eyebrow">Orders</span><span class="text-xs text-muted">${ssrInterpolate(unref(values).items.length)} items</span></div><div class="flex flex-col gap-2"><!--[-->`);
          ssrRenderList(unref(values).items, (it, i) => {
            _push(`<div class="flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2"><div class="flex-1"><p class="text-sm font-600">${ssrInterpolate(it.name)} ×${ssrInterpolate(it.qty)}</p>`);
            _push(ssrRenderComponent(_component_avatar_stack, {
              participants: it.orderedBy.map((pid) => unref(participants).find((p) => p.id === pid)).filter(Boolean),
              max: 5,
              size: 18
            }, null, _parent));
            _push(`</div>`);
            _push(ssrRenderComponent(_component_money_text, {
              value: it.qty * it.priceEach,
              class: "text-sm font-600"
            }, null, _parent));
            _push(`<button type="button" class="text-terracotta"><span class="i-tabler-x"></span></button></div>`);
          });
          _push(`<!--]--><button type="button" class="flex items-center justify-center gap-2 rounded-card border border-dashed border-line-medium bg-surface-subtle py-2.5 text-sm font-600 text-forest"><span class="i-tabler-plus"></span> Add order </button></div><div class="mt-5"><span class="eyebrow">Fees &amp; discount</span><div class="mt-2 flex flex-col gap-2 rounded-card border border-line-light bg-surface-card p-3 text-sm"><div class="flex items-center justify-between gap-2"><span>Tax (%)</span><div class="w-24">`);
          _push(ssrRenderComponent(_component_core_input, {
            name: "fees.taxPercent",
            numeric: "",
            type: "number",
            min: "0",
            variant: "compact",
            class: "text-right"
          }, null, _parent));
          _push(`</div></div><div class="flex items-center justify-between gap-2"><span>Service</span><div class="w-28">`);
          _push(ssrRenderComponent(_component_core_input, {
            name: "fees.service",
            numeric: "",
            type: "number",
            min: "0",
            variant: "compact",
            class: "text-right"
          }, null, _parent));
          _push(`</div></div><div class="flex items-center justify-between gap-2"><span>Other fee</span><div class="w-28">`);
          _push(ssrRenderComponent(_component_core_input, {
            name: "fees.other",
            numeric: "",
            type: "number",
            min: "0",
            variant: "compact",
            class: "text-right"
          }, null, _parent));
          _push(`</div></div><div class="flex items-center justify-between gap-2 text-terracotta"><span>Discount</span><div class="w-28">`);
          _push(ssrRenderComponent(_component_core_input, {
            name: "discount",
            numeric: "",
            type: "number",
            min: "0",
            variant: "compact",
            class: "text-right"
          }, null, _parent));
          _push(`</div></div></div></div><div class="rule-double mt-4 flex items-center justify-between pt-3"><span class="eyebrow">Subtotal</span>`);
          _push(ssrRenderComponent(_component_money_text, {
            value: unref(sharedSubtotal),
            class: "text-xl font-600"
          }, null, _parent));
          _push(`</div>`);
          _push(ssrRenderComponent(_component_add_order_item, {
            open: unref(sheetOpen),
            "onUpdate:open": ($event) => isRef(sheetOpen) ? sheetOpen.value = $event : null,
            participants: unref(participants),
            onSave: onSaveItem
          }, null, _parent));
          _push(`<!--]-->`);
        }
        if (unref(error)) {
          _push(`<p class="chip-neg mt-4">${ssrInterpolate(unref(error))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form></main>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex-none border-t border-line-light bg-surface-card px-5 py-3"><div class="app-col">`);
      _push(ssrRenderComponent(_component_core_button, {
        block: "",
        loading: unref(isSubmitting),
        onClick: unref(onSubmit)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(editId) ? "Save changes" : "Add expense")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(editId) ? "Save changes" : "Add expense"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><!--]-->`);
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
//# sourceMappingURL=add-C9Pr9tnX.mjs.map
