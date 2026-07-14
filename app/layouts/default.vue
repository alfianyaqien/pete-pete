<template>
  <div class="flex min-h-screen w-full justify-center" style="background: var(--pp-canvas)">
    <!-- Centered device frame; becomes a rounded card on desktop. -->
    <div
      class="relative flex min-h-screen w-full max-w-md flex-col overflow-hidden shadow-card md:my-6 md:min-h-[calc(100vh-3rem)] md:rounded-[30px] md:border md:border-line-light"
      style="background: var(--pp-screen-mobile)"
    >
      <slot />
    </div>
  </div>
</template>
