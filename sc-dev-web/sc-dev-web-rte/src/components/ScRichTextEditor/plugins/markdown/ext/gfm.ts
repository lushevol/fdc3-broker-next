/**
 * turndown-plugin-gfm.ts
 *
 * Local TypeScript port of @joplin/turndown-plugin-gfm (MIT).
 * Source: https://github.com/laurent22/joplin (packages/turndown-plugin-gfm)
 *
 * Ported to ESM/TypeScript to avoid shipping a CJS-only npm package to the
 * browser without a bundler step.  Only the `tables` and `gfm` exports are
 * used by this project; the full plugin is included for completeness.
 */

import TurndownService from 'turndown';

// ---------------------------------------------------------------------------
// highlightedCodeBlock
// ---------------------------------------------------------------------------

const highlightRegExp = /highlight-(?:text|source)-([a-z0-9]+)/;

function highlightedCodeBlock(turndownService: TurndownService): void {
  turndownService.addRule('highlightedCodeBlock', {
    filter(node) {
      const firstChild = node.firstChild as Element | null;
      return (
        node.nodeName === 'DIV' &&
        highlightRegExp.test((node as HTMLElement).className) &&
        firstChild !== null &&
        firstChild.nodeName === 'PRE'
      );
    },
    replacement(content, node, options) {
      const el = node as HTMLElement;
      const className = el.className || '';
      const language = (className.match(highlightRegExp) || [null, ''])[1] ?? '';
      const fence = (options as { fence: string }).fence;
      const text = (node.firstChild as Element).textContent ?? '';
      return `\n\n${fence}${language}\n${text}\n${fence}\n\n`;
    },
  });
}

// ---------------------------------------------------------------------------
// strikethrough
// ---------------------------------------------------------------------------

function strikethrough(turndownService: TurndownService): void {
  turndownService.addRule('strikethrough', {
    filter: ['del', 's', 'strike'] as TurndownService.Filter,
    replacement: content => `~~${content}~~`,
  });
}

// ---------------------------------------------------------------------------
// tables
// ---------------------------------------------------------------------------

const indexOf = Array.prototype.indexOf;
const every = Array.prototype.every;

const alignMap: Record<string, string> = { left: ':---', right: '---:', center: ':---:' };

// Module-level refs set when `tables()` plugin is installed.
let isCodeBlock_: ((node: Node) => boolean) | null = null;
let options_: TurndownService.Options | null = null;

// Cache tableShouldBeSkipped results — expensive for large tables.
const tableShouldBeSkippedCache_ = new WeakMap<Element, boolean>();

function getAlignment(node: Element | null): string {
  if (!node) return '';
  return (
    node.getAttribute('align') ||
    (node as HTMLElement).style?.textAlign ||
    ''
  ).toLowerCase();
}

function getBorder(alignment: string): string {
  return alignment ? (alignMap[alignment] ?? '---') : '---';
}

function getColumnAlignment(table: HTMLTableElement, columnIndex: number): string {
  const votes: Record<string, number> = { left: 0, right: 0, center: 0, '': 0 };
  let align = '';

  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    if (columnIndex < row.childNodes.length) {
      const cellAlignment = getAlignment(row.childNodes[columnIndex] as Element);
      votes[cellAlignment] = (votes[cellAlignment] ?? 0) + 1;
      if (votes[cellAlignment] > (votes[align] ?? 0)) {
        align = cellAlignment;
      }
    }
  }

  return align;
}

function nodeParentTable(node: Node): HTMLTableElement | null {
  let parent = node.parentNode;
  while (parent && parent.nodeName !== 'TABLE') {
    parent = parent.parentNode;
  }
  return (parent as HTMLTableElement) ?? null;
}

function nodeParentDiv(node: Node): HTMLElement | null {
  let parent = node.parentNode;
  while (parent && parent.nodeName !== 'DIV') {
    parent = parent.parentNode;
  }
  return (parent as HTMLElement) ?? null;
}

function appendColSpan(base: string, node: Element, emptyChar: string): string {
  const colspan = parseInt(node.getAttribute('colspan') ?? '1', 10) || 1;
  let result = base;
  for (let i = 1; i < colspan; i++) {
    result = `${result} | ${emptyChar.repeat(3)}`;
  }
  return result;
}

function tableColCount(node: HTMLTableElement): number {
  let maxColCount = 0;
  for (let i = 0; i < node.rows.length; i++) {
    const count = node.rows[i].childNodes.length;
    if (count > maxColCount) maxColCount = count;
  }
  return maxColCount;
}

function cell(
  content: string,
  node: Element | null = null,
  index: number | null = null,
): string {
  const resolvedIndex = index !== null
    ? index
    : (node ? indexOf.call(node.parentNode?.childNodes, node) as number : 0);
  const prefix = resolvedIndex === 0 ? '| ' : ' ';
  let filtered = content.trim().replace(/\n\r/g, '<br>').replace(/\n/g, '<br>');
  filtered = filtered.replace(/\|+/g, '\\|');
  while (filtered.length < 3) filtered += ' ';
  if (node) filtered = appendColSpan(filtered, node, ' ');
  return `${prefix}${filtered} |`;
}

