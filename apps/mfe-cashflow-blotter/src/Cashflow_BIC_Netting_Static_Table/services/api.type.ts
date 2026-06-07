import { RuleStatusType } from "../state/types";

export type BicNettingRuleRow = BicNettingRuleMutation & {
  id: number;
  dataStatus: RuleStatusType;
  createdAt: string;
  updatedAt: string;
  makerId: string;
  checkerId: string;
  updateRecordId: string | null;
};

export type BicNettingRuleMutation = {
  entityFmId: string;
  family: string;
  group: string;
  type: string;
  typology: string;
  strategy: string;
  beneficiaryBic: string;
};

export type BicNettingRuleQuery = {
  page: number;
  size: number;
} & Partial<BicNettingRuleMutation>;

export type BicNettingRuleAuditQuery = {
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
  bicEntityId: number;
  snapshot: string;
  dataStatus: RuleStatusType;
  userId: string;
  benBicManipulation: BicNettingRuleRow;
  createdAt: string;
};
