<template>
  <header
    class="app-header"
    :class="{
      'app-header--scrolled': isScrolled && !showMobileMenu,
      'app-header--mobile': showMobileMenu,
    }"
    :style="
      showMobileMenu ? {} : { background: 'transparent', backgroundColor: 'transparent' }
    "
  >
    <div class="app-header__inner">
      <NuxtLink to="/" class="logo-link">
        <span class="logo-text text-subtitle-1 text-xl-h5">TravelHub</span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="nav-center nav-desktop">
        <v-btn
          to="/"
          variant="text"
          color="primary"
          prepend-icon="mdi-home-outline"
          :active="isActive('/')"
          class="nav-btn text-capitalize"
          text="Home"
        />
        <v-btn
          to="/search"
          variant="text"
          color="primary"
          prepend-icon="mdi-magnify"
          :active="isActive('/search')"
          class="nav-btn text-capitalize"
          text="Search"
        />
      </nav>

      <div class="nav-right nav-desktop">
        <v-switch
          :model-value="isDark"
          true-icon="mdi-weather-night"
          false-icon="mdi-weather-sunny"
          color="primary"
          hide-details
          density="compact"
          inset
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          class="theme-switch theme-switch--icon-only"
          @update:model-value="theme.toggle()"
        />
        <v-btn
          variant="outlined"
          color="primary"
          rounded="xl"
          prepend-icon="mdi-account-outline"
          class="auth-btn text-capitalize"
          to="/login"
          text="Sign in"
          :ripple="false"
        />
      </div>

      <!-- Mobile menu trigger -->
      <v-btn
        v-if="showMobileMenu"
        variant="text"
        icon="mdi-menu"
        class="nav-menu-toggle"
        aria-label="Open menu"
        @click="toggleMenu"
      />
    </div>

    <!-- Mobile full-screen overlay menu -->
    <Transition name="mobile-menu">
      <div
        v-show="menuOpen"
        class="mobile-menu-overlay"
        :aria-hidden="!menuOpen"
        @click.self="closeMenu"
      >
        <div class="mobile-menu__content">
          <div class="mobile-menu__header">
            <span class="logo-text">TravelHub</span>
            <v-btn
              variant="text"
              icon="mdi-close"
              class="mobile-menu__close"
              aria-label="Close menu"
              @click="closeMenu"
            />
          </div>
          <nav class="mobile-menu__nav">
            <NuxtLink
              to="/"
              class="mobile-menu__link"
              :class="{ active: isActive('/') }"
              @click="closeMenu"
            >
              <v-icon>mdi-home-outline</v-icon>
              <span>Home</span>
            </NuxtLink>
            <NuxtLink
              to="/search"
              class="mobile-menu__link"
              :class="{ active: isActive('/search') }"
              @click="closeMenu"
            >
              <v-icon>mdi-magnify</v-icon>
              <span>Search</span>
            </NuxtLink>
            <NuxtLink to="/login" class="mobile-menu__link" @click="closeMenu">
              <v-icon>mdi-account-outline</v-icon>
              <span>Sign in</span>
            </NuxtLink>
            <button
              type="button"
              class="mobile-menu__link mobile-menu__link--theme"
              @click="theme.toggle()"
            >
              <v-icon>{{ isDark ? "mdi-weather-sunny" : "mdi-weather-night" }}</v-icon>
              <span>{{ isDark ? "Light mode" : "Dark mode" }}</span>
            </button>
          </nav>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script lang="ts" setup>
const theme = useTheme();
const route = useRoute();
const isDark = computed(() => theme.global.name.value === "dark");
const isScrolled = ref(false);
const menuOpen = ref(false);
const showMobileMenu = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  document.body.style.overflow = menuOpen.value ? "hidden" : "";
};

const closeMenu = () => {
  menuOpen.value = false;
  document.body.style.overflow = "";
};

const checkViewport = () => {
  showMobileMenu.value = window.innerWidth < 960;
  if (!showMobileMenu.value) closeMenu();
};

const isActive = (path: string) => {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};

const scrollTargets: (HTMLElement | typeof window)[] = [];

const getScrollTop = (): number => {
  const scroller = document.querySelector(".v-main__scroller") as HTMLElement | null;
  if (scroller) return scroller.scrollTop;
  return window.scrollY ?? document.documentElement.scrollTop ?? 0;
};

const onScroll = () => {
  isScrolled.value = getScrollTop() > 0;
};

onMounted(() => {
  checkViewport();
  window.addEventListener("resize", checkViewport);
  nextTick(() => {
    const scroller = document.querySelector(".v-main__scroller");
    if (scroller) scrollTargets.push(scroller as HTMLElement);
    scrollTargets.push(window);
    scrollTargets.forEach((el) =>
      el.addEventListener("scroll", onScroll, { passive: true })
    );
    onScroll();
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", checkViewport);
  document.body.style.overflow = "";
  scrollTargets.forEach((el) => el.removeEventListener("scroll", onScroll));
});
</script>

<style scoped>
@import url("~/assets/css/navbar.css");
</style>
