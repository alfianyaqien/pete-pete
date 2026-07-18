import {
  defineConfig,
  presetWind3,
  presetIcons,
  presetTypography,
} from 'unocss'

/**
 * PetePete design tokens — sourced verbatim from the design handoff
 * (design_handoff_petepete/README.md "Design Tokens").
 * The palette/radii/shadows live here as the UnoCSS `theme`; recurring
 * component recipes live in `shortcuts`.
 */
export default defineConfig({
  presets: [
    presetWind3(),                       // Tailwind-syntax utilities
    presetTypography(),
    presetIcons({                        // pure-CSS Tabler icons: <span class="i-tabler-mountain" />
      scale: 1.1,
      extraProperties: { display: 'inline-block', 'vertical-align': 'middle' },
    }),
  ],
  theme: {
    colors: {
      // brand
      forest: {
        DEFAULT: '#1E4D3A',
        deep: '#143729',
        700: '#1C4636',
        600: '#27604A',
        edge: '#163A2C',
      },
      ochre: { DEFAULT: '#C2902F', text: '#8A5A11' },
      terracotta: { DEFAULT: '#A6492C' },
      // text
      ink: '#2E2519',
      body: '#6E5F49',
      muted: '#8A7547',
      // surfaces
      surface: {
        card: '#F8F1DF',
        'card-warm': '#FBF5E6',
        'card-cool': '#F4EDD6',
        input: '#E7D9BC',
        header: '#EFE3CB',
        subtle: '#F4EAD3',
        'subtle-2': '#FBF6E8',
      },
      // borders / rules
      line: {
        light: '#DBC9A6',
        medium: '#C9B894',
        faint: '#EADBBC',
      },
      // semantic status pairs (fill / border / text)
      pos: { fill: '#E0EDE3', border: '#BFD6C8', text: '#1E4D3A' },
      warn: { fill: '#F1E3C4', border: '#E0CB95', text: '#8A5A11' },
      neg: { fill: '#F6E6DD', border: '#E0B6A4', text: '#A6492C' },
      // dark "hero" panel accents
      hero: {
        gold: '#E7B968',
        'gold-deep': '#E0A53C',
        pos: '#9DDFB6',
        'pos-deep': '#5FB07E',
        muted: '#9DC2AE',
      },
    },
    fontFamily: {
      serif: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    borderRadius: {
      frame: '34px',
      card: '16px',
      'card-sm': '14px',
      'card-lg': '18px',
      control: '10px',
      chip: '8px',
      'chip-sm': '6px',
      pill: '20px',
      sheet: '22px',
    },
    boxShadow: {
      card: '0 5px 14px -6px rgba(46,37,25,.18), 0 1px 2px rgba(46,37,25,.05)',
      raised: '0 3px 9px -5px rgba(46,37,25,.16)',
      hero: '0 16px 30px -16px rgba(20,55,41,.7)',
    },
  },
  rules: [
    // tabular-figure alignment for every numeric value (handoff requirement)
    ['tnum', { 'font-feature-settings': "'tnum'", 'font-variant-numeric': 'tabular-nums' }],
  ],
  shortcuts: {
    // centered content column — width-limited on desktop but transparent, so it
    // sits seamlessly on the one continuous app background (no boxed gutters).
    // Headers/footers span full width; only their inner content uses this.
    'app-col': 'mx-auto w-full max-w-[620px]',
    // typographic
    eyebrow:
      'text-[10px] font-600 tracking-[.1em] uppercase text-muted font-sans',
    // surfaces
    'card-parchment':
      'bg-surface-card border border-line-light rounded-card shadow-card',
    // buttons
    'btn-base':
      'inline-flex items-center justify-center gap-1.5 rounded-control font-sans font-600 text-sm px-4 py-2.5 transition-colors disabled:opacity-60',
    'btn-forest': 'btn-base bg-forest text-surface-card hover:bg-forest-700',
    'btn-ochre': 'btn-base bg-ochre text-white hover:bg-ochre-text',
    'btn-ghost':
      'btn-base bg-transparent border border-line-medium text-ink hover:bg-surface-subtle',
    'btn-danger': 'btn-base bg-neg-fill border border-neg-border text-terracotta',
    'btn-remove':
      'btn-base bg-transparent border border-transparent px-2 py-1.5 text-terracotta hover:bg-neg-fill hover:border-neg-border',
    // status chips
    'chip-base':
      'inline-flex items-center gap-1 rounded-chip-sm px-2 py-1 text-[11px] font-600 font-sans',
    'chip-pos': 'chip-base bg-pos-fill border border-pos-border text-pos-text',
    'chip-warn': 'chip-base bg-warn-fill border border-warn-border text-warn-text',
    'chip-neg': 'chip-base bg-neg-fill border border-neg-border text-neg-text',

    // form fields — replaces all native browser chrome. Each variant fully
    // specifies its own border/background so combining classes never leaves
    // two shortcuts fighting over the same property.
    'field-shared':
      'rounded-control text-ink placeholder-muted font-sans transition-colors focus:outline-none disabled:opacity-60',
    field:
      'field-shared w-full border-2 border-solid border-line-light bg-surface-input px-3 py-2.5 focus:border-forest focus:ring-2 focus:ring-forest/15',
    'field-compact':
      'field-shared w-full border border-solid border-line-light bg-surface-input px-2.5 py-1.5 text-sm focus:border-forest focus:ring-2 focus:ring-forest/15',
    'field-emphasis':
      'field-shared w-full border-2 border-forest border-solid bg-surface-input px-3 py-2.5 focus:ring-2 focus:ring-forest/20',
    'field-bare':
      'field-shared w-full border-0 bg-transparent p-0 focus:ring-0',
    // selects: appearance-none native <select>, paired with AppSelect's chevron icon
    'select-field': 'field appearance-none pr-9 cursor-pointer',
    'select-bare':
      'field-shared w-full appearance-none border-0 bg-transparent p-0 pr-6 font-600 cursor-pointer focus:ring-0',
  },
  safelist: [
    // a couple of icons referenced dynamically in early test scaffolding
    'i-tabler-mountain',
    'i-tabler-receipt',
    'i-tabler-users',
    'i-tabler-settings',
  ],
})
