import _get from "lodash/get";
import { isRuleGroup, RuleGroupType } from "react-querybuilder";

import { graphqlMatcherItem } from "./graphqlMatcherItem";

// filter datas which matchs filter conditions.
export const matchQueries = <T>(
  datas: T[],
  filters: RuleGroupType
): [T[], T[]] => {
  if (!filters.rules.length) {
    return [[...datas], []];
  }
  const filterdDatas: T[] = [];
  const droppedDatas: T[] = [];
  datas.forEach((data) => {
    let isPassed = false;
    if (filters.combinator === "and") {
      isPassed = filters.rules.every((filter) => {
        try {
          if (isRuleGroup(filter))
            return matchQueries([data], filter)[0].length > 0;
          else {
            const { field } = filter;
            const value = _get(data, field);
            const option =
              field === "Cashflow.Payment_Amount"
                ? { isTextNumber: true }
                : undefined;

            return graphqlMatcherItem(value, filter, option);
          }
        } catch (error) {
          return false;
        }
      });
    } else if (filters.combinator === "or") {
      isPassed = filters.rules.some((filter) => {
        try {
          if (isRuleGroup(filter))
            return matchQueries([data], filter)[0].length > 0;
          const { field } = filter;
          const value = _get(data, field);
          const option =
            field === "Cashflow.Payment_Amount"
              ? { isTextNumber: true }
              : undefined;

          return graphqlMatcherItem(value, filter, option);
        } catch (error) {
          return false;
        }
      });
    }
    if (isPassed) {
      filterdDatas.push(data);
    } else {
      droppedDatas.push(data);
    }
  });
  return [filterdDatas, droppedDatas];
};
