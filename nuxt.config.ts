// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/eslint-module",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxtjs/google-fonts",
    "nuxt-icon",
    "nuxt-monaco-editor",
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
  },
});
