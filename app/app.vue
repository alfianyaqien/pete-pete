<script setup lang="ts">
// Global tab-title template: pages set a bare title (e.g. "Create Bill") and it
// becomes "Create Bill | PetePete"; a page with no title stays just "PetePete".
useHead({
  titleTemplate: (title) => (title ? `${title} | PetePete` : 'PetePete'),
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
