import { DefaultOptionType } from "antd/es/select";

export type RatanFieldType =
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "time"
  | "datetime";

export interface RatanRawFieldConfig {
  valueList: string | ValueList[];
  indexedTerm: string;
  businessTerm?: string;
  dataType: string;
  subSelection?: string;
}

export interface RatanFieldConfig
  extends Omit<RatanRawFieldConfig, "valueList"> {
  valueList: ValueList[];
  dataType: RatanFieldType;
}

export interface RatanFieldConfigInCascader extends RatanFieldConfig {
  disabled?: boolean; // disabled in cascader
}

export interface RatanFieldCascaderOption extends Partial<RatanFieldConfig> {
  label?: React.ReactNode;
  value?: string | number | null;
  disabled?: boolean;
  children?: Omit<RatanFieldCascaderOption, "children">[];
}

export type ValueList = {
  label: DefaultOptionType["label"];
  title: DefaultOptionType["label"];
  value: string | number | boolean;
  name: string | number | boolean;
  disabled?: boolean;
  [x: string]: any;
};

export type FunParametersType = {
  paramType: string | undefined | null;
  renderComp: string | undefined | null;
  defaultValue?: string | null;
};

export type RuleFunctionConfig = {
  displayName: string | undefined | null;
  functionName: string | undefined | null;
  parameters: FunParametersType[];
  methodReturnType: FunParametersType[];
  supportTargetObjectClass: any[];
};
