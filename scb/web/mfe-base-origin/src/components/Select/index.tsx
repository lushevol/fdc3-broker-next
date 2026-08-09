import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { InputStyled } from "../Input";

const PREFIX = `${process.env.MFE_APP_PREFIX_STYLE}_CustomSelect`;
const classes = {
  left: `${PREFIX}-left`,
};

const SelectFormControl = styled(FormControl)(InputStyled(classes));

export interface SelectProps extends Omit<MuiSelectProps, "variant"> {
  labelPosition?: "top" | "left";
  variant: "standard" | "outlined" | "filled" | undefined;
}

export default function Select({
  labelPosition = "top",
  label,
  variant: _variant,
  size: _size,
  ...rest
}: Readonly<SelectProps>) {
  return (
    <SelectFormControl
      fullWidth
      size={_size ?? "small"}
      variant={_variant}
      className={labelPosition === "left" ? classes.left : undefined}
    >
      <InputLabel>{label}</InputLabel>
      <MuiSelect IconComponent={KeyboardArrowDownIcon} {...rest} />
    </SelectFormControl>
  );
}
