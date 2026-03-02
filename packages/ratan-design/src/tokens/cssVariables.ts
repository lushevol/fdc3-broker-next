/**
 * GDS Design Tokens - CSS Variables Generator
 * Converts design tokens to CSS custom properties
 *
 * @description
 * This module provides functions to generate CSS custom properties (variables)
 * from the design token definitions. Supports both light and dark themes.
 *
 * Usage:
 * - generateColorCssVariables(): Generate color CSS variables
 * - generateSizeCssVariables(): Generate size/spacing CSS variables
 * - generateTypographyCssVariables(): Generate typography CSS variables
 * - generateThemeVariables(theme): Generate complete theme CSS variables
 * - generateAllCssVariables(): Generate all CSS variables
 * - generateCssModule(): Generate CSS module content
 */

import { primitiveColors, foundationColors } from './colors';
import { darkPrimitiveColors } from './colorsDark';
import {
  componentSizes,
  componentSpacing,
  componentRound,
  iconSizes,
} from './sizes';
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  typographyStyles,
} from './typography';
import { shadowStyles } from './shadows';
import {
  breakpoints,
  gridConfig,
  gridGutters,
  containerMaxWidths,
} from './grid';
import { lightTheme } from './themes/light';
import { darkTheme } from './themes/dark';

/**
 * Convert a camelCase or kebab-case name to kebab-case
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Flatten a nested object into dotted keys
 */
function flattenObject(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'string') {
      result[newKey] = value;
    } else if (typeof value === 'number') {
      result[newKey] = String(value);
    } else if (value !== null && typeof value === 'object') {
      Object.assign(
        result,
        flattenObject(value as Record<string, unknown>, newKey),
      );
    }
  }

  return result;
}

/**
 * Convert color tokens to CSS custom properties
 *
 * @param prefix - Variable prefix (default: 'gds')
 * @param includeDark - Whether to include dark mode colors
 * @param themeSelector - CSS selector for theme (default: ':root')
 */
export function generateColorCssVariables(
  prefix = 'gds',
  includeDark = true,
  themeSelector = ':root',
): string {
  const lines: string[] = [];
  lines.push(`${themeSelector} {`);

  // Primitive colors - light mode
  for (const [colorName, shades] of Object.entries(primitiveColors)) {
    if (typeof shades === 'object' && shades !== null) {
      for (const [shade, value] of Object.entries(
        shades as Record<string, string>,
      )) {
        const varName = `--${prefix}-color-${colorName}-${shade}`;
        lines.push(`  ${varName}: ${value};`);
      }
    }
  }

  // Dark mode primitive colors
  if (includeDark) {
    lines.push('');
    lines.push(`  /* Dark mode primitive colors */`);
    for (const [colorName, shades] of Object.entries(darkPrimitiveColors)) {
      if (typeof shades === 'object' && shades !== null) {
        for (const [shade, value] of Object.entries(
          shades as Record<string, string>,
        )) {
          const varName = `--${prefix}-color-${colorName}-${shade}-dark`;
          lines.push(`  ${varName}: ${value};`);
        }
      }
    }
  }

  // Foundation colors
  lines.push('');
  lines.push(`  /* Foundation colors */`);
  for (const [category, values] of Object.entries(foundationColors)) {
    if (typeof values === 'object' && values !== null) {
      const flattened = flattenObject(values);
      for (const [key, value] of Object.entries(flattened)) {
        const varName = `--${prefix}-${category}-${toKebabCase(key)}`;
        lines.push(`  ${varName}: ${value};`);
      }
    }
  }

  lines.push('}');

  return lines.join('\n');
}

/**
 * Convert size tokens to CSS custom properties
 *
 * @param prefix - Variable prefix (default: 'gds')
 * @param themeSelector - CSS selector for theme (default: ':root')
 */
