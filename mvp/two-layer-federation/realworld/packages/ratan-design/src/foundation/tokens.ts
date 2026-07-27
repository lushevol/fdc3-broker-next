export const COLOR_TOKEN_NAMES = [
  'surfaceDefault',
  'surfaceRaised',
  'surfaceInteractive',
  'surfaceOverlay',
  'contentPrimary',
  'contentSecondary',
  'contentInverse',
  'borderSubtle',
  'borderStrong',
  'actionPrimary',
  'actionPrimaryHover',
  'actionOnPrimary',
  'actionDanger',
  'focusRing',
  'overlayBackdrop',
  'overlayShadow',
  'statusReadyContent',
  'statusReadySurface',
  'statusReviewContent',
  'statusReviewSurface',
  'statusBlockedContent',
  'statusBlockedSurface',
  'statusNeutralContent',
  'statusNeutralSurface',
] as const;

export const DENSITY_TOKEN_NAMES = [
  'controlHeight',
  'controlPaddingInline',
  'controlGap',
] as const;

export type ColorTokenName = (typeof COLOR_TOKEN_NAMES)[number];
export type DensityTokenName = (typeof DENSITY_TOKEN_NAMES)[number];
export type DesignScheme = 'light' | 'dark';
export type DesignDensity = 'compact' | 'comfortable';

/**
 * The local GDS reference is the authority for palette values and semantic
 * naming. Dark mode is a Ratan composition of those same primitives because
 * the supplied GDS reference defines a light theme only.
 */
export const GDS_OFFICIAL_TOKEN_SOURCE = 'gds-official/src/styles/theme.css' as const;

export const gdsPrimitiveTokens = {
  white: '#ffffff',
  black: '#000000',
  grey25: '#f9f9f9',
  grey50: '#f2f2f2',
  grey100: '#e5e5e5',
  grey150: '#d9d9d9',
  grey200: '#cccccc',
  grey400: '#999999',
  grey500: '#808080',
  grey600: '#666666',
  grey650: '#595959',
  grey700: '#4d4d4d',
  grey850: '#262626',
  grey900: '#1a1a1a',
  grey950: '#0d0d0d',
  blue50: '#e5f1fc',
  blue250: '#81b9f4',
  blue350: '#4f9df0',
  blue500: '#0473ea',
  blue550: '#0367d2',
  blue600: '#035cbb',
  green50: '#ebfbe6',
  green300: '#87e769',
  green550: '#32bd00',
  green700: '#207e00',
  amber50: '#fef6e7',
  amber350: '#fcc65b',
  amber450: '#fab52c',
  amber750: '#7d570a',
  red50: '#fce6e7',
  red300: '#ec6c73',
  red400: '#e63b44',
  red550: '#ca0913',
} as const;

export interface SemanticTokens {
  readonly color: Readonly<Record<DesignScheme, Readonly<Record<ColorTokenName, string>>>>;
  readonly density: Readonly<Record<DesignDensity, Readonly<Record<DensityTokenName, string>>>>;
  readonly foundation: {
    readonly fontFamily: string;
    readonly fontSizeBody: string;
    readonly fontSizeLabel: string;
    readonly fontWeightStrong: string;
    readonly radiusControl: string;
    readonly radiusPill: string;
    readonly focusWidth: string;
    readonly focusOffset: string;
    readonly opacityDisabled: string;
    readonly opacityFieldDisabled: string;
    readonly opacityPlaceholder: string;
    readonly motionDurationFast: string;
    readonly motionPressOffset: string;
    readonly zIndexModal: string;
    readonly dialogWidthSmall: string;
    readonly dialogWidthMedium: string;
    readonly dialogWidthLarge: string;
    readonly dialogMaxHeight: string;
  };
}

