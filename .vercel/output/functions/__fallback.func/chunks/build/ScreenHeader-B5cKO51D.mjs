import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ContourOverlay",
  __ssrInlineRender: true,
  props: {
    opacity: { default: 0.14 },
    stroke: { default: "#1E4D3A" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<svg${ssrRenderAttrs(mergeProps({
        class: "pointer-events-none absolute inset-0 h-full w-full",
        style: { opacity: __props.opacity },
        preserveAspectRatio: "none",
        viewBox: "0 0 400 120",
        fill: "none",
        stroke: __props.stroke,
        "stroke-width": "1",
        "aria-hidden": "true"
      }, _attrs))}><path d="M-10 78 Q90 30 200 62 T410 44"></path><path d="M-10 98 Q90 52 200 84 T410 66"></path><path d="M-10 56 Q100 14 210 42 T410 22"></path><path d="M-10 116 Q110 74 220 104 T410 88"></path></svg>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContourOverlay.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$1, { __name: "ContourOverlay" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ScreenHeader",
  __ssrInlineRender: true,
  props: {
    eyebrow: {},
    title: {},
    meta: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ContourOverlay = __nuxt_component_0$1;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "relative overflow-hidden bg-surface-header" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ContourOverlay, null, null, _parent));
      _push(`<div class="relative px-5 pt-3 pb-4"><div class="flex items-start gap-3">`);
      if (__props.back) {
        _push(`<button type="button" class="mt-0.5 flex size-9 flex-none items-center justify-center rounded-control bg-surface-card/70 text-ink" aria-label="Back"><span class="i-tabler-arrow-left text-lg"></span></button>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "brand", {}, null, _push, _parent);
      _push(`<div class="min-w-0 flex-1">`);
      if (__props.eyebrow) {
        _push(`<p class="eyebrow">${ssrInterpolate(__props.eyebrow)}</p>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "title", {}, () => {
        if (__props.title) {
          _push(`<h1 class="font-serif text-2xl font-700 leading-tight text-ink">${ssrInterpolate(__props.title)}</h1>`);
        } else {
          _push(`<!---->`);
        }
      }, _push, _parent);
      if (__props.meta) {
        _push(`<p class="mt-0.5 text-xs text-muted">${ssrInterpolate(__props.meta)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex-none">`);
      ssrRenderSlot(_ctx.$slots, "right", {}, null, _push, _parent);
      _push(`</div></div>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></header>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ScreenHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "ScreenHeader" });

export { __nuxt_component_0 as _, __nuxt_component_0$1 as a };
//# sourceMappingURL=ScreenHeader-B5cKO51D.mjs.map
