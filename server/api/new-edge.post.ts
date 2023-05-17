import { Configuration, OpenAIApi } from "openai";

const prompt = (code: string) => `Task:
Replace the 🤖 emoji with a thought-provoking question that is related to the node connecting to it.

Strategy (Generate JSON in this order):
1. Generate previous_node.
2. Generate existing_edges.
3. Generate a new question that doesn't repeat the existing edges or relate to other branches of the flowchart.
4. Use \\n to make a new line if it's too long.

Allowed questions:
1. This or That (Yes/No is not allowed)
2. Suggestion (Have you ever tried XYZ? What do you think about ABC?)
3. Use "Phrase + ..." if you cannot ask a question (which is..., but..., then..., in other words,...)
4. Ask for confirmation if the user is making a risky decision or stated information that is either factually wrong, immoral, illegal or harmful. (Are you sure about that? Have you thought about the consequence of that?)
 
Code:
flowchart TD
    goal("I don't know what to do in my life")
    goal -->|"Do you mean your career or hobbies?"| node1("Career")
    node1 -->|"What do you think you are good at?"| node2("Writing codes")
    node2 -->|"🤖"| node3("✏️")

JSON: {"previous_node": "node2('Writing codes')", "existing_edges": [], "question": "What kinds of projects have you done?"}

##

Task:
Replace the 🤖 emoji with a thought-provoking question that is related to the node connecting to it.

Allowed questions:
1. This or That (Yes/No is not allowed)
2. Suggestion (Have you ever tried XYZ? What do you think about ABC?)
3. Use "Phrase + ..." if you cannot ask a question (which is..., but..., then..., in other words,...)
4. Ask for confirmation if the user is making a risky decision or stated information that is either factually wrong, immoral, illegal or harmful. (Are you sure about that? Have you thought about the consequence of that?)

Code:
flowchart TD
    goal("I have to research about mangoes")
    goal -->|"Types of mangoes"| node1("Good mango and bad mango")
    node2 -->|"Are you sure about that?"| node3("Sorry, I actually don't know")
    node3 -->|"Have you tried Googling?"| node4("Google told me there are honey, francis, haden, and etc")
    goal -->|"Benefits of mangoes"| node5("It's tasty")
    node5 -->|"and..."| node6("It has vitamins")
    goal -->|"Scientific aspects of mangoes"| node7("I have no ideas what to write about that")
    node7 -->|"Scientific name"| node8("Mangifera indica")
    node7 -->|"Pigments of mango peels"| node9("Carotenoids and Polyphenols")
    node8 -->|"What do you think indica means?"| node10("Probably something to do with India?\nSouth Asia and Southeast Asia\ncultivates a lot of mangoes")
    node7 -->|"🤖"| node10("✏️")

JSON: {"previous_node": "node7('I have no ideas what to write about that')", "existing_edges": ["Scientific name", "Pigments of mango peels"], "question": "Average height of a mango tree"}

##

Code:
${code}

JSON:`;

const prompt2 = (code: string) => `Task:
Replace the 🤖 emoji with a thought-provoking question that is related to the node connecting to it.

Strategy: 
1. Identify "current_node" with the 🤖 emoji.
2. Identify "previous_nodes" with the edge connecting to the current_node. We do this to gain context of the current chain of thoughts.
3. Identify "existing_branches" with the edges connecting to the current_node. We do this to avoid asking the same question again.
4. Generate 3 question "candidates" with the existing_branches and previous_nodes.
5. Pick one "question" based on the following criteria:
- The question candidate is not in existing_branches.
- The question candidate is not in previous_nodes.
- The question candidate is the most unique, thought-provoking, and relevant to the current_node.
6. Generate JSON in this format: {"current_node": "", "previous_nodes":[],"existing_branches":[],"candidates":[],"question":""}

Allowed questions:
1. This or That (Yes/No is not allowed)
2. Suggestion (Have you ever tried XYZ? What do you think about ABC?)
3. Use "Phrase + ..." if you cannot ask a question (which is..., but..., then..., in other words,...)
4. Ask for confirmation if the user is making a risky decision or stated information that is either factually wrong, immoral, illegal or harmful. (Are you sure about that? Have you thought about the consequence of that?)
 
Code:
flowchart TD
    goal("I lost my wallet. There are many places it could be.")
    goal -->|"Did you search where you normally put it?"| node1("I usually have a basket for small objects like watches, wallet, and my phone charger")
    goal -->|"Have you checked your house, car, and office?"| node2("Yes I did!")
    goal -->|"Where did you last remember having your wallet?"| node3("It was in my pocket")
    node2 -->|"Did you retrace your steps?"| node4("No, I did not...")
    node4 -->|"Did you check other places where you might have left it?"| node5("If it's not here, it has to be at my school")
    node1 -->|"Did you see someone take your wallet?"| node6("No I did not!")
    node6 -->|"What was the last thing you did with your wallet?"| node7("I paid my lunch at the cafeteria")
    node5 -->|"Did you report to the police?"| node8("I think it's too early. What if I just left it in my locker at school?")
    node5 -->|"Did you ask your friend if they have seen it?"| node9("Yes I did!")
    node5 -->|"🤖"| node10("✏️")

JSON: {"current_node": "node5(\\"If it's not here, it has to be at my school\\")", "previous_nodes":["goal(\\"I lost my wallet. There are many places it could be.\\")","edge(\\"Have you checked your house, car, and office?\\")","node2(\\"Yes I did!\\")","edge(\\"Did you retrace your steps?\\")","node4(\\"No, I did not...\\")","edge(\\"Did you check other places where you might have left it?\\")"],"existing_branches":["Did you report to the police?","Did you ask your friend if they have seen it?"],"candidates":["Which class did you lose it in?","Did you check the lost and found?","Did you check the library?"],"question":"Did you check the lost and found?"}

##

Code:
${code}

JSON:`;

