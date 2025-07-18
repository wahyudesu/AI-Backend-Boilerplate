# 🚀 Hono API Template with Scalar Documentation

A modern, high-performance API built with Hono.js, TypeScript, Zod validation, Prisma ORM, and beautiful Scalar documentation.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-E36002?logo=hono&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?logo=Prisma&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068B7?logo=zod&logoColor=white)

## ✨ Features

- 🔥 **Hono.js** - Ultra-fast web framework built on Web Standards
- 🔷 **TypeScript** - Full type safety with advanced type inference
- 📚 **Auto-generated Documentation** - Beautiful Scalar docs from OpenAPI specs
- 🛡️ **Security & Validation** - Zod schema validation with OpenAPI integration
- 🗄️ **Database Ready** - Prisma ORM with type-safe queries
- ⚡ **High Performance** - Edge runtime compatible, blazingly fast
- 🧪 **Production Ready** - Built-in error handling and middleware
- 📖 **OpenAPI 3.0** - Auto-generated API documentation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm or yarn
- PostgreSQL/MySQL/SQLite database

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd hono-api-template
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   NODE_ENV=development
   PORT=8000
   DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
   JWT_SECRET="your-secret-key"
   RESEND_API_KEY="your-resend-key"
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server**

   ```bash
   pnpm run dev
   ```

6. **Visit your API**
   - **API Base**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/scalar
   - **OpenAPI Spec**: http://localhost:8000/doc

## 📡 Current API Endpoints

| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| GET    | `/products`                | List all products        |
| POST   | `/products`                | Create a new product     |
| GET    | `/products/{id}`           | Get a specific product   |
| PATCH  | `/products/{id}`           | Update a product         |
| DELETE | `/products/{id}`           | Delete a product         |
| GET    | `/users/{userId}/products` | List products by user ID |

## 🛠 Adding New Endpoints - Complete Guide

Follow this step-by-step guide to add a complete **Categories** CRUD endpoint. This same pattern works for any new resource.

### Hono API Structure (4 Files per Resource)

```
src/routes/categories/
├── categories.schema.ts     # Zod schemas & types
├── categories.handlers.ts   # Business logic & handlers
├── categories.routes.ts     # OpenAPI route definitions
└── categories.index.ts      # Route registration & export
```

### Step 1: Update Database Schema

Add the Category model to your `prisma/schema.prisma`:

```prisma
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  color       String?  @default("#3B82F6")
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([isActive])
  @@map("categories")
}
```

**Run the migration:**

```bash
npx prisma migrate dev --name add-categories
npx prisma generate
```

### Step 2: Create Categories Folder

Create the directory structure:

```bash
mkdir -p src/routes/categories
```

### Step 3: Create Categories Schema

Create `src/routes/categories/categories.schema.ts`:

```typescript
import { z } from "zod";

// Base Category schema for validation
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().nullable(),
  color: z.string().optional().default("#3B82F6"),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const IdParamSchema = z.object({
  id: z
    .string()
    .min(1, "Invalid ID format")
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "clq123abc456def789",
    }),
});

// Schema for creating a new category (without id, createdAt, updatedAt)
export const CreateCategorySchema = CategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for updating an existing category (all fields optional except id)
export const UpdateCategorySchema = CategorySchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Type definitions derived from the schemas
export type Category = z.infer<typeof CategorySchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
```

### Step 4: Create Categories Handlers

Create `src/routes/categories/categories.handlers.ts`:

