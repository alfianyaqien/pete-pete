import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "pp-logo",
  __ssrInlineRender: true,
  props: {
    size: { default: 28 }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<svg${ssrRenderAttrs(mergeProps({
        width: __props.size,
        height: __props.size,
        viewBox: "0 0 32 32",
        "aria-label": "PetePete"
      }, _attrs))}><circle cx="16" cy="16" r="15" fill="#1E4D3A"></circle><path d="M16 7 L23 22 L16 18 L9 22 Z" fill="#F8F1DF"></path><path d="M16 7 L16 18 L9 22 Z" fill="#C2902F"></path><circle cx="16" cy="16" r="15" fill="none" stroke="#143729" stroke-width="1"></circle></svg>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pp-logo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "PpLogo" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=pp-logo-CpF3v6Xe.mjs.map
