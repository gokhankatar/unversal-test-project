<template>
  <v-app>
    <template v-if="showLoading">
      <Loading />
    </template>
    <template v-else>
      <AppHeader />
      <v-main class="main-with-fixed-header">
        <NuxtPage />
      </v-main>
      <AppFooter />
      <ScrollToTop />
    </template>
  </v-app>
</template>

<script lang="ts" setup>
import Loading from "~/components/common/Loading.vue";
import ScrollToTop from "~/components/common/ScrollToTop.vue";
import AppFooter from "~/components/layout/AppFooter.vue";
import AppHeader from "~/components/layout/AppHeader.vue";

const showLoading = ref(true);

onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    showLoading.value = false;
  }, 1000);
});
</script>

<style>
.main-with-fixed-header {
  padding-top: 64px !important;
  overflow-x: hidden;
}
</style>
