import { describe, it, expect } from "@jest/globals";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { registerTools } from "../../src/tools/index.mjs";

// ---------------------------------------------------------------------------
// Helper: spin up an in-memory MCP server/client pair for unit tests.
// No real HTTP required – everything runs in-process.
// ---------------------------------------------------------------------------
async function createTestClient() {
  const server = new McpServer({ name: "test-server", version: "0.0.1" });
  registerTools(server);

  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);

  const client = new Client({ name: "test-client", version: "0.0.1" });
  await client.connect(clientTransport);

  return { client, server };
}

describe("getServerTime", () => {
  it("returns a valid ISO-8601 timestamp", async () => {
    const { client } = await createTestClient();
    const result = await client.callTool({ name: "getServerTime", arguments: {} });

    expect(result.isError).toBeFalsy();
    const text = result.content[0].text;
    // ISO-8601 date string should be parseable without throwing
    expect(() => new Date(text).toISOString()).not.toThrow();
  });
});

describe("getTimeWithTimeZone", () => {
  it("returns formatted time for a valid timezone", async () => {
    const { client } = await createTestClient();
    const result = await client.callTool({
      name: "getTimeWithTimeZone",
      arguments: { timeZone: "Asia/Manila" },
    });

    expect(result.isError).toBeFalsy();
    expect(result.content[0].text.length).toBeGreaterThan(0);
  });

  it("returns an error message for an invalid timezone", async () => {
    const { client } = await createTestClient();
    const result = await client.callTool({
      name: "getTimeWithTimeZone",
      arguments: { timeZone: "Invalid/Zone" },
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toMatch(/error/i);
  });

  it("rejects an empty timeZone with a validation error", async () => {
    const { client } = await createTestClient();
    await expect(
      client.callTool({ name: "getTimeWithTimeZone", arguments: { timeZone: "" } }),
    ).rejects.toThrow();
  });
});
