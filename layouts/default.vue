<script lang="ts" setup></script>

<template>
  <div>
    <SiteHeader />
    <main
      class="relative flex min-h-screen flex-col dark:bg-zinc-950 dark:text-white"
    >
      <slot />
    </main>
  </div>
</template>

<style scoped></style>
