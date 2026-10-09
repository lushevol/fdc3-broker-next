import { createRatanTheme } from 'ratan-design-origin/theme';
import { createPortalPresentationTheme } from '../theme';
import { Config, getPortalTheme } from 'ratan-design-origin/portal-theme';
import { DEFAULT_STYLE_SETTINGS, STYLE_FONTS } from './settings';
import { createStylePreviewTheme, createStylePreviewVariables, createControlPreviewBaseline } from './preview-theme';

describe('style preview composition', () => {
  it.each(['webkit', 'legacy'] as const)('builds %s samples using the supplied generation theme', (designGeneration) => {
    const baseline = createRatanTheme({ mode: 'dark', designGeneration });
    const theme = createStylePreviewTheme(baseline, {
      ...DEFAULT_STYLE_SETTINGS, mode: 'dark', designGeneration,
      fontSize: 18, fontFamily: 'inter', primaryColor: '#a31545', radius: 3, controlSize: 'medium',
    });
    expect(theme.ratan.designGeneration).toBe(designGeneration);
    expect(theme.palette.mode).toBe('dark');
    expect(theme.palette.primary.main).toBe('#a31545');
    expect(theme.palette.primary.dark).not.toBe(baseline.palette.primary.dark);
    expect(theme.palette.primary.light).not.toBe(baseline.palette.primary.light);
    expect(theme.typography.fontFamily).toBe(STYLE_FONTS.inter.value);
    expect(theme.typography.body1.fontFamily).toBe(STYLE_FONTS.inter.value);
    expect(theme.shape.borderRadius).toBe(3);
    expect(theme.components?.MuiButton?.styleOverrides?.root).toMatchObject({ borderRadius: 3 });
    expect(theme.components?.MuiButton?.defaultProps?.size).toBe('medium');
    expect(theme.components?.MuiTextField?.defaultProps?.size).toBe('medium');
    expect(baseline.palette.primary.main).not.toBe('#a31545');
  });

  it('scales Portal and compact component typography coherently without modifying geometry', () => {
    const base = createPortalPresentationTheme('light');
    const theme = createStylePreviewTheme(base, { ...DEFAULT_STYLE_SETTINGS, fontSize: 18 });
    expect(theme.typography.body1.fontSize).toBe('18px');
    expect(parseFloat(String(theme.typography.caption.fontSize))).toBeCloseTo(12 * 18 / 14);
    expect(theme.typography.pxToRem(14)).toBe('1.125rem');
    expect(theme.components?.MuiAppBar).toEqual(base.components?.MuiAppBar);
    expect(theme.components?.MuiDataGrid).toEqual(base.components?.MuiDataGrid);
    expect(base.typography.body1.fontSize).toBe('14px');
  });

  it('supplies semantic Portal and canonical WebKit variables including readable primary text', () => {
    const vars = createStylePreviewVariables({ ...DEFAULT_STYLE_SETTINGS, fontSize: 18, primaryColor: '#ffffff', radius: 4 });
    expect(vars['--portal-preview-body-font-size']).toBe('18px');
    expect(vars['--portal-preview-title-font-size']).toBe(`${20 * 18 / 14}px`);
    expect(vars['--portal-preview-control-radius']).toBe('4px');
    expect(vars['--sc-button-primary-background-color']).toBe('#ffffff');
    expect(vars['--sc-button-primary-text-color']).toBe('#000000');
    expect(createStylePreviewVariables(DEFAULT_STYLE_SETTINGS)['--sc-button-primary-text-color']).toBe('#ffffff');
  });

  it.each(['webkit', 'legacy'] as const)('selects actual %s controls over a legacy Portal baseline', (designGeneration) => {
    const base = Config(getPortalTheme('light')).config;
    const theme = createControlPreviewBaseline(base, { ...DEFAULT_STYLE_SETTINGS, designGeneration });
    expect(theme.ratan.designGeneration).toBe(designGeneration);
    expect(theme.components?.MuiButton).toEqual(createRatanTheme({ designGeneration }).components?.MuiButton);
    expect(theme.components?.MuiAppBar).toEqual(base.components?.MuiAppBar);
    expect(theme.components?.MuiDataGrid).toEqual(base.components?.MuiDataGrid);
  });

  it.each(['small', 'medium'] as const)('scales %s field labels and helpers with their input text', (controlSize) => {
    const theme = createStylePreviewTheme(createRatanTheme({ designGeneration: 'webkit' }), {
      ...DEFAULT_STYLE_SETTINGS, fontSize: 20, controlSize,
    });
    const root = theme.components?.MuiFormControl?.styleOverrides?.root;
    expect(root).toMatchObject({ fontSize: controlSize === 'small' ? `${12 * (20 / 14)}px` : '20px' });
    expect(theme.components?.MuiFormHelperText?.styleOverrides?.root).toMatchObject({ fontSize: 12 * (20 / 14) });
  });
});
