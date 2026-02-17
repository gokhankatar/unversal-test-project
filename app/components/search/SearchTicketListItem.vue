<template>
  <NuxtLink :to="`/ticket/${ticket.id}`" class="list-item-link">
    <!-- Small screen -->
    <div v-if="isMobile" class="list-item list-item--mobile">
      <div class="list-item-icon" :class="`list-item-icon--${ticket.type}`">
        <v-icon size="16" :icon="typeIcon" />
      </div>
      <div class="list-item-body">
        <p class="list-item-title small-text">{{ ticket.company }}</p>
        <p class="list-item-subtitle extra-small-text">
          <span>{{ ticket.from }}</span>
          <v-icon size="14" class="route-arrow">mdi-arrow-right</v-icon>
          <span>{{ ticket.to }}</span>
        </p>
        <div class="list-item-meta extra-small-text">
          <span><v-icon size="12">mdi-clock-outline</v-icon> {{ ticket.time }}</span>
          <span><v-icon size="12">mdi-timer-outline</v-icon> {{ ticket.duration }}</span>
          <span v-if="ticket.availableSeats" class="seats"
            >{{ ticket.availableSeats }} seats left</span
          >
        </div>
        <p class="list-item-price small-text">${{ ticket.price }}</p>
      </div>
    </div>
    <!-- Normal screen: v-list-item -->
    <v-list-item v-else class="list-item" :active="false" lines="three">
      <template #prepend>
        <div class="list-item-icon" :class="`list-item-icon--${ticket.type}`">
          <v-icon :size="isXs ? 18 : 28" :icon="typeIcon" />
        </div>
      </template>
      <div class="list-item-content">
        <div class="list-item-text">
          <v-list-item-title class="list-item-title">{{
            ticket.company
          }}</v-list-item-title>
          <v-list-item-subtitle class="list-item-subtitle">
            <span>{{ ticket.from }}</span>
            <v-icon size="16" class="route-arrow">mdi-arrow-right</v-icon>
            <span>{{ ticket.to }}</span>
          </v-list-item-subtitle>
          <div class="list-item-meta">
            <span><v-icon size="14">mdi-clock-outline</v-icon> {{ ticket.time }}</span>
            <span
              ><v-icon size="14">mdi-timer-outline</v-icon> {{ ticket.duration }}</span
            >
            <span v-if="ticket.availableSeats" class="seats"
              >{{ ticket.availableSeats }} seats left</span
            >
          </div>
        </div>
        <p class="list-item-price">
          <span class="price-amount">${{ ticket.price }}</span>
        </p>
      </div>
    </v-list-item>
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { Ticket } from "~/composables/core/interfaces";
import { useDisplay } from "vuetify";

const display = useDisplay();
const isMobile = computed(() => display?.smAndDown?.value ?? false);
const isXs = computed(() => display?.xs?.value ?? false);
const props = defineProps<{
  ticket: Ticket;
}>();
const typeIcon = computed(() => {
  const map: Record<string, string> = {
    flight: "mdi-airplane",
    bus: "mdi-bus",
    train: "mdi-train-variant",
    event: "mdi-calendar-star",
  };
  return map[props.ticket.type] ?? "mdi-ticket";
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px;
  gap: 8px;
}
.list-item.list-item--mobile .list-item-icon {
  margin-right: 0;
  margin-bottom: 0;
  width: 32px;
  min-width: 32px;
  height: 32px;
}
.list-item.list-item--mobile .list-item-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.list-item.list-item--mobile .list-item-body .list-item-title {
  font-weight: 600;
  margin-bottom: 0;
}
.list-item.list-item--mobile .list-item-body .list-item-subtitle {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-muted);
  margin: 0;
}
.list-item.list-item--mobile .list-item-body .list-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin: 0;
  color: var(--color-muted);
}
.list-item.list-item--mobile .list-item-body .list-item-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}
.list-item.list-item--mobile .list-item-body .list-item-price {
  font-weight: 700;
  margin: 0;
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
.list-item-icon {
  width: 56px;
  min-width: 56px;
  flex-shrink: 0;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  background: var(--color-surface);
}
.list-item-icon--flight {
  background: rgba(13, 148, 136, 0.12);
  color: var(--color-primary);
}
.list-item-icon--bus {
  background: rgba(99, 102, 241, 0.12);
  color: rgb(99, 102, 241);
}
.list-item-icon--train {
  background: rgba(34, 197, 94, 0.12);
  color: rgb(34, 197, 94);
}
.list-item-icon--event {
  background: rgba(245, 158, 11, 0.12);
  color: rgb(245, 158, 11);
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
  gap: 6px;
  margin-top: 0;
  min-width: 0;
}
.route-arrow {
  color: var(--color-primary);
}
.list-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  font-size: 0.75rem;
  color: var(--color-muted);
  margin-top: 4px;
}
.list-item-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}
.list-item-meta .seats {
  color: var(--color-primary);
}
.list-item-price {
  flex-shrink: 0;
  margin-left: auto;
}
.list-item-price .price-amount {
  font-weight: 700;
  font-size: 1rem;
}
</style>
