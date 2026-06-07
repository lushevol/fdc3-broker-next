import dayjs from "dayjs";
import _cloneDeep from "lodash/cloneDeep";
import { isRuleGroup, RuleGroupType, RuleType } from "react-querybuilder";

type QueryType = RuleGroupType<RuleType<string, string, any, string>, string>;

export const isQueryContainsVD = (query: QueryType) => {
  if (!query?.rules) return false;

  const hasVD = query.rules.some((rule) => {
    if (!isRuleGroup(rule)) {
      return rule.field === "Cashflow.Payment_Date";
    }
    // enable when crusiure check
    else {
      return isQueryContainsVD(rule);
    }
  });

  return hasVD;
};

export const isQueryContainsId = (query: QueryType) => {
  if (!query?.rules) return false;

  const hasId = query.rules.some((rule) => {
    if (!isRuleGroup(rule)) {
      return rule.field.toLowerCase().endsWith("_id");
    }
    return isQueryContainsId(rule);
  });

  return hasId;
};

// check if the query has VD and the range is more than 1 month
export const isQueryVDRangeThan1Month = (query: QueryType) => {
  if (!query?.rules) return false;

  const hasVDAndRangeMoreThan1Month = query.rules.some((rule) => {
    if (!isRuleGroup(rule)) {
      return (
        rule.field === "Cashflow.Payment_Date" &&
        rule.operator === "between" &&
        Array.isArray(rule.value) &&
        rule.value.length === 2 &&
        Math.abs(dayjs(rule.value[1]).diff(dayjs(rule.value[0]), "day")) > 30
      );
    }
    return isQueryVDRangeThan1Month(rule);
  });

  return hasVDAndRangeMoreThan1Month;
};

export const getAllFieldsInRuleGroup = (ruleGroup: RuleGroupType) => {
  if (!ruleGroup?.rules) return [];

  const fields: string[] = [];
  ruleGroup.rules.forEach((rule) => {
    if (!isRuleGroup(rule)) {
      fields.push(rule.field);
    } else {
      fields.push(...getAllFieldsInRuleGroup(rule));
    }
  });

  return [...fields.sort((a, b) => a.localeCompare(b))];
};

// check new query is only missing VD compare with prev query
export const newQueryOnlyMissingVDCompareWithPrev = (
  prevFilters: QueryType,
  newFilters: QueryType
): boolean => {
  const prevQueryFields = getAllFieldsInRuleGroup(prevFilters);
  const newQueryFields = getAllFieldsInRuleGroup(newFilters);

  const prevQueryFieldsSet = new Set(prevQueryFields);
  const newQueryFieldsSet = new Set(newQueryFields);

  // Check if new query has all fields from prev query except VD
  const prevQueryFieldsContainsVD = prevQueryFieldsSet.has(
    "Cashflow.Payment_Date"
  );
  prevQueryFieldsSet.delete("Cashflow.Payment_Date");
  const hasAllFieldsExceptVD =
    prevQueryFieldsSet.size === newQueryFieldsSet.size &&
    [...Array.from(prevQueryFieldsSet)].every((field) =>
      newQueryFieldsSet.has(field)
    );

  return prevQueryFieldsContainsVD && hasAllFieldsExceptVD;
};

// check if the new query only missing VD compare with prev query
// 2 exclusive cases:
// 1. new query only removed VD from prev query
// 2. new query contains id like fields.
export const checkShouldAddVD = (
  newFilters: QueryType,
  prevFilters: QueryType
): boolean => {
  const isNewFiltersEmpty = newFilters.rules.length === 0;
  const newQueryContainsVD = isQueryContainsVD(newFilters);
  const isNewQueryOnlyMissingVDCompareWithPrev =
    newQueryOnlyMissingVDCompareWithPrev(prevFilters, newFilters);

  const newQueryContainsId = isQueryContainsId(newFilters);

  return (
    !isNewFiltersEmpty &&
    !newQueryContainsVD &&
    !isNewQueryOnlyMissingVDCompareWithPrev &&
    !newQueryContainsId
  );
};

export const addVDtoQuery = (query: QueryType) => {
  const queryCopy = _cloneDeep(query);
  queryCopy.rules.push({
    field: "Cashflow.Payment_Date",
    operator: "=",
    value: dayjs().format("YYYY-MM-DD"),
  });
  return queryCopy;
};
