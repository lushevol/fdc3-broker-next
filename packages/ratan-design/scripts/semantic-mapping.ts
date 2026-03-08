#!/usr/bin/env node
/**
 * Semantic Mapping Script
 *
 * Analyzes cleaned HTML to identify repeated DOM patterns and generate:
 * - Component manifest with identified components
 * - Structural map with simplified HTML/XML
 *
 * Usage:
 *   npx tsx scripts/semantic-mapping.ts <input-file> [options]
 *
 * Options:
 *   --output-dir <dir>  Output directory (default: ./sanitization-output)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

interface ComponentPattern {
  name: string;
  role: string;
  selector: string;
  count: number;
  example: string;
  classes: string[];
}

interface SemanticMappingOptions {
  inputFile: string;
  outputDir: string;
}

interface MappingResult {
  components: ComponentPattern[];
  sections: { name: string; selector: string; content: string }[];
}

/**
 * Parse command line arguments
 */
function parseArgs(): SemanticMappingOptions {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0].startsWith('--')) {
    console.error(
      'Usage: npx tsx scripts/semantic-mapping.ts <input-file> [options]',
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
 * Extract sections from the HTML (header, sidebar, main content)
 */
function extractSections($: cheerio.CheerioAPI): MappingResult['sections'] {
  const sections: MappingResult['sections'] = [];

  // Try to identify header
  const headerSelectors = [
    'header',
    '[class*="header"]',
    '[class*="Header"]',
    '[class*="appBar"]',
    '[class*="AppBar"]',
    '.MuiAppBar-root',
  ];

  for (const selector of headerSelectors) {
    const $header = $(selector).first();
    if ($header.length && $header.html()) {
      sections.push({
        name: 'Header',
        selector,
        content: $header.html() || '',
      });
      break;
    }
  }

  // Try to identify sidebar/navigation
  const sidebarSelectors = [
    'aside',
    '[class*="sidebar"]',
    '[class*="Sidebar"]',
    '[class*="nav"]',
    '[class*="Nav"]',
    '.MuiDrawer-root',
  ];

  for (const selector of sidebarSelectors) {
    const $sidebar = $(selector).first();
    if ($sidebar.length && $sidebar.html()) {
      sections.push({
        name: 'Sidebar',
        selector,
        content: $sidebar.html() || '',
      });
      break;
    }
  }

  // Try to identify main content
  const mainSelectors = [
    'main',
    '[class*="main"]',
    '[class*="Main"]',
    '[class*="content"]',
    '[class*="Content"]',
    '.MicroWebUI_Base_home-main',
    '.ag-root-wrapper',
  ];

  for (const selector of mainSelectors) {
    const $main = $(selector).first();
    if ($main.length && $main.html()) {
      sections.push({
        name: 'MainContent',
        selector,
        content: $main.html() || '',
      });
      break;
    }
  }

  return sections;
}

/**
 * Identify repeated DOM patterns
 */
function identifyPatterns($: cheerio.CheerioAPI): ComponentPattern[] {
  const patterns: ComponentPattern[] = [];

  // 1. Table row patterns (AG Grid)
  const tableRows = $('.ag-row');
  if (tableRows.length > 0) {
    const firstRow = tableRows.first();
    patterns.push({
      name: 'GridRow',
      role: 'Data grid row in AG Grid table',
      selector: '.ag-row',
      count: tableRows.length,
      example: firstRow.attr('class') || '',
      classes: extractClasses(firstRow),
    });
  }

  // 2. Header cell patterns
  const headerCells = $('.ag-header-cell');
  if (headerCells.length > 0) {
    const firstCell = headerCells.first();
    patterns.push({
      name: 'GridHeaderCell',
      role: 'Header cell in AG Grid table',
      selector: '.ag-header-cell',
      count: headerCells.length,
      example: firstCell.attr('class') || '',
      classes: extractClasses(firstCell),
    });
  }

  // 3. Button patterns (AntD + MUI)
  const antdButtons = $('.ant-btn');
  if (antdButtons.length > 0) {
    patterns.push({
      name: 'AntdButton',
      role: 'Ant Design button component',
      selector: '.ant-btn',
      count: antdButtons.length,
      example: antdButtons.first().attr('class') || '',
      classes: ['ant-btn', 'ant-btn-default', 'ant-btn-icon'],
    });
  }

  const muiButtons = $('.MuiButton-root');
  if (muiButtons.length > 0) {
    patterns.push({
      name: 'MuiButton',
      role: 'Material UI button component',
      selector: '.MuiButton-root',
      count: muiButtons.length,
      example: muiButtons.first().attr('class') || '',
      classes: ['MuiButton-root', 'MuiButton-contained', 'MuiButton-outlined'],
    });
  }

  // 4. Input patterns
  const antdInputs = $('.ant-input, .ant-select');
  if (antdInputs.length > 0) {
    patterns.push({
      name: 'AntdInput',
      role: 'Ant Design input/select component',
      selector: '.ant-input, .ant-select',
      count: antdInputs.length,
      example: antdInputs.first().attr('class') || '',
      classes: ['ant-input', 'ant-select', 'ant-input-affix-wrapper'],
    });
  }

  const muiInputs = $('.MuiInputBase-root');
  if (muiInputs.length > 0) {
    patterns.push({
      name: 'MuiInput',
      role: 'Material UI input component',
      selector: '.MuiInputBase-root',
      count: muiInputs.length,
      example: muiInputs.first().attr('class') || '',
      classes: ['MuiInputBase-root', 'MuiInput-root', 'MuiOutlinedInput-root'],
    });
  }

  // 5. Tab patterns
  const muiTabs = $('.MuiTab-root');
  if (muiTabs.length > 0) {
    patterns.push({
      name: 'MuiTab',
      role: 'Material UI tab component',
      selector: '.MuiTab-root',
      count: muiTabs.length,
      example: muiTabs.first().attr('class') || '',
      classes: ['MuiTab-root', 'MuiTab-textColorPrimary'],
    });
  }

  // 6. Card/Paper patterns
  const muiPaper = $('.MuiPaper-root');
  if (muiPaper.length > 0) {
    patterns.push({
      name: 'MuiPaper',
      role: 'Material UI paper/card container',
      selector: '.MuiPaper-root',
      count: muiPaper.length,
      example: muiPaper.first().attr('class') || '',
      classes: ['MuiPaper-root', 'MuiPaper-elevation4', 'MuiPaper-rounded'],
    });
  }

  // 7. Toolbar patterns
  const toolbars = $('.MuiToolbar-root');
  if (toolbars.length > 0) {
    patterns.push({
      name: 'MuiToolbar',
      role: 'Material UI toolbar component',
      selector: '.MuiToolbar-root',
      count: toolbars.length,
      example: toolbars.first().attr('class') || '',
      classes: ['MuiToolbar-root', 'MuiToolbar-gutters', 'MuiToolbar-dense'],
    });
  }

  // 8. Custom app patterns
  const microWebUIComponents = $('[class*="MicroWebUI"]');
  const uniqueMicroWebUI = new Set<string>();
  microWebUIComponents.each((_, el) => {
    const classes = ($(el).attr('class') || '').split(/\s+/);
    classes.forEach((cls) => {
      if (cls.startsWith('MicroWebUI_')) {
        const baseName = cls.split('-')[0];
        uniqueMicroWebUI.add(baseName);
      }
    });
  });

  uniqueMicroWebUI.forEach((componentName) => {
    const selector = `[class^="${componentName}"]`;
    const elements = $(selector);
    if (elements.length > 0) {
      patterns.push({
        name: componentName.replace('MicroWebUI_', ''),
        role: `Custom application component: ${componentName}`,
        selector,
        count: elements.length,
        example: elements.first().attr('class') || '',
        classes: [componentName],
      });
    }
  });

  return patterns;
}

/**
 * Extract classes from an element
 */
function extractClasses($el: cheerio.Cheerio<any>): string[] {
  const classAttr = $el.attr('class') || '';
  return classAttr.split(/\s+/).filter((c) => c.length > 0);
}

/**
 * Generate component manifest markdown
 */
function generateComponentManifest(
  patterns: ComponentPattern[],
  sections: MappingResult['sections'],
): string {
  const lines: string[] = [
    '# Component Manifest',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Summary',
    `- Total component patterns identified: ${patterns.length}`,
    `- Sections found: ${sections.map((s) => s.name).join(', ') || 'None'}`,
    '',
    '## Sections',
    ...sections.map((s) => `- **${s.name}**: \`${s.selector}\``),
    '',
    '## Components',
    '',
  ];

  patterns.forEach((pattern, index) => {
    lines.push(`### ${index + 1}. ${pattern.name}`);
    lines.push(`**Role**: ${pattern.role}`);
    lines.push(`**Selector**: \`${pattern.selector}\``);
    lines.push(`**Occurrences**: ${pattern.count}`);
    lines.push(
      `**Classes**: ${pattern.classes.slice(0, 5).join(', ')}${pattern.classes.length > 5 ? '...' : ''}`,
    );
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Generate simplified structural map
 */
function generateStructuralMap(
  $: cheerio.CheerioAPI,
  patterns: ComponentPattern[],
): string {
  const lines: string[] = [
    '<!-- Structural Map - Simplified HTML/XML representation -->',
    '<!-- Generated by semantic-mapping.ts -->',
    '',
  ];

  // Get body content
  const $body = $('body');

  // Create a simplified representation
  function simplifyElement(
    $el: cheerio.Cheerio<any>,
    depth: number = 0,
  ): string[] {
    const indent = '  '.repeat(depth);
    const result: string[] = [];

    const tagName = $el.get(0)?.tagName?.toLowerCase() || 'div';
    const classes = ($el.attr('class') || '')
      .split(/\s+/)
      .filter((c) => c.length > 0);

    // Skip certain elements
    if (['script', 'noscript', 'style', 'link', 'meta'].includes(tagName)) {
      return result;
    }

    // Check if this matches a known pattern
    const matchingPattern = patterns.find((p) => $el.is(p.selector));

    if (matchingPattern) {
      // Use component tag
      result.push(
        `${indent}<Component-${matchingPattern.name} classes="${classes.slice(0, 3).join(' ')}">`,
      );
      result.push(
        `${indent}  <!-- ${matchingPattern.count} instances found -->`,
      );
      result.push(`${indent}</Component-${matchingPattern.name}>`);
    } else if ($el.children().length === 0) {
      // Leaf node
      const text = $el.text().trim().slice(0, 50);
      if (text) {
        result.push(
          `${indent}<${tagName} class="${classes.slice(0, 2).join(' ')}">${text}...</${tagName}>`,
        );
      }
    } else {
      // Has children - recurse (limit depth)
      if (depth < 4) {
        result.push(
          `${indent}<${tagName} class="${classes.slice(0, 2).join(' ')}">`,
        );
        $el.children().each((_, child) => {
          result.push(...simplifyElement($(child), depth + 1));
        });
        result.push(`${indent}</${tagName}>`);
      }
    }

    return result;
  }

  // Process body children
  $body.children().each((_, child) => {
    lines.push(...simplifyElement($(child), 0));
  });

  return lines.join('\n');
}

/**
 * Main function
 */
function runSemanticMapping(options: SemanticMappingOptions): void {
  console.log('=== Semantic Mapping Analysis ===\n');

  // Read input file
  const htmlContent = fs.readFileSync(options.inputFile, 'utf-8');
  const $ = cheerio.load(htmlContent);

  // Extract sections
  console.log('Extracting sections...');
  const sections = extractSections($);
  console.log(
    `Found ${sections.length} sections: ${sections.map((s) => s.name).join(', ')}`,
  );

  // Identify patterns
  console.log('\nIdentifying component patterns...');
  const patterns = identifyPatterns($);
  console.log(`Found ${patterns.length} component patterns\n`);

  patterns.forEach((p) => {
    console.log(`  - ${p.name}: ${p.count} occurrences`);
  });

  // Ensure output directory exists
  if (!fs.existsSync(options.outputDir)) {
    fs.mkdirSync(options.outputDir, { recursive: true });
  }

  // Generate outputs
  const manifestPath = path.join(options.outputDir, 'component_manifest.md');
  const structuralMapPath = path.join(options.outputDir, 'structural_map.html');

  fs.writeFileSync(manifestPath, generateComponentManifest(patterns, sections));
  fs.writeFileSync(structuralMapPath, generateStructuralMap($, patterns));

  console.log('\nOutput files:');
  console.log(`  - ${manifestPath}`);
  console.log(`  - ${structuralMapPath}`);
}

// Main execution
const options = parseArgs();
runSemanticMapping(options);
