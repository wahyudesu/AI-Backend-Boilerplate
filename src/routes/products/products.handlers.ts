import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import prisma from "prisma/db";

import type { CreateRoute, GetOneRoute, ListByUserIdRoute, ListRoute, RemoveRoute, UpdateRoute } from "./products.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return c.json(products);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const data = c.req.valid("json");
  const product = await prisma.product.create({
    data,
  });
  return c.json(product, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  // const { color, size } = c.req.valid("query");  // Access query params
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  if (!product) {
    return c.json({
      message: "Not Found",
    }, HttpStatusCodes.NOT_FOUND);
  }
  return c.json(product, HttpStatusCodes.OK);
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const data = c.req.valid("json");
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  if (!product) {
    return c.json({
      message: "Not Found",
    }, HttpStatusCodes.NOT_FOUND);
  }
  const updatedProduct = await prisma.product.update({
    where: {
      id,
    },
    data,
  });

  return c.json(updatedProduct, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  if (!product) {
    return c.json({
      message: "Not Found",
    }, HttpStatusCodes.NOT_FOUND);
  }
  await prisma.product.delete({
    where: {
      id,
    },
  });
  return c.json({
    message: "Product Deleted Successfully",
  }, HttpStatusCodes.OK);
};

export const listByUserId: AppRouteHandler<ListByUserIdRoute> = async (c) => {
  const { userId } = c.req.valid("param");
  const products = await prisma.product.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return c.json(products);
};
