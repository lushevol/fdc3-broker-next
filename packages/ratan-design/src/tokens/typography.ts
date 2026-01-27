/**
 * GDS Design Tokens - Typography
 * Generated from Figma Design System
 */

export const fontFamily = {
  primary:
    '"SC Prosper Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

export const fontSize = {
  helper: 12,
  description: 12,
  component: 14,
  titleSub: 16,
  sectionMinor: 18,
  sectionMain: 28,
};

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 700,
  bold: 700,
};

export const lineHeight = {
  helper: 16,
  description: 16,
  component: '100%',
  titleSub: 24,
  sectionMinor: 34,
  sectionMain: 44,
};

export const letterSpacing = {
  default: 0,
};

export const typographyTokens = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
};

// Typography styles
export const typographyStyles = {
  // Component level
  component: {
    regular: {
      fontFamily: fontFamily.primary,
      fontSize: fontSize.component,
      fontWeight: fontWeight.regular,
      lineHeight: lineHeight.component,
      letterSpacing: letterSpacing.default,
    },
    medium: {
      fontFamily: fontFamily.primary,
      fontSize: fontSize.component,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.component,
      letterSpacing: letterSpacing.default,
    },
    semibold: {
      fontFamily: fontFamily.primary,
      fontSize: fontSize.component,
      fontWeight: fontWeight.semibold,
      lineHeight: lineHeight.component,
      letterSpacing: letterSpacing.default,
    },
  },
  // Description level
  description: {
    regular: {
      fontFamily: fontFamily.primary,
      fontSize: fontSize.description,
      fontWeight: fontWeight.regular,
      lineHeight: lineHeight.description,
      letterSpacing: letterSpacing.default,
    },
  },
  // Helper text
  helper: {
    medium: {
      fontFamily: fontFamily.primary,
      fontSize: fontSize.helper,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.helper,
      letterSpacing: letterSpacing.default,
    },
  },
  // Title/Sub
  titleSub: {
    semibold: {
      fontFamily: fontFamily.primary,
      fontSize: fontSize.titleSub,
      fontWeight: fontWeight.semibold,
      lineHeight: lineHeight.titleSub,
      letterSpacing: letterSpacing.default,
    },
  },
  // Section/Minor
  sectionMinor: {
    bold: {
      fontFamily: fontFamily.primary,
      fontSize: fontSize.sectionMinor,
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.sectionMinor,
      letterSpacing: letterSpacing.default,
    },
  },
  // Section/Main
  sectionMain: {
    medium: {
      fontFamily: fontFamily.primary,
      fontSize: fontSize.sectionMain,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.sectionMain,
      letterSpacing: letterSpacing.default,
    },
  },
};
