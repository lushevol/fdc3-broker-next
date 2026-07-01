/// <reference types="react" />
import { TileProps } from "./interface";
export declare const PREFIX: string;
export declare const classes: {
  root: string;
  main: string;
  content: string;
  title: string;
  titledisabled: string;
};
export declare const backgroundCss: (
  props: TileProps,
  theme?: string
) => string;
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
export default Root;
