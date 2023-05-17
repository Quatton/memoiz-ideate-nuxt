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

const originalValue = `flowchart TD
\tgoal("(Enter your problem here)")`;
const code = ref(originalValue);

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
      code.value.trim(),
      "mermaid"
    );
    return svg;
  },
  {
    watch: [code, colorMode],
  }
);

watch(
  [svg, error, pending],
  () => {
    if (svg.value && !error.value && !pending.value) {
      const nodes = document.querySelector("g.nodes");

      (() => {
        if (!nodes) return;
        const length = nodes.children.length;
        for (const node of nodes.children) {
          const nodeId = node.id.match(/^flowchart-(\w+)-\d+$/)?.at(1);

          const nodeLabel = new RegExp(`${nodeId}\\(".+"\\)|${nodeId}`);
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
              matchingGroup.at(1) || ""
            ); // Prompt the user for input

            if (userInput) {
              const sanitizedUserInput = userInput.replace(/"/g, "'");

              code.value = code.value.replace(
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
              },
              method: "POST",
            });

            code.value = code.value.replace(
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

const handleKeyboardEvent = (ev: KeyboardEvent) => {
  ev.preventDefault();
  if (ev.ctrlKey && ev.key === "r") {
    code.value = originalValue;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyboardEvent, false);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyboardEvent, false);
});
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
          'max-h-full grow p-4',
          'border-zinc-300 bg-zinc-100 text-zinc-900',
          'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200',
        ])
      "
      v-html="pending ? 'Loading...' : error ? error.message : svg"
    />
  </div>
</template>

<style scoped></style>
