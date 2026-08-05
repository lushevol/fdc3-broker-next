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

function normalizeMathBody(body: string): string {
  return body
    // undo escaped backslashes produced by markdown/html round-trip
    .replace(/\\\\/g, '\\')
    // underscores in math are meaningful subscripts, keep them unescaped
    .replace(/\\_/g, '_');
}

function normalizeMathBlock(markdown: string): string {
  return markdown.replace(/\$\$([\s\S]*?)\$\$/g, (_m, body: string) =>
    `$$${normalizeMathBody(body)}$$`
  );
}

/** Parse KaTeX-style block math into <pre class="sc-math"> wrappers. */
export function mdMath(md: MarkdownIt): void {
  md.block.ruler.before(
    'fence',
    'math_block_directive',
    (state, startLine, endLine, silent) => {
      const start = state.bMarks[startLine] + state.tShift[startLine];
      const max = state.eMarks[startLine];
      const line = state.src.slice(start, max).trim();

      if (line !== '$$') return false;
      if (silent) return true;

      let nextLine = startLine + 1;
      while (nextLine < endLine) {
        const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
        const lineMax = state.eMarks[nextLine];
        const closeLine = state.src.slice(lineStart, lineMax).trim();
        if (closeLine === '$$') break;
        nextLine += 1;
      }

      if (nextLine >= endLine) return false;

      const contentStart =
        state.bMarks[startLine + 1] + state.tShift[startLine + 1];
      const contentEnd = state.bMarks[nextLine] + state.tShift[nextLine];
      const value = state.src
        .slice(contentStart, contentEnd)
        .replace(/\n$/, '');

      const token = state.push('math_block_directive', '', 0);
      token.block = true;
      token.content = `$$\n${value}\n$$`;

      state.line = nextLine + 1;
      return true;
    }
  );

  md.renderer.rules.math_block_directive = (tokens, idx) => {
    const content = tokens[idx]?.content || '';
    return `<pre class="sc-math">${escapeHtml(content)}</pre>`;
  };
}

/** Restore markdown math block from <pre class="sc-math"> wrappers. */
export function tdMath(turndownService: TurndownService): void {
  turndownService.addRule('math-block-directive', {
    filter: node =>
      node.nodeName === 'PRE' &&
      node.classList.contains('sc-math'),
    replacement: (_content, node) => {
      const text = ((node as HTMLElement).textContent || '').trim();
      const wrapped =
        text.startsWith('$$') && text.endsWith('$$')
          ? text
          : `$$\n${text}\n$$`;
      return `\n\n${normalizeMathBlock(wrapped)}\n\n`;
    },
  });
}
