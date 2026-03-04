/**
 * GDS Design Tokens - Colors
 * Generated from Figma Design System
 *
 * @description
 * This file contains primitive color tokens organized by color family.
 * Each color scale provides a range of shades from light (50) to dark (950).
 *
 * - Shades 50-450: Light to medium tones (backgrounds, subtle elements)
 * - Shade 500: Base/primary color tone
 * - Shades 550-950: Medium to dark tones (text, emphasis, backgrounds)
 *
 * Usage:
 * - 100-300: Hover states, subtle backgrounds
 * - 400-500: Active states, focus indicators
 * - 600-900: Text, emphasis, strong backgrounds
 */

/**
 * Neutral grey scale for backgrounds, text, and UI elements
 * - white/black: Pure values for special cases
 * - 25-100: Very light greys for page backgrounds
 * - 200-400: Light greys for borders, dividers
 * - 500: Medium grey for secondary text
 * - 600-800: Dark greys for primary text
 * - 850-975: Very dark greys for elevated surfaces
 */
export const primitiveColors = {
  grey: {
    white: '#ffffff',
    25: '#f9f9f9',
    50: '#f2f2f2',
    75: '#ececec',
    100: '#e5e5e5',
    125: '#dfdfdf',
    150: '#d9d9d9',
    175: '#d2d2d2',
    200: '#cccccc',
    250: '#bfbfbf',
    300: '#b2b2b2',
    350: '#a6a6a6',
    400: '#999999',
    450: '#8c8c8c',
    500: '#808080',
    550: '#737373',
    600: '#666666',
    650: '#595959',
    700: '#4d4d4d',
    750: '#404040',
    775: '#3a3a3a',
    800: '#333333',
    825: '#2d2d2d',
    850: '#262626',
    875: '#202020',
    900: '#1a1a1a',
    925: '#141414',
    950: '#0d0d0d',
    975: '#070707',
    black: '#000000',
  },
  /**
   * Primary brand blue scale for interactive elements and focus states
   * - 50-200: Light blues for hover/active backgrounds
   * - 300-500: Core blues for primary actions, links, focus
   * - 600-900: Dark blues for selected states, emphasis
   * - 950: Very dark blue for elevated dark backgrounds
   */
  blue: {
    50: '#e5f1fc',
    100: '#cce3fa',
    150: '#b3d5f8',
    200: '#9ac7f6',
    250: '#81b9f4',
    300: '#68abf2',
    350: '#4f9df0',
    400: '#368fee',
    450: '#1d81ec',
    500: '#0473ea',
    550: '#0367d2',
    600: '#035cbb',
    650: '#0250a3',
    700: '#02458c',
    750: '#023975',
    800: '#012e5d',
    850: '#012246',
    900: '#00172e',
    950: '#000b17',
  },
  /**
   * Prosper Blue - Brand color for page headers
   */
  prosperBlue: '#020b43',
  /**
   * Success green scale for positive states and confirmations
   * - 50-200: Light greens for success backgrounds
   * - 300-500: Core greens for success indicators
   * - 600-900: Dark greens for emphasis on light backgrounds
   */
  green: {
    50: '#ebfbe6',
    100: '#d7f7cd',
    150: '#c3f3b4',
    200: '#afef9b',
    250: '#9beb82',
    300: '#87e769',
    350: '#73e350',
    400: '#5fdf37',
    450: '#4bdb1e',
    500: '#38d200',
    550: '#32bd00',
    600: '#2ca800',
    650: '#269300',
    700: '#207e00',
    750: '#1a6900',
    800: '#145400',
    850: '#0e3f00',
    900: '#082a00',
    950: '#021500',
  },
  /**
   * Warning amber/yellow scale for caution and warning states
   * - 50-200: Light ambers for warning backgrounds
   * - 300-500: Core ambers for warning indicators
   * - 600-900: Dark ambers for emphasis
   */
  amber: {
    50: '#fef6e7',
    100: '#feefd0',
    150: '#fde6b8',
    200: '#fddea1',
    250: '#fdd689',
    300: '#fcce72',
    350: '#fcc65b',
    400: '#fbbd43',
    450: '#fab52c',
    500: '#faad14',
    550: '#e19c12',
    600: '#c88a10',
    650: '#af790e',
    700: '#96680c',
    750: '#7d570a',
    800: '#644508',
    850: '#4b3406',
    900: '#322304',
    950: '#191102',
  },
  /**
   * Error red scale for danger, errors, and destructive actions
   * - 50-200: Light reds for error backgrounds
   * - 300-500: Core reds for error indicators
   * - 600-900: Dark reds for emphasis
   */
  red: {
    50: '#fce6e7',
    100: '#f9ced0',
    150: '#f6b5b8',
    200: '#f39da1',
    250: '#ef848a',
    300: '#ec6c73',
    350: '#e9545b',
    400: '#e63b44',
    450: '#e3232c',
    500: '#e00a15',
    550: '#ca0913',
    600: '#b30811',
    650: '#9d070f',
    700: '#86060d',
    750: '#70050b',
    800: '#5a0408',
    850: '#430306',
    900: '#2d0204',
    950: '#160102',
  },
  /**
   * Magenta scale for special accents and tags
   * - 50-200: Light magentas for subtle accents
   * - 300-500: Core magentas for emphasis
   * - 600-900: Dark magentas for strong accents
   */
  magenta: {
    50: '#fde7f2',
    100: '#fccfe5',
    150: '#fab8d7',
    200: '#f8a0ca',
    250: '#f788bd',
    300: '#f570b0',
    350: '#f358a3',
    400: '#f14195',
    450: '#f02988',
    500: '#ee117b',
    550: '#d60f6f',
    600: '#be0e62',
    650: '#a70c56',
    700: '#8f0a4a',
    750: '#77093e',
    800: '#5f0731',
    850: '#470525',
    900: '#300319',
    950: '#18020c',
  },
  /**
   * Olive/green-yellow scale for special accents
   * - 50-200: Light olives for subtle backgrounds
   * - 300-500: Core olives for emphasis
   * - 600-900: Dark olives for strong accents
   */
  olive: {
    50: '#f7f9eb',
    100: '#f0f3d7',
    150: '#e8eec3',
    200: '#e1e8af',
    250: '#dae39b',
    300: '#d2dd87',
    350: '#cbd773',
    400: '#c3d25f',
    450: '#bccc4b',
    500: '#b5c738',
    550: '#a2b332',
    600: '#909f2c',
    650: '#7e8b27',
    700: '#6c7721',
    750: '#5a631c',
    800: '#484f16',
    850: '#363b10',
    900: '#24270b',
    950: '#121305',
  },
  /**
   * Violet/purple scale for special accents and tags
   * - 50-200: Light violets for subtle backgrounds
   * - 300-500: Core violets for emphasis
   * - 600-900: Dark violets for strong accents
   */
  violet: {
    50: '#ededf8',
    100: '#dadaf2',
    150: '#c8c8e8',
    200: '#b6b6e5',
    250: '#a3a3de',
    300: '#9191d7',
    350: '#7f7fd1',
    400: '#6d6dca',
    450: '#5a5ac4',
    500: '#4848bd',
    550: '#4141aa',
    600: '#3a4a97',
    650: '#323284',
    700: '#2b2b71',
    750: '#24245f',
    800: '#1d1d4c',
    850: '#161639',
    900: '#0e0e26',
    950: '#070713',
  },
  /**
   * Orange scale for warnings, highlights, and CTAs
   * - 50-200: Light oranges for subtle highlights
   * - 300-500: Core oranges for warnings/highlights
   * - 600-900: Dark oranges for emphasis
   */
  orange: {
    50: '#fff0e8',
    100: '#ffefe6',
    150: '#ffdecd',
    200: '#ffceb4',
    250: '#ffbe9c',
    300: '#ffad84',
    350: '#fd9d6c',
    400: '#f98c55',
    450: '#f47b3d',
    500: '#ef6923',
    550: '#d65e1f',
    600: '#b9511b',
    650: '#974216',
    700: '#6b2f10',
    750: '#7d330d',
    800: '#64290a',
    850: '#4b1f08',
    900: '#321405',
    950: '#190a03',
  },
  /**
   * Maroon scale for special accents and emphasis
   * - 50-200: Light maroons for subtle backgrounds
   * - 300-500: Core maroons for emphasis
   * - 600-900: Dark maroons for strong accents
   */
  maroon: {
    50: '#f7e9ee',
    100: '#efd3de',
    150: '#e68dcd',
    200: '#dea7bd',
    250: '#d690ac',
    300: '#ce7a9c',
    350: '#c6648b',
    400: '#bd4e7b',
    450: '#b5386b',
    500: '#ad225a',
    550: '#9c1f51',
    600: '#8a1b48',
    650: '#79183f',
    700: '#681436',
    750: '#57112d',
    800: '#450e24',
    850: '#340a1b',
    900: '#230712',
    950: '#110309',
  },
  /**
   * Teal/cyan scale for informational states and accents
   * - 50-200: Light teals for subtle backgrounds
   * - 300-500: Core teals for informational states
   * - 600-900: Dark teals for emphasis
   */
  teal: {
    50: '#e8fafc',
    100: '#d1f6fa',
    150: '#baf2f7',
    200: '#a3edf5',
    250: '#8ce9f2',
    300: '#75e4ef',
    350: '#5fe0ed',
    400: '#48dcea',
    450: '#31d7e8',
    500: '#1ad3e5',
    550: '#17bdce',
    600: '#15a9b7',
    650: '#1294a0',
    700: '#107f89',
    750: '#0d6a73',
    800: '#0a545c',
    850: '#083f45',
    900: '#052a2e',
    950: '#031517',
  },
  /**
   * Purple scale for special accents and branded elements
   * - 50-200: Light purples for subtle backgrounds
   * - 300-500: Core purples for emphasis
   * - 600-900: Dark purples for strong accents
   */
  purple: {
    50: '#f2e8ff',
    100: '#e5d2fe',
    150: '#d8bbfe',
    200: '#cba5fd',
    250: '#be8efd',
    300: '#b277fd',
    350: '#a561fc',
    400: '#984afc',
    450: '#8b34fb',
    500: '#7e1dfb',
    550: '#711ae2',
    600: '#6517c9',
    650: '#5814b0',
    700: '#4c1197',
    750: '#3f0f7e',
    800: '#320c64',
    850: '#26094b',
    900: '#190632',
    950: '#0d0319',
  },
};

