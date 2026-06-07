import express from "express";
const app = express();
import compression from "compression";

import { registerCandidateMockRoutes } from "./mock/candidate";
import { registerFormMockRoutes } from "./mock/form";
import { registerStatisticsMockRoutes } from "./mock/statistics";
import { registerTaskMockRoutes } from "./mock/task";
import { registerTodoMockRoutes } from "./mock/todo";
import { registerUserMockRoutes } from "./mock/user";
import { health, nohttp } from "./server_util/header";
const DIST_DIR = __dirname;

app.use(compression());
app.use(
  express.json({
    limit: process.env.FILE_LIMIT || "1mb",
  })
);
app.use(
  express.urlencoded({
    limit: process.env.FILE_LIMIT || "1mb",
    extended: true,
  })
);
app.use(nohttp);
app.use(express.static(DIST_DIR));
app.get("/health", health);
app.get("/index.js", health);
app.get("/server_util", health);


if(process.env.mode === "mock") {
registerFormMockRoutes(app);
registerTaskMockRoutes(app);
registerTodoMockRoutes(app);
registerUserMockRoutes(app);
  registerCandidateMockRoutes(app);
  registerStatisticsMockRoutes(app);
}
const port = process.env.PORT || 8017;
const server = app.listen(port, () => {
  console.log(`server started. PORT: ${port} `);
});
server.timeout = parseInt(process.env.DEFAULT_TIMEOUT || "30000");
server.on("error", (error: any) => {
  if (error?.code === "EADDRINUSE") {
    process.exit(1);
  }
});
