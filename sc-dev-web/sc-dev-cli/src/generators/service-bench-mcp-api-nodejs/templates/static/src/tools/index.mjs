import { registerGetServerTime, registerGetTimeWithTimeZone } from "./time-tools.mjs";

// ---------------------------------------------------------------------------
// Central registration point for all MCP tools.
//
// HOW TO ADD A NEW TOOL
// ─────────────────────
// 1. Create a new file under src/tools/, e.g. src/tools/my-feature-tools.mjs
// 2. Export a registerXxx(server) function that calls server.tool(...)
// 3. Import and call that function below.
//
// The McpServer instance is passed in from server.mjs so you never need to
// import it directly inside individual tool files.
// ---------------------------------------------------------------------------
export function registerTools(server) {
  registerGetServerTime(server);
  registerGetTimeWithTimeZone(server);
}
