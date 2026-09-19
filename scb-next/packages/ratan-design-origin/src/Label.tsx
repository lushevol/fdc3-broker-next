import React from "react";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "@mui/icons-material";
import MuiMenuItem, { type MenuItemProps } from "@mui/material/MenuItem";
import MuiSelect, { type SelectProps as MuiSelectProps } from "@mui/material/Select";
import { styled } from "@mui/material/styles";

export interface LabelProps extends Omit<MuiSelectProps, "variant"> {
  variant?: "standard" | "outlined" | "filled";
}

const borderless = {
  border: "0px !important",
  backgroundColor: "transparent !important",
};

const Root = styled(MuiSelect)(({ theme }) => ({
  ...borderless,
  "&:before": { ...borderless },
  "&:after": { ...borderless },
  "& .MuiSvgIcon-root": { color: theme.palette.primary.main },
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

const LabelMenuItemRoot = styled(MuiMenuItem)({ minWidth: "263px" });

export const LabelMenuItem = /*#__PURE__*/ React.forwardRef<
  HTMLLIElement,
  MenuItemProps
>(function LabelMenuItem(props, ref) {
  return <LabelMenuItemRoot {...props} ref={ref} />;
});

export function Label({
  variant: _variant,
  IconComponent: _IconComponent,
  label,
  children,
  SelectDisplayProps,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}: LabelProps) {
  const displayLabelledBy =
    SelectDisplayProps?.["aria-labelledby"] ?? ariaLabelledBy;
  const defaultLabel =
    typeof label === "string" || typeof label === "number"
      ? String(label)
      : undefined;
  return (
    <Root
      variant="standard"
      IconComponent={KeyboardArrowDownIcon}
      defaultValue={label}
      SelectDisplayProps={{
        ...SelectDisplayProps,
        "aria-label":
          SelectDisplayProps?.["aria-label"] ??
          ariaLabel ??
          (displayLabelledBy ? undefined : defaultLabel),
        "aria-labelledby": displayLabelledBy,
      }}
      {...rest}
    >
      <LabelMenuItem disabled>{label}</LabelMenuItem>
      <LabelMenuItem value={label as string} style={{ display: "none" }}>
        {label}
      </LabelMenuItem>
      {children}
    </Root>
  );
}
