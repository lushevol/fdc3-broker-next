import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import App from "./App";

const casesResponse = {
  tenantId: "alpha-payments",
  total: 3,
  items: [
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
  ]
};

describe("Alpha Payments application", () => {
  it("shows loading feedback and then renders the API-backed investigation queue", async () => {
    let resolveRequest: ((value: Response) => void) | undefined;
    const responsePromise = new Promise<Response>((resolve) => {
      resolveRequest = resolve;
    });
    vi.stubGlobal("fetch", vi.fn(() => responsePromise));

    render(<App />);

    expect(screen.getByRole("status").textContent).toContain("Loading payment investigations");

    resolveRequest?.({
      ok: true,
      json: async () => casesResponse
    } as Response);

    expect(await screen.findByRole("heading", { name: "Payment Investigation" })).toBeTruthy();
    expect(screen.getByRole("row", { name: /AP-20481/ }).textContent).toContain("Merlion Bank");
    expect(screen.getByText("3 active cases")).toBeTruthy();
  });

  it("filters the queue by search text and status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => casesResponse } as Response)
    );

    render(<App />);
    await screen.findByRole("row", { name: /AP-20481/ });

    fireEvent.change(screen.getByRole("searchbox", { name: "Search cases" }), {
      target: { value: "northstar" }
    });
    expect(screen.queryByRole("row", { name: /AP-20481/ })).toBeNull();
    expect(screen.getByRole("row", { name: /AP-20482/ })).toBeTruthy();
    expect(screen.getByText("1 result")).toBeTruthy();

    fireEvent.change(screen.getByRole("combobox", { name: "Filter by status" }), {
      target: { value: "ACKNOWLEDGED" }
    });
    expect(screen.getByText("No cases match the active filters.")).toBeTruthy();
  });

  it("acknowledges an eligible case and updates the queue in place", async () => {
    const acknowledgedCase = {
      ...casesResponse.items[0],
      status: "ACKNOWLEDGED",
      acknowledgedBy: "mock.alpha-payments",
      acknowledgedAt: "2026-08-19T00:00:00.000Z"
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => casesResponse } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ item: acknowledgedCase }) } as Response);
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);
    const acknowledge = await screen.findByRole("button", { name: "Acknowledge AP-20481" });
    fireEvent.click(acknowledge);

    expect(await screen.findByRole("row", { name: /AP-20481.*Acknowledged/ })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Acknowledge AP-20481" })).toBeNull();
    expect(screen.getByLabelText("Acknowledged cases").textContent).toContain("2");
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/alpha-payments/v1/cases/AP-20481/acknowledge",
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ actor: "mock.alpha-payments" })
      }
    );
  });

  it("recovers from a load error and renders the empty queue state", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("service unavailable"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tenantId: "alpha-payments", total: 0, items: [] })
      } as Response);
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);
    expect(await screen.findByRole("alert")).toHaveProperty(
      "textContent",
      "Unable to load payment investigationsPayment investigations could not be loaded.Retry"
    );

    fireEvent.click(screen.getByRole("button", { name: "Retry loading payment investigations" }));

    expect(await screen.findByRole("heading", { name: "Payment Investigation" })).toBeTruthy();
    expect(screen.getByText("0 active cases")).toBeTruthy();
    expect(screen.getByText("No payment investigations are currently assigned.")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("keeps the case actionable when acknowledgement is rejected", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => casesResponse } as Response)
        .mockResolvedValueOnce({ ok: false, status: 409 } as Response)
    );

    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: "Acknowledge AP-20481" }));

    expect(await screen.findByRole("alert")).toHaveProperty(
      "textContent",
      "Case AP-20481 could not be acknowledged."
    );
    expect(screen.getByRole("row", { name: /AP-20481.*Open/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Acknowledge AP-20481" })).toBeTruthy();
  });
});
