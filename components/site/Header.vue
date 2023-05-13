<script lang="ts" setup></script>

<template>
  <header
    :class="
      cn([
        'border-b',
        'border-rose-300 bg-rose-200 text-rose-700',
        'dark:border-rose-700 dark:bg-rose-900 dark:text-rose-300',
      ])
    "
  >
    <div class="container flex h-16 items-center">
      <ThemeToggle />
    </div>
  </header>
</template>

<style scoped></style>
