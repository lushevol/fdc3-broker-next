#!/usr/bin/env node
/**
 * HTML Sanitization Script
 *
 * Reduces large HTML files by 60-80% by:
 * - Removing <script>, <noscript>, and <iframe> tags
 * - Replacing SVG trees with placeholder elements
 * - Replacing Base64 image sources with placeholders
 * - Removing inline style attributes while preserving classes
 * - Stripping HTML comments
 * - Extracting and categorizing CSS classes
 *
 * Usage:
 *   npx tsx scripts/sanitize-html.ts <input-file> [options]
 *
 * Options:
 *   --output-dir <dir>  Output directory (default: ./sanitization-output)
 *   --no-stats          Skip statistics output
 */

import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

interface SanitizationStats {
  originalSize: number;
  finalSize: number;
  reductionPercent: number;
  scriptsRemoved: number;
  noscriptsRemoved: number;
  iframesRemoved: number;
  svgsReplaced: number;
  base64ImagesReplaced: number;
  stylesRemoved: number;
  commentsRemoved: number;
  classesExtracted: {
    antd: string[];
    mui: string[];
    custom: string[];
  };
}

interface SanitizationOptions {
  inputFile: string;
  outputDir: string;
  showStats: boolean;
}

/**
 * Parse command line arguments
 */
function parseArgs(): SanitizationOptions {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0].startsWith('--')) {
    console.error(
      'Usage: npx tsx scripts/sanitize-html.ts <input-file> [options]',
    );
    console.error('Options:');
    console.error(
      '  --output-dir <dir>  Output directory (default: ./sanitization-output)',
    );
    console.error('  --no-stats          Skip statistics output');
    process.exit(1);
  }

  const inputFile = args[0];
  let outputDir = './sanitization-output';
  let showStats = true;

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--output-dir' && i + 1 < args.length) {
      outputDir = args[i + 1];
      i++;
    } else if (args[i] === '--no-stats') {
      showStats = false;
    }
  }

  return { inputFile, outputDir, showStats };
}

/**
 * Check if a src attribute contains Base64 data
 */
function isBase64Image(src: string | undefined): boolean {
  if (!src) return false;
  return src.startsWith('data:image/');
}

/**
 * Categorize CSS class names by framework
 */
function categorizeClasses(classes: Set<string>): {
  antd: string[];
  mui: string[];
  custom: string[];
} {
  const antd: string[] = [];
  const mui: string[] = [];
  const custom: string[] = [];

  classes.forEach((cls) => {
    if (cls.startsWith('ant-')) {
      antd.push(cls);
    } else if (cls.startsWith('Mui') || cls.startsWith('mui-')) {
      mui.push(cls);
    } else if (cls.trim()) {
      custom.push(cls);
    }
  });

  // Sort for consistent output
  return {
    antd: antd.sort(),
    mui: mui.sort(),
    custom: custom.sort(),
  };
}

/**
 * Main sanitization function
 */
