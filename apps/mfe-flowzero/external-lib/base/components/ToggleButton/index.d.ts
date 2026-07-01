/// <reference types="react" />
import { ToggleButtonProps as MuiToggleButtonProps } from "@mui/material/ToggleButton";
export type ToggleButtonProps = MuiToggleButtonProps;
export declare const modeStyle: (
  theme: any,
  mode: any
) =>
  | {
      color: string;
      "&.MuiToggleButton-root": {
        "&:hover": {
          backgroundColor: string;
        };
        minWidth: string;
        padding: string;
        fontWeight: number;
        border: number;
        "& svg": {
          marginRight: any;
          transform: string;
        };
        backgroundColor: string;
      };
      "&.Mui-selected": {
        "&:hover": {
          background: string;
        };
        borderRadius: string;
        border: string;
        transform: string;
        zIndex: number;
        backgroundColor: string;
        background: string;
      };
      "&.Mui-disabled": {
        color: string;
      };
    }
  | {
      "&.MuiToggleButton-root": {
        "&:hover": {
          backgroundColor: string;
        };
        minWidth: string;
        padding: string;
        fontWeight: number;
        border: number;
        "& svg": {
          marginRight: any;
          transform: string;
        };
        backgroundColor: string;
      };
      "&.Mui-selected": {
        "&:hover": {
          background: string;
        };
        borderRadius: string;
        border: string;
        transform: string;
        zIndex: number;
        backgroundColor: string;
        background: string;
      };
      "&.Mui-disabled": {
        color: string;
      };
      color?: undefined;
    };
declare const ToggleButton: import("@emotion/styled").StyledComponent<
  import("@mui/material/ToggleButton").ToggleButtonOwnProps &
    Omit<import("@mui/material").ButtonBaseOwnProps, "classes"> &
    import("@mui/material/OverridableComponent").CommonProps &
    Omit<
      Omit<
        import("react").DetailedHTMLProps<
          import("react").ButtonHTMLAttributes<HTMLButtonElement>,
          HTMLButtonElement
        >,
        "ref"
      > & {
        ref?:
          | ((instance: HTMLButtonElement | null) => void)
          | import("react").RefObject<HTMLButtonElement>
          | null
          | undefined;
      },
      | "value"
      | "children"
      | "disabled"
      | "color"
      | "className"
      | "style"
      | "classes"
      | "fullWidth"
      | "size"
      | "sx"
      | "tabIndex"
      | "onChange"
      | "onClick"
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
      | "disableFocusRipple"
    > &
    import("@mui/system").MUIStyledCommonProps<
      import("@mui/material/styles").Theme
    >,
  {},
  {}
>;
export default ToggleButton;
