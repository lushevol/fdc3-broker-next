import {
  createRatanTheme,
  createTheme,
  darken,
  type CSSObject,
  type Theme,
} from 'ratan-design-origin/theme';
import { portalTokens } from '../portal-tokens';
import { STYLE_FONTS, type StyleSettings } from './settings';

const contrastPalette = createTheme({ palette: { contrastThreshold: 4.5 } }).palette;
const primaryText = (color: string) =>
  contrastPalette.getContrastText(color) === '#fff' ? '#ffffff' : '#000000';

/** Rebuild generation-specific controls while retaining Portal host policy. */
export function createControlPreviewBaseline(base: Theme, settings: StyleSettings): Theme {
  const controls = createRatanTheme({
    mode: settings.mode,
    designGeneration: settings.designGeneration,
  });
  return {
    ...base,
    typography: controls.typography,
    ratan: controls.ratan,
    shape: controls.shape,
    components: {
      ...base.components,
      ...controls.components,
      MuiCssBaseline: base.components?.MuiCssBaseline,
      MuiAppBar: base.components?.MuiAppBar,
      MuiDataGrid: base.components?.MuiDataGrid,
    },
  };
}

export function createStylePreviewVariables(settings: StyleSettings): CSSObject {
  const scale = settings.fontSize / portalTokens.typography.body.fontSize;
  const hover = darken(settings.primaryColor, 0.15);
  const pressed = darken(settings.primaryColor, 0.25);
  const text = primaryText(settings.primaryColor);
  const roles = {
    'page-heading': portalTokens.typography.pageHeading,
    'section-heading': portalTokens.typography.sectionHeading,
    title: portalTokens.typography.title,
    body: portalTokens.typography.body,
    caption: portalTokens.typography.caption,
    'hero-heading': portalTokens.typography.heroHeading,
    'hero-body': portalTokens.typography.heroBody,
  };
  const variables: CSSObject = {
    '--portal-preview-font-family': STYLE_FONTS[settings.fontFamily].value,
    '--portal-preview-primary': settings.primaryColor,
    '--portal-preview-primary-hover': hover,
    '--portal-preview-primary-text': text,
    '--portal-preview-control-radius': `${settings.radius}px`,
    '--portal-preview-header-label-font-size': `${portalTokens.size.headerLabelSize * scale}px`,
    '--portal-preview-tab-font-size': `${portalTokens.size.tabFontSize * scale}px`,
    '--sc-font-family': STYLE_FONTS[settings.fontFamily].value,
    '--sc-font-size': `${settings.fontSize}px`,
    '--sc-button-rounded-border-radius': `${settings.radius}px`,
    '--sc-form-input-border-radius': `${settings.radius}px`,
    '--sc-focus-ring-color': settings.primaryColor,
    '--sc-form-input-focus-border-color': settings.primaryColor,
    '--sc-form-input-hover-border-color': hover,
    '--sc-button-secondary-text-color': settings.primaryColor,
    '--sc-button-secondary-border-color': settings.primaryColor,
    '--sc-button-secondary-hover-text-color': hover,
    '--sc-button-secondary-hover-border-color': hover,
    '--sc-switch-checked-background-color': settings.primaryColor,
  };
  for (const [role, typography] of Object.entries(roles)) {
    variables[`--portal-preview-${role}-font-size`] = `${typography.fontSize * scale}px`;
    variables[`--portal-preview-${role}-line-height`] =
      `${parseFloat(typography.lineHeight) * scale}px`;
  }
  for (const [state, color] of Object.entries({
    '': settings.primaryColor,
    'hover-': hover,
    'press-': pressed,
    'select-': pressed,
  })) {
    variables[`--sc-button-primary-${state}background-color`] = color;
    variables[`--sc-button-primary-${state}border-color`] = color;
    variables[`--sc-button-primary-${state}text-color`] = primaryText(color);
  }
  return variables;
}

