import type { fin as FinApi } from "@openfin/core";

declare interface Window {
  fin: typeof FinApi;
}

declare module "@mui/material/styles" {
  interface Theme {
    customColor: Object;
    theme: Object;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    customColor?: Object;
    theme?: Object;
  }
}
