import { A as AVATARS, _ as __nuxt_component_0 } from './AvatarBadge-Db5SDNyy.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import '../_/schemas.mjs';
import 'zod';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "badges",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AvatarBadge = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-2xl p-6 font-sans text-ink" }, _attrs))}><p class="eyebrow">Signature asset</p><h1 class="font-serif text-2xl font-700 mb-1">Trail badges · ${ssrInterpolate(unref(AVATARS).length)} in the set</h1><p class="text-body text-sm mb-6">Woodcut line on parchment · ring rotates forest / ochre / terracotta.</p><div class="grid grid-cols-6 gap-x-3 gap-y-5"><!--[-->`);
      ssrRenderList(unref(AVATARS), (a) => {
        _push(`<div class="text-center">`);
        _push(ssrRenderComponent(_component_AvatarBadge, {
          "badge-key": a.key,
          size: 60
        }, null, _parent));
        _push(`<div class="text-[11px] text-body mt-1">${ssrInterpolate(a.label)}</div></div>`);
      });
      _push(`<!--]--></div></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/badges.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=badges-CTFLd5fo.mjs.map
