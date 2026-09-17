import React from "react";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Input, type InputProps } from "./Input.js";

export interface SearchInputProps extends InputProps {
  handleClear: () => void;
}

export function SearchInput({
  slotProps,
  handleClear,
  ...rest
}: SearchInputProps) {
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
              <IconButton onClick={handleClear}>
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...rest}
      sx={{
        "& .MuiInputBase-root": {
          paddingRight: "8px",
        },
      }}
    />
  );
}
