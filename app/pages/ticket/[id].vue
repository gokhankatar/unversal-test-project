<template>
  <div v-if="pending" class="detail-loading">
    <v-progress-circular indeterminate color="primary" size="48" />
  </div>

  <v-container v-else-if="ticket" class="ticket-detail pa-5 pa-lg-10">
    <div class="detail-header">
      <v-btn
        variant="text"
        class="back-btn text-capitalize"
        @click="navigateBack"
        prepend-icon="mdi-arrow-left"
        text="Back"
      />
    </div>
    <v-row>
      <v-col cols="12" md="8">
        <!-- Firma bilgisi -->
        <v-card class="ticket-info-card" elevation="0">
          <v-card-text class="pa-4">
            <div class="company-header">
              <p
                class="company-name text-caption text-sm-subtitle-2 text-lg-h6 text-xl-h5"
              >
                {{ ticket.company }}
              </p>
              <v-chip
                :color="getTypeColor(ticket.type)"
                size="small"
                variant="tonal"
                class="type-badge"
                :text="getTypeLabel(ticket.type)"
              />
            </div>

            <div class="route-display d-flex flex-wrap">
              <div class="route-point">
                <span class="route-label">From</span>
                <span
                  class="route-value text-caption text-sm-subtitle-2 text-lg-subtitle-1 text-xl-h6"
                  >{{ ticket.from }}</span
                >
              </div>
              <v-icon
                :size="display.xs.value ? 24 : 32"
                color="primary"
                class="route-arrow"
              />

              <div class="route-point">
                <span class="route-label">To</span>
                <span
                  class="route-value text-caption text-sm-subtitle-2 text-lg-subtitle-1 text-xl-h6"
                  >{{ ticket.to }}</span
                >
              </div>
            </div>

            <div class="ticket-meta-grid">
              <div class="meta-item">
                <v-icon size="20" color="primary">mdi-calendar</v-icon>
                <div>
                  <span class="meta-label">Date</span>
                  <span class="meta-value">{{ ticket.date }}</span>
                </div>
              </div>
              <div class="meta-item">
                <v-icon size="20" color="primary">mdi-clock-outline</v-icon>
                <div>
                  <span class="meta-label">Time</span>
                  <span class="meta-value">{{ ticket.time }}</span>
                </div>
              </div>
              <div class="meta-item">
                <v-icon size="20" color="primary">mdi-timer-outline</v-icon>
                <div>
                  <span class="meta-label">Duration</span>
                  <span class="meta-value">{{ ticket.duration }}</span>
                </div>
              </div>
              <div v-if="ticket.availableSeats" class="meta-item">
                <v-icon size="20" color="primary">mdi-seat-passenger</v-icon>
                <div>
                  <span class="meta-label">Seats left</span>
                  <span class="meta-value">{{ ticket.availableSeats }}</span>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Seat selection placeholder -->
        <section class="detail-section">
          <h2 class="section-heading">Seat selection</h2>
          <div class="seat-placeholder">
            <v-icon size="56" color="grey-lighten-1">mdi-seat-passenger</v-icon>
            <p class="seat-placeholder-text">Seat selection coming soon</p>
            <p class="seat-placeholder-sub">Automatic assignment for now</p>
          </div>
        </section>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="ticket-panel" elevation="2">
          <v-card-title class="panel-title">Booking summary</v-card-title>
          <v-card-text>
            <div class="price-row">
              <span class="price-label">Ticket price</span>
              <span class="price-value">${{ ticket.price }} x {{ passengers }}</span>
            </div>
            <div class="total-price-wrap">
              <span class="total-label">Total price</span>
              <span class="total-amount">${{ totalPrice }}</span>
            </div>
            <v-select
              v-model="passengers"
              :items="[1, 2, 3, 4, 5, 6, 7, 8]"
              label="Passengers"
              variant="outlined"
              density="comfortable"
              class="mt-2"
              hide-details
            />
            <v-btn
              color="primary"
              block
              :ripple="false"
              :size="display.xl.value ? 'large' : 'default'"
              class="mt-3 book-btn"
              text="Book Now"
              prepend-icon="mdi-check-circle"
              :loading="isProcessing"
              @click="handleBook"
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
            Booking confirmed!
          </p>
          <p class="text-caption text-lg-subtitle-2 text-medium-emphasis">
            Your ticket has been successfully booked.
          </p>
        </div>
        <v-divider class="my-4" />
        <div v-if="ticket" class="reservation-summary">
          <p class="summary-title">{{ ticket.company }}</p>
          <p class="summary-row">
            <v-icon size="18">mdi-airplane-takeoff</v-icon> {{ ticket.from }} →
            {{ ticket.to }}
          </p>
          <p class="summary-row">
            <v-icon size="18">mdi-calendar</v-icon> {{ ticket.date }} at {{ ticket.time }}
          </p>
          <p class="summary-row">
            <v-icon size="18">mdi-account-group</v-icon> {{ passengers }} passenger(s)
          </p>
          <p class="summary-total">
            Total: <strong>${{ totalPrice }}</strong>
          </p>
        </div>

        <v-card-actions class="pa-0 mt-4">
          <v-spacer />
          <v-btn
            color="primary"
            class="text-capitalize"
            prepend-icon="mdi-close"
            variant="tonal"
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
import type { Ticket } from "~/composables/core/interfaces";
import { useTicketType } from "~/composables/data/useTicketType";

const { getTypeLabel, getTypeColor } = useTicketType();
const display = useDisplay();
const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id as string);

const { data: ticket, pending } = await useFetch<Ticket>(
  () => `/api/tickets/${id.value}`,
  { key: () => `ticket-${id.value}` }
);

const passengers = ref(1);
const totalPrice = computed(() => {
  if (!ticket.value) return 0;
  return ticket.value.price * passengers.value;
});

const loadingDialog = ref(false);
const successDialog = ref(false);
const isProcessing = ref(false);

const handleBook = async () => {
  if (!ticket.value) return;
  isProcessing.value = true;
  loadingDialog.value = true;
  await new Promise((r) => setTimeout(r, 2200));
  loadingDialog.value = false;
  successDialog.value = true;
  isProcessing.value = false;
};

const closeSuccessDialog = () => {
  successDialog.value = false;
  passengers.value = 1;
};

const navigateBack = () => router.back();
</script>

<style scoped>
@import url("~/assets/css/main.css");
@import url("~/assets/css/ticket_detail.css");

.reservation-dialog {
  border-radius: var(--radius-xl);
}
.success-header {
  text-align: center;
}
.reservation-summary {
  font-size: 0.9375rem;
}
.summary-title {
  font-weight: 600;
  margin-bottom: 12px;
}
.summary-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  color: var(--color-muted);
}
.summary-total {
  margin-top: 12px;
  font-size: 1rem;
  color: var(--color-text);
}
</style>
