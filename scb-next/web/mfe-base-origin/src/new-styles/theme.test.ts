import { createPortalPresentationTheme } from './theme';
import Config from '../theme/Config';
import { getTheme } from '../theme/config/utils';

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
});
