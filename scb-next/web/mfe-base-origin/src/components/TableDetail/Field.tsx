import React from "react";
import { FieldProps } from "./common/interface";
import ErrorBoundry from "../ErrorBoundry";
import Input from "../Input";
import { MenuItem } from "@mui/material";
import Select from "../Select";

import Autocomplete from "@mui/material/Autocomplete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import useController from "./common/Field.useController";

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
  switch (column.editorType ?? column.type) {
    case "actions":
      element = <></>;
      break;
    case "autoComplete":
      element = (
        <ErrorBoundry>
          <Autocomplete
            key={`ModalInput-${column.field}-${columnId}`}
            data-testid={`ModalInput-${column.field}-${columnId}`}
            disableClearable
            disabled={column.readOnly ?? record.readOnly}
            options={column.valueOptions ?? []}
            inputValue={inputValue}
            onInputChange={onInputChange}
            autoHighlight
            getOptionLabel={(option: string) => option}
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
                slotProps={{ inputLabel: { shrink: true } }}
                disabled={column.readOnly ?? record.readOnly}
              />
            )}
          />
        </ErrorBoundry>
      );
      break;
    case "singleSelect":
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
              let value: string | boolean = String(e.target.value);
              if (["true", "false"].includes(value)) {
                value = value === "true";
              }
              setFieldValue(value);
            }}
            disabled={column.readOnly ?? record.readOnly}
          >
            {column?.valueOptions?.map((item: string) => {
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
    default:
      element = (
        <ErrorBoundry>
          <Input
            key={`ModalInput-${column.field}-${columnId}`}
            data-testid={`ModalInput-${column.field}-${columnId}`}
            label={column.headerName}
            variant="outlined"
            labelPosition="left"
            placeholder={column.placeholder ?? "Type here"}
            value={fieldValue}
            disabled={column.readOnly ?? record.readOnly}
            multiline={column.multiline}
            type={column.type ?? "text"}
            sx={{
              "& textarea": {
                minHeight: "39px",
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
