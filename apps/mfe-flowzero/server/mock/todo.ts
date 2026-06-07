import type { Application, Request, Response } from "express";

const WORKFLOW_BASE = "/api/flowzero/v1";

// ---- Shared helpers ----
type ListResponse<T> = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  data: T;
};

// ---- 3.1  Navigation ----
type TaskNode = { taskKey: string; taskName: string };
type WorkflowNode = {
  workflowKey: string;
  workflowName: string;
  tasks: TaskNode[];
};

const mockNavigation: WorkflowNode[] = [
  {
    workflowKey: "loan-approval",
    workflowName: "Loan Approval",
    tasks: [
      { taskKey: "review", taskName: "Review" },
      { taskKey: "approve", taskName: "Approve" },
    ],
  },
  {
    workflowKey: "account-opening",
    workflowName: "Account Opening",
    tasks: [
      { taskKey: "kyc-check", taskName: "KYC Check" },
      { taskKey: "compliance-review", taskName: "Compliance Review" },
    ],
  },
  {
    workflowKey: "trade-finance",
    workflowName: "Trade Finance",
    tasks: [
      { taskKey: "doc-verification", taskName: "Document Verification" },
      { taskKey: "risk-assessment", taskName: "Risk Assessment" },
      { taskKey: "final-approval", taskName: "Final Approval" },
    ],
  },
];

// ---- 3.2  Statistics ----
type RequestCountVo = { total: number; open: number; closed: number };

type TaskPendingNode = {
  taskKey: string;
  taskName: string;
  pendingCount: number;
};
type WorkflowPendingNode = {
  workflowKey: string;
  workflowName: string;
  pendingCount: number;
  tasks: TaskPendingNode[];
};

type TrendSeries = { name: string; values: number[] };
type RequestTrendVo = {
  interval: "Day" | "Week" | "Month";
  labels: string[];
  series: TrendSeries[];
};

const mockPendingDistribution: WorkflowPendingNode[] = [
  {
    workflowKey: "loan-approval",
    workflowName: "Loan Approval",
    pendingCount: 30,
    tasks: [
      { taskKey: "review", taskName: "Review", pendingCount: 18 },
      { taskKey: "approve", taskName: "Approve", pendingCount: 12 },
    ],
  },
  {
    workflowKey: "account-opening",
    workflowName: "Account Opening",
    pendingCount: 15,
    tasks: [
      { taskKey: "kyc-check", taskName: "KYC Check", pendingCount: 10 },
      {
        taskKey: "compliance-review",
        taskName: "Compliance Review",
        pendingCount: 5,
      },
    ],
  },
  {
    workflowKey: "trade-finance",
    workflowName: "Trade Finance",
    pendingCount: 22,
    tasks: [
      {
        taskKey: "doc-verification",
        taskName: "Document Verification",
        pendingCount: 8,
      },
      {
        taskKey: "risk-assessment",
        taskName: "Risk Assessment",
        pendingCount: 9,
      },
      {
        taskKey: "final-approval",
        taskName: "Final Approval",
        pendingCount: 5,
      },
    ],
  },
];

// ---- 3.3  Todo tasks ----
type TodoStatus = "pending" | "in-progress" | "completed";
type TodoItem = {
  taskId: string;
  taskName: string;
  status: TodoStatus;
  workflowName: string;
  requestId: string;
  createdBy: string;
  lastUpdatedBy: string;
  createTime: string;
  assigneeId: string | null;
  assigneeName: string | null;
  dueDate: string | null;
  variables: Record<string, unknown>;
};

