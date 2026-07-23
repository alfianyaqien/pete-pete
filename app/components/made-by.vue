<script setup lang="ts">
/** Author credit / copyright line. Single source of truth for the footnote so
 *  every page shows the same text, link and (dynamic) year. */
const year = new Date().getFullYear()
</script>

<template>
  <p class="text-center text-[11px] text-muted">
    © {{ year }} · Made by
    <a
      href="https://ahmadiqball.com"
      target="_blank"
      rel="noopener"
      class="font-600 text-forest underline decoration-line-medium underline-offset-2 hover:decoration-forest"
    >Ahmad Iqbal</a>
  </p>
</template>
