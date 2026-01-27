import type { fin as FinApi } from '@openfin/core';

declare interface Window {
  fin: typeof FinApi;
}

declare module '@mui/material/styles' {
  interface Theme {
    customColor: Record<string, any>;
    theme: Record<string, any>;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    customColor?: Record<string, any>;
    theme?: Record<string, any>;
  }
}
