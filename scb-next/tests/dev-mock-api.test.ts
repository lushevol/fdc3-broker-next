import { createServer } from "node:http";
import { afterEach, describe, expect, it } from "vitest";

import { createDevMockApiMiddleware } from "../web/mfe-base-origin/dev/mock-api";

const servers: ReturnType<typeof createServer>[] = [];

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) =>
        new Promise<void>((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        }),
    ),
  );
});

async function startMockApi(): Promise<string> {
  const middleware = createDevMockApiMiddleware();
  const server = createServer((request, response) => {
    middleware(request, response, () => {
      response.statusCode = 404;
      response.end();
    });
  });
  servers.push(server);

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Expected the development mock API to listen on a TCP port");
  }
  return `http://127.0.0.1:${address.port}`;
}

describe("SCB Next development mock API", () => {
  it("authenticates the documented mock user through the browser-facing login endpoint", async () => {
    const origin = await startMockApi();

    const response = await fetch(`${origin}/api/auth/v2/sso/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: "mock.cashflow", password: "acceptance" }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("single-ui-authorization")).toMatch(/^Bearer /);
    await expect(response.json()).resolves.toMatchObject({
      result: "success",
      drawers: [
        { tiles: expect.arrayContaining([expect.objectContaining({ title: "Cashflow Blotter" })]) },
      ],
    });
  });

  it("serves the production Cashflow acceptance fixtures from the development origin", async () => {
    const origin = await startMockApi();

    const [versions, fields, views, cashflows] = await Promise.all([
      fetch(`${origin}/api/ratan/rule/v1/fields/versions`),
      fetch(`${origin}/api/ratan/rule/v1/fields`),
      fetch(`${origin}/api/ratan/v3/customview/views`),
      fetch(`${origin}/api/ratan/stmcn/v1/cashflows`, { method: "POST" }),
    ]);

    expect(await versions.json()).toMatchObject({
      ratan_suppression_fields_config: { activedVersion: "acceptance-v1" },
    });
    await expect(fields.json()).resolves.toMatchObject({ fields: expect.any(Array) });
    await expect(views.json()).resolves.toEqual([expect.objectContaining({ name: "Cashflow operations" })]);
    await expect(cashflows.json()).resolves.toMatchObject({
      data: {
        cashflowUltraQuery: {
          results: expect.arrayContaining([
            expect.objectContaining({
              Cashflow: expect.objectContaining({ Cashflow_Id: "CF-ACCEPT-001" }),
            }),
          ]),
        },
      },
    });
  });

  it("matches the production mock BFF validation and generic API fallbacks", async () => {
    const origin = await startMockApi();

    const [validation, fallback] = await Promise.all([
      fetch(`${origin}/api/auth/v2/sso/validate`, { method: "POST" }),
      fetch(`${origin}/api/ratan/notifications/unimplemented`),
    ]);

    await expect(validation.json()).resolves.toEqual({ result: true });
    await expect(fallback.json()).resolves.toEqual({
      data: [],
      items: [],
      results: [],
      total: 0,
    });
  });

  it("replays the predefined Cashflow metrics and ID search", async () => {
    const origin = await startMockApi();
    const metric = await fetch(`${origin}/api/ratan/stmcn/v1/cashflows`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ filter: "Cashflow.Cashflow_Sub_State Pending Operator Cashflow.Payment_Date 2026-08-14" }),
    });
    const search = await fetch(`${origin}/api/ratan/stmcn/v1/cashflows`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: "RatanUltraQuery BCS_Trade_Id Cashflow.Cashflow_Id M0P56753524" }),
    });

    await expect(metric.json()).resolves.toMatchObject({
      data: { cashflowUltraQuery: { totalResult: 10 } },
    });
    await expect(search.json()).resolves.toMatchObject({
      data: {
        cashflowUltraQuery: {
          totalResult: 1,
          results: [expect.objectContaining({ Cashflow: expect.objectContaining({ Cashflow_Id: "M0P56753524" }) })],
        },
      },
    });
  });

  it("replays Cashflow details, accounting, and currency holiday lookups", async () => {
    const origin = await startMockApi();
    const [details, accounting, holiday] = await Promise.all([
      fetch(`${origin}/api/ratan/stmcn/v1/cashflows`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ operation: "graphCashFlowDetails M0P56753524" }),
      }),
      fetch(`${origin}/api/ratan/v1/accounting/fetch/M0P56753524`),
      fetch(`${origin}/api/ratan/v1/cashflow/currency/holiday`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cashflowId: "0AP58899052" }),
      }),
    ]);

    await expect(details.json()).resolves.toMatchObject({
      data: { graphCashFlowDetails: [expect.objectContaining({ cashflow: expect.objectContaining({ Cashflow: expect.objectContaining({ Cashflow_Id: "M0P56753524" }) }) })] },
    });
    await expect(accounting.json()).resolves.toEqual([]);
    await expect(holiday.json()).resolves.toMatchObject([{ cashflowId: "0AP58899052", isHoliday: false }]);
  });

  it("provides saved custom filters and views for the Cashflow dialogs", async () => {
    const origin = await startMockApi();
    const [filters, views] = await Promise.all([
      fetch(`${origin}/api/ratan/v3/customview/filters?type=STRATEGIC_CASHFLOW_FILTER_BUILDER`),
      fetch(`${origin}/api/ratan/v3/customview/views?type=CASHFLOW_CN_VIEW_BUILDER`),
    ]);

    await expect(filters.json()).resolves.toEqual([expect.objectContaining({ name: "Pending operator cashflows" })]);
    await expect(views.json()).resolves.toEqual([expect.objectContaining({ name: "Cashflow operations" })]);
  });
});
