import type TurndownService from 'turndown';
import mdDefinitionList from 'markdown-it-deflist';

export { mdDefinitionList };

/** Convert HTML <dl> definition lists back into markdown definition-list syntax. */
export function tdDefinitionList(turndownService: TurndownService): void {
  turndownService.addRule('definition-list', {
    filter: node => node.nodeName === 'DL',
    replacement: (_content, node) => {
      const children = Array.from(node.children);
      const lines: string[] = [];

      for (let index = 0; index < children.length; index += 1) {
        const child = children[index];
        if (child.nodeName !== 'DT') {
          continue;
        }

        const term = child.textContent?.trim() || '';
        const definition = children[index + 1]?.nodeName === 'DD'
          ? children[index + 1].textContent?.trim() || ''
          : '';

        lines.push(term);
        lines.push(`: ${definition}`.trimEnd());

        if (children[index + 1]?.nodeName === 'DD') {
          index += 1;
        }
      }

      return `\n\n${lines.join('\n')}\n\n`;
    },
  });
}