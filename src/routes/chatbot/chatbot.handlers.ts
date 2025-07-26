import type { AppRouteHandler } from "@/lib/types";
import type { ProcessTextRoute } from "./chatbot.routes";
import { groq } from "@ai-sdk/groq";
import { generateText } from 'ai';

export const processText: AppRouteHandler<ProcessTextRoute> = async (c) => {
  const { text } = c.req.valid("json");
  const result = await generateText({
    model: groq('gemma2-9b-it'),
    prompt: text,
  });
  return c.json({ text: result.text });
};