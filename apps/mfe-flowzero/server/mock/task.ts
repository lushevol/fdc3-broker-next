import type { Application, Request, Response } from "express";

type TaskVo = {
  id: string;
  name: string;
  taskDefinitionKey: string;
  processDefinitionId: string;
  processInstanceId: string;
  assignee: string;
  createTime: string;
  workflowName: string;
  requester: string;
  dueDate: string;
  variables: Record<string, unknown>;
};

type BatchOperationDto = {
  IdList: string[];
  toUserId: string;
};

type BatchItemResultVo = {
  id: string;
  status: "SUCCESS" | "FAILED";
  message: string;
};

type BatchOperationResultVo = {
  status: "SUCCESS" | "PARTIAL_SUCCESS" | "FAILED";
  results: BatchItemResultVo[];
};

type ListResponse<T> = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  data: T;
};

const WORKFLOW_BASE = "/api/ratan/api/v1";

const mockPendingClaimTasks: TaskVo[] = [
  {
    id: "task_pc_001",
    name: "Review Contract",
    taskDefinitionKey: "review_contract",
    processDefinitionId: "proc_def_001",
    processInstanceId: "proc_inst_001",
    assignee: "",
    createTime: "2025-03-01T08:00:00.000Z",
    workflowName: "Contract Approval",
    requester: "alice",
    dueDate: "2025-03-05T17:00:00.000Z",
    variables: { contractId: "CTR-001" },
  },
  {
    id: "task_pc_002",
    name: "Verify KYC Documents",
    taskDefinitionKey: "verify_kyc",
    processDefinitionId: "proc_def_002",
    processInstanceId: "proc_inst_002",
    assignee: "",
    createTime: "2025-03-02T09:30:00.000Z",
    workflowName: "KYC Onboarding",
    requester: "bob",
    dueDate: "2025-03-06T17:00:00.000Z",
    variables: { customerId: "CUST-202" },
  },
  {
    id: "task_pc_003",
    name: "Approve Purchase Order",
    taskDefinitionKey: "approve_po",
    processDefinitionId: "proc_def_003",
    processInstanceId: "proc_inst_003",
    assignee: "",
    createTime: "2025-03-03T10:00:00.000Z",
    workflowName: "Purchase Request",
    requester: "carol",
    dueDate: "2025-03-07T17:00:00.000Z",
    variables: { poNumber: "PO-3001", amount: 4500 },
  },
];

const mockTeamTasks: TaskVo[] = [
  {
    id: "task_team_001",
    name: "Check Compliance Report",
    taskDefinitionKey: "check_compliance",
    processDefinitionId: "proc_def_010",
    processInstanceId: "proc_inst_010",
    assignee: "david",
    createTime: "2025-03-01T07:00:00.000Z",
    workflowName: "Compliance Review",
    requester: "eve",
    dueDate: "2025-03-04T17:00:00.000Z",
    variables: { reportId: "RPT-101" },
  },
  {
    id: "task_team_002",
    name: "Evaluate Vendor Proposal",
    taskDefinitionKey: "evaluate_vendor",
    processDefinitionId: "proc_def_011",
    processInstanceId: "proc_inst_011",
    assignee: "frank",
    createTime: "2025-03-02T08:30:00.000Z",
    workflowName: "Vendor Onboarding",
    requester: "grace",
    dueDate: "2025-03-08T17:00:00.000Z",
    variables: { vendorId: "VND-050" },
  },
  {
    id: "task_team_003",
    name: "Sign Off Budget Plan",
    taskDefinitionKey: "sign_budget",
    processDefinitionId: "proc_def_012",
    processInstanceId: "proc_inst_012",
    assignee: "henry",
    createTime: "2025-03-04T11:00:00.000Z",
    workflowName: "Annual Budget",
    requester: "irene",
    dueDate: "2025-03-10T17:00:00.000Z",
    variables: { fiscalYear: 2025, budget: 120000 },
  },
];

const buildPagedResponse = <T>(
  items: T[],
  name: string | undefined,
  nameKey: keyof T,
  page: number,
  size: number,
  sortBy: string | undefined,
  sortDirection: string | undefined
): ListResponse<T[]> => {
  let filtered = [...items];

  if (name) {
    const keyword = name.toLowerCase();
    filtered = filtered.filter((item) =>
      String(item[nameKey] ?? "")
        .toLowerCase()
        .includes(keyword)
    );
  }

  if (sortBy) {
    filtered.sort((a, b) => {
      const aVal = String((a as Record<string, unknown>)[sortBy] ?? "");
      const bVal = String((b as Record<string, unknown>)[sortBy] ?? "");
      const cmp = aVal.localeCompare(bVal);
      return sortDirection === "ASC" ? cmp : -cmp;
    });
  }

  const totalElements = filtered.length;
  const totalPages = Math.max(Math.ceil(totalElements / size), 1);
  const data = filtered.slice((page - 1) * size, page * size);

  return { page, size, totalElements, totalPages, data };
};

const parsePageParams = (query: Request["query"]) => ({
  name: typeof query.name === "string" ? query.name : undefined,
  page: Math.max(parseInt(String(query.page || "1"), 10) || 1, 1),
  size: Math.max(parseInt(String(query.size || "20"), 10) || 20, 1),
  sortBy: typeof query.sortBy === "string" ? query.sortBy : undefined,
  sortDirection:
    typeof query.sortDirection === "string" ? query.sortDirection : "DESC",
});

export const registerTaskMockRoutes = (app: Application) => {
  // 1. Get pending-claim tasks
  app.get(
    `${WORKFLOW_BASE}/tasks/pending-claim-list`,
    (req: Request, res: Response) => {
      const { name, page, size, sortBy, sortDirection } = parsePageParams(
        req.query
      );
      res.send(
        buildPagedResponse(
          mockPendingClaimTasks,
          name,
          "name",
          page,
          size,
          sortBy,
          sortDirection
        )
      );
    }
  );

  // 2. Get team tasks
  app.get(
    `${WORKFLOW_BASE}/tasks/team-task-list`,
    (req: Request, res: Response) => {
      const { name, page, size, sortBy, sortDirection } = parsePageParams(
        req.query
      );
      res.send(
        buildPagedResponse(
          mockTeamTasks,
          name,
          "name",
          page,
          size,
          sortBy,
          sortDirection
        )
      );
    }
  );

  // 3. Batch claim tasks
  app.post(
    `${WORKFLOW_BASE}/tasks/batch/claim`,
    (req: Request, res: Response) => {
      const { IdList, toUserId } = (req.body || {}) as BatchOperationDto;
      if (!IdList?.length || !toUserId) {
        res.status(400).send({ message: "IdList and toUserId are required" });
        return;
      }
      const results: BatchItemResultVo[] = IdList.map((id) => ({
        id,
        status: "SUCCESS",
        message: "Task claimed successfully",
      }));
      const response: BatchOperationResultVo = {
        status: "SUCCESS",
        results,
      };
      res.send(response);
    }
  );

  // 4. Batch assign tasks
  app.post(
    `${WORKFLOW_BASE}/tasks/batch/assign`,
    (req: Request, res: Response) => {
      const { IdList, toUserId } = (req.body || {}) as BatchOperationDto;
      if (!IdList?.length || !toUserId) {
        res.status(400).send({ message: "IdList and toUserId are required" });
        return;
      }
      const results: BatchItemResultVo[] = IdList.map((id) => ({
        id,
        status: "SUCCESS",
        message: "Task assigned successfully",
      }));
      const response: BatchOperationResultVo = {
        status: "SUCCESS",
        results,
      };
      res.send(response);
    }
  );
};
