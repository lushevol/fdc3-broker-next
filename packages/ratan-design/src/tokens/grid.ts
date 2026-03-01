/**
 * GDS Design Tokens - Grid System
 * Generated from Figma Global Design System (GDS)
 *
 * =============================================================================
 * GRID SYSTEM PRINCIPLES
 * =============================================================================
 *
 * The GDS grid system is built on a responsive 12-column layout that adapts
 * across three main breakpoints: Mobile, Tablet, and Desktop.
 *
 * ## Core Principles
 *
 * 1. **Consistent Gutters**: All breakpoints use a 24px gutter between columns
 *    for visual consistency and alignment.
 *
 * 2. **Fluid Columns**: Column widths adjust proportionally within each
 *    breakpoint while maintaining the gutter width.
 *
 * 3. **Progressive Enhancement**: The grid scales from 2 columns (mobile)
 *    to 12 columns (desktop), adding complexity as screen space increases.
 *
 * 4. **Content-First Approach**: Margins and column widths are calculated
 *    to optimize content readability at each breakpoint.
 *
 * =============================================================================
 * RESPONSIVE BREAKPOINTS
 * =============================================================================
 *
 * ### Mobile (375px)
 * - Columns: 2
 * - Margin: 24px (each side)
 * - Column Width: ~151.5px
 * - Gutter: 24px
 *
 * ### Tablet (768px)
 * - Columns: 4
 * - Margin: 80px (each side)
 * - Column Width: ~134px
 * - Gutter: 24px
 *
 * ### Desktop (1440px) - Narrow Margin
 * - Columns: 12
 * - Margin: 160px (each side)
 * - Column Width: ~71.33px
 * - Gutter: 24px
 *
 * ### Desktop (1440px) - Wide Margin
 * - Columns: 12
 * - Margin: 40px (each side)
 * - Column Width: ~91.33px
 * - Gutter: 24px
 *
 * =============================================================================
 * USAGE GUIDELINES
 * =============================================================================
 *
 * 1. Use the narrow margin variant (160px) for content-heavy pages that
 *    benefit from a centered, focused reading experience.
 *
 * 2. Use the wide margin variant (40px) for dashboards, data tables, and
 *    applications requiring maximum horizontal space.
 *
 * 3. Always maintain the 24px gutter between columns for visual consistency.
 *
 * 4. For nested grids, consider reducing the gutter proportionally.
 */

// =============================================================================
// BREAKPOINT DEFINITIONS
// =============================================================================

export const breakpoints = {
  /**
   * Mobile breakpoint: 375px
   * Target devices: iPhone SE, small Android phones
   */
  mobile: 375,

  /**
   * Tablet breakpoint: 768px
   * Target devices: iPad Mini, iPad, small tablets
   */
  tablet: 768,

  /**
   * Desktop breakpoint: 1440px
   * Target devices: Laptops, desktops, large tablets in landscape
   */
  desktop: 1440,
} as const;

// =============================================================================
// GRID CONFIGURATION BY BREAKPOINT
// =============================================================================

export const gridConfig = {
  /**
   * Mobile Grid Configuration (375px)
   * - 2-column layout for simple mobile interfaces
   * - 24px margins provide comfortable touch targets
   * - Ideal for single-column content with sidebar elements
   */
  mobile: {
    containerWidth: 375,
    columns: 2,
    margin: 24, // Margin on each side
    gutter: 24, // Space between columns
    columnWidth: 151.5, // Calculated column width
    totalContentWidth: 327, // 375 - (24 * 2)
  },

  /**
   * Tablet Grid Configuration (768px)
   * - 4-column layout for tablet interfaces
   * - 80px margins provide generous whitespace
   * - Supports side-by-side content layouts
   */
  tablet: {
    containerWidth: 768,
    columns: 4,
    margin: 80, // Margin on each side
    gutter: 24, // Space between columns
    columnWidth: 134, // Calculated column width
    totalContentWidth: 608, // 768 - (80 * 2)
  },

  /**
   * Desktop Grid Configuration (1440px) - Narrow Margin
   * - 12-column layout for complex desktop interfaces
   * - 160px margins provide focused, centered content
   * - Best for editorial content, forms, and detail pages
   */
  desktopNarrow: {
    containerWidth: 1440,
    columns: 12,
    margin: 160, // Margin on each side
    gutter: 24, // Space between columns
    columnWidth: 71.33, // Calculated column width (~71.33px)
    totalContentWidth: 1120, // 1440 - (160 * 2)
  },

  /**
   * Desktop Grid Configuration (1440px) - Wide Margin
   * - 12-column layout for complex desktop interfaces
   * - 40px margins maximize available content width
   * - Best for dashboards, data tables, and applications
   */
  desktopWide: {
    containerWidth: 1440,
    columns: 12,
    margin: 40, // Margin on each side
    gutter: 24, // Space between columns
    columnWidth: 91.33, // Calculated column width (~91.33px)
    totalContentWidth: 1360, // 1440 - (40 * 2)
  },
} as const;

