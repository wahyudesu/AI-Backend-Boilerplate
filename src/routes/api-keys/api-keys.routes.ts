import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { DeleteResponseSchema, NotFoundSchema } from "@/lib/constants";

import { ApiKeySchema, CreateApiKeySchema, IdParamSchema } from "./api-keys.schema";

// UserId parameter schema for filtering by user
export const UserIdParamSchema = z.object({
  userId: z
    .string()
    .min(24)
    .openapi({
      param: {
        name: "userId",
        in: "path",
      },
      example: "00b4766213f0732810a29d8a",
    }),
});

const tags = ["API Keys"];
export const list = createRoute({
  path: "/api-keys",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(ApiKeySchema),
      "The List of API Keys",
    ),
  },
});

export const create = createRoute({
  path: "/api-keys",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      CreateApiKeySchema,
      "The API Key to Create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      ApiKeySchema,
      "The Created API Key",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(CreateApiKeySchema),
      "The Validation Errors",
    ),
  },
});

export const getOne = createRoute({
  path: "/api-keys/{id}",
  method: "get",
  request: {
    params: IdParamSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      ApiKeySchema,
      "The requested API Key",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      IdParamSchema,
      "Invalid Id Error",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundSchema,
      "API Key Not Found",
    ),
  },
});

export const remove = createRoute({
  path: "/api-keys/{id}",
  method: "delete",
  request: {
    params: IdParamSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      DeleteResponseSchema,
      "API Key Deleted",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      IdParamSchema,
      "Invalid Id Error",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundSchema,
      "API Key Not Found",
    ),
  },
});

export const listByUserId = createRoute({
  path: "/users/{userId}/api-keys",
  method: "get",
  request: {
    params: UserIdParamSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(ApiKeySchema),
      "The List of API Keys for the specified User",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type RemoveRoute = typeof remove;
export type ListByUserIdRoute = typeof listByUserId;
