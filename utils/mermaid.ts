// Modified from https://github.com/mermaid-js/mermaid-live-editor/blob/develop/src/lib/util/mermaid.ts

import mermaid from "mermaid";
import type { MermaidConfig } from "mermaid";

export const render = async (
  config: MermaidConfig,
  code: string,
  id: string
) => {
  // Should be able to call this multiple times without any issues.
  mermaid.initialize(config);
  return await mermaid.render(id, code);
};

export const parse = async (code: string): Promise<unknown> => {
  return await mermaid.parse(code);
};

/**
 * Usage:
 * ```ts
 * const text = "This is a very long text that should be wrapped";
 * const maxCharacter = 10;
 * const wrappedText = autoTextWrap(text, maxCharacter);
 * console.log(wrappedText);
 * // This is a
 * // very long
 * // text that
 * // should be
 * // wrapped
 * ```
 */
export const autoTextWrap = (text: string, maxCharacter: number): string => {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";
  for (const word of words) {
    if (currentLine.length + word.length > maxCharacter) {
      lines.push(currentLine);
      currentLine = "";
    }
    currentLine += word + " ";
  }
  lines.push(currentLine.trim());
  return lines.join("\\n");
};
