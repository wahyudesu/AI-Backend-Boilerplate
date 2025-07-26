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