import { randomBytes } from "node:crypto";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import prisma from "prisma/db";

import type { CreateRoute, GetOneRoute, ListByUserIdRoute, ListRoute, RemoveRoute } from "./api-keys.routes";

// Helper function to generate a secure API key
function generateApiKey(): string {
  return randomBytes(32).toString("hex");
}

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const apiKeys = await prisma.apiKey.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return c.json(apiKeys);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const data = c.req.valid("json");

  // Generate a secure API key
  const generatedKey = generateApiKey();

  const apiKey = await prisma.apiKey.create({
    data: {
      ...data,
      key: generatedKey,
    },
  });

  return c.json(apiKey, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const apiKey = await prisma.apiKey.findUnique({
    where: {
      id,
    },
  });

  if (!apiKey) {
    return c.json({
      message: "Not Found",
    }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(apiKey, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const apiKey = await prisma.apiKey.findUnique({
    where: {
      id,
    },
  });

  if (!apiKey) {
    return c.json({
      message: "Not Found",
    }, HttpStatusCodes.NOT_FOUND);
  }

  await prisma.apiKey.delete({
    where: {
      id,
    },
  });

  return c.json({
    message: "API Key Deleted Successfully",
  }, HttpStatusCodes.OK);
};

export const listByUserId: AppRouteHandler<ListByUserIdRoute> = async (c) => {
  const { userId } = c.req.valid("param");

  const apiKeys = await prisma.apiKey.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return c.json(apiKeys);
};
