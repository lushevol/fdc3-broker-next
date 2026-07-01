import { QueryBuilderAntD } from "@react-querybuilder/antd";
import { memo, useMemo } from "react";
import {
  add,
  defaultTranslations,
  QueryBuilder,
  defaultValidator,
  type Field,
  type QueryBuilderProps,
  type RuleGroupType,
  type TranslationsFull,
  RuleType,
} from "react-querybuilder";
import type {
  Mode,
  Theme,
  CustomDateTimeFormat,
  VariableConfig,
} from "./types";
import { DeleteOutlined } from "@ant-design/icons";
import { generateGetValueEditorType, getDefaultValue } from "./value";
import StyledRoot from "./style";
import { useMode } from "./mode";
import { modeClassName } from "./utils";
import { RuleFunctionConfig } from "../RatanOne/type";
import {
  hydrationGenerationObj,
  isValidationFunExpression,
} from "./CustomFunction/utils/utils";

export type RatanQueryBuilderProps = QueryBuilderProps & {
  fields: Field[];
  mode?: Mode;
  theme?: Theme;
  allowDuplicateField?: boolean; // only work in simple mode
  className?: string;
  enableFn?: boolean;
  functionConfig?: RuleFunctionConfig[];
} & CustomDateTimeFormat;

const translations: TranslationsFull = {
  ...defaultTranslations,
  removeRule: {
    ...defaultTranslations.removeRule,
    // @ts-ignore
    label: <DeleteOutlined />,
  },
};

export const initialQuery: RuleGroupType = {
  combinator: "and",
  rules: [],
};

const dateVar = { date: ["CUSTOM_DATE", "DATE_VAR"] } as VariableConfig;
// Compatible rule blotter and cashflow blotter
export const handleRuleBlotter = ({
  datePickerVariable,
  variableConfig,
}: {
  datePickerVariable?: boolean;
  variableConfig?: VariableConfig;
}) => {
  return (datePickerVariable ? dateVar : variableConfig) as VariableConfig;
};

interface NewRuleType extends RuleType {
  enrich?: {
    expression: string;
    field: string;
    resultType: string;
  };
}
export const handleQuery = (
  query: RuleGroupType<NewRuleType, string> | undefined,
  functionConfig: RuleFunctionConfig[]
) => {
  const rules = query?.rules?.map((item) => {
    if ("rules" in item && Array.isArray(item.rules)) {
      return handleQuery(item, functionConfig);
    }
    let newItem = { ...item };
    if ("field" in newItem && isValidationFunExpression(newItem.field)) {
      const { funField, funName } = hydrationGenerationObj(newItem.field);
      const funConfig = functionConfig?.find(
        (fnConfig) => fnConfig.functionName === funName
      );
      newItem = {
        ...newItem,
        field: funField as string,
        enrich: {
          expression: newItem.field,
          field: funField as string,
          resultType: funConfig?.methodReturnType[0]?.paramType ?? "TEXT",
        },
      };
    }
    if ("value" in newItem && isValidationFunExpression(newItem.value)) {
      const { funField, funName } = hydrationGenerationObj(newItem.value);
      if (
        ["businessDay", "calendarDay", "hours", "minutes"].includes(
          funName ?? ""
        )
      ) {
        return newItem;
      }
      const funConfig = functionConfig?.find(
        (fnConfig) => fnConfig.functionName === funName
      );
      newItem = {
        ...newItem,
        value: {
          fn: {
            expression: newItem.value,
            field: funField,
            resultType: funConfig?.methodReturnType[0]?.paramType ?? "TEXT",
          },
        },
      };
    }
    return newItem;
  });
  return {
    ...query,
    rules,
  };
};

export const RatanQueryBuilder = memo(
  ({
    fields = [],
    query,
    onQueryChange,
    mode = "simple",
    theme = "light",
    allowDuplicateField = true,
    dateFormat,
    datetimeFormat,
    timeFormat,
    className,
    treatDateTimeAsDate,
    datePickerVariable,
    variableConfig,
    enableFn = false,
    functionConfig = [] as RuleFunctionConfig[],
    ...props
  }: RatanQueryBuilderProps) => {
    const { queryBuilderProps, FieldSelector } = useMode({
      mode,
      fields,
      allowDuplicateField,
      query,
      dateFormat,
      datetimeFormat,
      timeFormat,
      treatDateTimeAsDate,
      variableConfig: handleRuleBlotter({
        datePickerVariable,
        variableConfig,
      }),
      enableFn,
      functionConfig,
    });

    const getValueEditorType = useMemo(
      () => generateGetValueEditorType(fields),
      [fields]
    );

    const handleAddRule = (indexedTerm: string) => {
      onQueryChange &&
        query &&
        onQueryChange(
          add(query, { field: indexedTerm, operator: "=", value: "" }, [])
        );
    };

    const rootClassName = [`theme-${theme}`, modeClassName(mode), className]
      .filter(Boolean)
      .join(" ");

    const onQueryChangeHandler = (e) => {
      const re = { ...e };

      /**
       * @description: if enableFn and add function for fields, add the enrich attribute to the rule
       */

      re.rules = enableFn
        ? re.rules.map((item) => {
            if (item.field?.fn) {
              const field = { field: item.field.value };
              if (Object.keys(item.field.fn).length > 0) {
                return {
                  ...item,
                  ...field,
                  enrich: item.field?.fn,
                };
              } else {
                const { enrich, ...restItem } = item;
                return {
                  ...restItem,
                  ...field,
                };
              }
            } else if (item.enrich && item.enrich.field !== item.field) {
              const { enrich, ...restItem } = item;
              return restItem;
            }
            return item;
          })
        : re.rules;

      onQueryChange && onQueryChange(re);
    };

    const formatQuery = useMemo(
      () => handleQuery(query, functionConfig),
      [JSON.stringify(query), JSON.stringify(functionConfig)]
    );

    return (
      <StyledRoot>
        <div className={rootClassName}>
          <QueryBuilderAntD>
            <QueryBuilder
              fields={fields}
              query={formatQuery}
              onQueryChange={onQueryChangeHandler}
              autoSelectField={false}
              getDefaultValue={getDefaultValue}
              listsAsArrays
              resetOnOperatorChange
              // @ts-ignore
              getValueEditorType={getValueEditorType}
              translations={translations}
              validator={defaultValidator}
              {...queryBuilderProps}
              {...props}
            />
          </QueryBuilderAntD>
          {mode === "simple" && (
            <div style={{ marginTop: 10 }}>
              <FieldSelector
                controlledValue={["--- Add Filter ---"]}
                handleOnChange={handleAddRule}
                placeholder="--- Add Filter ---"
              />
            </div>
          )}
        </div>
      </StyledRoot>
    );
  }
);

export default RatanQueryBuilder;