export function generateSizeCssVariables(
  prefix = 'gds',
  themeSelector = ':root',
): string {
  const lines: string[] = [];
  lines.push(`${themeSelector} {`);
  lines.push(`  /* Component sizes */`);

  for (const [name, value] of Object.entries(componentSizes)) {
    const varName = `--${prefix}-size-${toKebabCase(name)}`;
    lines.push(`  ${varName}: ${value}px;`);
  }

  lines.push('');
  lines.push(`  /* Spacing */`);

  for (const [name, value] of Object.entries(componentSpacing)) {
    const varName = `--${prefix}-spacing-${toKebabCase(name)}`;
    lines.push(`  ${varName}: ${value}px;`);
  }

  lines.push('');
  lines.push(`  /* Border radius */`);

  for (const [name, value] of Object.entries(componentRound)) {
    const varName = `--${prefix}-radius-${toKebabCase(name)}`;
    lines.push(`  ${varName}: ${value}px;`);
  }

  lines.push('');
  lines.push(`  /* Icon sizes */`);

  for (const [name, value] of Object.entries(iconSizes)) {
    const varName = `--${prefix}-icon-${toKebabCase(name)}`;
    lines.push(`  ${varName}: ${value}px;`);
  }

  lines.push('}');

  return lines.join('\n');
}

/**
 * Convert typography tokens to CSS custom properties
 *
 * @param prefix - Variable prefix (default: 'gds')
 * @param themeSelector - CSS selector for theme (default: ':root')
 */
export function generateTypographyCssVariables(
  prefix = 'gds',
  themeSelector = ':root',
): string {
  const lines: string[] = [];
  lines.push(`${themeSelector} {`);
  lines.push(`  /* Font families */`);
  lines.push(`  --${prefix}-font-family-primary: ${fontFamily.primary};`);

  lines.push('');
  lines.push(`  /* Font sizes */`);

  for (const [name, value] of Object.entries(fontSize)) {
    lines.push(`  --${prefix}-font-size-${name}: ${value}px;`);
  }

  lines.push('');
  lines.push(`  /* Font weights */`);

  for (const [name, value] of Object.entries(fontWeight)) {
    lines.push(`  --${prefix}-font-weight-${name}: ${value};`);
  }

  lines.push('');
  lines.push(`  /* Line heights */`);

  for (const [name, value] of Object.entries(lineHeight)) {
    const lineHeightValue = typeof value === 'number' ? `${value}px` : value;
    lines.push(`  --${prefix}-line-height-${name}: ${lineHeightValue};`);
  }

  lines.push('');
  lines.push(`  /* Letter spacing */`);

  for (const [name, value] of Object.entries(letterSpacing)) {
    lines.push(`  --${prefix}-letter-spacing-${name}: ${value};`);
  }

  lines.push('');
  lines.push(`  /* Typography styles (complete style definitions) */`);

  for (const [styleName, style] of Object.entries(typographyStyles)) {
    const varPrefix = `--${prefix}-text-style-${styleName}`;
    lines.push(`  ${varPrefix}-font-family: ${style.fontFamily};`);
    lines.push(`  ${varPrefix}-font-size: ${style.fontSize}px;`);
    lines.push(`  ${varPrefix}-font-weight: ${style.fontWeight};`);
    const lhValue =
      typeof style.lineHeight === 'number'
        ? `${style.lineHeight}px`
        : style.lineHeight;
    lines.push(`  ${varPrefix}-line-height: ${lhValue};`);
    lines.push(`  ${varPrefix}-letter-spacing: ${style.letterSpacing};`);
  }

  lines.push('}');

  return lines.join('\n');
}

/**
 * Convert grid tokens to CSS custom properties
 *
 * @param prefix - Variable prefix (default: 'gds')
 * @param themeSelector - CSS selector for theme (default: ':root')
 */
