/* eslint-disable no-console */
import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";
import { preprocess } from "../utils/preprocessor";

const prompt = `### Task ###
Replace the 🤖 emoji in the flowchart with a thought-provoking question that is related to the node connecting to it.

VALID questions:
1. This or That
2. Suggestion (Have you ever tried XYZ? What do you think about ABC?)
3. Use "Phrase + ..." if you cannot ask a question (which is..., but..., then..., in other words,...)
4. Ask for confirmation if the user is making a risky decision or stated information that is either factually wrong, immoral, illegal or harmful. (Are you sure about that? Have you thought about the consequence of that?)
5. Ask for clarification if the user is making a vague statement. (What do you mean by that? Can you elaborate on that?)

Your example should be in this format:

Candidates:
1. Question Candidate 1
2. Question Candidate 2
3. Question Candidate 3
4. Question Candidate 4
5. Question Candidate 5

Best Question:`;

// const exampleCode = `You will be interacting with an example user for training. You will forget about this example in the next interaction.

// flowchart TD
//     goal("I lost my wallet. There are many places it could be.")
//     goal -->|"Did you search where you normally put it?"| node1("I usually have a basket for small objects like watches, wallet, and my phone charger")
//     goal -->|"Have you checked your house, car, and office?"| node2("Yes I did!")
//     goal -->|"Where did you last remember having your wallet?"| node3("It was in my pocket")
//     node2 -->|"Did you retrace your steps?"| node4("No, I did not...")
//     node4 -->|"Did you check other places where you might have left it?"| node5("If it's not here, it has to be at my school")
//     node1 -->|"Did you see someone take your wallet?"| node6("No I did not!")
//     node6 -->|"What was the last thing you did with your wallet?"| node7("I paid my lunch at the cafeteria")
//     node5 -->|"🤖"| node8("✏️")
//     node5 -->|"Did you ask your friend if they have seen it?"| node9("Yes I did!")
//     node5 -->|"Did you report to the police?"| node10("I think it's too early. What if I just left it in my locker at school?")`;

// const exampleAnswer = `
// Candidates:
// 1. Did you report to the authorities?
// 2. Did you check the lost and found?
// 3. Did your brother have a wallet?
// 4. Do you think someone might have taken your wallet?
// 5. What did you buy for your lunch?

// Best Question: Did you check the lost and found?`;

const inputSchema = z.object({
  code: z.string(),
  currentNodeId: z.string(),
  nextNodeId: z.string(),
});

export default defineEventHandler(async (event) => {
  const input = await readBody(event);

  const parsedInput = inputSchema.safeParse(input);

  if (!parsedInput.success) {
    return { edge: "Try again" };
  }

  const { code, currentNodeId, nextNodeId } = parsedInput.data;

  const runtimeConfig = useRuntimeConfig();

  const configuration = new Configuration({
    apiKey: runtimeConfig.openaiApiKey,
  });

  const openAi = new OpenAIApi(configuration);

  // const examplePreprocessedCode = preprocess(
  //   exampleCode.replace(/\\n/g, " "),
  //   "node5",
  //   "node8"
  // );

  const preprocessedCode = preprocess(
    code.replace(/\\n/g, " "),
    currentNodeId,
    nextNodeId
  );

  console.log(code);
  console.log(preprocessedCode);

  const res = await openAi
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt },
        // {
        //   role: "user",
        //   content: exampleCode,
        // },
        // { role: "system", content: examplePreprocessedCode },
        // { role: "assistant", content: exampleAnswer.replace(/\\n/g, " ") },
        { role: "user", content: code.replace(/\\n/g, " ") },
        { role: "system", content: preprocessedCode },
      ],
      max_tokens: 300,
      frequency_penalty: 0.5,
      presence_penalty: 0,
      top_p: 0.6,
      user: "flowchart",
    })
    .catch((e) => {
      console.error(e);
      return null;
    });

  if (res === null || res.status !== 200) {
    return { edge: "Try again" };
  }

  console.log(
    "TOKENS:",
    res.data.usage?.prompt_tokens,
    ",",
    res.data.usage?.completion_tokens
  );

  const completion = res.data.choices[0].message?.content;

  console.log(completion);

  const question = completion?.match(/Question:\s(.*)/)?.[1];

  if (!question) {
    return { edge: "Why?" };
  }

  return {
    edge: "✨" + question,
  };
});

// const res = await fetch(
//     "https://api.ai21.com/studio/v1/j2-jumbo-instruct/complete",
//     {
//       headers: {
//         Authorization: `Bearer ${runtimeConfig.ai21ApiKey}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         prompt: prompt2(code),
//         numResults: 1,
//         maxTokens: 250,
//         temperature: 0.7,
//         topKReturn: 0,
//         topP: 1,
//         countPenalty: {
//           scale: 0.37,
//           applyToNumbers: false,
//           applyToPunctuations: false,
//           applyToStopwords: false,
//           applyToWhitespaces: false,
//           applyToEmojis: false,
//         },
//         frequencyPenalty: {
//           scale: 400,
//           applyToNumbers: false,
//           applyToPunctuations: false,
//           applyToStopwords: false,
//           applyToWhitespaces: false,
//           applyToEmojis: false,
//         },
//         presencePenalty: {
//           scale: 3.5,
//           applyToNumbers: false,
//           applyToPunctuations: false,
//           applyToStopwords: false,
//           applyToWhitespaces: false,
//           applyToEmojis: false,
//         },
//         stopSequences: ["##"],
//       }),
//       method: "POST",
//     }
//   ).then((res) => res.json());const res = await fetch(
//     "https://api.ai21.com/studio/v1/j2-jumbo-instruct/complete",
//     {
//       headers: {
//         Authorization: `Bearer ${runtimeConfig.ai21ApiKey}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         prompt: prompt2(code),
//         numResults: 1,
//         maxTokens: 250,
//         temperature: 0.7,
//         topKReturn: 0,
//         topP: 1,
//         countPenalty: {
//           scale: 0.37,
//           applyToNumbers: false,
//           applyToPunctuations: false,
//           applyToStopwords: false,
//           applyToWhitespaces: false,
//           applyToEmojis: false,
//         },
//         frequencyPenalty: {
//           scale: 400,
//           applyToNumbers: false,
//           applyToPunctuations: false,
//           applyToStopwords: false,
//           applyToWhitespaces: false,
//           applyToEmojis: false,
//         },
//         presencePenalty: {
//           scale: 3.5,
//           applyToNumbers: false,
//           applyToPunctuations: false,
//           applyToStopwords: false,
//           applyToWhitespaces: false,
//           applyToEmojis: false,
//         },
//         stopSequences: ["##"],
//       }),
//       method: "POST",
//     }
//   ).then((res) => res.json());
