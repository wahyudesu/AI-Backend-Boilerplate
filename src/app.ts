import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";

import home from "@/routes/home/home.index";
import input from "@/routes/ai/ai.index";

const app = createApp();

const routes = [
  home,
  input,
];

configureOpenAPI(app);
routes.forEach((route) => {
  app.route("/", route);
});
export default app;
