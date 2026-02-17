<template>
  <form class="booking-form search-form-compact" @submit.prevent="handleSearch">
    <v-container fluid class="pa-2 pa-sm-3">
      <v-row align="center" dense class="search-form-row">
        <v-col cols="12" md="4">
          <v-autocomplete
            v-model="form.location"
            :items="locationItems ?? []"
            item-title="title"
            item-value="value"
            label="Where"
            placeholder="City or destination"
            prepend-inner-icon="mdi-map-marker"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            clearable
            auto-select-first
          />
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <!-- native date input mobil native picker -->
          <template v-if="display.xs.value">
            <div class="d-flex flex-column ga-2 compact-date-inputs">
              <v-text-field
                v-model="form.checkIn"
                label="Check-in"
                type="date"
                variant="outlined"
                rounded="lg"
                density="compact"
                hide-details
                :min="minCheckInDate"
                class="flex-grow-1"
                @update:model-value="onCheckInSelect"
              />
              <v-text-field
                v-model="form.checkOut"
                label="Check-out"
                type="date"
                variant="outlined"
                rounded="lg"
                density="compact"
                hide-details
                :min="minCheckOutDate"
                class="flex-grow-1"
              />
            </div>
          </template>

          <v-menu
            v-else
            v-model="dateMenuOpen"
            :close-on-content-click="false"
            location="bottom"
            min-width="auto"
            transition="scale-transition"
          >
            <template #activator="{ props }">
              <v-text-field
                v-bind="props"
                :model-value="dateRangeDisplay"
                label="Check-in – Check-out"
                placeholder="Select dates"
                prepend-inner-icon="mdi-calendar-range"
                variant="outlined"
                rounded="lg"
                density="compact"
                hide-details
                readonly
              />
            </template>
            <v-card min-width="320" class="pa-2 date-picker-card">
              <v-tabs v-model="activeDateTab" density="compact" class="mb-2 date-tabs">
                <v-tab value="checkin" class="text-capitalize">Check-in</v-tab>
                <v-tab value="checkout" class="text-capitalize">Check-out</v-tab>
              </v-tabs>

              <v-window v-model="activeDateTab">
                <v-window-item value="checkin">
                  <v-date-picker
                    :model-value="form.checkIn"
                    :min="minCheckInDate"
                    show-adjacent-months
                    class="w-100"
                    hide-header
                    @update:model-value="(v) => { form.checkIn = toDateString(v); onCheckInSelect(); }"
                  />
                </v-window-item>
                <v-window-item value="checkout">
                  <v-date-picker
                    :model-value="form.checkOut"
                    :min="minCheckOutDate"
                    class="w-100"
                    show-adjacent-months
                    hide-header
                    @update:model-value="(v) => { form.checkOut = toDateString(v); onCheckOutSelect(); }"
                  />
                </v-window-item>
              </v-window>
            </v-card>
          </v-menu>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-select
            v-model="form.guests"
            :items="guestOptions"
            item-title="title"
            item-value="value"
            label="Guests"
            :prepend-inner-icon="effectiveGuests <= 1 ? 'mdi-account' : 'mdi-account-group'"
            rounded="lg"
            variant="outlined"
            density="compact"
            hide-details
          />
          <v-text-field
            v-if="form.guests === 11"
            v-model.number="customGuests"
            type="number"
            label="How many?"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
            class="mt-2"
            min="11"
            max="50"
            :rules="[v => (v >= 11 && v <= 50) || 'Enter 11–50']"
          />
        </v-col>

        <v-col cols="12" sm="12" md="2" class="d-flex align-center">
          <v-btn
            type="submit"
            rounded="lg"
            title="Search"
            color="primary"
            :size="display.xl.value ? 'default' : 'small'"
            :prepend-icon="display.smAndDown.value ? 'mdi-magnify' : undefined"
            :icon="display.smAndDown.value ? undefined : 'mdi-magnify'"
            :ripple="false"
            :loading="isProcessingReservation"
            block
            class="search-btn text-capitalize"
            :text="display.smAndDown.value ? 'Search' : undefined"
          />
        </v-col>
      </v-row>
    </v-container>
  </form>
</template>

<script lang="ts" setup>
import type { BookingSearchParams } from "~/composables/core/interfaces";

export interface LocationItem {
  title: string;
  value: string;
  country: string;
  city: string;
}

const router = useRouter();
const route = useRoute();
const display = useDisplay();

