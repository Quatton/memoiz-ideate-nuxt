<script lang="ts" setup></script>

<template>
  <header
    :class="
      cn([
        'fixed top-0 z-40 w-full border-b',
        'border-zinc-300 bg-zinc-200 text-zinc-700',
        'dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300',
      ])
    "
  >
    <div class="container flex h-16 items-center">
      <SiteNavBar />
      <ThemeToggle />
    </div>
  </header>
</template>

<style scoped></style>
