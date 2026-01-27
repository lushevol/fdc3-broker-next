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
      primary: '#1a1a1a',
      secondary: darkPrimitiveColors.grey[850],
      tertiary: darkPrimitiveColors.grey[800],
    },
    // Surface
    surface: {
      primary: '#1a1a1a',
      secondary: '#333333',
      elevated: '#262626',
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
        default: '#9ac7f6',
        hover: '#68abf2',
        active: '#368fee',
        visited: '#984afc',
      },
      information: '#368fee',
    },
    // Border
    border: {
      primary: '#368fee',
      secondary: '#737373',
      disabled: darkPrimitiveColors.grey[700],
      focus: '#9ac7f6',
      divider: '#666666',
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
      zeroDefault: '#262626',
      subtleDefault: '#262626',
      solidDefault: '#0473ea',
    },
    surfaceSecondary: {
      subtleDefault: '#666666',
    },
    // Link states
    linkPrimary: {
      default: '#9ac7f6',
    },
    linkSecondary: {
      default: '#9ac7f6',
      selected: '#e5f1fc',
    },
    // Text states
    textPrimary: {
      subtleSelected: '#0250a3',
    },
    textSecondary: {
      subtleDefault: '#b3d5f8',
    },
    // Tab/Status
    tab: {
      horizPad: 16,
      vertPad: 16,
      surfaceSelectedLayered: '#ffffff',
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
    information: '#368fee',
    // Brand colors
    brand: {
      green: '#38d200',
      blue: '#0473ea',
      prosperBlue: '#020b43',
      prosperBlueInverse: '#020b43',
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
    borderHover: '#ffffff00',
  },
};

export default darkTheme;
