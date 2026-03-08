#!/usr/bin/env node
/**
 * Layout Analysis Script
 *
 * Extracts layout intent from HTML:
 * - Grid system detection (AntD, MUI)
 * - Typography hierarchy
 * - Spacing patterns
 *
 * Usage:
 *   npx tsx scripts/layout-analysis.ts <input-file> [options]
 *
 * Options:
 *   --output-dir <dir>  Output directory (default: ./sanitization-output)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

interface GridInfo {
  system: 'ant-design' | 'mui' | 'both' | 'unknown';
  columns: number;
  breakpoints: { name: string; value: string }[];
  classesFound: string[];
}

interface TypographyInfo {
  levels: { className: string; level: string }[];
  fontSizes: Map<string, string>;
}

interface SpacingInfo {
  baseUnit: number;
  patterns: { class: string; property: string; value: string }[];
}

interface LayoutAnalysisOptions {
  inputFile: string;
  outputDir: string;
}

/**
 * Parse command line arguments
 */
function parseArgs(): LayoutAnalysisOptions {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0].startsWith('--')) {
    console.error(
      'Usage: npx tsx scripts/layout-analysis.ts <input-file> [options]',
    );
    console.error('Options:');
    console.error(
      '  --output-dir <dir>  Output directory (default: ./sanitization-output)',
    );
    process.exit(1);
  }

  const inputFile = args[0];
  let outputDir = './sanitization-output';

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--output-dir' && i + 1 < args.length) {
      outputDir = args[i + 1];
      i++;
    }
  }

  return { inputFile, outputDir };
}

/**
 * Detect grid system
 */
function detectGridSystem($: cheerio.CheerioAPI): GridInfo {
  const info: GridInfo = {
    system: 'unknown',
    columns: 0,
    breakpoints: [],
    classesFound: [],
  };

  // AntD Grid Detection
  const antdRow = $('[class*="ant-row"]');
  const antdCol = $('[class*="ant-col-"]');

  if (antdRow.length > 0 || antdCol.length > 0) {
    info.system = 'ant-design';
    info.columns = 24; // AntD uses 24-column grid

    // Extract AntD column classes
    const antdColClasses = new Set<string>();
    antdCol.each((_, el) => {
      const classes = ($(el).attr('class') || '').split(/\s+/);
      classes.forEach((cls) => {
        if (cls.match(/^ant-col-(\d+)$/)) {
          antdColClasses.add(cls);
        }
        if (cls.match(/^ant-col-(xs|sm|md|lg|xl|xxl)-(\d+)$/)) {
          antdColClasses.add(cls);
        }
      });
    });

    info.classesFound = Array.from(antdColClasses).sort();
    info.breakpoints = [
      { name: 'xs', value: '<576px' },
      { name: 'sm', value: '≥576px' },
      { name: 'md', value: '≥768px' },
      { name: 'lg', value: '≥992px' },
      { name: 'xl', value: '≥1200px' },
      { name: 'xxl', value: '≥1600px' },
    ];
  }

  // MUI Grid Detection
  const muiGrid = $('[class*="MuiGrid-"]');
  const muiGridContainer = $('.MuiGrid-container');
  const muiGridItem = $('.MuiGrid-item');

  if (muiGrid.length > 0) {
    info.system = info.system === 'ant-design' ? 'both' : 'mui';
    info.columns = 12; // MUI uses 12-column grid

    const muiGridClasses = new Set<string>();
    muiGrid.each((_, el) => {
      const classes = ($(el).attr('class') || '').split(/\s+/);
      classes.forEach((cls) => {
        if (cls.match(/^MuiGrid-/)) {
          muiGridClasses.add(cls);
        }
      });
    });

    info.classesFound = info.classesFound.concat(
      Array.from(muiGridClasses).sort(),
    );
    info.breakpoints = [
      { name: 'xs', value: '0px' },
      { name: 'sm', value: '600px' },
      { name: 'md', value: '960px' },
      { name: 'lg', value: '1280px' },
      { name: 'xl', value: '1920px' },
    ];
  }

  return info;
}

/**
 * Extract typography hierarchy
 */
function extractTypography($: cheerio.CheerioAPI): TypographyInfo {
  const info: TypographyInfo = {
    levels: [],
    fontSizes: new Map(),
  };

  // MUI Typography
  const muiTypographyLevels = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'body1',
    'body2',
    'caption',
    'subtitle1',
    'subtitle2',
  ];

  muiTypographyLevels.forEach((level) => {
    const elements = $(`.MuiTypography-${level}`);
    if (elements.length > 0) {
      info.levels.push({
        className: `MuiTypography-${level}`,
        level,
      });
    }
  });

  // AntD Typography
  const antdTypographyClasses = [
    'ant-typography',
    'ant-typography-h1',
    'ant-typography-h2',
    'ant-typography-h3',
    'ant-typography-h4',
    'ant-typography-title',
  ];

  antdTypographyClasses.forEach((cls) => {
    const elements = $(`.${cls}`);
    if (elements.length > 0) {
      info.levels.push({
        className: cls,
        level: cls
          .replace('ant-typography-', '')
          .replace('ant-typography', 'body'),
      });
    }
  });

  return info;
}

/**
 * Analyze spacing patterns
 */
