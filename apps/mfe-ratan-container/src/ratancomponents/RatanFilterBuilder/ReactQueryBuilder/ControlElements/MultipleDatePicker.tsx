import { DatePicker, Tag } from "antd";
import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import { PlusCircleFilled } from "@ant-design/icons";
import { AntDValueSelectorProps } from "./CustomAntDValueSelector";
import { useValueSelector } from "react-querybuilder";
import { CustomDateTimeFormat } from "../types";

type AntDMultipleDatePickerProps = AntDValueSelectorProps & {
  type?: string; // "time" | "date" | "datetime"
} & CustomDateTimeFormat;

export const MultipleDatePicker = ({
  className,
  handleOnChange,
  options,
  value,
  title,
  disabled,
  multiple,
  listsAsArrays,
  type,
  dateFormat,
  timeFormat,
  datetimeFormat,
  // Props that should not be in extraProps
  testID: _testID,
  rule: _rule,
  rules: _rules,
  level: _level,
  path: _path,
  context: _context,
  validation: _validation,
  operator: _operator,
  field: _field,
  fieldData: _fieldData,
  schema: _schema,
  ...extraProps
}: AntDMultipleDatePickerProps) => {
  const { onChange, val } = useValueSelector({
    handleOnChange,
    listsAsArrays,
    multiple,
    value,
  });
  const computedValue = useMemo<string[]>(() => {
    if (Array.isArray(val)) return val;
    else if (!val) return [];
    return val?.split(",") || [];
  }, [value]);
  const [scopeValue, setScopeValue] = useState<string>();
  const handleAddValue = useCallback(
    (v: string | null) => {
      if (v) {
        if (val?.includes(v)) {
          return false;
        }
        onChange([...computedValue, v]);
        setScopeValue(undefined);
      }
    },
    [computedValue, onChange]
  );
  const handleRemoveValue = useCallback(
    (v: string) => {
      onChange(computedValue.filter((i) => i !== v));
    },
    [computedValue, onChange]
  );
  const defaultProps = useMemo(() => {
    switch (type) {
      case "time":
        return {
          format: timeFormat,
        };

      case "datetime":
        return {
          format: datetimeFormat,
          showTime: true,
        };
      case "date":
      default:
        return {
          format: dateFormat,
        };
    }
  }, [type, dateFormat, timeFormat, datetimeFormat]);
  return (
    <span className={className}>
      {computedValue.map((v) => (
        <Tag
          key={v}
          closeIcon
          onClose={() => handleRemoveValue(v)}
          style={{ padding: "6px" }}
        >
          {v}
        </Tag>
      ))}
      <DatePicker
        className="multiple-date-picker"
        value={scopeValue ? dayjs(scopeValue, defaultProps.format) : null}
        onChange={(_date, dateString) => handleAddValue(dateString)}
        disabledDate={(date) =>
          computedValue.includes(dayjs(date).format(defaultProps.format))
        }
        {...defaultProps}
        data-testid={`multiple-date-picker-${type}`}
        style={{ width: "37px" }}
        suffixIcon={<PlusCircleFilled />}
        placeholder="click to add"
      ></DatePicker>
    </span>
  );
};
