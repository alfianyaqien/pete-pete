<template>
  <!-- One seamless full-width background across the whole viewport (no phone
       frame, no side gutters). Fixed height + overflow-hidden so the header
       and footer stay pinned and only the page's <main> scrolls. Content is
       width-limited via the `app-col` shortcut on each screen's inner content,
       not by boxing the shell. -->
  <div
    class="relative flex h-[100dvh] w-full flex-col overflow-hidden"
    style="background: var(--pp-screen-mobile)"
  >
    <slot />
  </div>
</template>
