import React, { FC, memo, useCallback, useEffect, useMemo } from "react";
import Select from "../../LazyAntd/Select";
import { Button } from "../../Root/import";
import { Context } from "./store";
import { FieldLabel } from "../FieldLabel";
import { FilterBuilder } from "./FilterBuilder";
import MfeThemeProvider from "../../Root/component/MfeThemeProvider";
import StyleRoot, { classes } from "./common/style/filterSelectorStyle";
import useController, { FilterSelectorProps } from "./useController";
import { FilterBuilderNext } from "./FilterBuilderNext";
import { getEnable } from "../../ratanutils/componentEnabling";
import { getUser } from "../../ratanutils/authenticator";
import { useBatchCollect } from "../../packages/Analysis";
import {
  CUSTOM_FILTER_CLEAR,
  CUSTOM_FILTER_CREATE_MODIFY,
  CUSTOM_FILTER_SELECTED,
} from "../../Root/analysis/const";
import cn from "classnames";
import { filterOption } from "../../ratanutils/utils";

export function handleCurrentView(currentFilter, name, clear, onSelectName) {
  if (currentFilter) {
    if (!currentFilter.name) {
      clear(false);
    }
    if (onSelectName && currentFilter.name !== name) {
      onSelectName(currentFilter.name);
    }
  }
}

export const FilterSelectorComp: FC<FilterSelectorProps> = memo(
  (props: FilterSelectorProps) => {
    const {
      openBuilder,
      setOpenBuilder,
      isLoading,
      messageApi,
      messageContextHolder,
      state,
      dispatch,
      filterList,
      currentFilter,
      clear,
      changeFilter,
      close,
    } = useController(props);
    const {
      name,
      mode = "group-l1",
      filterFieldType,
      variableConfig,
      CASCADER_OPTIONS,
      FILTER_FIELDS,
      customHandleOperators,
      onSelectName,
      setNameList,
      searchFunction,
      onSavedFilter,
      onClose,
      isCashflowSettlementCN,
    } = props;
    const { startTracking } = useBatchCollect();
    const [isReady, setIsReady] = React.useState(false);

    const options = useMemo(() => {
      const { role } = getUser();
      const privateOptions: any = {
        label: "Private",
        options: [],
      };
      const myRoleOptions: any = {
        label: "My Role",
        options: [],
      };
      const assignToOptions: any = {
        label: "Assigned To",
        options: [],
      };
      const assignByOptions: any = {
        label: "Assigned By",
        options: [],
      };

      filterList[filterFieldType]?.forEach((item: any, index: number) => {
        if (item.type === filterFieldType) {
          if (!item.assigneeList) {
            privateOptions.options.push({
              label: item.name,
              value: item.rowKey,
            });
          } else if (item.assigneeList === item.moduleOwner) {
            myRoleOptions.options.push({
              label: item.name,
              value: item.rowKey,
            });
          } else if (item.moduleOwner === role) {
            assignToOptions.options.push({
              label: `${item.name} - ${item.assigneeList}`,
              value: item.rowKey,
            });
          } else {
            assignByOptions.options.push({
              label: `${item.name} - ${item.moduleOwner}`,
              value: item.rowKey,
            });
          }
        }
      });
      let newOptions: any[] = [];
      privateOptions.options.length && newOptions.push(privateOptions);
      myRoleOptions.options.length && newOptions.push(myRoleOptions);
      assignByOptions.options.length && newOptions.push(assignByOptions);
      assignToOptions.options.length && newOptions.push(assignToOptions);
      return newOptions;
    }, [filterList]);

    const selectFilter = (value: string, option: any) => {
      changeFilter(value);
      const track = startTracking(CUSTOM_FILTER_SELECTED);
      track([JSON.stringify(option)]);
    };

    useEffect(() => {
      if (onSelectName && isReady && name && currentFilter?.name !== name) {
        const config = filterList[filterFieldType].find(
          (item) => item.name === name
        );
        if (config) {
          changeFilter(config.rowKey);
        }
      }
    }, [name, isReady]);

    useEffect(() => {
      if (setNameList) {
        const nameList = filterList[filterFieldType]?.map((item) => item.name);
        setNameList(nameList);
      }
    }, [filterList]);

    useEffect(() => {
      handleCurrentView(currentFilter, name, clear, onSelectName);
    }, [currentFilter?.rowKey]);

    useEffect(() => {
      if (filterList[filterFieldType]) {
        setIsReady(true);
      }
    }, [filterList]);

    return (
      <MfeThemeProvider>
        <Context.Provider value={{ state, dispatch }}>
          <StyleRoot>
            <FieldLabel className={classes.filterSelector} text="Filters">
              <Select
                className={cn(classes.selector, "ratan-filter-selector")}
                data-testid="selectFilter"
                placeholder="Select..."
                dropdownMatchSelectWidth={false}
                optionLabelProp="label"
                showSearch={true}
                disabled={isLoading}
                loading={isLoading}
                value={currentFilter?.rowKey}
                onChange={selectFilter}
                options={options}
                filterOption={filterOption}
              />
              <Button
                className={classes.viewClearBtn}
                disabled={!currentFilter?.rowKey || isLoading}
                onClick={() => {
                  clear(false);
                  const track = startTracking(CUSTOM_FILTER_CLEAR);
                  track([CUSTOM_FILTER_CLEAR]);
                }}
                variant="outlined"
                data-testid="clearBtn"
                color="warning"
              >
                Clear
              </Button>
              <Button
                className={classes.viewBtn}
                disabled={isLoading}
                onClick={() => {
                  setOpenBuilder([currentFilter?.rowKey || "", currentFilter]);
                  const track = startTracking(CUSTOM_FILTER_CREATE_MODIFY);
                  track([CUSTOM_FILTER_CREATE_MODIFY]);
                }}
                data-testid="filtersCreate"
                variant="contained"
              >
                Create or Modify
              </Button>
            </FieldLabel>
            {getEnable("Filter_Builder_Next", filterFieldType) ? (
              <FilterBuilderNext
                isOpen={openBuilder.length > 0}
                filterFieldType={filterFieldType}
                variableConfig={variableConfig}
                rawFields={FILTER_FIELDS}
                mode={mode}
                messageApi={messageApi}
                customHandleOperators={customHandleOperators}
                searchFunction={searchFunction}
                onSavedFilter={onSavedFilter}
                onClose={(param) => {
                  close(param);
                  onClose && onClose();
                }}
              />
            ) : (
              <FilterBuilder
                openBuilder={openBuilder}
                onClose={close}
                filterFieldType={filterFieldType}
                CASCADER_OPTIONS={CASCADER_OPTIONS}
                FILTER_FIELDS={FILTER_FIELDS}
                searchFunction={searchFunction}
                messageOnLevelOne={messageApi}
                isCashflowSettlementCN={isCashflowSettlementCN}
              />
            )}
            {messageContextHolder}
          </StyleRoot>
        </Context.Provider>
      </MfeThemeProvider>
    );
  }
);

export default FilterSelectorComp;
