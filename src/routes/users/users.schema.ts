// users.schema.ts
import { z } from "zod";

// Enum for user status
export const UserStatusEnum = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"]);
export const UserRoleEnum = z.enum(["ADMIN", "USER"]);

// Base User schema for validation
export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
  emailVerified: z.date().optional().nullable(),
  image: z.string().url("Image must be a valid URL").optional().nullable(),
  password: z.string().optional().nullable(),
  status: UserStatusEnum.default("ACTIVE"),
  isVerified: z.boolean().default(false),
  token: z.string().optional().nullable(),
  role: UserRoleEnum.default("USER"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
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

// Schema for creating a new user (without id, createdAt, updatedAt)
export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  emailVerified: true,
});

// Schema for updating an existing user (all fields optional except id)
export const UpdateUserSchema = UserSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    password: true, // Password should be updated through a separate endpoint for security
  })
  .partial();

// Type definitions derived from the schemas
export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;