// =============================================================================
// GUTTER VALUES (Consistent across all breakpoints)
// =============================================================================

export const gridGutters = {
  /**
   * Standard gutter: 24px
   * Used between all columns in the grid system
   */
  default: 24,

  /**
   * Half gutter: 12px
   * For nested grids or tighter spacing requirements
   */
  half: 12,

  /**
   * Quarter gutter: 6px
   * For compact nested elements
   */
  quarter: 6,

  /**
   * Double gutter: 48px
   * For major section separations
   */
  double: 48,
} as const;

// =============================================================================
// COLUMN SPAN UTILITIES
// =============================================================================

/**
 * Calculate column width for a given number of columns spanned
 * Includes the gutters between the spanned columns
 */
export const calculateColumnSpan = (
  columns: number,
  breakpoint: keyof typeof gridConfig = 'desktopNarrow'
): number => {
  const config = gridConfig[breakpoint];
  const gutterCount = columns - 1;
  return columns * config.columnWidth + gutterCount * config.gutter;
};

/**
 * Pre-calculated column spans for desktop (12-column grid)
 * Useful for common layout patterns
 */
export const columnSpans = {
  desktop: {
    '1-col': 71.33,
    '2-col': 166.66, // 2 columns + 1 gutter
    '3-col': 262, // 3 columns + 2 gutters (quarter width)
    '4-col': 357.33, // 4 columns + 3 gutters (third width)
    '6-col': 548, // 6 columns + 5 gutters (half width)
    '8-col': 738.66, // 8 columns + 7 gutters (two-thirds width)
    '9-col': 834, // 9 columns + 8 gutters (three-quarters width)
    '12-col': 1120, // Full width (narrow margin)
  },
  tablet: {
    '1-col': 134,
    '2-col': 292, // 2 columns + 1 gutter (half width)
    '3-col': 450, // 3 columns + 2 gutters (three-quarters width)
    '4-col': 608, // Full width
  },
  mobile: {
    '1-col': 151.5,
    '2-col': 327, // Full width
  },
} as const;

// =============================================================================
// CONTAINER MAX-WIDTHS
// =============================================================================

export const containerMaxWidths = {
  /**
   * Mobile container max-width
   * Use for mobile-first responsive designs
   */
  mobile: '375px',

  /**
   * Tablet container max-width
   */
  tablet: '768px',

  /**
   * Desktop container max-width (standard)
   */
  desktop: '1440px',

  /**
   * Full-width container (no max-width)
   */
  full: '100%',
} as const;

// =============================================================================
// RESPONSIVE MEDIA QUERIES (CSS-in-JS format)
// =============================================================================

export const mediaQueries = {
  mobile: `@media (min-width: ${breakpoints.mobile}px)`,
  tablet: `@media (min-width: ${breakpoints.tablet}px)`,
  desktop: `@media (min-width: ${breakpoints.desktop}px)`,
} as const;

// =============================================================================
// CSS CUSTOM PROPERTIES
// =============================================================================

/**
 * Grid CSS variable names following GDS naming convention
 * These map to CSS custom properties for use in stylesheets
 */
export const gridCssVars = {
  // Breakpoints
  '--sc-grid-breakpoint-mobile': `${breakpoints.mobile}px`,
  '--sc-grid-breakpoint-tablet': `${breakpoints.tablet}px`,
  '--sc-grid-breakpoint-desktop': `${breakpoints.desktop}px`,

  // Gutters
  '--sc-grid-gutter': `${gridGutters.default}px`,
  '--sc-grid-gutter-half': `${gridGutters.half}px`,
  '--sc-grid-gutter-quarter': `${gridGutters.quarter}px`,
  '--sc-grid-gutter-double': `${gridGutters.double}px`,

  // Mobile
  '--sc-grid-mobile-columns': `${gridConfig.mobile.columns}`,
  '--sc-grid-mobile-margin': `${gridConfig.mobile.margin}px`,

  // Tablet
  '--sc-grid-tablet-columns': `${gridConfig.tablet.columns}`,
  '--sc-grid-tablet-margin': `${gridConfig.tablet.margin}px`,

  // Desktop (narrow margin)
  '--sc-grid-desktop-columns': `${gridConfig.desktopNarrow.columns}`,
  '--sc-grid-desktop-margin-narrow': `${gridConfig.desktopNarrow.margin}px`,

  // Desktop (wide margin)
  '--sc-grid-desktop-margin-wide': `${gridConfig.desktopWide.margin}px`,
} as const;

// =============================================================================
// AGGREGATED EXPORTS
// =============================================================================

export const gridTokens = {
  breakpoints,
  gridConfig,
  gridGutters,
  columnSpans,
  containerMaxWidths,
  mediaQueries,
} as const;

export default gridTokens;