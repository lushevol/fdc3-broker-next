/**
 * GDS Design Tokens - CSS Variables Generator
 * Converts design tokens to CSS custom properties
 * Matches official theme.css format with --sc- prefix
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

import {
  primitiveColors,
  foundationColors,
  semanticFgLinkColors,
  semanticFgTextColors,
} from './colors';
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

// Default prefix to match official theme.css
const DEFAULT_PREFIX = 'sc';

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
 * Generate typography sizing variables (matching official format)
 */
function generateTypographySizingVariables(prefix = DEFAULT_PREFIX): string {
  const lines: string[] = [];
  lines.push(`  /* Typography variables */`);

  // Match official typography sizing
  const typographySizes: Record<string, string> = {
    'text-hero-main': '56px',
    'text-hero-sub': '48px',
    'text-headline-main': '40px',
    'text-headline-sub': '32px',
    'text-section-main': '28px',
    'text-section-sub': '22px',
    'text-section-minor': '18px',
    'text-paragraph-main': '14px',
    'text-title-main': '18px',
    'text-title-sub': '16px',
    'text-component-main': '14px',
    'text-label-main': '12px',
    'text-description-main': '12px',
    'text-helper-main': '12px',
  };

  for (const [name, value] of Object.entries(typographySizes)) {
    lines.push(`  --${prefix}-${name}: ${value};`);
  }

  return lines.join('\n');
}

/**
 * Generate primitive color variables for a single palette
 */
