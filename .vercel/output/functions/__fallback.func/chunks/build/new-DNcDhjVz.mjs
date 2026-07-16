import { _ as __nuxt_component_0 } from './screen-header-ugST2aQ7.mjs';
import { u as useForm, a as useFieldArray, _ as __nuxt_component_1, t as toTypedSchema } from './vee-validate-zod-BpRQT81S.mjs';
import { _ as __nuxt_component_0$1 } from './avatar-badge-bLaz6-lC.mjs';
import { _ as __nuxt_component_2 } from './core-button-CuYm2Y1l.mjs';
import { n as navigateTo } from './server.mjs';
import { defineComponent, ref, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { B as BADGE_KEYS, c as createBillInputSchema } from '../_/schemas.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "new",
  __ssrInlineRender: true,
  setup(__props) {
    const { handleSubmit, isSubmitting } = useForm({
      validationSchema: toTypedSchema(createBillInputSchema),
      initialValues: { title: "", participants: [] }
    });
    const { fields, push, remove } = useFieldArray("participants");
    const previewBadge = (i) => BADGE_KEYS[i % BADGE_KEYS.length];
    const serverError = ref("");
    const onSubmit = handleSubmit(async (values) => {
      serverError.value = "";
      try {
        const bill = await $fetch("/api/bills", { method: "POST", body: values });
        await navigateTo(`/bill/${bill.id}`);
      } catch (e) {
        serverError.value = e?.data?.statusMessage || "Could not create bill";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_screen_header = __nuxt_component_0;
      const _component_core_input = __nuxt_component_1;
      const _component_avatar_badge = __nuxt_component_0$1;
      const _component_core_button = __nuxt_component_2;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_screen_header, {
        back: "",
        title: "New bill",
        onBack: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/")
      }, null, _parent));
      _push(`<main class="app-col flex-1 overflow-y-auto px-5 pb-28 pt-4"><form>`);
      _push(ssrRenderComponent(_component_core_input, {
        name: "title",
        label: "Bill title",
        placeholder: "Argopuro"
      }, null, _parent));
      _push(`<div class="mt-6"><span class="eyebrow">Participants (${ssrInterpolate(unref(fields).length)})</span><div class="mt-2 flex flex-col gap-2"><!--[-->`);
      ssrRenderList(unref(fields), (field, i) => {
        _push(`<div class="flex items-center gap-3 rounded-card border border-line-light bg-surface-card px-3 py-2">`);
        _push(ssrRenderComponent(_component_avatar_badge, {
          "badge-key": previewBadge(i),
          size: 34
        }, null, _parent));
        _push(`<div class="flex-1">`);
        _push(ssrRenderComponent(_component_core_input, {
          name: `participants[${i}].name`,
          variant: "bare",
          placeholder: "Name"
        }, null, _parent));
        _push(`</div><button type="button" aria-label="Remove" class="text-terracotta"><span class="i-tabler-x"></span></button></div>`);
      });
      _push(`<!--]--><button type="button" class="flex items-center justify-center gap-2 rounded-card border border-dashed border-line-medium bg-surface-subtle py-2.5 text-sm font-600 text-forest"><span class="i-tabler-plus"></span> Add participant </button></div></div>`);
      if (unref(serverError)) {
        _push(`<p class="chip-neg mt-3">${ssrInterpolate(unref(serverError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-4 flex items-start gap-2 rounded-control border border-line-light bg-surface-subtle px-3 py-3 text-xs leading-relaxed text-body"><span class="i-tabler-info-circle mt-0.5 text-ochre"></span><span> No login needed. The share link is the key — anyone with it can view &amp; edit. Names must be unique; each gets a trail badge. </span></div></form></main><div class="flex-none border-t border-line-light bg-surface-card px-5 py-3"><div class="app-col">`);
      _push(ssrRenderComponent(_component_core_button, {
        block: "",
        loading: unref(isSubmitting),
        onClick: unref(onSubmit)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Create &amp; add expense <span class="i-tabler-arrow-right"${_scopeId}></span>`);
          } else {
            return [
              createTextVNode(" Create & add expense "),
              createVNode("span", { class: "i-tabler-arrow-right" })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/bill/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=new-DNcDhjVz.mjs.map
