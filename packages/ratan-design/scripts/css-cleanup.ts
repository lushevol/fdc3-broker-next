#!/usr/bin/env node
/**
 * CSS Cleanup CLI
 *
 * Remove unused CSS from HTML files by analyzing which selectors match elements in the DOM.
 *
 * Usage:
 *   npm run css-cleanup <input-file> [-o <output-file>]
 *   npx tsx scripts/css-cleanup.ts <input-file> [-o <output-file>]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cleanUnusedCss } from '../src/css-cleanup/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CliOptions {
  input: string;
  output?: string;
  help?: boolean;
  verbose?: boolean;
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    input: '',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-h' || arg === '--help') {
      options.help = true;
    } else if (arg === '-v' || arg === '--verbose') {
      options.verbose = true;
    } else if (arg === '-o' || arg === '--output') {
      options.output = args[++i];
    } else if (!arg.startsWith('-')) {
      options.input = arg;
    }
  }

  return options;
}

function printHelp(): void {
  console.log(`
CSS Cleanup - Remove unused CSS from HTML files

Usage:
  npm run css-cleanup <input-file> [options]
  npx tsx scripts/css-cleanup.ts <input-file> [options]

Arguments:
  <input-file>          Path to the input HTML file

Options:
  -o, --output <file>   Output file path (default: <input>-cleaned.html)
  -v, --verbose         Show detailed processing information
  -h, --help            Show this help message

Examples:
  npm run css-cleanup original-websites/cashflowblotter-light.html
  npm run css-cleanup input.html -o output.html
  npx tsx scripts/css-cleanup.ts index.html -o cleaned.html

This utility analyzes HTML files and removes CSS rules whose selectors
don't match any elements in the DOM, reducing file size significantly.
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help || !options.input) {
    printHelp();
    process.exit(options.help ? 0 : 1);
  }

  const inputPath = path.resolve(options.input);

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const outputPath = options.output
    ? path.resolve(options.output)
    : inputPath.replace(/\.html$/i, '-cleaned.html');

  console.log(`CSS Cleanup Utility`);
  console.log(`===================`);
  console.log(`Input:  ${inputPath}`);
  console.log(`Output: ${outputPath}`);
  console.log('');

  // Read input file
  if (options.verbose) {
    console.log('Reading input file...');
  }
  const startTime = Date.now();
  const html = fs.readFileSync(inputPath, 'utf-8');
  const readTime = Date.now() - startTime;

  if (options.verbose) {
    console.log(`Read ${(html.length / 1024).toFixed(1)} KB in ${readTime}ms`);
  }

  // Process
  console.log('Processing...');
  const processStart = Date.now();
  const result = cleanUnusedCss({ html });
  const processTime = Date.now() - processStart;

  // Write output
  console.log('Writing output file...');
  fs.writeFileSync(outputPath, result.html);

  // Print summary
  console.log('');
  console.log('=== Results ===');
  console.log(
    `Original size:  ${(result.stats.originalSize / 1024).toFixed(1)} KB`,
  );
  console.log(`New size:       ${(result.stats.newSize / 1024).toFixed(1)} KB`);
  console.log(
    `Reduction:      ${((1 - result.stats.newSize / result.stats.originalSize) * 100).toFixed(1)}%`,
  );
  console.log('');
  console.log(`Original rules: ${result.stats.originalRules}`);
  console.log(`Kept rules:     ${result.stats.keptRules}`);
  console.log(`Removed rules:  ${result.stats.removedRules}`);
  console.log('');
  console.log(`Processing time: ${processTime}ms`);
  console.log('');
  console.log(`Output written to: ${outputPath}`);
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
