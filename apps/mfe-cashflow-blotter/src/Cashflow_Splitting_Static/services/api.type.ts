import { RuleStatusType } from "../state/types";

export type StaticRuleRow = SplittingRuleMutation & {
  id: number | string;
  ruleUniqueId: number | string;
  dataStatus: RuleStatusType;
  createdAt: string;
  updatedAt: string;
  makerId: string;
  checkerId: string;
  updateRecordId: string | null;
};

export type SplittingRuleMutation = {
  entityFmCode: string;
  entityFmId: string | number;
  family: string;
  group: string;
  type: string;
  typology: string;
  strategy: string;
  beneficiaryBic: string;
  amount: string | number;
  currency: string;
  limitation: string | number;
  nostroAgent: string | number;
  threshold: string | number;
};

export type SplittingRuleQuery = {
  page: number;
  size: number;
} & Partial<SplittingRuleMutation>;

export type StaticRuleAuditQuery = {
  page: number;
  size: number;
  ruleUniqueId?: string;
};

export type RuleListResponse<T> = {
  pageNo: number;
  pageSize: number;
  totalPages: number;
  totalHits: number;
  results: T[];
};

export type RuleMutationResponse = {
  status: number;
  errorCode: string;
  errorMessage: string;
};

export type RuleAuditRow = {
  id: string;
  bicEntityId: number;
  dataStatus: RuleStatusType;
  userId: string;
  benBicManipulation: StaticRuleRow;
  createdAt: string;
};
