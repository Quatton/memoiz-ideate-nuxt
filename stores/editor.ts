import { type MermaidConfig } from "mermaid";
import { defineStore } from "pinia";

export const useEditorStore = defineStore("editor", () => {
  const code = ref("");
  const staleSvg = ref("");

  const colorMode = useColorMode();

  const config = computed(() => {
    const theme = colorMode.value === "dark" ? "dark" : "default";
    return {
      theme,
      startOnLoad: false,
      securityLevel: "antiscript",
    } satisfies MermaidConfig;
  });

  watch(code, () => {
    console.log(code);
  });

  // Let's implement useAsyncData on our own
  const error = ref<Error | null>(null)
  const pending = ref<boolean>(false)

  watch(code, () => {
    pending.value = true
    render(config.value, code.value.trim(), "mermaid")
    .then(({ svg }) => {
      error.value = null
      pending.value = false
      staleSvg.value = svg
    }).catch(error => {
      error.value = error
      pending.value = false
    })
  })

  return { code, staleSvg, error, pending };
});
