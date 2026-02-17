<template>
  <div class="search-page">
    <v-container class="pa-5 pa-lg-10 pa-xl-15">
      <div class="titles mb-15">
        <p class="page-title text-subtitle-1 text-lg-h5">
          {{ isBooking ? "Booking" : "Tickets" }}
        </p>
        <p class="page-subtitle text-caption text-lg-subtitle-2 text-xl-subtitle-1">
          {{ isBooking ? "Find your perfect accommodation" : "Book your next journey" }}
        </p>
      </div>

      <HomeSearchTabs class="mt-15" />

      <!-- Filters + Sort + Active filter chips -->
      <div class="filter-row mt-4 mb-4">
        <SearchFilterPanel :query="normalizedQuery" />

        <v-select
          v-model="sortBy"
          :items="sortOptions"
          item-title="title"
          item-value="value"
          label="Sort by"
          variant="outlined"
          density="compact"
          hide-details
          class="sort-select text-caption"
          style="max-width: 200px"
          :menu-props="{ contentClass: 'sort-select-menu' }"
          @update:model-value="onSortChange"
        >
          <template #item="{ item, props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="item.raw.icon"
              class="sort-select-item"
            />
          </template>
          <template #selection="{ item }">
            <span class="sort-selection text-caption">
              <v-icon :icon="item.raw?.icon" size="14" class="sort-selection-icon" />
              {{ item.raw?.title }}
            </span>
          </template>
        </v-select>

        <div class="layout-toggle">
          <v-btn-toggle
            v-model="searchLayout"
            mandatory
            density="compact"
            variant="outlined"
            divided
            class="layout-toggle-btns rounded"
          >
            <v-btn
              value="card"
              size="small"
              icon="mdi-view-grid-outline"
              title="Card view"
            />
            <v-btn
              value="list"
              size="small"
              icon="mdi-view-list-outline"
              title="List view"
            />
          </v-btn-toggle>
        </div>

        <div v-if="activeFilterChips.length > 0" class="filter-chips">
          <v-chip
            v-for="chip in activeFilterChips"
            :key="chip.key"
            size="small"
            closable
            variant="tonal"
            color="primary"
            class="filter-chip"
            @click:close="removeFilter(chip.key)"
            :text="`${chip.label}: ${chip.value}`"
          />

          <v-btn
            variant="text"
            size="small"
            color="primary"
            class="filter-clear-all"
            @click="clearAllFilters"
            text="Clear all"
            prepend-icon="mdi-close-circle-outline"
          />
        </div>
      </div>

      <v-row v-if="initialPending" class="results-grid" dense>
        <v-col v-for="n in 18" :key="n" cols="6" sm="4" md="3" lg="2" xl="2">
          <SearchSkeletonCard />
        </v-col>
      </v-row>
      <p v-else-if="sortedItems.length === 0" class="no-results">
        No results found. Try adjusting your search.
      </p>
      <v-infinite-scroll
        v-else
        :key="isBooking ? 'booking' : 'ticket'"
        side="end"
        class="search-infinite-scroll"
        @load="onLoadMore"
      >
        <template #default>
          <v-list v-if="searchLayout === 'list'" class="results-list" density="compact">
            <template v-if="isBooking">
              <SearchBookingListItem
                v-for="item in sortedItems"
                :key="item.id"
                :booking="item as Booking"
                :search-query="bookingSearchQuery"
              />
            </template>
            <template v-else>
              <SearchTicketListItem
                v-for="item in sortedItems"
                :key="item.id"
                :ticket="item as Ticket"
              />
            </template>
          </v-list>
          <v-row v-else class="results-grid" dense>
            <template v-if="isBooking">
              <v-col
                v-for="item in sortedItems"
                :key="item.id"
                cols="6"
                sm="4"
                md="3"
                lg="2"
              >
                <SearchBookingCard :booking="item as Booking" :search-query="bookingSearchQuery" />
              </v-col>
            </template>

            <template v-else>
              <v-col
                v-for="item in sortedItems"
                :key="item.id"
                cols="12"
                sm="6"
                md="3"
                lg="2"
              >
                <SearchTicketCard :ticket="item as Ticket" />
              </v-col>
            </template>
          </v-row>

          <v-row v-if="loadMorePending" class="results-grid" dense>
            <v-col
              v-for="n in 18"
              :key="`load-${n}`"
              cols="6"
              sm="4"
              md="3"
              lg="2"
            >
              <SearchSkeletonCard />
            </v-col>
          </v-row>
        </template>
        <template #empty>
          <p class="load-complete text-center text-medium-emphasis py-4">
            You've seen all results.
          </p>
        </template>
      </v-infinite-scroll>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import type { Booking, Ticket } from "~/composables/core/interfaces";
import { useProductType } from "~/composables/data/useProductType";
import { useTicketType } from "~/composables/data/useTicketType";
import { useSearchViewStore } from "~/stores/searchView";
import { FILTER_LABELS } from "~/utils/searchFilterLabels";

