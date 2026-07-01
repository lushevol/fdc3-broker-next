/// <reference types="react" />
export declare const PREFIX: string;
export declare const classes: {};
declare const Root: import("@emotion/styled").StyledComponent<
  import("../../Dialog/common/types").DialogProps &
    import("@mui/system").MUIStyledCommonProps<
      import("@mui/material/styles").Theme
    >,
  {},
  {}
>;
export declare const Accordion: import("@emotion/styled").StyledComponent<
  {
    children: NonNullable<import("react").ReactNode>;
    classes?:
      | Partial<import("@mui/material/Accordion").AccordionClasses>
      | undefined;
    defaultExpanded?: boolean | undefined;
    disabled?: boolean | undefined;
    disableGutters?: boolean | undefined;
    expanded?: boolean | undefined;
    onChange?:
      | ((
          event: import("react").SyntheticEvent<Element, Event>,
          expanded: boolean
        ) => void)
      | undefined;
    sx?:
      | import("@mui/material/styles").SxProps<
          import("@mui/material/styles").Theme
        >
      | undefined;
    TransitionComponent?:
      | import("react").JSXElementConstructor<
          import("@mui/material/transitions").TransitionProps & {
            children?: import("react").ReactElement<any, any> | undefined;
          }
        >
      | undefined;
    TransitionProps?:
      | import("@mui/material/transitions").TransitionProps
      | undefined;
  } & Omit<import("@mui/material").PaperOwnProps, "classes" | "onChange"> &
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
      | "children"
      | "sx"
      | keyof import("@mui/material/OverridableComponent").CommonProps
      | "onChange"
      | "elevation"
      | "disabled"
      | "variant"
      | "TransitionComponent"
      | "TransitionProps"
      | "square"
      | "defaultExpanded"
      | "disableGutters"
      | "expanded"
    > &
    import("@mui/system").MUIStyledCommonProps<
      import("@mui/material/styles").Theme
    >,
  {},
  {}
>;
export default Root;
