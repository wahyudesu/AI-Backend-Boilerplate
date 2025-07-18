import type { AppRouteHandler } from "@/lib/types";
import type { ProcessTextRoute } from "./input.routes";

export const processText: AppRouteHandler<ProcessTextRoute> = async (c) => {
  const { text } = c.req.valid("json");
  const processedText = text.toUpperCase();
  return c.json({ text: processedText });
};