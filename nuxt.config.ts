export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  vuetify: {
    moduleOptions: {
      ssrClientHints: {
        prefersColorScheme: true,
        prefersColorSchemeOptions: {
          cookieName: 'travelhub-theme',
          darkThemeName: 'dark',
          lightThemeName: 'light',
        },
      },
    },
  },
  modules: [
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-lodash'
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'TravelHub | Book Stays & Tickets',
      titleTemplate: '%s | TravelHub',
      meta: [
        {
          charset: 'utf-8'
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          name: 'format-detection',
          content: 'telephone=no'
        },
        {
          name: 'theme-color',
          content: '#0d9488'
        },
        {
          name: 'msapplication-TileColor',
          content: '#0d9488'
        }
      ],
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png"
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },
  lodash: {
    prefix: "_",
    prefixSkip: ["string"],
    upperAfterPrefix: false,
    exclude: ["map"],
    alias: [
      ["camelCase", "stringToCamelCase"],
      ["kebabCase", "stringToKebab"],
      ["isDate", "isLodashDate"],
    ],
  },
  css: ["~/assets/css/main.css", "~/assets/css/navbar.css"],
  devtools: { enabled: false },
  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },
})