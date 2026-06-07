import dayjs, { Dayjs, ManipulateType } from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const CURRENT_DATE = "$CURRENT_DATE";
export const LAST_BUSINESS_DATE = "businessDay(-1)";
export const NEXT_BUSINESS_DATE = "businessDay(1)";
export const CUSTOM_DATE = "businessDay/calendarDay";
export const CURRENT_TIME = "$CURRENT_TIME";
export const currentDateName = "Current Date";
export const lastBusinessDateName = "Last Business Day";
export const nextBusinessDateName = "Next Business Day";
export const customDateName = "Custom Day";
export const currentTimeName = "Current Time";

const safeReg = /^([^()]+)\(([^()]+)\)$/;

export const generateDatePickerFormat =
  (f?: string) =>
  (realValue: string, value: Dayjs): string => {
    if (dayjs(realValue).isValid()) {
      return value.format(f);
    } else if (!realValue) {
      return "";
    }
    switch (realValue) {
      case CURRENT_DATE:
        return currentDateName;
      case LAST_BUSINESS_DATE:
        return lastBusinessDateName;
      case NEXT_BUSINESS_DATE:
        return nextBusinessDateName;
      case CURRENT_TIME:
        return currentTimeName;
      default:
        if (/businessDay/.test(realValue)) {
          const shift = realValue.replace(/businessDay\((.*)\)/, "$1");
          return `Business Day ${formatShift(shift)}`;
        } else if (/calendarDay/.test(realValue)) {
          const shift = realValue.replace(/calendarDay\((.*)\)/, "$1");
          return `Calendar Day ${formatShift(shift)}`;
        } else if (/hours|minutes|seconds/.test(realValue)) {
          const match = safeReg.exec(realValue);
          const unit = match?.[1] ?? "";
          const value = match?.[2] ?? "";
          const label = unit.charAt(0).toUpperCase() + unit.slice(1);
          return `${label} ${formatShift(value)}`;
        }
        return customDateName;
    }
  };

const pattern = /\$|businessDay|calendarDay/;
export const isVariable = (v: string) => {
  // @ts-ignore
  return pattern.test(v);
};

export const isVariableHandlingEnabled = (
  fieldType: string,
  operator: string
) => {
  return (
    ["=", "!=", ">", ">=", "<", "<="].includes(operator) &&
    ["date", "datetime", "time"].includes(fieldType)
  );
};

export const getBusinessDay = (value) => {
  let lastDay, nextDay;
  switch (value) {
    case CURRENT_DATE:
      return dayjs().startOf("day").format("YYYY-MM-DD");
    case LAST_BUSINESS_DATE:
      lastDay = dayjs().subtract(1, "day").startOf("day");
      while (lastDay.day() === 0 || lastDay.day() === 6) {
        lastDay = lastDay.subtract(1, "day");
      }
      return lastDay.format("YYYY-MM-DD");
    case NEXT_BUSINESS_DATE:
      nextDay = dayjs().add(1, "day").startOf("day");
      while (nextDay.day() === 0 || nextDay.day() === 6) {
        nextDay = nextDay.add(1, "day");
      }
      return nextDay.format("YYYY-MM-DD");
    case CURRENT_TIME:
      return dayjs().utc().format("YYYY-MM-DDTHH:mm:ssZ");
    default:
      if (/hours|minutes|seconds/.test(value)) {
        const match = safeReg.exec(value);
        const unit = match?.[1] as ManipulateType;
        const val = match?.[2] ?? "";
        const number = Number(val);
        return dayjs().add(number, unit).utc().format("YYYY-MM-DDTHH:mm:ssZ");
      }
      return value;
  }
};

const formatShift = (shift: string) => {
  if (shift.startsWith("-")) {
    return `(${shift})`;
  } else {
    return `(+${shift})`;
  }
};