/**
 * Foundation colors - Semantic tokens for common UI patterns
 * These tokens use CSS variable references for proper theme switching
 * Values are expressed as CSS var() references to primitive colors
 *
 * Note: Variable names follow official format:
 * --sc-color-foundation-{category}-{name}
 */
export const foundationBasicColors = {
  backgroundBase: 'var(--sc-color-white)',
  containerLayer: 'var(--sc-color-white)',
  containerLayerInverse: 'var(--sc-color-grey-850)',
  dividerBase: 'var(--sc-color-grey-200)',
  dividerBaseInverse: 'var(--sc-color-grey-600)',
  brandGrey: 'var(--sc-color-grey-650)',
  brandBlue: 'var(--sc-color-blue-500)',
  brandGreen: 'var(--sc-color-green-500)',
  brandProsperBlue: 'var(--sc-color-prosper-blue)',
  brandProsperBlueInverse: 'var(--sc-color-white)',
};

export const foundationContentColors = {
  header: 'var(--sc-color-grey-950)',
  title: 'var(--sc-color-grey-850)',
  body: 'var(--sc-color-grey-700)',
  labelText: 'var(--sc-color-grey-700)',
  inputText: 'var(--sc-color-grey-800)',
  placeholderText: 'var(--sc-color-grey-600)',
  eyebrowHintText: 'var(--sc-color-grey-500)',
  disabledText: 'var(--sc-color-grey-500)',
  helperText: 'var(--sc-color-grey-650)',
  informationText: 'var(--sc-color-blue-600)',
  errorText: 'var(--sc-color-red-550)',
  warningText: 'var(--sc-color-amber-750)',
  successText: 'var(--sc-color-green-700)',
  // Inverse variants for dark surfaces
  headerInverse: 'var(--sc-color-white)',
  titleInverse: 'var(--sc-color-grey-25)',
  bodyInverse: 'var(--sc-color-grey-50)',
  labelTextInverse: 'var(--sc-color-grey-100)',
  inputTextInverse: 'var(--sc-color-grey-200)',
  placeholderTextInverse: 'var(--sc-color-grey-400)',
  eyebrowHintTextInverse: 'var(--sc-color-grey-400)',
  disabledTextInverse: 'var(--sc-color-grey-400)',
  helperTextInverse: 'var(--sc-color-grey-150)',
  informationTextInverse: 'var(--sc-color-blue-400)',
  errorTextInverse: 'var(--sc-color-red-300)',
  warningTextInverse: 'var(--sc-color-amber-450)',
  successTextInverse: 'var(--sc-color-green-500)',
};

