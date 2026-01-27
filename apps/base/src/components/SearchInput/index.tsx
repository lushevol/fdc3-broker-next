import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Input, { type InputProps } from '../Input';

export interface SearchInputProps extends InputProps {
  handleClear: () => void;
}

const SearchInput = ({ InputProps: _InputProps, handleClear, ...rest }: SearchInputProps) => {
  return (
    <Input
      InputProps={{
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
      }}
      {...rest}
      sx={{
        '& .MuiInputBase-root': {
          paddingRight: '8px',
        },
      }}
    />
  );
};

export default SearchInput;
