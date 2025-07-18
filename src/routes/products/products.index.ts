import { createRouter } from "@/lib/create-app";

import * as handlers from "./products.handlers";
import * as routes from "./products.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.listByUserId, handlers.list);

export default router;
