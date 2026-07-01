/// <reference types="react" />
import { ButtonProps } from "@mui/material/Button";
export type SearchButtonProps = ButtonProps;
declare const ResetButton: import("@emotion/styled").StyledComponent<
  import("@mui/material/Button").ButtonOwnProps &
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
      | "children"
      | "disabled"
      | "color"
      | "className"
      | "style"
      | "classes"
      | "fullWidth"
      | "size"
      | "sx"
      | "variant"
      | "tabIndex"
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
      | "disableElevation"
      | "endIcon"
      | "href"
      | "startIcon"
    > &
    import("@mui/system").MUIStyledCommonProps<
      import("@mui/material/styles").Theme
    >,
  {},
  {}
>;
export default ResetButton;