function analyzeSpacing($: cheerio.CheerioAPI): SpacingInfo {
  const info: SpacingInfo = {
    baseUnit: 8, // Default MUI base unit
    patterns: [],
  };

  // MUI spacing classes often use a base unit of 8px
  const muiBox = $('.MuiBox-root');
  const muiToolbar = $('.MuiToolbar-root');

  // Count common spacing patterns
  const spacingPatterns: Map<string, number> = new Map();

  $('[class*="MuiBox"], [class*="MuiToolbar"]').each((_, el) => {
    const classes = ($(el).attr('class') || '').split(/\s+/);
    classes.forEach((cls) => {
      if (cls.includes('MuiBox') || cls.includes('MuiToolbar')) {
        const count = spacingPatterns.get(cls) || 0;
        spacingPatterns.set(cls, count + 1);
      }
    });
  });

  spacingPatterns.forEach((count, cls) => {
    info.patterns.push({
      class: cls,
      property: 'padding/margin',
      value: `${info.baseUnit}px base unit`,
    });
  });

  return info;
}

/**
 * Generate layout intent document
 */
function generateLayoutIntent(
  grid: GridInfo,
  typography: TypographyInfo,
  spacing: SpacingInfo,
): string {
  const lines: string[] = [
    '# Layout Intent Technical Summary',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Grid System',
    '',
  ];

  if (grid.system === 'unknown') {
    lines.push('No standard grid system detected.');
  } else {
    lines.push(
      `**System**: ${grid.system === 'both' ? 'Ant Design + Material UI' : grid.system === 'ant-design' ? 'Ant Design' : 'Material UI'}`,
    );
    lines.push(`**Columns**: ${grid.columns}`);
    lines.push('');
    lines.push('### Breakpoints');
    grid.breakpoints.forEach((bp) => {
      lines.push(`- ${bp.name}: ${bp.value}`);
    });
    lines.push('');
    lines.push('### Grid Classes Found');
    grid.classesFound.slice(0, 20).forEach((cls) => {
      lines.push(`- \`${cls}\``);
    });
    if (grid.classesFound.length > 20) {
      lines.push(`- ... and ${grid.classesFound.length - 20} more`);
    }
  }

  lines.push('');
  lines.push('## Typography Hierarchy');
  lines.push('');

  if (typography.levels.length === 0) {
    lines.push('No standard typography classes detected.');
  } else {
    lines.push('| Class Name | Level |');
    lines.push('|------------|-------|');
    typography.levels.forEach((level) => {
      lines.push(`| \`${level.className}\` | ${level.level} |`);
    });
  }

  lines.push('');
  lines.push('## Spacing Patterns');
  lines.push('');

  if (spacing.patterns.length === 0) {
    lines.push('No standard spacing patterns detected.');
  } else {
    lines.push(`**Base Unit**: ${spacing.baseUnit}px`);
    lines.push('');
    lines.push('### Spacing Classes');
    spacing.patterns.slice(0, 15).forEach((pattern) => {
      lines.push(`- \`${pattern.class}\`: ${pattern.value}`);
    });
    if (spacing.patterns.length > 15) {
      lines.push(`- ... and ${spacing.patterns.length - 15} more`);
    }
  }

  // Migration guidance
  lines.push('');
  lines.push('## Migration Guidance');
  lines.push('');
  lines.push('### Component Mapping Suggestions');
  lines.push('');

  if (grid.system === 'ant-design' || grid.system === 'both') {
    lines.push('| Source Class | Target Component |');
    lines.push('|--------------|------------------|');
    lines.push('| `ant-row` | `<Row>` or `<div class="flex">` |');
    lines.push('| `ant-col-*` | `<Col span={*}>` or `<div class="w-*/24">` |');
    lines.push('| `ant-btn` | `<Button>` |');
    lines.push('| `ant-input` | `<Input>` |');
    lines.push('| `ant-select` | `<Select>` |');
    lines.push('');
  }

  if (grid.system === 'mui' || grid.system === 'both') {
    lines.push('| Source Class | Target Component |');
    lines.push('|--------------|------------------|');
    lines.push(
      '| `MuiGrid-container` | `<Grid container>` or `<div class="grid">` |',
    );
    lines.push(
      '| `MuiGrid-item` | `<Grid item>` or `<div class="col-span-*">` |',
    );
    lines.push('| `MuiButton-root` | `<Button>` |');
    lines.push('| `MuiTypography-*` | `<Typography variant="*">` |');
    lines.push('| `MuiBox-root` | `<Box>` or `<div>` with Tailwind spacing |');
  }

  return lines.join('\n');
}

/**
 * Main function
 */
function runLayoutAnalysis(options: LayoutAnalysisOptions): void {
  console.log('=== Layout Analysis ===\n');

  // Read input file
  const htmlContent = fs.readFileSync(options.inputFile, 'utf-8');
  const $ = cheerio.load(htmlContent);

  // Detect grid system
  console.log('Detecting grid system...');
  const grid = detectGridSystem($);
  console.log(`  System: ${grid.system}`);
  console.log(`  Columns: ${grid.columns}`);
  console.log(`  Classes found: ${grid.classesFound.length}`);

  // Extract typography
  console.log('\nExtracting typography hierarchy...');
  const typography = extractTypography($);
  console.log(`  Levels found: ${typography.levels.length}`);

  // Analyze spacing
  console.log('\nAnalyzing spacing patterns...');
  const spacing = analyzeSpacing($);
  console.log(`  Base unit: ${spacing.baseUnit}px`);
  console.log(`  Patterns found: ${spacing.patterns.length}`);

  // Ensure output directory exists
  if (!fs.existsSync(options.outputDir)) {
    fs.mkdirSync(options.outputDir, { recursive: true });
  }

  // Generate output
  const outputPath = path.join(options.outputDir, 'layout_intent.md');
  fs.writeFileSync(outputPath, generateLayoutIntent(grid, typography, spacing));

  console.log('\nOutput file:');
  console.log(`  - ${outputPath}`);
}

// Main execution
const options = parseArgs();
runLayoutAnalysis(options);
