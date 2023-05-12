/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "@nuxtjs/eslint-config-typescript",
    "plugin:nuxt/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:tailwindcss/recommended",
    "prettier",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  plugins: ["vitest", "prettier"],
  rules: {
    "vue/multi-word-component-names": "off",
    "tailwindcss/no-custom-classname": "off",
    // "vue/no-multiple-template-root": "off",
    // "@typescript-eslint/no-unused-vars": "off",
  },
};
