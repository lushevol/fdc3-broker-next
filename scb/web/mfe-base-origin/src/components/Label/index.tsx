import * as React from "react";
import Select, { SelectProps as MuiSelectProps } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MuiMenuItem from "@mui/material/MenuItem";

export interface LabelProps extends Omit<MuiSelectProps, "variant"> {
  variant?: "standard" | "outlined" | "filled";
}

const defStyle = {
  border: "0px !important",
  backgroundColor: "transparent !important",
};

const Root = styled(Select)(({ theme }) => ({
  ...defStyle,
  "&:before": { ...defStyle },
  "&:after": { ...defStyle },
  "& .MuiSvgIcon-root": {
    color: theme.palette.primary.main,
  },
  "& div[aria-expanded='false']": {
    padding: "4px 8px",
    marginLeft: "-8px",
  },
  "& div[aria-expanded='true']": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: "4px 8px",
    marginLeft: "-8px",
  },
}));

export const MenuItem = styled(MuiMenuItem)({
  minWidth: "263px",
});

const Label = ({
  variant: _variant,
  IconComponent: _IconComponent,
  label,
  children,
  ...rest
}: LabelProps) => (
  <Root
    variant="standard"
    IconComponent={KeyboardArrowDownIcon}
    defaultValue={label}
    {...rest}
  >
    <MenuItem disabled>{label}</MenuItem>
    <MenuItem value={label as string} style={{ display: "none" }}>
      {label}
    </MenuItem>
    {children}
  </Root>
);

export default Label;
