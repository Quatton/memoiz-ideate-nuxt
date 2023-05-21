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
      class="relative flex grow flex-col overflow-auto dark:bg-zinc-950 dark:text-white"
    >
      <section class="flex grow overflow-hidden">
        <div
          :class="
            cn([
              'h-full w-48 shrink-0 border-r',
              'border-zinc-300 bg-zinc-100',
              'dark:border-zinc-700 dark:bg-zinc-900',
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
