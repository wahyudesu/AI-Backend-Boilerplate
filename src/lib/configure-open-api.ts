import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "./types";

import packageJSON from "../../package.json" with { type: "json" };

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Products API",
    },
  });
  app.get("/scalar", Scalar({ url: "/doc", theme: "kepler", layout: "modern", defaultHttpClient: {
    targetKey: "js",
    clientKey: "fetch",
  } }));
}
