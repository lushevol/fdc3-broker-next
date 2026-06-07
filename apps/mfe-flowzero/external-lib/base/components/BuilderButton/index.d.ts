import { ButtonProps } from "@mui/material/Button";
import { PopoverVirtualElement } from "@mui/material/Popover";
import React from "react";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export declare function TabPanel(
  props: Readonly<TabPanelProps>
): import("react/jsx-runtime").JSX.Element;
export declare function a11yTabPanelProps(index: number): {
  id: string;
  "aria-controls": string;
};
export declare const emptyFunction: () => {};
export declare const Tabs: import("@emotion/styled").StyledComponent<
  import("@mui/material/Tabs").TabsOwnProps &
    import("@mui/material/OverridableComponent").CommonProps &
    Omit<
      Omit<
        React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLDivElement>,
          HTMLDivElement
        >,
        "ref"
      > & {
        ref?:
          | ((instance: HTMLDivElement | null) => void)
          | React.RefObject<HTMLDivElement>
          | null
          | undefined;
      },
      | "value"
      | "children"
      | "className"
      | "style"
      | "classes"
      | "sx"
      | "variant"
      | "aria-label"
      | "aria-labelledby"
      | "onChange"
      | "slotProps"
      | "slots"
      | "action"
      | "orientation"
      | "allowScrollButtonsMobile"
      | "centered"
      | "indicatorColor"
      | "ScrollButtonComponent"
      | "scrollButtons"
      | "selectionFollowsFocus"
      | "TabIndicatorProps"
      | "TabScrollButtonProps"
      | "textColor"
      | "visibleScrollbar"
    > &
    import("@mui/system").MUIStyledCommonProps<
      import("@mui/material/styles").Theme
    >,
  {},
  {}
>;
export declare const Tab: import("@emotion/styled").StyledComponent<
  import("@mui/material/Tab").TabOwnProps &
    Omit<import("@mui/material").ButtonBaseOwnProps, "classes"> &
    import("@mui/material/OverridableComponent").CommonProps &
    Omit<
      Omit<
        React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLDivElement>,
          HTMLDivElement
        >,
        "ref"
      > & {
        ref?:
          | ((instance: HTMLDivElement | null) => void)
          | React.RefObject<HTMLDivElement>
          | null
          | undefined;
      },
      | "value"
      | "children"
      | "disabled"
      | "className"
      | "style"
      | "classes"
      | "sx"
      | "label"
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
      | "icon"
      | "iconPosition"
      | "wrapped"
    > &
    import("@mui/system").MUIStyledCommonProps<
      import("@mui/material/styles").Theme
    >,
  {},
  {}
>;
export interface BuilderButtonProps extends ButtonProps {
  label: "Table" | "Filters";
  anchorEl:
    | Element
    | (() => Element)
    | PopoverVirtualElement
    | (() => PopoverVirtualElement)
    | HTMLButtonElement
    | null;
  popOverWidth?: string;
  popOverHeight?: string;
}
declare const BuilderButton: ({
  variant: _variant,
  startIcon: _startIcon,
  color: _color,
  label,
  anchorEl: _anchorEl,
  popOverWidth,
  popOverHeight,
  children,
  ...rest
}: BuilderButtonProps) => import("react/jsx-runtime").JSX.Element;
export default BuilderButton;
