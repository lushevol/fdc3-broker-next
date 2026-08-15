import type { CSSObject } from "@mui/material/styles";
import type custom from "../theme/config/common";
import type { getTheme } from "../theme/config/utils";

type AppThemeConfig = Omit<ReturnType<typeof getTheme>, "Avatar"> & {
  Avatar: { menu?: CSSObject };
};

declare interface Window {
  fin?: unknown;
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
