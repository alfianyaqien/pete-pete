import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dev",
  __ssrInlineRender: true,
  setup(__props) {
    const title = ref("Argopuro");
    const namesText = ref("Iqbal, Qoni, Surya");
    const created = ref(null);
    const fetched = ref(null);
    const error = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-md p-6 font-sans text-ink" }, _attrs))}><p class="eyebrow">Vertical slice</p><h1 class="font-serif text-2xl font-700 mb-4">Create &amp; read a bill</h1><div class="card-parchment p-4 mb-4 space-y-3"><label class="block"><span class="eyebrow">Bill title</span><input${ssrRenderAttr("value", unref(title))} class="mt-1 w-full rounded-control bg-surface-input px-3 py-2"></label><label class="block"><span class="eyebrow">Participants (comma-separated)</span><input${ssrRenderAttr("value", unref(namesText))} class="mt-1 w-full rounded-control bg-surface-input px-3 py-2"></label><div class="flex gap-2"><button class="btn-forest">Create</button><button class="btn-ghost"${ssrIncludeBooleanAttr(!unref(created)) ? " disabled" : ""}>Read back by id</button></div></div>`);
      if (unref(error)) {
        _push(`<p class="chip-neg mb-4">${ssrInterpolate(unref(error))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(created)) {
        _push(`<div class="card-parchment p-4 mb-4"><p class="eyebrow mb-1">Created (POST /api/bills)</p><p class="text-sm">id: <code>${ssrInterpolate(unref(created).id)}</code></p><p class="text-sm">${ssrInterpolate(unref(created).participants.length)} souls · badges: ${ssrInterpolate(unref(created).participants.map((p) => `${p.name}=${p.badgeKey}`).join(", "))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(fetched)) {
        _push(`<div class="card-parchment p-4"><p class="eyebrow mb-1">Fetched (GET /api/bills/:id)</p><pre class="text-xs overflow-auto">${ssrInterpolate(JSON.stringify(unref(fetched), null, 2))}</pre></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dev.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dev-BhxP3DBy.mjs.map