const form = reactive<BookingSearchParams>({
  location: "",
  checkIn: "",
  checkOut: "",
  guests: 1,
});

const guestOptions = [
  { title: "1", value: 1 },
  { title: "2", value: 2 },
  { title: "3", value: 3 },
  { title: "4", value: 4 },
  { title: "5", value: 5 },
  { title: "6", value: 6 },
  { title: "7", value: 7 },
  { title: "8", value: 8 },
  { title: "9", value: 9 },
  { title: "10", value: 10 },
  { title: "10+", value: 11 },
];
const customGuests = ref(11);
const effectiveGuests = computed(() =>
  form.guests === 11 ? (customGuests.value >= 11 && customGuests.value <= 50 ? customGuests.value : 11) : form.guests
);
const isProcessingReservation = ref(false);
const dateMenuOpen = ref(false);
const activeDateTab = ref<"checkin" | "checkout">("checkin");

const safeDate = (d: string | Date | null | undefined): Date | null => {
  if (d == null) return null;
  if (d instanceof Date) return isNaN(d.getTime()) ? null : d;
  const str = String(d).trim();
  if (!str) return null;
  const parsed = new Date(str.includes("T") ? str : str + "T00:00:00");
  return isNaN(parsed.getTime()) ? null : parsed;
};

const toDateString = (d: string | Date | null | undefined): string => {
  const parsed = safeDate(d);
  if (!parsed) return "";
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const dateRangeDisplay = computed(() => {
  if (!form.checkIn && !form.checkOut) return "";
  const fmt = (d: string) => {
    const parsed = safeDate(d);
    return parsed
      ? parsed.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";
  };
  return [fmt(form.checkIn), fmt(form.checkOut)].filter(Boolean).join(" – ");
});

const minCheckInDate = computed(() => {
  const today = new Date();
  return toDateString(today) || "";
});

const minCheckOutDate = computed(() => {
  if (!form.checkIn) return minCheckInDate.value;
  const checkIn = safeDate(form.checkIn);
  if (!checkIn) return minCheckInDate.value;
  const next = new Date(checkIn);
  next.setDate(next.getDate() + 1);
  return toDateString(next) || "";
});

const onCheckInSelect = () => {
  activeDateTab.value = "checkout";
  const checkIn = safeDate(form.checkIn);
  const checkOut = safeDate(form.checkOut);
  if (checkIn && checkOut && checkOut <= checkIn) {
    const next = new Date(checkIn);
    next.setDate(next.getDate() + 1);
    form.checkOut = toDateString(next) || "";
  }
};

const onCheckOutSelect = () => {
  dateMenuOpen.value = false;
};

const { data: locationItems } = await useFetch<LocationItem[]>("/api/locations", {
  default: () => [],
});

watch(
  () => route.query,
  (q) => {
    if (q.location) form.location = String(q.location);
    if (q.checkIn) form.checkIn = String(q.checkIn);
    if (q.checkOut) form.checkOut = String(q.checkOut);
    if (q.guests != null) form.guests = Number(q.guests) || 1;
  },
  { immediate: true }
);

watch(
  locationItems,
  (items) => {
    if (items?.length && !form.location && !route.query.location) {
      const istanbul = items.find(
        (x) => x.value?.toLowerCase().includes("istanbul")
      );
      form.location = istanbul?.value ?? items[0]?.value ?? "";
    }
  },
  { immediate: true }
);

const handleSearch = () => {
  const query: Record<string, string | number> = {
    type: "booking",
  };
  if (form.location) query.location = form.location;
  const checkInStr = toDateString(form.checkIn);
  const checkOutStr = toDateString(form.checkOut);
  if (checkInStr) query.checkIn = checkInStr;
  if (checkOutStr) query.checkOut = checkOutStr;
  query.guests = effectiveGuests.value;
  router.push({ path: "/search", query });
};
</script>

<style scoped>
.search-form-compact :deep(.v-field) {
  font-size: 0.875rem;
}
.search-form-row > .v-col {
  padding-block: 4px;
}
.date-picker-card :deep(.v-date-picker) {
  max-width: 100%;
}
.location-item :deep(.v-list-item-title) {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.location-city {
  font-weight: 700;
  font-size: 0.9375rem;
}
.location-country {
  font-size: 0.8125rem;
  color: var(--color-muted);
  font-weight: 400;
}
</style>