/**
 * Semantic foreground link colors
 * Following official naming: --sc-color-semantic-fg-link-{variant}-{state}
 */
export const semanticFgLinkColors = {
  primary: {
    rest: 'var(--sc-color-blue-500)',
    hover: 'var(--sc-color-blue-350)',
    pressed: 'var(--sc-color-blue-600)',
    selected: 'var(--sc-color-blue-650)',
    disabled: 'var(--sc-color-grey-400)',
    restSubtle: 'var(--sc-color-blue-150)',
    hoverSubtle: 'var(--sc-color-blue-200)',
    pressedSubtle: 'var(--sc-color-blue-250)',
    selectedSubtle: 'var(--sc-color-white)',
    disabledSubtle: 'var(--sc-color-grey-500)',
  },
  secondary: {
    rest: 'var(--sc-color-blue-850)',
    hover: 'var(--sc-color-blue-550)',
    pressed: 'var(--sc-color-blue-600)',
    selected: 'var(--sc-color-blue-650)',
    disabled: 'var(--sc-color-grey-400)',
  },
  destructive: {
    rest: 'var(--sc-color-red-550)',
    hover: 'var(--sc-color-red-400)',
    pressed: 'var(--sc-color-red-650)',
    selected: 'var(--sc-color-red-700)',
    disabled: 'var(--sc-color-grey-400)',
    restSubtle: 'var(--sc-color-red-150)',
    hoverSubtle: 'var(--sc-color-red-200)',
    pressedSubtle: 'var(--sc-color-red-250)',
    selectedSubtle: 'var(--sc-color-red-50)',
    disabledSubtle: 'var(--sc-color-grey-500)',
  },
  warning: {
    rest: 'var(--sc-color-amber-700)',
    hover: 'var(--sc-color-amber-550)',
    pressed: 'var(--sc-color-amber-800)',
    selected: 'var(--sc-color-amber-850)',
    disabled: 'var(--sc-color-grey-400)',
    restSubtle: 'var(--sc-color-amber-150)',
    hoverSubtle: 'var(--sc-color-amber-200)',
    pressedSubtle: 'var(--sc-color-amber-250)',
    selectedSubtle: 'var(--sc-color-amber-50)',
    disabledSubtle: 'var(--sc-color-grey-500)',
  },
  success: {
    rest: 'var(--sc-color-green-700)',
    hover: 'var(--sc-color-green-550)',
    pressed: 'var(--sc-color-green-800)',
    selected: 'var(--sc-color-green-850)',
    disabled: 'var(--sc-color-grey-400)',
    restSubtle: 'var(--sc-color-green-150)',
    hoverSubtle: 'var(--sc-color-green-200)',
    pressedSubtle: 'var(--sc-color-green-250)',
    selectedSubtle: 'var(--sc-color-green-50)',
    disabledSubtle: 'var(--sc-color-grey-500)',
  },
};

