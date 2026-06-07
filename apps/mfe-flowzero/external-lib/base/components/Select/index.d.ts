import { SelectProps as MuiSelectProps } from "@mui/material";
export interface SelectProps extends Omit<MuiSelectProps, "variant"> {
  labelPosition?: "top" | "left";
  variant: "standard" | "outlined" | "filled" | undefined;
}
export default function Select({
  labelPosition,
  label,
  variant: _variant,
  size: _size,
  ...rest
}: Readonly<SelectProps>): import("react/jsx-runtime").JSX.Element;
