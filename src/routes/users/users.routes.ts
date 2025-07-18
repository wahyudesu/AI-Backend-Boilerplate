import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentOneOf, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { DeleteResponseSchema, NotFoundSchema } from "@/lib/constants";

import { CreateUserSchema, IdParamSchema, UpdateUserSchema, UserSchema } from "./users.schema";

// OrgId parameter schema for filtering by organization
export const OrgIdParamSchema = z.object({
  orgId: z
    .string()
    .min(24)
    .openapi({
      param: {
        name: "orgId",
        in: "path",
      },
      example: "00b4766213f0732810a29d8a",
    }),
});

const tags = ["Users"];
export const list = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(UserSchema),
      "The List of Users",
    ),
  },
});

export const create = createRoute({
  path: "/users",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      CreateUserSchema,
      "The User to Create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserSchema,
      "The Created User",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(CreateUserSchema),
      "The Validation Errors",
    ),
  },
});

export const getOne = createRoute({
  path: "/users/{id}",
  method: "get",
  request: {
    params: IdParamSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserSchema,
      "The requested User",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      IdParamSchema,
      "Invalid Id Error",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundSchema,
      "User Not Found",
    ),
  },
});

export const update = createRoute({
  path: "/users/{id}",
  method: "patch",
  tags,
  request: {
    params: IdParamSchema,
    body: jsonContentRequired(
      UpdateUserSchema,
      "The User Updates",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UserSchema,
      "The updated User",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundSchema,
      "User Not Found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [createErrorSchema(UpdateUserSchema), createErrorSchema(IdParamSchema)],
      "The Validation Errors",
    ),
  },
});

export const remove = createRoute({
  path: "/users/{id}",
  method: "delete",
  request: {
    params: IdParamSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      DeleteResponseSchema,
      "User Deleted",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      IdParamSchema,
      "Invalid Id Error",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundSchema,
      "User Not Found",
    ),
  },
});
export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
