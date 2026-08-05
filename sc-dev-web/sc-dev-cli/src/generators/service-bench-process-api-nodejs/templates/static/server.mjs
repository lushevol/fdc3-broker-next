import process from "node:process";
import express from "express";
import { shutdown as shutdownOtel } from "./otel.mjs";
import healthcheck from "./healthcheck.mjs";
import info from "./info.mjs";
import sampleV1Controller from "./src/sample-v1-controller.mjs";

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use("/q/health", healthcheck);
app.use("/q/info", info);

// Controllers
app.use("/v1/sample", sampleV1Controller);

const port = process.env.PORT_NO || 8080;
const server = app.listen(port, () => {
  console.log("Node API is listening on port", port);
});
process.on("SIGTERM", () => {
  console.debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.debug("HTTP server closed");
    shutdownOtel().catch(console.error);
  });
});
