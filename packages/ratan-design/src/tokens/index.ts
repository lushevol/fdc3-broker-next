/**
 * GDS Design Tokens - Index
 * Generated from Figma Global Design System (GDS)
 *
 * =============================================================================
 * DESIGN TOKEN STRUCTURE
 * =============================================================================
 *
 * This package exports design tokens organized into the following categories:
 *
 * - **Colors**: Primitive and semantic color tokens for light/dark themes
 * - **Typography**: Font families, sizes, weights, and text styles
 * - **Sizes**: Component sizes, spacing, and border radius values
 * - **Shadows**: Elevation and shadow tokens
 * - **Grid**: Responsive breakpoint and column grid system
 * - **Patterns**: UX writing principles and standard patterns
 *
 * Each token file includes comprehensive documentation with:
 * - Usage guidelines
 * - Best practices from the design system authors
 * - Do's and don'ts with examples
 *
 * =============================================================================
 * USAGE EXAMPLE
 * =============================================================================
 *
 * ```typescript
 * import {
 *   primitiveColors,
 *   typographyStyles,
 *   gridConfig,
 *   writingBestPractices
 * } from '@ratan-design/tokens';
 *
 * // Use color tokens
 * const primaryColor = primitiveColors.blue[500];
 *
 * // Use typography styles
 * const headingStyle = typographyStyles.header2;
 *
 * // Use grid configuration
 * const desktopGrid = gridConfig.desktopNarrow;
 * ```
 */

// =============================================================================
// COLORS
// =============================================================================

// Primitive and foundation colors
export * from './colors';

// Dark theme colors
export {
  darkPrimitiveColors,
  default as darkPrimitiveColorsDefault,
} from './colorsDark';

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export * from './typography';

// =============================================================================
// SIZES & SPACING
// =============================================================================

export * from './sizes';

// =============================================================================
// SHADOWS & ELEVATION
// =============================================================================

export * from './shadows';

// =============================================================================
// GRID SYSTEM
// =============================================================================

export * from './grid';

// =============================================================================
// UX PATTERNS & WRITING GUIDELINES
// =============================================================================

export * from './patterns';

// =============================================================================
// CSS VARIABLES GENERATOR
// =============================================================================

export * from './cssVariables';

// =============================================================================
// THEMES
// =============================================================================

export { lightTheme, default as lightThemeDefault } from './themes/light';
export { darkTheme } from './themes/dark';
export type { Theme } from './themes/types';
