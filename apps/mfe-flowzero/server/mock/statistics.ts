import type { Application, Request, Response } from "express";

const WORKFLOW_BASE = "/api/flowzero/v1";

// ── Mock data ─────────────────────────────────────────────────────────────────

const REQUEST_COUNT = {
  all: { total: 120, open: 45, closed: 75 },
  me: { total: 36, open: 9, closed: 27 },
};

const PENDING_DISTRIBUTION_ALL = [
  {
    workflowKey: "trade-confirmation",
    workflowName: "Trade Confirmation",
    pendingCount: 2,
    tasks: [
      { taskKey: "review-verify", taskName: "Review & Verify", pendingCount: 1 },
      { taskKey: "approve", taskName: "Approve", pendingCount: 1 },
    ],
  },
  {
    workflowKey: "settlement",
    workflowName: "Settlement",
    pendingCount: 2,
    tasks: [
      { taskKey: "settlement-check", taskName: "Settlement Check", pendingCount: 2 },
    ],
  },
  {
    workflowKey: "reconciliation",
    workflowName: "Reconciliation",
    pendingCount: 2,
    tasks: [
      { taskKey: "reconcile", taskName: "Reconcile", pendingCount: 1 },
      { taskKey: "sign-off", taskName: "Sign Off", pendingCount: 1 },
    ],
  },
  {
    workflowKey: "kyc-refresh",
    workflowName: "KYC Refresh",
    pendingCount: 1,
    tasks: [
      { taskKey: "kyc-review", taskName: "KYC Review", pendingCount: 1 },
    ],
  },
];

const PENDING_DISTRIBUTION_ME = [
  {
    workflowKey: "trade-confirmation",
    workflowName: "Trade Confirmation",
    pendingCount: 1,
    tasks: [
      { taskKey: "review-verify", taskName: "Review & Verify", pendingCount: 1 },
    ],
  },
  {
    workflowKey: "settlement",
    workflowName: "Settlement",
    pendingCount: 1,
    tasks: [
      { taskKey: "settlement-check", taskName: "Settlement Check", pendingCount: 1 },
    ],
  },
];

// Generate daily labels for the last N days from today
const generateDailyLabels = (days: number): string[] => {
  const labels: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    labels.push(d.toISOString().slice(0, 10));
  }
  return labels;
};

const generateWeeklyLabels = (weeks: number): string[] => {
  const labels: string[] = [];
  const today = new Date();
  // Align to Monday
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(monday);
    d.setDate(monday.getDate() - i * 7);
    labels.push(d.toISOString().slice(0, 10));
  }
  return labels;
};

const generateMonthlyLabels = (months: number): string[] => {
  const labels: string[] = [];
  const today = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    labels.push(d.toISOString().slice(0, 10));
  }
  return labels;
};

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const buildTrendResponse = (interval: string, scope: string) => {
  let labels: string[];
  let open: number[];
  let closed: number[];
  const isMe = scope === "INITIATOR";

  if (interval === "Week") {
    labels = generateWeeklyLabels(5);
    if (isMe) {
      open = [3, 5, 4, 6, 4];
      closed = [2, 4, 3, 5, 3];
    } else {
      open = [12, 20, 18, 25, 15];
      closed = [8, 15, 14, 20, 12];
    }
  } else if (interval === "Month") {
    labels = generateMonthlyLabels(4);
    if (isMe) {
      open = [10, 14, 20, 9];
      closed = [9, 12, 18, 7];
    } else {
      open = [45, 60, 80, 30];
      closed = [40, 55, 72, 25];
    }
  } else {
    // Day (default)
    labels = generateDailyLabels(30);
    const scale = isMe ? 1 : 3;
    open = labels.map(() => randInt(1, 8) * scale);
    closed = labels.map(() => randInt(0, 6) * scale);
  }

  return {
    interval,
    labels,
    series: [
      { name: "open", values: open },
      { name: "closed", values: closed },
    ],
  };
};

// ── Route registration ────────────────────────────────────────────────────────

export const registerStatisticsMockRoutes = (app: Application) => {
  // 1. GET /statistics/request-count
  app.get(
    `${WORKFLOW_BASE}/statistics/request-count`,
    (req: Request, res: Response) => {
      const scope = req.query.scope as string;
      res.json(scope === "INITIATOR" ? REQUEST_COUNT.me : REQUEST_COUNT.all);
    }
  );

  // 2. GET /statistics/pending-distribution
  app.get(
    `${WORKFLOW_BASE}/statistics/pending-distribution`,
    (req: Request, res: Response) => {
      const scope = req.query.scope as string;
      const workflowName =
        typeof req.query.workflowName === "string"
          ? req.query.workflowName
          : undefined;

      const source = scope === "INITIATOR" ? PENDING_DISTRIBUTION_ME : PENDING_DISTRIBUTION_ALL;

      if (workflowName) {
        const found = source.find((w) => w.workflowName === workflowName);
        res.json(found ? [found] : []);
      } else {
        res.json(source);
      }
    }
  );

  // 3. GET /statistics/request-trend
  app.get(
    `${WORKFLOW_BASE}/statistics/request-trend`,
    (req: Request, res: Response) => {
      const scope = (req.query.scope as string) ?? "ALL";
      const interval =
        typeof req.query.interval === "string" ? req.query.interval : "Day";
      res.json(buildTrendResponse(interval, scope));
    }
  );
};
