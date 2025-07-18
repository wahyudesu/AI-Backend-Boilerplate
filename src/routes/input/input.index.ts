import { createRouter } from "@/lib/create-app";

import * as handlers from "./input.handlers";
import * as routes from "./input.routes";

const router = createRouter().openapi(routes.processText, handlers.processText);

export default router;