function generatePrimitiveColorPalette(
  colors: typeof primitiveColors,
  prefix = DEFAULT_PREFIX,
  isDark = false,
): string {
  const lines: string[] = [];
  const suffix = isDark ? '-dark' : '';

  for (const [colorName, shades] of Object.entries(colors)) {
    if (colorName === 'prosperBlue') {
      // Handle prosperBlue as a single value (not nested shades)
      const value = shades as unknown as string;
      const varName = `--${prefix}-color-prosper-blue`;
      lines.push(`  ${varName}: ${value};`);
    } else if (
      colorName === 'grey' &&
      typeof shades === 'object' &&
      shades !== null
    ) {
      // Handle grey specially - white and black are separate, not shades
      const greyShades = shades as Record<string, string>;

      // First output white and black
      if ('white' in greyShades) {
        lines.push(`  --${prefix}-color-white: ${greyShades.white};`);
      }
      if ('black' in greyShades) {
        lines.push(`  --${prefix}-color-black: ${greyShades.black};`);
      }

      // Then output numbered shades
      for (const [shade, value] of Object.entries(greyShades)) {
        if (shade !== 'white' && shade !== 'black') {
          const varName = `--${prefix}-color-grey-${shade}`;
          lines.push(`  ${varName}: ${value};`);
        }
      }
    } else if (typeof shades === 'object' && shades !== null) {
      // Regular color with numbered shades
      for (const [shade, value] of Object.entries(
        shades as Record<string, string>,
      )) {
        const varName = `--${prefix}-color-${colorName}-${shade}`;
        lines.push(`  ${varName}: ${value};`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Convert color tokens to CSS custom properties
 *
 * @param prefix - Variable prefix (default: 'sc')
 * @param includeDark - Whether to include dark mode colors
 * @param themeSelector - CSS selector for theme (default: ':root')
 */
export function generateColorCssVariables(
  prefix = DEFAULT_PREFIX,
  includeDark = true,
  themeSelector = ':root',
): string {
  const lines: string[] = [];
  lines.push(`${themeSelector} {`);

  // Typography sizing variables first (matching official)
  lines.push(generateTypographySizingVariables(prefix));
  lines.push('');

  // Light mode colors
  lines.push(`  /* Grey Color Palette */`);
  lines.push(generatePrimitiveColorPalette(primitiveColors, prefix, false));

  // Dark mode primitive colors (with -dark suffix for reference)
  if (includeDark) {
    lines.push('');
    lines.push(`  /* Dark mode primitive colors */`);
    for (const [colorName, shades] of Object.entries(darkPrimitiveColors)) {
      if (colorName === 'prosperBlue') {
        // prosperBlue stays the same in dark mode
        continue;
      } else if (
        colorName === 'grey' &&
        typeof shades === 'object' &&
        shades !== null
      ) {
        const greyShades = shades as Record<string, string>;

        // Dark mode white and black (inverted)
        if ('white' in greyShades) {
          lines.push(`  --${prefix}-color-white-dark: ${greyShades.white};`);
        }
        if ('black' in greyShades) {
          lines.push(`  --${prefix}-color-black-dark: ${greyShades.black};`);
        }

        // Numbered shades
        for (const [shade, value] of Object.entries(greyShades)) {
          if (shade !== 'white' && shade !== 'black') {
            const varName = `--${prefix}-color-grey-${shade}-dark`;
            lines.push(`  ${varName}: ${value};`);
          }
        }
      } else if (typeof shades === 'object' && shades !== null) {
        for (const [shade, value] of Object.entries(
          shades as Record<string, string>,
        )) {
          const varName = `--${prefix}-color-${colorName}-${shade}-dark`;
          lines.push(`  ${varName}: ${value};`);
        }
      }
    }
  }

  // Foundation colors with official naming format
  // Format: --sc-color-foundation-{category}-{name}
  lines.push('');
  lines.push(`  /* Foundation Basic Color Palette */`);

  for (const [key, value] of Object.entries(foundationColors.basic)) {
    // Convert camelCase to kebab-case: backgroundBase -> background-base
    const kebabKey = toKebabCase(key);
    const varName = `--${prefix}-color-foundation-basic-${kebabKey}`;
    lines.push(`  ${varName}: ${value};`);
    // Add comment for description (matching official)
  }

  lines.push('');
  lines.push(`  /* Foundation Content Color Palette */`);

  for (const [key, value] of Object.entries(foundationColors.content)) {
    const kebabKey = toKebabCase(key);
    const varName = `--${prefix}-color-foundation-content-${kebabKey}`;
    lines.push(`  ${varName}: ${value};`);
  }

  // Semantic foreground link colors
  // Format: --sc-color-semantic-fg-link-{variant}-{state}
  lines.push('');
  lines.push(`  /* Semantic Foreground Color Palette */`);

  for (const [variant, states] of Object.entries(semanticFgLinkColors)) {
    for (const [state, value] of Object.entries(states)) {
      // Convert camelCase state to kebab-case: restSubtle -> rest-subtle
      const kebabState = toKebabCase(state);
      const varName = `--${prefix}-color-semantic-fg-link-${variant}-${kebabState}`;
      lines.push(`  ${varName}: ${value};`);
    }
  }

  // Semantic foreground text colors
  // Format: --sc-color-semantic-fg-text-{variant}-{state}
  for (const [variant, states] of Object.entries(semanticFgTextColors)) {
    for (const [state, value] of Object.entries(states)) {
      const kebabState = toKebabCase(state);
      const varName = `--${prefix}-color-semantic-fg-text-${variant}-${kebabState}`;
      lines.push(`  ${varName}: ${value};`);
    }
  }

  lines.push('}');

  return lines.join('\n');
}

/**
 * Convert size tokens to CSS custom properties
 *
 * @param prefix - Variable prefix (default: 'sc')
 * @param themeSelector - CSS selector for theme (default: ':root')
 */
export function generateSizeCssVariables(
  prefix = DEFAULT_PREFIX,
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
 * @param prefix - Variable prefix (default: 'sc')
 * @param themeSelector - CSS selector for theme (default: ':root')
 */
export function generateTypographyCssVariables(
  prefix = DEFAULT_PREFIX,
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
 * @param prefix - Variable prefix (default: 'sc')
 * @param themeSelector - CSS selector for theme (default: ':root')
 */
export function generateGridCssVariables(
  prefix = DEFAULT_PREFIX,
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
 * @param prefix - Variable prefix (default: 'sc')
 * @param themeSelector - CSS selector for theme (default: ':root')
 */
export function generateShadowCssVariables(
  prefix = DEFAULT_PREFIX,
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
 * @param prefix - Variable prefix (default: 'sc')
 */
export function generateThemeVariables(
  theme: typeof lightTheme,
  prefix = DEFAULT_PREFIX,
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
 * @param prefix - Variable prefix (default: 'sc')
 */
export function generateAllCssVariables(prefix = DEFAULT_PREFIX): string {
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
 * @param prefix - Variable prefix (default: 'sc')
 */
export function generateThemedCssVariables(prefix = DEFAULT_PREFIX): string {
  return [
    `@custom-variant dark (&:is(.dark *));`,
    ``,
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
    `}`,
    ``,
    generateThemeVariables(darkTheme, prefix),
  ].join('\n');
}

/**
 * Generate a complete CSS module with light and dark themes
 *
 * @param prefix - Variable prefix (default: 'sc')
 */
export function generateCompleteCssModule(prefix = DEFAULT_PREFIX): string {
  return [
    `@custom-variant dark (&:is(.dark *));`,
    ``,
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
 * @param prefix - Variable prefix (default: 'sc')
 */
export function generateCssModule(prefix = DEFAULT_PREFIX): string {
  return generateCompleteCssModule(prefix);
}

/**
 * Generate SCSS variables from design tokens
 *
 * @param prefix - Variable prefix (default: 'sc')
 */
export function generateScssVariables(prefix = DEFAULT_PREFIX): string {
  const lines: string[] = [];
  lines.push(`// GDS Design Tokens - SCSS Variables`);
  lines.push(`// Generated from Figma Design System`);
  lines.push(``);

  // Colors
  lines.push(`// Primitive colors`);
  for (const [colorName, shades] of Object.entries(primitiveColors)) {
    if (colorName === 'prosperBlue') {
      const value = shades as unknown as string;
      lines.push(`$${prefix}-color-prosper-blue: ${value};`);
    } else if (
      colorName === 'grey' &&
      typeof shades === 'object' &&
      shades !== null
    ) {
      const greyShades = shades as Record<string, string>;
      if ('white' in greyShades) {
        lines.push(`$${prefix}-color-white: ${greyShades.white};`);
      }
      if ('black' in greyShades) {
        lines.push(`$${prefix}-color-black: ${greyShades.black};`);
      }
      for (const [shade, value] of Object.entries(greyShades)) {
        if (shade !== 'white' && shade !== 'black') {
          lines.push(`$${prefix}-color-grey-${shade}: ${value};`);
        }
      }
    } else if (typeof shades === 'object' && shades !== null) {
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
    if (colorName === 'prosperBlue') {
      continue;
    } else if (
      colorName === 'grey' &&
      typeof shades === 'object' &&
      shades !== null
    ) {
      const greyShades = shades as Record<string, string>;
      if ('white' in greyShades) {
        lines.push(`$${prefix}-color-white-dark: ${greyShades.white};`);
      }
      if ('black' in greyShades) {
        lines.push(`$${prefix}-color-black-dark: ${greyShades.black};`);
      }
      for (const [shade, value] of Object.entries(greyShades)) {
        if (shade !== 'white' && shade !== 'black') {
          lines.push(`$${prefix}-color-grey-${shade}-dark: ${value};`);
        }
      }
    } else if (typeof shades === 'object' && shades !== null) {
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
 * @param prefix - Variable prefix (default: 'sc')
 */
export function generateLessVariables(prefix = DEFAULT_PREFIX): string {
  const lines: string[] = [];
  lines.push(`// GDS Design Tokens - Less Variables`);
  lines.push(`// Generated from Figma Design System`);
  lines.push(``);

  // Colors
  lines.push(`// Primitive colors`);
  for (const [colorName, shades] of Object.entries(primitiveColors)) {
    if (colorName === 'prosperBlue') {
      const value = shades as unknown as string;
      lines.push(`@${prefix}-color-prosper-blue: ${value};`);
    } else if (
      colorName === 'grey' &&
      typeof shades === 'object' &&
      shades !== null
    ) {
      const greyShades = shades as Record<string, string>;
      if ('white' in greyShades) {
        lines.push(`@${prefix}-color-white: ${greyShades.white};`);
      }
      if ('black' in greyShades) {
        lines.push(`@${prefix}-color-black: ${greyShades.black};`);
      }
      for (const [shade, value] of Object.entries(greyShades)) {
        if (shade !== 'white' && shade !== 'black') {
          lines.push(`@${prefix}-color-grey-${shade}: ${value};`);
        }
      }
    } else if (typeof shades === 'object' && shades !== null) {
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
