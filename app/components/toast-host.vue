<script setup lang="ts">
import type { ToastType } from '~/composables/useToast'

/**
 * Renders the global toast queue. Direction B "soft tint": a colored wash with a
 * matching hairline and colored text. Positioned bottom-right on desktop and
 * top-of-screen (like a system notification) on mobile. Tap anywhere on a toast
 * to dismiss it.
 */
const { toasts, dismiss } = useToast()

// Icon class strings are written out in full so UnoCSS extracts them.
const style: Record<ToastType, { bg: string; edge: string; icon: string }> = {
  success: { bg: '#E7F0EA', edge: '#1E4D3A', icon: 'i-tabler-circle-check' },
  error: { bg: '#F6E7E0', edge: '#A6492C', icon: 'i-tabler-alert-circle' },
  warning: { bg: '#FAF0DA', edge: '#C2902F', icon: 'i-tabler-alert-triangle' },
  info: { bg: '#E7EEF2', edge: '#35657D', icon: 'i-tabler-info-circle' },
}
</script>

<template>
  <Teleport to="body">
    <div class="pp-toast-host">
      <TransitionGroup name="toast">
        <button
          v-for="t in toasts"
          :key="t.id"
          type="button"
          class="pp-toast"
          role="status"
          aria-live="polite"
          :style="{ background: style[t.type].bg, borderColor: style[t.type].edge + '40', color: style[t.type].edge }"
          @click="dismiss(t.id)"
        >
          <span :class="style[t.type].icon" class="pp-toast-ic" aria-hidden="true" />
          <span class="pp-toast-body">
            <span class="pp-toast-title">{{ t.title }}</span>
            <span v-if="t.message" class="pp-toast-msg">{{ t.message }}</span>
          </span>
          <span class="i-tabler-x pp-toast-x" aria-hidden="true" />
        </button>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.pp-toast-host {
  position: fixed;
  z-index: 70;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}
/* mobile: top, like a notification (clear of the notch) */
.pp-toast-host {
  top: calc(env(safe-area-inset-top) + 10px);
  left: 10px;
  right: 10px;
}
/* desktop: bottom-right, fixed column */
@media (min-width: 641px) {
  .pp-toast-host {
    top: auto;
    left: auto;
    bottom: 20px;
    right: 20px;
    width: 340px;
  }
}
.pp-toast {
  pointer-events: auto;
  cursor: pointer;
  width: 100%;
  text-align: left;
  appearance: none;
  display: flex;
  gap: 9px;
  align-items: center;
  border: 0.5px solid;
  border-radius: 10px;
  padding: 10px 12px;
  box-shadow: 0 6px 18px -10px rgba(46, 37, 25, 0.45);
}
.pp-toast-ic {
  font-size: 18px;
  flex: none;
}
.pp-toast-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.pp-toast-title {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.25;
}
.pp-toast-msg {
  font-size: 11.5px;
  opacity: 0.8;
  line-height: 1.3;
}
.pp-toast-x {
  font-size: 14px;
  opacity: 0.5;
  flex: none;
}
.toast-enter-active,
.toast-leave-active,
.toast-move {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
.toast-leave-active {
  position: absolute;
  left: 0;
  right: 0;
}
/* on desktop the leave-scale should slide right within the fixed column */
@media (min-width: 641px) {
  .toast-enter-from {
    transform: translateX(16px);
  }
}
</style>
