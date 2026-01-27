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
      primary: '#ffffff',
      secondary: primitiveColors.grey[50],
      tertiary: primitiveColors.grey[100],
    },
    // Surface
    surface: {
      primary: '#ffffff',
      secondary: '#666666',
      elevated: '#ffffff',
    },
    // Text
    text: {
      primary: '#262626',
      secondary: '#0d0d0d',
      tertiary: primitiveColors.grey[600],
      disabled: primitiveColors.grey[400],
      placeholder: '#999999',
      helper: '#595959',
      eyebrowHint: '#808080',
      link: {
        default: '#9ac7f6',
        hover: '#4f9df0',
        active: '#035cbb',
        visited: primitiveColors.purple[500],
      },
      information: '#035cbb',
    },
    // Border
    border: {
      primary: '#0473ea',
      secondary: '#737373',
      disabled: primitiveColors.grey[200],
      focus: '#0473ea',
      divider: '#cccccc',
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
    success: primitiveColors.green[500],
    warning: primitiveColors.amber[500],
    error: primitiveColors.red[500],
    information: '#035cbb',
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

export default lightTheme;
