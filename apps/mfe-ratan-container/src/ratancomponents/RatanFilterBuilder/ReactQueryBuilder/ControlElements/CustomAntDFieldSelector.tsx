import { Cascader, Select, Space } from "antd";
import { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import { VersatileSelectorProps } from "react-querybuilder";
import {
  RatanFieldCascaderOption,
  RatanFieldConfigInCascader,
  RuleFunctionConfig,
} from "../../RatanOne/type";
import { getPaths } from "../../RatanOne/utils/cascaderBuilder";
import { FieldInput, QueryBuilderSelectorType } from "../types";
import { hydrationGenerationObj } from "../CustomFunction/utils/utils";
import CustomFnComp from "../CustomFunction/CustomFnComp";
import { FIELD_SEPERATOR } from "../../RatanOne/config/const";
import { StyleRoot } from "../CustomFunction/common/CustomFnPopContentStyle";

type Schema = {
  fieldMap?: { [key: string]: { config: RatanFieldConfigInCascader } };
};
type CustomValue = {
  fn?: {
    expression: string;
  };
};
type CustomRule = {
  enrich?: {
    expression: string;
  };
  field?:
    | {
        fn: {};
      }
    | string;
};
export const handleOneLevelField = (
  value: string | undefined,
  schema?: Schema
) => {
  const fieldConfig = schema?.fieldMap?.[value ?? ""];
  return fieldConfig?.config
    ? getPaths(fieldConfig.config)
    : value?.split(FIELD_SEPERATOR);
};

/**
 * step 1: initial field is string.
 * step 2: choose function for first selector level1 get enrich with expression.
 * step 3: choose function for second selecotr level1 get value with expression string.
 * step 4: choose function for first selector leve2~n get field as object with fn:{expression, field}
 *
 */
interface GenerateFunFieldConfig {
  value?: CustomValue | string;
  rule?: CustomRule;
  type: string;
  schema: Schema;
}
export const generateFunFieldConfig = ({
  value,
  rule,
  type,
  schema,
}: GenerateFunFieldConfig) => {
  const newValue = value;
  const newRule = rule;
  let newFieldName;

  if (type === "fieldSelctor") {
    if (newRule?.enrich) {
      newFieldName = newRule.enrich.expression;
    } else if (
      typeof newRule?.field !== "string" &&
      newRule?.field?.fn &&
      typeof newValue !== "string"
    ) {
      newFieldName = newValue?.fn?.expression;
    } else if (typeof newValue === "string") {
      newFieldName = newValue;
    }
  } else {
    newFieldName =
      typeof newValue !== "string" && newValue?.fn
        ? newValue?.fn.expression
        : newValue;
  }
  const { funField } = hydrationGenerationObj(newFieldName);
  const fieldConfig = schema?.fieldMap?.[funField ?? ""] as
    | FieldInput
    | undefined;

  return getPaths(
    fieldConfig?.config ?? {
      indexedTerm: funField ?? "",
      valueList: [],
      dataType: "number",
    }
  );
};

/* If field1 is Date type and field2 is Datetime type, force conversion field2 from Datetime to Date type */
export const handleValueChange = ({ rule, leaf }) => {
  if (leaf.dataType === "datetime" && rule?.enrich?.resultType === "DATE") {
    return {
      value: leaf.indexedTerm,
      fn: {
        expression: `datetimeToDate(${leaf.indexedTerm})`,
        field: leaf.indexedTerm,
        resultType: "DATE",
      },
    };
  } else {
    return leaf.indexedTerm;
  }
};

export type AntDCascaderProps = Omit<VersatileSelectorProps, "schema"> &
  Omit<ComponentPropsWithoutRef<typeof Select>, "onChange" | "defaultValue"> & {
    value?: CustomValue;
    rule?: CustomRule;
    controlledValue?: string[];
    schema?: any;
    enableFn?: boolean;
    functionConfig?: RuleFunctionConfig[];
    type?: string;
    disableValueDateTypeFn?: boolean;
  };

export const CustomAntDFieldSelector = ({
  className,
  handleOnChange,
  options,
  value,
  title,
  disabled,
  multiple,
  listsAsArrays,
  controlledValue,
  schema,
  children,
  operator,
  enableFn = false,
  functionConfig = [] as RuleFunctionConfig[],
  type = "fieldSelctor" as QueryBuilderSelectorType,
  rule,
  level,
  disableValueDateTypeFn,
  // Props that should not be in extraProps
  testID: _testID,
  rules: _rules,
  path: _path,
  context: _context,
  validation: _validation,
  field: _field,
  fieldData: _fieldData,
  ...extraProps
}: PropsWithChildren<AntDCascaderProps>) => {
  const onChange = (
    value: (string | number)[],
    options: RatanFieldCascaderOption[]
  ) => {
    const leaf = options[options.length - 1];
    handleOnChange(handleValueChange({ rule, leaf }));
  };
  /**
   * enableFn: true - Enable customization of functions. Only the rule page will use custom functions
   * enableFn: false - In the filter builder, obtain the correct value of the cascade selector
   */
  const defaultValue = enableFn
    ? generateFunFieldConfig({
        value,
        rule,
        type,
        schema,
      })
    : handleOneLevelField(value, schema);

  return (
    <span
      title={title}
      className={className}
      data-testid={`custom-field-selector`}
    >
      <StyleRoot>
        <Space.Compact block className={"custom-field-fun-group"}>
          {enableFn && (
            <CustomFnComp
              handleOnChange={handleOnChange}
              type={type}
              functionConfig={functionConfig}
              schema={schema}
              selectorValue={value}
              selectorRule={rule}
              disableCascader={disabled || disableValueDateTypeFn}
              level={level}
            />
          )}
          <Cascader<RatanFieldCascaderOption>
            defaultValue={defaultValue}
            options={options}
            onChange={onChange}
            expandTrigger="hover"
            showSearch={{
              limit: 200,
            }}
            allowClear={false}
            disabled={disabled}
            {...(controlledValue && { value: controlledValue })}
            {...extraProps}
          />
        </Space.Compact>
      </StyleRoot>
    </span>
  );
};

CustomAntDFieldSelector.displayName = "CustomAntDFieldSelector";
