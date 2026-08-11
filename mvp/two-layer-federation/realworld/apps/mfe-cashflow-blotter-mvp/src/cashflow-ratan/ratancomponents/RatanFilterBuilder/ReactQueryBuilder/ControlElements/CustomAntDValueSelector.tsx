import { Select } from "antd";
import type { ComponentPropsWithoutRef } from "react";
import {
  toOptions,
  VersatileSelectorProps,
  useValueSelector,
} from "react-querybuilder";

interface DisplayValueType {
  key?: React.Key;
  value?: string | number;
  label?: React.ReactNode;
  title?: string | number;
  disabled?: boolean;
}

export const MaxTagPlaceholder: (
  omittedValues: DisplayValueType[]
) => React.ReactNode = (ov) => {
  const title = ov.map((i) => i.label).join(", ");
  return <span title={title}>{`+${ov.length}...`}</span>;
};

export type AntDValueSelectorProps = Omit<VersatileSelectorProps, "schema"> &
  Omit<ComponentPropsWithoutRef<typeof Select>, "onChange" | "defaultValue"> & {
    schema?: any;
    widgetType?: "select" | "multiselect" | "multiselectWithoutOptions";
  };

export const CustomAntDValueSelector = ({
  className,
  handleOnChange,
  options,
  value,
  title,
  disabled,
  multiple,
  listsAsArrays,
  widgetType,
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
}: AntDValueSelectorProps) => {
  const { onChange, val } = useValueSelector({
    handleOnChange,
    listsAsArrays,
    multiple,
    value,
  });

  const modeObj = multiple ? { mode: "tags" as const } : {};

  return (
    <span className={className} data-testid="custom-value-selector">
      <Select
        {...modeObj}
        tokenSeparators={[","]}
        // popupMatchSelectWidth={false}
        maxTagCount="responsive"
        maxTagPlaceholder={MaxTagPlaceholder}
        disabled={disabled}
        value={val}
        onChange={onChange}
        {...(widgetType === "multiselectWithoutOptions" && {
          notFoundContent: null,
        })}
        placeholder="press enter to split"
        style={{ minWidth: "200px" }}
        {...extraProps}
      >
        {toOptions(options)}
      </Select>
    </span>
  );
};

CustomAntDValueSelector.displayName = "CustomAntDValueSelector";
