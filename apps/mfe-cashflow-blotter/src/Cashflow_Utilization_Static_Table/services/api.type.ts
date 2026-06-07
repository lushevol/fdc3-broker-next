import { RuleStatusType } from "../state/types";

export type UtilizationRuleRow = UtilizationRuleMutation & {
  id: number;
  dataStatus: RuleStatusType;
  createdAt: string;
  updatedAt: string;
  makerId: string;
  checkerId: string;
  settlementAccount: string;
  settlementMeans: string;
};

export type UtilizationRuleMutation = {
  counterpartyFmId: string;
  counterpartyFmCode: string;
  entityFmId: string;
  entityFmCode: string;
  autoUtil: string;
};

export type UtilizationRuleQuery = {
  page: number;
  size: number;
} & Partial<UtilizationRuleMutation>;

export type UtilizationRuleAuditQuery = {
  page: number;
  size: number;
  entityId?: string;
};

export type RuleListResponse<T> = {
  pageNo: number;
  pageSize: number;
  totalPages: number;
  totalHits: number;
  results: T[];
};

export type RuleMutationResponse = {
  result: "success" | "fail";
  recordId: string;
  code: string;
  message: string;
};

export type RuleAuditRow = {
  id: string;
  utilizationEntityId: number;
  dataStatus: RuleStatusType;
  userId: string;
  snapshot: UtilizationRuleRow;
  createdAt: string;
};
