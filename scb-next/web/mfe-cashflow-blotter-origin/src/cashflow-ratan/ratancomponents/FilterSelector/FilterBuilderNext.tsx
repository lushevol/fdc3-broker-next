import { FC, memo, useContext, useEffect, useMemo, useState } from "react";
import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { MessageInstance } from "antd/es/message/interface";
import { Field, formatQuery, RuleGroupType } from "react-querybuilder";
import { LoadingButton } from "../../Root/import";
import RatanQueryBuilder from "../RatanFilterBuilder/ReactQueryBuilder";
import { ratanRawField2RQBField } from "../RatanFilterBuilder/ReactQueryBuilder/utils";
import { handleOperators } from "./common/operators";
import { operatorOldMap } from "./common/converter";
import FilterBuilderStyledDialog from "./FilterBuilderNextDialog";
import { FilterName } from "./FilterName";
import { Context } from "./store";
import { RatanFieldConfig } from "../RatanFilterBuilder/RatanOne/type";
import { Mode } from "../RatanFilterBuilder/ReactQueryBuilder/types";
import { getBusinessDay } from "../RatanFilterBuilder/ReactQueryBuilder/Function";

const initialQuery: RuleGroupType = {
  combinator: "and",
  rules: [],
};

enum BlotterToConfig {
  "TRADE_FILTER_BUILDER" = "trades",
  "CASHFLOW_FILTER_BUILDER" = "cashflows",
}
export const getSearchFilter = (
  filterFieldType: string,
  localFilter: string[]
) => {
  const localFilterConfig =
    ratanConfig[BlotterToConfig[filterFieldType]]?.customLocalFilter || [];
  let localFilterBody: LocalFilter[] = [];
  localFilterConfig.forEach((item) => {
    if (localFilter.includes(item.field)) {
      localFilterBody = [...localFilterBody, ...item.filter];
    }
  });
  return localFilterBody;
};

export function handleNullValue(newQuery, rawFields) {
  const rules = newQuery.rules.map((item) => {
    if (Array.isArray(item.rules)) {
      return handleNullValue(item, rawFields);
    } else if (item.value === "") {
      const fieldConfig = rawFields.find(
        (config) => config.indexedTerm === item.field
      );
      if (fieldConfig?.dataType !== "String" && item.operator !== "notNull") {
        return {
          ...item,
          operator: "null",
        };
      }
    }
    return {
      ...item,
      value: getBusinessDay(item.value),
    };
  });
  return {
    ...newQuery,
    rules,
  };
}

