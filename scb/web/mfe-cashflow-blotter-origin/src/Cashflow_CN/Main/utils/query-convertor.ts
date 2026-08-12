import dayjs from "dayjs";
import {
  isRuleGroupType,
  type RuleGroupType,
  type RuleType,
} from "react-querybuilder";
import { transformQueryOptions } from "src/Cashflow_CN/components/AdvancedSearch/converter";
import { getDateByWorkdayOffset } from "src/Cashflow_Dashboard/Main/common/utils";
import {
  FilterArg,
  LogicFilter,
  Operator,
  RatanUltraQuery,
} from "src/generated/types.generated";
import { isAndLevel1Group } from "src/Root/common/utils/query";

export const convertRule2FilterArg = (filter: RuleType): FilterArg => {
  const { field, value, operator } = filter;
  const convertedOperator = transformQueryOptions.operatorMap![
    operator
  ]! as Operator;
  return {
    field,
    operator: convertedOperator,
    values: value, // convertRuleValue2FilterArgValue(value),
  };
};

export const convertRuleGroup2RatanUltraQueryFilters = (
  filter: RuleGroupType
): RatanUltraQuery["filters"] => {
  return convertRuleGroup2LogicFilters(filter);
};

export const convertRuleGroup2LogicFilters = (
  filter: RuleGroupType
): LogicFilter => {
  const { rules, combinator } = filter;
  const filterAndGroups = (
    rules.filter((r) => isRuleGroupType(r)) as RuleGroupType[]
  ).filter((r) => r.combinator === "and");
  const filterOrGroups = (
    rules.filter((r) => isRuleGroupType(r)) as RuleGroupType[]
  ).filter((r) => r.combinator === "or");
  const filterItems = rules
    .filter((r) => !isRuleGroupType(r))
    .map((r) => convertRule2FilterArg(r as RuleType));
  const filters = filterItems;
  const ands = filterAndGroups.map((f) => convertRuleGroup2LogicFilters(f));
  const ors = filterOrGroups.map((f) => convertRuleGroup2LogicFilters(f));
  return {
    [combinator]: [...ands, ...ors, ...(filters.length ? [{ filters }] : [])],
  };
};

export const combineRuleGroups = (
  rule1: RuleGroupType,
  rule2: RuleGroupType
): RuleGroupType => {
  if (isAndLevel1Group(rule1) && isAndLevel1Group(rule2)) {
    return {
      combinator: "and",
      rules: [...rule1.rules, ...rule2.rules],
    };
  } else if (rule1.rules.length === 0) return rule2;
  else if (rule2.rules.length === 0) return rule1;
  if (rule1.combinator === "and") {
    return {
      ...rule1,
      rules: [...rule1.rules, rule2],
    };
  } else if (rule2.combinator === "and") {
    return {
      ...rule2,
      rules: [...rule2.rules, rule1],
    };
  }
  return {
    combinator: "and",
    rules: [rule1, rule2],
  };
};

/**
 * Filters out invalid rules from a given rule group. A rule is considered valid if:
 * - It is a rule group and contains at least one valid rule.
 * - It is a single rule with a defined `field` that is not "~" and has a valid `operator`.
 *
 * This function recursively processes nested rule groups, ensuring that only valid rules
 * are retained in the returned rule group.
 *
 * @param group - The rule group to filter. It is expected to conform to the `RuleGroupType` structure.
 * @returns A new rule group object with only valid rules.
 */
export const filterInvalidRules = (group: RuleGroupType) => {
  const rules = group.rules
    .map((r) => {
      if (isRuleGroupType(r)) {
        return filterInvalidRules(r);
      }
      return r;
    })
    .filter((r) => {
      if (isRuleGroupType(r)) {
        return filterInvalidRules(r).rules.length > 0;
      } else {
        return r.field && r.field !== "~" && r.operator;
      }
    });
  return {
    ...group,
    rules,
  };
};

export const transformAllVariableDates = (group: RuleGroupType) => {
  const rules = group.rules.map((r) => {
    if (isRuleGroupType(r)) {
      return transformAllVariableDates(r);
    }
    return transformVariableDate(r);
  });
  return {
    ...group,
    rules,
  };
};

export const transformVariableDate = (rule: RuleType) => {
  const { value } = rule;

  if (value === "$CURRENT_DATE") {
    return {
      ...rule,
      value: dayjs().format("YYYY-MM-DD"),
    };
  } else if (typeof value === "string" && value.startsWith("businessDay(")) {
    const days = parseInt(
      value.replace("businessDay(", "").replace(")", ""),
      10
    );
    return {
      ...rule,
      value: getDateByWorkdayOffset(days),
    };
  } else if (typeof value === "string" && value.startsWith("calendarDay(")) {
    const days = parseInt(
      value.replace("calendarDay(", "").replace(")", ""),
      10
    );
    return {
      ...rule,
      value: dayjs().add(days, "day").format("YYYY-MM-DD"),
    };
  }

  return rule;
};

export const getEmptyRuleGroup = (): RuleGroupType => ({
  combinator: "and",
  rules: [],
});

/**
 * Filters out duplicate fields from the rules in a given `RuleGroupType` object.
 *
 * This function iterates through the rules in the provided `filters` object and ensures
 * that each field appears only once. If a rule is a `RuleGroupType`, it is retained as-is.
 * For other rules, it checks if the field has already been encountered. If so, the rule
 * is excluded; otherwise, the field is added to a set to track its occurrence.
 *
 * @param filters - The `RuleGroupType` object containing rules to be filtered.
 * @returns A new `RuleGroupType` object with duplicate fields removed from its rules.
 */
export const filterOutDuplicateFieldsQuery = (
  filters: RuleGroupType
): RuleGroupType => {
  const fields = new Set<string>();

  return {
    ...filters,
    rules: filters.rules.filter((i) => {
      if (isRuleGroupType(i)) {
        return true;
      }
      if (fields.has(i.field)) {
        return false;
      }
      fields.add(i.field);
      return true;
    }),
  };
};
