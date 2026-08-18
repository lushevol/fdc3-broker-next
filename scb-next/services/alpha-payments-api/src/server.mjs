import { randomUUID } from "node:crypto";
import { createServer } from "node:http";

const TENANT_ID = "alpha-payments";

const INITIAL_CASES = [
  {
    id: "AP-20481",
    direction: "Inbound",
    currency: "USD",
    amount: 1250000,
    counterparty: "Merlion Bank",
    priority: "Critical",
    ageMinutes: 47,
    status: "OPEN"
  },
  {
    id: "AP-20482",
    direction: "Outbound",
    currency: "EUR",
    amount: 782400,
    counterparty: "Northstar Clearing",
    priority: "High",
    ageMinutes: 31,
    status: "REVIEWING"
  },
  {
    id: "AP-20483",
    direction: "Inbound",
    currency: "SGD",
    amount: 420000,
    counterparty: "Orchard Treasury",
    priority: "Standard",
    ageMinutes: 18,
    status: "ACKNOWLEDGED"
  }
];

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

function sendError(response, statusCode, code, message, correlationId) {
  sendJson(response, statusCode, {
    error: { code, message },
    correlationId
  });
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function createAlphaPaymentsServer({ logger }) {
  const cases = structuredClone(INITIAL_CASES);

  return createServer(async (request, response) => {
    const startedAt = performance.now();
    const pathname = new URL(request.url, "http://127.0.0.1").pathname;
    const correlationHeader = request.headers["x-correlation-id"];
    const correlationId =
      typeof correlationHeader === "string" && /^[A-Za-z0-9._:-]{1,128}$/.test(correlationHeader)
        ? correlationHeader
        : randomUUID();
    response.setHeader("x-correlation-id", correlationId);
    response.once("finish", () => {
      logger({
        event: "http.request.completed",
        tenantId: TENANT_ID,
        correlationId,
        method: request.method,
        path: pathname,
        status: response.statusCode,
        durationMs: Math.max(0, Math.round((performance.now() - startedAt) * 100) / 100)
      });
    });

    if (pathname === "/healthz") {
      if (request.method !== "GET") {
        sendError(response, 405, "METHOD_NOT_ALLOWED", "Method not allowed", correlationId);
        return;
      }
      sendJson(response, 200, {
        status: "ok",
        service: "alpha-payments-api",
        tenantId: TENANT_ID
      });
      return;
    }

    if (pathname === "/api/alpha-payments/v1/cases") {
      if (request.method !== "GET") {
        sendError(response, 405, "METHOD_NOT_ALLOWED", "Method not allowed", correlationId);
        return;
      }
      sendJson(response, 200, {
        tenantId: TENANT_ID,
        total: cases.length,
        items: cases
      });
      return;
    }

    const acknowledgeMatch = pathname.match(
      /^\/api\/alpha-payments\/v1\/cases\/(AP-\d+)\/acknowledge$/
    );
    if (acknowledgeMatch) {
      if (request.method !== "PATCH") {
        sendError(response, 405, "METHOD_NOT_ALLOWED", "Method not allowed", correlationId);
        return;
      }
      let body;
      try {
        body = await readJson(request);
      } catch {
        sendError(response, 400, "INVALID_JSON", "Request body must be valid JSON", correlationId);
        return;
      }
      const { actor } = body;
      if (typeof actor !== "string" || !/^[a-z0-9][a-z0-9._-]{2,63}$/.test(actor)) {
        sendError(
          response,
          400,
          "INVALID_ACTOR",
          "actor must be a valid user identifier",
          correlationId
        );
        return;
      }
      const paymentCase = cases.find(({ id }) => id === acknowledgeMatch[1]);
      if (!paymentCase) {
        sendError(response, 404, "CASE_NOT_FOUND", "Payment case not found", correlationId);
        return;
      }
      Object.assign(paymentCase, {
        status: "ACKNOWLEDGED",
        acknowledgedBy: actor,
        acknowledgedAt: new Date().toISOString()
      });
      sendJson(response, 200, { item: paymentCase });
      return;
    }

    sendError(response, 404, "NOT_FOUND", "Route not found", correlationId);
  });
}
