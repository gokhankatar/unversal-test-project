<template>
  <form class="ticket-form" @submit.prevent="handleSearch">
    <v-container fluid class="pa-4">
      <v-row align="center" dense>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete
            v-model="form.from"
            :items="locationItems ?? []"
            item-title="title"
            item-value="value"
            label="From"
            placeholder="Departure"
            prepend-inner-icon="mdi-airplane-takeoff"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            clearable
          />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-autocomplete
            v-model="form.to"
            :items="locationItems ?? []"
            item-title="title"
            item-value="value"
            label="To"
            placeholder="Arrival"
            prepend-inner-icon="mdi-airplane-landing"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            clearable
          />
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <template v-if="display.xs.value">
            <v-text-field
              v-model="form.date"
              label="Date"
              type="date"
              variant="outlined"
              rounded="lg"
              density="compact"
              hide-details
              :min="minDate"
            />
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
                :model-value="dateDisplay"
                label="Date"
                placeholder="Select date"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                rounded="lg"
                density="compact"
                hide-details
                readonly
              />
            </template>
            <v-card min-width="320" class="pa-2 date-picker-card">
              <v-date-picker
                :model-value="form.date"
                :min="minDate"
                show-adjacent-months
                class="w-100"
                hide-header
                @update:model-value="onDateSelect"
              />
            </v-card>
          </v-menu>
        </v-col>

        <v-col cols="12" sm="6" md="1">
          <v-select
            v-model="form.passengers"
            :items="passengerOptions"
            item-title="title"
            item-value="value"
            label="Passengers"
            :prepend-inner-icon="
              (effectivePassengers ?? 1) <= 1 ? 'mdi-account' : 'mdi-account-group'
            "
            rounded="lg"
            variant="outlined"
            density="compact"
            hide-details
          />
          <v-text-field
            v-if="form.passengers === 11"
            v-model.number="customPassengers"
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

        <v-col cols="12" sm="6" md="2">
          <v-select
            v-model="form.type"
            :items="transportTypeOptions"
            item-title="title"
            item-value="value"
            label="Transport"
            :prepend-inner-icon="transportTypeIcon"
            rounded="lg"
            variant="outlined"
            density="compact"
            hide-details
          >
            <template #item="{ item, props }">
              <v-list-item v-bind="props" :prepend-icon="item.raw.icon" />
            </template>
          </v-select>
        </v-col>

        <v-col cols="12" sm="6" md="1" class="d-flex align-center">
          <v-btn
            type="submit"
            rounded="lg"
            title="Search"
            color="primary"
            :size="display.xl.value ? 'default' : 'small'"
            :prepend-icon="display.smAndDown.value ? 'mdi-magnify' : undefined"
            :icon="display.smAndDown.value ? undefined : 'mdi-magnify'"
            :ripple="false"
            block
            class="search-btn text-capitalize"
            :text="display.smAndDown.value ? 'Search' : undefined"
          />
        </v-col>
      </v-row>

      <!-- Round trip row -->
      <v-row align="center" dense class="search-form-row mt-2 ga-2">
        <v-col cols="12" sm="6" md="4" class="d-flex align-center flex-wrap gap-2 py-0">
          <v-checkbox
            v-model="form.roundTrip"
            label="Round trip"
            hide-details
            density="compact"
            color="primary"
            class="round-trip-checkbox"
          />
          <template v-if="form.roundTrip">
            <template v-if="display.xs.value">
              <v-text-field
                v-model="form.returnDate"
                label="Return"
                type="date"
                variant="outlined"
                rounded="lg"
                density="compact"
                hide-details
                :min="minReturnDate"
                class="flex-grow-1"
              />
            </template>
            <v-menu
              v-else
              v-model="returnDateMenuOpen"
              :close-on-content-click="false"
              location="bottom"
              min-width="auto"
              transition="scale-transition"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  :model-value="returnDateDisplay"
                  label="Return date"
                  placeholder="Select"
                  prepend-inner-icon="mdi-calendar"
                  variant="outlined"
                  rounded="lg"
                  density="compact"
                  hide-details
                  readonly
                  class="flex-grow-1"
                  style="max-width: 200px"
                />
              </template>
              <v-card min-width="320" class="pa-2 date-picker-card">
                <v-date-picker
                  :model-value="form.returnDate"
                  :min="minReturnDate"
                  show-adjacent-months
                  class="w-100"
                  hide-header
                  @update:model-value="onReturnDateSelect"
                />
              </v-card>
            </v-menu>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </form>
</template>

<script lang="ts" setup>
import type { TicketSearchParams } from "~/composables/core/interfaces";

