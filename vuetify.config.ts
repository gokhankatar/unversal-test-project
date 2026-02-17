import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  theme: {
    defaultTheme: 'light', // Must match lightThemeName for ssrClientHints
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#0d9488',
          'primary-darken-1': '#0f766e',
          'primary-lighten-1': '#14b8a6',
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
