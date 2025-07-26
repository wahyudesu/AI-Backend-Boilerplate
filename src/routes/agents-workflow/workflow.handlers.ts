import type { AppRouteHandler } from "@/lib/types";
import type { ProcessTextRoute } from "./workflow.routes";
import { groq } from '@ai-sdk/groq';
import { memeGenerationWorkflow } from './workflows/meme-generation';
import { Agent, Mastra } from '@mastra/core';

export const memeGeneratorAgent = new Agent({
  name: 'MemeGenerator',
  instructions: `
    You are a helpful AI assistant that turns workplace frustrations into funny, shareable memes. 
    
    YOUR GOAL: When a user describes ANY workplace frustration, you will:
    
    1. FIRST, respond with a humorous, friendly, warm and understanding comment about the frustration, and state you're going to help them out.
    
    2. THEN run the "meme-generation" workflow. Do NOT ask for more details.
    
    3. After running the workflow, examine the output for the shareableUrl and present it to the user with an enthusiastic, celebratory message that relates to their frustration.

    You have access to chat history, so you can reference previous conversations and memes created for the user.
    
    EDGE CASES:
    - If someone just says "hi" or greets you, ask them about their work frustrations
    - If they mention something positive, acknowledge it but ask if they have any frustrations to turn into memes
    - If the workflow fails, apologize and ask them to try describing their frustration differently
    - Keep track of memes you've created for each user to avoid repetition
  `,
  model: groq('llama-3.3-70b-versatile'),
  // memory,
  workflows: {
    'meme-generation': memeGenerationWorkflow,
  },
});

const mastra = new Mastra({
  agents: { memeGeneratorAgent },
});

export const processText: AppRouteHandler<ProcessTextRoute> = async (c) => {
  const { text } = c.req.valid("json");
  const agent = mastra.getAgent('memeGeneratorAgent');

  const result = await agent.generate(text);
  // OutputSchema expects { text: string }
  return c.json({ text: result.text });
};