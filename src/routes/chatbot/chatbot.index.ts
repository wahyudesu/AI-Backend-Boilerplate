import { createRouter } from "@/lib/create-app";

import * as handlers from "./chatbot.handlers";
import * as routes from "./chatbot.routes";

const router = createRouter().openapi(routes.processText, handlers.processText);

export default router;
