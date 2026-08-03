import { z } from "zod";

// ---------------------------------------------------------------------------
// Tool: getServerTime
// Returns the current server time as an ISO-8601 string.
// No input parameters required.
//
// Example MCP call:
//   { "method": "tools/call", "params": { "name": "getServerTime", "arguments": {} } }
// ---------------------------------------------------------------------------
export function registerGetServerTime(server) {
  server.tool(
    "getServerTime",
    "Get the current server time in ISO-8601 format",
    {}, // no input schema – tool takes no arguments
    async () => {
      const now = new Date().toISOString();
      return {
        content: [{ type: "text", text: now }],
      };
    },
  );
}

// ---------------------------------------------------------------------------
// Tool: getTimeWithTimeZone
// Returns the current time in the specified IANA timezone.
//
// Example MCP call:
//   {
//     "method": "tools/call",
//     "params": {
//       "name": "getTimeWithTimeZone",
//       "arguments": { "timeZone": "Asia/Manila" }
//     }
//   }
// ---------------------------------------------------------------------------
export function registerGetTimeWithTimeZone(server) {
  server.tool(
    "getTimeWithTimeZone",
    "Get the current time based on the supplied IANA timezone identifier",
    {
      timeZone: z
        .string()
        .min(1, { message: "timeZone is required" })
        .describe(
          'IANA time zone identifier, e.g. "Asia/Manila", "America/New_York", "Europe/London"',
        ),
    },
    async ({ timeZone }) => {
      try {
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZoneName: "short",
        }).format(new Date());
        return {
          content: [{ type: "text", text: formatted }],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    },
  );
}
