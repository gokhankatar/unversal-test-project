<template>
  <div class="loading-overlay">
    <div class="planeWrapper">
      <div class="planeBody">
        <div class="planeTail"></div>
        <div class="wingLeft"></div>
        <div class="wingRight"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.planeWrapper {
  --planeColor: var(--color-primary);
  --size: 150px;
  width: var(--size);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  transform-origin: top;
  animation: loadingAnimation 2s ease-in-out infinite;
}

@keyframes loadingAnimation {
  to {
    transform: rotate(-360deg);
  }
}

.planeBody,
.planeBody * {
  background: var(--planeColor);
}
.planeBody {
  position: relative;
  width: 75%;
  aspect-ratio: 7/1;
  border-bottom-left-radius: 50% 100%;
  border-top-right-radius: 25% 90%;
  border-bottom-right-radius: 20% 20%;
}
.planeTail,
.wingLeft,
.wingRight {
  position: absolute;
}
.planeTail {
  left: calc(-0.3% + 1px);
  top: -120%;
  width: 15%;
  aspect-ratio: 1/1.25;
  transform: skewX(5deg) translateX(-5%);
  border-top-left-radius: 10%;
  border-top-right-radius: 100% 100%;
}
.wingLeft,
.wingRight {
  left: 50%;
  width: 25%;
  aspect-ratio: 1;
}
.wingLeft {
  transform-origin: bottom;
  top: -190%;
  transform: skewX(45deg) translateX(-30%);
  scale: 0.8;
  border-top-left-radius: 10%;
  border-top-right-radius: 60% 100%;
}
.wingRight {
  transform-origin: top;
  bottom: -170%;
  transform: skewX(-45deg);
  border-bottom-left-radius: 10%;
  border-bottom-right-radius: 60% 100%;
}
.planeTail::after {
  content: "";
  position: absolute;
  height: 55%;
  aspect-ratio: 1;
  transform: skewX(0deg) rotate(-8deg);
  right: -60%;
  bottom: 4.5%;
  background: radial-gradient(
    circle at 100% 0%,
    transparent 70%,
    var(--planeColor) calc(70% + 0.5px)
  );
}
</style>
