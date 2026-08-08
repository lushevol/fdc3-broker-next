import {
  RuleGroupType,
  formatQuery,
  Field,
  DefaultOperator,
} from "react-querybuilder";
import { ratanFieldConfigPreprocessing } from "../RatanOne/utils";
import type { RatanRawFieldConfig, RatanFieldConfig } from "../RatanOne/type";
import { initialQuery } from "./index";
import { Mode, CustomDateTimeFormat } from "./types";
import { defaultPureBooleanOptions } from "../RatanOne/utils/valueList";
import { Dayjs } from "dayjs";

export const dehydrate = (query: RuleGroupType) => {
  try {
    return formatQuery(query, "json_without_ids");
  } catch (error) {
    return "";
  }
};

export const hydrate = (persistence: string): RuleGroupType => {
  try {
    if (!persistence) return initialQuery;
    return JSON.parse(persistence);
  } catch (error) {
    return initialQuery;
  }
};

export const ratanRawField2RQBField = (
  f: RatanRawFieldConfig,
  opt: {
    getOperators: (field: RatanFieldConfig) => (
      | DefaultOperator
      | {
          name: string;
          value: string;
          label: string;
        }
    )[];
    forceBoolean?: boolean;
  }
): Field & { config: RatanFieldConfig } => {
  const ratanFieldConfig = ratanFieldConfigPreprocessing(f);
  const { valueList, dataType } = ratanFieldConfig;
  const { getOperators, forceBoolean } = opt;
  const values = (
    forceBoolean && dataType === "boolean"
      ? defaultPureBooleanOptions
      : valueList
  ) as Field["values"];
  return {
    name: f.indexedTerm,
    label: f.indexedTerm,
    inputType: dataType,
    values,
    operators: getOperators(ratanFieldConfig),
    config: ratanFieldConfig,
  };
};

// whether string is a number, e.g. 123/123.123/-123.123/+123.123/123e10
export const isNumberString = (d: any) => {
  try {
    if (typeof d !== "string") return false;
    if (d === "") return false;
    return !isNaN(d as unknown as number);
  } catch (error) {
    return false;
  }
};

// extend json parse, to convert `['abc', 'def']` issue.
export const jsonParse = (str: string) => {
  const regex_MatchSingleQuotes = /'/g;
  str = str.replace(regex_MatchSingleQuotes, '"');
  return JSON.parse(str);
};

export const modeClassName = (m: Mode) => {
  return m ? `mode-${m}` : "";
};

export const datetimeFormatChecker = (
  inputTypeCoerced: string,
  { dateFormat, timeFormat, datetimeFormat }: CustomDateTimeFormat
) => {
  switch (inputTypeCoerced) {
    case "datetime":
    case "datetime-local":
      return datetimeFormat;

    case "date":
      return dateFormat;

    case "time":
      return timeFormat;

    default:
      break;
  }
};

export const handelValue = (dateValue: Dayjs) => {
  return dateValue.isValid() ? dateValue : undefined;
};
