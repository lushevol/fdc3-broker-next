import { Service } from "src/Root/import";

import { DEFAULT_HEADERS, WORKFLOW } from "../index";

const { service } = Service;

export type FormStatusEnum = "DRAFT" | "PUBLISHED";

export interface FormFieldRef {
  id: string;
  indexedTerm: string;
  required?: boolean;
  order?: number;
  label?: string;
  uiType?: string;
  dataType?: string;
  defaultValue?: string;
  dataMaxLength?: number;
  status?: string;
  metadata?: Array<{
    id: string;
    label?: string;
    value: string;
    default: boolean;
  }>;
  usedInReporting?: string;
  usedInInboxSearching?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface FormResource {
  id: string;
  name: string;
  status: FormStatusEnum;
  formModelUrl?: string;
  description?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  url?: string;
  version?: number;
}

export type CreateFormRequest = Pick<FormResource, "name" | "description">;
export type FormNameCheckRequest = Pick<FormResource, "name" | "id">;

export type UpdateFormRequest = Pick<
  FormDetailVo,
  "id" | "name" | "description"
> & {
  formModel?: string;
  fieldIds?: string[];
};

export interface FormDetailVo extends FormResource {
  fields?: FormFieldRef[];
}

type ListResponse<T> = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  data: T;
};

export type FormPageResponseVo = ListResponse<FormResource[]>;

export interface FormPageQueryParams {
  name?: string;
  status?: FormStatusEnum;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface PublishedFormsQueryParams {
  name?: string;
}

// 1. Create a new form
export const createForm = (data: CreateFormRequest) =>
  service.post<CreateFormRequest, FormResource>(
    `${WORKFLOW}/form/create`,
    data,
    { headers: DEFAULT_HEADERS }
  );

// 2. Update an existing form
export const updateForm = (data: UpdateFormRequest) =>
  service.post<UpdateFormRequest, FormResource>(`${WORKFLOW}/form/save`, data, {
    headers: DEFAULT_HEADERS,
  });

// 3. Get form detail
export const getFormDetail = (formId: string) =>
  service.get<string, FormDetailVo>(`${WORKFLOW}/form/detail/${formId}`, {
    headers: DEFAULT_HEADERS,
  });

// 4. Query forms by condition (paged)
export const getFormPage = (params: FormPageQueryParams) =>
  service.get<FormPageQueryParams, FormPageResponseVo>(
    `${WORKFLOW}/form/page`,
    { params, headers: DEFAULT_HEADERS }
  );

// 5. Publish form
export const publishForm = (formId: string) =>
  service.post(`${WORKFLOW}/form/publish/${formId}`, undefined, {
    responseType: "text",
    headers: DEFAULT_HEADERS,
  });

// 6. Check name availability
export const checkFormName = (data: FormNameCheckRequest) =>
  service.post<FormNameCheckRequest, boolean>(
    `${WORKFLOW}/form/check-name`,
    data,
    { headers: DEFAULT_HEADERS }
  );

// 7. Delete form
export const deleteForm = (formId: string) =>
  service.post(`${WORKFLOW}/form/delete/${formId}`, undefined, {
    responseType: "text",
    headers: DEFAULT_HEADERS,
  });

// 8. Copy form
export const copyForm = (formId: string) =>
  service.post<void, FormResource>(
    `${WORKFLOW}/form/copy/${formId}`,
    undefined,
    {
      headers: DEFAULT_HEADERS,
    }
  );

// 9. Query published forms (no pagination)
export const getPublishedForms = (params: PublishedFormsQueryParams) =>
  service.get<PublishedFormsQueryParams, FormResource[]>(
    `${WORKFLOW}/form/published-forms`,
    { params, headers: DEFAULT_HEADERS }
  );

// 10. Get json model of a form
export const getFormModelByFileName = async (fileName: string) => {
  try {
    let prefix = "/static/flowzero";
    const url = prefix + fileName + `?t=${Date.now()}`; // Add timestamp to prevent caching
    const response = await fetch(url);
    return response.json();
  } catch (e) {
    console.error("Failed to fetch form model:", e);
    return null;
  }
};
const getFormUrlByFileName = (fileName: string) =>
  service.get<string, string>(
    `${WORKFLOW}/file/download-url?fileName=${fileName}&storageType=NAS`,
    { headers: DEFAULT_HEADERS }
  );
