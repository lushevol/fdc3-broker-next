import Input, { InputProps } from "../Input";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";

export interface SearchInputProps extends InputProps {
  handleClear: () => void;
}

const SearchInput = ({
  slotProps,
  handleClear,
  ...rest
}: SearchInputProps) => {
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
};

export default SearchInput;
