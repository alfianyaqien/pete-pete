import { _ as __nuxt_component_0 } from './avatar-badge-bLaz6-lC.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderStyle, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "avatar-stack",
  __ssrInlineRender: true,
  props: {
    participants: {},
    max: { default: 5 },
    size: { default: 28 }
  },
  setup(__props) {
    const props = __props;
    const shown = computed(() => props.participants.slice(0, props.max));
    const overflow = computed(() => Math.max(0, props.participants.length - props.max));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_avatar_badge = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(shown), (p, i) => {
        _push(`<div class="rounded-full ring-2 ring-surface-card" style="${ssrRenderStyle({ marginLeft: i ? "-8px" : "0", zIndex: unref(shown).length - i })}">`);
        _push(ssrRenderComponent(_component_avatar_badge, {
          "badge-key": p.badgeKey,
          size: __props.size
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]-->`);
      if (unref(overflow)) {
        _push(`<span class="flex items-center justify-center rounded-full bg-surface-input font-600 text-muted ring-2 ring-surface-card" style="${ssrRenderStyle({
          marginLeft: "-8px",
          width: __props.size + "px",
          height: __props.size + "px",
          fontSize: Math.round(__props.size * 0.38) + "px"
        })}"> +${ssrInterpolate(unref(overflow))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/avatar-stack.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "AvatarStack" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=avatar-stack-BSc6BmaN.mjs.map
