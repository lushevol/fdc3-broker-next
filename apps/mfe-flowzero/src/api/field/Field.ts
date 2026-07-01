import { FieldDataType } from "src/pages/FieldsManagement/fieldType";
import { Service } from "src/Root/import";
import type {
  createFieldsParams,
  DeleteFieldsParams,
  DisableFieldsParams,
  GetFieldsParams,
  UpdateFieldsParams,
} from "src/types/workflow";

import {
  buildQueryString,
  DEFAULT_HEADERS,
  type ListResponse,
  WORKFLOW,
} from "../index";

const { service } = Service;

export interface FieldOption {
  id: string;
  label: string;
  value: string;
  default: boolean;
}

export interface FieldEntity {
  formNames: string[];
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
  indexedTerm: string;
  label: string;
  uiType: string;
  dataType: FieldDataType;
  defaultValue?: string;
  dataMaxLength: number | null;
  status: string;
  metadata: FieldOption[];
  usedInReporting: "Y" | "N";
  usedInInboxSearching: "Y" | "N";
}

export const getFieldslList = (params: GetFieldsParams) => {
  const queryParams = buildQueryString(params);
  return service.get<ListResponse<FieldEntity[]>, ListResponse<FieldEntity[]>>(
    `${WORKFLOW}/fields/find-by-condition?${queryParams}`,
    { headers: DEFAULT_HEADERS }
  );
};

export const checkDuplicateField = (data: { id: string; label: string }) =>
  service.post(`${WORKFLOW}/fields/check-label`, data, {
    headers: DEFAULT_HEADERS,
  });

export const createFields = (params: createFieldsParams) =>
  service.post(`${WORKFLOW}/fields/create`, params, {
    headers: DEFAULT_HEADERS,
  });

export const updateFields = (params: UpdateFieldsParams) =>
  service.put(`${WORKFLOW}/fields/${params.id}`, params, {
    headers: DEFAULT_HEADERS,
  });

export const disableFields = (params: DisableFieldsParams) =>
  service.patch(
    `${WORKFLOW}/fields/status?status=${params.status}&fieldIds=${params.id}`,
    undefined,
    { headers: DEFAULT_HEADERS }
  );

export const deleteFields = (params: DeleteFieldsParams) =>
  service.delete(`${WORKFLOW}/fields?fieldIds=${params.id}`, {
    headers: DEFAULT_HEADERS,
  });
