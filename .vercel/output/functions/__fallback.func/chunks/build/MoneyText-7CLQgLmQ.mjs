import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { b as formatAmount, f as formatRupiah } from './useBill-NokyyOIb.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MoneyText",
  __ssrInlineRender: true,
  props: {
    value: {},
    prefix: { type: Boolean, default: true },
    signed: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const text = computed(() => {
      if (props.signed) {
        const sign = props.value > 0 ? "+" : props.value < 0 ? "−" : "";
        return sign + (props.prefix ? "Rp " : "") + formatAmount(Math.abs(props.value));
      }
      return props.prefix ? formatRupiah(props.value) : formatAmount(props.value);
    });
    const tone = computed(
      () => props.signed ? props.value > 0 ? "text-forest" : props.value < 0 ? "text-terracotta" : "text-muted" : ""
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["num", unref(tone)]
      }, _attrs))}>${ssrInterpolate(unref(text))}</span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MoneyText.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "MoneyText" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=MoneyText-7CLQgLmQ.mjs.map
