<script lang="ts" setup>
const colorMode = useColorMode();

const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
};
</script>

<template>
  <button class="hover:[&>*]:rotate-12 transition-colors inline-flex items-center justify-center" v-on:click="() => toggleColorMode()">
    <Icon
      size="20"
      name="bx-moon"
      class="hover: rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Icon
      size="20"
      name="bx-sun"
      class="absolute rotate-90 scale-0 transition-all hover:rotate-12 dark:rotate-0 dark:scale-100"
    />
  </button>
</template>

<style scoped></style>
