import type { Application, Request, Response } from "express";

type CandidateGroupVo = {
  id: string;
  name: string;
  description: string;
};

type ListResponse<T> = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  data: T;
};

const WORKFLOW_BASE = "/api/ratan/api/v1";

const mockCandidateGroups: CandidateGroupVo[] = [
  {
    id: "cg_001",
    name: "Finance Approvers",
    description: "Group responsible for approving financial transactions",
  },
  {
    id: "cg_002",
    name: "HR Reviewers",
    description: "Human resources team for reviewing employee requests",
  },
  {
    id: "cg_003",
    name: "Compliance Officers",
    description: "Team handling regulatory compliance tasks",
  },
  {
    id: "cg_004",
    name: "IT Support",
    description: "IT support team for technical task assignments",
  },
  {
    id: "cg_005",
    name: "Legal Advisors",
    description: "Legal team for contract and document review",
  },
];

export const registerCandidateMockRoutes = (app: Application) => {
  // 1. Query candidate groups with pagination
  app.get(
    `${WORKFLOW_BASE}/candidate-group/page`,
    (req: Request, res: Response) => {
      const name =
        typeof req.query.name === "string" ? req.query.name : undefined;
      const sortBy =
        typeof req.query.sortBy === "string" ? req.query.sortBy : undefined;
      const sortDirection =
        typeof req.query.sortDirection === "string"
          ? req.query.sortDirection
          : "DESC";
      const page = Math.max(
        parseInt(String(req.query.page || "1"), 10) || 1,
        1
      );
      const size = Math.max(
        parseInt(String(req.query.size || "20"), 10) || 20,
        1
      );

      let filtered = [...mockCandidateGroups];

      if (name) {
        const keyword = name.toLowerCase();
        filtered = filtered.filter((cg) =>
          cg.name.toLowerCase().includes(keyword)
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

      const response: ListResponse<CandidateGroupVo[]> = {
        page,
        size,
        totalElements,
        totalPages,
        data,
      };
      res.send(response);
    }
  );

  // 2. Get candidate group detail by ID
  app.get(
    `${WORKFLOW_BASE}/candidate-group/detail/:id`,
    (req: Request, res: Response) => {
      const group = mockCandidateGroups.find((cg) => cg.id === req.params.id);
      if (!group) {
        res.status(404).send({ message: "candidate group not found" });
        return;
      }
      res.send(group);
    }
  );
};
