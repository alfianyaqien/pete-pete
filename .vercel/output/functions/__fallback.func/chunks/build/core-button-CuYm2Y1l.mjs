import { _ as __nuxt_component_0 } from './nuxt-link-7EAqBWen.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "core-button",
  __ssrInlineRender: true,
  props: {
    variant: { default: "forest" },
    to: {},
    type: { default: "button" },
    block: { type: Boolean },
    disabled: { type: Boolean },
    loading: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const classes = computed(() => [
      { forest: "btn-forest", ochre: "btn-ochre", ghost: "btn-ghost", danger: "btn-danger" }[props.variant],
      props.block ? "w-full" : ""
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (__props.to) {
        _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
          to: __props.to,
          class: unref(classes)
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "default")
              ];
            }
          }),
          _: 3
        }, _parent));
      } else {
        _push(`<button${ssrRenderAttrs(mergeProps({
          type: __props.type,
          class: unref(classes),
          disabled: __props.disabled || __props.loading
        }, _attrs))}>`);
        if (__props.loading) {
          _push(`<span class="i-tabler-loader-2 animate-spin"></span>`);
        } else {
          _push(`<!---->`);
        }
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</button>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/core-button.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "CoreButton" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=core-button-CuYm2Y1l.mjs.map
