import { defineComponent, useModel, mergeProps, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "core-segmented-control",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    options: {},
    accent: {}
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "inline-flex w-full gap-1 rounded-control bg-surface-input p-1" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.options, (o) => {
        _push(`<button type="button" class="${ssrRenderClass([
          model.value === o.value ? __props.accent === "ochre" ? "bg-ochre text-white" : "bg-forest text-surface-card" : "text-body",
          "flex flex-1 items-center justify-center gap-1 rounded-chip py-2 text-sm font-600 transition-colors"
        ])}">`);
        if (o.icon) {
          _push(`<span class="${ssrRenderClass(`i-tabler-${o.icon}`)}"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(o.label)}</button>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/core-segmented-control.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main, { __name: "CoreSegmentedControl" });

export { __nuxt_component_6 as _ };
//# sourceMappingURL=core-segmented-control-D0OMPWpk.mjs.map
