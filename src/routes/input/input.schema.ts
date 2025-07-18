import { z } from "zod";

export const InputSchema = z.object({
  text: z.string().min(1, "Input text cannot be empty"),
});

export const OutputSchema = z.object({
  text: z.string(),
});

export type Input = z.infer<typeof InputSchema>;
