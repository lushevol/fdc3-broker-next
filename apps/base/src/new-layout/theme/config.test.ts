import { THEME, getTheme } from '../../theme/config/utils';
import { getNewLayoutTheme } from './config';

describe('new-layout theme ownership', () => {
  beforeEach(() => window.history.pushState({}, '', '/'));

  it('keeps the legacy theme independent from the URL flag', () => {
    const legacyLight = getTheme(THEME.LIGHT);
    window.history.pushState({}, '', '/?new-layout=true');

    expect(getTheme(THEME.LIGHT)).toEqual(legacyLight);
    expect(legacyLight.MuiAppBar.styleOverrides.root.position).toBeUndefined();
    expect(legacyLight.MuiAppBar.styleOverrides.root.backgroundImage).toContain('linear-gradient');
  });

  it.each([THEME.LIGHT, THEME.DARK])('applies opt-in App Bar overrides for %s', (mode) => {
    const theme = getNewLayoutTheme(mode);

    expect(theme.MuiAppBar.styleOverrides.root.background).toMatch(/transparent|unset/);
    expect(theme.NewTileComponent.boxShadow).toBe('none');
    expect(theme.NewTileComponent.root.background).toBe('unset');
  });
});
