<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useMouse, useWindowScroll } from "@vueuse/core";
import { useEditorStore } from "@/stores/editor";

const originalValue = `flowchart TD\n\tgoal("Enter your problem here")`;

const store = useEditorStore();
const { code, staleSvg } = storeToRefs(store);

const { x, y } = useMouse();
const { y: windowY } = useWindowScroll();

const isOpen = ref(false);
const virtualElement = ref({ getBoundingClientRect: () => ({}) });

watch(
  [staleSvg],
  () => {
    if (staleSvg.value) {
      const nodes = document.querySelector("g.nodes");

      (() => {
        if (!nodes) return;
        const length = nodes.children.length;
        for (let i = 0; i < length; i++) {
          const node = nodes.children.item(i);
          if (!node) break;
          const nodeId = node.id.match(/^flowchart-(\w+)-\d+$/)?.at(1);

          const nodeLabel = new RegExp(`${nodeId}\\("(.+)"\\)|${nodeId}`);
          const matchingGroup = code.value.match(nodeLabel); // Find the matching group
          if (!nodeId) continue;
          node.addEventListener("click", () => {
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
          node.addEventListener("contextmenu", (event: Event) => {
            event.preventDefault(); // Prevent the default right-click action

            const top = unref(y) - unref(windowY);
            const left = unref(x);

            virtualElement.value = {
              getBoundingClientRect: () => ({
                top,
                left,
                width: 0,
                height: 0,
              }),
            };

            isOpen.value = true;

            // const { edge: label } = await $fetch("/api/new-edge", {
            //   body: {
            //     code:
            //       code.value + `\n\t${nodeId} -->|"🤖"| node${length}("✏️")`,
            //   },
            //   method: "POST",
            // });

            // const newEdge = `\n\t${nodeId} -->|"${label}"| node${length}("✏️")`;

            // code.value += `\n\t${nodeId} -->|"🤖"| node${length}("✏️")`;
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

          edgeLabel.addEventListener("click", () => {
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

          edgeLabel.addEventListener("contextmenu", async (event) => {
            event.preventDefault(); // Prevent the default right-click action
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
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyboardEvent, false);
});
</script>

<template>
  <UContextMenu v-model="isOpen" :virtual-element="virtualElement">
    <h1>Hey</h1>
  </UContextMenu>
  <div
    :class="
      cn([
        'max-h-full grow overflow-y-auto p-4',
        'border-gray-300 bg-gray-100 text-gray-900',
        'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200',
      ])
    "
    v-html="staleSvg"
  />
</template>

<style scoped></style>