```typescript
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import prisma from "prisma/db";

import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute
} from "./categories.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: {
      createdAt: "desc",
    },
  });
  return c.json(categories);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const data = c.req.valid("json");

  // Generate slug from name if not provided
  if (!data.slug && data.name) {
    data.slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  try {
    const category = await prisma.category.create({
      data,
    });
    return c.json(category, HttpStatusCodes.CREATED);
  }
  catch (error) {
    if (error.code === "P2002") {
      return c.json({
        message: "Category with this name or slug already exists",
      }, HttpStatusCodes.CONFLICT);
    }
    return c.json({
      message: "Failed to create category",
    }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    return c.json({
      message: "Category Not Found",
    }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(category, HttpStatusCodes.OK);
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const data = c.req.valid("json");

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    return c.json({
      message: "Category Not Found",
    }, HttpStatusCodes.NOT_FOUND);
  }

  // Generate slug from name if name is being updated but slug is not provided
  if (data.name && !data.slug) {
    data.slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  try {
    const updatedCategory = await prisma.category.update({
      where: {
        id,
      },
      data,
    });

    return c.json(updatedCategory, HttpStatusCodes.OK);
  }
  catch (error) {
    if (error.code === "P2002") {
      return c.json({
        message: "Category with this name or slug already exists",
      }, HttpStatusCodes.CONFLICT);
    }
    return c.json({
      message: "Failed to update category",
    }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    return c.json({
      message: "Category Not Found",
    }, HttpStatusCodes.NOT_FOUND);
  }

  // Soft delete by setting isActive to false
  await prisma.category.update({
    where: {
      id,
    },
    data: { isActive: false },
  });

  return c.json({
    message: "Category Deleted Successfully",
  }, HttpStatusCodes.OK);
};
```

### Step 5: Create Categories Routes

Create `src/routes/categories/categories.routes.ts`:

```typescript
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { DeleteResponseSchema, NotFoundSchema } from "@/lib/constants";

import {
  CategorySchema,
  CreateCategorySchema,
  IdParamSchema,
  UpdateCategorySchema
} from "./categories.schema";

const tags = ["Categories"];

export const list = createRoute({
  path: "/categories",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(CategorySchema),
      "The List of Categories",
    ),
  },
});

export const create = createRoute({
  path: "/categories",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      CreateCategorySchema,
      "The Category to Create",
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      CategorySchema,
      "The Created Category",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      z.object({ message: z.string() }),
      "Category Already Exists",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(CreateCategorySchema),
      "The Validation Errors",
    ),
  },
});

export const getOne = createRoute({
  path: "/categories/{id}",
  method: "get",
  request: {
    params: IdParamSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      CategorySchema,
      "The requested Category",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamSchema),
      "Invalid Id Error",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundSchema,
      "Category Not Found",
    ),
  },
});

export const update = createRoute({
  path: "/categories/{id}",
  method: "patch",
  tags,
  request: {
    params: IdParamSchema,
    body: jsonContentRequired(
      UpdateCategorySchema,
      "The Category Updates",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      CategorySchema,
      "The updated Category",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundSchema,
      "Category Not Found",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      z.object({ message: z.string() }),
      "Category Name/Slug Conflict",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(UpdateCategorySchema),
      "The Validation Errors",
    ),
  },
});

export const remove = createRoute({
  path: "/categories/{id}",
  method: "delete",
  request: {
    params: IdParamSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      DeleteResponseSchema,
      "Category Deleted",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamSchema),
      "Invalid Id Error",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      NotFoundSchema,
      "Category Not Found",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
```

### Step 6: Create Categories Index

Create `src/routes/categories/categories.index.ts`:

```typescript
import { createRouter } from "@/lib/create-app";

import * as handlers from "./categories.handlers";
import * as routes from "./categories.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove);

export default router;
```

### Step 7: Register Routes in App

Update `src/app.ts` to include the new categories routes:

```typescript
import categories from "@/routes/categories/categories.index"; // Add this import

import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import apiKeys from "@/routes/api-keys/api-keys.index";
import home from "@/routes/home/home.index";
import products from "@/routes/products/products.index";
import users from "@/routes/users/users.index";

const app = createApp();

const routes = [
  home,
  products,
  categories, // Add this line
  users,
  apiKeys,
];

configureOpenAPI(app);
routes.forEach((route) => {
  app.route("/", route);
});

export default app;
```

### Step 8: Test Your New Endpoints

1. **Restart your server**:

   ```bash
   pnpm run dev
   ```

2. **Visit the documentation**: http://localhost:8000/scalar

3. **Test the endpoints**:

   ```bash
   # Create a category
   curl -X POST http://localhost:8000/categories \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Electronics",
       "description": "Electronic devices and gadgets",
       "color": "#3B82F6"
     }'

   # Get all categories
   curl http://localhost:8000/categories

   # Get a specific category
   curl http://localhost:8000/categories/{category-id}

   # Update a category
   curl -X PATCH http://localhost:8000/categories/{category-id} \
     -H "Content-Type: application/json" \
     -d '{"description": "Updated description"}'

   # Delete a category (soft delete)
   curl -X DELETE http://localhost:8000/categories/{category-id}
   ```

