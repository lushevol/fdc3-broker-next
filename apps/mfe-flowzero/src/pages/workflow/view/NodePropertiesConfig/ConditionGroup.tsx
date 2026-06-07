import styled from "@emotion/styled";
import { DatePicker, Input, InputNumber, Select, Tooltip } from "antd";
import cn from "classnames";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import type { FieldType } from "src/pages/workflow/services/conditionUtils";

import CloseIcon from "../node_icon/close.svg";
import SettingsIcon from "../node_icon/setings.png";
import InfoIcon from "../node_icon/tooltip.svg";
import InfoIconDark from "../node_icon/tooltip_dark.svg";

export interface Condition {
  id: string;
  field?: string;
  operator?: string;
  value?: string;
}

export type Conjunction = "And" | "Or";

export interface ConditionGroupValue {
  conjunction: Conjunction;
  conditions: Condition[];
}

export interface FieldDef {
  label: string;
  value: string;
  type: FieldType;
}

interface ConditionGroupProps {
  value?: ConditionGroupValue;
  onChange?: (value: ConditionGroupValue) => void;
  fieldDefs: FieldDef[];
}

const OPERATORS_BY_TYPE: Record<
  FieldType,
  { label: string; value: string; desc: string; example: string }[]
> = {
  String: [
    {
      label: "=",
      value: "=",
      desc: "Exact match — Right-side Value: single string value.",
      example: "Example: Name = John",
    },
    {
      label: "!=",
      value: "!=",
      desc: "Not equal — Right-side Value: single string value.",
      example: "Example: Name != John",
    },
    {
      label: "is null",
      value: "is null",
      desc: "Field has no value— Right-side: None required.",
      example: "Example: Name is null",
    },
    {
      label: "is not null",
      value: "is not null",
      desc: "Field has value— Right-side: None required.",
      example: "Example: Name is not null",
    },
    {
      label: "in",
      value: "in",
      desc: "Field equals any value in a list — Right-side: list of strings.",
      example: "Example: Name in [John, Mary, Tom]",
    },
    {
      label: "not in",
      value: "not in",
      desc: "Field does not equal any value in a list — Right-side: list of strings.",
      example: "Example: Name not in [John, Mary, Tom]",
    },
    {
      label: "matches",
      value: "matches",
      desc: "Value matches a regular expression — Right-side: regex pattern.",
      example: "Example: Name matches '^[A-Z].*'",
    },
    {
      label: "not matches",
      value: "not matches",
      desc: "Value does not match the regex — Right-side: regex pattern.",
      example: "Example: Name not matches '^admin.*'",
    },
  ],
  Number: [
    {
      label: "=",
      value: "=",
      desc: "Equal to — Right-side: single numeric value.",
      example: "Example: Age = 100",
    },
    {
      label: "!=",
      value: "!=",
      desc: "Not equal to — Right-side: single numeric value.",
      example: "Example: Age != 100",
    },
    {
      label: "<",
      value: "<",
      desc: "Less than — Right-side: single numeric value.",
      example: "Example: Age < 100",
    },
    {
      label: ">",
      value: ">",
      desc: "Greater than — Right-side: single numeric value.",
      example: "Example: Age > 100",
    },
    {
      label: "<=",
      value: "<=",
      desc: "Less than or equal — Right-side: single numeric value.",
      example: "Example: Age <= 10",
    },
    {
      label: ">=",
      value: ">=",
      desc: "Greater than or equal — Right-side: single numeric value.",
      example: "Example: Age >= 100",
    },
    {
      label: "is null",
      value: "is null",
      desc: "Field has no value— Right-side: none required.",
      example: "Example: Age is null",
    },
    {
      label: "is not null",
      value: "is not null",
      desc: "Field has value — Right-side: none required.",
      example: "Example: Age is not null",
    },
    {
      label: "in",
      value: "in",
      desc: "Value is one of the listed numbers— Right-side: list of numbers.",
      example: "Example: Age in [11,21,31]",
    },
    {
      label: "not in",
      value: "not in",
      desc: "Value does not exist in a list—  Right-side: list of numbers.",
      example: "Example: Age not in [11,21,31]",
    },
    {
      label: "between",
      value: "between",
      desc: "Value within inclusive range — Right-side: two numbers (min, max) ,two numbers are separated by commas.",
      example: "Example: Age between (10, 100)",
    },
    {
      label: "not between",
      value: "not between",
      desc: "Value outside inclusive range — Right-side: two numbers (min, max) ,two numbers are separated by commas",
      example: "Example: Age not between (10, 100)",
    },
  ],
  Date: [
    {
      label: "=",
      value: "=",
      desc: "Exact date match — Right-side: single date in YYYY-MM-DD.",
      example: "Example: Date = 2026-03-09",
    },
    {
      label: "!=",
      value: "!=",
      desc: "Not equal to date — Right-side: single date.",
      example: "Example: Date != 2026-03-09",
    },
    {
      label: ">",
      value: ">",
      desc: "After specified date — Right-side: single date.",
      example: "Example: Date > 2026-03-09",
    },
    {
      label: "<",
      value: "<",
      desc: "Before specified date — Right-side: single date.",
      example: "Example: Date < 2026-03-09",
    },
  ],
  DateTime: [
    {
      label: "=",
      value: "=",
      desc: "Exact datetime match — Right-side: single datetime.",
      example: "Example: DateTime = 2026-03-09 09:30:00",
    },
    {
      label: "!=",
      value: "!=",
      desc: "Not equal to datetime — Right-side: single datetime.",
      example: "Example: DateTime != 2026-03-09 09:30:00",
    },
    {
      label: ">",
      value: ">",
      desc: "After specified datetime — Right-side: single datetime.",
      example: "Example: DateTime >2026-03-09 09:30:00",
    },
    {
      label: "<",
      value: "<",
      desc: "Before specified datetime — Right-side: single datetime.",
      example: "Example: DateTime <2026-03-09 09:30:00",
    },
  ],
  Boolean: [
    {
      label: "Is true",
      value: "is true",
      desc: "Check if the boolean field is true",
      example: "Example: isApproved is true",
    },
    {
      label: "Is false",
      value: "is false",
      desc: "Check if the boolean field is false",
      example: "Example: isApproved is false",
    },
  ],
  Array: [
    {
      label: "contain",
      value: "contain",
      desc: "Array contains the specified value — Right-side: single value.",
      example: "Example: Name contain [John]",
    },
    {
      label: "not contain",
      value: "not contain",
      desc: "Array not contains the specified value — Right-side: single value.",
      example: "Example: Name not contain [John]",
    },
    {
      label: "is null",
      value: "is null",
      desc: "Field has no value— Right-side: none required.",
      example: "Example: tags is null",
    },
    {
      label: "is not null",
      value: "is not null",
      desc: "Field has value — Right-side: none required.",
      example: "Example: tags is not null",
    },
  ],
};

