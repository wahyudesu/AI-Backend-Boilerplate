import { z } from "zod";

// Base ApiKey schema for validation
export const ApiKeySchema = z.object({
  id: z.string(),
  userId: z.string().min(1, "User ID is required"),
  key: z.string().min(1, "API key is required"),
  name: z.string().min(1, "Name is required"),
  createdAt: z.date().optional(),
});

export const IdParamSchema = z.object({
  id: z
    .string()
    .min(24)
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "00b4766213f0732810a29d8a",
    }),
});

// Schema for creating a new API key (without id, createdAt)
export const CreateApiKeySchema = ApiKeySchema.omit({
  id: true,
  key: true, // Key will be generated server-side
  createdAt: true,
});

// Type definitions derived from the schemas
export type ApiKey = z.infer<typeof ApiKeySchema>;
export type CreateApiKeyInput = z.infer<typeof CreateApiKeySchema>;
