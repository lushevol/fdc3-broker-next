export type ScWebkitToken = `var(--sc-${string})`;

const token = <Name extends `--sc-${string}`>(name: Name): `var(${Name})` => `var(${name})`;

export const newStyleTokens = {
  color: {
    background: token('--sc-layout-background-color'),
    surface: token('--sc-panel-background-color'),
    surfaceRaised: token('--sc-card-background-color'),
    surfaceSelected: token('--sc-card-selected-background'),
    text: token('--sc-layout-text-color'),
    textHeading: token('--sc-panel-title-color'),
    textMuted: token('--sc-panel-content-color'),
    border: token('--sc-divider-color'),
    borderInteractive: token('--sc-card-hover-border-color'),
    focus: token('--sc-focus-ring-color'),
    link: token('--sc-link-primary-color'),
    linkHover: token('--sc-link-hover-color'),
    icon: token('--sc-icon-primary-color'),
    info: token('--sc-status-info-icon'),
    success: token('--sc-status-success-icon'),
    warning: token('--sc-status-warning-icon'),
    danger: token('--sc-status-danger-icon'),
  },
  typography: {
    fontFamily: token('--sc-font-family'),
    fontSize: token('--sc-font-size'),
  },
  spacing: {
    none: token('--sc-spacing-0'),
    xsmall: token('--sc-spacing-4'),
    small: token('--sc-spacing-8'),
    medium: token('--sc-spacing-16'),
    large: token('--sc-spacing-24'),
    xlarge: token('--sc-spacing-32'),
  },
  radius: {
    none: token('--sc-radius-none'),
    small: token('--sc-radius-sm'),
    medium: token('--sc-radius-md'),
    large: token('--sc-radius-lg'),
  },
  shadow: {
    color: token('--sc-box-shadow-color'),
    focus: token('--sc-data-grid-cell-focus-shadow'),
  },
} as const satisfies Record<string, Record<string, ScWebkitToken>>;

export type NewStyleTokens = typeof newStyleTokens;
