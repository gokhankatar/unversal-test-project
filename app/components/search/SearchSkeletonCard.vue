<template>
  <div class="skeleton-card">
    <v-skeleton-loader type="image" class="skeleton-card__image" elevation="0" />
    <div class="skeleton-card__content pa-2">
      <v-skeleton-loader type="list-item-two-line" class="skeleton-card__lines" />
      <v-skeleton-loader type="text" class="skeleton-card__price" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.skeleton-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: transparent;
}
.skeleton-card__image {
  aspect-ratio: 16/10;
  width: 100%;
}
.skeleton-card__image :deep(.v-skeleton-loader__image) {
  height: 100%;
}
.skeleton-card__lines {
  margin-bottom: 4px;
}
.skeleton-card__price {
  max-width: 40%;
  margin-top: 4px;
}
</style>
