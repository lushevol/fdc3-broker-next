/**
 * GDS Design Tokens - Theme Types
 */

export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  surface: {
    primary: string;
    secondary: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    placeholder: string;
    helper: string;
    link: {
      default: string;
      hover: string;
      active: string;
      visited: string;
    };
  };
  border: {
    primary: string;
    secondary: string;
    disabled: string;
    focus: string;
  };
  state: {
    hover: string;
    active: string;
    focus: string;
    selected: string;
    disabled: {
      background: string;
      text: string;
    };
  };
  success: string;
  warning: string;
  error: string;
  information: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: string | number;
  letterSpacing: number;
}

export interface ThemeShadows {
  elevation1: {
    boxShadow: string;
  };
  elevation3: {
    boxShadow: string;
  };
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  sizes: Record<string, number | string>;
  typography: Record<string, Record<string, ThemeTypography>>;
  shadows: ThemeShadows;
  borderRadius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
}
