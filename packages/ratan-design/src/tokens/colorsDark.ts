/**
 * GDS Design Tokens - Dark Theme Colors
 * Generated from Figma Design System
 *
 * @description
 * This file contains primitive color tokens for dark mode.
 * Values are inverted from light mode for proper contrast in dark themes.
 *
 * Usage:
 * - Use in conjunction with light theme colors for theme switching
 * - 100-300: Dark backgrounds for elevated surfaces
 * - 400-500: Borders, dividers, secondary elements
 * - 600-900: Primary text and emphasis
 * - 950: Almost white for inverted text on dark backgrounds
 */

/**
 * Neutral grey scale (inverted for dark mode)
 * - white: Pure black for maximum contrast
 * - 25-100: Very dark greys for elevated surfaces
 * - 200-400: Dark greys for borders, dividers
 * - 500-700: Medium greys for secondary text
 * - 800-900: Light greys for primary text
 * - 950-975: Almost white for inverted elements
 * - black: Pure white for special cases
 */
export const darkPrimitiveColors = {
  grey: {
    white: '#000000',
    25: '#070707',
    50: '#0d0d0d',
    100: '#1a1a1a',
    150: '#262626',
    200: '#333333',
    250: '#404040',
    300: '#4d4d4d',
    350: '#595959',
    400: '#666666',
    450: '#737373',
    500: '#808080',
    550: '#8c8c8c',
    600: '#999999',
    650: '#a6a6a6',
    700: '#b2b2b2',
    750: '#bfbfbf',
    800: '#cccccc',
    850: '#d9d9d9',
    900: '#e5e5e5',
    950: '#f2f2f2',
    975: '#f9f9f9',
    black: '#ffffff',
  },
  /**
   * Primary brand blue scale for dark mode (inverted)
   * - 50-200: Very dark blues for elevated backgrounds
   * - 300-500: Dark blues for interactive elements
   * - 600-800: Medium blues for hover/active states
   * - 850-950: Light blues for text and emphasis
   */
  blue: {
    50: '#000b17',
    100: '#00172e',
    150: '#012246',
    200: '#012e5d',
    250: '#023975',
    300: '#02458c',
    350: '#0250a3',
    400: '#035cbb',
    450: '#0367d2',
    500: '#0473ea',
    550: '#1d81ec',
    600: '#368fee',
    650: '#4f9df0',
    700: '#68abf2',
    750: '#81b9f4',
    800: '#9ac7f6',
    850: '#b3d5f8',
    900: '#cce3fa',
    950: '#e5f1fc',
  },
  green: {
    50: '#021500',
    100: '#082a00',
    150: '#0e3f00',
    200: '#145400',
    250: '#1a6900',
    300: '#207e00',
    350: '#269300',
    400: '#2ca800',
    450: '#32bd00',
    500: '#38d200',
    550: '#4bdb1e',
    600: '#5fdf37',
    650: '#73e350',
    700: '#87e769',
    750: '#9beb82',
    800: '#afef9b',
    850: '#c3f3b4',
    900: '#d7f7cd',
    950: '#ebfbe6',
  },
  /**
   * Warning amber scale for dark mode (inverted)
   */
  amber: {
    50: '#191102',
    100: '#322304',
    150: '#4b3406',
    200: '#644508',
    250: '#7d570a',
    300: '#96680c',
    350: '#af790e',
    400: '#c88a10',
    450: '#e19c12',
    500: '#faad14',
    550: '#fab52c',
    600: '#fbbd43',
    650: '#fcc65b',
    700: '#fcce72',
    750: '#fdd689',
    800: '#fddea1',
    850: '#fde6b8',
    900: '#feefd0',
    950: '#fef6e7',
  },
  /**
   * Error red scale for dark mode (inverted)
   */
  red: {
    50: '#160102',
    100: '#2d0204',
    150: '#430306',
    200: '#5a0408',
    250: '#70050b',
    300: '#86060d',
    350: '#9d070f',
    400: '#b30811',
    450: '#ca0913',
    500: '#e00a15',
    550: '#e3232c',
    600: '#e63b44',
    650: '#e9545b',
    700: '#ec6c73',
    750: '#ef848a',
    800: '#f39da1',
    850: '#f6b5b8',
    900: '#f9ced0',
    950: '#fce6e7',
  },
  magenta: {
    50: '#18020c',
    100: '#300319',
    150: '#470525',
    200: '#5f0731',
    250: '#77093e',
    300: '#8f0a4a',
    350: '#a70c56',
    400: '#be0e62',
    450: '#d60f6f',
    500: '#ee117b',
    550: '#f02988',
    600: '#f14195',
    650: '#f358a3',
    700: '#f570b0',
    750: '#f788bd',
    800: '#f8a0ca',
    850: '#fab8d7',
    900: '#fccfe5',
    950: '#fde7f2',
  },
  /**
   * Olive scale for dark mode (inverted)
   */
  olive: {
    50: '#121305',
    100: '#24270b',
    150: '#363b10',
    200: '#484f16',
    250: '#5a631c',
    300: '#6c7721',
    350: '#7e8b27',
    400: '#909f2c',
    450: '#a2b332',
    500: '#b5c738',
    550: '#bccc4b',
    600: '#c3d25f',
    650: '#cbd773',
    700: '#d2dd87',
    750: '#dae39b',
    800: '#e1e8af',
    850: '#e8eec3',
    900: '#f0f3d7',
    950: '#f7f9eb',
  },
  /**
   * Violet scale for dark mode (inverted)
   */
  violet: {
    50: '#070713',
    100: '#0e0e26',
    150: '#161639',
    200: '#1d1d4c',
    250: '#24245f',
    300: '#2b2b71',
    350: '#323284',
    400: '#3a3a97',
    450: '#4141aa',
    500: '#4848bd',
    550: '#5a5ac4',
    600: '#6d6dca',
    650: '#7f7fd1',
    700: '#9191d7',
    750: '#a3a3de',
    800: '#b6b6e5',
    850: '#c8c8eb',
    900: '#dadaf2',
    950: '#ededf8',
  },
  /**
   * Orange scale for dark mode (inverted)
   */
  orange: {
    50: '#190a03',
    100: '#321405',
    200: '#64290a',
    250: '#7d330d',
    300: '#6b2f10',
    350: '#974216',
    400: '#b9511b',
    450: '#d65e1f',
    500: '#ef6923',
    550: '#f47b3d',
    600: '#f98c55',
    650: '#fd9d6c',
    700: '#ffad84',
    750: '#ffbe9c',
    800: '#ffceb4',
    850: '#ffdecd',
    900: '#ffefe6',
    950: '#fff0e8',
  },
  /**
   * Maroon scale for dark mode (inverted)
   */
  maroon: {
    50: '#110309',
    100: '#230712',
    150: '#340a1b',
    200: '#450e24',
    250: '#57112d',
    300: '#681436',
    350: '#79183f',
    400: '#8a1b48',
    450: '#9c1f51',
    500: '#ad225a',
    550: '#b5386b',
    600: '#bd4e7b',
    650: '#c6648b',
    700: '#ce7a9c',
    750: '#d690ac',
    800: '#dea7bd',
    850: '#e6bdcd',
    900: '#efd3de',
    950: '#f7e9ee',
  },
  /**
   * Teal scale for dark mode (inverted)
   */
  teal: {
    50: '#031517',
    100: '#052a2e',
    150: '#083f45',
    200: '#0a545c',
    250: '#0d6a73',
    300: '#107f89',
    350: '#1294a0',
    400: '#15a9b7',
    450: '#17bdce',
    500: '#1ad3e5',
    550: '#31d7e8',
    600: '#48dcea',
    650: '#5fe0ed',
    700: '#75e4ef',
    750: '#8ce9f2',
    800: '#a3edf5',
    850: '#baf2f7',
    900: '#d1f6fa',
    950: '#e8fafc',
  },
  /**
   * Purple scale for dark mode (inverted)
   */
  purple: {
    50: '#0d0319',
    100: '#190632',
    150: '#26094b',
    200: '#320c64',
    250: '#3f0f7e',
    300: '#4c1197',
    350: '#5814b0',
    400: '#6517c9',
    450: '#711ae2',
    500: '#7e1dfb',
    550: '#8b34fb',
    600: '#984afc',
    650: '#a561fc',
    700: '#b277fd',
    750: '#be8efd',
    800: '#cba5fd',
    850: '#d8bbfe',
    900: '#e5d2fe',
    950: '#f2e8ff',
  },
};

export default darkPrimitiveColors;
