import hljs from '@highlightjs/cdn-assets/es/highlight.js';
import type MarkdownIt from 'markdown-it';
import type TurndownService from 'turndown';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function mdBasic(md: MarkdownIt): void {
  const defaultRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    tokens[idx].attrJoin('rel', 'noopener noreferrer');
    tokens[idx].attrJoin('target', '_blank');

    return defaultRender(tokens, idx, options, env, self);
  };
}

export function highlight(str: string, lang: string): string {
  let value = str;
  if (lang && hljs.getLanguage(lang)) {
    try {
      value = hljs.highlight(str, {
        language: lang,
        ignoreIllegals: true,
      }).value;
    } catch (__) {}
  } else {
    value = escapeHtml(str) as string;
  }
  return `<pre class="hljs"><code class="hljs language-${lang} scroll">${value}</code></pre>`;
}

/**
 * Strip TinyMCE/HugeRTE internal attributes from an HTML string before
 * handing it to Turndown.  This mirrors the sanitisation already applied in
 * `ScRichTextEditorV2._sanitizeInputValue`.
 */
export function stripEditorAttributes(html: string): string {
  return html.replace(/<(?!\/)[a-z][^>]*>/gi, match =>
    match.replace(
      /\s+data-mce-[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'`=<>]+))?/gi,
      ''
    )
  );
}

/**
 * SC-specific Turndown rules used by markdown conversion.
 */
export function tdBasic(turndownService: TurndownService): void {
  // Strip HugeRTE bookmarks (invisible span placeholders) entirely.
  turndownService.addRule('hugerte-bookmarks', {
    filter: node =>
      node.nodeName === 'SPAN' &&
      (node as HTMLElement).hasAttribute('data-mce-type'),
    replacement: () => '',
  });

  // preserve elements
  turndownService.keep(node =>
    ['u', 'sub', 'sup', 'ins', 'kbd', 'details'].includes(
      node.nodeName.toLocaleLowerCase()
    )
  );

  // Preserve inline colour / background spans as HTML.
  turndownService.keep(node => {
    if (node.nodeName !== 'SPAN') return false;
    const style = node.getAttribute('style') || '';
    return /color|background/.test(style);
  });

  // preserve aligned blocks
  turndownService.addRule('align', {
    filter: node => node.hasAttribute('align') || !!node.style.textAlign,
    replacement: (_, node) => node.outerHTML,
  });

  // preserve mention spans as HTML
  turndownService.keep(
    node => node.nodeName === 'SPAN' && node.classList.contains('sc-mention')
  );
  
  // Preserve wiki-friendly legacy rich HTML tags as raw HTML.
  turndownService.keep(node =>
    ['FONT', 'CENTER', 'SMALL', 'BIG', 'TT'].includes(node.nodeName)
  );

}
