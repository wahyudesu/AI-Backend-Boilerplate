import { createRouter } from "@/lib/create-app";

import * as handlers from "./agents.handlers";
import * as routes from "./agents.routes";

const router = createRouter().openapi(routes.processText, handlers.processText);

export default router;
