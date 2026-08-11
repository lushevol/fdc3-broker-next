import type MarkdownIt from 'markdown-it';
import type TurndownService from 'turndown';

/** Parse ```suggestion fences into <p class="sc-pull-request"> wrappers. */
export function mdPullRequest(md: MarkdownIt): void {
  md.block.ruler.before(
    'fence',
    'pull_request_suggestion_fence',
    (state, startLine, endLine, silent) => {
      const start = state.bMarks[startLine] + state.tShift[startLine];
      const max = state.eMarks[startLine];
      const line = state.src.slice(start, max).trim();

      const openMatch = line.match(/^(`{3,})(\s*)suggestion\s*$/);
      if (!openMatch) return false;

      if (silent) return true;

      const marker = openMatch[1] || '```';
      let nextLine = startLine + 1;

      while (nextLine < endLine) {
        const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
        const lineMax = state.eMarks[nextLine];
        const closeLine = state.src.slice(lineStart, lineMax).trim();
        if (closeLine === marker) break;
        nextLine += 1;
      }

      if (nextLine >= endLine) return false;

      const contentStart =
        state.bMarks[startLine + 1] + state.tShift[startLine + 1];
      const contentEnd = state.bMarks[nextLine] + state.tShift[nextLine];
      const value = state.src
        .slice(contentStart, contentEnd)
        .replace(/\n$/, '');

      const token = state.push('pull_request_suggestion_fence', '', 0);
      token.block = true;
      token.content = `${marker}suggestion\n${value}\n${marker}`;

      state.line = nextLine + 1;
      return true;
    }
  );

  md.renderer.rules.pull_request_suggestion_fence = (tokens, idx) => {
    const content = tokens[idx]?.content || '';
    return `<p class="sc-pull-request">${md.utils
      .escapeHtml(content)
      .split('\n')
      .join('<br>')}</p>`;
  };
}

/** Restore ```suggestion fences from p.sc-pull-request wrappers. */
export function tdPullRequest(turndownService: TurndownService): void {
  turndownService.addRule('pull-request-suggestion-fence', {
    filter: node =>
      node.nodeName === 'P' && node.classList.contains('sc-pull-request'),
    replacement: (_content, node) =>
      `\n\n${node.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim()}\n\n`,
  });
}
