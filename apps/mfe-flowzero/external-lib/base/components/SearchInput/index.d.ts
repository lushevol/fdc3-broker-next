import { InputProps } from "../Input";
export interface SearchInputProps extends InputProps {
  handleClear: () => void;
}
declare const SearchInput: ({
  InputProps: _InputProps,
  handleClear,
  ...rest
}: SearchInputProps) => import("react/jsx-runtime").JSX.Element;
export default SearchInput;
