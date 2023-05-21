<script lang="ts" setup>
const links = [
  {
    label: "Home",
    icon: "i-heroicons-home",
    to: "/",
  },
  {
    label: "Notes",
    icon: "i-heroicons-document-text",
    to: "/notes",
  },
  {
    label: "Tags",
    icon: "i-heroicons-tag",
    to: "/tags",
  },
  {
    label: "Settings",
    icon: "i-heroicons-cog",
    to: "/settings",
  },
];
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <SiteHeader />
    <main
      class="relative flex grow flex-col overflow-auto dark:bg-gray-950 dark:text-white"
    >
      <section class="flex grow overflow-hidden">
        <div
          :class="
            cn([
              'h-full w-48 shrink-0 border-r',
              'border-gray-300 bg-gray-100',
              'dark:border-gray-700 dark:bg-gray-900',
            ])
          "
        >
          <UVerticalNavigation :links="links" />
        </div>
        <slot />
      </section>
    </main>
  </div>
</template>

<style scoped></style>
