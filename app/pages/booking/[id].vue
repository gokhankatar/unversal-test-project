<template>
  <div v-if="pending" class="detail-loading">
    <v-progress-circular indeterminate color="primary" size="48" />
  </div>
  <v-container v-else-if="booking" class="booking-detail pa-5 pa-lg-10">
    <div class="detail-header">
      <v-btn
        variant="text"
        class="back-btn text-capitalize"
        @click="navigateBack"
        prepend-icon="mdi-arrow-left"
        text="Back"
      />
    </div>
    <v-row :dense="display.smAndDown.value">
      <v-col cols="12" md="8">
        <!-- Image Gallery -->
        <section class="detail-section gallery-section">
          <div class="gallery">
            <div class="gallery-main-wrap">
              <img :src="currentImage" :alt="booking.title" class="gallery-main" />
              <v-btn
                v-if="galleryImages.length > 1"
                class="gallery-nav gallery-nav-prev"
                aria-label="Previous"
                @click="prevImage"
                icon="mdi-chevron-left"
              />

              <v-btn
                v-if="galleryImages.length > 1"
                class="gallery-nav gallery-nav-next"
                aria-label="Next"
                @click="nextImage"
                icon="mdi-chevron-right"
              />

              <div v-if="galleryImages.length > 1" class="gallery-dots">
                <button
                  v-for="(_, i) in galleryImages"
                  :key="i"
                  class="gallery-dot"
                  :class="{ active: currentImageIndex === i }"
                  :aria-label="`Photo ${i + 1}`"
                  @click="currentImageIndex = i"
                />
              </div>
            </div>

            <div v-if="galleryImages.length > 1" class="gallery-thumbs">
              <button
                v-for="(img, i) in galleryImages"
                :key="i"
                class="gallery-thumb"
                :class="{ active: currentImageIndex === i }"
                @click="currentImageIndex = i"
              >
                <img :src="img" :alt="`${booking.title} ${i + 1}`" />
              </button>
            </div>
          </div>
        </section>

        <p class="detail-title text-subtitle-1 text-lg-h5">{{ booking.title }}</p>
        <p class="detail-location">
          <v-icon size="20">mdi-map-marker</v-icon>
          {{ booking.location }}
        </p>
        <div class="detail-rating">
          <v-icon color="primary">mdi-star</v-icon>
          <span>{{ booking.rating }}</span>
        </div>

        <!-- Description -->
        <section v-if="booking.description" class="detail-section">
          <h2 class="section-heading">Description</h2>
          <p class="detail-desc">{{ booking.description }}</p>
        </section>

        <!-- Features -->
        <section v-if="booking.amenities?.length" class="detail-section">
          <h2 class="section-heading">Features</h2>
          <div class="detail-amenities">
            <div v-for="a in booking.amenities" :key="a" class="amenity-item">
              <v-icon size="20" color="primary">{{ amenityIcon(a) }}</v-icon>
              <span>{{ a }}</span>
            </div>
          </div>
        </section>
      </v-col>

      <v-col cols="12" md="4">
        <!-- Reservation panel -->
        <v-card class="booking-panel" elevation="2">
          <v-card-title class="panel-title">Reservation</v-card-title>
          <v-card-text>
            <p class="price-display">
              <span class="price-amount">${{ booking.pricePerNight }}</span>
              <span class="price-unit">/ night</span>
            </p>
            <v-text-field
              v-model="checkIn"
              label="Check-in"
              type="date"
              variant="outlined"
              :density="display.xl.value ? 'comfortable' : 'compact'"
              class="mt-2"
              hide-details
            />
            <v-text-field
              v-model="checkOut"
              label="Check-out"
              type="date"
              variant="outlined"
              :density="display.xl.value ? 'comfortable' : 'compact'"
              class="mt-2"
              hide-details
            />
            <v-select
              v-model="guests"
              :items="[1, 2, 3, 4, 5, 6, 7, 8]"
              label="Guests"
              variant="outlined"
              :density="display.xl.value ? 'comfortable' : 'compact'"
              class="mt-2"
              hide-details
            />
            <div class="total-price-wrap">
              <span class="total-label">Total</span>
              <span class="total-amount">${{ totalPrice }}</span>
            </div>
            <v-btn
              color="primary"
              text="Reserve"
              prepend-icon="mdi-check-circle"
              block
              :size="display.xl.value ? 'large' : 'default'"
              class="mt-3 reserve-btn"
              :ripple="false"
              :loading="isReserving"
              :disabled="!checkIn || !checkOut || totalPrice <= 0"
              @click="handleReserve"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Loading dialog -->
    <v-dialog
      v-model="loadingDialog"
      persistent
      max-width="320"
      content-class="reservation-dialog"
    >
      <v-card class="pa-3 pa-lg-5 text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          :width="display.xl.value ? 4 : 2"
          :size="display.xl.value ? 52 : 36"
          class="mb-4 mx-auto"
        />
        <p class="text-subtitle-2 text-sm-subtitle-1 text-lg-h6 font-weight-bold">
          Processing reservation...
        </p>
        <p class="text-caption text-lg-subtitle-2 text-medium-emphasis mt-1">
          Please wait a moment
        </p>
      </v-card>
    </v-dialog>

    <!-- Success dialog -->
    <v-dialog
      v-model="successDialog"
      persistent
      max-width="420"
      content-class="reservation-dialog"
      transition="dialog-transition"
    >
      <v-card class="pa-3 pa-lg-5">
        <div class="success-header">
          <v-icon
            color="success"
            :size="display.lgAndUp.value ? 56 : 32"
            icon="mdi-check-circle"
          />
          <p class="text-subtitle-2 text-sm-subtitle-1 text-lg-h6 font-weight-bold mt-2">
            Reservation confirmed!
          </p>
          <p class="text-caption text-lg-subtitle-2 text-medium-emphasis">
            Your booking has been successfully completed.
          </p>
        </div>

        <v-divider class="my-4" />

        <div v-if="booking" class="reservation-summary">
          <p class="summary-title">{{ booking.title }}</p>
          <p class="summary-row">
            <v-icon size="18">mdi-map-marker</v-icon> {{ booking.location }}
          </p>
          <p class="summary-row">
            <v-icon size="18">mdi-calendar</v-icon> {{ checkIn }} – {{ checkOut }}
          </p>
          <p class="summary-row">
            <v-icon size="18">mdi-account-group</v-icon> {{ guests }} guest(s)
          </p>
          <p class="summary-total">
            Total: <strong>${{ totalPrice }}</strong>
          </p>
        </div>
        <v-card-actions class="pa-0 mt-4">
          <v-spacer />
          <v-btn
            color="primary"
            variant="tonal"
            class="text-capitalize"
            prepend-icon="mdi-close"
            @click="closeSuccessDialog"
            text="Close"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";