interface FilterBuilderNextProps {
  isOpen: boolean;
  filterFieldType: string;
  variableConfig: any;
  messageApi: MessageInstance;
  rawFields: any;
  mode: Mode;
  customHandleOperators?: (field: RatanFieldConfig) => any;
  searchFunction: (
    filters: { sql: string; localFilterBody: LocalFilter[]; json: Object },
    callback?: Function
  ) => void;
  onSavedFilter: (filters: {
    sql: string;
    localFilterBody: LocalFilter[];
    json: Object;
  }) => void;
  onClose: (param?: string) => void;
}
export const FilterBuilderNext: FC<FilterBuilderNextProps> = memo(
  ({
    isOpen,
    filterFieldType,
    variableConfig,
    rawFields,
    mode,
    messageApi,
    customHandleOperators,
    searchFunction,
    onSavedFilter,
    onClose,
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { state, dispatch } = useContext(Context);
    const { temporaryFilter } = state;
    const [query, setQuery] = useState(initialQuery);
    const [localFilter, setLocalFilter] = useState<string[]>([]);

    const fields: Field[] = useMemo(() => {
      const enabledFields = rawFields.filter((item) => !item.disabledFilter);
      return enabledFields.map((f) =>
        ratanRawField2RQBField(f, {
          getOperators: customHandleOperators || handleOperators,
        })
      );
    }, []);

    const setQueryOptions = (newQuery) => {
      dispatch({
        type: "UPDATE_TEMPORARY_FILTER",
        data: { body: { filter: newQuery, localFilter } },
      });
    };

    const search = (isCurrentFilter?: boolean) => {
      const localFilterBody = getSearchFilter(filterFieldType, localFilter);
      const filter = handleNullValue(query, rawFields);
      const sql = formatQuery(filter, "sql");
      if (sql && sql !== "()") {
        setIsLoading(true);
        searchFunction(
          { sql, localFilterBody, json: filter },
          (isSuccess: boolean) => {
            if (isSuccess) {
              if (!isCurrentFilter) {
                dispatch({
                  type: "UPDATE_CURRENT_FILTER",
                  data: temporaryFilter,
                });
              }
              messageApi.success("Search success!");
              onClose();
            }
            setIsLoading(false);
          }
        );
      } else {
        messageApi.error("Please check the value of the query");
      }
    };

    const changeLocalFilter = (e: CheckboxChangeEvent, data) => {
      const isChecked = e.target.checked;
      const newLocalFilter = isChecked
        ? [...localFilter, data.field]
        : localFilter.filter((item) => item !== data.field);
      setLocalFilter(newLocalFilter);
      dispatch({
        type: "UPDATE_TEMPORARY_FILTER",
        data: { body: { filter: query, localFilter: newLocalFilter } },
      });
    };

    const localFilterDom = useMemo(() => {
      const localFilterConfig =
        ratanConfig[BlotterToConfig[filterFieldType]]?.customLocalFilter || [];
      return localFilterConfig.map((item) => (
        <label className="filter-local-item" key={item.label}>
          <Checkbox
            checked={localFilter.includes(item.field)}
            onChange={(e) => changeLocalFilter(e, item)}
          />
          {item.label}
        </label>
      ));
    }, [localFilter]);

    useEffect(() => {
      const localFilterConfig =
        ratanConfig[BlotterToConfig[filterFieldType]]?.customLocalFilter || [];
      let newQuery = temporaryFilter.body;
      // Compatible with old data
      if (Array.isArray(temporaryFilter.body)) {
        let thisLocal: string[] = [];
        newQuery = {
          combinator: "and",
          rules: [],
        };
        temporaryFilter.body.forEach((item) => {
          const lFitler = localFilterConfig.find(
            (config) => config.field === item.field[0]
          );
          if (lFitler) {
            thisLocal.push(lFitler.field);
          } else {
            newQuery.rules.push({
              field: item.field.join("."),
              operator: operatorOldMap[item.operator],
              valueSource: "value",
              value: item.values,
            });
          }
        });
        setQuery(newQuery);
        setLocalFilter(thisLocal);
      } else {
        setQuery(newQuery.filter || newQuery);
        setLocalFilter(newQuery.localFilter || []);
      }
    }, [temporaryFilter]);

    return (
      <FilterBuilderStyledDialog
        className="filter-builder"
        destoryWhenHidden={false}
        open={isOpen}
        onClose={() => onClose()}
        width={"auto"}
        height={"auto"}
        testId="filter-builder"
        title={"Filter Builder"}
      >
        <FilterName
          filterFieldType={filterFieldType}
          onRemove={onClose}
          messageApi={messageApi}
          onSavedFilter={(params) => {
            onSavedFilter?.(params);
            search(true);
          }}
        />
        <div className="filter-builder-body">
          <RatanQueryBuilder
            fields={fields}
            query={query}
            mode={mode}
            variableConfig={variableConfig}
            onQueryChange={setQueryOptions}
            dateFormat="YYYY-MM-DD"
            datetimeFormat="YYYY-MM-DDTHH:mm:ss[Z]"
          />
        </div>

        {localFilterDom.length > 0 && (
          <div className="filter-local-build">{localFilterDom}</div>
        )}
        <div style={{ width: "100%", textAlign: "right", padding: "16px 0" }}>
          <LoadingButton
            disabled={isLoading}
            loading={isLoading}
            onClick={search}
            variant="contained"
          >
            Search
          </LoadingButton>
        </div>
      </FilterBuilderStyledDialog>
    );
  }
);