/**
 * Semantic foreground text colors
 * Following official naming: --sc-color-semantic-fg-text-{variant}-{state}
 */
export const semanticFgTextColors = {
  primary: {
    rest: 'var(--sc-color-white)',
    hover: 'var(--sc-color-white)',
    pressed: 'var(--sc-color-blue-100)',
    selected: 'var(--sc-color-white)',
    disabled: 'var(--sc-color-grey-500)',
    restSubtle: 'var(--sc-color-blue-500)',
    hoverSubtle: 'var(--sc-color-blue-350)',
    pressedSubtle: 'var(--sc-color-blue-300)',
    selectedSubtle: 'var(--sc-color-white)',
    disabledSubtle: 'var(--sc-color-grey-500)',
  },
  secondary: {
    rest: 'var(--sc-color-grey-700)',
    hover: 'var(--sc-color-grey-600)',
    pressed: 'var(--sc-color-grey-800)',
    selected: 'var(--sc-color-grey-650)',
    disabled: 'var(--sc-color-grey-500)',
    restSubtle: 'var(--sc-color-grey-150)',
    hoverSubtle: 'var(--sc-color-grey-200)',
    pressedSubtle: 'var(--sc-color-grey-100)',
    selectedSubtle: 'var(--sc-color-grey-100)',
    disabledSubtle: 'var(--sc-color-grey-400)',
  },
};

