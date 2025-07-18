import { createRouter } from "@/lib/create-app";

import * as handlers from "./api-keys.handlers";
import * as routes from "./api-keys.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.listByUserId, handlers.listByUserId);

export default router;
