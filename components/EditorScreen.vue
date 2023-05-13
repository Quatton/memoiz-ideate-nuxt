<script lang="ts" setup>
import * as monaco from "monaco-editor";

const colorMode = useColorMode();

const options = computed(() => {
  const options: monaco.editor.IStandaloneEditorConstructionOptions = {
    theme: colorMode.value === "dark" ? "mermaid-dark" : "mermaid",
    minimap: {
      enabled: false,
    },
    overviewRulerLanes: 0,
    autoClosingQuotes: "beforeWhitespace",
    autoClosingBrackets: "beforeWhitespace",
    automaticLayout: true,
  };
  return options;
});
const pre = ref(`flowchart TD
    Start --> Stop`);

const {
  data: svg,
  error,
  pending,
} = await useLazyAsyncData(
  "mermaid",
  async () => {
    const { svg } = await render(
      {
        theme: colorMode.value === "dark" ? "dark" : "default",
      },
      pre.value,
      "mermaid"
    );
    return svg;
  },
  {
    watch: [pre, colorMode],
  }
);

onMounted(() => {
  initEditor(monaco);
});
</script>

<template>
  <div class="flex h-full grow">
    <div
      :class="
        cn([
          'flex flex-col overflow-hidden border-r font-mono',
          'border-zinc-300',
          'dark:border-zinc-600 ',
        ])
      "
    >
      <div class="grow resize-x sm:min-w-[12rem]">
        <LazyMonacoEditor
          v-model="pre"
          class="h-[99.9%]"
          :options="options"
          lang="mermaid"
        />
      </div>

      <div
        :class="
          cn([
            'h-48 border-t p-4',
            'border-zinc-300 bg-zinc-50 text-red-600',
            'dark:border-zinc-600 dark:bg-zinc-950 dark:text-red-400',
          ])
        "
      >
        idk i love making multiple windows
      </div>
    </div>

    <div
      :class="
        cn([
          'grow p-4',
          'border-zinc-300 bg-zinc-100 text-zinc-900',
          'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200',
        ])
      "
      v-html="pending ? 'Loading...' : error ? error.message : svg"
    />
  </div>
</template>

<style scoped></style>
