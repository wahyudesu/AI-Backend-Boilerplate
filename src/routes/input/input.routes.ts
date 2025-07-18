import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { InputSchema, OutputSchema } from "./input.schema";

const tags = ["Input"];

export const processText = createRoute({
  method: "post",
  path: "/input",
  tags,
  request: {
    body: jsonContentRequired(InputSchema, "The text to process"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      OutputSchema,
      "The processed text",
    ),
  },
});

export type ProcessTextRoute = typeof processText;
