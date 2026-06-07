import type { DefaultOptionType } from "antd/es/select";

export type RatanFieldType =
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "time"
  | "datetime";

export type ValueListType = "strict" | "suggestion" | "remote";

export type RatanSchemaField = {
  id: string;
  indexedTerm: string;
  businessTerm: string;
  dataType: string;
  dataVersion: string;
  subSelection: string;
  context: string[];
};

export type RatanSchema = {
  schemaKey: string;
  dataType: RatanFieldType;
  schemaLabel?: string;
  valueList?: ValueList[];
  valueListType?: ValueListType;
  fieldDefinition?: RatanSchemaField;
  properties?: RatanFEProperty[];
  width?: number;
};

export type RatanFEProperty = {
  id: string;
  module: string;
  name: string;
  value: any;
  validation?: string; // JSON-Schema
};

export type ValueList = {
  label: DefaultOptionType["label"];
  title: DefaultOptionType["label"];
  value: string | number | boolean;
  name: string | number | boolean;
  disabled?: boolean;
  [x: string]: any;
};
