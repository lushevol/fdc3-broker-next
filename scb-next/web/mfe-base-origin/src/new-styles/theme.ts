import { Config, getPortalTheme } from 'ratan-design-origin/portal-theme';
import { createTheme, getThemeOptions, responsiveFontSizes } from 'ratan-design-origin/theme';
import { portalTokens } from './portal-tokens';

/** Base adapts its historical host overrides without changing shared defaults. */
export const createPortalPresentationTheme = (mode: 'light' | 'dark') => {
  const portalTheme = getPortalTheme(mode, true, true);
  const legacy = Config(portalTheme).config;
  const options = getThemeOptions(portalTheme, 'webkit');
  const colors = portalTokens.color[mode];
  return responsiveFontSizes(
    createTheme(legacy, {
      ...options,
      ratan: { designGeneration: 'webkit' },
      palette: {
        ...options.palette,
        background: { default: colors.canvas, paper: colors.canvas },
        text: { primary: colors.text, secondary: colors.muted },
      },
      components: {
        ...options.components,
        MuiCssBaseline: {
          ...legacy.components?.MuiCssBaseline,
          styleOverrides: {
            ...portalTheme.MuiCssBaseline.styleOverrides,
            body: {
              ...portalTheme.MuiCssBaseline.styleOverrides.body,
              background: colors.canvas,
              fontFamily: portalTokens.fontFamily,
            },
          },
        },
        MuiAppBar: legacy.components?.MuiAppBar,
        MuiDataGrid: legacy.components?.MuiDataGrid,
      },
    }),
  ) as typeof legacy;
};
