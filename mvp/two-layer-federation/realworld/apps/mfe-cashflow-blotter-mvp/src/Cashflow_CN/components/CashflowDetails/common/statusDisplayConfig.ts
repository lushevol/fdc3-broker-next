export const cashflowCNStatus = {
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
    tooltip: "Cashflow not processed and marked as failed by system or user",
  },
  RELEASED: {
    label: "RELEASED",
    className: "released",
    tooltip: "Cash flow message has been released to payment gateway",
  },
  SETTLED: {
    label: "SETTLED",
    className: "settled",
    tooltip: "Released from payment gateway or no SWIFT required for receipt",
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
    tooltip: "Net resultant Cashflow has been cancelled due to Un-net action",
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

export const tradeStatus = {
  HOLD: {
    label: "HOLD",
    className: "holded",
    tooltip:
      "	Trade held from post trade processing but feeds risk and position reporting",
  },
  TOBESENT: {
    label: "TO BE SENT",
    className: "to-be-sented",
    tooltip: "Confirmation yet to be sent",
  },
  SENT: {
    label: "SENT",
    className: "sented",
    tooltip: "Confirmation sent but yet to be matched",
  },
  AFFIRMED: {
    label: "AFFIRMED",
    className: "affirmed",
    tooltip: "Trade externally affirmed but Confirmation not matched",
  },
  CONFIRMED: {
    label: "CONFIRMED",
    className: "confirmed",
    tooltip: "Confirmation successfully matched",
  },
  DISCARDED: {
    label: "DISCARDED",
    className: "discarded",
    tooltip: "Discarded",
  },
  HYPO: {
    label: "HYPO",
    className: "hypo",
    tooltip: "Hypo",
  },
  VALIDATED: {
    label: "VALIDATED",
    className: "validated",
    tooltip: "Validated",
  },
};
