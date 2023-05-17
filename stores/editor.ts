import { type MermaidConfig } from "mermaid";
import { defineStore } from "pinia";

type SetCode = ((code: string) => string) | string

export const useEditorStore = defineStore("editor", () => {
  const code = ref("");

  const colorMode = useColorMode();

  const config = ref<MermaidConfig>({
    theme: colorMode.value === "dark" ? "dark" : "default",
    securityLevel: "antiscript",
  });

  return { code };
});
