<template>
  <Transition name="scroll-fab">
    <v-btn
      v-show="visible"
      class="scroll-to-top"
      icon="mdi-chevron-up"
      color="primary"
      size="large"
      elevation="4"
      aria-label="Scroll to top"
      @click="scrollToTop"
    />
  </Transition>
</template>

<script lang="ts" setup>
const visible = ref(false);
const THRESHOLD = 400;

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const onScroll = () => {
  visible.value = window.scrollY > THRESHOLD;
};

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
});
onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  border-radius: 50% !important;
  box-shadow: var(--shadow-hover);
}
.scroll-to-top:hover {
  transform: translateY(-2px);
}

.scroll-fab-enter-active,
.scroll-fab-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.scroll-fab-enter-from,
.scroll-fab-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
