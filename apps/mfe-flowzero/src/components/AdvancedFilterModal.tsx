import { CloseCircleFilled, PlusOutlined } from "@ant-design/icons";
import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, message, Popover, Space } from "antd";
import cn from "classnames";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import DarkDatePicker from "src/components/base/DarkDatePicker";
import DarkSelect from "src/components/base/DarkSelect";

// ========== Type Definitions ==========

/**
 * Configuration for a single filterable column.
 *
 * - `condition`  – the condition options shown for this column (e.g. "=", "in", "contains")
 * - `options`    – dropdown value options; omit (or pass []) for free-text / tag input
 * - `inputType`  – "select" (default) shows a dropdown; "tags" lets users type free values
 * - `maxTagCount`– max free-text tags when inputType is "tags" (default: 5)
 */
export interface FilterConfigItem {
  label: string;
  value: string;
  icon: string;
  backgroundColor: string;
  condition: Array<{ label: string | JSX.Element; value: string }>;
  options?: Array<{ label: string | JSX.Element; value: string }>;
  inputType?: "select" | "tags" | "datetimeRange";
  rangeFieldKeys?: [string, string];
  maxTagCount?: number;
}

interface FilterCondition {
  id: number;
  column: string;
  condition: string;
  value: string | string[];
}

interface AdvancedFilterModalProps<
  T extends Record<string, unknown> = Record<string, unknown>
> {
  visible: boolean;
  onCancel: () => void;
  onApply?: (filters: FilterCondition[], apiParams: T) => void;
  resetFiltersFlag?: number;
  filterConfig: FilterConfigItem[];
  popoverMaxHeight: number;
  scrollContainer?: HTMLElement | null;
}

const PopoverContainer = styled("div")`
  .ant-popover-inner {
    padding: 0px;
  }
  .ant-popover-inner-content {
    .dark & {
      background: #262626 !important;
      border-radius: 8px !important;
    }
  }
`;

const PopoverHeader = styled("div")`
  height: 56px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid #cccccc;
  .dark & {
    border-bottom: 1px solid #737373;
    color: #e5e7eb;
  }
`;

const PopoverBody = styled("div")`
  min-height: 112px;
  padding: 20px;
  width: 645px;
  .ant-select-selector {
    font-size: 12px;
  }

  .ant-select-arrow {
    color: #0473ea;
    .dark & {
      color: #9ac7f6;
    }
  }

  .ant-select-selection-item {
    .dark & {
      color: #b2b2b2;
    }
  }

  .ant-select-selection-placeholder {
    .dark & {
      color: #999999;
    }
  }

  .value-select {
    .ant-select-selection-overflow {
      display: flex;
      flex-wrap: nowrap;
    }

    &:not(.value-select-tags)
      .ant-select-selection-overflow-item:not(
        .ant-select-selection-overflow-item-rest
      ):not(.ant-select-selection-overflow-item-suffix) {
      min-width: 0px;
      flex: 0 1 auto;
    }

    .ant-select-selection-overflow-item-rest {
      margin-left: auto;
      order: 3;
    }

    .ant-select-selection-overflow-item-suffix {
      order: 2;
      flex: 1 1 0%;
    }

    .ant-select-selection-search-input {
      .dark & {
        color: #e5e7eb !important;
      }
    }

    .ant-select-selection-item {
      height: 24px;
      line-height: 22px;
      .dark & {
        background-color: #012246;
        color: #ccc;
      }
      .ant-select-selection-item-content {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    &.ant-select-multiple .ant-select-selection-item {
      background: #b3d5f8;
      .dark & {
        background: #012246;
      }
    }

    &.condition-eq .ant-select-selection-item {
      .dark & {
        margin-right: 12px;
        padding-left: 4px;
        border-radius: 4px;
      }
    }

    .ant-select-selection-item-remove {
      .dark & {
        color: #ccc;
      }
    }

    .ant-space .ant-space-item {
      display: flex;
      align-items: center;
    }
  }

  .where-label {
    width: 60px;
    font-size: 14px;
    color: #4d4d4d;
    .dark & {
      color: #b2b2b2;
    }
  }

  .add-filter-label {
    margin-top: 8px;
    margin-left: -10px;
    color: #595959;
    display: flex;
    align-items: center;
    font-size: 12px;
    .dark & {
      color: #a6a6a6;
      :hover {
        color: #e5e7eb;
        background: #333333;
      }
    }
  }
`;
const globalStyles = css`
  .custom-dropdown {
    .ant-select-item-option-content .ant-space-item {
      height: 22px;
      line-height: 22px;
    }
    .ant-select-item.ant-select-item-option {
      font-size: 12px;
    }
  }
  .dark .custom-dropdown {
    background-color: #262626;
    .ant-select-item.ant-select-item-option {
      color: #ccc;
    }
    .ant-select-item.ant-select-item-option:hover,
    .ant-select-item.ant-select-item-option.ant-select-item-option-selected {
      background-color: #012246;
    }
    .ant-select-item.ant-select-item-option.ant-select-item-option-selected {
      color: #9ac7f6;
    }
    .ant-select-item-option-selected .ant-select-item-option-state {
      color: #e5f1fc;
    }
  }
  .dark .ant-empty-description {
    color: #ccc;
  }
`;

