<template>
  <section class="hero">
    <div class="hero-bg">
      <div class="hero-gradient" />
      <img
        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920"
        alt="Travel"
        class="hero-image"
        loading="lazy"
      />
    </div>
    <v-container
      class="hero-content d-flex flex-column justify-center align-center mb-5 mb-sm-10 mb-lg-15"
    >
      <p class="hero-title text-h5 text-lg-h4 text-xl-h3">Discover Your Next Journey</p>
      <p
        class="hero-subtitle text-center text-caption text-lg-subtitle-2 text-xl-subtitle-1"
      >
        Book stays and tickets in one place. Simple, fast, and trusted.
      </p>
    </v-container>
  </section>
</template>

<script lang="ts" setup></script>

<style scoped>
.hero {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}
.hero-bg {
  position: absolute;
  inset: 0;
}
.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(15, 23, 42, 0.95) 0%,
    rgba(15, 23, 42, 0.5) 40%,
    transparent 70%
  );
  z-index: 1;
}
.hero-content {
  position: relative;
  z-index: 2;
  padding-bottom: 48px;
}
.hero-title {
  font-weight: 800;
  color: white;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 12px;
}
.hero-subtitle {
  color: rgba(255, 255, 255, 0.85);
  max-width: 480px;
}
@media (max-width: 600px) {
  .hero {
    min-height: 320px;
  }
  .hero-content {
    padding-bottom: 32px;
  }
}
</style>