function isFirstTbody(element: Element): boolean {
  const prev = element.previousSibling;
  return (
    element.nodeName === 'TBODY' &&
    (!prev ||
      (prev.nodeName === 'THEAD' && /^\s*$/i.test((prev as Element).textContent ?? '')))
  );
}

function isHeadingRow(tr: Element): boolean {
  const parentNode = tr.parentNode as Element;
  return (
    parentNode.nodeName === 'THEAD' ||
    (parentNode.firstChild === tr &&
      (parentNode.nodeName === 'TABLE' || isFirstTbody(parentNode)) &&
      every.call(tr.childNodes, (n: Node) => n.nodeName === 'TH'))
  );
}

function nodeContainsTable(node: Node): boolean {
  if (!node.childNodes) return false;
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    if (child.nodeName === 'TABLE') return true;
    if (nodeContainsTable(child)) return true;
  }
  return false;
}

function nodeContains(node: Node, types: string | string[]): boolean {
  if (!node.childNodes) return false;
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    if (types === 'code' && isCodeBlock_ && isCodeBlock_(child)) return true;
    if (Array.isArray(types) && types.includes(child.nodeName)) return true;
    if (nodeContains(child, types)) return true;
  }
  return false;
}

const customStyleProperties = [
  'background-color', 'background',
  'border-color', 'border',
  'border-top', 'border-right', 'border-bottom', 'border-left',
  'border-style', 'border-width',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'float', 'margin-left', 'margin-right',
];

const customAttributeNames = ['bgcolor', 'bordercolor', 'background'];

function nodeHasCustomStyle(node: Element | null): boolean {
  if (!node?.getAttribute) return false;
  const styleAttr = node.getAttribute('style');
  if (!styleAttr) return false;
  const properties = styleAttr.split(';')
    .map(s => s.split(':')[0].trim().toLowerCase())
    .filter(s => s.length > 0);
  return properties.some(p => customStyleProperties.includes(p));
}

function hasNonDefaultSpacingAttribute(node: Element | null, name: string): boolean {
  if (!node?.getAttribute) return false;
  const value = node.getAttribute(name);
  if (value === null) return false;
  const v = `${value}`.trim().toLowerCase();
  return v !== '' && v !== '0' && v !== '0px';
}

function nodeHasCustomAttributes(node: Element | null): boolean {
  if (!node?.getAttribute) return false;
  for (const name of customAttributeNames) {
    const value = node.getAttribute(name);
    if (value !== null && `${value}`.trim() !== '') return true;
  }
  if (node.nodeName === 'TABLE') {
    if (hasNonDefaultSpacingAttribute(node, 'cellpadding')) return true;
    if (hasNonDefaultSpacingAttribute(node, 'cellspacing')) return true;
  }
  return false;
}

function nodeHasCustomFormatting(node: Element | null): boolean {
  return nodeHasCustomStyle(node) || nodeHasCustomAttributes(node);
}

function tableHasCustomStyles(tableNode: HTMLTableElement): boolean {
  if (nodeHasCustomFormatting(tableNode)) return true;
  const rows = tableNode.rows;
  if (!rows) return false;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (nodeHasCustomFormatting(row)) return true;
    for (let j = 0; j < row.childNodes.length; j++) {
      const c = row.childNodes[j] as Element;
      if ((c.nodeName === 'TD' || c.nodeName === 'TH') && nodeHasCustomFormatting(c)) return true;
    }
  }
  return false;
}

function tableHasRowspan(tableNode: HTMLTableElement): boolean {
  const rows = tableNode.rows;
  if (!rows) return false;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    for (let j = 0; j < row.childNodes.length; j++) {
      const cell = row.childNodes[j] as Element;
      if (cell.nodeName !== 'TD' && cell.nodeName !== 'TH') continue;
      const rowspan = parseInt(cell.getAttribute('rowspan') ?? '1', 10) || 1;
      if (rowspan > 1) return true;
    }
  }

  return false;
}

type TableOptions = TurndownService.Options & {
  preserveNestedTables?: boolean;
  preserveTableStyles?: boolean;
};

