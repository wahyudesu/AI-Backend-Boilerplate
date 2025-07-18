// products.schema.ts
import { z } from "zod";

// Base Product schema for validation
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  buyingPrice: z.number().nonnegative("Buying price must be a non-negative number").default(0),
  price: z.number().positive("Price must be a positive number"),
  image: z.string().url("Image must be a valid URL").optional().nullable(),
  userId: z.string().min(1, "User ID is required"),
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
export const ProductQuerySchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
});
// user parameter schema for filtering by user
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

// Schema for creating a new product (without id, createdAt, updatedAt)
export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for updating an existing product (all fields optional except id)
export const UpdateProductSchema = ProductSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Type definitions derived from the schemas
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;