const searchViewStore = useSearchViewStore();
const searchLayout = computed({
  get: () => searchViewStore.layout,
  set: (v) => searchViewStore.setLayout(v),
});
const route = useRoute();
const { isBooking } = useProductType();

const router = useRouter();
const query = computed(() => route.query);

function toQueryValue(
  v:
    | import("vue-router").LocationQueryValue
    | import("vue-router").LocationQueryValue[]
    | undefined
): string | number | undefined {
  if (v == null) return undefined;
  if (Array.isArray(v)) return v[0] != null ? String(v[0]) : undefined;
  return typeof v === "number" ? v : String(v);
}
const normalizedQuery = computed(() => {
  const raw = route.query;
  const out: Record<string, string | number | undefined> = {};
  for (const k of Object.keys(raw)) {
    const v = toQueryValue(raw[k]);
    if (v !== undefined && v !== "") out[k] = v;
  }
  return out;
});

const PAGE_SIZE = 18;

const bookingSearchQuery = computed(() => {
  const q = normalizedQuery.value;
  const out: Record<string, string | number> = {};
  if (q.checkIn) out.checkIn = String(q.checkIn);
  if (q.checkOut) out.checkOut = String(q.checkOut);
  if (q.guests != null) out.guests = Number(q.guests) || 1;
  return out;
});

const { getTypeLabel } = useTicketType();

const activeFilterChips = computed(() => {
  const q = normalizedQuery.value;
  const chips: { key: string; label: string; value: string }[] = [];
  const skipKeys = ["type", "offset", "limit"];

  const fmtDate = (d: string) => {
    const parsed = new Date(d + "T00:00:00");
    if (isNaN(parsed.getTime())) return d;
    return parsed.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const addChip = (key: string, value: string | number | undefined, label?: string) => {
    if (value == null || value === "") return;
    const displayLabel = label ?? FILTER_LABELS[key] ?? key;
    let displayValue = String(value);
    if (key === "transportType") displayValue = getTypeLabel(displayValue);
    if (["date", "checkIn", "checkOut", "returnDate"].includes(key))
      displayValue = fmtDate(displayValue);
    if (["minPrice", "maxPrice"].includes(key)) displayValue = `$${value}`;
    chips.push({ key, label: displayLabel, value: displayValue });
  };

  if (isBooking.value) {
    addChip("location", q.location);
    addChip("checkIn", q.checkIn);
    addChip("checkOut", q.checkOut);
    addChip("guests", q.guests);
    addChip("minPrice", q.minPrice, "Min price");
    addChip("maxPrice", q.maxPrice, "Max price");
    addChip("rating", q.rating);
    if (
      q.accommodationType ||
      (q.type && !["booking", "ticket"].includes(String(q.type)))
    ) {
      addChip("type", q.accommodationType ?? q.type);
    }
  } else {
    addChip("from", q.from);
    addChip("to", q.to);
    addChip("date", q.date);
    addChip("returnDate", q.returnDate);
    addChip("passengers", q.passengers);
    addChip("transportType", q.transportType);
    addChip("minPrice", q.minPrice, "Min price");
    addChip("maxPrice", q.maxPrice, "Max price");
    addChip("company", q.company);
    addChip("minTime", q.minTime, "From time");
    addChip("maxTime", q.maxTime, "To time");
  }

  return chips;
});

const removeFilter = (key: string) => {
  const q = { ...query.value };
  delete q[key];
  router.push({ path: "/search", query: q });
};

const sortOptions = computed(() =>
  isBooking.value
    ? [
        { title: "Price: Low to High", value: "price-asc", icon: "mdi-arrow-up" },
        { title: "Price: High to Low", value: "price-desc", icon: "mdi-arrow-down" },
        { title: "Rating: Low to High", value: "rating-asc", icon: "mdi-star-outline" },
        { title: "Rating: High to Low", value: "rating-desc", icon: "mdi-star" },
      ]
    : [
        { title: "Price: Low to High", value: "price-asc", icon: "mdi-arrow-up" },
        { title: "Price: High to Low", value: "price-desc", icon: "mdi-arrow-down" },
        { title: "Time: Earliest first", value: "time-asc", icon: "mdi-clock-outline" },
        { title: "Time: Latest first", value: "time-desc", icon: "mdi-clock-outline" },
      ]
);

const sortBy = ref("price-asc");
watch(
  () => [route.query.sortBy, isBooking.value] as const,
  ([qSort, booking]) => {
    const valid = (booking
      ? ["price-asc", "price-desc", "rating-asc", "rating-desc"]
      : ["price-asc", "price-desc", "time-asc", "time-desc"]) as string[];
    sortBy.value = valid.includes(String(qSort ?? "")) ? String(qSort) : "price-asc";
  },
  { immediate: true }
);

const sortedItems = computed(() => {
  const items = [...displayedItems.value];
  const s = sortBy.value;
  if (isBooking.value) {
    const list = items as Booking[];
    if (s === "price-asc") return list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (s === "price-desc") return list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (s === "rating-asc") return list.sort((a, b) => a.rating - b.rating);
    if (s === "rating-desc") return list.sort((a, b) => b.rating - a.rating);
  } else {
    const list = items as Ticket[];
    if (s === "price-asc") return list.sort((a, b) => a.price - b.price);
    if (s === "price-desc") return list.sort((a, b) => b.price - a.price);
    if (s === "time-asc")
      return list.sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
    if (s === "time-desc")
      return list.sort((a, b) => (b.time ?? "").localeCompare(a.time ?? ""));
  }
  return items;
});

const onSortChange = (val: string) => {
  const q = { ...query.value };
  q.sortBy = val;
  router.push({ path: "/search", query: q });
};

const bookingFilterKeys = [
  "location",
  "checkIn",
  "checkOut",
  "guests",
  "minPrice",
  "maxPrice",
  "rating",
  "accommodationType",
  "type",
];
const ticketFilterKeys = [
  "from",
  "to",
  "date",
  "returnDate",
  "passengers",
  "transportType",
  "minPrice",
  "maxPrice",
  "company",
  "minTime",
  "maxTime",
];
const clearAllFilters = () => {
  const q = { ...query.value };
  const keysToRemove = isBooking.value ? bookingFilterKeys : ticketFilterKeys;
  const productType = q.type;
  keysToRemove.forEach((k) => delete q[k]);
  if (productType === "booking" || productType === "ticket") {
    q.type = productType;
  }
  router.push({ path: "/search", query: q });
};

const displayedItems = ref<(Booking | Ticket)[]>([]);
const offset = ref(0);
const initialPending = ref(true);
const loadMorePending = ref(false);

const apiQuery = computed(() => {
  const q = normalizedQuery.value;
  if (isBooking.value) {
    const accType =
      q.accommodationType ??
      (q.type && !["booking", "ticket"].includes(String(q.type)) ? q.type : undefined);
    return {
      location: q.location,
      minPrice: q.minPrice,
      maxPrice: q.maxPrice,
      rating: q.rating,
      ...(accType && { type: accType }),
    };
  }
  return {
    from: q.from,
    to: q.to,
    date: q.date,
    returnDate: q.returnDate,
    passengers: q.passengers,
    transportType: q.transportType,
    minPrice: q.minPrice,
    maxPrice: q.maxPrice,
    company: q.company,
    minTime: q.minTime,
    maxTime: q.maxTime,
  };
});

const cleanQuery = (q: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(q).filter(([, v]) => v != null && v !== "")
  ) as Record<string, string | number>;
};

