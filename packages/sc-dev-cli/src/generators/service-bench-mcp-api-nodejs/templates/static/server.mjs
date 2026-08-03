import process from "node:process";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import healthcheck from "./healthcheck.mjs";
import info from "./info.mjs";
import { registerTools } from "./src/tools/index.mjs";

// ---------------------------------------------------------------------------
// HTTP layer – each POST /mcp creates a fresh, stateless McpServer+transport
// pair per request. McpServer cannot be reused across connections, so we
// instantiate a new one for every incoming request instead of sharing a
// singleton. Tool registration is cheap (no I/O), so this is fine.
// ---------------------------------------------------------------------------
function createMcpServer() {
  const server = new McpServer({
    name: "service-bench-mcp-server",
    version: "0.0.1",
  });
  registerTools(server);
  return server;
}

const app = express();
app.disable("x-powered-by");
app.use(express.json());

// Health and info endpoints (standard Service Bench conventions)
app.use("/q/health", healthcheck);
app.use("/q/info", info);

// MCP endpoint
app.all("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless – no session pinning required
  });
  const mcpServer = createMcpServer();
  res.on("close", () => transport.close());
  await mcpServer.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = process.env.PORT_NO || 8080;
const server = app.listen(port, () => {
  console.log("MCP server is listening on port", port);
  console.log(`  → MCP endpoint : http://localhost:${port}/mcp`);
  console.log(`  → Health check : http://localhost:${port}/q/health`);
});

process.on("SIGTERM", () => {
  console.debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.debug("HTTP server closed");
  });
});
