export default defineEventHandler(async (event) => {
  const { code } = await readBody(event);

  const candidates = ["Why?", "Elaborate", "How?"];

  const sampled = candidates[Math.floor(Math.random() * candidates.length)];

  return {
    edge: sampled,
  };
});
