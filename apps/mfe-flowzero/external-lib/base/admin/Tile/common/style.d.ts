/// <reference types="react" />
export declare const PREFIX: string;
export declare const classes: {
  root: string;
};
declare const Root: import("@emotion/styled").StyledComponent<
  import("@mui/material/Stack").StackOwnProps &
    import("@mui/material/OverridableComponent").CommonProps &
    Omit<
      Omit<
        import("react").DetailedHTMLProps<
          import("react").HTMLAttributes<HTMLDivElement>,
          HTMLDivElement
        >,
        "ref"
      > & {
        ref?:
          | ((instance: HTMLDivElement | null) => void)
          | import("react").RefObject<HTMLDivElement>
          | null
          | undefined;
      },
      | keyof import("@mui/material/OverridableComponent").CommonProps
      | keyof import("@mui/material/Stack").StackOwnProps
    > &
    import("@mui/system").MUIStyledCommonProps<
      import("@mui/material/styles").Theme
    >,
  {},
  {}
>;
export default Root;
