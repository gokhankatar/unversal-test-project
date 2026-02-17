<template>
  <NuxtLink :to="bookingDetailRoute" class="list-item-link">
    <v-list-item
      class="list-item"
      :class="{ 'list-item--mobile': isMobile }"
      :active="false"
      lines="two"
    >
      <template #prepend>
        <div class="list-item-image">
          <img :src="allImages[0]" :alt="booking.title" loading="lazy" />
          <span class="rating-badge">
            <v-icon size="12" icon="mdi-star" />
            {{ booking.rating }}
          </span>
        </div>
      </template>
      <div class="list-item-content pl-2 pl-md-0">
        <div class="list-item-text">
          <v-list-item-title
            class="list-item-title"
            :class="{ 'small-text': isMobile }"
          >
            {{ booking.title }}
          </v-list-item-title>
          <v-list-item-subtitle
            class="list-item-subtitle"
            :class="{ 'extra-small-text': isMobile }"
          >
            <v-icon size="14" icon="mdi-map-marker" />
            {{ booking.location }}
          </v-list-item-subtitle>
        </div>
        <p
          class="list-item-price"
          :class="{ 'list-item-price--mobile': isMobile }"
        >
          <span class="price-amount" :class="{ 'small-text': isMobile }">
            ${{ booking.pricePerNight }}
          </span>
          <span
            class="price-unit"
            :class="{ 'extra-small-text': isMobile }"
          >
            / night
          </span>
        </p>
      </div>
    </v-list-item>
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { Booking } from "~/composables/core/interfaces";
import { FALLBACK_POOL } from "~/utils/BookingCardImg";
import { useDisplay } from "vuetify";

const display = useDisplay();
const props = defineProps<{
  booking: Booking;
  searchQuery?: Record<string, string | number>;
}>();

const isMobile = computed(() => display?.smAndDown?.value ?? false);

const bookingDetailRoute = computed(() => {
  const path = `/booking/${props.booking.id}`;
  const query = props.searchQuery && Object.keys(props.searchQuery).length > 0
    ? props.searchQuery
    : undefined;
  return query ? { path, query } : path;
});

const allImages = computed(() => {
  const main = props.booking.image;
  const raw = props.booking.images ?? [main].filter(Boolean);
  return raw.length ? [raw[0]] : [FALLBACK_POOL[0]];
});
</script>

<style scoped>
.list-item-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.list-item {
  border-bottom: 1px solid var(--color-border);
}
.list-item:hover {
  background: var(--color-surface);
}
.list-item.list-item--mobile {
  flex-direction: column;
  align-items: flex-start;
}
.list-item.list-item--mobile .list-item-image {
  margin-right: 0;
  margin-bottom: 8px;
  width: 80px;
  min-width: 80px;
  height: 60px;
}
.list-item.list-item--mobile .list-item-content {
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
}
.list-item.list-item--mobile .list-item-price.list-item-price--mobile {
  margin-left: 0;
  margin-top: 6px;
}
.list-item-content {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
}
.list-item-text {
  min-width: 0;
  flex: 1;
  overflow: hidden;
}
.list-item-price {
  flex-shrink: 0;
  margin-left: auto;
}
.list-item-image {
  position: relative;
  width: 120px;
  min-width: 120px;
  flex-shrink: 0;
  height: 90px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-right: 16px;
}
.list-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
  transition: none;
}
.rating-badge {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
}
.list-item-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list-item-subtitle {
  font-size: 0.8125rem;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list-item-price .price-amount {
  font-weight: 700;
  font-size: 1rem;
}
.list-item-price .price-unit {
  color: var(--color-muted);
  font-size: 0.8125rem;
}
</style>
