import React from "react";
import Box from "@mui/material/Box";
import { GridValueGetterParams } from "@mui/x-data-grid";
import { FieldProps } from "./interface";

const useController = (props: FieldProps) => {
  const { record, column, onChange, resetId } = props;
  const value = React.useMemo(
    () =>
      column.valueGetter
        ? column.valueGetter({ row: record } as GridValueGetterParams)
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
      ? column.valueGetter({ row: record } as GridValueGetterParams)
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
    props: React.HTMLAttributes<HTMLLIElement>,
    option: string
  ) => {
    return (
      <Box
        component="li"
        height="50px"
        sx={{ mt: 1, mb: 1, "& > img": { mr: 2, flexShrink: 0 } }}
        {...props}
      >
        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
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
