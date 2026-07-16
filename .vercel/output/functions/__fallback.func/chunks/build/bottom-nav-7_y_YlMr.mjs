import { _ as __nuxt_component_0 } from './nuxt-link-7EAqBWen.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderComponent, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "bottom-nav",
  __ssrInlineRender: true,
  props: {
    active: {},
    billId: {}
  },
  setup(__props) {
    const props = __props;
    const items = computed(() => [
      { key: "home", icon: "mountain", to: "/", label: "Trips" },
      { key: "receipt", icon: "receipt", to: props.billId ? `/bill/${props.billId}` : "/", label: "Ledger" },
      {
        key: "users",
        icon: "users",
        to: props.billId ? `/bill/${props.billId}/participants` : "/",
        label: "Souls"
      },
      { key: "settings", icon: "settings", to: "/", label: "Settings" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: "fixed bottom-5 left-1/2 z-40 -translate-x-1/2",
        style: { "padding-bottom": "env(safe-area-inset-bottom)" }
      }, _attrs))}><div class="flex items-center gap-1 rounded-full border border-line-light px-2 py-1.5 shadow-card backdrop-blur-md" style="${ssrRenderStyle({ "background": "rgba(248, 241, 223, 0.92)" })}"><!--[-->`);
      ssrRenderList(unref(items), (it) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: it.key,
          to: it.to,
          class: ["flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors", __props.active === it.key ? "bg-forest text-surface-card" : "text-muted hover:text-ink"],
          "aria-label": it.label
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([`i-tabler-${it.icon}`, "text-xl"])}"${_scopeId}></span>`);
              if (__props.active === it.key) {
                _push2(`<span class="text-xs font-600"${_scopeId}>${ssrInterpolate(it.label)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("span", {
                  class: [`i-tabler-${it.icon}`, "text-xl"]
                }, null, 2),
                __props.active === it.key ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "text-xs font-600"
                }, toDisplayString(it.label), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></nav>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/bottom-nav.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main, { __name: "BottomNav" });

export { __nuxt_component_9 as _ };
//# sourceMappingURL=bottom-nav-7_y_YlMr.mjs.map
