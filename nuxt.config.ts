// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/eslint-module",
    "@nuxtjs/google-fonts",
    "nuxt-icon",
    "nuxt-monaco-editor",
    "@pinia/nuxt",
    "@nuxthq/ui",
  ],

  colorMode: {
    classSuffix: "",
  },

  googleFonts: {
    families: {
      Inter: true,
      "JetBrains+Mono": true,
      Montserrat: true,
    },
  },

  devtools: {
    enabled: true,
  },

  runtimeConfig: {
    ai21ApiKey: "",
    openaiApiKey: "",
  },
});