/**
 * Foundation colors object for backwards compatibility
 * Organized to generate correct CSS variable names
 */
export const foundationColors = {
  // These will be flattened to: --sc-color-foundation-basic-{name}
  basic: foundationBasicColors,
  // These will be flattened to: --sc-color-foundation-content-{name}
  content: foundationContentColors,
  /**
   * State colors for interactive elements (hover, active, focus, selected, disabled)
   * Defines colors for surfaces, borders, text, links, and focus states
   */
  state: {
    surfacePrimary: {
      zeroDefault: 'var(--sc-color-grey-850)',
      subtleDefault: 'var(--sc-color-grey-850)',
      solidDefault: 'var(--sc-color-blue-500)',
    },
    surfaceSecondary: {
      subtleDefault: 'var(--sc-color-grey-600)',
    },
    borderPrimary: {
      default: 'var(--sc-color-blue-500)',
    },
    borderSecondary: {
      default: 'var(--sc-color-grey-550)',
    },
    textPrimary: {
      subtleSelected: 'var(--sc-color-blue-650)',
    },
    textSecondary: {
      subtleDefault: 'var(--sc-color-blue-150)',
    },
    linkPrimary: {
      default: 'var(--sc-color-blue-200)',
    },
    linkSecondary: {
      default: 'var(--sc-color-blue-200)',
      selected: 'var(--sc-color-blue-50)',
    },
    focus: {
      borderHover: 'var(--sc-color-white)',
    },
  },
  shadow: {
    baseShadow: {
      color: 'rgba(26, 26, 26, 0.3)',
      xPosition: '0',
      yPosition: '1',
      blur: '2',
      spread: '0',
    },
    elevatedShadow: {
      color: 'rgba(26, 26, 26, 0.15)',
    },
  },
  opacity: {
    '20': 'rgba(255, 255, 255, 0.2)',
    '40': 'rgba(255, 255, 255, 0.4)',
    '60': 'rgba(255, 255, 255, 0.6)',
    '80': 'rgba(255, 255, 255, 0.8)',
    '20-layered': 'rgba(26, 26, 26, 0.2)',
    '40-layered': 'rgba(26, 26, 26, 0.4)',
    '60-layered': 'rgba(26, 26, 26, 0.6)',
    '80-layered': 'rgba(26, 26, 26, 0.8)',
  },
};

export const colorTokens = {
  ...primitiveColors,
  ...foundationColors,
};