interface LocationItem {
  title: string;
  value: string;
  country: string;
  city: string;
}

const router = useRouter();
const display = useDisplay();

const form = reactive<TicketSearchParams & { roundTrip?: boolean }>({
  from: "",
  to: "",
  date: "",
  returnDate: "",
  passengers: 1,
  type: "",
  roundTrip: false,
});

const dateMenuOpen = ref(false);
const returnDateMenuOpen = ref(false);

const passengerOptions = [
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
const customPassengers = ref(11);
const effectivePassengers = computed(() =>
  form.passengers === 11
    ? (customPassengers.value >= 11 && customPassengers.value <= 50
        ? customPassengers.value
        : 11)
    : form.passengers
);

const transportTypeOptions = [
  { title: "All", value: "", icon: "mdi-transit-connection-variant" },
  { title: "Flight", value: "flight", icon: "mdi-airplane" },
  { title: "Bus", value: "bus", icon: "mdi-bus" },
  { title: "Train", value: "train", icon: "mdi-train-variant" },
  { title: "Event", value: "event", icon: "mdi-calendar-star" },
];

const transportTypeIcon = computed(() => {
  const opt = transportTypeOptions.find((o) => o.value === form.type);
  return opt?.icon ?? "mdi-transit-connection-variant";
});

const onDateSelect = (v: string | Date | null | undefined) => {
  form.date = toDateString(v);
  dateMenuOpen.value = false;
};

const onReturnDateSelect = (v: string | Date | null | undefined) => {
  form.returnDate = toDateString(v);
  returnDateMenuOpen.value = false;
};

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

const minDate = computed(() => {
  const today = new Date();
  return toDateString(today) || "";
});

const minReturnDate = computed(() => {
  if (!form.date) return minDate.value;
  const dep = safeDate(form.date);
  if (!dep) return minDate.value;
  return toDateString(dep) || "";
});

const dateDisplay = computed(() => {
  if (!form.date) return "";
  const parsed = safeDate(form.date);
  return parsed
    ? parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
});

const returnDateDisplay = computed(() => {
  if (!form.returnDate) return "";
  const parsed = safeDate(form.returnDate);
  return parsed
    ? parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
});

const { data: locationItems } = await useFetch<LocationItem[]>("/api/locations", {
  default: () => [],
});

watch(
  locationItems,
  (items) => {
    if (items?.length) {
      if (!form.from) {
        const istanbul = items.find((x) => x.value?.toLowerCase().includes("istanbul"));
        form.from = istanbul?.value ?? items[0]?.value ?? "";
      }
      if (!form.to) {
        const antalya = items.find((x) => x.value?.toLowerCase().includes("antalya"));
        form.to = antalya?.value ?? items[1]?.value ?? "";
      }
    }
  },
  { immediate: true }
);

watch(
  () => form.roundTrip,
  (v) => {
    if (!v) form.returnDate = "";
  }
);

const route = useRoute();
watch(
  () => route.query,
  (q) => {
    if (q.type !== "ticket") return;
    if (q.from) form.from = String(q.from);
    if (q.to) form.to = String(q.to);
    if (q.date) form.date = String(q.date);
    if (q.returnDate) form.returnDate = String(q.returnDate);
    if (q.passengers) form.passengers = Number(q.passengers) || 1;
    if (q.transportType)
      form.type = String(q.transportType) as TicketSearchParams["type"];
  },
  { immediate: true }
);

const toSearchTerm = (val: string) => {
  const s = val ?? "";
  return s.includes(",") ? (s.split(",")[0]?.trim() ?? s) : s;
};

const handleSearch = () => {
  const query: Record<string, string | number> = {
    type: "ticket",
  };
  if (form.from) query.from = toSearchTerm(form.from);
  if (form.to) query.to = toSearchTerm(form.to);
  const dateStr = toDateString(form.date);
  if (dateStr) query.date = dateStr;
  if (form.roundTrip && form.returnDate) {
    query.returnDate = toDateString(form.returnDate) || "";
  }
  if (form.passengers) query.passengers = effectivePassengers.value ?? 1;
  if (form.type) query.transportType = form.type;
  router.push({ path: "/search", query });
};
</script>

<style scoped>
.search-form-compact :deep(.v-field) {
  font-size: 0.875rem;
}
.search-form-row {
  gap: 8px;
}
.search-form-row > .v-col {
  padding-block: 4px;
}
.round-trip-checkbox :deep(.v-label) {
  font-size: 0.8125rem;
}
.date-picker-card :deep(.v-date-picker) {
  max-width: 100%;
}
.gap-2 {
  gap: 8px;
}
</style>