const DEFAULT_OPERATORS = OPERATORS_BY_TYPE.String;

const truncate = (str: string, max = 20) =>
  str.length > max ? str.slice(0, max) + "\u2026" : str;

/** Operators that carry no value (Boolean checks, empty checks) */
const NO_VALUE_OPERATORS = new Set([
  "is true",
  "is false",
  "is null",
  "is not null",
  "is empty",
  "not empty",
]);

const PillSelect = styled(Select)`
  .ant-select-selector {
    border-radius: 20px !important;
    height: 32px !important;
  }
  .ant-select-selection-item {
    transform: translate(1px, -1px);
    color: #666666 !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    line-height: 16px !important;
  }

  .dark & {
    .ant-select-selector {
      background-color: #262626 !important;
      border-color: #555555 !important;
    }
    .ant-select-selection-item {
      color: #b2b2b2 !important;
    }
    .ant-select-arrow {
      color: #9ac7f6;
    }
  }
` as unknown as typeof Select;

const GroupBox = styled("div")`
  .ant-select-selection-placeholder {
    color: #666666 !important;
  }
  input::placeholder {
    color: #666666 !important;
  }
  .ant-select-arrow {
    color: #0473ea;
  }
  .ant-select-disabled {
    .ant-select-arrow {
      color: #737373;
    }
    &,
    & *,
    .ant-select-selector,
    .ant-select-selector * {
      cursor: default !important;
    }
  }
  .ant-picker-dropdown,
  .ant-picker-panel {
    max-width: 400px !important;
    width: auto !important;
    overflow-x: auto !important;
  }

  .dark & {
    .ant-select-selector {
      background-color: #262626 !important;
      border-color: #737373 !important;
    }
    .ant-select-selection-item {
      color: #cccccc !important;
    }
    .ant-select-selection-placeholder {
      color: #666666 !important;
    }
    .ant-select-arrow {
      color: #9ac7f6;
    }
    .ant-select-disabled {
      .ant-select-selector {
        background-color: #252d3d !important;
        border-color: #2a3547 !important;
      }
      .ant-select-arrow {
        color: #555555;
      }
    }
    .ant-input {
      background-color: #262626 !important;
      border-color: #737373 !important;
      color: #cccccc !important;
    }
    .ant-input-disabled,
    .ant-input[disabled] {
      background-color: #252d3d !important;
      border-color: #2a3547 !important;
      color: #555555 !important;
      cursor: default !important;
      box-shadow: none !important;
    }
    input::placeholder {
      color: #666666 !important;
    }
    .ant-input-number {
      background-color: #262626 !important;
      border-color: #737373 !important;
    }
    .ant-input-number-input {
      background-color: transparent !important;
      color: #cccccc !important;
    }
    .ant-picker {
      background-color: #262626 !important;
      border-color: #737373 !important;
    }
    .ant-picker-input > input {
      color: #cccccc !important;
    }
    .ant-picker-suffix {
      color: #9ac7f6;
    }
    .ant-select-dropdown {
      background-color: #262626 !important;
      border: none !important;
    }
    .ant-select-item-option {
      color: #9ac7f6 !important;
    }
    .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
      background-color: #212a36 !important;
    }
    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
      background-color: #00172e !important;
    }
    .ant-select-empty {
      color: #666666 !important;
    }
  }
`;

