<script setup lang="ts">
// Global tab-title template: pages set a bare title (e.g. "Create Bill") and it
// becomes "Create Bill | PetePete"; a page with no title stays just "PetePete".
useHead({
  titleTemplate: (title) => (title ? `${title} | PetePete` : 'PetePete'),
  htmlAttrs: { lang: 'en' },
  // Full favicon pack (public/): SVG for modern browsers, PNG sizes, .ico
  // fallback, apple-touch-icon for iOS home screen, and the PWA manifest.
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
  ],
  meta: [{ name: 'theme-color', content: '#1E4D3A' }],
})

// Default social-share (Open Graph / Twitter) meta. Pages override per-bill.
// Sharing a link is the core flow, so a pasted URL should preview nicely.
useSeoMeta({
  description: 'Split trip expenses with friends - no login, the share link is the key.',
  ogSiteName: 'PetePete',
  ogType: 'website',
  ogTitle: 'PetePete - split bills with friends on the road',
  ogDescription: 'Record who paid for what and settle up with the fewest transfers. No login - just share the link.',
  ogImage: '/og.svg',
  twitterCard: 'summary_large_image',
  twitterTitle: 'PetePete',
  twitterDescription: 'Split trip expenses with friends. No login - just share the link.',
  twitterImage: '/og.svg',
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
