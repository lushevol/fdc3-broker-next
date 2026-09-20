import { webkitReferences } from "./webkit-theme.generated.js";

export type ScWebkitToken = `var(--sc-${string})`;

const token = (name: string): ScWebkitToken => `var(${name})` as ScWebkitToken;
const references = webkitReferences;

export const newStyleTokens = {
  color: {
    background: token(references.color.background),
    surface: token(references.color.surface),
    surfaceRaised: token(references.color.surfaceRaised),
    surfaceSelected: token(references.color.surfaceSelected),
    text: token(references.color.text),
    textHeading: token(references.color.textHeading),
    textMuted: token(references.color.textMuted),
    border: token(references.color.border),
    borderInteractive: token(references.color.borderInteractive),
    focus: token(references.color.focus),
    link: token(references.color.link),
    linkHover: token(references.color.linkHover),
    icon: token(references.color.icon),
    info: token(references.color.info),
    success: token(references.color.success),
    warning: token(references.color.warning),
    danger: token(references.color.danger),
  },
  typography: {
    fontFamily: token(references.typography.fontFamily),
    fontSize: token(references.typography.fontSize),
  },
  spacing: {
    none: token(references.spacing.none),
    xsmall: token(references.spacing.xsmall),
    small: token(references.spacing.small),
    medium: token(references.spacing.medium),
    large: token(references.spacing.large),
    xlarge: token(references.spacing.xlarge),
  },
  radius: {
    none: token(references.radius.none),
    small: token(references.radius.small),
    medium: token(references.radius.medium),
    large: token(references.radius.large),
  },
  shadow: {
    color: token(references.shadow.color),
    focus: token(references.shadow.focus),
  },
} as const satisfies Record<string, Record<string, ScWebkitToken>>;

export type NewStyleTokens = typeof newStyleTokens;
