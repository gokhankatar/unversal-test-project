<template>
  <section class="popular-cities">
    <v-container>
      <h2 class="section-title">Popular Destinations</h2>
      <p class="section-subtitle">Explore top cities for your next trip</p>
      <v-row>
        <v-col v-for="city in popularCities" :key="city.id" cols="6" sm="4" md="3" lg="2">
          <NuxtLink
            :to="{
              path: '/search',
              query: { type: 'booking', location: `${city.name}, ${city.country}` },
            }"
            class="city-card-link"
          >
            <div class="city-card">
              <div v-if="!loadedImages[city.id]" class="city-skeleton">
                <v-skeleton-loader
                  type="image"
                  class="city-skeleton-image"
                  elevation="0"
                />
                <div class="city-skeleton-content">
                  <div class="skeleton-line skeleton-title" />
                  <div class="skeleton-line skeleton-subtitle" />
                  <div class="skeleton-chip" />
                </div>
              </div>
              <img
                :src="city.image"
                :alt="city.name"
                class="city-image"
                :class="{ loaded: loadedImages[city.id] }"
                loading="lazy"
                @load="markImageLoaded(city.id)"
                @error="markImageLoaded(city.id)"
              />
              <div v-show="loadedImages[city.id]" class="city-overlay" />
              <div v-show="loadedImages[city.id]" class="city-content">
                <p class="city-name text-caption text-lg-subtitle-2 text-xl-subtitle-1">
                  {{ city.name }}
                </p>
                <p
                  class="city-country"
                  :class="
                    display.xs.value
                      ? 'extra-small-text'
                      : 'text-caption text-xl-subtitle-2'
                  "
                >
                  {{ city.country }}
                </p>
                <div
                  class="city-stats d-flex flex-column flex-sm-row align-start align-sm-center"
                >
                  <v-icon :size="display.xs.value ? 12 : 14" icon="mdi-bed" />
                  <span :class="display.xs.value ? 'extra-small-text' : 'text-caption'"
                    >{{ city.accommodations.toLocaleString() }} stays</span
                  >
                </div>
              </div>
            </div>
          </NuxtLink>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script lang="ts" setup>
import { popularCities } from "~/utils/PopularCities";

const display = useDisplay();

const loadedImages = ref<Record<string, boolean>>(
  Object.fromEntries(popularCities.map((c) => [c.id, false]))
);

const markImageLoaded = (id: string) => {
  loadedImages.value = { ...loadedImages.value, [id]: true };
};

popularCities.forEach((city) => {
  setTimeout(() => {
    if (!loadedImages.value[city.id]) {
      markImageLoaded(city.id);
    }
  }, 2500);
});
</script>

<style scoped>
@import url("~/assets/css/main.css");
</style>