export const semanticTokens = {
  color: {
    light: {
      surfaceDefault: gdsPrimitiveTokens.white,
      surfaceRaised: gdsPrimitiveTokens.white,
      surfaceInteractive: gdsPrimitiveTokens.grey50,
      surfaceOverlay: gdsPrimitiveTokens.white,
      contentPrimary: gdsPrimitiveTokens.grey950,
      contentSecondary: gdsPrimitiveTokens.grey700,
      contentInverse: gdsPrimitiveTokens.white,
      borderSubtle: gdsPrimitiveTokens.grey200,
      borderStrong: gdsPrimitiveTokens.grey400,
      actionPrimary: gdsPrimitiveTokens.blue500,
      actionPrimaryHover: gdsPrimitiveTokens.blue350,
      actionOnPrimary: gdsPrimitiveTokens.white,
      actionDanger: gdsPrimitiveTokens.red550,
      focusRing: gdsPrimitiveTokens.blue500,
      overlayBackdrop: 'rgb(0 0 0 / 48%)',
      overlayShadow: 'rgb(0 0 0 / 20%)',
      statusReadyContent: gdsPrimitiveTokens.green700,
      statusReadySurface: gdsPrimitiveTokens.green50,
      statusReviewContent: gdsPrimitiveTokens.amber750,
      statusReviewSurface: gdsPrimitiveTokens.amber50,
      statusBlockedContent: gdsPrimitiveTokens.red550,
      statusBlockedSurface: gdsPrimitiveTokens.red50,
      statusNeutralContent: gdsPrimitiveTokens.grey700,
      statusNeutralSurface: gdsPrimitiveTokens.grey50,
    },
    dark: {
      surfaceDefault: gdsPrimitiveTokens.grey950,
      surfaceRaised: gdsPrimitiveTokens.grey900,
      surfaceInteractive: gdsPrimitiveTokens.grey850,
      surfaceOverlay: gdsPrimitiveTokens.grey850,
      contentPrimary: gdsPrimitiveTokens.white,
      contentSecondary: gdsPrimitiveTokens.grey200,
      contentInverse: gdsPrimitiveTokens.grey950,
      borderSubtle: gdsPrimitiveTokens.grey600,
      borderStrong: gdsPrimitiveTokens.grey500,
      actionPrimary: gdsPrimitiveTokens.blue350,
      actionPrimaryHover: gdsPrimitiveTokens.blue250,
      actionOnPrimary: gdsPrimitiveTokens.grey950,
      actionDanger: gdsPrimitiveTokens.red300,
      focusRing: gdsPrimitiveTokens.blue250,
      overlayBackdrop: 'rgb(0 0 0 / 68%)',
      overlayShadow: 'rgb(0 0 0 / 42%)',
      statusReadyContent: gdsPrimitiveTokens.green300,
      statusReadySurface: gdsPrimitiveTokens.grey850,
      statusReviewContent: gdsPrimitiveTokens.amber450,
      statusReviewSurface: gdsPrimitiveTokens.grey850,
      statusBlockedContent: gdsPrimitiveTokens.red300,
      statusBlockedSurface: gdsPrimitiveTokens.grey850,
      statusNeutralContent: gdsPrimitiveTokens.grey150,
      statusNeutralSurface: gdsPrimitiveTokens.grey850,
    },
  },
  density: {
    compact: {
      controlHeight: '2rem',
      controlPaddingInline: '0.75rem',
      controlGap: '0.5rem',
    },
    comfortable: {
      controlHeight: '2.5rem',
      controlPaddingInline: '1rem',
      controlGap: '0.75rem',
    },
  },
  foundation: {
    fontFamily: '"SC Prosper Sans", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSizeBody: '0.875rem',
    fontSizeLabel: '0.75rem',
    fontWeightStrong: '700',
    radiusControl: '0.5rem',
    radiusPill: '999px',
    focusWidth: '2px',
    focusOffset: '2px',
    opacityDisabled: '0.48',
    opacityFieldDisabled: '0.58',
    opacityPlaceholder: '0.82',
    motionDurationFast: '120ms',
    motionPressOffset: '1px',
    zIndexModal: '1000',
    dialogWidthSmall: '30rem',
    dialogWidthMedium: '44rem',
    dialogWidthLarge: '64rem',
    dialogMaxHeight: 'min(90vh, 52rem)',
  },
} as const satisfies SemanticTokens;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function validatePath(
  root: unknown,
  path: readonly string[],
  errors: string[],
) {
  let current = root;
  for (const segment of path) {
    current = isRecord(current) ? current[segment] : undefined;
  }
  if (typeof current !== 'string' || current.length === 0) {
    errors.push(`${path.join('.')} must be a non-empty string`);
  }
}

export function validateSemanticTokens(candidate: unknown): string[] {
  const errors: string[] = [];
  for (const scheme of ['light', 'dark'] as const) {
    for (const token of COLOR_TOKEN_NAMES) validatePath(candidate, ['color', scheme, token], errors);
  }
  for (const density of ['compact', 'comfortable'] as const) {
    for (const token of DENSITY_TOKEN_NAMES) validatePath(candidate, ['density', density, token], errors);
  }
  for (const token of Object.keys(semanticTokens.foundation)) {
    validatePath(candidate, ['foundation', token], errors);
  }
  return errors;
}
