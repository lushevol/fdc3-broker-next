#!/usr/bin/env node

/**
 * CSS Extraction Tool
 *
 * Extracts CSS from HTML <style> blocks into categorized CSS files.
 *
 * Usage: node extract-css.mjs <input.html> <output-dir>
 *
 * Example:
 *   node extract-css.mjs ../original-websites/cashflowblotter-light.html ../extracted/cashflowblotter-light
 *
 * CSS Categories:
 *   - tokens.css    : CSS variables (:root), @keyframes, @charset, base resets
 *   - fonts.css     : @font-face definitions
 *   - antd.css      : Ant Design styles (.ant-*, :where(.css-*))
 *   - mui.css       : MUI styles (.Mui*)
 *   - components.css: Custom MicroWebUI styles (.MicroWebUI_*)
 *   - utilities.css : Uncategorized rules
 */

import fs from 'fs';
import path from 'path';

// ============================================================================
// CLI and Configuration
// ============================================================================

const CSS_LAYER_ORDER = ['tokens', 'fonts', 'antd', 'mui', 'components', 'utilities'];

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node extract-css.mjs <input.html> <output-dir>');
  console.error('');
  console.error('Arguments:');
  console.error('  input.html   Path to the HTML file to process');
  console.error('  output-dir   Directory to write extracted files');
  process.exit(1);
}

const inputPath = path.resolve(args[0]);
const outputDir = path.resolve(args[1]);

// ============================================================================
// File Validation
// ============================================================================

