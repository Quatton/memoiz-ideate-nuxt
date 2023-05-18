export function preprocess(
  code: string,
  currentNodeId: string,
  nextNodeId: string
): string {
  const currentNodeLabel = getNodeLabel(code, currentNodeId);
  const nextNodeLabel = getNodeLabel(code, nextNodeId);

  return `### SYSTEM-GENERATED PREPROCESS ###
<CurrentNode>${currentNodeId}("${currentNodeLabel}")</CurrentNode>
<NextNode>${nextNodeId}("${nextNodeLabel}")</NextNode>
<GenerationTarget replace="🤖">${currentNodeId}("${currentNodeLabel}") -->|"🤖"| ${nextNodeId}("${nextNodeLabel}")</GenerationTarget>
<CurrentChainOfThoughts>
${traceChain(code, currentNodeId)}
</CurrentChainOfThoughts>
<ExistingIdeas>${getExistingIdeas(code, currentNodeId)
    .map((idea) => `"${idea}"`)
    .join(", ")}</ExistingIdeas>`;
}

function getNodeLabel(code: string, nodeId: string): string {
  // Pattern: ${nodeId}("label")
  const pattern = new RegExp(`${nodeId}\\("(.*)"\\)`);

  const match = code.match(pattern);

  try {
    return match![1]!;
  } catch (error) {
    return "";
  }
}

function getPreviousNode(
  code: string,
  currentNodeId: string
): {
  previousNodeId: string;
  edge: string | undefined;
} | null {
  // Pattern: previousNodeId("label") -->|"edge"| ${currentNodeId}("label")
  const pattern = new RegExp(
    `(\\w+)(?:\\(".*"\\))?\\s?-->\\|"(.*?)"\\|\\s?${currentNodeId}\\(".*"\\)`
  );

  const match = code.match(pattern);
  try {
    return {
      previousNodeId: match![1]!,
      edge: match![2] || undefined,
    };
  } catch (error) {
    return null;
  }
}

function traceChain(
  code: string,
  endId: string,
  startId = "goal"
): string | null {
  const endLabel = getNodeLabel(code, endId);
  const chain: { id: string; label: string; edge?: string }[] = [
    { id: endId, label: endLabel },
  ];

  while (chain[0].id !== startId) {
    const previousId = getPreviousNode(code, chain[0].id);
    if (previousId === null) {
      return null;
    }
    const { previousNodeId, edge } = previousId;
    chain.unshift({
      id: previousNodeId,
      label: getNodeLabel(code, previousNodeId),
      edge,
    });
  }

  return chain
    .map((node) => {
      let result = `${node.id}("${node.label}")`;
      if (node.edge) {
        result += ` -->|"${node.edge}"|`;
      }
      return result;
    })
    .join(" ");
}

function getExistingIdeas(code: string, currentNodeId: string): string[] {
  // get every currentNodeId("optional_label") -->|"capture this"| nextNodeId("optional_label")
  const pattern = new RegExp(
    `${currentNodeId}(?:\\(".*"\\))?\\s?-->\\|"(.*?)"\\|\\s?\\w+(?:\\(".*"\\))?`,
    "g"
  );

  const matches = code.matchAll(pattern);

  const existingIdeas: string[] = [];

  for (const match of matches) {
    if (match[1] !== "🤖") existingIdeas.push(match[1]);
  }

  return existingIdeas;
}