function tableShouldBeHtml(tableNode: HTMLTableElement, options: TableOptions): boolean {
  const possibleTags = ['UL', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HR', 'BLOCKQUOTE'];
  if (options.preserveNestedTables) possibleTags.push('TABLE');
  return (
    tableHasRowspan(tableNode) ||
    nodeContains(tableNode, 'code') ||
    nodeContains(tableNode, possibleTags) ||
    (!!options.preserveTableStyles && tableHasCustomStyles(tableNode))
  );
}

function tableShouldBeSkipped_(tableNode: HTMLTableElement): boolean {
  if (!tableNode) return true;
  if (!tableNode.rows) return true;
  if (tableNode.rows.length === 1 && tableNode.rows[0].childNodes.length <= 1) return true;
  if (nodeContainsTable(tableNode)) return true;
  return false;
}

function tableShouldBeSkipped(tableNode: HTMLTableElement): boolean {
  const cached = tableShouldBeSkippedCache_.get(tableNode);
  if (cached !== undefined) return cached;
  const result = tableShouldBeSkipped_(tableNode);
  tableShouldBeSkippedCache_.set(tableNode, result);
  return result;
}

const tableRules: Record<string, TurndownService.Rule> = {
  tableCell: {
    filter: ['th', 'td'],
    replacement(content, node) {
      const parentTable = nodeParentTable(node);
      if (parentTable && tableShouldBeSkipped(parentTable)) return content;
      return cell(content, node as Element);
    },
  },

  tableRow: {
    filter: 'tr',
    replacement(content, node) {
      const parentTable = nodeParentTable(node);
      if (!parentTable || tableShouldBeSkipped(parentTable)) return content;

      let borderCells = '';
      if (isHeadingRow(node as Element)) {
        const colCount = tableColCount(parentTable);
        for (let i = 0; i < colCount; i++) {
          const childNode = i < node.childNodes.length ? (node.childNodes[i] as Element) : null;
          const border = getBorder(getColumnAlignment(parentTable, i));
          borderCells += cell(border, childNode, i);
        }
      }
      return `\n${content}${borderCells ? `\n${borderCells}` : ''}`;
    },
  },

  table: {
    filter: 'table',
    replacement(content, node) {
      const tableNode = node as HTMLTableElement;
      if (tableShouldBeHtml(tableNode, options_ ?? {})) {
        const html = tableNode.outerHTML;
        const divParent = nodeParentDiv(tableNode);
        if (divParent === null || !divParent.classList.contains('joplin-table-wrapper')) {
          return `\n\n<div class="joplin-table-wrapper">${html}</div>\n\n`;
        }
        return html;
      }

      if (tableShouldBeSkipped(tableNode)) return content;

      const normalized = content.replace(/\n+/g, '\n');

      const lines = normalized.trim().split('\n');
      const secondLine = lines.length >= 2 ? lines[1] : '';
      const secondLineIsDivider = /\| :?---/.test(secondLine);

      const columnCount = tableColCount(tableNode);
      let emptyHeader = '';
      if (columnCount && !secondLineIsDivider) {
        emptyHeader = `|${'     |'.repeat(columnCount)}\n|`;
        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
          emptyHeader += ` ${getBorder(getColumnAlignment(tableNode, columnIndex))} |`;
        }
      }

      const captionNode = tableNode.querySelector
        ? tableNode.querySelector('caption')
        : tableNode.caption;
      const captionContent = captionNode?.textContent ?? '';
      const caption = captionContent ? `${captionContent}\n\n` : '';
      const tableContent = `${emptyHeader}${normalized}`.trimStart();
      return `\n\n${caption}${tableContent}\n\n`;
    },
  },

  tableCaption: {
    filter: ['caption'],
    replacement: () => '',
  },

  tableColgroup: {
    filter: ['colgroup', 'col'],
    replacement: () => '',
  },

  tableSection: {
    filter: ['thead', 'tbody', 'tfoot'],
    replacement: content => content,
  },
};

type TurndownServiceWithCodeBlock = TurndownService & {
  isCodeBlock?: (node: Node) => boolean;
};

export function tables(turndownService: TurndownServiceWithCodeBlock): void {
  isCodeBlock_ = turndownService.isCodeBlock ?? null;
  options_ = turndownService.options;

  turndownService.keep(node => (
    node.nodeName === 'TABLE' &&
    tableShouldBeHtml(node as HTMLTableElement, turndownService.options)
  ));

  for (const key of Object.keys(tableRules)) {
    turndownService.addRule(key, tableRules[key]);
  }
}

// ---------------------------------------------------------------------------
// taskListItems
// ---------------------------------------------------------------------------

export function taskListItems(turndownService: TurndownService): void {
  turndownService.addRule('taskListItems', {
    filter(node) {
      const parent = node.parentNode as Element;
      const grandparent = parent?.parentNode as Element | null;
      const grandparentIsListItem = !!grandparent && grandparent.nodeName === 'LI';
      return (
        node.getAttribute('role') === 'checkbox' &&
        (
          parent.nodeName === 'LI' ||
          (parent.nodeName === 'LABEL' && grandparentIsListItem) ||
          (parent.nodeName === 'SPAN' && grandparentIsListItem)
        )
      );
    },
    replacement(_content, node) {
      const checked = node.getAttribute('aria-checked') === 'true';
      return `${checked ? '[x]' : '[ ]'} `;
    },
  });
}

// ---------------------------------------------------------------------------
// gfm — composite plugin
// ---------------------------------------------------------------------------

export function gfm(turndownService: TurndownService): void {
  turndownService.use([
    highlightedCodeBlock,
    strikethrough,
    tables,
    taskListItems,
  ] as Array<(ts: TurndownService) => void>);
  const options = turndownService.options as TableOptions;
  options.preserveTableStyles = true;
  options.preserveNestedTables = true;
}
