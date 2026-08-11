/**
 * markdown-converter.ts
 *
 * Bidirectional conversion between Markdown and HTML using:
 *   - markdown-it  (Markdown -> HTML)
 *   - turndown     (HTML    -> Markdown)
 *
 * Both instances are configured once and reused.
 * Import `markdownToHtml` / `htmlToMarkdown` wherever conversion is needed.
 */

import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';
import { mdAzure, tdAzure } from './ext/azure.js';
import { highlight, mdBasic, stripEditorAttributes, tdBasic } from './ext/basic.js';
import { mdDefinitionList, tdDefinitionList } from './ext/definition-list.js';
import { mdEmoji, tdEmoji } from './ext/emoji.js';
import { mdFrontMatter, tdFrontMatter } from './ext/front-matter.js';
import { gfm } from './ext/gfm.js';
import { mdAzureImageSize, tdAzureImageSize } from './ext/image-size.js';
import { mdMark, tdMark } from './ext/mark.js';
import { mdMath, tdMath } from './ext/math.js';
import {
  postMarkdown,
  preMarkdown,
} from './ext/post-markdown.js';
import { postTurndown } from './ext/post-turndown.js';
import { mdPullRequest, tdPullRequest } from './ext/pull-request.js';
import { mdTasklist } from './ext/tasklist.js';
import { mdFootnote } from './ext/footnote.js';

// ---------------------------------------------------------------------------
// markdown-it instance - Markdown -> HTML
// ---------------------------------------------------------------------------

const md = new MarkdownIt({
  // Allow HTML tags inside markdown source (mirrors behaviour expected by RTE)
  html: true,
  // Auto-convert URLs to links
  linkify: true,
  // Treat single newlines as hard breaks so plain pasted text keeps line breaks.
  breaks: true,
  // Enable some language-neutral typography transformations
  typographer: true,
  highlight,
});

// Front-matter plugin - converts YAML front matter to/from HTML tables.
md.use(mdFrontMatter);

md.use(mdBasic);
md.use(mdEmoji);

// Azure extension - parse ::: containers into stable wrappers for round-trip.
md.use(mdAzure);

// Pull-request extension - parse ```suggestion fences into stable wrappers for round-trip.
md.use(mdPullRequest);

// Math extension - parse $$...$$ blocks into stable wrappers for round-trip.
md.use(mdMath);

// Task-list extension - parse '- [x]' and '- [ ]' as checkbox items.
md.use(mdTasklist, { enabled: true, label: true, labelAfter: false });

// Azure image-size extension - parse `![alt](src =WxH)` as sized HTML images.
md.use(mdAzureImageSize);

// Mark extension - parse `===highlight===` as HTML <mark>.
md.use(mdMark);

// Definition-list extension - parse simple term/definition blocks into HTML.
md.use(mdDefinitionList);

// Footnote extension - parse [^id], [^id]: defs and inline ^[note].
md.use(mdFootnote);

export const escapeHtml = md.utils.escapeHtml;

/**
 * Convert a Markdown string to an HTML string.
 *
 * @example
 * markdownToHtml('**bold** _italic_')
 * // -> '<p><strong>bold</strong> <em>italic</em></p>\n'
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  return postMarkdown(md.render(preMarkdown(markdown)));
}

// ---------------------------------------------------------------------------
// Turndown instance - HTML -> Markdown
// ---------------------------------------------------------------------------

const td = new TurndownService({
  headingStyle: 'atx',       // Use # / ## / ### style headings
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',  // Use ``` fences instead of 4-space indent
  emDelimiter: '_',
  strongDelimiter: '**',
  linkStyle: 'inlined',
});

td.use(tdBasic);
td.use(tdEmoji);

// Azure extension - restore ::: containers from stable HTML wrappers.
td.use(tdAzure);

// Pull-request extension - restore ```suggestion fences from stable HTML wrappers.
td.use(tdPullRequest);

// Math extension - restore $$...$$ blocks from stable HTML wrappers.
td.use(tdMath);

// Azure image-size extension - convert sized HTML images back to Azure syntax.
td.use(tdAzureImageSize);

// Mark extension - convert <mark> tags back to markdown highlight syntax.
td.use(tdMark);

// Definition-list extension - convert HTML <dl> blocks back to markdown syntax.
td.use(tdDefinitionList);

// GFM plugin - adds proper table, strikethrough, and task-list support.
td.use(gfm);

// Front-matter plugin - converts YAML front matter to/from HTML tables.
td.use(tdFrontMatter);

/**
 * Convert an HTML string (as produced by HugeRTE) to Markdown.
 *
 * @example
 * htmlToMarkdown('<p><strong>bold</strong></p>')
 * // -> '**bold**'
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return '';
  return postTurndown(td, stripEditorAttributes(html));
}
