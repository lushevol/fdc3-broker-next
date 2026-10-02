import React from "react";
import { Box } from "ratan-design-origin/primitives";
import type { GridValueGetterParams } from "ratan-design-origin/data-grid";
import type { AdminRecord } from "../../../admin/common/interface";
import { FieldProps } from "./interface";

const useController = (props: FieldProps) => {
  const { record, column, onChange, resetId } = props;
  const value = React.useMemo<unknown>(
    () =>
      column.valueGetter
        ? column.valueGetter({
            row: record,
            field: column.field,
            value: record[column.field],
          } as GridValueGetterParams<AdminRecord, unknown>)
        : record[column.field],
    [record, column.valueGetter, column.field]
  );
  const [fieldValue, setFieldValue] = React.useState<unknown>(value);
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
    const _value: unknown = column.valueGetter
      ? column.valueGetter({
          row: record,
          field: column.field,
          value: record[column.field],
        } as GridValueGetterParams<AdminRecord, unknown>)
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
  ) => {
    const { key, ...optionProps } = props;
    return (
      <Box
        key={key}
        component="li"
        sx={{
          height: "50px",
          mt: 1,
          mb: 1,
          "& > img": { mr: 2, flexShrink: 0 },
        }}
        {...optionProps}
      >
        <img
          loading="lazy"
          width="50px"
          srcSet={`${option} 2x`}
          src={`/image/${option}`}
          alt={`${option}`}
          hidden={hiddenImage}
        />
        {option}
      </Box>
    );
  };

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
