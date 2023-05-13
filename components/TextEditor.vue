<script lang="ts" setup>
import mermaid from "mermaid";

const colorMode = useColorMode();

const pre = ref(`
flowchart TD
    Start --> Stop
`);

const {
  data: svg,
  error,
  pending,
} = await useLazyAsyncData(
  "mermaid",
  async () => {
    const { svg } = await mermaid.render("mermaid", pre.value);
    return svg;
  },
  {
    watch: [pre],
  }
);

const handleInput = (e: Event) => {
  pre.value = (e.target as HTMLDivElement).innerText;
};

// handle pressing tab to just insert a tab
const handleTab = (e: KeyboardEvent) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const location = e.location;

    pre.value = pre.value.slice(0, location) + "\t" + pre.value.slice(location);
  }
};
</script>

<template>
  <ClientOnly>
    <div class="grid h-full grow grid-cols-2 grid-rows-[1fr_12rem]">
      <div
        :class="
          cn([
            'resize-none break-words border-r p-4 font-mono focus:outline-none',
            'border-zinc-300 bg-zinc-200 text-zinc-900',
            'dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100',
          ])
        "
        contenteditable
        @keydown="handleTab"
        @input="handleInput"
      >
        {{ pre }}
      </div>
      <div
        :class="
          cn([
            'p-4',
            'border-zinc-300 bg-zinc-100 text-zinc-900',
            'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200',
          ])
        "
        v-html="pending ? 'Loading...' : error ? error.message : svg"
      />
      <div
        :class="
          cn([
            'col-span-2 h-48 border-t p-4',
            'border-zinc-300 bg-zinc-50 text-red-600',
            'dark:border-zinc-600 dark:bg-zinc-950 dark:text-red-400',
          ])
        "
      >
        idk i love making multiple windows
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped></style>
