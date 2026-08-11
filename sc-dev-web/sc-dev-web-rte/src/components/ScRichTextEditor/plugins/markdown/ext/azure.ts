import type MarkdownIt from 'markdown-it';
import type TurndownService from 'turndown';

/** Parse Azure `:::` container directives into <pre class="sc-azure-container"> wrappers. */
export function mdAzure(md: MarkdownIt): void {
  const containerDirectiveKeys = new Set(['mermaid', 'video', 'query-table']);

  md.block.ruler.before(
    'fence',
    'azure_container_directive',
    (state, startLine, endLine, silent) => {
      const start = state.bMarks[startLine] + state.tShift[startLine];
      const max = state.eMarks[startLine];
      const line = state.src.slice(start, max);

      const openMatch = line.match(/^:::\s*(mermaid|video|query-table)\s*$/);
      if (!openMatch) return false;

      if (silent) return true;

      let nextLine = startLine + 1;
      while (nextLine < endLine) {
        const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
        const lineMax = state.eMarks[nextLine];
        const closeLine = state.src.slice(lineStart, lineMax).trim();
        if (closeLine === ':::') break;
        nextLine += 1;
      }

      if (nextLine >= endLine) return false;

      const key = openMatch[1] || '';
      if (!containerDirectiveKeys.has(key)) return false;

      const contentStart =
        state.bMarks[startLine + 1] + state.tShift[startLine + 1];
      const contentEnd = state.bMarks[nextLine] + state.tShift[nextLine];
      const value = state.src
        .slice(contentStart, contentEnd)
        .replace(/\n$/, '');

      const token = state.push('azure_container_directive', '', 0);
      token.block = true;
      token.content = `::: ${key}\n${value}\n:::`;

      state.line = nextLine + 1;
      return true;
    }
  );

  md.renderer.rules.azure_container_directive = (tokens, idx) => {
    const content = tokens[idx]?.content || '';
    return `<pre class="sc-azure-container">${md.utils.escapeHtml(content)}</pre>`;
  };
}

/** Restore Azure `:::` container directives from pre.sc-azure-container wrappers. */
export function tdAzure(turndownService: TurndownService): void {
  turndownService.addRule('azure-container-directive', {
    filter: node =>
      node.nodeName === 'PRE' && node.classList.contains('sc-azure-container'),
    replacement: (_, node) => `\n\n${node.textContent}\n\n`,
  });
}
