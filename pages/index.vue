<script lang="ts" setup>
const links = [
  {
    label: "Home",
    icon: "home",
    to: "/",
  },
  {
    label: "Notes",
    icon: "note",
    to: "/notes",
  },
  {
    label: "Tags",
    icon: "tag",
    to: "/tags",
  },
  {
    label: "Settings",
    icon: "settings",
    to: "/settings",
  },
];
</script>

<template>
  <section class="flex grow items-center overflow-hidden">
    <div
      :class="
        cn([
          'h-full w-48 border-r',
          'border-zinc-300 bg-zinc-100',
          'dark:border-zinc-700 dark:bg-zinc-900',
        ])
      "
    >
      <UVerticalNavigation :links="links" />
    </div>
    <NoteScreen />
  </section>
</template>

<style scoped></style>
