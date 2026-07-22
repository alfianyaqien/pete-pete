<script setup lang="ts">
// Global tab-title template: pages set a bare title (e.g. "Create Bill") and it
// becomes "Create Bill | PetePete"; a page with no title stays just "PetePete".
useHead({
  titleTemplate: (title) => (title ? `${title} | PetePete` : 'PetePete'),
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  ],
})

// Default social-share (Open Graph / Twitter) meta. Pages override per-bill.
// Sharing a link is the core flow, so a pasted URL should preview nicely.
useSeoMeta({
  description: 'Split trip expenses with friends — no login, the share link is the key.',
  ogSiteName: 'PetePete',
  ogType: 'website',
  ogTitle: 'PetePete — split the trip, then climb on',
  ogDescription: 'Record who paid for what and settle up with the fewest transfers. No login — just share the link.',
  ogImage: '/og.svg',
  twitterCard: 'summary_large_image',
  twitterTitle: 'PetePete',
  twitterDescription: 'Split trip expenses with friends. No login — just share the link.',
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
