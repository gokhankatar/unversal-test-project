<template>
  <div class="search-filter-panel">
    <v-btn
      variant="outlined"
      color="primary"
      :size="display.xl.value ? 'large' : 'default'"
      class="filter-trigger"
      @click="drawer = true"
      text="Filters"
      prepend-icon="mdi-filter-variant"
    />

    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="end"
      width="320"
      class="filter-drawer"
    >
      <v-list density="compact" class="pa-3">
        <v-list-item class="filter-drawer-title">
          <template #prepend>
            <v-icon>mdi-filter-variant</v-icon>
          </template>
          <v-list-item-title class="text-subtitle-2 text-lg-subtitle-1 text-xl-h6"
            >Filters</v-list-item-title
          >
          <template #append>
            <v-btn variant="text" size="small" @click="drawer = false" icon="mdi-close" />
          </template>
        </v-list-item>
        <v-divider class="my-2" />

        <!-- Price (both) -->
        <v-list-item class="filter-section">
          <v-list-item-title class="text-subtitle-2 mb-2">Price</v-list-item-title>
          <div class="filter-fields">
            <v-text-field
              :model-value="localMinPrice"
              type="number"
              label="Min $"
              variant="outlined"
              density="compact"
              hide-details
              min="0"
              @update:model-value="localMinPrice = $event"
            />
            <v-text-field
              :model-value="localMaxPrice"
              type="number"
              label="Max $"
              variant="outlined"
              density="compact"
              hide-details
              min="0"
              @update:model-value="localMaxPrice = $event"
            />
          </div>
        </v-list-item>

        <!-- Booking: Rating & Type -->
        <template v-if="isBooking">
          <v-list-item class="filter-section">
            <v-list-item-title class="text-subtitle-2 mb-2">Rating</v-list-item-title>
            <v-select
              :model-value="localRating"
              :items="ratingOptions"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              placeholder="Any"
              @update:model-value="localRating = $event"
            />
          </v-list-item>
          <v-list-item class="filter-section">
            <v-list-item-title class="text-subtitle-2 mb-2">Type</v-list-item-title>
            <v-select
              :model-value="localType"
              :items="bookingTypeOptions"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              placeholder="Any"
              @update:model-value="localType = $event"
            />
          </v-list-item>
        </template>

        <!-- Ticket: Company & Time range -->
        <template v-else>
          <v-list-item class="filter-section">
            <v-list-item-title class="text-subtitle-2 mb-2">Company</v-list-item-title>
            <v-text-field
              :model-value="localCompany"
              label="Company name"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              placeholder="e.g. Turkish Airlines"
              @update:model-value="localCompany = $event"
            />
          </v-list-item>
          <v-list-item class="filter-section">
            <v-list-item-title class="text-subtitle-2 mb-2">Time range</v-list-item-title>
            <div class="filter-fields">
              <v-text-field
                :model-value="localMinTime"
                type="time"
                label="From"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="localMinTime = $event"
              />
              <v-text-field
                :model-value="localMaxTime"
                type="time"
                label="To"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="localMaxTime = $event"
              />
            </div>
          </v-list-item>
        </template>

        <v-divider class="my-2" />
        <v-list-item class="filter-actions">
          <v-btn variant="text" size="small" @click="resetFilters">Reset</v-btn>
          <v-btn color="primary" size="small" @click="applyFilters">Apply</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts" setup>
import { useProductType } from "~/composables/data/useProductType";

const props = defineProps<{
  query: Record<string, string | number | undefined>;
}>();

const emit = defineEmits<{
  apply: [q: Record<string, string | number>];
}>();

const display = useDisplay();
const router = useRouter();
const route = useRoute();
const { isBooking } = useProductType();

const drawer = ref(false);

const ratingOptions = [
  { title: "4+", value: 4 },
  { title: "4.5+", value: 4.5 },
  { title: "4.7+", value: 4.7 },
  { title: "4.9+", value: 4.9 },
];

const bookingTypeOptions = [
  { title: "Hotel", value: "hotel" },
  { title: "Apartment", value: "apartment" },
  { title: "Villa", value: "villa" },
];

const localMinPrice = ref<string | number>("");
const localMaxPrice = ref<string | number>("");
const localRating = ref<string | number | undefined>(undefined);
const localType = ref<string | undefined>(undefined);
const localCompany = ref("");
const localMinTime = ref("");
const localMaxTime = ref("");

watch(
  () => props.query,
  (q) => {
    localMinPrice.value = q.minPrice ?? "";
    localMaxPrice.value = q.maxPrice ?? "";
    localRating.value = q.rating ?? undefined;
    localType.value = (q.accommodationType as string) ?? (q.type as string) ?? undefined;
    localCompany.value = String(q.company ?? "");
    localMinTime.value = String(q.minTime ?? "");
    localMaxTime.value = String(q.maxTime ?? "");
  },
  { immediate: true, deep: true }
);

const activeCount = computed(() => {
  let c = 0;
  if (localMinPrice.value) c++;
  if (localMaxPrice.value) c++;
  if (localRating.value) c++;
  if (localType.value) c++;
  if (localCompany.value) c++;
  if (localMinTime.value) c++;
  if (localMaxTime.value) c++;
  return c;
});

const applyFilters = () => {
  const base = { ...route.query };
  const q: Record<string, string | number> = { ...base } as Record<
    string,
    string | number
  >;
  if (localMinPrice.value) q.minPrice = Number(localMinPrice.value);
  else delete q.minPrice;
  if (localMaxPrice.value) q.maxPrice = Number(localMaxPrice.value);
  else delete q.maxPrice;
  if (isBooking.value) {
    if (localRating.value) q.rating = Number(localRating.value);
    else delete q.rating;
    if (localType.value) q.accommodationType = localType.value;
    else delete q.accommodationType;
  } else {
    if (localCompany.value) q.company = localCompany.value;
    else delete q.company;
    if (localMinTime.value) q.minTime = localMinTime.value;
    else delete q.minTime;
    if (localMaxTime.value) q.maxTime = localMaxTime.value;
    else delete q.maxTime;
  }
  router.push({ path: "/search", query: q });
  drawer.value = false;
};

const resetFilters = () => {
  localMinPrice.value = "";
  localMaxPrice.value = "";
  localRating.value = undefined;
  localType.value = undefined;
  localCompany.value = "";
  localMinTime.value = "";
  localMaxTime.value = "";
};
</script>

<style scoped>
.search-filter-panel {
  display: inline-block;
}
.filter-trigger {
  text-transform: none;
}
.filter-drawer-title {
  min-height: 48px;
}
.filter-section {
  flex-direction: column;
  align-items: stretch;
  min-height: auto;
  padding-block: 12px;
}
.filter-section .v-list-item-title {
  margin-bottom: 4px;
}
.filter-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.filter-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  min-height: auto;
  padding-block: 8px;
}
</style>
