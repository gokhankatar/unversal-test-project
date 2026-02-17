<template>
  <NuxtLink :to="`/ticket/${ticket.id}`" class="ticket-card-link">
    <v-card class="ticket-card" elevation="0" hover>
      <v-card-text class="pa-2">
        <p class="ticket-company">{{ ticket.company }}</p>
        <div class="ticket-route">
          <span class="route-point">{{ ticket.from }}</span>
          <v-icon size="20" class="route-arrow">mdi-arrow-right</v-icon>
          <span class="route-point">{{ ticket.to }}</span>
        </div>
        <div class="ticket-meta">
          <span><v-icon size="14">mdi-clock-outline</v-icon> {{ ticket.time }}</span>
          <span><v-icon size="14">mdi-timer-outline</v-icon> {{ ticket.duration }}</span>
        </div>
        <div v-if="ticket.availableSeats" class="ticket-seats">
          {{ ticket.availableSeats }} seats left
        </div>
        <p class="ticket-price">
          <span class="price-amount">${{ ticket.price }}</span>
        </p>
      </v-card-text>
    </v-card>
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { Ticket } from '~/composables/core/interfaces'

defineProps<{
  ticket: Ticket
}>()
</script>

<style scoped>
.ticket-card-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  height: 100%;
}
.ticket-card {
  flex: 1;
  min-width: 0;
  height: 100%;
  min-height: 160px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  transition: var(--transition-smooth);
  display: flex;
  flex-direction: column;
  overflow: visible;
}
.ticket-card :deep(.v-card-text) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: visible;
}
.ticket-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-soft);
}
.ticket-company {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 4px;
  color: var(--color-text);
}
.ticket-route {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}
.route-point {
  font-size: 0.8125rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
.route-arrow {
  color: var(--color-primary);
}
.ticket-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: var(--color-muted);
  margin-bottom: 4px;
}
.ticket-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}
.ticket-seats {
  font-size: 0.75rem;
  color: var(--color-primary);
  margin-bottom: 4px;
}
.ticket-price .price-amount {
  font-weight: 700;
  font-size: 1rem;
}
</style>
