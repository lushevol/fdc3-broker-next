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
  };
}

export const semanticTokens = {
  color: {
    light: {
      surfaceDefault: '#f5f7fb',
      surfaceRaised: '#ffffff',
      surfaceInteractive: '#e8eef6',
      surfaceOverlay: '#ffffff',
      contentPrimary: '#172033',
      contentSecondary: '#53647c',
      contentInverse: '#ffffff',
      borderSubtle: '#cbd5e1',
      borderStrong: '#8da0ba',
      actionPrimary: '#006b5f',
      actionPrimaryHover: '#00564c',
      actionOnPrimary: '#ffffff',
      actionDanger: '#b42335',
      focusRing: '#007f72',
      statusReadyContent: '#075f54',
      statusReadySurface: '#d6f5ef',
      statusReviewContent: '#815000',
      statusReviewSurface: '#fff1c7',
      statusBlockedContent: '#9b1c31',
      statusBlockedSurface: '#ffe1e6',
      statusNeutralContent: '#46566c',
      statusNeutralSurface: '#e8edf4',
    },
    dark: {
      surfaceDefault: '#0d1c2f',
      surfaceRaised: '#11253c',
      surfaceInteractive: '#183451',
      surfaceOverlay: '#162c45',
      contentPrimary: '#edf5ff',
      contentSecondary: '#9bb0c7',
      contentInverse: '#07121e',
      borderSubtle: '#29435f',
      borderStrong: '#527091',
      actionPrimary: '#5eead4',
      actionPrimaryHover: '#7cefdc',
      actionOnPrimary: '#07121e',
      actionDanger: '#ff9cab',
      focusRing: '#7cefdc',
      statusReadyContent: '#7cead5',
      statusReadySurface: '#123b38',
      statusReviewContent: '#ffd48b',
      statusReviewSurface: '#45351e',
      statusBlockedContent: '#ff9cab',
      statusBlockedSurface: '#48242e',
      statusNeutralContent: '#b5c3d5',
      statusNeutralSurface: '#26374c',
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
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSizeBody: '0.8125rem',
    fontSizeLabel: '0.75rem',
    fontWeightStrong: '700',
    radiusControl: '0.5rem',
    radiusPill: '999px',
    focusWidth: '2px',
    focusOffset: '2px',
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