export function generateGridCssVariables(
  prefix = 'gds',
  themeSelector = ':root',
): string {
  const lines: string[] = [];
  lines.push(`${themeSelector} {`);
  lines.push(`  /* Breakpoints */`);

  lines.push(`  --${prefix}-grid-breakpoint-mobile: ${breakpoints.mobile}px;`);
  lines.push(`  --${prefix}-grid-breakpoint-tablet: ${breakpoints.tablet}px;`);
  lines.push(
    `  --${prefix}-grid-breakpoint-desktop: ${breakpoints.desktop}px;`,
  );

  lines.push('');
  lines.push(`  /* Gutters */`);

  lines.push(`  --${prefix}-grid-gutter: ${gridGutters.default}px;`);
  lines.push(`  --${prefix}-grid-gutter-half: ${gridGutters.half}px;`);
  lines.push(`  --${prefix}-grid-gutter-quarter: ${gridGutters.quarter}px;`);
  lines.push(`  --${prefix}-grid-gutter-double: ${gridGutters.double}px;`);

  lines.push('');
  lines.push(`  /* Mobile grid */`);

  lines.push(
    `  --${prefix}-grid-mobile-columns: ${gridConfig.mobile.columns};`,
  );
  lines.push(
    `  --${prefix}-grid-mobile-margin: ${gridConfig.mobile.margin}px;`,
  );
  lines.push(
    `  --${prefix}-grid-mobile-column-width: ${gridConfig.mobile.columnWidth}px;`,
  );
  lines.push(
    `  --${prefix}-grid-mobile-total-content-width: ${gridConfig.mobile.totalContentWidth}px;`,
  );

  lines.push('');
  lines.push(`  /* Tablet grid */`);

  lines.push(
    `  --${prefix}-grid-tablet-columns: ${gridConfig.tablet.columns};`,
  );
  lines.push(
    `  --${prefix}-grid-tablet-margin: ${gridConfig.tablet.margin}px;`,
  );
  lines.push(
    `  --${prefix}-grid-tablet-column-width: ${gridConfig.tablet.columnWidth}px;`,
  );
  lines.push(
    `  --${prefix}-grid-tablet-total-content-width: ${gridConfig.tablet.totalContentWidth}px;`,
  );

  lines.push('');
  lines.push(`  /* Desktop narrow grid */`);

  lines.push(
    `  --${prefix}-grid-desktop-columns: ${gridConfig.desktopNarrow.columns};`,
  );
  lines.push(
    `  --${prefix}-grid-desktop-margin-narrow: ${gridConfig.desktopNarrow.margin}px;`,
  );
  lines.push(
    `  --${prefix}-grid-desktop-column-width-narrow: ${gridConfig.desktopNarrow.columnWidth}px;`,
  );
  lines.push(
    `  --${prefix}-grid-desktop-total-content-width-narrow: ${gridConfig.desktopNarrow.totalContentWidth}px;`,
  );

  lines.push('');
  lines.push(`  /* Desktop wide grid */`);

  lines.push(
    `  --${prefix}-grid-desktop-margin-wide: ${gridConfig.desktopWide.margin}px;`,
  );
  lines.push(
    `  --${prefix}-grid-desktop-column-width-wide: ${gridConfig.desktopWide.columnWidth}px;`,
  );
  lines.push(
    `  --${prefix}-grid-desktop-total-content-width-wide: ${gridConfig.desktopWide.totalContentWidth}px;`,
  );

  lines.push('');
  lines.push(`  /* Container max widths */`);

  for (const [name, value] of Object.entries(containerMaxWidths)) {
    lines.push(`  --${prefix}-grid-container-max-width-${name}: ${value};`);
  }

  lines.push('}');

  return lines.join('\n');
}

/**
 * Convert shadow tokens to CSS custom properties
 *
 * @param prefix - Variable prefix (default: 'gds')
 * @param themeSelector - CSS selector for theme (default: ':root')
 */
export function generateShadowCssVariables(
  prefix = 'gds',
  themeSelector = ':root',
): string {
  const lines: string[] = [];
  lines.push(`${themeSelector} {`);
  lines.push(`  /* Shadows */`);

  for (const [name, style] of Object.entries(shadowStyles)) {
    const varName = `--${prefix}-shadow-${name}`;
    lines.push(`  ${varName}: ${style.boxShadow};`);
  }

  lines.push('}');

  return lines.join('\n');
}

/**
 * Generate CSS variables for a complete theme
 *
 * @param theme - The theme object (lightTheme or darkTheme)
 * @param prefix - Variable prefix (default: 'gds')
 */
