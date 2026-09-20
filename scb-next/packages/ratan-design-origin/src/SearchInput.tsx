import React from "react";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Input, type InputProps } from "./Input.js";
import { composeSx } from "./sx.js";

const DEFAULT_CLEAR_BUTTON_LABEL = "Clear search";

export interface SearchInputProps extends InputProps {
  handleClear: () => void;
  clearButtonLabel?: string;
}

export function SearchInput({
  slotProps,
  handleClear,
  clearButtonLabel = DEFAULT_CLEAR_BUTTON_LABEL,
  sx,
  ...rest
}: SearchInputProps) {
  const inputDisabled =
    slotProps?.input?.disabled ?? rest.InputProps?.disabled ?? rest.disabled;
  const inputReadOnly =
    slotProps?.input?.readOnly ?? rest.InputProps?.readOnly ?? false;
  const nativeInputDisabled =
    slotProps?.htmlInput?.disabled ?? rest.inputProps?.disabled ?? false;
  const nativeInputReadOnly =
    slotProps?.htmlInput?.readOnly ?? rest.inputProps?.readOnly ?? false;
  const clearUnavailable = Boolean(
    inputDisabled ||
      inputReadOnly ||
      nativeInputDisabled ||
      nativeInputReadOnly
  );

  return (
    <Input
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={clearButtonLabel}
                disabled={clearUnavailable}
                onClick={handleClear}
              >
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...rest}
      sx={composeSx({ "& .MuiInputBase-root": { paddingRight: "8px" } }, sx)}
    />
  );
}
