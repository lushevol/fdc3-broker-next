import { render, screen } from "@testing-library/react";

import { StatusChain } from "./index";

afterAll(() => {
  jest.clearAllMocks();
});

describe("StatusChain component", () => {
  it("should be in the document", async () => {
    const statusChain = ["QUEUED", "CASHFLOW_SUPPRESSED"];
    const statusConfig = {
      PROJECTED: {
        label: "PROJECTED",
        className: "projected",
        tooltip: "Cashflow generated but not yet due for settlement",
      },
      QUEUED: {
        label: "QUEUED",
        className: "queued",
        tooltip: "Cashflow due for settlement",
      },
      WAITING: {
        label: "WAITING",
        className: "waiting",
        tooltip: "Cashflow pending for user action",
      },
      READY: {
        label: "READY",
        className: "ready",
        tooltip: "Cashflow waiting for auto release to payment gateway",
      },
      NOSTRO_MATCHED: {
        label: "NOSTRO MATCHED",
        className: "nostro-matched",
        tooltip:
          "Cashflow has been successfully reconciled against Nostro statement",
      },
      FAILED: {
        label: "FAILED",
        className: "failed",
        tooltip:
          "Cashflow not processed and marked as failed by system or user",
      },
      RELEASED: {
        label: "RELEASED",
        className: "released",
        tooltip: "Cash flow message has been released to payment gateway",
      },
      SETTLED: {
        label: "SETTLED",
        className: "settled",
        tooltip:
          "Released from payment gateway or no SWIFT required for receipt",
      },
      SWIFT_SUPPRESSED: {
        label: "Swift SUPPRESSED",
        className: "swift-suppressed",
        tooltip:
          "Payment / Receipt SWIFT is suppressed but Settlement Accounting will be generated",
      },
      CASHFLOW_SUPPRESSED: {
        label: "Cashflow SUPPRESSED",
        className: "cashflow-suppressed",
        tooltip: "No SWIFT or Settlement Accounting will be generated",
      },
      CANCELLED: {
        label: "CANCELLED",
        className: "cancelled",
        tooltip: "Cashflow has been cancelled due to a trade event",
      },
      DEAD: {
        label: "DEAD",
        className: "dead",
        tooltip:
          "Net resultant Cashflow has been cancelled due to Un-net action",
      },
      NETTED: {
        label: "NETTED",
        className: "netted",
        tooltip:
          "Cashflow has been netted part of a netting set and replaced by a net cashflow",
      },
      SPLIT: {
        label: "SPLIT",
        className: "split",
        tooltip: "Cashflow has been split into multiple payments",
      },
      HOLD: {
        label: "HOLD",
        className: "hold",
        tooltip: "Cashflow has been put on hold by user",
      },
    };
    render(
      <StatusChain
        statusChain={statusChain}
        statusConfig={statusConfig}
      />
    );
    expect(screen).toBeDefined();
  });
});
