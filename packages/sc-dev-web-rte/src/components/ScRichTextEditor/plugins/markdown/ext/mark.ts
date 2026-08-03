import type MarkdownIt from 'markdown-it';
import type TurndownService from 'turndown';

/**
 * Parse `==highlight==` as HTML <mark> while keeping the inner content
 * available to the markdown inline parser.
 */
export function mdMark(md: MarkdownIt): void {
  md.inline.ruler.before('emphasis', 'mark', (state, silent): boolean => {
    if (state.src.slice(state.pos, state.pos + 2) !== '==') return false;

    const close = state.src.indexOf('==', state.pos + 2);
    if (close === -1) return false;

    const inner = state.src.slice(state.pos + 2, close);
    if (!inner.trim()) return false;

    if (silent) return true;

    const openToken = state.push('html_inline', '', 0);
    openToken.content = '<mark>';

    const innerTokens: MarkdownIt.Token[] = [];
    md.inline.parse(inner, md, state.env, innerTokens);
    state.tokens.push(...innerTokens);

    const closeToken = state.push('html_inline', '', 0);
    closeToken.content = '</mark>';

    state.pos = close + 2;
    return true;
  });
}

/** Preserve HTML <mark> tags as HTML during Turndown export. */
export function tdMark(turndownService: TurndownService): void {
  turndownService.addRule('mark', {
    filter: ['mark'],
    replacement: (_content, node) => node.outerHTML,
  });
}