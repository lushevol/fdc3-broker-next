import { afterEach, describe, expect, it } from "vitest";

import { createAlphaPaymentsServer } from "../src/server.mjs";

const activeServers = [];

afterEach(async () => {
  await Promise.all(
    activeServers.splice(0).map(
      (server) =>
        new Promise((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        })
    )
  );
});

async function startServer(logger = () => undefined) {
  const server = createAlphaPaymentsServer({ logger });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  activeServers.push(server);
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Expected the test server to bind to a TCP port");
  }
  return `http://127.0.0.1:${address.port}`;
}

describe("Alpha Payments HTTP API", () => {
  it("reports tenant health and returns the payment investigation queue", async () => {
    const origin = await startServer();

    const healthResponse = await fetch(`${origin}/healthz`);
    expect(healthResponse.status).toBe(200);
    expect(await healthResponse.json()).toEqual({
      status: "ok",
      service: "alpha-payments-api",
      tenantId: "alpha-payments"
    });

    const casesResponse = await fetch(`${origin}/api/alpha-payments/v1/cases`);
    expect(casesResponse.status).toBe(200);
    const cases = await casesResponse.json();
    expect(cases).toMatchObject({
      tenantId: "alpha-payments",
      total: 3
    });
    expect(cases.items).toHaveLength(3);
    expect(cases.items[0]).toEqual({
      id: "AP-20481",
      direction: "Inbound",
      currency: "USD",
      amount: 1250000,
      counterparty: "Merlion Bank",
      priority: "Critical",
      ageMinutes: 47,
      status: "OPEN"
    });
  });

  it("acknowledges an eligible payment case and returns the persisted status", async () => {
    const origin = await startServer();

    const acknowledgeResponse = await fetch(
      `${origin}/api/alpha-payments/v1/cases/AP-20481/acknowledge`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ actor: "mock.alpha-payments" })
      }
    );

    expect(acknowledgeResponse.status).toBe(200);
    expect(await acknowledgeResponse.json()).toMatchObject({
      item: {
        id: "AP-20481",
        status: "ACKNOWLEDGED",
        acknowledgedBy: "mock.alpha-payments"
      }
    });

    const casesResponse = await fetch(`${origin}/api/alpha-payments/v1/cases`);
    const cases = await casesResponse.json();
    expect(cases.items.find(({ id }) => id === "AP-20481")).toMatchObject({
      status: "ACKNOWLEDGED",
      acknowledgedBy: "mock.alpha-payments"
    });
  });

  it("rejects invalid requests and records correlated completion metadata", async () => {
    const logs = [];
    const origin = await startServer((entry) => logs.push(entry));
    const correlationId = "acceptance-alpha-001";

    const invalidActorResponse = await fetch(
      `${origin}/api/alpha-payments/v1/cases/AP-20481/acknowledge`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-correlation-id": correlationId
        },
        body: JSON.stringify({})
      }
    );
    expect(invalidActorResponse.status).toBe(400);
    expect(invalidActorResponse.headers.get("x-correlation-id")).toBe(correlationId);
    expect(await invalidActorResponse.json()).toEqual({
      error: {
        code: "INVALID_ACTOR",
        message: "actor must be a valid user identifier"
      },
      correlationId
    });

    const malformedJsonResponse = await fetch(
      `${origin}/api/alpha-payments/v1/cases/AP-20481/acknowledge`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: "{"
      }
    );
    expect(malformedJsonResponse.status).toBe(400);
    expect(await malformedJsonResponse.json()).toMatchObject({
      error: { code: "INVALID_JSON" }
    });

    const malformedActorResponse = await fetch(
      `${origin}/api/alpha-payments/v1/cases/AP-20481/acknowledge`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ actor: "!" })
      }
    );
    expect(malformedActorResponse.status).toBe(400);

    const unknownCaseResponse = await fetch(
      `${origin}/api/alpha-payments/v1/cases/AP-99999/acknowledge`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ actor: "mock.alpha-payments" })
      }
    );
    expect(unknownCaseResponse.status).toBe(404);
    expect(await unknownCaseResponse.json()).toMatchObject({
      error: { code: "CASE_NOT_FOUND" }
    });

    const unsupportedMethodResponse = await fetch(
      `${origin}/api/alpha-payments/v1/cases`,
      { method: "POST" }
    );
    expect(unsupportedMethodResponse.status).toBe(405);
    expect(await unsupportedMethodResponse.json()).toMatchObject({
      error: { code: "METHOD_NOT_ALLOWED" }
    });

    const unsupportedHealthMethod = await fetch(`${origin}/healthz`, { method: "POST" });
    expect(unsupportedHealthMethod.status).toBe(405);

    const unsupportedAcknowledgeMethod = await fetch(
      `${origin}/api/alpha-payments/v1/cases/AP-20481/acknowledge`
    );
    expect(unsupportedAcknowledgeMethod.status).toBe(405);

    const unknownPathResponse = await fetch(`${origin}/api/alpha-payments/v1/unknown`);
    expect(unknownPathResponse.status).toBe(404);
    expect(await unknownPathResponse.json()).toMatchObject({
      error: { code: "NOT_FOUND" },
      correlationId: expect.any(String)
    });

    expect(logs).toContainEqual(
      expect.objectContaining({
        event: "http.request.completed",
        tenantId: "alpha-payments",
        correlationId,
        method: "PATCH",
        path: "/api/alpha-payments/v1/cases/AP-20481/acknowledge",
        status: 400,
        durationMs: expect.any(Number)
      })
    );
  });
});
