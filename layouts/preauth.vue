<script setup lang="ts"></script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <SiteHeader />
    <main
      class="relative flex grow flex-col overflow-auto dark:bg-gray-950 dark:text-white"
    >
      <section class="flex grow items-center justify-center overflow-hidden">
        <slot />
      </section>
    </main>
  </div>
</template>

<style></style>
