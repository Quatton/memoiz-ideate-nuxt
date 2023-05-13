import { type MermaidConfig } from "mermaid";
import { defineStore } from "pinia";

type EditorState = {
  code: string;
  config: MermaidConfig;
  svg: string;
};

export const useEditorStore = defineStore("editor", {
  state: () => ({
    code: "",
    config: {
      startOnLoad: true,
      securityLevel: "loose",
      theme: "default",
    },
    svg: "",
  }),
});
