/**
 * GDS Design Tokens - Generate CSS/SCSS/Less Artifacts
 *
 * Usage:
 *   npm run generate:tokens           # Generate all artifacts
 *   npm run generate:tokens -- css    # Generate CSS only
 *   npm run generate:tokens -- scss   # Generate SCSS only
 *   npm run generate:tokens -- less   # Generate Less only
 *   npm run generate:tokens -- watch  # Watch for changes
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  generateAllCssVariables,
  generateThemedCssVariables,
  generateGridCssVariables,
} from '../src/tokens/cssVariables.js';
import { primitiveColors } from '../src/tokens/colors.js';
import { darkPrimitiveColors } from '../src/tokens/colorsDark.js';
import {
  componentSizes,
  componentSpacing,
  componentRound,
  iconSizes,
} from '../src/tokens/sizes.js';
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  typographyStyles,
} from '../src/tokens/typography.js';
import { shadowStyles } from '../src/tokens/shadows.js';
import {
  breakpoints,
  gridConfig,
  gridGutters,
  containerMaxWidths,
} from '../src/tokens/grid.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Output directories
const DIST_DIR = path.join(ROOT, 'dist');
const CSS_DIR = path.join(DIST_DIR, 'css');
const SCSS_DIR = path.join(ROOT, 'src', 'tokens', '_generated');
const LESS_DIR = path.join(ROOT, 'src', 'tokens', '_generated');

// Ensure output directories exist
async function ensureDirs() {
  await fs.mkdir(CSS_DIR, { recursive: true });
  await fs.mkdir(SCSS_DIR, { recursive: true });
  await fs.mkdir(LESS_DIR, { recursive: true });
}

/**
 * Convert camelCase to kebab-case
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
): Record<string, string | number> {
  const result: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'string') {
      result[newKey] = value;
    } else if (typeof value === 'number') {
      result[newKey] = value;
    } else if (value !== null && typeof value === 'object') {
      Object.assign(
        result,
        flattenObject(value as Record<string, unknown>, newKey),
      );
    }
  }

  return result;
}

// Generate CSS artifacts
async function generateCss() {
  console.log('Generating CSS artifacts...');

  // Full CSS module with themes
  await fs.writeFile(
    path.join(CSS_DIR, 'gds.tokens.css'),
    generateThemedCssVariables('gds'),
    'utf-8',
  );

  // Colors only
  await fs.writeFile(
    path.join(CSS_DIR, 'gds.colors.css'),
    `:root {
${generateAllCssVariables('gds')
  .split('\n')
  .filter((line) => !line.startsWith('/*') && line.trim())
  .map((line) => '  ' + line)
  .join('\n')}
}`,
    'utf-8',
  );

  // Minified version
  const minified = generateThemedCssVariables('gds')
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();

  await fs.writeFile(
    path.join(CSS_DIR, 'gds.tokens.min.css'),
    minified,
    'utf-8',
  );

  console.log(`  - ${CSS_DIR}/gds.tokens.css`);
  console.log(`  - ${CSS_DIR}/gds.colors.css`);
  console.log(`  - ${CSS_DIR}/gds.tokens.min.css`);
}

// Generate SCSS artifacts
async function generateScss() {
  console.log('Generating SCSS artifacts...');

  const lines: string[] = [];
  lines.push(`// GDS Design Tokens - SCSS Variables`);
  lines.push(`// Generated from Figma Design System`);
  lines.push(`// Auto-generated - do not edit manually`);
  lines.push(``);

  // Primitive colors
  lines.push(
    `// =============================================================================`,
  );
  lines.push(`// PRIMITIVE COLORS`);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(``);
  for (const [colorName, shades] of Object.entries(primitiveColors)) {
    if (typeof shades === 'object' && shades !== null) {
      for (const [shade, value] of Object.entries(
        shades as Record<string, string>,
      )) {
        lines.push(`$gds-color-${colorName}-${shade}: ${value};`);
      }
    }
  }

  // Dark mode primitive colors
  lines.push(``);
  lines.push(`// Dark mode primitive colors`);
  for (const [colorName, shades] of Object.entries(darkPrimitiveColors)) {
    if (typeof shades === 'object' && shades !== null) {
      for (const [shade, value] of Object.entries(
        shades as Record<string, string>,
      )) {
        lines.push(`$gds-color-${colorName}-${shade}-dark: ${value};`);
      }
    }
  }

  // Sizes
  lines.push(``);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(`// SIZES`);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(``);
  lines.push(`// Component sizes`);
  for (const [name, value] of Object.entries(componentSizes)) {
    lines.push(`$gds-size-${toKebabCase(name)}: ${value}px;`);
  }

  lines.push(``);
  lines.push(`// Spacing`);
  for (const [name, value] of Object.entries(componentSpacing)) {
    lines.push(`$gds-spacing-${toKebabCase(name)}: ${value}px;`);
  }

  lines.push(``);
  lines.push(`// Border radius`);
  for (const [name, value] of Object.entries(componentRound)) {
    lines.push(`$gds-radius-${toKebabCase(name)}: ${value}px;`);
  }

  lines.push(``);
  lines.push(`// Icon sizes`);
  for (const [name, value] of Object.entries(iconSizes)) {
    lines.push(`$gds-icon-${toKebabCase(name)}: ${value}px;`);
  }

  // Typography
  lines.push(``);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(`// TYPOGRAPHY`);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(``);
  lines.push(`// Font families`);
  lines.push(`$gds-font-family-primary: ${fontFamily.primary};`);
  lines.push(`$gds-font-family-system: ${fontFamily.system};`);
  lines.push(`$gds-font-family-monospace: ${fontFamily.monospace};`);

  lines.push(``);
  lines.push(`// Font sizes`);
  for (const [name, value] of Object.entries(fontSize)) {
    lines.push(`$gds-font-size-${toKebabCase(name)}: ${value}px;`);
  }

  lines.push(``);
  lines.push(`// Font weights`);
  for (const [name, value] of Object.entries(fontWeight)) {
    lines.push(`$gds-font-weight-${toKebabCase(name)}: ${value};`);
  }

  lines.push(``);
  lines.push(`// Line heights`);
  for (const [name, value] of Object.entries(lineHeight)) {
    const lhValue = typeof value === 'number' ? `${value}px` : value;
    lines.push(`$gds-line-height-${toKebabCase(name)}: ${lhValue};`);
  }

  lines.push(``);
  lines.push(`// Letter spacing`);
  for (const [name, value] of Object.entries(letterSpacing)) {
    lines.push(`$gds-letter-spacing-${toKebabCase(name)}: ${value};`);
  }

  lines.push(``);
  lines.push(`// Typography styles`);
  for (const [styleName, style] of Object.entries(typographyStyles)) {
    lines.push(
      `$gds-text-style-${toKebabCase(styleName)}-font-family: ${style.fontFamily};`,
    );
    lines.push(
      `$gds-text-style-${toKebabCase(styleName)}-font-size: ${style.fontSize}px;`,
    );
    lines.push(
      `$gds-text-style-${toKebabCase(styleName)}-font-weight: ${style.fontWeight};`,
    );
    const lh =
      typeof style.lineHeight === 'number'
        ? `${style.lineHeight}px`
        : style.lineHeight;
    lines.push(`$gds-text-style-${toKebabCase(styleName)}-line-height: ${lh};`);
    lines.push(
      `$gds-text-style-${toKebabCase(styleName)}-letter-spacing: ${style.letterSpacing};`,
    );
  }

  // Grid
  lines.push(``);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(`// GRID`);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(``);
  lines.push(`// Breakpoints`);
  lines.push(`$gds-grid-breakpoint-mobile: ${breakpoints.mobile}px;`);
  lines.push(`$gds-grid-breakpoint-tablet: ${breakpoints.tablet}px;`);
  lines.push(`$gds-grid-breakpoint-desktop: ${breakpoints.desktop}px;`);

  lines.push(``);
  lines.push(`// Gutters`);
  lines.push(`$gds-grid-gutter: ${gridGutters.default}px;`);
  lines.push(`$gds-grid-gutter-half: ${gridGutters.half}px;`);
  lines.push(`$gds-grid-gutter-quarter: ${gridGutters.quarter}px;`);
  lines.push(`$gds-grid-gutter-double: ${gridGutters.double}px;`);

  lines.push(``);
  lines.push(`// Mobile grid`);
  lines.push(`$gds-grid-mobile-columns: ${gridConfig.mobile.columns};`);
  lines.push(`$gds-grid-mobile-margin: ${gridConfig.mobile.margin}px;`);
  lines.push(
    `$gds-grid-mobile-column-width: ${gridConfig.mobile.columnWidth}px;`,
  );
  lines.push(
    `$gds-grid-mobile-total-content-width: ${gridConfig.mobile.totalContentWidth}px;`,
  );

  lines.push(``);
  lines.push(`// Tablet grid`);
  lines.push(`$gds-grid-tablet-columns: ${gridConfig.tablet.columns};`);
  lines.push(`$gds-grid-tablet-margin: ${gridConfig.tablet.margin}px;`);
  lines.push(
    `$gds-grid-tablet-column-width: ${gridConfig.tablet.columnWidth}px;`,
  );
  lines.push(
    `$gds-grid-tablet-total-content-width: ${gridConfig.tablet.totalContentWidth}px;`,
  );

  lines.push(``);
  lines.push(`// Desktop narrow grid`);
  lines.push(`$gds-grid-desktop-columns: ${gridConfig.desktopNarrow.columns};`);
  lines.push(
    `$gds-grid-desktop-margin-narrow: ${gridConfig.desktopNarrow.margin}px;`,
  );
  lines.push(
    `$gds-grid-desktop-column-width-narrow: ${gridConfig.desktopNarrow.columnWidth}px;`,
  );
  lines.push(
    `$gds-grid-desktop-total-content-width-narrow: ${gridConfig.desktopNarrow.totalContentWidth}px;`,
  );

  lines.push(``);
  lines.push(`// Desktop wide grid`);
  lines.push(
    `$gds-grid-desktop-margin-wide: ${gridConfig.desktopWide.margin}px;`,
  );
  lines.push(
    `$gds-grid-desktop-column-width-wide: ${gridConfig.desktopWide.columnWidth}px;`,
  );
  lines.push(
    `$gds-grid-desktop-total-content-width-wide: ${gridConfig.desktopWide.totalContentWidth}px;`,
  );

  lines.push(``);
  lines.push(`// Container max widths`);
  for (const [name, value] of Object.entries(containerMaxWidths)) {
    lines.push(`$gds-grid-container-max-width-${name}: ${value};`);
  }

  // Shadows
  lines.push(``);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(`// SHADOWS`);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(``);
  for (const [name, style] of Object.entries(shadowStyles)) {
    lines.push(`$gds-shadow-${toKebabCase(name)}: ${style.boxShadow};`);
  }

  await fs.writeFile(
    path.join(SCSS_DIR, '_variables.scss'),
    lines.join('\n'),
    'utf-8',
  );

  // Generate color maps dynamically from token source
  const colorMapLines: string[] = [];
  colorMapLines.push(`// GDS Color Maps - Auto-generated`);
  colorMapLines.push(`// Use these maps with @each for dynamic styling`);
  colorMapLines.push(``);
  colorMapLines.push(`$gds-colors: (`);

  const colorEntries: string[] = [];
  for (const [colorName, shades] of Object.entries(primitiveColors)) {
    if (typeof shades === 'object' && shades !== null) {
      const shadeEntries = Object.entries(shades as Record<string, string>)
        .map(([shade, value]) => `    '${shade}': ${value}`)
        .join(',\n');
      colorEntries.push(`  '${colorName}': (\n${shadeEntries}\n  )`);
    }
  }
  colorMapLines.push(colorEntries.join(',\n'));
  colorMapLines.push(`);`);

  colorMapLines.push(``);
  colorMapLines.push(`$gds-colors-dark: (`);

  const darkColorEntries: string[] = [];
  for (const [colorName, shades] of Object.entries(darkPrimitiveColors)) {
    if (typeof shades === 'object' && shades !== null) {
      const shadeEntries = Object.entries(shades as Record<string, string>)
        .map(([shade, value]) => `    '${shade}': ${value}`)
        .join(',\n');
      darkColorEntries.push(`  '${colorName}': (\n${shadeEntries}\n  )`);
    }
  }
  colorMapLines.push(darkColorEntries.join(',\n'));
  colorMapLines.push(`);`);

  colorMapLines.push(``);
  colorMapLines.push(`// Mixins for easy theming`);
  colorMapLines.push(`@mixin theme-light {`);
  colorMapLines.push(`  [data-theme="light"], .theme-light & {`);
  colorMapLines.push(`    @content;`);
  colorMapLines.push(`  }`);
  colorMapLines.push(`}`);
  colorMapLines.push(``);
  colorMapLines.push(`@mixin theme-dark {`);
  colorMapLines.push(`  [data-theme="dark"], .theme-dark & {`);
  colorMapLines.push(`    @content;`);
  colorMapLines.push(`  }`);
  colorMapLines.push(`}`);

  await fs.writeFile(
    path.join(SCSS_DIR, '_color-maps.scss'),
    colorMapLines.join('\n'),
    'utf-8',
  );

  // Index file
  await fs.writeFile(
    path.join(SCSS_DIR, '_index.scss'),
    `// GDS Design Tokens - SCSS
// Auto-generated from Figma Design System
// Do not edit manually

@forward 'variables';
@forward 'color-maps';
`,
    'utf-8',
  );

  console.log(`  - ${SCSS_DIR}/_variables.scss`);
  console.log(`  - ${SCSS_DIR}/_color-maps.scss`);
  console.log(`  - ${SCSS_DIR}/_index.scss`);
}

// Generate Less artifacts
async function generateLess() {
  console.log('Generating Less artifacts...');

  const lines: string[] = [];
  lines.push(`// GDS Design Tokens - Less Variables`);
  lines.push(`// Generated from Figma Design System`);
  lines.push(`// Auto-generated - do not edit manually`);
  lines.push(``);

  // Primitive colors
  lines.push(
    `// =============================================================================`,
  );
  lines.push(`// PRIMITIVE COLORS`);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(``);
  for (const [colorName, shades] of Object.entries(primitiveColors)) {
    if (typeof shades === 'object' && shades !== null) {
      for (const [shade, value] of Object.entries(
        shades as Record<string, string>,
      )) {
        lines.push(`@gds-color-${colorName}-${shade}: ${value};`);
      }
    }
  }

  // Dark mode primitive colors
  lines.push(``);
  lines.push(`// Dark mode primitive colors`);
  for (const [colorName, shades] of Object.entries(darkPrimitiveColors)) {
    if (typeof shades === 'object' && shades !== null) {
      for (const [shade, value] of Object.entries(
        shades as Record<string, string>,
      )) {
        lines.push(`@gds-color-${colorName}-${shade}-dark: ${value};`);
      }
    }
  }

  // Sizes
  lines.push(``);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(`// SIZES`);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(``);
  lines.push(`// Component sizes`);
  for (const [name, value] of Object.entries(componentSizes)) {
    lines.push(`@gds-size-${toKebabCase(name)}: ${value}px;`);
  }

  lines.push(``);
  lines.push(`// Spacing`);
  for (const [name, value] of Object.entries(componentSpacing)) {
    lines.push(`@gds-spacing-${toKebabCase(name)}: ${value}px;`);
  }

  lines.push(``);
  lines.push(`// Border radius`);
  for (const [name, value] of Object.entries(componentRound)) {
    lines.push(`@gds-radius-${toKebabCase(name)}: ${value}px;`);
  }

  lines.push(``);
  lines.push(`// Icon sizes`);
  for (const [name, value] of Object.entries(iconSizes)) {
    lines.push(`@gds-icon-${toKebabCase(name)}: ${value}px;`);
  }

  // Typography
  lines.push(``);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(`// TYPOGRAPHY`);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(``);
  lines.push(`// Font families`);
  lines.push(`@gds-font-family-primary: ${fontFamily.primary};`);
  lines.push(`@gds-font-family-system: ${fontFamily.system};`);
  lines.push(`@gds-font-family-monospace: ${fontFamily.monospace};`);

  lines.push(``);
  lines.push(`// Font sizes`);
  for (const [name, value] of Object.entries(fontSize)) {
    lines.push(`@gds-font-size-${toKebabCase(name)}: ${value}px;`);
  }

  lines.push(``);
  lines.push(`// Font weights`);
  for (const [name, value] of Object.entries(fontWeight)) {
    lines.push(`@gds-font-weight-${toKebabCase(name)}: ${value};`);
  }

  lines.push(``);
  lines.push(`// Line heights`);
  for (const [name, value] of Object.entries(lineHeight)) {
    const lhValue = typeof value === 'number' ? `${value}px` : value;
    lines.push(`@gds-line-height-${toKebabCase(name)}: ${lhValue};`);
  }

  lines.push(``);
  lines.push(`// Letter spacing`);
  for (const [name, value] of Object.entries(letterSpacing)) {
    lines.push(`@gds-letter-spacing-${toKebabCase(name)}: ${value};`);
  }

  // Grid
  lines.push(``);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(`// GRID`);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(``);
  lines.push(`// Breakpoints`);
  lines.push(`@gds-grid-breakpoint-mobile: ${breakpoints.mobile}px;`);
  lines.push(`@gds-grid-breakpoint-tablet: ${breakpoints.tablet}px;`);
  lines.push(`@gds-grid-breakpoint-desktop: ${breakpoints.desktop}px;`);

  lines.push(``);
  lines.push(`// Gutters`);
  lines.push(`@gds-grid-gutter: ${gridGutters.default}px;`);
  lines.push(`@gds-grid-gutter-half: ${gridGutters.half}px;`);
  lines.push(`@gds-grid-gutter-quarter: ${gridGutters.quarter}px;`);
  lines.push(`@gds-grid-gutter-double: ${gridGutters.double}px;`);

  lines.push(``);
  lines.push(`// Container max widths`);
  for (const [name, value] of Object.entries(containerMaxWidths)) {
    lines.push(`@gds-grid-container-max-width-${name}: ${value};`);
  }

  // Shadows
  lines.push(``);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(`// SHADOWS`);
  lines.push(
    `// =============================================================================`,
  );
  lines.push(``);
  for (const [name, style] of Object.entries(shadowStyles)) {
    lines.push(`@gds-shadow-${toKebabCase(name)}: ${style.boxShadow};`);
  }

  await fs.writeFile(
    path.join(LESS_DIR, '_variables.less'),
    lines.join('\n'),
    'utf-8',
  );

  // Generate dark theme overrides from token source
  const mixinsLines: string[] = [];
  mixinsLines.push(`// GDS Design Tokens - Less Mixins`);
  mixinsLines.push(`// Auto-generated from Figma Design System`);
  mixinsLines.push(``);

  mixinsLines.push(`.gds-theme-light {`);
  mixinsLines.push(`  // Light theme overrides`);
  mixinsLines.push(`}`);

  mixinsLines.push(``);
  mixinsLines.push(`.gds-theme-dark {`);
  mixinsLines.push(`  // Dark theme values`);
  // Generate dark theme color overrides
  for (const [colorName, shades] of Object.entries(darkPrimitiveColors)) {
    if (typeof shades === 'object' && shades !== null) {
      for (const [shade, value] of Object.entries(
        shades as Record<string, string>,
      )) {
        mixinsLines.push(`  @gds-color-${colorName}-${shade}: ${value};`);
      }
    }
  }
  mixinsLines.push(`}`);

  await fs.writeFile(
    path.join(LESS_DIR, '_mixins.less'),
    mixinsLines.join('\n'),
    'utf-8',
  );

  // Index file
  await fs.writeFile(
    path.join(LESS_DIR, '_index.less'),
    `// GDS Design Tokens - Less
// Auto-generated from Figma Design System

@import '_variables';
@import '_mixins';
`,
    'utf-8',
  );

  console.log(`  - ${LESS_DIR}/_variables.less`);
  console.log(`  - ${LESS_DIR}/_mixins.less`);
  console.log(`  - ${LESS_DIR}/_index.less`);
}

// Generate theme preview HTML
async function generateThemePreview() {
  console.log('Generating theme preview...');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GDS Design Tokens - Theme Preview</title>
  <link rel="stylesheet" href="gds.tokens.css">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: var(--gds-font-family-primary);
      margin: 0;
      padding: var(--gds-spacing-8);
      background: var(--gds-color-grey-50);
      color: var(--gds-color-grey-900);
    }
    .theme-toggle {
      position: fixed;
      top: var(--gds-spacing-4);
      right: var(--gds-spacing-4);
      padding: var(--gds-spacing-2) var(--gds-spacing-4);
      background: var(--gds-color-blue-500);
      color: white;
      border: none;
      border-radius: var(--gds-radius-4);
      cursor: pointer;
    }
    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: var(--gds-spacing-4);
      margin-top: var(--gds-spacing-8);
    }
    .color-swatch {
      border-radius: var(--gds-radius-4);
      padding: var(--gds-spacing-3);
      box-shadow: var(--gds-shadow-elevation1);
    }
    .color-swatch span {
      display: block;
      font-size: var(--gds-font-size-helper);
      margin-top: var(--gds-spacing-2);
    }
    .section {
      margin-top: var(--gds-spacing-10);
    }
    .section h2 {
      border-bottom: 2px solid var(--gds-color-grey-200);
      padding-bottom: var(--gds-spacing-2);
    }
    [data-theme="dark"] body {
      background: var(--gds-color-grey-950);
      color: var(--gds-color-grey-100);
    }
    [data-theme="dark"] .section h2 {
      border-color: var(--gds-color-grey-700);
    }
  </style>
</head>
<body>
  <button class="theme-toggle" onclick="toggleTheme()">Toggle Theme</button>

  <h1>GDS Design Tokens</h1>
  <p>Preview of CSS custom properties generated from Figma</p>

  <div class="section">
    <h2>Primary Colors</h2>
    <div class="color-grid">
      <div class="color-swatch" style="background: var(--gds-color-blue-500)">
        <span style="color: white">Blue 500</span>
      </div>
      <div class="color-swatch" style="background: var(--gds-color-green-500)">
        <span style="color: white">Green 500</span>
      </div>
      <div class="color-swatch" style="background: var(--gds-color-red-500)">
        <span style="color: white">Red 500</span>
      </div>
      <div class="color-swatch" style="background: var(--gds-color-amber-500)">
        <span>Amber 500</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Grey Scale</h2>
    <div class="color-grid">
      <div class="color-swatch" style="background: var(--gds-color-grey-50)">
        <span>Grey 50</span>
      </div>
      <div class="color-swatch" style="background: var(--gds-color-grey-200)">
        <span>Grey 200</span>
      </div>
      <div class="color-swatch" style="background: var(--gds-color-grey-500)">
        <span style="color: white">Grey 500</span>
      </div>
      <div class="color-swatch" style="background: var(--gds-color-grey-800)">
        <span style="color: white">Grey 800</span>
      </div>
      <div class="color-swatch" style="background: var(--gds-color-grey-950)">
        <span style="color: white">Grey 950</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Grid System</h2>
    <div class="color-grid">
      <div class="color-swatch" style="background: var(--gds-color-blue-100)">
        <span>Mobile: ${breakpoints.mobile}px</span>
      </div>
      <div class="color-swatch" style="background: var(--gds-color-blue-200)">
        <span>Tablet: ${breakpoints.tablet}px</span>
      </div>
      <div class="color-swatch" style="background: var(--gds-color-blue-300)">
        <span>Desktop: ${breakpoints.desktop}px</span>
      </div>
      <div class="color-swatch" style="background: var(--gds-color-blue-400)">
        <span>Gutter: ${gridGutters.default}px</span>
      </div>
    </div>
  </div>

  <script>
    function toggleTheme() {
      const body = document.body;
      if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
      } else {
        body.setAttribute('data-theme', 'dark');
      }
    }
  </script>
</body>
</html>
`;

  await fs.writeFile(path.join(CSS_DIR, 'preview.html'), html, 'utf-8');
  console.log(`  - ${CSS_DIR}/preview.html`);
}

// Main generation function
async function generate(type?: string) {
  console.log('GDS Design Tokens - Generator');
  console.log('==============================\n');

  await ensureDirs();

  const args = process.argv.slice(2);
  const target = args[0]?.replace(/^--/, '');

  if (target && target !== 'all') {
    switch (target) {
      case 'css':
        await generateCss();
        break;
      case 'scss':
        await generateScss();
        break;
      case 'less':
        await generateLess();
        break;
      case 'preview':
        await generateThemePreview();
        break;
      case 'watch':
        console.log('Watch mode not implemented yet');
        break;
      default:
        console.log(`Unknown target: ${target}`);
        console.log('Valid targets: css, scss, less, preview, watch, all');
        process.exit(1);
    }
  } else {
    // Generate all
    await generateCss();
    await generateScss();
    await generateLess();
    await generateThemePreview();
  }

  console.log('\nDone!');
}

// Run
generate();
