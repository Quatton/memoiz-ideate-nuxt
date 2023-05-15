<script lang="ts" setup>
// import * as monaco from "monaco-editor";
// import mermaid from "mermaid";

const colorMode = useColorMode();

// const options = computed(() => {
//   const options: monaco.editor.IStandaloneEditorConstructionOptions = {
//     theme: colorMode.value === "dark" ? "mermaid-dark" : "mermaid",
//     minimap: {
//       enabled: false,
//     },
//     overviewRulerLanes: 0,
//     autoClosingQuotes: "beforeWhitespace",
//     autoClosingBrackets: "beforeWhitespace",
//     automaticLayout: true,
//   };
//   return options;
// });
const pre = ref(`
flowchart TD
  tutorial("Right-click the next node to define a problem.\nLeft-click to generate the next node.\nRight-click the edge to edit.\nLeft-click the edge to generate a question.") --> start("I want to book a hotel")
`);

const {
  data: svg,
  error,
  pending,
} = await useAsyncData(
  "mermaid",
  async () => {
    const { svg } = await render(
      {
        theme: colorMode.value === "dark" ? "dark" : "default",
        securityLevel: "antiscript",
      },
      pre.value.trim(),
      "mermaid"
    );
    return svg;
  },
  {
    watch: [pre, colorMode],
  }
);

watch(
  [svg, error, pending],
  () => {
    if (svg.value && !error.value && !pending.value) {
      const nodes = document.querySelector("g.nodes");

      (() => {
        if (!nodes) return;
        for (const node of nodes.children) {
          const nodeId = node.id.match(/^flowchart-(\w+)-\d+$/)?.at(1);

          const nodeLabel = new RegExp(`${nodeId}\\(".+"\\)|${nodeId}`);
          const matchingGroup = pre.value.match(nodeLabel); // Find the matching group
          if (!nodeId) continue;
          node.addEventListener("click", async () => {
            const { edge: label } = await $fetch("/api/new-edge", {
              body: {
                code: pre.value,
              },
              method: "POST",
            });

            const newEdge = `\n\t${nodeId} -->|"${label}"| node${Math.floor(
              Math.random() * 100000
            )}("✏️")`;

            pre.value += newEdge;
          });
          node.addEventListener("contextmenu", (event) => {
            event.preventDefault(); // Prevent the default right-click action
            if (!matchingGroup) return;
            const userInput = window.prompt(
              "Enter new value:",
              matchingGroup.at(1) || ""
            ); // Prompt the user for input

            if (userInput) {
              const sanitizedUserInput = userInput.replace(/"/g, "'");

              pre.value = pre.value.replace(
                nodeLabel,
                `${nodeId}("${sanitizedUserInput}")`
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

          const edgeDefinition = pre.value.match(edgeDefinitionRegExp);

          if (!edgeDefinition) continue;
          const [_, nodeStart, edge, nodeEnd] = edgeDefinition;

          if (!nodeStart || !edge || !nodeEnd) continue;

          edgeLabel.addEventListener("click", async () => {
            const { edge: newEdge } = await $fetch("/api/new-edge", {
              body: {
                // replace $2 with 🤖
                code: pre.value.replace(
                  edgeDefinitionRegExp,
                  `${nodeStart} -->|"🤖"| ${nodeEnd}`
                ),
              },
              method: "POST",
            });

            pre.value = pre.value.replace(
              edgeDefinitionRegExp,
              `${nodeStart} -->|"${newEdge}"| ${nodeEnd}`
            );
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

// onMounted(() => {
//   initEditor(monaco);
// });
</script>

<template>
  <div class="flex h-full grow">
    <!-- <div
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
    </div> -->

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
