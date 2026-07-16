import { _ as __nuxt_component_0 } from './screen-header-ugST2aQ7.mjs';
import { _ as __nuxt_component_1 } from './avatar-stack-BSc6BmaN.mjs';
import { _ as __nuxt_component_0$1, A as AVATARS } from './avatar-badge-bLaz6-lC.mjs';
import { _ as __nuxt_component_9 } from './bottom-nav-7_y_YlMr.mjs';
import { _ as __nuxt_component_0$2 } from './core-modal-WUn7wjMe.mjs';
import { u as useForm, t as toTypedSchema, _ as __nuxt_component_1$1 } from './vee-validate-zod-BpRQT81S.mjs';
import { defineComponent, withAsyncContext, computed, ref, unref, withCtx, createVNode, toDisplayString, isRef, mergeProps, useModel, watch, createTextVNode, withModifiers, withKeys, openBlock, createBlock, createCommentVNode, mergeModels, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { _ as __nuxt_component_2$1 } from './core-button-CuYm2Y1l.mjs';
import { B as BADGE_KEYS, p as participantInputSchema } from '../_/schemas.mjs';
import { n as nextBadge } from '../_/badges.mjs';
import { a as useRoute, n as navigateTo } from './server.mjs';
import { c as computeBalances } from '../_/settle.mjs';
import { u as useBill, c as useIdentity, f as formatRupiah, d as formatSignedCompact } from './useBill-_9lklAAl.mjs';
import './nuxt-link-7EAqBWen.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'zod';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import 'perfect-debounce';
import '@vue/shared';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "badge-picker",
  __ssrInlineRender: true,
  props: {
    "modelValue": {},
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_avatar_badge = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid max-h-56 grid-cols-5 gap-2 overflow-y-auto p-0.5" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(AVATARS), (a) => {
        _push(`<button type="button" class="${ssrRenderClass([model.value === a.key ? "bg-forest" : "bg-surface-input", "relative flex items-center justify-center rounded-card p-1 transition-colors"])}"${ssrRenderAttr("title", a.label)}>`);
        _push(ssrRenderComponent(_component_avatar_badge, {
          "badge-key": a.key,
          size: 40
        }, null, _parent));
        if (model.value === a.key) {
          _push(`<span class="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-forest text-white ring-2 ring-surface-card"><span class="i-tabler-check text-[11px]"></span></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/badge-picker.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$3, { __name: "BadgePicker" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "add-participant-sheet",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    billId: {},
    taken: {}
  }, {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["done"], ["update:open"]),
  setup(__props, { emit: __emit }) {
    const open = useModel(__props, "open");
    const props = __props;
    const emit = __emit;
    const { handleSubmit, values, setFieldValue, resetForm, isSubmitting } = useForm({
      validationSchema: toTypedSchema(participantInputSchema),
      initialValues: { name: "", badgeKey: BADGE_KEYS[0] }
    });
    const serverError = ref("");
    watch(open, (o) => {
      if (o) {
        resetForm({ values: { name: "", badgeKey: nextBadge(props.taken) } });
        serverError.value = "";
      }
    });
    function dice() {
      const pool = BADGE_KEYS.filter((k) => k !== values.badgeKey);
      setFieldValue("badgeKey", pool[Math.floor(Math.random() * pool.length)]);
    }
    const submit = handleSubmit(async (v) => {
      serverError.value = "";
      try {
        const bill = await $fetch(`/api/bills/${props.billId}/participants`, {
          method: "POST",
          body: v
        });
        emit("done", bill);
        open.value = false;
      } catch (e) {
        serverError.value = e?.data?.statusMessage || "Could not add participant";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_core_modal = __nuxt_component_0$2;
      const _component_core_input = __nuxt_component_1$1;
      const _component_badge_picker = __nuxt_component_2;
      const _component_core_button = __nuxt_component_2$1;
      _push(ssrRenderComponent(_component_core_modal, mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event,
        title: "Add participant"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form${_scopeId}>`);
            _push2(ssrRenderComponent(_component_core_input, {
              name: "name",
              label: "Name",
              placeholder: "Rama",
              onKeydown: unref(submit)
            }, null, _parent2, _scopeId));
            _push2(`<div class="mb-2 mt-4 flex items-center justify-between"${_scopeId}><span class="eyebrow"${_scopeId}>Trail badge</span><button type="button" class="flex items-center gap-1 text-xs font-600 text-muted"${_scopeId}><span class="i-tabler-dice-5"${_scopeId}></span> Auto-picked · tap to change </button></div>`);
            _push2(ssrRenderComponent(_component_badge_picker, {
              "model-value": unref(values).badgeKey,
              "onUpdate:modelValue": ($event) => unref(setFieldValue)("badgeKey", $event)
            }, null, _parent2, _scopeId));
            if (unref(serverError)) {
              _push2(`<p class="chip-neg mt-3"${_scopeId}>${ssrInterpolate(unref(serverError))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-4 flex gap-2"${_scopeId}>`);
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
              loading: unref(isSubmitting)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Add to trip`);
                } else {
                  return [
                    createTextVNode("Add to trip")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(unref(submit), ["prevent"])
              }, [
                createVNode(_component_core_input, {
                  name: "name",
                  label: "Name",
                  placeholder: "Rama",
                  onKeydown: withKeys(withModifiers(unref(submit), ["prevent"]), ["enter"])
                }, null, 8, ["onKeydown"]),
                createVNode("div", { class: "mb-2 mt-4 flex items-center justify-between" }, [
                  createVNode("span", { class: "eyebrow" }, "Trail badge"),
                  createVNode("button", {
                    type: "button",
                    class: "flex items-center gap-1 text-xs font-600 text-muted",
                    onClick: dice
                  }, [
                    createVNode("span", { class: "i-tabler-dice-5" }),
                    createTextVNode(" Auto-picked · tap to change ")
                  ])
                ]),
                createVNode(_component_badge_picker, {
                  "model-value": unref(values).badgeKey,
                  "onUpdate:modelValue": ($event) => unref(setFieldValue)("badgeKey", $event)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                unref(serverError) ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "chip-neg mt-3"
                }, toDisplayString(unref(serverError)), 1)) : createCommentVNode("", true),
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
                    loading: unref(isSubmitting)
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Add to trip")
                    ]),
                    _: 1
                  }, 8, ["loading"])
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/add-participant-sheet.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$2, { __name: "AddParticipantSheet" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "edit-participant-sheet",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    billId: {},
    participant: {}
  }, {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["done"], ["update:open"]),
  setup(__props, { emit: __emit }) {
    const open = useModel(__props, "open");
    const props = __props;
    const emit = __emit;
    const { handleSubmit, values, setFieldValue, resetForm, isSubmitting } = useForm({
      validationSchema: toTypedSchema(participantInputSchema),
      initialValues: { name: "", badgeKey: "ibex" }
    });
    const serverError = ref("");
    const removing = ref(false);
    watch(
      [open, () => props.participant],
      () => {
        if (open.value && props.participant) {
          resetForm({ values: { name: props.participant.name, badgeKey: props.participant.badgeKey } });
          serverError.value = "";
        }
      },
      { immediate: true }
    );
    const submit = handleSubmit(async (v) => {
      if (!props.participant) return;
      serverError.value = "";
      try {
        const bill = await $fetch(
          `/api/bills/${props.billId}/participants/${props.participant.id}`,
          { method: "PATCH", body: v }
        );
        emit("done", bill);
        open.value = false;
      } catch (e) {
        serverError.value = e?.data?.statusMessage || "Could not save";
      }
    });
    async function remove() {
      if (!props.participant) return;
      removing.value = true;
      try {
        const bill = await $fetch(
          `/api/bills/${props.billId}/participants/${props.participant.id}`,
          { method: "DELETE" }
        );
        emit("done", bill);
        open.value = false;
      } catch (e) {
        serverError.value = e?.data?.statusMessage || "Could not remove";
      } finally {
        removing.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_core_modal = __nuxt_component_0$2;
      const _component_core_input = __nuxt_component_1$1;
      const _component_badge_picker = __nuxt_component_2;
      const _component_core_button = __nuxt_component_2$1;
      _push(ssrRenderComponent(_component_core_modal, mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event,
        title: "Edit participant"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form${_scopeId}>`);
            _push2(ssrRenderComponent(_component_core_input, {
              name: "name",
              label: "Name",
              style: { "padding-right": "2.25rem" }
            }, {
              suffix: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="i-tabler-pencil pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"${_scopeId2}></span>`);
                } else {
                  return [
                    createVNode("span", { class: "i-tabler-pencil pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="mb-2 mt-4 flex items-center justify-between"${_scopeId}><span class="eyebrow"${_scopeId}>Trail badge</span><span class="text-xs text-muted"${_scopeId}>${ssrInterpolate(__props.participant?.name)} · current</span></div>`);
            _push2(ssrRenderComponent(_component_badge_picker, {
              "model-value": unref(values).badgeKey,
              "onUpdate:modelValue": ($event) => unref(setFieldValue)("badgeKey", $event)
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_core_button, {
              variant: "danger",
              block: "",
              class: "mt-4",
              loading: unref(removing),
              onClick: remove
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="i-tabler-trash"${_scopeId2}></span> Remove from trip `);
                } else {
                  return [
                    createVNode("span", { class: "i-tabler-trash" }),
                    createTextVNode(" Remove from trip ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(serverError)) {
              _push2(`<p class="chip-neg mt-3"${_scopeId}>${ssrInterpolate(unref(serverError))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-4 flex gap-2"${_scopeId}>`);
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
              loading: unref(isSubmitting)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Save changes`);
                } else {
                  return [
                    createTextVNode("Save changes")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(unref(submit), ["prevent"])
              }, [
                createVNode(_component_core_input, {
                  name: "name",
                  label: "Name",
                  style: { "padding-right": "2.25rem" }
                }, {
                  suffix: withCtx(() => [
                    createVNode("span", { class: "i-tabler-pencil pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" })
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "mb-2 mt-4 flex items-center justify-between" }, [
                  createVNode("span", { class: "eyebrow" }, "Trail badge"),
                  createVNode("span", { class: "text-xs text-muted" }, toDisplayString(__props.participant?.name) + " · current", 1)
                ]),
                createVNode(_component_badge_picker, {
                  "model-value": unref(values).badgeKey,
                  "onUpdate:modelValue": ($event) => unref(setFieldValue)("badgeKey", $event)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                createVNode(_component_core_button, {
                  variant: "danger",
                  block: "",
                  class: "mt-4",
                  loading: unref(removing),
                  onClick: remove
                }, {
                  default: withCtx(() => [
                    createVNode("span", { class: "i-tabler-trash" }),
                    createTextVNode(" Remove from trip ")
                  ]),
                  _: 1
                }, 8, ["loading"]),
                unref(serverError) ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "chip-neg mt-3"
                }, toDisplayString(unref(serverError)), 1)) : createCommentVNode("", true),
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
                    loading: unref(isSubmitting)
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Save changes")
                    ]),
                    _: 1
                  }, 8, ["loading"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/edit-participant-sheet.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "EditParticipantSheet" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "participants",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const id = route.params.id;
    const { data: bill, refresh } = ([__temp, __restore] = withAsyncContext(() => useBill(id)), __temp = await __temp, __restore(), __temp);
    const { me } = useIdentity(bill);
    const balances = computed(() => bill.value ? computeBalances(bill.value) : []);
    const balanceOf = (pid) => balances.value.find((b) => b.participantId === pid);
    const frontedCount = computed(() => balances.value.filter((b) => b.paid > 0).length);
    const takenBadges = computed(() => bill.value?.participants.map((p) => p.badgeKey) ?? []);
    function involvedCount(pid) {
      return (bill.value?.entries ?? []).filter(
        (e) => e.type === "simple" ? e.payers.some((p) => p.participantId === pid) || e.sharers.some((s) => s.participantId === pid) : e.payerId === pid || e.items.some((it) => it.orderedBy.includes(pid))
      ).length;
    }
    const addOpen = ref(false);
    const editOpen = ref(false);
    const editTarget = ref(null);
    function onDone(updated) {
      bill.value = updated;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_screen_header = __nuxt_component_0;
      const _component_avatar_stack = __nuxt_component_1;
      const _component_avatar_badge = __nuxt_component_0$1;
      const _component_bottom_nav = __nuxt_component_9;
      const _component_add_participant_sheet = __nuxt_component_4;
      const _component_edit_participant_sheet = __nuxt_component_5;
      if (unref(bill)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_screen_header, {
          back: "",
          eyebrow: "Roster",
          title: "Souls on this trip",
          onBack: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/bill/${unref(id)}`)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="mt-3 flex items-center gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_avatar_stack, {
                participants: unref(bill).participants,
                max: 7,
                size: 28
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-xs text-muted"${_scopeId}>${ssrInterpolate(unref(bill).participants.length)} souls · ${ssrInterpolate(unref(frontedCount))} fronted cash </span></div>`);
            } else {
              return [
                createVNode("div", { class: "mt-3 flex items-center gap-3" }, [
                  createVNode(_component_avatar_stack, {
                    participants: unref(bill).participants,
                    max: 7,
                    size: 28
                  }, null, 8, ["participants"]),
                  createVNode("span", { class: "text-xs text-muted" }, toDisplayString(unref(bill).participants.length) + " souls · " + toDisplayString(unref(frontedCount)) + " fronted cash ", 1)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<main class="app-col flex-1 overflow-y-auto px-5 pb-28 pt-4"><div class="flex flex-col gap-2"><!--[-->`);
        ssrRenderList(unref(bill).participants, (p) => {
          _push(`<div class="${ssrRenderClass([p.id === unref(me)?.id ? "border-forest" : "border-line-light", "flex items-center gap-3 rounded-card border bg-surface-card px-3 py-2.5"])}">`);
          _push(ssrRenderComponent(_component_avatar_badge, {
            "badge-key": p.badgeKey,
            size: 38
          }, null, _parent));
          _push(`<div class="min-w-0 flex-1"><div class="flex items-center gap-2"><span class="text-sm font-600 text-ink">${ssrInterpolate(p.name)}</span>`);
          if (p.id === unref(me)?.id) {
            _push(`<span class="rounded-chip-sm bg-forest px-1.5 py-0.5 text-[9px] font-700 uppercase text-surface-card"> You </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="text-xs text-muted">`);
          if ((balanceOf(p.id)?.paid ?? 0) > 0) {
            _push(`<!--[--> Fronted ${ssrInterpolate(unref(formatRupiah)(balanceOf(p.id).paid))}<!--]-->`);
          } else {
            _push(`<!--[-->In ${ssrInterpolate(involvedCount(p.id))} expenses<!--]-->`);
          }
          _push(`</p></div><div class="text-right"><p class="${ssrRenderClass([(balanceOf(p.id)?.balance ?? 0) >= 0 ? "text-forest" : "text-terracotta", "num text-sm font-600"])}">${ssrInterpolate(unref(formatSignedCompact)(balanceOf(p.id)?.balance ?? 0))}</p><p class="text-[10px] text-muted">${ssrInterpolate((balanceOf(p.id)?.balance ?? 0) > 0 ? "owed back" : (balanceOf(p.id)?.balance ?? 0) < 0 ? "owes" : "square")}</p></div><button type="button" class="text-muted" aria-label="Edit"><span class="i-tabler-pencil text-sm"></span></button></div>`);
        });
        _push(`<!--]--><button type="button" class="flex items-center justify-center gap-2 rounded-card border border-dashed border-line-medium bg-surface-subtle py-3 text-sm font-600 text-forest"><span class="i-tabler-plus"></span> Add participant </button></div><div class="mt-4 flex items-start gap-2 rounded-control border border-line-light bg-surface-subtle px-3 py-3 text-xs leading-relaxed text-body"><span class="i-tabler-info-circle mt-0.5 text-ochre"></span><span> Names must be unique — each gets its own trail badge. Removing someone re-balances every expense they were in. </span></div></main>`);
        _push(ssrRenderComponent(_component_bottom_nav, {
          active: "users",
          "bill-id": unref(id)
        }, null, _parent));
        _push(ssrRenderComponent(_component_add_participant_sheet, {
          open: unref(addOpen),
          "onUpdate:open": ($event) => isRef(addOpen) ? addOpen.value = $event : null,
          "bill-id": unref(id),
          taken: unref(takenBadges),
          onDone
        }, null, _parent));
        _push(ssrRenderComponent(_component_edit_participant_sheet, {
          open: unref(editOpen),
          "onUpdate:open": ($event) => isRef(editOpen) ? editOpen.value = $event : null,
          "bill-id": unref(id),
          participant: unref(editTarget),
          onDone
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/bill/[id]/participants.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=participants-Dg92Doll.mjs.map