export function generateThemeVariables(
  theme: typeof lightTheme,
  prefix = 'gds',
): string {
  const lines: string[] = [];
  lines.push(`[data-theme="${theme.name}"], .theme-${theme.name} {`);
  lines.push(`  /* Theme: ${theme.name} */`);

  // Colors
  lines.push('');
  lines.push(`  /* Colors */`);

  const flattenedColors = flattenObject(theme.colors);
  for (const [key, value] of Object.entries(flattenedColors)) {
    const varName = `--${prefix}-${toKebabCase(key)}`;
    lines.push(`  ${varName}: ${value};`);
  }

  // Sizes
  lines.push('');
  lines.push(`  /* Sizes */`);

  for (const [key, value] of Object.entries(theme.sizes)) {
    const varName = `--${prefix}-${toKebabCase(key)}`;
    const sizeValue = typeof value === 'number' ? `${value}px` : String(value);
    lines.push(`  ${varName}: ${sizeValue};`);
  }

  // Typography
  lines.push('');
  lines.push(`  /* Typography */`);

  if (theme.typography && typeof theme.typography === 'object') {
    const flattenedTypography = flattenObject(theme.typography);
    for (const [key, value] of Object.entries(flattenedTypography)) {
      const varName = `--${prefix}-${toKebabCase(key)}`;
      lines.push(`  ${varName}: ${value};`);
    }
  }

  // Border radius
  lines.push('');
  lines.push(`  /* Border radius */`);

  for (const [key, value] of Object.entries(theme.borderRadius)) {
    const varName = `--${prefix}-radius-${key}`;
    lines.push(`  ${varName}: ${value}px;`);
  }

  lines.push('}');

  return lines.join('\n');
}

/**
 * Generate all CSS variables (colors, sizes, typography)
 *
 * @param prefix - Variable prefix (default: 'gds')
 */
export function generateAllCssVariables(prefix = 'gds'): string {
  return [
    `/* GDS Design Tokens - CSS Custom Properties */`,
    `/* Generated from Figma Design System */`,
    ``,
    generateColorCssVariables(prefix),
    ``,
    generateSizeCssVariables(prefix),
    ``,
    generateTypographyCssVariables(prefix),
    ``,
    generateGridCssVariables(prefix),
    ``,
    generateShadowCssVariables(prefix),
  ].join('\n');
}

/**
 * Generate CSS variables for both light and dark themes
 *
 * @param prefix - Variable prefix (default: 'gds')
 */
export function generateThemedCssVariables(prefix = 'gds'): string {
  return [
    `/* GDS Design Tokens - Themed CSS Custom Properties */`,
    `/* Generated from Figma Design System */`,
    ``,
    `/* Light theme (default) */`,
    generateColorCssVariables(prefix, true),
    ``,
    generateSizeCssVariables(prefix),
    ``,
    generateTypographyCssVariables(prefix),
    ``,
    generateGridCssVariables(prefix),
    ``,
    generateShadowCssVariables(prefix),
    ``,
    `/* Dark theme */`,
    `[data-theme="dark"], .theme-dark {`,
    `  /* Dark theme overrides */`,
    `  /* Colors are available as -dark suffix variants */`,
    `}`,
    ``,
    generateThemeVariables(darkTheme, prefix),
  ].join('\n');
}

/**
 * Generate a complete CSS module with light and dark themes
 *
 * @param prefix - Variable prefix (default: 'gds')
 */
export function generateCompleteCssModule(prefix = 'gds'): string {
  return [
    `/* GDS Design Tokens - Complete CSS Module */`,
    `/* Generated from Figma Design System */`,
    `/* Auto-generated - do not edit manually */`,
    ``,
    `/* Light theme (default) */`,
    generateColorCssVariables(prefix, true),
    ``,
    generateSizeCssVariables(prefix),
    ``,
    generateTypographyCssVariables(prefix),
    ``,
    generateGridCssVariables(prefix),
    ``,
    generateShadowCssVariables(prefix),
    ``,
    `/* Dark theme */`,
    ``,
    generateThemeVariables(darkTheme, prefix),
  ].join('\n');
}

