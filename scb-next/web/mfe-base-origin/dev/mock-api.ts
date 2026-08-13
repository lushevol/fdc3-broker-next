import { readFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { join } from "node:path";
import type { Plugin } from "vite";

const FIXTURES_ROOT = join(import.meta.dirname, "../../../devops/mock-bff/fixtures");
const MOCK_AUTHORIZATION =
  "Bearer eyJhbGciOiJub25lIn0.eyJzdWIiOiJtb2NrLmNhc2hmbG93IiwiZXhwIjo0MTAyNDQ0ODAwLCJpYXQiOjE3MDAwMDAwMDB9.";

type Next = () => void;

export type DevMockApiMiddleware = (
  request: IncomingMessage,
  response: ServerResponse,
  next: Next,
) => void;

function sendFixture(response: ServerResponse, fixtureName: string): void {
  response.statusCode = 200;
  response.setHeader("content-type", "application/json");
  response.setHeader("single-ui-authorization", MOCK_AUTHORIZATION);
  response.end(readFileSync(join(FIXTURES_ROOT, fixtureName), "utf8"));
}

function sendJson(response: ServerResponse, body: unknown): void {
  response.statusCode = 200;
  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify(body));
}

export function createDevMockApiMiddleware(): DevMockApiMiddleware {
  return (request, response, next) => {
    const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;

    if (request.method === "POST" && pathname === "/api/auth/v2/sso/login") {
      sendFixture(response, "login.json");
      return;
    }

    if (pathname === "/api/auth/v2/sso/validate") {
      sendJson(response, { result: true });
      return;
    }

    if (pathname === "/api/ratan/rule/v1/fields/versions") {
      sendJson(response, {
        ratan_suppression_fields_config: { activedVersion: "acceptance-v1" },
        ratan_suppression_fields: { activedVersion: "acceptance-v1" },
      });
      return;
    }

    if (pathname === "/api/ratan/rule/v1/fields") {
      sendFixture(response, "fields.json");
      return;
    }

    if (/^\/api\/ratan\/v[23]\/customview\/(filters|views)/.test(pathname)) {
      sendJson(response, []);
      return;
    }

    if (/^\/api\/ratan\/.*cashflows/.test(pathname)) {
      sendFixture(response, "cashflows.json");
      return;
    }

    if (pathname.startsWith("/api/")) {
      sendJson(response, { data: [], items: [], results: [], total: 0 });
      return;
    }

    next();
  };
}

export function devMockApiPlugin(): Plugin {
  return {
    name: "scb-next-development-mock-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(createDevMockApiMiddleware());
    },
  };
}
