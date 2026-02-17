<template>
  <v-container class="py-12">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6" elevation="2">
          <h1 class="text-h5 font-weight-bold mb-4 text-center">Sign in</h1>
          <p class="text-subtitle-2 text-medium-emphasis text-center mb-6">
            Sign in to access your bookings and preferences.
          </p>
          <v-btn block color="primary" size="large" disabled>
            Coming soon
          </v-btn>
          <v-btn block variant="text" class="mt-2" to="/">
            Back to home
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "default",
});
</script>
