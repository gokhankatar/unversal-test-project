import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  theme: {
    defaultTheme: 'light', // Must match lightThemeName for ssrClientHints
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#2563eb',
          'primary-darken-1': '#1d4ed8',
          'primary-lighten-1': '#3b82f6',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#14b8a6',
          'primary-darken-1': '#0d9488',
          'primary-lighten-1': '#2dd4bf',
        },
      },
    },
  },
})
