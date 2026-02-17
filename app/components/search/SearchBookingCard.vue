<template>
  <NuxtLink :to="bookingDetailRoute" class="booking-card-link">
    <v-card class="booking-card" elevation="0" variant="plain">
      <div class="card-image-wrap">
        <img
          :src="allImages[activeImageIndex]"
          :alt="booking.title"
          class="card-image rounded-lg"
          loading="lazy"
        />
        <v-btn
          variant="text"
          size="x-small"
          class="favorite-btn ma-1 ma-xl-2"
          @click.prevent="isFavorite = !isFavorite"
          :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
        />
        <span
          class="rating-badge"
          :class="{ 'rating-badge--bottom': isSmAndDown }"
        >
          <v-icon size="14" icon="mdi-star" />
          {{ booking.rating }}
        </span>
        <div v-if="!isSmAndDown" class="image-previews" @click.prevent>
          <button
            v-for="(img, i) in visiblePreviews"
            :key="i"
            type="button"
            class="preview-thumb"
            :class="{ active: activeImageIndex === (previewIndices[i] ?? 0) }"
            @mouseenter="activeImageIndex = previewIndices[i] ?? 0"
          >
            <img :src="img" :alt="`Photo ${i + 1}`" />
          </button>
          <span v-if="remainingCount > 0" class="preview-more"
            >+{{ remainingCount }}</span
          >
        </div>
      </div>
      <v-card-text class="pa-2">
        <p
          class="card-title"
          :class="isXs ? 'small-text' : 'text-caption text-sm-subtitle-2'"
        >
          {{ booking.title }}
        </p>
        <p
          class="card-location"
          :class="isXs ? 'extra-small-text' : 'text-caption'"
        >
          <v-icon :size="isXs ? 12 : 16" icon="mdi-map-marker" />
          {{ booking.location }}
        </p>
        <p class="card-price">
          <span class="price-amount">${{ booking.pricePerNight }}</span>
          <span
            class="price-unit"
            :class="isXs ? 'extra-small-text' : 'text-caption'"
            >&nbsp;/ night</span
          >
        </p>
      </v-card-text>
    </v-card>
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { Booking } from "~/composables/core/interfaces";
import { FALLBACK_POOL } from "~/utils/BookingCardImg";

const props = defineProps<{
  booking: Booking;
  searchQuery?: Record<string, string | number>;
}>();

const display = useDisplay();

const bookingDetailRoute = computed(() => {
  const path = `/booking/${props.booking.id}`;
  const query = props.searchQuery && Object.keys(props.searchQuery).length > 0
    ? props.searchQuery
    : undefined;
  return query ? { path, query } : path;
});
const isSmAndDown = computed(() => display?.smAndDown?.value ?? false);
const isXs = computed(() => display?.xs?.value ?? false);
const isFavorite = ref(props.booking.isFavorite ?? false);
const activeImageIndex = ref(0);

const allImages = computed(() => {
  const main = props.booking.image;
  const raw = props.booking.images ?? [main].filter(Boolean);
  const baseId = (s: string) => s?.split("?")[0] ?? "";
  const result: string[] = [];
  const seen = new Set<string>();
  for (const url of raw) {
    if (result.length >= 4) break;
    const id = baseId(url);
    if (!seen.has(id)) {
      result.push(url);
      seen.add(id);
    }
  }
  for (const url of FALLBACK_POOL) {
    if (result.length >= 4) break;
    const id = baseId(url);
    if (!seen.has(id)) {
      result.push(url);
      seen.add(id);
    }
  }
  return result.slice(0, 4);
});

const maxVisible = 3;
const visiblePreviews = computed(() => allImages.value.slice(0, maxVisible));
const previewIndices = computed(() => visiblePreviews.value.map((_, i) => i));
const remainingCount = computed(() => Math.max(0, allImages.value.length - maxVisible));
</script>

<style scoped>
@import url("~/assets/css/main.css");

.booking-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  min-width: 0;
}

.booking-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: transparent !important;
  border: none !important;
  transition: var(--transition-smooth);
  min-width: 0;
}

.card-image-wrap {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
  transition: none;
}

.favorite-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--color-overlay) !important;
}

.rating-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
}

.rating-badge--bottom {
  top: auto;
  bottom: 8px;
}

.image-previews {
  position: absolute;
  bottom: 8px;
  right: 8px;
  left: 8px;
  display: flex;
  gap: 6px;
  align-items: stretch;
  z-index: 1;
}

.preview-thumb {
  flex: 1;
  min-width: 0;
  height: 36px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
  transition: border-color 0.2s;
}

.preview-thumb:hover,
.preview-thumb.active {
  border-color: white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
}

.preview-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
  transition: none;
}

.preview-more {
  flex: 1;
  min-width: 0;
  height: 36px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 2px;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-width: 0;
}

.card-location {
  font-size: 0.75rem;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
  min-width: 0;
  overflow: hidden;
}
.card-price .price-amount {
  font-weight: 700;
  font-size: 0.9375rem;
}
.card-price .price-unit {
  color: var(--color-muted);
  font-size: 0.75rem;
}
</style>