## 📁 Project Structure

```
src/
├── lib/
│   ├── types.ts              # TypeScript type definitions
│   ├── create-app.ts         # Hono app factory
│   ├── configure-open-api.ts # OpenAPI configuration
│   └── constants.ts          # Shared constants & schemas
├── routes/
│   ├── products/            # Products endpoints
│   │   ├── products.schema.ts
│   │   ├── products.handlers.ts
│   │   ├── products.routes.ts
│   │   └── products.index.ts
│   ├── categories/          # Categories endpoints
│   │   ├── categories.schema.ts
│   │   ├── categories.handlers.ts
│   │   ├── categories.routes.ts
│   │   └── categories.index.ts
│   ├── users/              # Users endpoints
│   ├── api-keys/           # API Keys endpoints
│   └── home/               # Home/welcome endpoints
├── app.ts                  # Main Hono app
├── index.ts               # Server entry point
└── env.ts                 # Environment validation
```

## 🎯 Quick Checklist for New Endpoints

When adding a new resource (e.g., `orders`, `inventory`, etc.), follow this checklist:

- [ ] **1. Database Schema** - Add model to `prisma/schema.prisma`
- [ ] **2. Run Migration** - `npx prisma migrate dev --name add-{resource}`
- [ ] **3. Create Folder** - `src/routes/{resource}/`
- [ ] **4. Schema File** - `{resource}.schema.ts` with Zod schemas & types
- [ ] **5. Handlers File** - `{resource}.handlers.ts` with typed handlers
- [ ] **6. Routes File** - `{resource}.routes.ts` with OpenAPI route definitions
- [ ] **7. Index File** - `{resource}.index.ts` to register routes with handlers
- [ ] **8. Register in App** - Add import and route to `src/app.ts`
- [ ] **9. Test** - Restart server and test all endpoints
- [ ] **10. Documentation** - Verify in Scalar docs at `/scalar`

## 🔧 Key Differences from Express

### **1. Handler Signature**

```typescript
// Hono Handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const data = c.req.valid("json"); // Validated input
  return c.json(result, statusCode); // Hono response
};

// vs Express Handler
export async function create(req, res) {
  const data = req.body; // Raw input
  return res.status(statusCode).json(result); // Express response
}
```

### **2. Route Definition**

```typescript
// Hono uses createRoute from @hono/zod-openapi
export const create = createRoute({
  path: "/categories",
  method: "post",
  request: { body: jsonContentRequired(CreateSchema, "Description") },
  responses: { 201: jsonContent(Schema, "Success") },
});
```

### **3. Type Safety**

```typescript
// Handlers are fully typed based on route definitions
export const handler: AppRouteHandler<CreateRoute> = async (c) => {
  // c.req.valid("json") is automatically typed from the route schema
  // c.json() response is validated against the response schema
};
```

### **4. Automatic Validation**

- Input validation happens automatically via Hono middleware
- No need for manual `validateRequest` middleware
- Type inference from schemas to handlers

## 🚀 Advanced Features

### **Middleware Example**

```typescript
// Custom middleware
async function authMiddleware(c, next) {
  const token = c.req.header("Authorization");
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
}

// Apply to routes
const router = createRouter()
  .use("/*", authMiddleware)
  .openapi(routes.create, handlers.create);
```

### **Error Handling**

```typescript
// Global error handler in create-app.ts
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal Server Error" }, 500);
});
```

### **Custom Validation**

```typescript
// In schema file
export const CreateSchema = z.object({
  name: z.string().refine(
    name => !name.includes("admin"),
    "Name cannot contain \"admin\""
  ),
});
```

## 🌟 Benefits of Hono

- **🚀 Performance** - Up to 4x faster than Express
- **🔒 Type Safety** - End-to-end type safety from schema to handler
- **📝 Auto Documentation** - OpenAPI docs generated from route definitions
- **🌐 Edge Ready** - Works on Cloudflare Workers, Deno, Bun
- **🛠️ Developer Experience** - Excellent TypeScript support and IntelliSense

## 📦 Scripts

```bash
pnpm run dev          # Start development server with hot reload
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
pnpm run lint:fix     # Fix ESLint issues
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

---

**Happy coding with Hono! ⚡**

For questions or support, please open an issue on GitHub.
