/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "@nuxtjs/eslint-config-typescript",
    "plugin:nuxt/recommended",
    "plugin:tailwindcss/recommended",
    "prettier",
    "plugin:vue/vue3-recommended",
  ],
  overrides: [],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint", "vitest", "tailwindcss"],
  settings: {
    tailwindcss: {
      callees: ["cn"],
      config: "./tailwind.config.cjs",
    },
  },
  rules: {
    "vue/multi-word-component-names": "off",
    "tailwindcss/no-custom-classname": "off",
    "vue/singleline-html-element-content-newline": "off",
    // "vue/no-multiple-template-root": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
