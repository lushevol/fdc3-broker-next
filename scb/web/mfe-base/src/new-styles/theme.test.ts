import { createPortalPresentationTheme } from './theme';
import Config from '../theme/Config';
import { getTheme } from '../theme/config/utils';
import { createTheme, getThemeOptions, responsiveFontSizes } from 'ratan-design-origin/theme';
import { getPortalTheme } from 'ratan-design-origin/portal-theme';

describe('Portal prototype theme boundary', () => {
  it('selects WebKit controls without changing shared legacy defaults', () => {
    const theme = createPortalPresentationTheme('light');
    expect(theme.ratan.designGeneration).toBe('webkit');
    expect(theme.typography.fontFamily).toContain('SC Prosper Sans');
    expect(theme.palette.background.default).toBe('#ffffff');
    expect(theme.components?.MuiDataGrid?.styleOverrides).toEqual(
      Config(getTheme('light')).config.components?.MuiDataGrid?.styleOverrides,
    );
    expect(Config(getTheme('light')).config.ratan?.designGeneration).not.toBe('webkit');
  });

  it.each(['light', 'dark'] as const)('keeps %s text roles and conversions coherent', (mode) => {
    const theme = createPortalPresentationTheme(mode);
    for (const variant of ['body1', 'body2', 'button', 'caption', 'h1', 'h6'] as const) {
      expect(theme.typography[variant].fontFamily).toContain('SC Prosper Sans');
    }
    expect(theme.typography.body1.fontSize).toBe('14px');
    expect(theme.typography.body2.fontSize).toBe('12px');
    expect(theme.typography.caption.fontSize).toBe('12px');
    expect(theme.typography.pxToRem(14)).toBe('0.875rem');

    const fresh = responsiveFontSizes(createTheme(getThemeOptions(getPortalTheme(mode, true, true), 'webkit')));
    expect(theme.typography.h1).toEqual(fresh.typography.h1);
    expect(theme.typography.h6).toEqual(fresh.typography.h6);
  });

  it.each(['light', 'dark'] as const)('preserves %s host policies during recomposition', (mode) => {
    const legacy = Config(getPortalTheme(mode, true, true)).config;
    const theme = createPortalPresentationTheme(mode);
    expect(theme.components?.MuiAppBar).toEqual(legacy.components?.MuiAppBar);
    expect(theme.components?.MuiDataGrid).toEqual(legacy.components?.MuiDataGrid);
    expect(theme.components?.MuiTextField?.defaultProps?.size).toBe('small');
    expect(theme.theme.palette).toEqual(legacy.theme.palette);
    expect(theme.theme.LoginPage).toEqual(legacy.theme.LoginPage);
    expect(theme.theme.NewTileComponent).toEqual(legacy.theme.NewTileComponent);
    expect(theme.customColor).toEqual(legacy.customColor);
  });
});