const mockTodoItems: TodoItem[] = [
  {
    taskId: "task_001",
    taskName: "Review",
    status: "pending",
    workflowName: "Loan Approval",
    requestId: "REQ-20260501-001",
    createdBy: "user-001",
    lastUpdatedBy: "user-001",
    createTime: "2026-05-01T08:00:00Z",
    assigneeId: "user-002",
    assigneeName: "Alice",
    dueDate: "2026-05-10T00:00:00Z",
    variables: {
      applicantName: "John Doe",
      loanAmount: 50000,
      currency: "USD",
      riskLevel: "Medium",
    },
  },
  {
    taskId: "task_002",
    taskName: "KYC Check",
    status: "in-progress",
    workflowName: "Account Opening",
    requestId: "REQ-20260502-002",
    createdBy: "user-003",
    lastUpdatedBy: "user-002",
    createTime: "2026-05-02T09:30:00Z",
    assigneeId: "user-002",
    assigneeName: "Alice",
    dueDate: "2026-05-08T00:00:00Z",
    variables: {
      customerId: "CUST-202",
      country: "HK",
      accountType: "Savings",
    },
  },
  {
    taskId: "task_003",
    taskName: "Document Verification",
    status: "pending",
    workflowName: "Trade Finance",
    requestId: "REQ-20260503-003",
    createdBy: "user-004",
    lastUpdatedBy: "user-004",
    createTime: "2026-05-03T10:00:00Z",
    assigneeId: null,
    assigneeName: null,
    dueDate: "2026-05-12T00:00:00Z",
    variables: { tradeType: "LC", amount: 200000, currency: "USD" },
  },
  {
    taskId: "task_004",
    taskName: "Approve",
    status: "pending",
    workflowName: "Loan Approval",
    requestId: "REQ-20260504-004",
    createdBy: "user-005",
    lastUpdatedBy: "user-003",
    createTime: "2026-05-04T11:00:00Z",
    assigneeId: "user-003",
    assigneeName: "Bob",
    dueDate: "2026-05-15T00:00:00Z",
    variables: {
      applicantName: "Jane Smith",
      loanAmount: 80000,
      currency: "SGD",
      riskLevel: "High",
    },
  },
  {
    taskId: "task_005",
    taskName: "Risk Assessment",
    status: "in-progress",
    workflowName: "Trade Finance",
    requestId: "REQ-20260505-005",
    createdBy: "user-006",
    lastUpdatedBy: "user-006",
    createTime: "2026-05-05T08:30:00Z",
    assigneeId: "user-006",
    assigneeName: "Carol",
    dueDate: null,
    variables: { tradeType: "BG", amount: 500000, currency: "HKD" },
  },
];

// ---- 3.4  User settings ----
type UserSettingsType = "TODO_COLUMNS" | "NAVIGATION_FAVOURITES";
type UserSettingsRecord = {
  userId: string;
  type: UserSettingsType;
  name: string;
  settings: Record<string, unknown>;
  updatedAt: string;
};

// In-memory store for user settings (keyed by "type::name")
const userSettingsStore = new Map<string, UserSettingsRecord>();

// Seed a default TODO_COLUMNS setting
userSettingsStore.set("TODO_COLUMNS::default", {
  userId: "user-001",
  type: "TODO_COLUMNS",
  name: "default",
  settings: {
    columns: [
      {
        fieldId: "7337051408631599101",
        label: "Applicant Name",
        visible: true,
        order: 0,
      },
      {
        fieldId: "7337051408631599102",
        label: "Loan Amount",
        visible: true,
        order: 1,
      },
      {
        fieldId: "7337051408631599103",
        label: "Currency",
        visible: false,
        order: 2,
      },
    ],
  },
  updatedAt: "2026-05-05T10:00:00Z",
});

// ---- Assignable users ----
type AssignableUserVo = {
  id: string;
  bankId: string;
  userName: string;
  countryCode: string;
  email: string;
  roleName: string;
};

const mockAssignableUsers: AssignableUserVo[] = [
  {
    id: "7337051408631599301",
    bankId: "U001234",
    userName: "Alice",
    countryCode: "HK",
    email: "alice@sc.com",
    roleName: "Approver",
  },
  {
    id: "7337051408631599302",
    bankId: "U001235",
    userName: "Bob",
    countryCode: "SG",
    email: "bob@sc.com",
    roleName: "Approver",
  },
  {
    id: "7337051408631599303",
    bankId: "U001236",
    userName: "Carol",
    countryCode: "MY",
    email: "carol@sc.com",
    roleName: "Reviewer",
  },
];

