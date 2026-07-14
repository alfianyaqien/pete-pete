// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@unocss/nuxt',
    '@nuxt/fonts',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vee-validate/nuxt',
  ],

  css: ['~/assets/css/tokens.css'],

  // Fraunces (serif, headings/numbers) + Inter (UI/body). @nuxt/fonts self-hosts
  // these from Google and generates @font-face automatically.
  fonts: {
    families: [
      { name: 'Fraunces', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
    ],
  },

  veeValidate: {
    // auto-import <Form>, <Field> components and the composables
    autoImports: true,
    componentNames: { Form: 'VeeForm', Field: 'VeeField' },
  },

  // Server-only secrets. The frontend never reads these — only Nitro routes do
  // (via useRuntimeConfig().supabaseUrl / supabaseServiceKey). Overridden in
  // production by NUXT_SUPABASE_URL / NUXT_SUPABASE_SERVICE_KEY env vars.
  runtimeConfig: {
    supabaseUrl: '',
    supabaseServiceKey: '',
    // nothing under `public` — no Supabase keys reach the client
    public: {},
  },

  nitro: {
    preset: 'vercel',
  },
})
