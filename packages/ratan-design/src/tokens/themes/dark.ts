/**
 * GDS Design Tokens - Dark Theme
 * Generated from Figma Design System
 */

import { darkPrimitiveColors } from '../colorsDark';
import {
  componentSizes,
  componentSpacing,
  componentRound,
  iconSizes,
} from '../sizes';
import { typographyStyles } from '../typography';
import { shadowStyles } from '../shadows';

export const darkTheme = {
  name: 'dark',
  colors: {
    // Background
    background: {
      primary: darkPrimitiveColors.grey[100],
      secondary: darkPrimitiveColors.grey[850],
      tertiary: darkPrimitiveColors.grey[800],
    },
    // Surface
    surface: {
      primary: darkPrimitiveColors.grey[100],
      secondary: darkPrimitiveColors.grey[200],
      elevated: darkPrimitiveColors.grey[150],
    },
    // Text
    text: {
      primary: darkPrimitiveColors.grey[100],
      secondary: darkPrimitiveColors.grey[200],
      tertiary: darkPrimitiveColors.grey[400],
      disabled: darkPrimitiveColors.grey[600],
      placeholder: darkPrimitiveColors.grey[500],
      helper: darkPrimitiveColors.grey[650],
      eyebrowHint: darkPrimitiveColors.grey[500],
      link: {
        default: darkPrimitiveColors.blue[800],
        hover: darkPrimitiveColors.blue[700],
        active: darkPrimitiveColors.blue[600],
        visited: darkPrimitiveColors.purple[600],
      },
      information: darkPrimitiveColors.blue[600],
    },
    // Border
    border: {
      primary: darkPrimitiveColors.blue[600],
      secondary: darkPrimitiveColors.grey[550],
      disabled: darkPrimitiveColors.grey[700],
      focus: darkPrimitiveColors.blue[800],
      divider: darkPrimitiveColors.grey[400],
    },
    // State
    state: {
      hover: darkPrimitiveColors.blue[800],
      active: darkPrimitiveColors.blue[700],
      focus: darkPrimitiveColors.blue[400],
      selected: darkPrimitiveColors.blue[800],
      disabled: {
        background: darkPrimitiveColors.grey[800],
        text: darkPrimitiveColors.grey[600],
      },
    },
    // Surface states
    surfacePrimary: {
      zeroDefault: darkPrimitiveColors.grey[150],
      subtleDefault: darkPrimitiveColors.grey[150],
      solidDefault: darkPrimitiveColors.blue[500],
    },
    surfaceSecondary: {
      subtleDefault: darkPrimitiveColors.grey[400],
    },
    // Link states
    linkPrimary: {
      default: darkPrimitiveColors.blue[800],
    },
    linkSecondary: {
      default: darkPrimitiveColors.blue[800],
      selected: darkPrimitiveColors.blue[950],
    },
    // Text states
    textPrimary: {
      subtleSelected: darkPrimitiveColors.blue[350],
    },
    textSecondary: {
      subtleDefault: darkPrimitiveColors.blue[850],
    },
    // Tab/Status
    tab: {
      horizPad: 16,
      vertPad: 16,
      surfaceSelectedLayered: darkPrimitiveColors.grey[900],
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
    success: darkPrimitiveColors.green[400],
    warning: darkPrimitiveColors.amber[400],
    error: darkPrimitiveColors.red[400],
    information: darkPrimitiveColors.blue[600],
    // Brand colors
    brand: {
      green: darkPrimitiveColors.green[500],
      blue: darkPrimitiveColors.blue[500],
      prosperBlue: darkPrimitiveColors.grey[900],
      prosperBlueInverse: darkPrimitiveColors.grey[900],
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
    borderHover: `${darkPrimitiveColors.grey[100]}00`,
  },
};

export default darkTheme;
