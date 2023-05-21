<script lang="ts" setup>
import * as monaco from "monaco-editor";
import { storeToRefs } from "pinia";
import { useEditorStore } from "@/stores/editor";

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

const originalValue = `flowchart TD\n\tgoal("Enter your problem here")`;

const store = useEditorStore();
const { code, error } = storeToRefs(store);

onMounted(() => {
  initEditor(monaco);
  code.value = originalValue;
});
</script>

<template>
  <div
    :class="
      cn([
        'flex grow flex-col overflow-hidden font-mono',
        'border-zinc-300',
        'dark:border-zinc-600 ',
      ])
    "
  >
    <MonacoEditor
      v-model="code"
      class="h-[99.9%]"
      :options="options"
      lang="mermaid"
    />
  </div>

  <div
    :class="
      cn([
        'h-48 overflow-auto border-t p-4',
        'border-zinc-300 bg-zinc-50 text-red-600',
        'dark:border-zinc-600 dark:bg-zinc-950 dark:text-red-400',
      ])
    "
  >
    {{ error }}
  </div>
</template>

<style scoped></style>
