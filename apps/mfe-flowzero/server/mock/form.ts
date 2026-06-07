import type { Application, Request, Response } from "express";

type FormStatusEnum = "DRAFT" | "PUBLISHED" | string;

type FormFieldRef = {
  fieldId: string;
  required?: boolean;
  order?: number;
  label?: string;
  uiType?: string;
  dataType?: string;
  defaultValue?: string;
  dataMaxLength?: number;
  status?: string;
  metadata?: Array<{ id: string; value: string; default: boolean }>;
  usedInReporting?: string;
  usedInInboxSearching?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
};

type FormResource = {
  id: string;
  name: string;
  status: FormStatusEnum;
  formModelUrl?: string;
  description?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  version?: number;
};

type FormDetailVo = FormResource & {
  fields?: FormFieldRef[];
};

type CreateFormRequest = Pick<FormResource, "name" | "description">;

type UpdateFormRequest = Pick<FormDetailVo, "id" | "name" | "description"> & {
  formModel?: string;
  fieldIds?: string[];
};

type FormNameCheckRequest = Pick<FormResource, "name" | "id">;

type ListResponse<T> = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  data: T;
};

const WORKFLOW_BASE = "/api/flowzero/v1";

const nowIso = () => new Date().toISOString();
const createId = () =>
  `form_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const mockForms: FormDetailVo[] = [
  {
    id: "form_001",
    name: "Employee Onboarding",
    status: "PUBLISHED",
    description: "Onboarding form for new employees",
    createdAt: "2024-01-15T06:00:00.000Z",
    createdBy: "admin",
    updatedAt: "2024-02-03T08:45:00.000Z",
    updatedBy: "admin",
    version: 2,
    fields: [
      { fieldId: "field_employee_name", required: true, order: 1, label: "Employee Name", uiType: "TEXT", dataType: "STRING" },
      { fieldId: "field_department", required: true, order: 2, label: "Department", uiType: "DROPDOWN", dataType: "STRING" },
      { fieldId: "field_start_date", required: true, order: 3, label: "Start Date", uiType: "DATE", dataType: "DATE" },
    ],
  },
  {
    id: "form_002",
    name: "Purchase Request",
    status: "DRAFT",
    description: "Internal purchase request form",
    createdAt: "2024-02-01T09:00:00.000Z",
    createdBy: "admin",
    updatedAt: "2024-02-11T10:15:00.000Z",
    updatedBy: "admin",
    version: 1,
    fields: [
      { fieldId: "field_item_name", required: true, order: 1, label: "Item Name", uiType: "TEXT", dataType: "STRING" },
      { fieldId: "field_amount", required: true, order: 2, label: "Amount", uiType: "NUMBER", dataType: "NUMBER" },
      { fieldId: "field_reason", required: false, order: 3, label: "Reason", uiType: "TEXTAREA", dataType: "STRING" },
    ],
  },
  {
    id: "form_003",
    name: "Travel Application",
    status: "PUBLISHED",
    description: "Request approval for travel",
    createdAt: "2024-03-01T07:00:00.000Z",
    createdBy: "admin",
    updatedAt: "2024-03-20T09:20:00.000Z",
    updatedBy: "admin",
    version: 3,
    fields: [
      { fieldId: "field_destination", required: true, order: 1, label: "Destination", uiType: "TEXT", dataType: "STRING" },
      { fieldId: "field_dates", required: true, order: 2, label: "Travel Dates", uiType: "DATE_RANGE", dataType: "DATE" },
      { fieldId: "field_budget", required: false, order: 3, label: "Budget", uiType: "NUMBER", dataType: "NUMBER" },
    ],
  },
];

export const registerFormMockRoutes = (app: Application) => {
  // 1. Create a new form
  app.post(`${WORKFLOW_BASE}/form/create`, (req: Request, res: Response) => {
    const payload = (req.body || {}) as CreateFormRequest;
    const now = nowIso();

    if (!payload.name) {
      res.status(400).send({ message: "name is required" });
      return;
    }

    const created: FormDetailVo = {
      id: createId(),
      name: payload.name,
      status: "DRAFT",
      description: payload.description,
      createdAt: now,
      createdBy: "current_user",
      updatedAt: now,
      updatedBy: "current_user",
      version: 1,
      fields: [],
    };
    mockForms.unshift(created);
    res.send(created);
  });

  // 2. Update an existing form
  app.post(`${WORKFLOW_BASE}/form/save`, (req: Request, res: Response) => {
    const payload = (req.body || {}) as UpdateFormRequest;
    const now = nowIso();

    if (!payload.id) {
      res.status(400).send({ message: "id is required" });
      return;
    }

    const index = mockForms.findIndex((form) => form.id === payload.id);
    if (index === -1) {
      res.status(404).send({ message: "form not found" });
      return;
    }

    const updated: FormDetailVo = {
      ...mockForms[index],
      name: payload.name ?? mockForms[index].name,
      description: payload.description ?? mockForms[index].description,
      updatedAt: now,
      updatedBy: "current_user",
    };
    mockForms[index] = updated;
    res.send(updated);
  });

  // 3. Get form detail
  app.get(
    `${WORKFLOW_BASE}/form/detail/:formId`,
    (req: Request, res: Response) => {
      const { formId } = req.params;
      const form = mockForms.find((item) => item.id === formId);
      if (!form) {
        res.status(404).send({ message: "form not found" });
        return;
      }
      res.send(form);
    }
  );

  // 4. Query forms by condition (paged)
  app.get(`${WORKFLOW_BASE}/form/page`, (req: Request, res: Response) => {
    const name =
      typeof req.query.name === "string" ? req.query.name : undefined;
    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;
    const sortBy =
      typeof req.query.sortBy === "string" ? req.query.sortBy : undefined;
    const sortDirection =
      typeof req.query.sortDirection === "string"
        ? req.query.sortDirection
        : undefined;
    const page = Math.max(
      parseInt(typeof req.query.page === "string" ? req.query.page : "1", 10) ||
        1,
      1
    );
    const size = Math.max(
      parseInt(
        typeof req.query.size === "string" ? req.query.size : "10",
        10
      ) || 10,
      1
    );

    let filtered: FormResource[] = mockForms.map(
      ({ fields: _fields, ...rest }) => rest
    );
    if (name) {
      const keyword = name.toLowerCase();
      filtered = filtered.filter((form) =>
        form.name.toLowerCase().includes(keyword)
      );
    }
    if (status) {
      filtered = filtered.filter((form) => form.status === status);
    }
    if (sortBy) {
      filtered.sort((a, b) => {
        const aVal = String((a as Record<string, unknown>)[sortBy] ?? "");
        const bVal = String((b as Record<string, unknown>)[sortBy] ?? "");
        const cmp = aVal.localeCompare(bVal);
        return sortDirection === "DESC" ? -cmp : cmp;
      });
    }

    const totalElements = filtered.length;
    const totalPages = Math.max(Math.ceil(totalElements / size), 1);
    const startIndex = (page - 1) * size;
    const data = filtered.slice(startIndex, startIndex + size);

    const response: ListResponse<FormResource[]> = {
      page,
      size,
      totalElements,
      totalPages,
      data,
    };
    res.send(response);
  });

  // 5. Publish form
  app.post(
    `${WORKFLOW_BASE}/form/publish/:formId`,
    (req: Request, res: Response) => {
      const { formId } = req.params;
      const index = mockForms.findIndex((form) => form.id === formId);
      if (index === -1) {
        res.status(404).send("form not found");
        return;
      }
      mockForms[index] = {
        ...mockForms[index],
        status: "PUBLISHED",
        updatedAt: nowIso(),
        updatedBy: "current_user",
      };
      res.type("text").send("OK");
    }
  );

  // 6. Check name availability
  app.post(
    `${WORKFLOW_BASE}/form/check-name`,
    (req: Request, res: Response) => {
      const { name, id } = (req.body || {}) as FormNameCheckRequest;
      if (!name) {
        res.status(400).send(false);
        return;
      }
      const normalized = name.trim().toLowerCase();
      const exists = mockForms.some(
        (form) =>
          form.name.trim().toLowerCase() === normalized &&
          (!id || form.id !== id)
      );
      res.send(!exists);
    }
  );

  // 7. Delete form
  app.post(
    `${WORKFLOW_BASE}/form/delete/:formId`,
    (req: Request, res: Response) => {
      const { formId } = req.params;
      const index = mockForms.findIndex((form) => form.id === formId);
      if (index === -1) {
        res.status(404).send("form not found");
        return;
      }
      mockForms.splice(index, 1);
      res.type("text").send("OK");
    }
  );

  // 8. Copy form
  app.post(
    `${WORKFLOW_BASE}/form/copy/:formId`,
    (req: Request, res: Response) => {
      const { formId } = req.params;
      const source = mockForms.find((form) => form.id === formId);
      if (!source) {
        res.status(404).send({ message: "form not found" });
        return;
      }

      const now = nowIso();
      const copied: FormDetailVo = {
        ...source,
        id: createId(),
        name: `${source.name} Copy`,
        status: "DRAFT",
        createdAt: now,
        createdBy: "current_user",
        updatedAt: now,
        updatedBy: "current_user",
        version: 1,
      };
      mockForms.unshift(copied);
      res.send(copied);
    }
  );

  // 9. Query published forms (no pagination)
  app.get(
    `${WORKFLOW_BASE}/form/published-forms`,
    (req: Request, res: Response) => {
      const name =
        typeof req.query.name === "string" ? req.query.name : undefined;
      let filtered: FormResource[] = mockForms
        .filter((form) => form.status === "PUBLISHED")
        .map(({ fields: _fields, ...rest }) => rest);
      if (name) {
        const keyword = name.toLowerCase();
        filtered = filtered.filter((form) =>
          form.name.toLowerCase().includes(keyword)
        );
      }
      res.send(filtered);
    }
  );
};
