<script lang="ts" setup>
import * as monaco from "monaco-editor";
import { storeToRefs } from "pinia";
import { useEditorStore } from "@/stores/editor";
// import mermaid from "mermaid";

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
const { code, error, pending, staleSvg } = storeToRefs(store);

watch(
  [staleSvg],
  () => {
    if (staleSvg.value) {
      const nodes = document.querySelector("g.nodes");

      (() => {
        if (!nodes) return;
        const length = nodes.children.length;
        for (const node of nodes.children) {
          const nodeId = node.id.match(/^flowchart-(\w+)-\d+$/)?.at(1);

          const nodeLabel = new RegExp(`${nodeId}\\("(.+)"\\)|${nodeId}`);
          const matchingGroup = code.value.match(nodeLabel); // Find the matching group
          if (!nodeId) continue;
          node.addEventListener("click", () => {
            // const { edge: label } = await $fetch("/api/new-edge", {
            //   body: {
            //     code:
            //       code.value + `\n\t${nodeId} -->|"🤖"| node${length}("✏️")`,
            //   },
            //   method: "POST",
            // });

            // const newEdge = `\n\t${nodeId} -->|"${label}"| node${length}("✏️")`;

            code.value += `\n\t${nodeId} -->|"🤖"| node${length}("✏️")`;
          });
          node.addEventListener("contextmenu", (event) => {
            event.preventDefault(); // Prevent the default right-click action
            if (!matchingGroup) return;
            const userInput = window.prompt(
              "Enter new value:",
              matchingGroup.at(1)?.replace(/\\n/g, " ") || ""
            ); // Prompt the user for input

            if (userInput) {
              const sanitizedUserInput = userInput.replace(/"/g, "");
              const wrappedUserInput = autoTextWrap(sanitizedUserInput, 30);

              code.value = code.value.replace(
                nodeLabel,
                `${nodeId}("${wrappedUserInput}")`
              ); // Replace the matching group with the user input
            }
          });
          node.classList.add("cursor-pointer");
        }
      })();

      const edgeLabels = document.querySelector("g.edgeLabels");
      const edgePaths = document.querySelector("g.edgePaths");

      (() => {
        if (!edgeLabels || !edgePaths) return;
        for (let i = 0; i < edgeLabels.children.length; i++) {
          const edgeLabel = edgeLabels.children.item(i);
          const edgePath = edgePaths.children.item(i);
          if (!edgeLabel || !edgePath) continue;
          const edgeId = edgePath.id.match(/^L-(.+)-(.+)-\d*$/);

          if (!edgeId || edgeId.length < 3) continue;

          const edgeStart = edgeId.at(1);
          const edgeEnd = edgeId.at(2);

          // refer to this ^(?:node1)(?:\("[^"]*"\))?\s-->(?:\|"([^"]+)"\|)?\s(?:node2)(?:\("[^"]*"\))?$
          const edgeDefinitionRegExp = new RegExp(
            `((?:${edgeStart})(?:\\("[^"]*"\\))?)\\s-->(?:\\|"([^"]+)"\\|)?\\s((?:${edgeEnd})(?:\\("[^"]*"\\))?)`
          );

          const edgeDefinition = code.value.match(edgeDefinitionRegExp);

          if (!edgeDefinition) continue;
          const [_, nodeStart, edge, nodeEnd] = edgeDefinition;

          if (!nodeStart || !edge || !nodeEnd) continue;

          edgeLabel.addEventListener("click", async () => {
            const { edge: newEdge } = await $fetch("/api/new-edge", {
              body: {
                // replace $2 with 🤖
                code: code.value.replace(
                  edgeDefinitionRegExp,
                  `${nodeStart} -->|"🤖"| ${nodeEnd.replace(/"[^*]"/, "✏️")}`
                ),
                currentNodeId: edgeStart,
                nextNodeId: edgeEnd,
              },
              method: "POST",
            });

            const sanitizedNewEdge = newEdge.replace(/"/g, "");
            const wrappedNewEdge = autoTextWrap(sanitizedNewEdge, 30);

            code.value = code.value.replace(
              edgeDefinitionRegExp,
              `${nodeStart} -->|"${wrappedNewEdge}"| ${nodeEnd}`
            );
          });

          edgeLabel.addEventListener("contextmenu", (event) => {
            event.preventDefault(); // Prevent the default right-click action
            const userInput = window.prompt(
              "Enter new value:",
              edge.replace(/"/g, "").replace(/\\n/, " ")
            ); // Prompt the user for input

            if (userInput) {
              const sanitizedUserInput = userInput.replace(/"/g, "");
              const wrappedUserInput = autoTextWrap(sanitizedUserInput, 30);

              code.value = code.value.replace(
                edgeDefinitionRegExp,
                `${nodeStart} -->|"${wrappedUserInput}"| ${nodeEnd}`
              ); // Replace the matching group with the user input
            }
          });

          edgeLabel.classList.add("cursor-pointer");
        }
      })();
    }
  },
  {
    flush: "post",
  }
);

const handleKeyboardEvent = (ev: KeyboardEvent) => {
  if (ev.ctrlKey && ev.key === "r") {
    ev.preventDefault();
    code.value = originalValue;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyboardEvent, false);
  code.value = originalValue;
  initEditor(monaco);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyboardEvent, false);
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
            'h-48 border-t p-4',
            'border-zinc-300 bg-zinc-50 text-red-600',
            'dark:border-zinc-600 dark:bg-zinc-950 dark:text-red-400',
          ])
        "
      >
        {{ error }}
      </div>
    </div>

    <div
      :class="
        cn([
          'max-h-full grow p-4',
          'border-zinc-300 bg-zinc-100 text-zinc-900',
          'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200',
        ])
      "
      v-html="staleSvg"
    />
  </div>
</template>

<style scoped></style>
