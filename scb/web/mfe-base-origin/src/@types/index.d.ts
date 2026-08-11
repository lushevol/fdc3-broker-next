import type { fin as FinApi } from "@openfin/core";
import type { CSSObject } from "@mui/system";
import type custom from "../theme/config/common";
import type { getTheme } from "../theme/config/utils";

type AppThemeConfig = Omit<ReturnType<typeof getTheme>, "Avatar"> & {
  Avatar: { menu?: CSSObject };
};

declare interface Window {
  fin: typeof FinApi;
}

declare module "@mui/material/styles" {
  interface Theme {
    customColor: typeof custom.color;
    theme: AppThemeConfig;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    customColor?: typeof custom.color;
    theme?: AppThemeConfig;
  }
}
