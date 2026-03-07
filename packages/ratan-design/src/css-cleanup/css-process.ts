import * as csstree from 'css-tree';
import * as cheerio from 'cheerio';
import type { DomSignature, CleanupStats } from './types.js';
import { anySelectorMatches } from './selector-match.js';

interface ProcessResult {
  html: string;
  stats: CleanupStats;
}

/**
 * Processes all style tags in HTML, removing unused CSS rules.
 *
 * @param html - The HTML string to process
 * @param signature - The DOM signature to match selectors against
 * @returns Processed HTML with statistics
 */
export function processStyleTags(
  html: string,
  signature: DomSignature,
): ProcessResult {
  const $ = cheerio.load(html, { decodeEntities: false });

  let totalOriginalRules = 0;
  let totalKeptRules = 0;

  $('style').each((_, element) => {
    const styleContent = $(element).html() || '';
    const {
      css: cleanedCss,
      originalRules,
      keptRules,
    } = processCss(styleContent, signature);

    totalOriginalRules += originalRules;
    totalKeptRules += keptRules;

    // Update style tag content
    $(element).html(cleanedCss);
  });

  return {
    html: $.html(),
    stats: {
      originalRules: totalOriginalRules,
      keptRules: totalKeptRules,
      removedRules: totalOriginalRules - totalKeptRules,
      originalSize: 0, // Will be filled by caller
      newSize: 0, // Will be filled by caller
    },
  };
}

interface CssProcessResult {
  css: string;
  originalRules: number;
  keptRules: number;
}

/**
 * Processes CSS content, removing unused rules.
 *
 * @param css - The CSS string to process
 * @param signature - The DOM signature to match against
 * @returns Cleaned CSS with statistics
 */
export function processCss(
  css: string,
  signature: DomSignature,
): CssProcessResult {
  if (!css || css.trim() === '') {
    return { css: '', originalRules: 0, keptRules: 0 };
  }

  try {
    const ast = csstree.parse(css, {
      parseAtrulePrelude: false,
      parseRulePrelude: true,
      parseValue: false,
    });

    let originalRules = 0;
    let keptRules = 0;

    // Process the stylesheet children
    if (ast.type === 'StyleSheet' && ast.children) {
      const newChildren: csstree.CssNode[] = [];

      ast.children.forEach((node) => {
        if (node.type === 'Rule') {
          originalRules++;
          if (shouldKeepRule(node, signature)) {
            keptRules++;
            newChildren.push(node);
          }
        } else if (node.type === 'Atrule') {
          // Handle at-rules
          const result = processAtrule(node, signature);
          if (result) {
            const { node: processedNode, rulesProcessed, rulesKept } = result;
            originalRules += rulesProcessed;
            keptRules += rulesKept;
            newChildren.push(processedNode);
          }
        } else {
          // Keep other node types (comments, etc)
          newChildren.push(node);
        }
      });

      // Create new List and append items
      const newList = new csstree.List<csstree.CssNode>();
      for (const item of newChildren) {
        newList.appendData(item);
      }
      ast.children = newList;
    }

    // Generate cleaned CSS
    const cleanedCss = csstree.generate(ast);

    return {
      css: cleanedCss,
      originalRules,
      keptRules,
    };
  } catch (error) {
    // If parsing fails, return original CSS to be safe
    console.error('CSS parsing error:', error);
    return {
      css,
      originalRules: 1,
      keptRules: 1,
    };
  }
}

/**
 * Check if a CSS rule should be kept.
 */
function shouldKeepRule(rule: csstree.Rule, signature: DomSignature): boolean {
  const prelude = rule.prelude;

  if (!prelude || prelude.type !== 'SelectorList') {
    // Keep rules we can't parse
    return true;
  }

  // Generate selector string and check
  const selectors = csstree.generate(prelude);

  // Check for pseudo-elements in the selector - always keep
  if (selectors.includes('::')) {
    return true;
  }

  // Check if any selector matches
  return anySelectorMatches(selectors, signature);
}

interface AtruleResult {
  node: csstree.Atrule;
  rulesProcessed: number;
  rulesKept: number;
}

/**
 * Process an at-rule, returning the processed node or null if it should be removed.
 */
function processAtrule(
  node: csstree.Atrule,
  signature: DomSignature,
): AtruleResult | null {
  // Always keep @keyframes, @font-face
  if (node.name === 'keyframes' || node.name === 'font-face') {
    return { node, rulesProcessed: 0, rulesKept: 0 };
  }

  // Process @media queries
  if (node.name === 'media' && node.block?.type === 'Block') {
    const block = node.block;
    const newChildren: csstree.CssNode[] = [];
    let rulesProcessed = 0;
    let rulesKept = 0;

    block.children?.forEach((child) => {
      if (child.type === 'Rule') {
        rulesProcessed++;
        if (shouldKeepRule(child, signature)) {
          rulesKept++;
          newChildren.push(child);
        }
      } else {
        newChildren.push(child);
      }
    });

    // If all rules were removed, remove the entire @media
    if (newChildren.length === 0) {
      return null;
    }

    // Update the block's children
    const newList = new csstree.List<csstree.CssNode>();
    for (const item of newChildren) {
      newList.appendData(item);
    }
    block.children = newList;

    return { node, rulesProcessed, rulesKept };
  }

  // Keep other at-rules
  return { node, rulesProcessed: 0, rulesKept: 0 };
}
