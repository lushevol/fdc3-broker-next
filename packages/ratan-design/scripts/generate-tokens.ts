/**
 * GDS Design Tokens - Generate CSS/SCSS/Less Artifacts
 *
 * Usage:
 *   pnpm run generate:tokens           # Generate all artifacts
 *   pnpm run generate:tokens -- css    # Generate CSS only
 *   pnpm run generate:tokens -- scss   # Generate SCSS only
 *   pnpm run generate:tokens -- less   # Generate Less only
 *   pnpm run generate:tokens -- watch  # Watch for changes
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  generateAllCssVariables,
  generateThemedCssVariables,
  generateScssVariables,
  generateLessVariables,
} from '../src/tokens/cssVariables.js';

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

  // Main variables file
  await fs.writeFile(
    path.join(SCSS_DIR, '_variables.scss'),
    generateScssVariables('gds'),
    'utf-8',
  );

  // Color maps for iteration
  const colorMaps = `// GDS Color Maps - Auto-generated
// Use these maps with @each for dynamic styling

$gds-colors: (
  'grey': (
    '50': #f9f9f9,
    '100': #e5e5e5,
    '200': #cccccc,
    '300': #b2b2b2,
    '400': #999999,
    '500': #808080,
    '600': #666666,
    '700': #4d4d4d,
    '800': #333333,
    '900': #1a1a1a,
    '950': #0d0d0d,
  ),
  'blue': (
    '50': #e5f1fc,
    '100': #cce3fa,
    '200': #9ac7f6,
    '300': #68abf2,
    '400': #368fee,
    '500': #0473ea,
    '600': #035cbb,
    '700': #02458c,
    '800': #012e5d,
    '900': #00172e,
  ),
  'green': (
    '50': #ebfbe6,
    '100': #d7f7cd,
    '200': #afef9b,
    '300': #87e769,
    '400': #5fdf37,
    '500': #38d200,
    '600': #2ca800,
    '700': #207e00,
    '800': #145400,
    '900': #082a00,
  ),
  'red': (
    '50': #fce6e7,
    '100': #f9ced0,
    '200': #f39da1,
    '300': #ec6c73,
    '400': #e63b44,
    '500': #e00a15,
    '600': #b30811,
    '700': #86060d,
    '800': #5a0408,
    '900': #2d0204,
  ),
  'amber': (
    '50': #fef6e7,
    '100': #feefd0,
    '200': #fddea1,
    '300': #fcce72,
    '400': #fbbd43,
    '500': #faad14,
    '600': #c88a10,
    '700': #96680c,
    '800': #644508,
    '900': #322304,
  ),
);

$gds-colors-dark: (
  'grey': (
    '50': #0d0d0d,
    '100': #1a1a1a,
    '200': #333333,
    '300': #4d4d4d,
    '400': #666666,
    '500': #808080,
    '600': #999999,
    '700': #b2b2b2,
    '800': #cccccc,
    '900': #e5e5e5,
    '950': #f2f2f2,
  ),
  'blue': (
    '50': #000b17,
    '100': #00172e,
    '200': #012e5d,
    '300': #02458c,
    '400': #035cbb,
    '500': #0473ea,
    '600': #1d81ec,
    '700': #368fee,
    '800': #4f9df0,
    '900': #9ac7f6,
  ),
);

// Mixins for easy theming
@mixin theme-light {
  [data-theme="light"], .theme-light & {
    @content;
  }
}

@mixin theme-dark {
  [data-theme="dark"], .theme-dark & {
    @content;
  }
}
`;

  await fs.writeFile(
    path.join(SCSS_DIR, '_color-maps.scss'),
    colorMaps,
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

  // Main variables file
  await fs.writeFile(
    path.join(LESS_DIR, '_variables.less'),
    generateLessVariables('gds'),
    'utf-8',
  );

  // Color mixins
  const lessMixins = `// GDS Design Tokens - Less Mixins
// Auto-generated from Figma Design System

.gds-theme-light {
  // Light theme overrides
  @import (once) '_variables.less';
}

.gds-theme-dark {
  // Dark theme values
  @gds-color-grey-50: #0d0d0d;
  @gds-color-grey-100: #1a1a1a;
  @gds-color-grey-200: #333333;
  @gds-color-grey-500: #808080;
  @gds-color-grey-900: #e5e5e5;
  @gds-color-blue-500: #0473ea;
  @gds-color-blue-900: #9ac7f6;
}
`;

  await fs.writeFile(path.join(LESS_DIR, '_mixins.less'), lessMixins, 'utf-8');

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