const ConditionGroup: React.FC<ConditionGroupProps> = ({
  value,
  onChange,
  fieldDefs,
}) => {
  const conjunction = value?.conjunction ?? "And";
  const conditions = value?.conditions ?? [];

  // 只用fieldDefs
  const resolvedFieldOptions = fieldDefs.map((f) => ({
    label: f.label,
    value: f.value,
  }));

  const getOperatorsForField = (fieldKey?: string) => {
    if (!fieldDefs || !fieldKey) return DEFAULT_OPERATORS;
    const def = fieldDefs.find((f) => f.value === fieldKey);
    return def
      ? OPERATORS_BY_TYPE[def.type] ?? DEFAULT_OPERATORS
      : DEFAULT_OPERATORS;
  };

  const getFieldType = (fieldKey?: string): FieldType => {
    if (!fieldDefs || !fieldKey) return "String";
    return fieldDefs.find((f) => f.value === fieldKey)?.type ?? "String";
  };

  const groupBoxRef = useRef<HTMLDivElement>(null);

  // Derive initial errors from props so they survive remounts
  const computeValueErrors = (conds: Condition[]): Record<string, boolean> => {
    const errs: Record<string, boolean> = {};
    conds.forEach((c) => {
      if (!c.operator || NO_VALUE_OPERATORS.has(c.operator)) return;
      const v = c.value;
      if (v === undefined || v === null || String(v).trim().length === 0)
        errs[c.id] = true;
    });
    return errs;
  };

  const [errors, setErrors] = useState<Record<string, boolean>>(() =>
    computeValueErrors(value?.conditions ?? [])
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [opErrors, setOpErrors] = useState<Record<string, boolean>>({});

  // Re-derive errors when a completely different set of conditions is loaded
  // (node switch) — detected by all current IDs being absent from the previous set.
  const prevCondIdsRef = useRef<string>("");
  const condIdsKey = conditions.map((c) => c.id).join("|");
  useEffect(() => {
    const prev = prevCondIdsRef.current;
    prevCondIdsRef.current = condIdsKey;
    // Skip if nothing actually changed
    if (prev === condIdsKey) return;
    const prevSet = new Set(prev.split("|").filter(Boolean));
    const currentIds = condIdsKey.split("|").filter(Boolean);
    // Treat as a new set when every current ID is absent from the previous set
    // (covers both initial load from empty and node switch).
    const isNewSet =
      currentIds.length > 0 && currentIds.every((id) => !prevSet.has(id));
    if (isNewSet) {
      setErrors(computeValueErrors(conditions));
      setFieldErrors({});
      setOpErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condIdsKey]);

  // Safety net: ensure value-errors are shown from the very first render,
  // regardless of whether the lazy initializer had the right data.
  useEffect(() => {
    setErrors(computeValueErrors(conditions));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isValueRequired = (cond: Condition | undefined) => {
    if (!cond || !cond.operator) return false;
    if (NO_VALUE_OPERATORS.has(cond.operator)) return false;
    return true;
  };

  const validateValue = (cond: Condition | undefined) => {
    if (!isValueRequired(cond)) return true;
    const v = cond?.value;
    if (v === undefined || v === null) return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "string") return v.trim().length > 0;
    return String(v).trim().length > 0;
  };

  const handleBlur = (cond: Condition) => {
    const ok = validateValue(cond);
    setErrors((prev) => {
      const copy = { ...prev };
      if (!ok) copy[cond.id] = true;
      else delete copy[cond.id];
      return copy;
    });
  };

  const clearErrorIfValid = (cond: Condition) => {
    if (validateValue(cond)) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[cond.id];
        return copy;
      });
    }
  };

  const renderValueInput = (condition: Condition) => {
    // Disabled placeholder for no-value operators (Boolean checks, empty checks)
    if (condition.operator && NO_VALUE_OPERATORS.has(condition.operator)) {
      return (
        <div className="flex-1 min-w-0">
          <Input
            placeholder=""
            value=""
            className="!bg-[#EBEBEB] !border-transparent !text-[#666666]"
            // className="[&_.ant-select-selector]:!bg-[#EBEBEB] [&_.ant-select-selector]:!border-transparent"
            disabled
            style={{ width: "100%", cursor: "default" }}
          />
        </div>
      );
    }

    const fieldType = getFieldType(condition.field);
    const commonCls = "flex-1";

    // Multi-tag input for in/not in/contains/not contains
    const multiTagOps = ["in", "not in", "between", "not between"];
    if (multiTagOps.includes((condition.operator || "").toLowerCase())) {
      const isBetween = ["between", "not between"].includes(
        (condition.operator || "").toLowerCase()
      );
      const tags = condition.value
        ? condition.value.split("\n").filter(Boolean)
        : [];
      const err = !!errors[condition.id];

      const setTags = (newTags: string[]) => {
        const limited = isBetween ? newTags.slice(0, 2) : newTags;
        const val = limited.join("\n");
        updateCondition(condition.id, { value: val });
        clearErrorIfValid({ ...condition, value: val });
      };

      return (
        <div className="flex-1 min-w-0 relative">
          <div
            className={cn(
              "flex flex-wrap items-center gap-[4px] min-h-[32px] px-[8px] py-[4px]",
              "border rounded-[6px] bg-white dark:bg-[#262626]",
              "border-[#d9d9d9] dark:border-[#737373]",
              "focus-within:border-[#4096ff] focus-within:shadow-[0_0_0_2px_rgba(5,145,255,0.1)]",
              "transition-all duration-200",
              tags.length > 0 && "pr-[24px]",
              err && "!border-red-500"
            )}
          >
            {tags.map((tag, i) => (
              <span
                key={i}
                className={cn(
                  "inline-flex items-center gap-[4px] px-[7px] py-0 rounded border border-[#CCCCCC]",
                  "text-[12px] font-medium",
                  "bg-[#F2F2F2] dark:bg-[#2a2a2a] text-[#00172E] dark:text-gray-200",
                  "h-[20px]"
                )}
                style={{ userSelect: "none", lineHeight: "18px" }}
              >
                {tag}
                <span
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setTags(tags.filter((_, idx) => idx !== i));
                  }}
                  className="cursor-pointer opacity-70 hover:opacity-100 inline-flex items-center"
                  role="button"
                  tabIndex={-1}
                  aria-label="Remove"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M3 3l4 4M7 3l-4 4"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            ))}
            <input
              className={cn(
                "flex-1 min-w-[60px] h-[22px] border-none outline-none bg-transparent",
                "text-[12px] text-light-content-title dark:text-[#cccccc]",
                "placeholder:text-[#bfbfbf]",
                isBetween && tags.length >= 2 && "hidden"
              )}
              placeholder={
                tags.length === 0 ? "Type value, press Enter\u2026" : ""
              }
              disabled={isBetween && tags.length >= 2}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = e.currentTarget.value.trim();
                  if (val && !(isBetween && tags.length >= 2)) {
                    setTags([...tags, val]);
                    e.currentTarget.value = "";
                  }
                } else if (
                  e.key === "Backspace" &&
                  e.currentTarget.value === "" &&
                  tags.length > 0
                ) {
                  setTags(tags.slice(0, -1));
                }
              }}
              onBlur={(e) => {
                const inputVal = e.currentTarget.value.trim();
                let finalTags = tags;
                if (inputVal && !(isBetween && tags.length >= 2)) {
                  finalTags = [...tags, inputVal];
                  setTags(finalTags);
                  e.currentTarget.value = "";
                }
                // Validate against the resolved final tags, not the stale condition.value
                handleBlur({
                  ...condition,
                  value:
                    finalTags.length > 0 ? finalTags.join("\n") : undefined,
                });
              }}
            />
          </div>
          {tags.length > 0 && (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setTags([]);
                handleBlur({ ...condition, value: undefined });
              }}
              className="absolute right-[6px] top-1/2 -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100 inline-flex items-center justify-center"
              role="button"
              tabIndex={-1}
              aria-label="Clear all"
            >
              <img src={CloseIcon} alt="clear" className="w-[14px] h-[14px]" />
            </div>
          )}
        </div>
      );
    }

    if (fieldType === "Date") {
      const err = !!errors[condition.id];
      return (
        <div className="flex-1 min-w-0">
          <DatePicker
            className={cn(commonCls, err && "border border-red-500")}
            style={{ width: "100%" }}
            getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
            value={condition.value ? dayjs(condition.value) : null}
            onChange={(d) => {
              const val = d ? d.format("YYYY-MM-DD") : undefined;
              updateCondition(condition.id, { value: val });
              if (val === undefined) {
                // validateValue({ ...condition, value: val });
                setErrors((prev) => ({ ...prev, [condition.id]: true }));
              } else {
                clearErrorIfValid({ ...condition, value: val });
              }
            }}
          />
        </div>
      );
    }

    if (fieldType === "DateTime") {
      const err = !!errors[condition.id];
      return (
        <div className="flex-1 min-w-0">
          <DatePicker
            showTime
            className={cn(commonCls, err && "border border-red-500")}
            style={{ width: "100%" }}
            // popupStyle={{ maxWidth: "85px", overflowX: "auto" }}
            getPopupContainer={(trigger) => trigger.parentElement ?? trigger}
            value={condition.value ? dayjs(condition.value) : null}
            onChange={(d) => {
              const val = d ? d.format("YYYY-MM-DD HH:mm:ss") : undefined;
              updateCondition(condition.id, { value: val });
              if (val === undefined) {
                // validateValue({ ...condition, value: val });
                setErrors((prev) => ({ ...prev, [condition.id]: true }));
              } else {
                clearErrorIfValid({ ...condition, value: val });
              }
            }}
          />
        </div>
      );
    }

    if (fieldType === "Number") {
      const err = !!errors[condition.id];
      return (
        <div className="flex-1 min-w-0">
          <InputNumber
            className={cn(commonCls, err && "border border-red-500")}
            style={{ width: "100%" }}
            placeholder="Enter a value"
            precision={6}
            value={
              condition.value !== undefined
                ? Number(condition.value)
                : undefined
            }
            formatter={(v) => {
              if (v === undefined || v === null) return "";
              const s = String(v);
              const [intPart, decPart] = s.split(".");
              const intFmt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              return decPart !== undefined ? `${intFmt}.${decPart}` : intFmt;
            }}
            parser={(v) => {
              if (v === undefined || v === "") return "" as unknown as number;
              return v.replace(/,/g, "") as unknown as number;
            }}
            onChange={(v) => {
              const val = v !== null && v !== undefined ? String(v) : undefined;
              updateCondition(condition.id, { value: val });
              clearErrorIfValid({ ...condition, value: val });
            }}
            onBlur={() => handleBlur(condition)}
          />
        </div>
      );
    }

    const err = !!errors[condition.id];
    return (
      <div className="flex-1 min-w-0">
        <Input
          placeholder="Enter a value"
          value={condition.value}
          onChange={(e) => {
            const v = e.target.value;
            updateCondition(condition.id, { value: v });
            clearErrorIfValid({ ...condition, value: v });
          }}
          onBlur={() => handleBlur(condition)}
          style={{ width: "100%" }}
          className={cn(commonCls, err && "border border-red-500")}
        />
      </div>
    );
  };

  const emit = (patch: Partial<ConditionGroupValue>) => {
    onChange?.({ conjunction, conditions, ...patch });
  };

  const addCondition = () => {
    emit({ conditions: [...conditions, { id: `c_${Date.now()}` }] });
  };

  const removeCondition = (id: string) => {
    emit({ conditions: conditions.filter((c) => c.id !== id) });
    setErrors((prev) => {
      const c = { ...prev };
      delete c[id];
      return c;
    });
    setFieldErrors((prev) => {
      const c = { ...prev };
      delete c[id];
      return c;
    });
    setOpErrors((prev) => {
      const c = { ...prev };
      delete c[id];
      return c;
    });
  };

  const updateCondition = (id: string, patch: Partial<Condition>) => {
    emit({
      conditions: conditions.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, ...patch };
        // When field changes, always clear operator and value
        if (patch.field !== undefined && patch.field !== c.field) {
          updated.operator = undefined;
          updated.value = undefined;
        }
        // When operator changes, clear value
        if (patch.operator !== undefined && patch.operator !== c.operator) {
          updated.value = undefined;
        }
        return updated;
      }),
    });
  };

  if (conditions.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          "py-[24px] gap-[12px]",
          "bg-[#F9F9F9] dark:bg-[#1A1A1A] border border-dashed border-light-divide-base dark:border-[#444] rounded-[4px]"
        )}
      >
        <img
          src={SettingsIcon}
          alt="Settings"
          className="w-[86px] h-[40px] object-contain"
        />
        <div className="flex flex-col items-center gap-[4px]">
          <span className="font-semibold text-[14px] leading-[22px] text-light-content-title dark:text-dark-content-title text-center">
            No conditions added yet
          </span>
          <span className="font-normal text-[12px] leading-[20px] text-[#808080] dark:text-dark-content-body text-center">
            Add your first condition to start building your logic
          </span>
        </div>
        <button
          onClick={addCondition}
          className={cn(
            "flex items-center gap-[4px]",
            "text-[#1677FF] dark:text-dark-link-secondary-default font-medium text-[14px]",
            "bg-transparent border-none cursor-pointer p-0"
          )}
        >
          <span
            className="flowzero-iconfont icon-plus-add mr-[4px] mb-[-2px]"
            aria-hidden="true"
          />
          Condition
        </button>
      </div>
    );
  }

  return (
    <GroupBox
      ref={groupBoxRef}
      className={cn(
        "bg-[#F9F9F9] dark:bg-[#262626]",
        "border border-dashed border-light-divide-base dark:border-[#555555]",
        "p-[8px] pt-[24px] flex flex-col gap-[8px]"
      )}
    >
      {/* Top bar: conjunction selector + add button */}
      <div className="flex items-center justify-between mb-[6px]">
        <PillSelect
          value={conjunction}
          onChange={(v) => emit({ conjunction: v as Conjunction })}
          options={[
            { label: "And", value: "And" },
            { label: "Or", value: "Or" },
          ]}
          className="translate-x-[4px]"
          style={{ height: 32, width: 69 }}
          getPopupContainer={() => groupBoxRef.current ?? document.body}
          dropdownStyle={{ zIndex: 10 }}
        />
        <button
          onClick={addCondition}
          className={cn(
            "flex items-center gap-[4px]",
            "text-[#595959] dark:text-dark-content-body font-medium text-[12px] leading-[16px]",
            "bg-transparent border-none cursor-pointer p-0 -translate-x-[10px]"
          )}
        >
          <span
            className="flowzero-iconfont icon-plus-add mr-[4px]"
            style={{ fontSize: 12, color: "#595959" }}
            aria-hidden="true"
          />
          Condition
        </button>
      </div>

      {/* Divider below conjunction row */}
      <div className="border-b border-dashed border-light-divide-base dark:border-[#444444]" />

      {/* Condition cards */}
      {conditions.map((condition) => {
        const valueInput = renderValueInput(condition);
        return (
          <div
            key={condition.id}
            className={cn(
              "flex flex-col gap-[8px]",
              "bg-[#F5F5F5] dark:bg-[#0D0D0D]",
              "rounded-[12px] p-[10px]"
            )}
          >
            <div className="flex gap-[8px]">
              <div
                className="flex flex-col gap-[10px] min-w-0"
                style={{ flex: 3 }}
              >
                <span className="text-[12px] font-medium text-light-content-body dark:text-[#808080]">
                  Field
                </span>
                <Select
                  placeholder="Select a field"
                  value={condition.field}
                  onChange={(v) => {
                    updateCondition(condition.id, { field: v });
                    setFieldErrors((prev) => {
                      const c = { ...prev };
                      delete c[condition.id];
                      return c;
                    });
                    setErrors((prev) => {
                      const c = { ...prev };
                      delete c[condition.id];
                      return c;
                    });
                  }}
                  onBlur={() => {
                    if (!condition.field) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        [condition.id]: true,
                      }));
                    }
                  }}
                  style={{ width: "100%" }}
                  optionLabelProp="label"
                  className={cn(
                    fieldErrors[condition.id] &&
                      "[&_.ant-select-selector]:!border-red-500"
                  )}
                  getPopupContainer={(trigger) => trigger.parentElement}
                >
                  {fieldDefs.map((f) => (
                    <Select.Option
                      key={f.value}
                      value={f.value}
                      label={
                        <span
                          className="block overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-light-content-title dark:text-dark-input-text"
                          title={f.label}
                        >
                          {truncate(f.label)}
                        </span>
                      }
                    >
                      <div className="flex items-center justify-between gap-[8px]">
                        <span
                          className="text-[#1D2B3A] dark:text-dark-link-secondary-default text-[13px] font-normal overflow-hidden text-ellipsis whitespace-nowrap"
                          style={{ maxWidth: 140 }}
                          title={f.label}
                        >
                          {truncate(f.label)}
                        </span>
                        <span className="text-[#808080] text-[12px] shrink-0">
                          {f.type}
                        </span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
                {fieldErrors[condition.id] && (
                  <span className="text-[11px] text-red-500 mt-[-4px]">
                    Field is required.
                  </span>
                )}
              </div>
              <div
                className="flex flex-col gap-[8px] min-w-0"
                style={{ flex: 2 }}
              >
                <div className="flex items-center gap-[4px]">
                  <span className="text-[12px] font-medium text-light-content-body dark:text-[#808080]">
                    Operator
                  </span>
                  {(() => {
                    const ops = getOperatorsForField(condition.field);
                    const selected = ops.find(
                      (o) => o.value === condition.operator
                    );
                    if (!selected) return null;
                    return (
                      <Tooltip
                        title={
                          <div>
                            <div className="font-semibold dark:text-[#000000]">
                              {selected.label} - {selected.desc}
                            </div>
                            <div className="mt-[4px] text-[#737373] dark:text-[#000000]">
                              {selected.example}
                            </div>
                          </div>
                        }
                        placement="left"
                        overlayClassName="w-[277px] rounded-[8px] [&_.ant-tooltip-inner]:!bg-[#00172E] dark:[&_.ant-tooltip-inner]:!bg-[#CCE3FA] dark:[&_.ant-tooltip-arrow:before]:!bg-[#CCE3FA]"
                      >
                        <div className="w-[13.3px] h-[13.3px] translate-y-[1px]">
                          <img
                            src={InfoIcon}
                            alt="info"
                            className="w-full h-full dark:hidden"
                          />
                          <img
                            src={InfoIconDark}
                            alt="info"
                            className="w-full h-full hidden dark:block"
                          />
                        </div>
                      </Tooltip>
                    );
                  })()}
                </div>
                <div className="flex flex-col">
                  <Select
                    placeholder="Condition"
                    value={condition.operator}
                    onChange={(v) => {
                      updateCondition(condition.id, { operator: v });
                      setOpErrors((prev) => {
                        const c = { ...prev };
                        delete c[condition.id];
                        return c;
                      });
                      setErrors((prev) => {
                        const c = { ...prev };
                        delete c[condition.id];
                        return c;
                      });
                    }}
                    onBlur={() => {
                      if (condition.field && !condition.operator) {
                        setOpErrors((prev) => ({
                          ...prev,
                          [condition.id]: true,
                        }));
                      }
                    }}
                    optionLabelProp="label"
                    options={getOperatorsForField(condition.field).map(
                      (op) => ({
                        label: (
                          <span className="flex items-center gap-[6px]">
                            <span>{op.label}</span>
                          </span>
                        ),
                        value: op.value,
                      })
                    )}
                    style={{
                      width: "100%",
                    }}
                    className={cn(
                      !condition.field
                        ? "[&_.ant-select-selector]:!bg-[#EBEBEB] [&_.ant-select-selector]:!border-transparent"
                        : "",
                      opErrors[condition.id] &&
                        "[&_.ant-select-selector]:!border-red-500"
                    )}
                    disabled={!condition.field}
                    getPopupContainer={(trigger) => trigger.parentElement}
                  />
                  {opErrors[condition.id] && (
                    <span className="text-[11px] text-red-500 mt-[2px]">
                      Operator is required.
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Value row — hidden for no-value operators (Boolean / empty checks) */}
            {valueInput !== null && (
              <div className="flex flex-col gap-[10px]">
                <span className="text-[12px] font-medium text-light-content-body dark:text-[#808080]">
                  Value
                </span>
                <div className="flex items-center gap-[8px]">
                  {valueInput}
                  <button
                    onClick={() => removeCondition(condition.id)}
                    className={cn(
                      "flex items-center justify-center",
                      "w-[28px] h-[28px] rounded-full",
                      "bg-light-container-layer dark:bg-dark-container-layer hover:bg-[#D9D9D9] dark:hover:bg-dark-secondary-disabled",
                      "shrink-0 cursor-pointer border border-light-divide-base dark:border-[#555555]"
                    )}
                  >
                    <span
                      className="flowzero-iconfont icon-field-trash"
                      style={{ fontSize: 14, color: "#A6A6A6" }}
                    />
                  </button>
                </div>
                {errors[condition.id] && (
                  <span className="text-[11px] text-red-500">
                    value is required.
                  </span>
                )}
              </div>
            )}
            {/* Delete button shown separately when value row is hidden */}
            {valueInput === null && (
              <div className="flex justify-end">
                <button
                  onClick={() => removeCondition(condition.id)}
                  className={cn(
                    "flex items-center justify-center",
                    "w-[28px] h-[28px] rounded-full",
                    "bg-light-container-layer dark:bg-dark-container-layer hover:bg-[#D9D9D9] dark:hover:bg-dark-secondary-disabled",
                    "shrink-0 cursor-pointer border border-light-divide-base dark:border-[#555555]"
                  )}
                >
                  <span
                    className="flowzero-iconfont icon-field-trash"
                    style={{ fontSize: 14, color: "#A6A6A6" }}
                  />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </GroupBox>
  );
};

export default ConditionGroup;