// ---- Route registration ----
export const registerTodoMockRoutes = (app: Application) => {
  // 3.1  GET /workflow/navigation
  app.get(
    `${WORKFLOW_BASE}/workflow/navigation`,
    (_req: Request, res: Response) => {
      res.json(mockNavigation);
    }
  );

  // 3.2.1  GET /statistics/request-count
  app.get(
    `${WORKFLOW_BASE}/statistics/request-count`,
    (_req: Request, res: Response) => {
      const result: RequestCountVo = { total: 120, open: 45, closed: 75 };
      res.json(result);
    }
  );

  // 3.2.2  GET /statistics/pending-distribution
  app.get(
    `${WORKFLOW_BASE}/statistics/pending-distribution`,
    (req: Request, res: Response) => {
      const { workflowName } = req.query;
      const data = workflowName
        ? mockPendingDistribution.filter((w) => w.workflowName === workflowName)
        : mockPendingDistribution;
      res.json(data);
    }
  );

  // 3.2.3  GET /statistics/request-trend
  app.get(
    `${WORKFLOW_BASE}/statistics/request-trend`,
    (req: Request, res: Response) => {
      const interval =
        (req.query.interval as "Day" | "Week" | "Month") || "Day";
      const labels =
        interval === "Month"
          ? ["2026-02-01", "2026-03-01", "2026-04-01", "2026-05-01"]
          : interval === "Week"
          ? [
              "2026-03-30",
              "2026-04-06",
              "2026-04-13",
              "2026-04-20",
              "2026-04-27",
            ]
          : [
              "2026-04-01",
              "2026-04-02",
              "2026-04-03",
              "2026-04-04",
              "2026-04-05",
            ];

      const result: RequestTrendVo = {
        interval,
        labels,
        series:
          interval === "Month"
            ? [
                { name: "open", values: [45, 60, 80, 30] },
                { name: "closed", values: [40, 55, 72, 25] },
              ]
            : interval === "Week"
            ? [
                { name: "open", values: [12, 20, 18, 25, 15] },
                { name: "closed", values: [8, 15, 14, 20, 12] },
              ]
            : [
                { name: "open", values: [5, 8, 6, 10, 7] },
                { name: "closed", values: [3, 6, 4, 8, 5] },
              ],
      };
      res.json(result);
    }
  );

  // 3.3  GET /tasks/assigned-to-me
  app.get(`${WORKFLOW_BASE}/tasks/inbox`, (req: Request, res: Response) => {
    const {
      workflowName,
      taskName,
      createdBy,
      status,
      page = "0",
      size = "20",
    } = req.query;

    let filtered = [...mockTodoItems];
    if (workflowName)
      filtered = filtered.filter((t) => t.workflowName === workflowName);
    if (taskName) filtered = filtered.filter((t) => t.taskName === taskName);
    if (createdBy) filtered = filtered.filter((t) => t.createdBy === createdBy);
    if (status) filtered = filtered.filter((t) => t.status === status);

    const pageNum = parseInt(page as string, 10);
    const pageSize = parseInt(size as string, 10);
    const start = pageNum * pageSize;
    const data = filtered.slice(start, start + pageSize);

    const result: ListResponse<TodoItem[]> = {
      page: pageNum,
      size: pageSize,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
      data,
    };
    res.json(result);
  });

  // 3.3.1  GET /tasks/assignable-users
  app.get(
    `${WORKFLOW_BASE}/tasks/assignable-users`,
    (_req: Request, res: Response) => {
      res.json(mockAssignableUsers);
    }
  );

  // 3.4  GET /user/settings/:type/:name
  app.get(
    `${WORKFLOW_BASE}/user/settings/:type/:name`,
    (req: Request, res: Response) => {
      const { type, name } = req.params;
      const key = `${type}::${name}`;
      const record = userSettingsStore.get(key);
      if (!record) {
        res.status(400).json({ error: "Settings not found" });
        return;
      }
      res.json(record);
    }
  );

  // 3.4  PUT /user/settings/:type/:name
  app.put(
    `${WORKFLOW_BASE}/user/settings/:type/:name`,
    (req: Request, res: Response) => {
      const { type, name } = req.params;
      const key = `${type}::${name}`;
      const now = new Date().toISOString();
      const record: UserSettingsRecord = {
        userId: "user-001",
        type: type as UserSettingsType,
        name,
        settings: req.body?.settings ?? {},
        updatedAt: now,
      };
      userSettingsStore.set(key, record);
      res.json({
        userId: record.userId,
        type: record.type,
        name: record.name,
        updatedAt: now,
      });
    }
  );

  // 3.4  DELETE /user/settings/:type/:name
  app.delete(
    `${WORKFLOW_BASE}/user/settings/:type/:name`,
    (req: Request, res: Response) => {
      const { type, name } = req.params;
      const key = `${type}::${name}`;
      if (!userSettingsStore.has(key)) {
        res.status(400).json({ error: "Settings record not found" });
        return;
      }
      userSettingsStore.delete(key);
      res.json({ message: "Deleted successfully" });
    }
  );
};