if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input file not found: ${inputPath}`);
  process.exit(1);
}

if (!fs.statSync(inputPath).isFile()) {
  console.error(`Error: Input path is not a file: ${inputPath}`);
  process.exit(1);
}

// ============================================================================
// CSS Extraction
// ============================================================================

console.log('CSS Extraction Tool');
console.log('='.repeat(50));
console.log(`Input:  ${inputPath}`);
console.log(`Output: ${outputDir}`);
console.log('');

// Read HTML file
const html = fs.readFileSync(inputPath, 'utf-8');
const originalSize = Buffer.byteLength(html, 'utf-8');

// Statistics tracking
const stats = {
  styleBlocks: 0,
  totalRules: 0,
  duplicatesRemoved: 0,
  categories: {},
  uncategorizedSelectors: new Set(),
};

// Initialize category collections
const cssByCategory = {};
for (const category of CSS_LAYER_ORDER) {
  cssByCategory[category] = [];
  stats.categories[category] = 0;
}

// ============================================================================
// Phase 1: Extract <style> blocks
// ============================================================================

console.log('Phase 1: Extracting <style> blocks...');

// Regex to match <style type="text/css"> or just <style> blocks
const styleBlockRegex = /<style[^>]*type=["']text\/css["'][^>]*>([\s\S]*?)<\/style>/gi;
// Also match <style> without type attribute
const styleBlockRegex2 = /<style[^>]*>([\s\S]*?)<\/style>/gi;

const styleBlocks = [];
let match;

// Extract with type="text/css"
while ((match = styleBlockRegex.exec(html)) !== null) {
  styleBlocks.push(match[1]);
}

// Reset regex and extract remaining <style> blocks (without type or with style="" attribute quirk)
styleBlockRegex2.lastIndex = 0;
const allStyleBlocks = new Set(styleBlocks);
while ((match = styleBlockRegex2.exec(html)) !== null) {
  // Skip if already captured
  if (!allStyleBlocks.has(match[1])) {
    styleBlocks.push(match[1]);
    allStyleBlocks.add(match[1]);
  }
}

stats.styleBlocks = styleBlocks.length;
console.log(`  Found ${stats.styleBlocks} <style> blocks`);

// ============================================================================
// Phase 2: Parse and Categorize CSS Rules
// ============================================================================

console.log('Phase 2: Parsing and categorizing CSS rules...');

/**
 * Simple CSS rule parser that preserves media queries and at-rules
 */
function parseCssRules(cssContent) {
  const rules = [];
  let currentPos = 0;
  const content = cssContent.trim();

  while (currentPos < content.length) {
    // Skip whitespace
    while (currentPos < content.length && /\s/.test(content[currentPos])) {
      currentPos++;
    }

    if (currentPos >= content.length) break;

    // Check for at-rules (@media, @keyframes, @font-face, etc.)
    if (content[currentPos] === '@') {
      const atRuleStart = currentPos;
      let braceDepth = 0;
      let foundBrace = false;

      // Find the at-rule name
      const atNameMatch = content.slice(currentPos).match(/^@([a-z-]+)/i);
      const atName = atNameMatch ? atNameMatch[1].toLowerCase() : '';

      // For at-rules with braces, track depth
      while (currentPos < content.length) {
        const char = content[currentPos];
        if (char === '{') {
          braceDepth++;
          foundBrace = true;
        } else if (char === '}') {
          braceDepth--;
          if (foundBrace && braceDepth === 0) {
            currentPos++;
            break;
          }
        }
        currentPos++;
      }

      const ruleContent = content.slice(atRuleStart, currentPos).trim();
      if (ruleContent) {
        rules.push({ type: 'at-rule', content: ruleContent, atName });
      }
      continue;
    }

    // Regular rule (selector { declarations })
    const ruleStart = currentPos;
    let braceDepth = 0;
    let inSelector = true;
    let selector = '';

    while (currentPos < content.length) {
      const char = content[currentPos];

      if (char === '{') {
        braceDepth++;
        inSelector = false;
      } else if (char === '}') {
        braceDepth--;
        if (braceDepth === 0) {
          currentPos++;
          break;
        }
      } else if (inSelector) {
        selector += char;
      }

      currentPos++;
    }

    const ruleContent = content.slice(ruleStart, currentPos).trim();
    if (ruleContent && ruleContent.includes('{')) {
      rules.push({ type: 'rule', content: ruleContent, selector: selector.trim() });
    }
  }

  return rules;
}

/**
 * Categorize a CSS rule
 */
function categorizeRule(rule) {
  const content = rule.content;

  // Font definitions
  if (rule.type === 'at-rule' && rule.atName === 'font-face') {
    return 'fonts';
  }

  // Tokens: @keyframes, @charset, :root with CSS variables
  if (rule.type === 'at-rule') {
    if (['keyframes', '-webkit-keyframes', '-moz-keyframes', '-o-keyframes'].includes(rule.atName)) {
      return 'tokens';
    }
    if (rule.atName === 'charset') {
      return 'tokens';
    }
  }

  // Check selector for patterns
  const selector = rule.selector || '';
  const fullContent = content.toLowerCase();

  // Check for :root (CSS variables)
  if (selector.includes(':root') || fullContent.includes('--')) {
    // If it's defining CSS variables in :root, it's a token
    if (selector.startsWith(':root') || /^:root\s*\{/.test(fullContent)) {
      return 'tokens';
    }
  }

  // Ant Design patterns
  if (/\.ant-/i.test(selector) || /:where\(\.css-/i.test(selector) || /\[class\^='ant-/i.test(selector) || /\[class\*=' ant-/i.test(selector)) {
    return 'antd';
  }

  // MUI patterns
  if (/\.Mui[A-Z]/.test(selector) || /\.Mui-/i.test(selector)) {
    return 'mui';
  }

  // Custom MicroWebUI patterns
  if (/\.MicroWebUI_/i.test(selector)) {
    return 'components';
  }

  // Check content for uncategorized patterns
  // Animation definitions (keyframes are at-rules, but animation properties might be in rules)
  if (/@keyframes/i.test(content)) {
    return 'tokens';
  }

  // If we reach here, it's a utility
  return 'utilities';
}

// Track rules for deduplication
const seenRules = new Set();

/**
 * Generate a hash for deduplication (simple but effective)
 */
function ruleHash(rule) {
  // Normalize whitespace and create a simple hash
  const normalized = rule.content
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};:,])\s*/g, '$1')
    .trim();
  return normalized;
}

// Process all style blocks
for (const block of styleBlocks) {
  const rules = parseCssRules(block);

  for (const rule of rules) {
    stats.totalRules++;

    // Deduplication
    const hash = ruleHash(rule);
    if (seenRules.has(hash)) {
      stats.duplicatesRemoved++;
      continue;
    }
    seenRules.add(hash);

    // Categorize
    const category = categorizeRule(rule);
    cssByCategory[category].push(rule.content);
    stats.categories[category]++;

    // Track uncategorized selectors
    if (category === 'utilities' && rule.selector) {
      // Extract first selector for logging
      const firstSelector = rule.selector.split(',')[0].trim().split(/\s+/)[0];
      if (firstSelector && !firstSelector.startsWith('.')) {
        stats.uncategorizedSelectors.add(firstSelector);
      }
    }
  }
}

console.log(`  Total rules parsed: ${stats.totalRules}`);
console.log(`  Duplicates removed: ${stats.duplicatesRemoved}`);
console.log(`  Unique rules: ${stats.totalRules - stats.duplicatesRemoved}`);
console.log('');

// ============================================================================
// Phase 3: Write Output Files
// ============================================================================

console.log('Phase 3: Writing output files...');

// Create output directory
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(path.join(outputDir, 'css'), { recursive: true });

// Write CSS files
const writtenFiles = [];

for (const category of CSS_LAYER_ORDER) {
  const rules = cssByCategory[category];

  if (rules.length === 0) {
    console.log(`  Skipping ${category}.css (no rules)`);
    continue;
  }

  const filePath = path.join(outputDir, 'css', `${category}.css`);
  const content = rules.join('\n\n');
  fs.writeFileSync(filePath, content, 'utf-8');

  const fileSize = Buffer.byteLength(content, 'utf-8');
  writtenFiles.push({ name: `${category}.css`, rules: rules.length, size: fileSize });
  console.log(`  Wrote ${category}.css (${rules.length} rules, ${formatBytes(fileSize)})`);
}

// ============================================================================
// Phase 4: Generate Clean HTML
// ============================================================================

console.log('');
console.log('Phase 4: Generating clean HTML...');

// Remove all <style> blocks
let cleanHtml = html;

// Remove <style type="text/css"> blocks
cleanHtml = cleanHtml.replace(/<style[^>]*type=["']text\/css["'][^>]*>[\s\S]*?<\/style>/gi, '');

// Remove remaining <style> blocks (including those with style="" quirks from the original)
cleanHtml = cleanHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

// Generate link tags
const linkTags = writtenFiles
  .map(f => `  <link rel="stylesheet" href="css/${f.name}">`)
  .join('\n');

// Insert link tags after <head> tag, before any existing content
const headMatch = cleanHtml.match(/<head[^>]*>/i);
if (headMatch) {
  const insertPos = cleanHtml.indexOf(headMatch[0]) + headMatch[0].length;
  cleanHtml = cleanHtml.slice(0, insertPos) + '\n' + linkTags + '\n' + cleanHtml.slice(insertPos);
}

// Write index.html
const indexHtmlPath = path.join(outputDir, 'index.html');
fs.writeFileSync(indexHtmlPath, cleanHtml, 'utf-8');
const cleanHtmlSize = Buffer.byteLength(cleanHtml, 'utf-8');
console.log(`  Wrote index.html (${formatBytes(cleanHtmlSize)})`);

// ============================================================================
// Phase 5: Summary
// ============================================================================

console.log('');
console.log('='.repeat(50));
console.log('Extraction Complete!');
console.log('='.repeat(50));
console.log('');
console.log('Statistics:');
console.log(`  Style blocks processed: ${stats.styleBlocks}`);
console.log(`  Total CSS rules: ${stats.totalRules}`);
console.log(`  Duplicates removed: ${stats.duplicatesRemoved}`);
console.log(`  Unique rules extracted: ${stats.totalRules - stats.duplicatesRemoved}`);
console.log('');
console.log('Rules by category:');
for (const category of CSS_LAYER_ORDER) {
  console.log(`  ${category.padEnd(12)} ${stats.categories[category].toString().padStart(6)} rules`);
}
console.log('');
console.log('Output files:');
const totalCssSize = writtenFiles.reduce((sum, f) => sum + f.size, 0);
for (const f of writtenFiles) {
  console.log(`  css/${f.name.padEnd(16)} ${formatBytes(f.size).padStart(10)}`);
}
console.log(`  ${'index.html'.padEnd(20)} ${formatBytes(cleanHtmlSize).padStart(10)}`);
console.log('');
console.log('Size comparison:');
console.log(`  Original HTML:  ${formatBytes(originalSize)}`);
console.log(`  Extracted HTML: ${formatBytes(cleanHtmlSize)}`);
console.log(`  Total CSS:      ${formatBytes(totalCssSize)}`);
console.log(`  Total output:   ${formatBytes(cleanHtmlSize + totalCssSize)}`);

if (stats.uncategorizedSelectors.size > 0) {
  console.log('');
  console.log(`Uncategorized selectors (${stats.uncategorizedSelectors.size}):`);
  const selectors = Array.from(stats.uncategorizedSelectors).slice(0, 10);
  for (const s of selectors) {
    console.log(`  - ${s}`);
  }
  if (stats.uncategorizedSelectors.size > 10) {
    console.log(`  ... and ${stats.uncategorizedSelectors.size - 10} more`);
  }
}

console.log('');
console.log(`Output directory: ${outputDir}`);

// ============================================================================
// Utility Functions
// ============================================================================

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}