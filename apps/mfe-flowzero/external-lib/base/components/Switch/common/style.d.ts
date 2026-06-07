/// <reference types="react" />
export declare const PREFIX: string;
export declare const classes: {
  root: string;
  icon: string;
  switch: string;
  label: string;
};
declare const Root: import("@emotion/styled").StyledComponent<
  import("@mui/system").MUIStyledCommonProps<
    import("@mui/material/styles").Theme
  >,
  import("react").DetailedHTMLProps<
    import("react").HTMLAttributes<HTMLElement>,
    HTMLElement
  >,
  {}
>;
export declare const SwitchStyled: import("@emotion/styled").StyledComponent<
  import("@mui/material/Switch").SwitchProps &
    import("@mui/system").MUIStyledCommonProps<
      import("@mui/material/styles").Theme
    >,
  {},
  {}
>;
export default Root;
