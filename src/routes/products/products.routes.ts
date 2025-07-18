import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentOneOf, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { DeleteResponseSchema, NotFoundSchema } from "@/lib/constants";

import { CreateProductSchema, IdParamSchema, ProductQuerySchema, ProductSchema, UpdateProductSchema, UserIdParamSchema } from "./products.schema";

const tags = ["Products"];
export const list = createRoute({
  path: "/products",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(ProductSchema),
      "The List of Products",
    ),
  },
});

export const create = createRoute({
  path: "/products",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      CreateProductSchema,
      "The Product to Create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      ProductSchema,
      "The Created Product",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(CreateProductSchema),
      "The Validation Errors",
    ),
  },
});

export const getOne = createRoute({
  path: "/products/{id}",
  method: "get",
  request: {
    params: IdParamSchema,
    query: ProductQuerySchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      ProductSchema,
      "The requested Product",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      IdParamSchema,
      "Invalid Id Error",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundSchema,
      "Product Not Found",
    ),
  },
});

export const update = createRoute({
  path: "/products/{id}",
  method: "patch",
  tags,
  request: {
    params: IdParamSchema,
    body: jsonContentRequired(
      UpdateProductSchema,
      "The Product Updates",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      ProductSchema,
      "The updated Product",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundSchema,
      "Product Not Found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [createErrorSchema(UpdateProductSchema), createErrorSchema(IdParamSchema)],
      "The Validation Errors",
    ),
  },
});

export const remove = createRoute({
  path: "/products/{id}",
  method: "delete",
  request: {
    params: IdParamSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      DeleteResponseSchema,
      "Product Deleted",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      IdParamSchema,
      "Invalid Id Error",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundSchema,
      "Product Not Found",
    ),
  },
});

export const listByUserId = createRoute({
  path: "/users/{userId}/products",
  method: "get",
  request: {
    params: UserIdParamSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(ProductSchema),
      "The List of Products for the specified User",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
export type ListByUserIdRoute = typeof listByUserId;
