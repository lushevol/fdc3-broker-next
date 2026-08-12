import type {
  DefaultOperatorName,
  Field,
  ValueEditorType,
} from "react-querybuilder";
import { RatanFieldConfig } from "../RatanOne/type";

export type Mode =
  | "simple"
  | "group"
  | "group-l1"
  | "group-l1-and-no-l3"
  | "group-l1-and"
  | "group-l3"
  | "search"
  | "drools-rule"
  | "default";

export type Theme = "light" | "dark";

export type Application = "Rule" | "Strategic Cashflow" | "BCS Cashflow";

export type ValueEditorSuperType =
  | ValueEditorType
  | "multipleinputnumber"
  | "multipledatepicker"
  | "multiselectWithoutOptions"
  | "regExpInput";

export type OperatorNameSuperType =
  | DefaultOperatorName
  | "matches"
  | "notMatches";

export type FieldInput = Field & { config: RatanFieldConfig };

export type CustomFunFieldType = {
  fn: {
    expression: string;
    field: string;
    resultType: string;
  };
  value?: string;
};

export type QueryBuilderSelectorType = "fieldSelctor" | "valueEditor";

export type VariableConfig = {
  date: ("DATE_VAR" | "CUSTOM_DATE")[];
  datetime: "TIME_VAR"[];
  "datetime-local": "TIME_VAR"[];
};
export type CustomDateTimeFormat = {
  dateFormat?: string;
  timeFormat?: string;
  datetimeFormat?: string;
  treatDateTimeAsDate?: boolean;
  datePickerVariable?: boolean; // For compatibility with rule blotter, when rule blotter supports variableConfig, it can be deleted
  variableConfig?: VariableConfig;
};