const PopoverFooter = styled("div")`
  height: 64px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid #cccccc;
  padding: 16px 20px;
  .dark & {
    border-top: 1px solid #737373;
  }
`;

const IconContainer = styled("span")<{ backgroundColor: string }>`
  width: 20px;
  height: 20px;
  font-size: 12px;
  color: white;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const createOptionWithIconContainer = (
  label: string,
  icon: string,
  backgroundColor: string
) => (
  <Space>
    <IconContainer
      className={`flowzero-iconfont ${icon}`}
      backgroundColor={backgroundColor}
    />
    {label}
  </Space>
);

const transformFiltersToApiParams = (
  filters: FilterCondition[],
  filterConfig: FilterConfigItem[]
): Record<string, string> => {
  const result: Record<string, string> = {};
  const params: Record<string, string[]> = {};

  filters.forEach((filter) => {
    const config = filterConfig.find((item) => item.value === filter.column);
    if (config?.inputType === "datetimeRange" && config.rangeFieldKeys) {
      const [startKey, endKey] = config.rangeFieldKeys;
      const values = Array.isArray(filter.value)
        ? filter.value
        : [filter.value];
      const [startValue, endValue] = values;

      if (startValue) {
        result[startKey] = startValue;
      }
      if (endValue) {
        result[endKey] = endValue;
      }
      return;
    }

    if (filter.column && filter.value) {
      const values = Array.isArray(filter.value)
        ? filter.value
        : [filter.value];
      if (!params[filter.column]) {
        params[filter.column] = [];
      }
      params[filter.column].push(...values);
    }
  });

  // Join as comma-separated string
  Object.keys(params).forEach((key) => {
    result[key] = params[key].join(",");
  });

  return result;
};

const AdvancedFilterModal = <
  T extends Record<string, unknown> = Record<string, unknown>
>({
  visible,
  onCancel,
  onApply,
  resetFiltersFlag,
  filterConfig,
  popoverMaxHeight,
  scrollContainer,
}: AdvancedFilterModalProps<T>) => {
  const [filters, setFilters] = useState<FilterCondition[]>([
    { id: 1, column: "", condition: "=", value: [] },
  ]);
  // Save a snapshot of the last applied filters
  const [appliedFilters, setAppliedFilters] = useState<FilterCondition[]>([
    { id: 1, column: "", condition: "=", value: [] },
  ]);

  // Sync clear filters when external reset
  useEffect(() => {
    const defaultFilter = [
      { id: 1, column: "", condition: "=", value: [] },
    ] as FilterCondition[];
    setFilters(defaultFilter);
    setAppliedFilters(defaultFilter);
  }, [resetFiltersFlag]);

  // ── Helpers derived from filterConfig ────────────────────────────────────

  /** Column dropdown options (with icon + colour badge) */
  const columnOptions = filterConfig.map((option) => ({
    label: createOptionWithIconContainer(
      option.label,
      option.icon,
      option.backgroundColor
    ),
    value: option.value,
  }));

  /** Returns the condition options for a given column value */
  const getConditionOptionsForColumn = (column: string) =>
    filterConfig.find((c) => c.value === column)?.condition ?? [];

  /** Returns the value dropdown options for a given column value */
  const getValueOptionsForColumn = (column: string) =>
    filterConfig.find((c) => c.value === column)?.options ?? [];

  /** Returns the config item for a given column value */
  const getColumnConfig = (column: string) =>
    filterConfig.find((c) => c.value === column);

  const isFilterValueValid = (filter: FilterCondition) => {
    const columnConfig = getColumnConfig(filter.column);
    if (columnConfig?.inputType === "datetimeRange") {
      return (
        Array.isArray(filter.value) &&
        (Boolean(filter.value[0]) || Boolean(filter.value[1]))
      );
    }

    if (Array.isArray(filter.value)) {
      return filter.value.length > 0;
    }

    return Boolean(filter.value);
  };

  /**
   * When changing column, reset the condition to the first available one
   * for that column (handles columns that only support a single condition).
   */
  const handleColumnChange = (
    filterId: number,
    newColumn: FilterCondition["column"]
  ) => {
    setFilters((prev) =>
      prev.map((f) => {
        if (f.id !== filterId) return f;

        const conditionOptions = getConditionOptionsForColumn(newColumn);
        // If the current condition is not available for the new column, use the first one
        const isCurrentConditionValid = conditionOptions.some(
          (opt) => opt.value === f.condition
        );
        const newCondition = isCurrentConditionValid
          ? f.condition
          : conditionOptions[0]?.value ?? "=";

        return {
          ...f,
          column: newColumn,
          value: [],
          condition: newCondition,
        };
      })
    );
  };

  const updateFilter = (
    id: number,
    field: keyof FilterCondition,
    value: string | string[]
  ) => {
    setFilters(
      filters.map((filter) => {
        if (filter.id !== id) return filter;
        // if we change condition from "in" to "=" but there are multiple values, keep only the first one
        if (
          field === "condition" &&
          value === "=" &&
          Array.isArray(filter.value) &&
          filter.value.length > 0
        ) {
          return { ...filter, condition: value, value: filter.value[0] };
        }

        return { ...filter, [field]: value };
      })
    );
  };

  const addNewFilter = () => {
    const newId = Math.max(...filters.map((f) => f.id)) + 1;
    setFilters([
      ...filters,
      { id: newId, column: "", condition: "=", value: [] },
    ]);
  };

  const removeFilter = (id: number) => {
    if (filters.length > 1) {
      setFilters(filters.filter((filter) => filter.id !== id));
    }
  };

  const clearAll = () => {
    const defaultFilter = [
      { id: 1, column: "", condition: "=", value: [] },
    ] as FilterCondition[];
    setFilters(defaultFilter);
    setAppliedFilters(defaultFilter);
    const apiParams = transformFiltersToApiParams([], filterConfig);
    onApply?.([], apiParams as T);
    onCancel();
  };

  const getAvailableColumnOptions = (currentFilterId: number) => {
    const selectedColumns = filters
      .filter((f) => f.id !== currentFilterId)
      .map((f) => f.column)
      .filter((v): v is FilterCondition["column"] => Boolean(v));

    return columnOptions.filter(
      (option) =>
        !selectedColumns.includes(option.value as FilterCondition["column"])
    );
  };

  // Apply filters
  const applyFilters = () => {
    // Validation: Check if any filter has empty column or value
    const invalidFilters = filters.filter(
      (filter) => !filter.column || !isFilterValueValid(filter)
    );

    if (invalidFilters.length > 0) {
      message.error(
        "Please fill in all required fields before applying filters."
      );
      return;
    }

    // Save the applied filters snapshot
    setAppliedFilters(filters);

    const apiParams = transformFiltersToApiParams(filters, filterConfig);
    onApply?.(filters, apiParams as T);
    onCancel();
  };

  const AdvancedFilterContent: React.FC = () => (
    <>
      {/* Add global styles in the component, because the dropdown is appended to the document body. */}
      <Global styles={globalStyles} />
      <div>
        <PopoverHeader>Advanced Filter</PopoverHeader>
        <PopoverBody
          style={{
            maxHeight: `${popoverMaxHeight - 120}px`,
            overflowY: "auto",
          }}
        >
          {filters.map((filter, idx) => (
            <div key={filter.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="where-label">{idx === 0 ? "Where" : ""}</span>
                <DarkSelect
                  placeholder="Column"
                  style={{ width: 180 }}
                  value={filter.column || undefined}
                  onChange={(value) => handleColumnChange(filter.id, value)}
                  options={getAvailableColumnOptions(filter.id)}
                  popupContainer={document.body}
                  scrollContainer={scrollContainer}
                  autoCloseOutOfView={true}
                  classNames={{ popup: { root: "custom-dropdown" } }}
                />
                <DarkSelect
                  placeholder="Condition"
                  style={{ width: 120 }}
                  value={filter.condition}
                  onChange={(value) =>
                    updateFilter(filter.id, "condition", value)
                  }
                  options={
                    filter.column
                      ? getConditionOptionsForColumn(filter.column)
                      : []
                  }
                  dropdownStyle={{ zIndex: 10000 }}
                  popupContainer={document.body}
                  scrollContainer={scrollContainer}
                  autoCloseOutOfView={true}
                  classNames={{ popup: { root: "custom-dropdown" } }}
                />
                {getColumnConfig(filter.column)?.inputType === "tags" ? (
                  <DarkSelect
                    mode="tags"
                    tokenSeparators={[","]}
                    placeholder="Input and press Enter"
                    className="value-select value-select-tags"
                    style={{ width: filters.length > 1 ? 200 : 224 }}
                    maxCount={
                      filter.condition === "="
                        ? 1
                        : getColumnConfig(filter.column)?.maxTagCount ?? 5
                    }
                    value={
                      Array.isArray(filter.value)
                        ? filter.value
                        : filter.value
                        ? [filter.value]
                        : []
                    }
                    onChange={(value) =>
                      updateFilter(filter.id, "value", value)
                    }
                    options={[]}
                    dropdownStyle={{ zIndex: 10000 }}
                    maxTagCount={1}
                    maxTagPlaceholder={(omittedValues) =>
                      `+${omittedValues.length}`
                    }
                    popupContainer={document.body}
                    scrollContainer={scrollContainer}
                    autoCloseOutOfView={true}
                    classNames={{ popup: { root: "custom-dropdown" } }}
                  />
                ) : getColumnConfig(filter.column)?.inputType ===
                  "datetimeRange" ? (
                  <DarkDatePicker
                    showTime
                    format="YYYY-MM-DD[T]HH:mm:ss"
                    placeholder={["Start time", "End time"]}
                    allowEmpty={[true, true]}
                    style={{ width: filters.length > 1 ? 200 : 224 }}
                    value={
                      Array.isArray(filter.value)
                        ? [
                            filter.value[0] ? dayjs(filter.value[0]) : null,
                            filter.value[1] ? dayjs(filter.value[1]) : null,
                          ]
                        : null
                    }
                    onChange={(_, dateStrings) => {
                      updateFilter(
                        filter.id,
                        "value",
                        Array.isArray(dateStrings) ? dateStrings : []
                      );
                    }}
                    getPopupContainer={(triggerNode) =>
                      triggerNode.parentElement ?? triggerNode
                    }
                  />
                ) : (
                  <DarkSelect
                    mode={filter.condition === "in" ? "multiple" : undefined}
                    placeholder="Value"
                    className={cn(
                      "value-select",
                      `condition-${filter.condition === "in" ? "in" : "eq"}`
                    )}
                    style={{ width: filters.length > 1 ? 200 : 224 }}
                    value={
                      filter.condition === "in"
                        ? Array.isArray(filter.value)
                          ? filter.value
                          : filter.value
                          ? [filter.value]
                          : []
                        : Array.isArray(filter.value)
                        ? filter.value[0]
                        : filter.value
                    }
                    onChange={(value) =>
                      updateFilter(filter.id, "value", value)
                    }
                    options={
                      filter.column
                        ? getValueOptionsForColumn(filter.column)
                        : []
                    }
                    dropdownStyle={{ zIndex: 10000 }}
                    maxTagCount={1}
                    maxTagPlaceholder={(omittedValues) =>
                      `+${omittedValues.length}`
                    }
                    popupContainer={document.body}
                    scrollContainer={scrollContainer}
                    autoCloseOutOfView={true}
                    classNames={{ popup: { root: "custom-dropdown" } }}
                  />
                )}
                {filters.length > 1 && (
                  <CloseCircleFilled
                    onClick={() => removeFilter(filter.id)}
                    style={{ padding: "4px", color: "#BFBFBF" }}
                  />
                )}
              </div>
            </div>
          ))}
          {filters.length < filterConfig.length && (
            <Button
              className="add-filter-label"
              type="text"
              icon={<PlusOutlined />}
              onClick={addNewFilter}
            >
              Add New Filter
            </Button>
          )}
        </PopoverBody>

        <PopoverFooter>
          <Button
            type="text"
            onClick={clearAll}
            style={{ color: "#0473EA", marginRight: 8 }}
          >
            Clear all
          </Button>
          <Button
            type="primary"
            onClick={applyFilters}
            style={{
              backgroundColor: "#0473EA",
              borderColor: "#0473EA",
              minWidth: 120,
            }}
          >
            Apply all filters
          </Button>
        </PopoverFooter>
      </div>
    </>
  );

  return (
    <PopoverContainer>
      <Popover
        content={<AdvancedFilterContent />}
        open={visible}
        onOpenChange={() => {
          setFilters(appliedFilters);
          onCancel();
        }}
        trigger="click"
        placement="bottomRight"
        align={{ offset: [-100, 20] }}
        getPopupContainer={(triggerNode) => triggerNode}
        arrow={false}
      />
    </PopoverContainer>
  );
};

export default AdvancedFilterModal;

// Export types for other components
export type { AdvancedFilterModalProps, FilterCondition };
