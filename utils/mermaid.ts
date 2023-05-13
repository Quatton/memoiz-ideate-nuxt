// Modified from https://github.com/mermaid-js/mermaid-live-editor/blob/develop/src/lib/util/mermaid.ts

import mermaid from "mermaid";
import type { MermaidConfig, RenderResult } from "mermaid";

export const render = async (
  config: MermaidConfig,
  code: string,
  id: string
): Promise<RenderResult> => {
  // Should be able to call this multiple times without any issues.
  mermaid.initialize(config);
  return await mermaid.render(id, code);
};

export const parse = async (code: string): Promise<unknown> => {
  return await mermaid.parse(code);
};
