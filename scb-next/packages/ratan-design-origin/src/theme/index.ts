import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';
import getDarkTheme from './dark.js';
import getLightTheme from './light.js';
import { getThemeOptions } from './options.js';

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
        MuiModal: { defaultProps: { container } },
        MuiPopper: { defaultProps: { container } },
      },
    }),
  );
}
