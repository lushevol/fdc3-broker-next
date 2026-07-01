// @ts-nocheck

import { isRuleGroup, type RuleGroupType, RuleType } from "react-querybuilder";
import { transformQueryOptions } from "src/Cashflow_CN/components/AdvancedSearch/converter";
import { Operator } from "src/generated/types.generated";

type OperatorType = `${Operator}`;

const legacyFilterOperator2QueryOperatorMap = Object.entries(
  transformQueryOptions.operatorMap!
).reduce((res, cur) => {
  const [k, v] = cur;
  res[v] = k;
  return res;
}, {} as Record<OperatorType, string>);

export const legacyFilters2Query = (filters: Filter[]): RuleGroupType => {
  return {
    combinator: "and",
    rules: filters.map((f) => ({
      field: f.field,
      operator: legacyFilterOperator2QueryOperatorMap[f.operator] || f.operator,
      value: f.values,
    })),
  };
};

export const convertRuleGroup2LegacyFilters = (
  rule: RuleGroupType
): Filter[] => {
  if (isAndLevel1Group(rule))
    return (rule.rules as RuleType[]).map((r) => ({
      field: r.field,
      operator: transformQueryOptions.operatorMap![r.operator] || r.operator,
      values: r.value,
    }));
  return [];
};

export const isAndLevel1Group = (rule: RuleGroupType) => {
  return rule.combinator === "and" && rule.rules.every((r) => !isRuleGroup(r));
};