import type { Booking } from "~/composables/core/interfaces";
import { FALLBACK_POOL } from "~/utils/BookingCardImg";

const display = useDisplay();
const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id as string);

const { data: booking, pending } = await useFetch<Booking>(
  () => `/api/bookings/${id.value}`,
  { key: () => `booking-${id.value}` }
);

const currentImageIndex = ref(0);
const checkIn = ref("");
const checkOut = ref("");
const guests = ref(1);

watch(
  () => route.query,
  (q) => {
    if (q.checkIn) checkIn.value = String(q.checkIn);
    if (q.checkOut) checkOut.value = String(q.checkOut);
    if (q.guests != null) guests.value = Number(q.guests) || 1;
  },
  { immediate: true }
);

const galleryImages = computed(() => {
  if (!booking.value) return [];
  const imgs = booking.value.images ?? [booking.value.image].filter(Boolean);
  if (imgs.length >= 2) return imgs;
  const base = imgs[0] ?? booking.value.image;
  const baseId = (s: string) => s?.split("?")[0] ?? "";
  const seen = new Set([baseId(base)]);
  const result = [base];
  for (const url of FALLBACK_POOL) {
    if (result.length >= 4) break;
    if (!seen.has(baseId(url))) {
      result.push(url);
      seen.add(baseId(url));
    }
  }
  return result;
});

const currentImage = computed(() => {
  if (!booking.value || !galleryImages.value.length) return "";
  return galleryImages.value[currentImageIndex.value] ?? galleryImages.value[0];
});

const prevImage = () => {
  currentImageIndex.value =
    currentImageIndex.value === 0
      ? galleryImages.value.length - 1
      : currentImageIndex.value - 1;
};
const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % galleryImages.value.length;
};

const amenityIcon = (name: string): string => {
  const map: Record<string, string> = {
    WiFi: "mdi-wifi",
    Pool: "mdi-pool",
    Parking: "mdi-parking",
    Kitchen: "mdi-chef-hat",
    AC: "mdi-air-conditioner",
    Washer: "mdi-washing-machine",
    Spa: "mdi-spa",
    Restaurant: "mdi-food",
    Fireplace: "mdi-fireplace",
  };
  return map[name] ?? "mdi-check-circle";
};

const totalPrice = computed(() => {
  if (!booking.value || !checkIn.value || !checkOut.value) return 0;
  const parseLocal = (s: string) => new Date(s.includes("T") ? s : s + "T00:00:00");
  const start = parseLocal(checkIn.value);
  const end = parseLocal(checkOut.value);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, nights) * booking.value.pricePerNight * guests.value;
});

const loadingDialog = ref(false);
const successDialog = ref(false);
const isReserving = ref(false);

const handleReserve = async () => {
  if (!booking.value || !checkIn.value || !checkOut.value || totalPrice.value <= 0)
    return;
  isReserving.value = true;
  loadingDialog.value = true;
  await new Promise((r) => setTimeout(r, 2200));
  loadingDialog.value = false;
  successDialog.value = true;
  isReserving.value = false;
};

const closeSuccessDialog = () => {
  successDialog.value = false;
  checkIn.value = "";
  checkOut.value = "";
  guests.value = 1;
};

const navigateBack = () => router.back();
</script>

<style scoped>
@import url("~/assets/css/main.css");
@import url("~/assets/css/booking_detail.css");
</style>
