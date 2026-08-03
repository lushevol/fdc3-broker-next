import type MarkdownIt from 'markdown-it';
import type TurndownService from 'turndown';

import { escapeHtml } from '../converter.js';

const AZURE_IMAGE_SIZE_RE = /^!\[((?:\\.|[^\]])*)\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+(?:"([^"]*)"|'([^']*)'))?\s*=\s*(\d+)x(\d+)\s*\)/;

/**
 * Parse Azure-style image sizing syntax as a normal HTML image element.
 *
 * Example: `![alt](img.png =500x250)` → `<img src="img.png" alt="alt" width="500" height="250">`
 */
export function mdAzureImageSize(md: MarkdownIt): void {
  md.inline.ruler.before('image', 'azure_image_size', (state, silent): boolean => {
    const match = state.src.slice(state.pos).match(AZURE_IMAGE_SIZE_RE);
    if (!match) return false;

    if (silent) return true;

    const altText = (match[1] || '').replace(/\\([\\\[\]\(\)])/g, '$1');
    const src = match[2] || match[3] || '';
    const title = match[4] || match[5] || '';
    const width = match[6];
    const height = match[7];

    const attrs = [
      `src="${escapeHtml(src)}"`,
      `alt="${escapeHtml(altText)}"`,
      `width="${escapeHtml(width)}"`,
      `height="${escapeHtml(height)}"`,
    ];

    if (title) {
      attrs.splice(2, 0, `title="${escapeHtml(title)}"`);
    }

    const token = state.push('html_inline', '', 0);
    token.content = `<img ${attrs.join(' ')}>`;
    state.pos += match[0].length;
    return true;
  });
}

/**
 * Convert HTML images with width/height back into Azure-style image syntax.
 */
export function tdAzureImageSize(turndownService: TurndownService): void {
  turndownService.addRule('azure-image-size', {
    filter: node =>
      node.nodeName === 'IMG' &&
      !!(node as HTMLImageElement).getAttribute('width') &&
      !!(node as HTMLImageElement).getAttribute('height') &&
      !(node as HTMLImageElement).getAttribute('title'),
    replacement: (_content, node) => {
      const image = node as HTMLImageElement;
      const alt = image.getAttribute('alt') || '';
      const src = image.getAttribute('src') || '';
      const width = image.getAttribute('width') || '';
      const height = image.getAttribute('height') || '';

      return `![${alt}](${src} =${width}x${height})`;
    },
  });
}