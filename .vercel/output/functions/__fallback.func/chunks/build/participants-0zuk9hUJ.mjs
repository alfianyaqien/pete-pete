import { _ as __nuxt_component_0 } from './ScreenHeader-B5cKO51D.mjs';
import { _ as __nuxt_component_1$1 } from './AvatarStack-DroGeiEm.mjs';
import { _ as __nuxt_component_0$1, A as AVATARS } from './AvatarBadge-Db5SDNyy.mjs';
import { _ as __nuxt_component_8 } from './BottomNav-D9s6ml1v.mjs';
import { _ as __nuxt_component_0$2 } from './BottomSheet-Cu9tTmnK.mjs';
import { defineComponent, withAsyncContext, computed, ref, unref, withCtx, createVNode, toDisplayString, isRef, mergeProps, useModel, reactive, watch, withDirectives, withKeys, withModifiers, vModelText, createTextVNode, openBlock, createBlock, createCommentVNode, mergeModels, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { B as BADGE_KEYS } from '../_/schemas.mjs';
import { n as nextBadge } from '../_/badges.mjs';
import { a as useRoute, n as navigateTo } from './server.mjs';
import { c as computeBalances } from '../_/settle.mjs';
import { u as useBill, c as useIdentity, f as formatRupiah, d as formatSignedCompact } from './useBill-NokyyOIb.mjs';
import './nuxt-link-BipftbZ7.mjs';
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
  __name: "BadgePicker",
  __ssrInlineRender: true,
  props: {
    "modelValue": {},
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AvatarBadge = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid max-h-56 grid-cols-5 gap-2 overflow-y-auto p-0.5" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(AVATARS), (a) => {
        _push(`<button type="button" class="${ssrRenderClass([model.value === a.key ? "bg-forest" : "bg-surface-input", "relative flex items-center justify-center rounded-card p-1 transition-colors"])}"${ssrRenderAttr("title", a.label)}>`);
        _push(ssrRenderComponent(_component_AvatarBadge, {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BadgePicker.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$3, { __name: "BadgePicker" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AddParticipantSheet",
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
    const draft = reactive({ name: "", badgeKey: BADGE_KEYS[0] });
    const error = ref("");
    const saving = ref(false);
    watch(open, (o) => {
      if (o) {
        draft.name = "";
        draft.badgeKey = nextBadge(props.taken);
        error.value = "";
      }
    });
    function dice() {
      const pool = BADGE_KEYS.filter((k) => k !== draft.badgeKey);
      draft.badgeKey = pool[Math.floor(Math.random() * pool.length)];
    }
    async function add() {
      if (!draft.name.trim()) {
        error.value = "Name is required";
        return;
      }
      saving.value = true;
      error.value = "";
      try {
        const bill = await $fetch(`/api/bills/${props.billId}/participants`, {
          method: "POST",
          body: { name: draft.name.trim(), badgeKey: draft.badgeKey }
        });
        emit("done", bill);
        open.value = false;
      } catch (e) {
        error.value = e?.data?.statusMessage || "Could not add participant";
      } finally {
        saving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BottomSheet = __nuxt_component_0$2;
      const _component_BadgePicker = __nuxt_component_1;
      _push(ssrRenderComponent(_component_BottomSheet, mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event,
        title: "Add participant"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<label class="block"${_scopeId}><span class="eyebrow"${_scopeId}>Name</span><input${ssrRenderAttr("value", unref(draft).name)} placeholder="Rama" class="mt-1.5 w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 text-ink focus:border-forest focus:outline-none"${_scopeId}></label><div class="mb-2 mt-4 flex items-center justify-between"${_scopeId}><span class="eyebrow"${_scopeId}>Trail badge</span><button type="button" class="flex items-center gap-1 text-xs font-600 text-muted"${_scopeId}><span class="i-tabler-dice-5"${_scopeId}></span> Auto-picked · tap to change </button></div>`);
            _push2(ssrRenderComponent(_component_BadgePicker, {
              modelValue: unref(draft).badgeKey,
              "onUpdate:modelValue": ($event) => unref(draft).badgeKey = $event
            }, null, _parent2, _scopeId));
            if (unref(error)) {
              _push2(`<p class="chip-neg mt-3"${_scopeId}>${ssrInterpolate(unref(error))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-4 flex gap-2"${_scopeId}><button type="button" class="btn-ghost flex-1"${_scopeId}>Cancel</button><button type="button" class="btn-forest flex-1"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""}${_scopeId}> Add to trip </button></div>`);
          } else {
            return [
              createVNode("label", { class: "block" }, [
                createVNode("span", { class: "eyebrow" }, "Name"),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => unref(draft).name = $event,
                  placeholder: "Rama",
                  class: "mt-1.5 w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 text-ink focus:border-forest focus:outline-none",
                  onKeydown: withKeys(withModifiers(add, ["prevent"]), ["enter"])
                }, null, 40, ["onUpdate:modelValue", "onKeydown"]), [
                  [vModelText, unref(draft).name]
                ])
              ]),
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
              createVNode(_component_BadgePicker, {
                modelValue: unref(draft).badgeKey,
                "onUpdate:modelValue": ($event) => unref(draft).badgeKey = $event
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              unref(error) ? (openBlock(), createBlock("p", {
                key: 0,
                class: "chip-neg mt-3"
              }, toDisplayString(unref(error)), 1)) : createCommentVNode("", true),
              createVNode("div", { class: "mt-4 flex gap-2" }, [
                createVNode("button", {
                  type: "button",
                  class: "btn-ghost flex-1",
                  onClick: ($event) => open.value = false
                }, "Cancel", 8, ["onClick"]),
                createVNode("button", {
                  type: "button",
                  class: "btn-forest flex-1",
                  disabled: unref(saving),
                  onClick: add
                }, " Add to trip ", 8, ["disabled"])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddParticipantSheet.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$2, { __name: "AddParticipantSheet" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "EditParticipantSheet",
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
    const draft = reactive({ name: "", badgeKey: "ibex" });
    const error = ref("");
    const saving = ref(false);
    watch(
      [open, () => props.participant],
      () => {
        if (open.value && props.participant) {
          draft.name = props.participant.name;
          draft.badgeKey = props.participant.badgeKey;
          error.value = "";
        }
      },
      { immediate: true }
    );
    async function save() {
      if (!props.participant) return;
      if (!draft.name.trim()) {
        error.value = "Name is required";
        return;
      }
      saving.value = true;
      error.value = "";
      try {
        const bill = await $fetch(
          `/api/bills/${props.billId}/participants/${props.participant.id}`,
          { method: "PATCH", body: { name: draft.name.trim(), badgeKey: draft.badgeKey } }
        );
        emit("done", bill);
        open.value = false;
      } catch (e) {
        error.value = e?.data?.statusMessage || "Could not save";
      } finally {
        saving.value = false;
      }
    }
    async function remove() {
      if (!props.participant) return;
      saving.value = true;
      try {
        const bill = await $fetch(
          `/api/bills/${props.billId}/participants/${props.participant.id}`,
          { method: "DELETE" }
        );
        emit("done", bill);
        open.value = false;
      } catch (e) {
        error.value = e?.data?.statusMessage || "Could not remove";
      } finally {
        saving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BottomSheet = __nuxt_component_0$2;
      const _component_BadgePicker = __nuxt_component_1;
      _push(ssrRenderComponent(_component_BottomSheet, mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event,
        title: "Edit participant"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<label class="block"${_scopeId}><span class="eyebrow"${_scopeId}>Name</span><div class="relative mt-1.5"${_scopeId}><input${ssrRenderAttr("value", unref(draft).name)} class="w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 pr-9 text-ink focus:border-forest focus:outline-none"${_scopeId}><span class="i-tabler-pencil absolute right-3 top-1/2 -translate-y-1/2 text-muted"${_scopeId}></span></div></label><div class="mb-2 mt-4 flex items-center justify-between"${_scopeId}><span class="eyebrow"${_scopeId}>Trail badge</span><span class="text-xs text-muted"${_scopeId}>${ssrInterpolate(__props.participant?.name)} · current</span></div>`);
            _push2(ssrRenderComponent(_component_BadgePicker, {
              modelValue: unref(draft).badgeKey,
              "onUpdate:modelValue": ($event) => unref(draft).badgeKey = $event
            }, null, _parent2, _scopeId));
            _push2(`<button type="button" class="mt-4 flex w-full items-center justify-center gap-2 rounded-control border border-neg-border bg-neg-fill py-2.5 text-sm font-600 text-terracotta"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""}${_scopeId}><span class="i-tabler-trash"${_scopeId}></span> Remove from trip </button>`);
            if (unref(error)) {
              _push2(`<p class="chip-neg mt-3"${_scopeId}>${ssrInterpolate(unref(error))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-4 flex gap-2"${_scopeId}><button type="button" class="btn-ghost flex-1"${_scopeId}>Cancel</button><button type="button" class="btn-forest flex-1"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""}${_scopeId}> Save changes </button></div>`);
          } else {
            return [
              createVNode("label", { class: "block" }, [
                createVNode("span", { class: "eyebrow" }, "Name"),
                createVNode("div", { class: "relative mt-1.5" }, [
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(draft).name = $event,
                    class: "w-full rounded-control border border-line-light bg-surface-input px-3 py-2.5 pr-9 text-ink focus:border-forest focus:outline-none"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(draft).name]
                  ]),
                  createVNode("span", { class: "i-tabler-pencil absolute right-3 top-1/2 -translate-y-1/2 text-muted" })
                ])
              ]),
              createVNode("div", { class: "mb-2 mt-4 flex items-center justify-between" }, [
                createVNode("span", { class: "eyebrow" }, "Trail badge"),
                createVNode("span", { class: "text-xs text-muted" }, toDisplayString(__props.participant?.name) + " · current", 1)
              ]),
              createVNode(_component_BadgePicker, {
                modelValue: unref(draft).badgeKey,
                "onUpdate:modelValue": ($event) => unref(draft).badgeKey = $event
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode("button", {
                type: "button",
                class: "mt-4 flex w-full items-center justify-center gap-2 rounded-control border border-neg-border bg-neg-fill py-2.5 text-sm font-600 text-terracotta",
                disabled: unref(saving),
                onClick: remove
              }, [
                createVNode("span", { class: "i-tabler-trash" }),
                createTextVNode(" Remove from trip ")
              ], 8, ["disabled"]),
              unref(error) ? (openBlock(), createBlock("p", {
                key: 0,
                class: "chip-neg mt-3"
              }, toDisplayString(unref(error)), 1)) : createCommentVNode("", true),
              createVNode("div", { class: "mt-4 flex gap-2" }, [
                createVNode("button", {
                  type: "button",
                  class: "btn-ghost flex-1",
                  onClick: ($event) => open.value = false
                }, "Cancel", 8, ["onClick"]),
                createVNode("button", {
                  type: "button",
                  class: "btn-forest flex-1",
                  disabled: unref(saving),
                  onClick: save
                }, " Save changes ", 8, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EditParticipantSheet.vue");
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
      const _component_ScreenHeader = __nuxt_component_0;
      const _component_AvatarStack = __nuxt_component_1$1;
      const _component_AvatarBadge = __nuxt_component_0$1;
      const _component_BottomNav = __nuxt_component_8;
      const _component_AddParticipantSheet = __nuxt_component_4;
      const _component_EditParticipantSheet = __nuxt_component_5;
      if (unref(bill)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_ScreenHeader, {
          back: "",
          eyebrow: "Roster",
          title: "Souls on this trip",
          onBack: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/bill/${unref(id)}`)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="mt-3 flex items-center gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_AvatarStack, {
                participants: unref(bill).participants,
                max: 7,
                size: 28
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-xs text-muted"${_scopeId}>${ssrInterpolate(unref(bill).participants.length)} souls · ${ssrInterpolate(unref(frontedCount))} fronted cash </span></div>`);
            } else {
              return [
                createVNode("div", { class: "mt-3 flex items-center gap-3" }, [
                  createVNode(_component_AvatarStack, {
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
        _push(`<main class="flex-1 overflow-y-auto px-5 pb-28 pt-4"><div class="flex flex-col gap-2"><!--[-->`);
        ssrRenderList(unref(bill).participants, (p) => {
          _push(`<div class="${ssrRenderClass([p.id === unref(me)?.id ? "border-forest" : "border-line-light", "flex items-center gap-3 rounded-card border bg-surface-card px-3 py-2.5"])}">`);
          _push(ssrRenderComponent(_component_AvatarBadge, {
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
        _push(ssrRenderComponent(_component_BottomNav, {
          active: "users",
          "bill-id": unref(id)
        }, null, _parent));
        _push(ssrRenderComponent(_component_AddParticipantSheet, {
          open: unref(addOpen),
          "onUpdate:open": ($event) => isRef(addOpen) ? addOpen.value = $event : null,
          "bill-id": unref(id),
          taken: unref(takenBadges),
          onDone
        }, null, _parent));
        _push(ssrRenderComponent(_component_EditParticipantSheet, {
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
//# sourceMappingURL=participants-0zuk9hUJ.mjs.map
