import { a as __nuxt_component_0$1 } from './screen-header-ugST2aQ7.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "hero-panel",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_contour_overlay = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative overflow-hidden rounded-card-lg text-surface-card shadow-hero",
        style: { "background": "var(--pp-hero)", "border": "1px solid #163a2c" }
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_contour_overlay, {
        opacity: 0.16,
        stroke: "#9DC2AE"
      }, null, _parent));
      _push(`<div class="relative p-5">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/hero-panel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "HeroPanel" });

export { __nuxt_component_3 as _ };
//# sourceMappingURL=hero-panel-C8Sdz9jx.mjs.map
