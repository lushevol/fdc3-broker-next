/**
 * GDS Design Tokens - Light Theme
 * Generated from Figma Design System
 */

import { primitiveColors } from '../colors';
import {
  componentSizes,
  componentSpacing,
  componentRound,
  iconSizes,
} from '../sizes';
import { typographyStyles } from '../typography';
import { shadowStyles } from '../shadows';

export const lightTheme = {
  name: 'light',
  colors: {
    // Background
    background: {
      primary: primitiveColors.grey.white,
      secondary: primitiveColors.grey[50],
      tertiary: primitiveColors.grey[100],
    },
    // Surface
    surface: {
      primary: primitiveColors.grey.white,
      secondary: primitiveColors.grey[600],
      elevated: primitiveColors.grey.white,
    },
    // Text
    text: {
      primary: primitiveColors.grey[850],
      secondary: primitiveColors.grey[950],
      tertiary: primitiveColors.grey[600],
      disabled: primitiveColors.grey[400],
      placeholder: primitiveColors.grey[400],
      helper: primitiveColors.grey[650],
      eyebrowHint: primitiveColors.grey[500],
      link: {
        default: primitiveColors.blue[200],
        hover: primitiveColors.blue[350],
        active: primitiveColors.blue[600],
        visited: primitiveColors.purple[500],
      },
      information: primitiveColors.blue[600],
    },
    // Border
    border: {
      primary: primitiveColors.blue[500],
      secondary: primitiveColors.grey[550],
      disabled: primitiveColors.grey[200],
      focus: primitiveColors.blue[500],
      divider: primitiveColors.grey[200],
    },
    // State
    state: {
      hover: primitiveColors.blue[100],
      active: primitiveColors.blue[200],
      focus: primitiveColors.blue[400],
      selected: primitiveColors.blue[100],
      disabled: {
        background: primitiveColors.grey[100],
        text: primitiveColors.grey[400],
      },
    },
    // Surface states
    surfacePrimary: {
      zeroDefault: primitiveColors.grey[850],
      subtleDefault: primitiveColors.grey[850],
      solidDefault: primitiveColors.blue[500],
    },
    surfaceSecondary: {
      subtleDefault: primitiveColors.grey[600],
    },
    // Link states
    linkPrimary: {
      default: primitiveColors.blue[200],
    },
    linkSecondary: {
      default: primitiveColors.blue[200],
      selected: primitiveColors.blue[50],
    },
    // Text states
    textPrimary: {
      subtleSelected: primitiveColors.blue[650],
    },
    textSecondary: {
      subtleDefault: primitiveColors.blue[150],
    },
    // Tab/Status
    tab: {
      horizPad: 16,
      vertPad: 16,
      surfaceSelectedLayered: primitiveColors.grey.white,
    },
    // Card
    card: {
      horizPad: 6,
      vertPad: 6,
    },
    // Input
    input: {
      minHeight: 22,
      horizPad: 12,
      vertPad: 5,
    },
    // Button
    button: {
      horizPadText: 4,
      vertPadText: 1,
      minTextButtonHeight: 24,
      padButtonToggle: 2,
    },
    // Status colors
    success: primitiveColors.green[500],
    warning: primitiveColors.amber[500],
    error: primitiveColors.red[500],
    information: primitiveColors.blue[600],
    // Brand colors
    brand: {
      green: primitiveColors.green[500],
      blue: primitiveColors.blue[500],
      prosperBlue: primitiveColors.grey[900],
      prosperBlueInverse: primitiveColors.grey[900],
    },
  },
  sizes: {
    ...componentSizes,
    ...componentSpacing,
    ...componentRound,
    ...iconSizes,
  },
  typography: typographyStyles,
  shadows: shadowStyles,
  borderRadius: {
    none: 0,
    sm: componentRound['4px'],
    md: componentRound['6px'],
    lg: 8,
    xl: 16,
    full: 9999,
  },
  // Focus
  focus: {
    borderHover: `${primitiveColors.grey.white}00`,
  },
};

export default lightTheme;