const scaledSize = (value: unknown, scale: number): unknown => {
  if (typeof value === 'number') return value * scale;
  if (typeof value !== 'string') return value;
  const size = value.match(/^([\d.]+)(px|rem|em)$/);
  return size ? `${Number(size[1]) * scale}${size[2]}` : value;
};

/** Scale explicit text roles, including responsive variants, without scaling layout. */
function scaleTextStyles(style: CSSObject, scale: number, family?: string): CSSObject {
  return Object.fromEntries(
    Object.entries(style).map(([key, value]) => {
      if (
        key === 'fontSize' ||
        (key === 'lineHeight' && typeof value === 'string' && value.endsWith('px'))
      )
        return [key, scaledSize(value, scale)];
      if (key === 'fontFamily' && family) return [key, family];
      if (value && typeof value === 'object' && !Array.isArray(value))
        return [key, scaleTextStyles(value as CSSObject, scale, family)];
      return [key, value];
    }),
  ) as CSSObject;
}

export function createStylePreviewTheme(base: Theme, settings: StyleSettings): Theme {
  const scale = settings.fontSize / portalTokens.typography.body.fontSize;
  const family = STYLE_FONTS[settings.fontFamily].value;
  const typography = scaleTextStyles(base.typography as unknown as CSSObject, scale, family);
  let components = { ...base.components };
  // Package controls define explicit compact sizes in addition to typography roles.
  for (const key of [
    'MuiButton',
    'MuiInputBase',
    'MuiOutlinedInput',
    'MuiInputLabel',
    'MuiFormHelperText',
    'MuiSelect',
    'MuiMenuItem',
    'MuiSwitch',
    'MuiChip',
  ] as const) {
    const component = base.components?.[key];
    if (component?.styleOverrides)
      components = {
        ...components,
        [key]: {
          ...component,
          styleOverrides: scaleTextStyles(component.styleOverrides as CSSObject, scale, family),
        },
      };
  }
  return createTheme(base, {
    ratan: { designGeneration: settings.designGeneration },
    typography: {
      ...typography,
      fontFamily: family,
      fontSize: settings.fontSize,
      pxToRem: (size: number) => `${(size / base.typography.htmlFontSize) * scale}rem`,
    },
    palette: {
      mode: settings.mode,
      primary: {
        ...contrastPalette.augmentColor({ color: { main: settings.primaryColor } }),
        contrastText: primaryText(settings.primaryColor),
      },
    },
    shape: { borderRadius: settings.radius },
    components: {
      ...components,
      MuiButton: {
        ...components.MuiButton,
        defaultProps: { ...components.MuiButton?.defaultProps, size: settings.controlSize },
        styleOverrides: {
          ...components.MuiButton?.styleOverrides,
          root: {
            ...((components.MuiButton?.styleOverrides?.root ?? {}) as CSSObject),
            borderRadius: settings.radius,
          },
        },
      },
      MuiTextField: {
        ...components.MuiTextField,
        defaultProps: { ...components.MuiTextField?.defaultProps, size: settings.controlSize },
      },
      MuiFormControl: {
        ...components.MuiFormControl,
        defaultProps: { ...components.MuiFormControl?.defaultProps, size: settings.controlSize },
        styleOverrides: {
          ...components.MuiFormControl?.styleOverrides,
          root: {
            fontSize: (settings.controlSize === 'small'
              ? (typography.body2 as CSSObject)
              : (typography.body1 as CSSObject)
            ).fontSize,
          },
        },
      },
      MuiInputBase: {
        ...components.MuiInputBase,
        defaultProps: { ...components.MuiInputBase?.defaultProps, size: settings.controlSize },
      },
      MuiOutlinedInput: {
        ...components.MuiOutlinedInput,
        defaultProps: { ...components.MuiOutlinedInput?.defaultProps, size: settings.controlSize },
        styleOverrides: {
          ...components.MuiOutlinedInput?.styleOverrides,
          root: {
            ...((components.MuiOutlinedInput?.styleOverrides?.root ?? {}) as CSSObject),
            borderRadius: settings.radius,
          },
        },
      },
    },
  });
}
