import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { MenuItem } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React from 'react';
import ErrorBoundry from '../ErrorBoundry';
import Input from '../Input';
import Select from '../Select';
import useController from './common/Field.useController';
import type { FieldProps } from './common/interface';

const Field: React.FC<FieldProps> = (props: FieldProps): React.ReactElement => {
  const { record, column, columnId } = props;
  const {
    onChangeAutoComplete,
    fieldValue,
    inputValue,
    onInputChange,
    setFieldValue,
    RenderOptions,
  } = useController(props);
  let element;
  switch (column?.type) {
    case 'actions':
      element = <></>;
      break;
    case 'autoComplete':
      element = (
        <ErrorBoundry>
          <Autocomplete
            key={`ModalInput-${column.field}-${columnId}`}
            data-testid={`ModalInput-${column.field}-${columnId}`}
            disableClearable
            disabled={column.readOnly ?? record.readOnly}
            options={Array.isArray(column?.valueOptions) ? (column.valueOptions as any[]) : []}
            inputValue={inputValue}
            onInputChange={onInputChange}
            autoHighlight
            getOptionLabel={(option: any) => option}
            popupIcon={<KeyboardArrowDownIcon />}
            value={fieldValue}
            onChange={onChangeAutoComplete}
            renderOption={RenderOptions}
            renderInput={(params) => (
              <Input
                {...params}
                label={column.headerName}
                variant="outlined"
                labelPosition="left"
                placeholder="Please select"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={column.readOnly ?? record.readOnly}
              />
            )}
          />
        </ErrorBoundry>
      );
      break;
    case 'singleSelect':
      element = (
        <ErrorBoundry>
          <Select
            key={`ModalInput-${column.field}-${columnId}`}
            data-testid={`ModalInput-${column.field}-${columnId}`}
            label={column.headerName}
            variant="outlined"
            labelPosition="left"
            value={`${fieldValue}`}
            onChange={(e) => {
              let __value: any = e.target.value;
              if (['true', 'false'].includes(__value)) {
                __value = __value === 'true';
              }
              setFieldValue(__value);
            }}
            disabled={column.readOnly ?? record.readOnly}
          >
            {Array.isArray(column?.valueOptions) &&
              column?.valueOptions?.map((item) => {
                return (
                  <MenuItem value={item} key={`${column.field}-${item}`}>
                    {item}
                  </MenuItem>
                );
              })}
          </Select>
        </ErrorBoundry>
      );
      break;
    case 'custom':
      element = (
        <ErrorBoundry>
          {column.renderEditCell
            ? column.renderEditCell({
                ...props,
                value: fieldValue,
                onChange: (newValue) => setFieldValue(newValue), // Adapter for custom component
              })
            : null}
        </ErrorBoundry>
      );
      break;
    default:
      element = (
        <ErrorBoundry>
          <Input
            key={`ModalInput-${column.field}-${columnId}`}
            data-testid={`ModalInput-${column.field}-${columnId}`}
            label={column.headerName}
            variant="outlined"
            labelPosition="left"
            placeholder={column.placeholder ?? 'Type here'}
            value={fieldValue}
            disabled={column.readOnly ?? record.readOnly}
            multiline={column.multiline}
            type={column.type ?? 'text'}
            sx={{
              '& textarea': {
                minHeight: '39px',
              },
            }}
            onChange={(e) => setFieldValue(e.target.value)}
          />
        </ErrorBoundry>
      );
      break;
  }
  return element;
};

export default React.memo(Field);
