<template>
  <v-card
    class="search-tabs rounded"
    elevation="1"
    :class="{ 'search-tabs--xs': display.xs.value }"
  >
    <v-tabs
      v-model="activeTab"
      bg-color="transparent"
      color="primary"
      grow
      class="search-tabs-nav"
      :density="display.xs.value ? 'compact' : 'default'"
    >
      <v-tab value="booking" class="search-tab" @click="handleTabChange('booking')">
        <v-icon start :size="display.xs.value ? 18 : 20">mdi-bed</v-icon>
        Booking
      </v-tab>
      <v-tab value="ticket" class="search-tab" @click="handleTabChange('ticket')">
        <v-icon start :size="display.xs.value ? 18 : 20">mdi-ticket-confirmation</v-icon>
        Tickets
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-window v-model="activeTab" class="search-forms-window">
      <v-window-item value="booking">
        <HomeBookingSearchForm />
      </v-window-item>
      <v-window-item value="ticket">
        <HomeTicketSearchForm />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts" setup>
import type { ProductType } from "~/composables/core/interfaces";
import { useProductType } from "~/composables/data/useProductType";

const display = useDisplay();
const { setProductType } = useProductType();
const router = useRouter();

const activeTab = ref<ProductType>("booking");

const handleTabChange = (type: ProductType) => {
  setProductType(type);
};

const route = useRoute();
watch(
  () => route.query.type as ProductType | undefined,
  (type) => {
    const t = type === "ticket" ? "ticket" : "booking";
    activeTab.value = t;
    setProductType(t);
  },
  { immediate: true }
);
</script>

<style scoped>
.search-tabs {
  margin-top: -80px;
  position: relative;
  z-index: 10;
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: var(--transition-smooth);
}
.search-tabs:hover {
  box-shadow: var(--shadow-hover);
}
.search-tabs-nav {
  padding-inline: 16px;
}
.search-tab {
  text-transform: none;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.search-tabs--xs .search-tab {
  font-size: 0.8125rem;
  min-width: 0;
  padding-inline: 12px;
}
.search-tabs--xs .search-tabs-nav {
  padding-inline: 8px;
}
.search-forms-window {
  overflow: visible;
}
@media (max-width: 600px) {
  .search-tabs {
    margin-top: -48px;
  }
}
</style>
