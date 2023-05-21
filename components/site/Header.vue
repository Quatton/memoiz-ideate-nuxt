<script lang="ts" setup></script>

<template>
  <header
    :class="
      cn([
        'border-b',
        'border-primary-300 bg-primary-200 text-primary-700',
        'dark:border-primary-700 dark:bg-primary-900 dark:text-primary-300',
      ])
    "
  >
    <div class="container flex h-16 items-center">
      <ThemeToggle />
    </div>
  </header>
</template>

<style scoped></style>
