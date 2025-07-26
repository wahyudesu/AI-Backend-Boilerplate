import type { AppRouteHandler } from "@/lib/types";
import type { ProcessTextRoute } from "./agents.routes";
import { groq } from '@ai-sdk/groq';
// import { createGroq } from "@ai-sdk/groq";
import { generateText } from 'ai';
import { Agent, createTool, Mastra } from '@mastra/core';
import { z } from 'zod';

const copywriterAgent = new Agent({
  name: 'Copywriter',
  instructions: 'You are a copywriter agent that writes blog post copy.',
  model: groq('gemma2-9b-it'),
});

const copywriterTool = createTool({
  id: 'copywriter-agent',
  description: 'Calls the copywriter agent to write blog post copy.',
  inputSchema: z.object({
    topic: z.string().describe('Blog post topic'),
  }),
  outputSchema: z.object({
    copy: z.string().describe('Blog post copy'),
  }),
  execute: async ({ context }) => {
    const result = await copywriterAgent.generate(`Create a blog post about ${context.topic}`);
    console.log('copywriter result', result.text);
    return {
      copy: result.text,
    };
  },
});

const editorAgent = new Agent({
  name: 'Editor',
  instructions: 'You are an editor agent that edits blog post copy.',
  model: groq('gemma2-9b-it'),
});

const editorTool = createTool({
  id: 'editor-agent',
  description: 'Calls the editor agent to edit blog post copy.',
  inputSchema: z.object({
    copy: z.string().describe('Blog post copy'),
  }),
  outputSchema: z.object({
    copy: z.string().describe('Edited blog post copy'),
  }),
  execute: async ({ context }) => {
    const result = await editorAgent.generate(
      `Edit the following blog post only returning the edited copy: ${context.copy}`,
    );
    console.log('editor result', result.text);
    return {
      copy: result.text,
    };
  },
});

const publisherAgent = new Agent({
  name: 'publisherAgent',
  instructions:
    'You are a publisher agent that first calls the copywriter agent to write blog post copy about a specific topic and then calls the editor agent to edit the copy. Just return the final edited copy.',
  model: groq('gemma2-9b-it'),
  tools: { copywriterTool, editorTool },
});

const mastra = new Mastra({
  agents: { publisherAgent },
});

export const processText: AppRouteHandler<ProcessTextRoute> = async (c) => {
  const { text } = c.req.valid("json");
  const agent = mastra.getAgent('publisherAgent');

  const result = await agent.generate(text);
  // OutputSchema expects { text: string }
  return c.json({ text: result.text });
};