import { defineComponent, useModel, mergeModels, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderStyle, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BottomSheet",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    title: {}
  }, {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {}
  }),
  emits: ["update:open"],
  setup(__props) {
    const open = useModel(__props, "open");
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (open.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-end justify-center" data-v-253eedb5><div class="absolute inset-0" style="${ssrRenderStyle({ "background": "rgba(46, 37, 25, 0.42)" })}" data-v-253eedb5></div><div class="relative w-full max-w-md rounded-t-sheet bg-surface-card px-5 pb-7 pt-3 text-ink shadow-card" style="${ssrRenderStyle({ "padding-bottom": "calc(1.75rem + env(safe-area-inset-bottom))" })}" data-v-253eedb5><div class="mx-auto mb-3 h-1 w-[38px] rounded-full bg-line-medium" data-v-253eedb5></div>`);
          if (__props.title || _ctx.$slots.header) {
            _push2(`<div class="mb-3 flex items-center justify-between" data-v-253eedb5>`);
            ssrRenderSlot(_ctx.$slots, "header", {}, () => {
              _push2(`<h2 class="font-serif text-lg font-600" data-v-253eedb5>${ssrInterpolate(__props.title)}</h2>`);
            }, _push2, _parent);
            _push2(`<button type="button" aria-label="Close" data-v-253eedb5><span class="i-tabler-x text-muted" data-v-253eedb5></span></button></div>`);
          } else {
            _push2(`<!---->`);
          }
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BottomSheet.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-253eedb5"]]), { __name: "BottomSheet" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=BottomSheet-Cu9tTmnK.mjs.map