const prompt3 = `###Task###
Replace the 🤖 emoji in the flowchart with a thought-provoking question that is related to the node connecting to it.

Allowed questions:
1. This or That
2. Suggestion (Have you ever tried XYZ? What do you think about ABC?)
3. Use "Phrase + ..." if you cannot ask a question (which is..., but..., then..., in other words,...)
4. Ask for confirmation if the user is making a risky decision or stated information that is either factually wrong, immoral, illegal or harmful. (Are you sure about that? Have you thought about the consequence of that?)
5. Ask for clarification if the user is making a vague statement. (What do you mean by that? Can you elaborate on that?)

Not allowed questions:
1. Yes/No questions
2. Questions that are not related to the node connecting to it
3. Questions that are already asked before
4. Questions that are related to the node in another branch

Trace the flowchart ONCE to 
`;

const exampleCode = `flowchart TD
goal("I lost my wallet. There are many places it could be.")
goal -->|"Did you search where you normally put it?"| node1("I usually have a basket for small objects like watches, wallet, and my phone charger")
goal -->|"Have you checked your house, car, and office?"| node2("Yes I did!")
goal -->|"Where did you last remember having your wallet?"| node3("It was in my pocket")
node2 -->|"Did you retrace your steps?"| node4("No, I did not...")
node4 -->|"Did you check other places where you might have left it?"| node5("If it's not here, it has to be at my school")
node1 -->|"Did you see someone take your wallet?"| node6("No I did not!")
node6 -->|"What was the last thing you did with your wallet?"| node7("I paid my lunch at the cafeteria")
node5 -->|"🤖"| node8("✏️")
node5 -->|"Did you ask your friend if they have seen it?"| node9("Yes I did!")
node5 -->|"Did you report to the police?"| node10("I think it's too early. What if I just left it in my locker at school?")`;

const exampleAnswer = `[START]
<pattern>current_node -->|"label"| next_node</pattern>
<find-exact>node5 -->|"🤖"| node8("✏️")</find-exact>
<identify>current_node = node5, current_node_text = "If it's not here, it has to be at my school", next_node = node8, next_node_text = "✏️"</identify>
<trace start="node5" stop-on-goal="true" reverse=true trace-count={1}>
node5 -->|"🤖"| node8("✏️")
node4 -->|"Did you check other places where you might have left it?"| node5("If it's not here, it has to be at my school")
node2 -->|"Did you retrace your steps?"| node4("No, I did not...")
goal -->|"Have you checked your house, car, and office?"| node2("Yes I did!")
</trace>
<existing-ideas from-current-node="node5" strictness="refer-to-flowchart-only" fallback-if-none="(none)">
node5 -->|"Did you ask your friend if they have seen it?"| node9("Yes I did!")
node5 -->|"Did you report to the police?"| node10("I think it's too early. What if I just left it in my locker at school?")
</existing-ideas>
<candidates from-current-node="node5" label="If it's not here, it has to be at my school">
<candidate>"Which class did you lose it in?"</candidate>
<candidate>Did you check the lost and found?"</candidate>
<candidate>"Did you ask your friend if they have it?" (is already mentioned in existing_ideas)</candidate>
<candidate>"Did you check the library?"</candidate>
<candidate>"What was the last thing you did with your wallet?" (is already mentioned in node6 --> node7 which is in another branch of the flowchart)</candidate>
</candidates>
<criteria>
it is related to the node connecting to it.
it is not already mentioned in existing_ideas.
it is not already mentioned in another branch of the flowchart.
it is a question that is most likely to lead to a solution.
</criteria>
<best-question count={1}>Did you check the lost and found?</best-question>
[END]`;

export default defineEventHandler(async (event) => {
  const { code } = await readBody(event);
  const runtimeConfig = useRuntimeConfig();

  const configuration = new Configuration({
    apiKey: runtimeConfig.openaiApiKey,
  });

  const openAi = new OpenAIApi(configuration);

  console.log(code);

  const res = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: prompt3 },
      { role: "user", content: exampleCode },
      { role: "assistant", content: exampleAnswer },
      { role: "user", content: code.replace(/\\n/g, "") },
    ],
    max_tokens: 800,
    frequency_penalty: 0.5,
    presence_penalty: 0,
    top_p: 0.7,
    user: "flowchart",
    stop: ["[END]"],
  });

  const completion = res.data.choices[0].message?.content;

  console.log(completion);

  if (res.status !== 200 || !completion) {
    return { edge: "Try again" };
  }

  const finalAnswer = completion.match(
    /<best-question count=\{1\}>(.*)<\/best-question>/
  )?.[1];

  const candidates = ["Why?", "How?", "Please elaborate"];

  if (!finalAnswer) {
    return { edge: candidates[Math.floor(Math.random() * candidates.length)] };
  }
  console.log(finalAnswer);

  return { edge: finalAnswer };
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
