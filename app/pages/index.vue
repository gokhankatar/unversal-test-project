<template>
  <div class="home-page">
    <HomeHeroSection />
    <v-container class="search-container">
      <HomeSearchTabs />
    </v-container>
    <HomePopularCities />
    <v-container class="features-section">
      <p
        class="section-title spacing-text text-subtitle-2 text-sm-subtitle-1 text-lg-h5 text-xl-h4"
      >
        Why TravelHub?
      </p>

      <v-divider class="mt-2 mb-4 mb-lg-5 mb-xl-10 w-100 w-lg-50 w-xl-25 mx-auto" />

      <v-row :dense="display.smAndDown.value">
        <v-col v-for="(feature, i) in features" :key="i" cols="6" md="3">
          <v-card
            variant="tonal"
            class="feature-card pa-2 pa-lg-5"
            :ripple="false"
            elevation="0"
          >
            <v-icon
              :size="display.mdAndUp.value ? 24 : 16"
              color="primary"
              class="mb-2"
              >{{ feature.icon }}</v-icon
            >
            <p
              class="feature-title"
              :class="
                display.xs.value
                  ? 'small-text'
                  : 'text-subtitle-2 text-lg-subtitle-2 text-xl-subtitle-1'
              "
            >
              {{ feature.title }}
            </p>
            <p
              class="feature-desc"
              :class="
                display.xs.value ? 'extra-small-text' : 'text-caption text-xl-subtitle-2'
              "
            >
              {{ feature.desc }}
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
const display = useDisplay();

const features = [
  { icon: "mdi-shield-check", title: "Secure Booking", desc: "Your data is protected with industry-standard security." },
  { icon: "mdi-clock-fast", title: "Instant Confirmation", desc: "Get your confirmation within seconds." },
  { icon: "mdi-headset", title: "24/7 Support", desc: "Our team is always here to help you." },
  { icon: "mdi-tag-multiple", title: "Best Price", desc: "We compare prices to find you the best deals." },
];
</script>

<style scoped>
@import url("~/assets/css/main.css");
</style>
