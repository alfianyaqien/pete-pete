import { _ as __nuxt_component_0 } from './nuxt-link-BipftbZ7.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BottomNav",
  __ssrInlineRender: true,
  props: {
    active: {},
    billId: {}
  },
  setup(__props) {
    const props = __props;
    const items = computed(() => [
      { key: "home", icon: "mountain", to: "/" },
      { key: "receipt", icon: "receipt", to: props.billId ? `/bill/${props.billId}` : "/" },
      {
        key: "users",
        icon: "users",
        to: props.billId ? `/bill/${props.billId}/participants` : "/"
      },
      { key: "settings", icon: "settings", to: "/" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: "flex border-t border-line-light bg-surface-card",
        style: { "padding-bottom": "env(safe-area-inset-bottom)" }
      }, _attrs))}><!--[-->`);
      ssrRenderList(unref(items), (it) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: it.key,
          to: it.to,
          class: ["flex flex-1 flex-col items-center gap-0.5 py-2.5", __props.active === it.key ? "text-forest" : "text-muted"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([`i-tabler-${it.icon}`, "text-xl"])}"${_scopeId}></span>`);
            } else {
              return [
                createVNode("span", {
                  class: [`i-tabler-${it.icon}`, "text-xl"]
                }, null, 2)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BottomNav.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main, { __name: "BottomNav" });

export { __nuxt_component_8 as _ };
//# sourceMappingURL=BottomNav-D9s6ml1v.mjs.map
