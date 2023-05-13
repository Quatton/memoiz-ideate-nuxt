<script lang="ts" setup></script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <SiteHeader />
    <main
      class="relative flex grow flex-col overflow-auto dark:bg-zinc-950 dark:text-white"
    >
      <slot />
    </main>
  </div>
</template>

<style scoped></style>
