<template>
  <v-footer class="app-footer">
    <v-container class="footer-container">
      <v-row class="footer-main">
        <v-col cols="12" md="4" class="footer-brand-col">
          <NuxtLink to="/" class="footer-brand">TravelHub</NuxtLink>
          <p class="footer-tagline">
            Your trusted platform for booking accommodations and travel experiences worldwide.
          </p>
          <div class="footer-social">
            <v-btn
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              :icon="social.icon"
              variant="text"
              color="primary"
              size="small"
              class="social-btn"
              :title="social.name"
            />
          </div>
        </v-col>
        <v-col cols="6" sm="4" md="2">
          <h4 class="footer-heading">Product</h4>
          <ul class="footer-links">
            <li v-for="link in productLinks" :key="link.to">
              <NuxtLink :to="link.to" class="footer-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </v-col>
        <v-col cols="6" sm="4" md="2">
          <h4 class="footer-heading">Company</h4>
          <ul class="footer-links">
            <li v-for="link in companyLinks" :key="link.to">
              <NuxtLink :to="link.to" class="footer-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </v-col>
        <v-col cols="6" sm="4" md="2">
          <h4 class="footer-heading">Support</h4>
          <ul class="footer-links">
            <li v-for="link in supportLinks" :key="link.to">
              <NuxtLink :to="link.to" class="footer-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </v-col>
      </v-row>
      <v-divider class="footer-divider" />
      <v-row align="center" justify="space-between" class="footer-bottom">
        <v-col cols="12" md="6">
          <span class="footer-copy">© {{ new Date().getFullYear() }} TravelHub. All rights reserved.</span>
        </v-col>
        <v-col cols="12" md="6" class="footer-legal">
          <NuxtLink to="/privacy" class="footer-legal-link">Privacy Policy</NuxtLink>
          <span class="footer-legal-sep">·</span>
          <NuxtLink to="/terms" class="footer-legal-link">Terms of Service</NuxtLink>
          <span class="footer-legal-sep">·</span>
          <NuxtLink to="/cookies" class="footer-legal-link">Cookie Policy</NuxtLink>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts" setup>
const productLinks = [
  { label: "Hotels & Stays", to: "/search?type=booking" },
  { label: "Tickets & Experiences", to: "/search?type=ticket" },
  { label: "Popular Destinations", to: "/#destinations" },
  { label: "Deals", to: "/deals" },
];

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Careers", to: "/careers" },
  { label: "Press", to: "/press" },
  { label: "Contact", to: "/contact" },
];

const supportLinks = [
  { label: "Help Center", to: "/help" },
  { label: "Cancellation", to: "/help/cancellation" },
  { label: "Safety", to: "/safety" },
  { label: "FAQ", to: "/faq" },
];

const socialLinks = [
  { name: "Facebook", icon: "mdi-facebook", url: "https://facebook.com" },
  { name: "Twitter", icon: "mdi-twitter", url: "https://twitter.com" },
  { name: "Instagram", icon: "mdi-instagram", url: "https://instagram.com" },
  { name: "LinkedIn", icon: "mdi-linkedin", url: "https://linkedin.com" },
  { name: "YouTube", icon: "mdi-youtube", url: "https://youtube.com" },
];
</script>

<style scoped>
.app-footer {
  background: var(--color-surface);
  margin-top: auto;
  padding-top: 48px;
  padding-bottom: 24px;
}
.footer-container {
  max-width: 1200px;
  margin-inline: auto;
}
.footer-main {
  padding-bottom: 32px;
}
.footer-brand-col {
  padding-right: 48px;
}
.footer-brand {
  display: inline-block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.02em;
  text-decoration: none;
  margin-bottom: 12px;
}
.footer-brand:hover {
  opacity: 0.9;
}
.footer-tagline {
  color: var(--color-muted);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 20px;
  max-width: 280px;
}
.footer-social {
  display: flex;
  gap: 4px;
}
.social-btn {
  min-width: 40px;
}
.footer-heading {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-muted);
  margin-bottom: 16px;
}
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-links li {
  margin-bottom: 10px;
}
.footer-link {
  font-size: 0.875rem;
  color: var(--color-text);
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.2s;
}
.footer-link:hover {
  opacity: 1;
  color: var(--color-primary);
}
.footer-divider {
  margin: 0;
  opacity: 0.5;
}
.footer-bottom {
  padding-top: 24px;
}
.footer-copy {
  font-size: 0.8125rem;
  color: var(--color-muted);
}
.footer-legal {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 8px;
  justify-content: flex-end;
}
.footer-legal-link {
  font-size: 0.8125rem;
  color: var(--color-muted);
  text-decoration: none;
}
.footer-legal-link:hover {
  color: var(--color-primary);
}
.footer-legal-sep {
  font-size: 0.75rem;
  color: var(--color-muted);
  opacity: 0.6;
}
@media (max-width: 960px) {
  .footer-brand-col {
    padding-right: 0;
    margin-bottom: 24px;
  }
  .footer-tagline {
    max-width: none;
  }
  .footer-legal {
    justify-content: flex-start;
  }
}
</style>