function sanitizeHtml(inputFile: string, outputDir: string): SanitizationStats {
  // Read input file
  const htmlContent = fs.readFileSync(inputFile, 'utf-8');
  const originalSize = Buffer.byteLength(htmlContent, 'utf-8');

  // Initialize stats
  const stats: SanitizationStats = {
    originalSize,
    finalSize: 0,
    reductionPercent: 0,
    scriptsRemoved: 0,
    noscriptsRemoved: 0,
    iframesRemoved: 0,
    svgsReplaced: 0,
    base64ImagesReplaced: 0,
    stylesRemoved: 0,
    commentsRemoved: 0,
    classesExtracted: { antd: [], mui: [], custom: [] },
  };

  // Load HTML with Cheerio
  const $ = cheerio.load(htmlContent, {
    xmlMode: false,
    decodeEntities: false,
  });

  // Collect all CSS classes before modifications
  const allClasses = new Set<string>();
  $('[class]').each((_, el) => {
    const classAttr = $(el).attr('class');
    if (classAttr) {
      classAttr.split(/\s+/).forEach((cls) => allClasses.add(cls));
    }
  });

  // Categorize classes
  stats.classesExtracted = categorizeClasses(allClasses);

  // 1. Remove <script> tags
  stats.scriptsRemoved = $('script').length;
  $('script').remove();

  // 2. Remove <noscript> tags
  stats.noscriptsRemoved = $('noscript').length;
  $('noscript').remove();

  // 3. Remove <iframe> tags
  stats.iframesRemoved = $('iframe').length;
  $('iframe').remove();

  // 4. Replace SVG elements with placeholders
  stats.svgsReplaced = $('svg').length;
  $('svg').each((_, el) => {
    $(el).replaceWith('<i data-icon-placeholder="true"></i>');
  });

  // 5. Replace Base64 image sources
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    if (isBase64Image(src)) {
      $(el).attr('src', 'BASE64_DATA');
      stats.base64ImagesReplaced++;
    }
  });

  // 6. Remove inline style attributes, but preserve AG Grid positioning styles
  $('[style]').each((_, el) => {
    const $el = $(el);
    const classes = $el.attr('class') || '';
    const style = $el.attr('style') || '';

    // Check if this is an AG Grid element that needs positioning preserved
    const isAgGridElement =
      classes.includes('ag-row') || classes.includes('ag-cell');

    if (isAgGridElement) {
      // Preserve only positioning styles for AG Grid elements
      const preservedStyles: string[] = [];
      const styleParts = style
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s);

      styleParts.forEach((part) => {
        const [prop, value] = part.split(':').map((s) => s.trim());
        // Preserve positioning-related styles
        if (['top', 'left', 'width', 'height', 'transform'].includes(prop)) {
          preservedStyles.push(`${prop}: ${value}`);
        }
      });

      if (preservedStyles.length > 0) {
        $el.attr('style', preservedStyles.join('; '));
      } else {
        $el.removeAttr('style');
      }
    } else {
      // Remove all inline styles for non-AG Grid elements
      $el.removeAttr('style');
    }
    stats.stylesRemoved++;
  });

  // 7. Strip HTML comments
  // Cheerio doesn't preserve comments by default, but let's ensure they're gone
  // by re-parsing and serializing

  // Get the modified HTML
  let cleanedHtml = $.html();

  // Remove any remaining HTML comments
  const commentRegex = /<!--[\s\S]*?-->/g;
  const comments = cleanedHtml.match(commentRegex);
  if (comments) {
    stats.commentsRemoved = comments.length;
  }
  cleanedHtml = cleanedHtml.replace(commentRegex, '');

  // Calculate final stats
  stats.finalSize = Buffer.byteLength(cleanedHtml, 'utf-8');
  stats.reductionPercent =
    ((originalSize - stats.finalSize) / originalSize) * 100;

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write cleaned HTML
  const inputBasename = path.basename(inputFile, path.extname(inputFile));
  const outputPath = path.join(outputDir, `${inputBasename}-cleaned.html`);
  fs.writeFileSync(outputPath, cleanedHtml);

  // Write styles audit
  const auditPath = path.join(outputDir, 'styles_audit.txt');
  const auditContent = generateStylesAudit(stats.classesExtracted);
  fs.writeFileSync(auditPath, auditContent);

  // Write stats JSON
  const statsPath = path.join(outputDir, 'sanitization-stats.json');
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

  return stats;
}

/**
 * Generate the styles audit text file
 */
function generateStylesAudit(classes: {
  antd: string[];
  mui: string[];
  custom: string[];
}): string {
  const lines: string[] = [
    '# CSS Classes Audit',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Summary',
    `- AntD classes: ${classes.antd.length}`,
    `- MUI classes: ${classes.mui.length}`,
    `- Custom classes: ${classes.custom.length}`,
    `- Total unique classes: ${classes.antd.length + classes.mui.length + classes.custom.length}`,
    '',
    '## AntD Classes (ant-*)',
    ...classes.antd.map((c) => `  ${c}`),
    '',
    '## MUI Classes (Mui*, mui-*)',
    ...classes.mui.map((c) => `  ${c}`),
    '',
    '## Custom Classes',
    ...classes.custom.slice(0, 500).map((c) => `  ${c}`), // Limit custom classes output
  ];

  if (classes.custom.length > 500) {
    lines.push(`  ... and ${classes.custom.length - 500} more custom classes`);
  }

  return lines.join('\n');
}

/**
 * Print stats to console
 */
function printStats(stats: SanitizationStats): void {
  console.log('\n=== Sanitization Results ===\n');
  console.log(
    `Original size:    ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`,
  );
  console.log(
    `Final size:       ${(stats.finalSize / 1024 / 1024).toFixed(2)} MB`,
  );
  console.log(`Reduction:        ${stats.reductionPercent.toFixed(1)}%`);
  console.log('\n--- Elements Processed ---');
  console.log(`Scripts removed:     ${stats.scriptsRemoved}`);
  console.log(`Noscripts removed:   ${stats.noscriptsRemoved}`);
  console.log(`Iframes removed:     ${stats.iframesRemoved}`);
  console.log(`SVGs replaced:       ${stats.svgsReplaced}`);
  console.log(`Base64 images:       ${stats.base64ImagesReplaced}`);
  console.log(`Style attributes:    ${stats.stylesRemoved}`);
  console.log(`Comments removed:    ${stats.commentsRemoved}`);
  console.log('\n--- CSS Classes Found ---');
  console.log(`AntD classes:    ${stats.classesExtracted.antd.length}`);
  console.log(`MUI classes:     ${stats.classesExtracted.mui.length}`);
  console.log(`Custom classes:  ${stats.classesExtracted.custom.length}`);
  console.log('\nOutput files:');
  console.log('  - sanitization-output/*-cleaned.html');
  console.log('  - sanitization-output/styles_audit.txt');
  console.log('  - sanitization-output/sanitization-stats.json');
  console.log('');
}

// Main execution
const options = parseArgs();
const stats = sanitizeHtml(options.inputFile, options.outputDir);

if (options.showStats) {
  printStats(stats);
}
