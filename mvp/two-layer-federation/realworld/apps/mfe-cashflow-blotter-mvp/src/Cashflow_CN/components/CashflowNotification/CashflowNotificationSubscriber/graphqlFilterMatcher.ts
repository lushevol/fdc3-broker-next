import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import _get from "lodash/get";

import { FilterItem } from "./interface";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

// filter datas which matchs filter conditions.
export const matchFilters = <T>(
  datas: T[],
  filters: FilterItem[]
): [T[], T[]] => {
  if (!filters.length) {
    return [[...datas], []];
  }
  const filterdDatas: T[] = [];
  const droppedDatas: T[] = [];
  datas.forEach((data) => {
    // currently all conditions are AND
    const isPassed = filters.every((filter) => {
      try {
        const { field, operator, values } = filter;
        const value = _get(data, field);
        switch (operator) {
          // IS
          case "EQ":
            return value == values;

          // IS NOT
          case "NE":
            return value != values;

          // LIKE
          case "LIKE":
            return <string>value.includes(values);

          // IN BETWEEN
          case "BET":
            return dayjs(<string>value).isBetween(
              (<string[]>values)[0],
              (<string[]>values)[1],
              null,
              "[]"
            );

          // EARLIER OR ON
          case "ONORBEFORE":
            return dayjs(<string>value).isSameOrBefore(<string>values);

          // LATER OR ON
          case "ONORLATER":
            return dayjs(<string>value).isSameOrAfter(<string>values);

          // <=
          case "LTE":
            return <number>value <= <number>values;

          // >=
          case "GTE":
            return <number>value >= <number>values;

          // IN
          case "IN":
            return (<string[]>values).includes(value);

          // NOT IN
          case "NOTIN":
            return !(<string[]>values).includes(value);

          default:
            console.error("[GraphQL Filter Matcher] operator is not in list.");
            return false;
        }
      } catch (error) {
        return false;
      }
    });
    if (isPassed) {
      filterdDatas.push(data);
    } else {
      droppedDatas.push(data);
    }
  });
  return [filterdDatas, droppedDatas];
};
