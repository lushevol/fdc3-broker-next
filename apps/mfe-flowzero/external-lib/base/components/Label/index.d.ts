import { SelectProps as MuiSelectProps } from "@mui/material/Select";
import * as React from "react";
export interface LabelProps extends Omit<MuiSelectProps, "variant"> {
  variant?: "standard" | "outlined" | "filled";
}
export declare const MenuItem: import("@emotion/styled").StyledComponent<
  import("@mui/material/MenuItem").MenuItemOwnProps &
    Omit<import("@mui/material").ButtonBaseOwnProps, "classes"> &
    import("@mui/material/OverridableComponent").CommonProps &
    Omit<
      Omit<
        React.DetailedHTMLProps<
          React.LiHTMLAttributes<HTMLLIElement>,
          HTMLLIElement
        >,
        "ref"
      > & {
        ref?:
          | ((instance: HTMLLIElement | null) => void)
          | React.RefObject<HTMLLIElement>
          | null
          | undefined;
      },
      | "children"
      | "disabled"
      | "className"
      | "style"
      | "classes"
      | "sx"
      | "autoFocus"
      | "tabIndex"
      | "dense"
      | "disableGutters"
      | "divider"
      | "selected"
      | "action"
      | "centerRipple"
      | "disableRipple"
      | "disableTouchRipple"
      | "focusRipple"
      | "focusVisibleClassName"
      | "LinkComponent"
      | "onFocusVisible"
      | "TouchRippleProps"
      | "touchRippleRef"
    > &
    import("@mui/system").MUIStyledCommonProps<
      import("@mui/material/styles").Theme
    >,
  {},
  {}
>;
declare const Label: ({
  variant: _variant,
  IconComponent: _IconComponent,
  label,
  children,
  ...rest
}: LabelProps) => import("react/jsx-runtime").JSX.Element;
export default Label;
