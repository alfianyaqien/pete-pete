<script setup lang="ts">
// Minimal landing. The app is link-based with no login, so there is no bill
// list here - existing bills are reached by their share link; this screen only
// starts a new one.
</script>

<template>
  <main class="app-col flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
    <pp-logo :size="64" />
    <p class="eyebrow mt-5">Trip ledger · split bills</p>
    <h1 class="mt-1 font-serif text-3xl font-700 text-ink">PetePete</h1>
    <p class="mt-3 max-w-xs text-sm text-body">
      Start a trip, add who came along, and split the costs. No login, the
      share link is the key, so anyone you send it to can view &amp; edit.
    </p>

    <core-button to="/bill/new" class="mt-7">
      <span class="i-tabler-plus" /> Create bill
    </core-button>

    <p class="mt-8 flex items-center gap-1.5 text-xs text-muted">
      <span class="i-tabler-link" /> Have a link? Open it to jump straight to that trip.
    </p>
  </main>

  <footer class="app-col px-6 pb-6 pt-2">
    <made-by />
  </footer>
</template>
