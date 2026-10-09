import React from "react";
import { GridValueGetterParams } from "ratan-design-origin/data-grid";
import { FieldProps } from "./interface";
import { createDetailValueGetterParams } from "../../../new-styles/detail-value-getter";
import { renderDetailOption } from "../../../new-styles/detail-option";

const useController = (props: FieldProps) => {
  const { record, column, onChange, resetId } = props;
  const value = React.useMemo(
    () =>
      column.valueGetter
        ? column.valueGetter(createDetailValueGetterParams(record, column.field) as GridValueGetterParams)
        : record[column.field],
    [record, column.valueGetter, column.field]
  );
  const [fieldValue, setFieldValue] = React.useState(value);
  const [inputValue, setInputValue] = React.useState("");
  const onInputChange = React.useCallback(
    (_event: React.SyntheticEvent, newInputValue: string) => {
      setInputValue(newInputValue);
    },
    []
  );
  React.useEffect(() => {
    setTimeout(() => {
      onChange(fieldValue, column.field);
    }, 300);
  }, [fieldValue]);
  React.useEffect(() => {
    const _value = column.valueGetter
      ? column.valueGetter(createDetailValueGetterParams(record, column.field) as GridValueGetterParams)
      : record[column.field];
    setFieldValue(_value);
  }, [resetId]);
  const hiddenImage = React.useMemo(
    () => column.hiddenImage,
    [record, column.valueGetter, column.field]
  );

  const onChangeAutoComplete = React.useCallback(
    (_event: React.SyntheticEvent, newValue: unknown) => {
      setFieldValue(newValue);
    },
    []
  );

  const RenderOptions = (
    props: React.HTMLAttributes<HTMLLIElement> & { key?: React.Key },
    option: string
  ) => renderDetailOption(props, option, hiddenImage);

  return {
    hiddenImage,
    value,
    fieldValue,
    inputValue,
    onInputChange,
    setFieldValue,
    onChangeAutoComplete,
    RenderOptions,
  };
};

export default useController;