const fetchBookings = async (off: number, lim: number) => {
  const data = await $fetch<Booking[]>("/api/bookings", {
    query: {
      ...cleanQuery(apiQuery.value as Record<string, unknown>),
      offset: off,
      limit: lim,
    },
  });
  return data;
};

const fetchTickets = async (off: number, lim: number) => {
  const data = await $fetch<Ticket[]>("/api/tickets", {
    query: {
      ...cleanQuery(apiQuery.value as Record<string, unknown>),
      offset: off,
      limit: lim,
    },
  });
  return data;
};

const loadInitial = async () => {
  initialPending.value = true;
  displayedItems.value = [];
  offset.value = 0;
  const items = isBooking.value
    ? await fetchBookings(0, PAGE_SIZE)
    : await fetchTickets(0, PAGE_SIZE);
  displayedItems.value = items;
  offset.value = items.length;
  initialPending.value = false;
};

const onLoadMore = async ({
  done,
}: {
  done: (status: "ok" | "empty" | "error") => void;
}) => {
  if (loadMorePending.value) return;
  loadMorePending.value = true;
  try {
    const items = isBooking.value
      ? await fetchBookings(offset.value, PAGE_SIZE)
      : await fetchTickets(offset.value, PAGE_SIZE);
    if (items.length === 0) {
      done("empty");
    } else {
      displayedItems.value = [...displayedItems.value, ...items];
      offset.value += items.length;
      done(items.length < PAGE_SIZE ? "empty" : "ok");
    }
  } catch {
    done("error");
  } finally {
    loadMorePending.value = false;
  }
};

watch(
  [query, isBooking],
  () => {
    loadInitial();
  },
  { deep: true }
);

onMounted(() => {
  loadInitial();
});

const { setProductType } = useProductType();
watch(
  () => route.query.type as string | undefined,
  (type) => {
    setProductType(type === "ticket" ? "ticket" : "booking");
  },
  { immediate: true }
);
</script>

<style scoped>
@import url("~/assets/css/main.css");
@import url("~/assets/css/search_page.css");
</style>
