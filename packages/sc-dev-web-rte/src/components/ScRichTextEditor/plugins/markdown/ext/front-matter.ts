import type MarkdownIt from 'markdown-it';
import type TurndownService from 'turndown';
import * as yaml from 'js-yaml';

export function mdFrontMatter(mdInstance: MarkdownIt): void {
  const minMarkers = 3;
  const markerChar = '-';

  function scalarToCell(value: unknown): string {
    if (value === null) return '<td data-yaml-type="null">null</td>';
    if (typeof value === 'boolean') {
      return `<td data-yaml-type="boolean">${String(value)}</td>`;
    }
    if (typeof value === 'number') {
      return `<td data-yaml-type="number">${String(value)}</td>`;
    }
    if (typeof value === 'undefined') return '<td></td>';
    return `<td>${String(value)}</td>`;
  }

  function toTable(frontMatter: string): string {
    function fromObj(meta: Record<string, unknown>): string {
      const keys = Object.keys(meta);
      if (keys.length === 0) return '';
      let table = '<table border="1" class="metadata-yaml-table object"><thead><tr>';
      for (const key of keys) {
        table += `<th>${key}</th>`;
      }
      table += '</tr></thead><tbody><tr>';
      for (const key of keys) {
        const value = meta[key];
        if (Array.isArray(value)) {
          table += `<td>${fromArr(value)}</td>`;
        } else if (value && typeof value === 'object') {
          table += `<td>${fromObj(value as Record<string, unknown>)}</td>`;
        } else {
          table += scalarToCell(value);
        }
      }
      table += '</tr></tbody></table>';
      return `<div class="metadata-yaml-table-wrap scroll">${table}</div>`;
    }

    function fromArr(meta: unknown[]): string {
      if (meta.length === 0) return '';
      let table = '<table border="1" class="metadata-yaml-table array"><tbody><tr>';
      for (const item of meta) {
        if (Array.isArray(item)) {
          table += `<td>${fromArr(item)}</td>`;
        } else if (item && typeof item === 'object') {
          table += `<td>${fromObj(item as Record<string, unknown>)}</td>`;
        } else {
          table += scalarToCell(item);
        }
      }
      table += '</tr></tbody></table>';
      return `<div class="metadata-yaml-table-wrap scroll">${table}</div>`;
    }

    try {
      const parsed = yaml.load(frontMatter) as unknown;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return '';
      return fromObj(parsed as Record<string, unknown>);
    } catch (_e) {
      return '';
    }
  }

  mdInstance.block.ruler.before('fence', 'front_matter', (state, startLine, endLine, silent) => {
    if (startLine !== 0) return false;

    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const firstLine = state.src.slice(start, max).trim();
    if (firstLine !== markerChar.repeat(minMarkers)) return false;

    if (silent) return true;

    let nextLine = startLine + 1;
    let foundEnd = false;

    while (nextLine < endLine) {
      const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
      const lineMax = state.eMarks[nextLine];
      const line = state.src.slice(lineStart, lineMax).trim();

      if (line === markerChar.repeat(minMarkers) || line === '...') {
        foundEnd = true;
        break;
      }

      nextLine += 1;
    }

    if (!foundEnd || startLine + 1 >= endLine) return false;

    const contentStart = state.bMarks[startLine + 1] + state.tShift[startLine + 1];
    const contentEndLine = foundEnd ? nextLine : endLine;
    const contentEnd = state.bMarks[contentEndLine] + state.tShift[contentEndLine];
    const frontMatter = state.src.slice(contentStart, contentEnd).trimEnd();
    const renderedTable = toTable(frontMatter);

    if (!renderedTable) return false;

    const token = state.push('front_matter', '', 0);
    token.block = true;
    token.hidden = false;
    token.content = renderedTable;

    state.line = foundEnd ? nextLine + 1 : endLine;
    return true;
  });

  mdInstance.renderer.rules.front_matter = (tokens, idx) => tokens[idx]?.content || '';
}

export function tdFrontMatter(turndownService: TurndownService): void {
  function parseScalar(value: string): unknown {
    if (!value.trim()) return '';

    try {
      return yaml.load(value);
    } catch (_e) {
      return value;
    }
  }

  function getDirectChild(node: Element, selector: string): Element | null {
    for (const child of Array.from(node.children)) {
      if (child.matches(selector)) return child;
    }

    return null;
  }

  function getDirectChildren(node: Element, selector: string): Element[] {
    return Array.from(node.children).filter(child => child.matches(selector));
  }

  function cellValue(cell: Element): unknown {
    const nestedTable = cell.querySelector('table.metadata-yaml-table');
    if (nestedTable) return tableToValue(nestedTable as HTMLTableElement);
    const typed = cell.getAttribute('data-yaml-type');
    const text = cell.textContent?.trim() || '';

    if (typed === 'null') return null;
    if (typed === 'boolean') return text === 'true';
    if (typed === 'number') {
      const num = Number(text);
      if (!Number.isNaN(num)) return num;
    }
    return parseScalar(text);
  }

  function tableToObject(table: HTMLTableElement): Record<string, unknown> {
    const headRow = table.tHead?.rows.item(0);
    const bodyRow = table.tBodies.item(0)?.rows.item(0);
    if (!headRow || !bodyRow) return {};

    const keys = Array.from(headRow.cells).map(cell => cell.textContent?.trim() || '');
    const values = Array.from(bodyRow.cells).map(cell => cellValue(cell));

    return keys.reduce<Record<string, unknown>>((result, key, index) => {
      result[key] = index < values.length ? values[index] : '';
      return result;
    }, {});
  }

  function tableToArray(table: HTMLTableElement): unknown[] {
    const bodyRow = table.tBodies.item(0)?.rows.item(0);
    if (!bodyRow) return [];
    return Array.from(bodyRow.cells).map(cell => cellValue(cell));
  }

  function tableToValue(table: HTMLTableElement): unknown {
    if (table.classList.contains('object')) return tableToObject(table);
    if (table.classList.contains('array')) return tableToArray(table);

    const headerCells = getDirectChildren(table, 'thead')
      .flatMap(section => getDirectChildren(section, 'tr'))
      .flatMap(row => getDirectChildren(row, 'th'));

    if (headerCells.length > 0) return tableToObject(table);
    return tableToArray(table);
  }

  turndownService.addRule('metadata-yaml-table', {
    filter: node => (
      node.nodeName === 'TABLE' &&
      (node as HTMLTableElement).classList.contains('metadata-yaml-table') &&
      !(node.parentElement?.closest('table.metadata-yaml-table'))
    ),
    replacement: (_content, node) => {
      const table = node as HTMLTableElement;
      const value = tableToValue(table);
      const frontMatter = yaml.dump(value, {
        flowLevel: -1,
        lineWidth: -1,
        noRefs: true,
      }).trimEnd();

      return `---\n${frontMatter}\n---\n`;
    },
  });
}


