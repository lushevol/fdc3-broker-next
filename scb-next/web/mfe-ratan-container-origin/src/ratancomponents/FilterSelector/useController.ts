import React, { useState, useEffect, useCallback, useReducer } from "react";
import { message, Modal } from "antd";
import {
  reducer,
  defaultState,
  getFilters,
  getFilter,
  removeFilter,
} from "./store";
import { formatQuery, RuleGroupType } from "react-querybuilder";
import { getSearchFilter, handleNullValue } from "./FilterBuilderNext";
import { RatanFieldConfig } from "../RatanFilterBuilder/RatanOne/type";
import { Mode } from "../RatanFilterBuilder/ReactQueryBuilder/types";
import { getEnable } from "../../ratanutils/componentEnabling";
const { confirm } = Modal;

export function handleNewFilter(
  { filter, localFilter },
  filterFieldType,
  rawFields
) {
  const localFilterBody = getSearchFilter(filterFieldType, localFilter);
  const newFilter = handleNullValue(filter, rawFields);
  return {
    sql: formatQuery(newFilter, "sql"),
    localFilterBody,
    json: newFilter,
  };
}

export interface FilterSelectorProps {
  name?: string;
  mode?: Mode;
  filterFieldType: string;
  variableConfig: any;
  bodyDefaultValue: any;
  CASCADER_OPTIONS: any;
  FILTER_FIELDS: any;
  customHandleOperators?: (field: RatanFieldConfig) => any;
  searchFunction: (
    filter: { sql: string; localFilterBody: LocalFilter[] } | Filter[],
    callback?: Function
  ) => void;
  onSelectName?: (name: string | undefined) => void;
  setNameList?: (names: string[]) => void;
  switchSearch: string;
  initState?: any;
  isCashflowSettlementCN?: boolean;
  onClose?: () => void;
  onSavedFilter: (
    filter: { sql: string; localFilterBody: LocalFilter[] } | Filter[]
  ) => void;
  onClosedFilter: (rowkey: string | undefined, action?: string) => void;
}
const useController = (props: FilterSelectorProps) => {
  const {
    filterFieldType,
    bodyDefaultValue,
    searchFunction,
    switchSearch,
    initState,
    onClosedFilter,
    FILTER_FIELDS,
  } = props;
  const [openBuilder, setOpenBuilder] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, messageContextHolder] = message.useMessage();

  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    temporaryFilter: { body: bodyDefaultValue },
    bodyDefaultValue,
    ...initState,
  });
  const { filterList, currentFilter } = state;
  useEffect(() => {
    getFilters(filterFieldType).then((list: any[]) => {
      dispatch({ type: "UPDATE_FILTERS", data: list });
    });
  }, []);

  useEffect(() => {
    if (switchSearch && switchSearch !== "filterSelector" && currentFilter) {
      clear(true);
    }
  }, [switchSearch]);

  const setFilterFields = (body: CascaderFilter[]) => {
    const fields: Filter[] = [];

    body.forEach((item: CascaderFilter) => {
      fields.push({
        field: item.field.join("."),
        operator: item.operator,
        values: item.values,
      });
    });

    return fields;
  };

  const delFilter = (rowKey: string) => {
    const newParams = {
      rowKey,
      moduleOwner: currentFilter?.moduleOwner,
    };

    confirm({
      title: "Error",
      content: "Filter format error. Do you want to delete this filter?",
      okText: "Remove",
      onOk() {
        setIsLoading(true);
        removeFilter(newParams, filterFieldType)
          .then(() => {
            dispatch({
              type: "REMOVE_FILTER",
              data: { rowKey, filterFieldType },
            });
            messageApi.success("Filter removed successfully!");
            setIsLoading(false);
          })
          .catch(() => {
            messageApi.error("Remove filter failed!");
            setIsLoading(false);
          });
      },
    });
  };

  const search = (
    body: CascaderFilter[] | { filter: RuleGroupType; localFilter: string[] }
  ) => {
    setIsLoading(true);
    const filters = Array.isArray(body)
      ? setFilterFields(body)
      : handleNewFilter(body, filterFieldType, FILTER_FIELDS);
    searchFunction(filters, (isSuccess: boolean) => {
      if (isSuccess) {
        messageApi.success("Search success!");
      } else if (isSuccess === null) {
        clear(true);
      }
      setIsLoading(false);
    });
  };

  const clear = (isSwitch: boolean) => {
    const params = getEnable("Filter_Builder_Next", filterFieldType)
      ? { sql: "", localFilterBody: [] }
      : [];
    !isSwitch && searchFunction(params, () => {});
    dispatch({ type: "UPDATE_CURRENT_FILTER", data: {} });
    dispatch({ type: "RESET_TEMPORARY_FILTER" });
  };

  const changeFilter = (value: string) => {
    setIsLoading(true);
    getFilter(value, filterFieldType)
      .then((filter: any) => {
        dispatch({ type: "UPDATE_CURRENT_FILTER", data: filter });
        search(filter.body);
      })
      .catch((error) => {
        if (error.message.includes("JSON")) {
          dispatch({ type: "UPDATE_CURRENT_FILTER", data: null });
          dispatch({ type: "RESET_TEMPORARY_FILTER" });
          delFilter(value);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const close = useCallback(
    (rowKey?: string, action?: string) => {
      onClosedFilter &&
        onClosedFilter(rowKey ?? state.temporaryFilter.rowKey, action);
      setTimeout(() => {
        if (rowKey) {
          dispatch({ type: "UPDATE_CURRENT_FILTER", data: {} });
          dispatch({ type: "RESET_TEMPORARY_FILTER" });
          dispatch({
            type: "REMOVE_FILTER",
            data: { rowKey, filterFieldType },
          });
        }

        setOpenBuilder([]);
      }, 0);
    },
    [state]
  );
  return {
    openBuilder,
    setOpenBuilder,
    isLoading,
    setIsLoading,
    messageApi,
    messageContextHolder,
    state,
    dispatch,
    filterList,
    currentFilter,
    setFilterFields,
    delFilter,
    search,
    clear,
    changeFilter,
    close,
  };
};

export default useController;
