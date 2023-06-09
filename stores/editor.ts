import { type MermaidConfig } from "mermaid";
import { acceptHMRUpdate, defineStore } from "pinia";

const defaultMermaidConfig: MermaidConfig = {
  startOnLoad: false,
  securityLevel: "antiscript",
};

export const useEditorStore = defineStore("editor", () => {
  const code = ref("");
  const staleSvg = ref("");

  const colorMode = useColorMode();

  const config = computed(() => {
    const theme = colorMode.value === "dark" ? "dark" : "default";
    return {
      ...defaultMermaidConfig,
      theme,
    } satisfies MermaidConfig;
  });

  // Let's implement useAsyncData on our own
  const error = ref<Error | null>(null);
  const pending = ref<boolean>(false);

  watch([code, config], async () => {
    pending.value = true;
    const e = await parse(code.value.trim());
    if (e) {
      error.value = e;
      pending.value = false;
      return;
    }
    const { svg } = await render(config.value, code.value.trim(), "mermaid");
    error.value = null;
    pending.value = false;
    staleSvg.value = svg;
  });

  return { code, staleSvg, error, pending };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEditorStore, import.meta.hot));
}
