import type {
  CleanUnusedCssOptions,
  CleanUnusedCssResult,
  CleanupStats,
  DomSignature,
} from './types.js';
import { extractDomSignature } from './dom-signature.js';
import { processStyleTags } from './css-process.js';

export type {
  CleanUnusedCssOptions,
  CleanUnusedCssResult,
  CleanupStats,
  DomSignature,
};

/**
 * Removes unused CSS from HTML by analyzing which selectors match elements in the DOM.
 *
 * @param options - Configuration options including the HTML input
 * @returns Object containing cleaned HTML and statistics
 */
export function cleanUnusedCss(
  options: CleanUnusedCssOptions,
): CleanUnusedCssResult {
  const { html } = options;

  // Handle empty input
  if (!html || html.trim() === '') {
    return {
      html: '',
      stats: {
        originalRules: 0,
        keptRules: 0,
        removedRules: 0,
        originalSize: 0,
        newSize: 0,
      },
    };
  }

  const originalSize = Buffer.byteLength(html, 'utf-8');

  // Phase 1: Extract DOM signature
  const domSignature = extractDomSignature(html);

  // Phase 2: Process style tags
  const { html: cleanedHtml, stats } = processStyleTags(html, domSignature);

  const newSize = Buffer.byteLength(cleanedHtml, 'utf-8');

  return {
    html: cleanedHtml,
    stats: {
      ...stats,
      originalSize,
      newSize,
    },
  };
}
