import { Config, getPortalTheme } from 'ratan-design-origin/portal-theme';
import { createTheme, getThemeOptions, responsiveFontSizes } from 'ratan-design-origin/theme';
import { portalTokens } from './portal-tokens';

/** Generate typography from raw options; retain only Base's host policy. */
export const createPortalPresentationTheme = (mode: 'light' | 'dark') => {
  const portalTheme = getPortalTheme(mode, true, true);
  const legacy = Config(portalTheme).config;
  const legacyOptions = getThemeOptions(portalTheme);
  const options = getThemeOptions(portalTheme, 'webkit');
  const colors = portalTokens.color[mode];
  return responsiveFontSizes(
    createTheme({
      ...legacyOptions,
      ...options,
      theme: legacy.theme,
      customColor: legacy.customColor,
      ratan: { designGeneration: 'webkit' },
      palette: {
        ...legacyOptions.palette,
        ...options.palette,
        background: { default: colors.canvas, paper: colors.canvas },
        text: { primary: colors.text, secondary: colors.muted },
      },
      components: {
        ...legacy.components,
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
