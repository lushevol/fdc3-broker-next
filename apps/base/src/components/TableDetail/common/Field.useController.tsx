import Box from '@mui/material/Box';
import React from 'react';
import type { FieldProps } from './interface';

const useController = (props: FieldProps) => {
  const { record, column, onChange, resetId } = props;
  const value = React.useMemo(() => {
    const valueGetter = column.valueGetter as any;
    return valueGetter ? valueGetter({ row: record }) : record[column.field];
  }, [record, column.valueGetter, column.field]);
  const [fieldValue, setFieldValue] = React.useState(value);
  const [inputValue, setInputValue] = React.useState('');
  const onInputChange = React.useCallback((_event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
  }, []);
  React.useEffect(() => {
    setTimeout(() => {
      onChange(fieldValue, column.field);
    }, 300);
  }, [fieldValue]);
  React.useEffect(() => {
    const valueGetter = column.valueGetter as any;
    const _value = valueGetter ? valueGetter({ row: record }) : record[column.field];
    setFieldValue(_value);
  }, [resetId]);
  const hiddenImage = React.useMemo(
    () => (column as any).hiddenImage,
    [record, column.valueGetter, column.field],
  );

  const onChangeAutoComplete = React.useCallback((_event: React.SyntheticEvent, newValue: any) => {
    setFieldValue(newValue);
  }, []);

  const RenderOptions = (props: React.HTMLAttributes<HTMLLIElement>, option: any) => {
    return (
      <Box
        component="li"
        height="50px"
        sx={{ mt: 1, mb: 1, '& > img': { mr: 2, flexShrink: 0 } }}
        {...props}
      >
        <img
          loading="lazy"
          width="50px"
          srcSet={`${option} 2x`}
          src={`/image/${option}`}
          alt={`/image/${option}`}
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