/**
 * Generate CSS module content
 *
 * @param prefix - Variable prefix (default: 'gds')
 */
export function generateCssModule(prefix = 'gds'): string {
  return generateCompleteCssModule(prefix);
}

/**
 * Generate SCSS variables from design tokens
 *
 * @param prefix - Variable prefix (default: 'gds')
 */
export function generateScssVariables(prefix = 'gds'): string {
  const lines: string[] = [];
  lines.push(`// GDS Design Tokens - SCSS Variables`);
  lines.push(`// Generated from Figma Design System`);
  lines.push(``);

  // Colors
  lines.push(`// Primitive colors`);
  for (const [colorName, shades] of Object.entries(primitiveColors)) {
    if (typeof shades === 'object' && shades !== null) {
      for (const [shade, value] of Object.entries(
        shades as Record<string, string>,
      )) {
        lines.push(`$${prefix}-color-${colorName}-${shade}: ${value};`);
      }
    }
  }

  lines.push(``);
  lines.push(`// Dark mode primitive colors`);
  for (const [colorName, shades] of Object.entries(darkPrimitiveColors)) {
    if (typeof shades === 'object' && shades !== null) {
      for (const [shade, value] of Object.entries(
        shades as Record<string, string>,
      )) {
        lines.push(`$${prefix}-color-${colorName}-${shade}-dark: ${value};`);
      }
    }
  }

  lines.push(``);
  lines.push(`// Foundation colors`);
  for (const [category, values] of Object.entries(foundationColors)) {
    if (typeof values === 'object' && values !== null) {
      const flattened = flattenObject(values);
      for (const [key, value] of Object.entries(flattened)) {
        lines.push(`$${prefix}-${category}-${toKebabCase(key)}: ${value};`);
      }
    }
  }

  lines.push(``);
  lines.push(`// Sizes`);
  for (const [name, value] of Object.entries(componentSizes)) {
    lines.push(`$${prefix}-size-${toKebabCase(name)}: ${value}px;`);
  }

  lines.push(``);
  lines.push(`// Spacing`);
  for (const [name, value] of Object.entries(componentSpacing)) {
    lines.push(`$${prefix}-spacing-${toKebabCase(name)}: ${value}px;`);
  }

  lines.push(``);
  lines.push(`// Typography`);
  lines.push(`$${prefix}-font-family-primary: ${fontFamily.primary};`);
  for (const [name, value] of Object.entries(fontSize)) {
    lines.push(`$${prefix}-font-size-${name}: ${value}px;`);
  }
  for (const [name, value] of Object.entries(fontWeight)) {
    lines.push(`$${prefix}-font-weight-${name}: ${value};`);
  }

  return lines.join('\n');
}

/**
 * Generate Less variables from design tokens
 *
 * @param prefix - Variable prefix (default: 'gds')
 */
export function generateLessVariables(prefix = 'gds'): string {
  const lines: string[] = [];
  lines.push(`// GDS Design Tokens - Less Variables`);
  lines.push(`// Generated from Figma Design System`);
  lines.push(``);

  // Colors
  lines.push(`// Primitive colors`);
  for (const [colorName, shades] of Object.entries(primitiveColors)) {
    if (typeof shades === 'object' && shades !== null) {
      for (const [shade, value] of Object.entries(
        shades as Record<string, string>,
      )) {
        lines.push(`@${prefix}-color-${colorName}-${shade}: ${value};`);
      }
    }
  }

  lines.push(``);
  lines.push(`// Typography`);
  lines.push(`@${prefix}-font-family-primary: ${fontFamily.primary};`);

  return lines.join('\n');
}

export default {
  generateColorCssVariables,
  generateSizeCssVariables,
  generateTypographyCssVariables,
  generateGridCssVariables,
  generateShadowCssVariables,
  generateThemeVariables,
  generateAllCssVariables,
  generateThemedCssVariables,
  generateCompleteCssModule,
  generateCssModule,
  generateScssVariables,
  generateLessVariables,
};
