import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { RuleType } from "react-querybuilder";
import { FilterArg } from "src/generated/types.generated";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

export const isRuleType = (f: RuleType | FilterArg): f is RuleType => {
  return Object.prototype.hasOwnProperty.call(f, "value");
};

export const isNumberOrNumberString = (val: string | number): boolean => {
  return typeof val === "number" || !isNaN(Number(val));
};

export const isDateTimeFormat = (val: string) => {
  if (typeof val !== "string") return false;
  return dayjs(val).isValid();
};

export const graphqlMatcherItem = (
  dataValue: string | number | boolean | string[] | number[],
  filter: RuleType | FilterArg,
  option?: {
    isTextNumber: boolean;
  }
) => {
  const filterValue = isRuleType(filter) ? filter.value : filter.values;
  const { operator } = filter;
  switch (operator) {
    // IS
    case "EQ":
    case "=":
      if (option?.isTextNumber) {
        return Number(dataValue) == Number(filterValue);
      }
      return filterValue == dataValue;

    // IS NOT
    case "NE":
    case "!=":
      if (option?.isTextNumber) {
        return Number(dataValue) != Number(filterValue);
      }
      return filterValue != dataValue;

    // LIKE
    case "LIKE":
    case "contains":
      return <string>filterValue.includes(dataValue);

    // IN BETWEEN
    case "BET":
    case "between":
      if (isNumberOrNumberString(<string | number>dataValue)) {
        return (
          Number(dataValue) >= Number(filterValue[0]) &&
          Number(dataValue) <= Number(filterValue[1])
        );
      } else if (isDateTimeFormat(<string>dataValue)) {
        return dayjs(<string>dataValue).isBetween(
          (<string[]>filterValue)[0],
          (<string[]>filterValue)[1],
          null,
          "[]"
        );
      }
      return false;

    // EARLIER OR ON
    case "ONORBEFORE":
      return dayjs(<string>dataValue).isSameOrBefore(<string>filterValue);

    // LATER OR ON
    case "ONORLATER":
      return dayjs(<string>dataValue).isSameOrAfter(<string>filterValue);

    // <=
    case "LTE":
    case "<=":
      if (isNumberOrNumberString(filterValue)) {
        return Number(dataValue) <= Number(filterValue);
      } else if (isDateTimeFormat(filterValue)) {
        return dayjs(<string>dataValue).isBefore(<string>filterValue);
      }
      return false;

    // >=
    case "GTE":
    case ">=":
      if (isNumberOrNumberString(filterValue)) {
        return Number(dataValue) >= Number(filterValue);
      } else if (isDateTimeFormat(filterValue)) {
        return dayjs(<string>dataValue).isAfter(<string>filterValue);
      }
      return false;

    // IN
    case "IN":
    case "in":
      if (option?.isTextNumber) {
        return (<string[]>filterValue)
          .map((i) => Number(i))
          .includes(Number(dataValue));
      }
      return (<string[]>filterValue).includes(<string>dataValue);

    // NOT IN
    case "NOTIN":
    case "notIn":
      if (option?.isTextNumber) {
        return !(<string[]>filterValue)
          .map((i) => Number(i))
          .includes(Number(dataValue));
      }
      return !(<string[]>filterValue).includes(<string>dataValue);

    // MATCH
    case "MATCH":
    case "match":
      return new RegExp(filterValue).test(<string>dataValue);

    default:
      console.error("[GraphQL Filter Matcher] operator is not in list.");
      return false;
  }
};
