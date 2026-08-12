import { InputNumber, Tag } from "antd";
import isNil from "lodash/isNil";
import { useCallback, useMemo, useState } from "react";
import { ParseNumbersMethod, useValueSelector } from "react-querybuilder";
import { AntDValueSelectorProps } from "./CustomAntDValueSelector";

export const MultipleInputNumber = ({
  className,
  handleOnChange,
  options,
  value,
  title,
  disabled,
  multiple,
  listsAsArrays,
  parseNumbers,
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
}: AntDValueSelectorProps & { parseNumbers?: ParseNumbersMethod }) => {
  const { onChange, val } = useValueSelector({
    handleOnChange,
    listsAsArrays,
    multiple,
    value,
  });
  const [scopeValue, setScopeValue] = useState<number>();
  const computedValue = useMemo(() => {
    if (Array.isArray(val)) return val;
    return [];
  }, [val]);
  const handleAddValue = useCallback(
    (v: number) => {
      const pv = parseNumbers ? v : v + "";
      if (pv !== null) {
        if (computedValue?.includes(pv)) {
          return false;
        }
        onChange([...computedValue, pv]);
        setScopeValue(undefined);
      }
    },
    [computedValue, onChange, parseNumbers]
  );
  const handleRemoveValue = useCallback(
    (v: number) => {
      onChange(computedValue.filter((i) => i !== v));
    },
    [computedValue, onChange]
  );
  return (
    <div className="rule-value">
      {computedValue.map((v) => (
        <Tag key={v} closeIcon onClose={() => handleRemoveValue(v)}>
          {v}
        </Tag>
      ))}
      <InputNumber<number>
        value={scopeValue}
        onChange={(v) => setScopeValue(v as number)}
        onPressEnter={() =>
          !isNil(scopeValue) && handleAddValue(scopeValue as number)
        }
        placeholder="press enter to submit"
        data-testid={`multiple-input-number`}
      ></InputNumber>
    </div>
  );
};
