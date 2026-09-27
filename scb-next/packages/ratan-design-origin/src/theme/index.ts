import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';
import getDarkTheme from './dark.js';
import getLightTheme from './light.js';
import { getThemeOptions } from './options.js';

export {
  createTheme,
  css,
  darken,
  responsiveFontSizes,
  styled,
  ThemeProvider,
  useTheme,
} from '@mui/material/styles';
export type { CSSObject, Theme } from '@mui/material/styles';

export type DesignGeneration = 'legacy' | 'webkit';
export interface RatanThemeOptions {
  mode?: PaletteMode;
  designGeneration?: DesignGeneration;
  container?: HTMLElement | (() => HTMLElement | null);
}

declare module '@mui/material/styles' {
  interface Theme {
    ratan: { designGeneration: DesignGeneration };
  }
  interface ThemeOptions {
    ratan?: { designGeneration: DesignGeneration };
  }
}

export const getControlTheme = (mode: PaletteMode = 'light') =>
  mode === 'dark' ? getDarkTheme() : getLightTheme();

export type ControlThemeConfig = ReturnType<typeof getControlTheme>;
export { getThemeOptions };

export function createRatanTheme({
  mode = 'light',
  designGeneration = 'legacy',
  container,
}: RatanThemeOptions = {}) {
  const options = getThemeOptions(getControlTheme(mode), designGeneration);
  return responsiveFontSizes(
    createTheme({
      ...options,
      ratan: { designGeneration },
      components: {
        ...options.components,
        MuiMenu: {
          ...options.components?.MuiMenu,
          defaultProps: { container },
        },
        MuiPopover: { defaultProps: { container } },
        MuiDialog: {
          ...options.components?.MuiDialog,
          defaultProps: { ...options.components?.MuiDialog?.defaultProps, container },
        },
        MuiModal: { defaultProps: { container } },
        MuiPopper: { defaultProps: { container } },
      },
    }),
  );
}
