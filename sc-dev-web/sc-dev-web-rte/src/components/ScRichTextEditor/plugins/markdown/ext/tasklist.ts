// Markdown-it plugin to render GitHub-style task lists; see
// ported from https://github.com/revin/markdown-it-task-lists

import type MarkdownIt from 'markdown-it';

export interface TaskListOptions {
  enabled?: boolean;
  label?: boolean;
  labelAfter?: boolean;
}

type TaskListChildToken = {
  content: string;
};

type TaskListToken = {
  type: string;
  level: number;
  content: string;
  children: TaskListChildToken[];
  attrs: Array<[string, string]> | null;
  attrIndex(name: string): number;
  attrPush(attr: [string, string]): void;
};

type HtmlInlineToken = {
  content: string;
  attrs?: Array<{ for: string }>;
};

type TokenConstructor = new (
  type: string,
  tag: string,
  nesting: number
) => unknown;

let disableCheckboxes = true;
let useLabelWrapper = false;
let useLabelAfter = false;

export function mdTasklist(md: MarkdownIt, options?: TaskListOptions): void {
  if (options) {
    disableCheckboxes = !options.enabled;
    useLabelWrapper = !!options.label;
    useLabelAfter = !!options.labelAfter;
  }

  md.core.ruler.after('inline', 'github-task-lists', state => {
    const tokens = state.tokens as TaskListToken[];
    for (let i = 2; i < tokens.length; i++) {
      if (isTodoItem(tokens, i)) {
        todoify(tokens[i], state.Token as unknown as TokenConstructor);
        attrSet(
          tokens[i - 2],
          'class',
          `task-list-item${!disableCheckboxes ? ' enabled' : ''}`
        );

        const parentIndex = parentToken(tokens, i - 2);
        if (parentIndex >= 0) {
          attrSet(tokens[parentIndex], 'class', 'contains-task-list');
        }
      }
    }
  });
}

function attrSet(token: TaskListToken, name: string, value: string): void {
  const index = token.attrIndex(name);
  const attr: [string, string] = [name, value];

  if (index < 0) {
    token.attrPush(attr);
  } else if (token.attrs) {
    token.attrs[index] = attr;
  }
}

function parentToken(tokens: TaskListToken[], index: number): number {
  const targetLevel = tokens[index].level - 1;
  for (let i = index - 1; i >= 0; i--) {
    if (tokens[i].level === targetLevel) {
      return i;
    }
  }
  return -1;
}

function isTodoItem(tokens: TaskListToken[], index: number): boolean {
  return (
    isInline(tokens[index]) &&
    isParagraph(tokens[index - 1]) &&
    isListItem(tokens[index - 2]) &&
    startsWithTodoMarkdown(tokens[index])
  );
}

function todoify(
  token: TaskListToken,
  TokenConstructor: TokenConstructor
): void {
  token.children.unshift(makeCheckbox(token, TokenConstructor));

  if (token.children[1]) {
    token.children[1].content = token.children[1].content.slice(3);
  }

  token.content = token.content.slice(3);

  if (useLabelWrapper) {
    if (useLabelAfter) {
      const id = `task-item-${Math.ceil(
        Math.random() * (10000 * 1000) - 1000
      )}`;
      token.children[0].content = `${token.children[0].content.slice(
        0,
        -1
      )} id="${id}">`;
      token.children.splice(1, 0, beginAfterLabel(id, TokenConstructor));
      token.children.push(endLabel(TokenConstructor));
    } else {
      token.children.unshift(beginLabel(TokenConstructor));
      token.children.push(endLabel(TokenConstructor));
    }
  }
}

function makeCheckbox(
  token: TaskListToken,
  TokenConstructor: TokenConstructor
): HtmlInlineToken {
  const checkbox = new TokenConstructor(
    'html_inline',
    '',
    0
  ) as HtmlInlineToken;
  const isChecked =
    token.content.indexOf('[x] ') === 0 || token.content.indexOf('[X] ') === 0;
  checkbox.content = `<span class="task-list-item-marker mceNonEditable" contenteditable="false" role="checkbox" ${
    disableCheckboxes ? 'aria-disabled' : ''
  } aria-checked="${isChecked ? 'true' : 'false'}">${
    isChecked ? '[x]' : '[ ]'
  }</span>`;

  return checkbox;
}

// These next two functions are kind of hacky; probably should really be a
// true block-level token with .tag == 'label'.
function beginLabel(TokenConstructor: TokenConstructor): HtmlInlineToken {
  const token = new TokenConstructor('html_inline', '', 0) as HtmlInlineToken;
  token.content = '<label>';
  return token;
}

function endLabel(TokenConstructor: TokenConstructor): HtmlInlineToken {
  const token = new TokenConstructor('html_inline', '', 0) as HtmlInlineToken;
  token.content = '</label>';
  return token;
}

function afterLabel(
  id: string,
  TokenConstructor: TokenConstructor
): HtmlInlineToken {
  const token = new TokenConstructor('html_inline', '', 0) as HtmlInlineToken;
  token.content = `<label class="task-list-item-label" for="${id}">`;
  token.attrs = [{ for: id }];
  return token;
}

function beginAfterLabel(
  id: string,
  TokenConstructor: TokenConstructor
): HtmlInlineToken {
  return afterLabel(id, TokenConstructor);
}

function isInline(token: TaskListToken): boolean {
  return token.type === 'inline';
}

function isParagraph(token: TaskListToken): boolean {
  return token.type === 'paragraph_open';
}

function isListItem(token: TaskListToken): boolean {
  return token.type === 'list_item_open';
}

function startsWithTodoMarkdown(token: TaskListToken): boolean {
  // Leading whitespace in a list item is already trimmed off by markdown-it.
  return (
    token.content.indexOf('[ ] ') === 0 ||
    token.content.indexOf('[x] ') === 0 ||
    token.content.indexOf('[X] ') === 0
  );
}

