import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";

import home from "@/routes/home/home.index";
import input from "@/routes/chatbot/chatbot.index";
import agent from "@/routes/agents/agents.index";
import meme from "@/routes/agents-workflow/workflow.index";

const app = createApp();

const routes = [
  home,
  input,
  agent,
  meme
];

configureOpenAPI(app);
routes.forEach((route) => {
  app.route("/", route);
});
export default app;
