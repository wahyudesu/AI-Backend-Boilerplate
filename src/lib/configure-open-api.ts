import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "./types";

import packageJSON from "../../package.json" with { type: "json" };

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "AI Backend Typescript Starter Kit",
      description: "AI Backend templates for your ML/AI project so you can deploy anywhere for free.\nBuilt with Hono, Mastra, and Vercel AI SDK",
    },
  });
  app.get("/api", Scalar({ url: "/doc", theme: "kepler", layout: "classic", defaultHttpClient: {
    targetKey: "js",
    clientKey: "fetch",
  } }));
}
