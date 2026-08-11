import TurndownService from 'turndown';

/** Normalizes inline math delimiters by unescaping backslashes and underscores. */
function normInlineMathDelim(markdown: string): string {
  const normalizeMathBody = (body: string): string => body
    // undo escaped backslashes produced by markdown/html round-trip
    .replace(/\\\\/g, '\\')
    // underscores in math are meaningful subscripts, keep them unescaped
    .replace(/\\_/g, '_');

  return markdown
    .replace(/\$([^\n$]+?)\$/g, (_m, body: string) => `$${normalizeMathBody(body)}$`);
}

/** Normalizes math delimiters in markdown by unescaping backslashes and underscores. */
function normEscArtifacts(markdown: string): string {
  return markdown
    .replace(/\\\[\^(\d+)\\\]/g, '[^$1]')
    .replace(/\\\[\\\[(.*?)\\\]\\\]/g, '[[$1]]')
    .replace(/\[\[\\_TOC\\_\]\]/g, '[[_TOC_]]')
    .replace(/\[\[\\_TOSP\\_\]\]/g, '[[_TOSP_]]')
    .replace(/\[\[_TOC_\]\]/g, '[[_TOC_]]')
    .replace(/\[\[_TOSP_\]\]/g, '[[_TOSP_]]');
}

/** Escapes plain text markdown by adding backslashes before special characters. */
function escapePlainTextMarkdown(markdown: string): string {
  const markdownBlockMarkers = /^(?:\s*(?:#{1,6}\s|>|[-*+]\s|\d+\.\s|```|~~~|---+$|\|))/;
  const markdownInlineMarkers =
    /(`[^`]*`|\*\*[^*]+\*\*|_[^_]+_|\[\^[^\]]+\]|\[[^\]]+\]\([^\)]+\)|!\[[^\]]*\]\([^\)]+\)|<[^>]+>|\[\[_TOC_\]\]|\[\[_TOSP_\]\])/;
  const escapedChars = /([\\*_[\]()#+\-!])/g;

  let inFence = false;

  return markdown
    .split('\n')
    .map(line => {
      if (!line.trim()) return line;
      if (/^\s*(```|~~~|:::)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      if (line.includes('$')) return line;
      if (markdownBlockMarkers.test(line)) return line;
      if (markdownInlineMarkers.test(line)) return line;
      if (line.startsWith('<')) return line;
      return line.replace(escapedChars, '\\$1');
    })
    .join('\n');
}

/** Converts footnotes in the HTML root element to markdown footnote definitions. */
function turndownFootnotes(td: TurndownService, root: HTMLElement): string {
  const refs = Array.from(root.querySelectorAll('sup.footnote-ref > a[href^="#fn"]'));
  const footnoteItems = Array.from(root.querySelectorAll('section.footnotes .footnote-item[id^="fn"]'));

  if (!refs.length || !footnoteItems.length) {
    return '';
  }

  const idToLabel = new Map<string, string>();

  for (const ref of refs) {
    const href = ref.getAttribute('href') || '';
    const match = href.match(/^#fn(.+)$/);
    if (!match) continue;

    const footnoteId = match[1];
    const text = (ref.textContent || '').trim();
    const label = text.replace(/^\[(.+)\]$/, '$1') || footnoteId;

    if (!idToLabel.has(footnoteId)) {
      idToLabel.set(footnoteId, label);
    }
  }

  for (const ref of refs) {
    const sup = ref.parentElement;
    if (!sup) continue;

    const href = ref.getAttribute('href') || '';
    const match = href.match(/^#fn(.+)$/);
    if (!match) continue;

    const footnoteId = match[1];
    const label = idToLabel.get(footnoteId) || footnoteId;
    const marker = root.ownerDocument?.createTextNode(`[^${label}]`) ?? document.createTextNode(`[^${label}]`);
    sup.replaceWith(marker);
  }

  const defs: string[] = [];

  for (const item of footnoteItems) {
    const idAttr = item.getAttribute('id') || '';
    const footnoteId = idAttr.replace(/^fn/, '');
    const label = idToLabel.get(footnoteId) || footnoteId;

    const clone = item.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.footnote-backref').forEach(node => node.remove());
    const definitionBody = normEscArtifacts(
      normInlineMathDelim(td.turndown(clone.innerHTML).trim())
    );

    defs.push(`[^${label}]: ${definitionBody}`);
  }

  root.querySelectorAll('section.footnotes').forEach(node => node.remove());

  if (!defs.length) {
    return '';
  }

  return defs.join('\n');
}

export function postTurndown(td: TurndownService, html: string): string {
  const root = document.createElement('div');
  root.innerHTML = html;
  const footnoteDefs = turndownFootnotes(td, root);
  const main = escapePlainTextMarkdown(
    normEscArtifacts(normInlineMathDelim(td.turndown(root.innerHTML)))
  ).trim();

  if (!footnoteDefs) {
    return main;
  }

  return `${main}\n\n${footnoteDefs}`.trim();
}