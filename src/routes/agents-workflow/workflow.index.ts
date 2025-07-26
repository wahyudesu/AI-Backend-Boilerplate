import { createRouter } from "@/lib/create-app";

import * as handlers from "./workflow.handlers";
import * as routes from "./workflow.routes";

const router = createRouter().openapi(routes.processText, handlers.processText);

export default router;
