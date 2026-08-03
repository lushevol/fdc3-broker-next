const pluginCapture: { factory?: (editor: any) => any } = {};

jest.mock('hugerte/hugerte.js', () => {
  (window as any).hugerte = {
    PluginManager: {
      add: (_id: string, factory: (editor: any) => any) => {
        pluginCapture.factory = factory;
      },
    },
  };
});

jest.mock('@highlightjs/cdn-assets/es/highlight.js', () => ({
  __esModule: true,
  default: {
    getLanguage: (_lang: string) => !!_lang,
    highlight: (str: string) => ({ value: str }),
  },
}));

// eslint-disable-next-line import/first
import {
  markdownToHtml,
  htmlToMarkdown,
} from '../../../../../src/components/ScRichTextEditor/plugins/markdown/converter.js';
// eslint-disable-next-line import/first
import TurndownService from 'turndown';
// eslint-disable-next-line import/first
import {
  gfm,
  tables,
  taskListItems,
} from '../../../../../src/components/ScRichTextEditor/plugins/markdown/ext/gfm.js';
// eslint-disable-next-line import/first
import { mdTasklist } from '../../../../../src/components/ScRichTextEditor/plugins/markdown/ext/tasklist.js';
// eslint-disable-next-line import/first
import '../../../../../src/components/ScRichTextEditor/plugins/markdown/markdown-plugin.js';

function buildPlugin() {
  const handlers: Record<string, ((e: any) => void)[]> = {};
  const onceHandlers: Record<string, ((e: any) => void)[]> = {};
  const editor: any = {
    removed: false,
    dom: { addStyle: jest.fn() },
    options: { register: jest.fn() },
    on: jest.fn((event: string, cb: (e: any) => void) => {
      if (!handlers[event]) handlers[event] = [];
      handlers[event].push(cb);
    }),
    once: jest.fn((event: string, cb: (e: any) => void) => {
      if (!onceHandlers[event]) onceHandlers[event] = [];
      onceHandlers[event].push(cb);
    }),
    getBody: jest.fn(() => document.body),
    getContent: jest.fn(() => ''),
    setContent: jest.fn(),
    dispatch: jest.fn(),
  };

  const api = pluginCapture.factory?.(editor);
  return { api, editor, handlers, onceHandlers };
}

function buildTurndown(options?: Record<string, unknown>) {
  const service = new TurndownService({
    codeBlockStyle: 'fenced',
  } as any);

  if (options) Object.assign((service as any).options, options);

  return service;
}

function buildRuleHarness(options?: Record<string, unknown>) {
  const rules: Record<string, any> = {};
  let keepFilter: ((node: Node) => boolean) | undefined;

  const service: any = {
    options: options ?? {},
    isCodeBlock: null,
    keep: (filter: (node: Node) => boolean) => {
      keepFilter = filter;
    },
    addRule: (name: string, rule: any) => {
      rules[name] = rule;
    },
  };

  return {
    service,
    rules,
    getKeepFilter: () => keepFilter,
  };
}

function buildTasklistToken(
  type: string,
  level: number,
  content = '',
  attrs: Array<[string, string]> | null = []
) {
  return {
    type,
    level,
    content,
    children: content ? [{ content }] : [],
    attrs,
    attrIndex(name: string) {
      return this.attrs
        ? this.attrs.findIndex((attr: [string, string]) => attr[0] === name)
        : -1;
    },
    attrPush(attr: [string, string]) {
      if (!this.attrs) this.attrs = [];
      this.attrs.push(attr);
    },
  };
}

function buildTasklistHarness(options?: Record<string, unknown>) {
  let rule: ((state: any) => void) | undefined;
  const md: any = {
    core: {
      ruler: {
        after: (
          _anchor: string,
          _name: string,
          callback: (state: any) => void
        ) => {
          rule = callback;
        },
      },
    },
  };

  mdTasklist(md, {
    enabled: false,
    label: false,
    labelAfter: false,
    ...(options ?? {}),
  } as any);

  class TokenMock {
    content = '';

    attrs?: Array<{ for: string }>;

    constructor(_type: string, _tag: string, _nesting: number) {}
  }

  return {
    run(tokens: any[]) {
      rule?.({ tokens, Token: TokenMock });
      return tokens;
    },
  };
}

describe('markdown-plugin API', () => {
  it('captures plugin factory', () => {
    expect(typeof pluginCapture.factory).toBe('function');
  });

  it('BeforeSetContent converts md content', () => {
    const { handlers } = buildPlugin();
    const event = { format: 'md', content: '**bold**' };
    handlers.BeforeSetContent[0](event);
    expect(event.format).toBe('html');
    expect(event.content).toContain('<strong>bold</strong>');
  });

  it('BeforeSetContent ignores non-md format', () => {
    const { handlers } = buildPlugin();
    const event = { format: 'html', content: '**bold**' };
    handlers.BeforeSetContent[0](event);
    expect(event.format).toBe('html');
    expect(event.content).toBe('**bold**');
  });

  it('GetContent converts html to md after init', () => {
    const { handlers } = buildPlugin();
    handlers.init[0]({});
    const event = { format: 'md', content: '<p><strong>bold</strong></p>' };
    handlers.GetContent[0](event);
    expect(event.content).toBe('**bold**');
  });

  it('GetContent ignores non-md format', () => {
    const { handlers } = buildPlugin();
    handlers.init[0]({});
    const event = { format: 'html', content: '<p><strong>bold</strong></p>' };
    handlers.GetContent[0](event);
    expect(event.content).toBe('<p><strong>bold</strong></p>');
  });

  it('click on summary toggles details open attribute', () => {
    const { handlers } = buildPlugin();
    handlers.init[0]({});

    const details = document.createElement('details');
    const summary = document.createElement('summary');
    details.append(summary);

    handlers.click[0]({ target: summary });
    expect(details.hasAttribute('open')).toBe(true);

    const div = document.createElement('div');
    handlers.click[0]({ target: div });
    expect(details.hasAttribute('open')).toBe(true);
  });

  it('paste markdown-like plaintext registers PastePreProcess converter', () => {
    const { handlers, onceHandlers } = buildPlugin();
    const clipboardData = {
      getData: (type: string) => (type === 'text/plain' ? '**bold** text' : ''),
    };

    handlers.paste[0]({ clipboardData });

    expect(onceHandlers.PastePreProcess).toHaveLength(1);
    expect(onceHandlers.PastePostProcess).toBeUndefined();

    const preEvent = { content: 'ignored' };
    onceHandlers.PastePreProcess[0](preEvent);
    expect(preEvent.content).toContain('<strong>bold</strong>');
  });

  it('paste plain text without markdown does sanitize path', () => {
    const { handlers, onceHandlers } = buildPlugin();
    const clipboardData = {
      getData: (type: string) => (type === 'text/plain' ? 'plain text' : ''),
    };

    handlers.paste[0]({ clipboardData });

    expect(onceHandlers.PastePreProcess).toHaveLength(1);
    expect(onceHandlers.PastePostProcess).toHaveLength(1);
  });

  it('paste html/plain content sanitizes and strips non-align styles', () => {
    const { editor, handlers, onceHandlers } = buildPlugin();
    const clipboardData = {
      getData: (type: string) =>
        type === 'text/plain' ? 'plain text' : '<p>formatted</p>',
    };

    handlers.paste[0]({ clipboardData });

    expect(onceHandlers.PastePreProcess).toHaveLength(1);
    expect(onceHandlers.PastePostProcess).toHaveLength(1);

    const preEvent = {
      content:
        '<img src="x" onerror="alert(1)"><script>alert(1)</script><p>ok</p>',
    };
    onceHandlers.PastePreProcess[0](preEvent);
    expect(preEvent.content).not.toContain('<script');
    expect(preEvent.content).not.toContain('onerror=');

    const body = document.createElement('div');
    body.style.textAlign = 'left';
    editor.getBody.mockReturnValue(body);

    const node = document.createElement('div');
    node.innerHTML =
      '<p style="text-align:center;color:red">x</p><table><tr><td>1</td></tr></table>';

    onceHandlers.PastePostProcess[0]({ node });

    const paragraph = node.querySelector('p') as HTMLParagraphElement;
    const table = node.querySelector('table') as HTMLTableElement;
    expect(paragraph.style.textAlign).toBe('center');
    expect(paragraph.style.color).toBe('');
    expect(table.getAttribute('border')).toBe('1');
  });

  it('paste uses window.clipboardData fallback when clipboardData missing', () => {
    const { handlers, onceHandlers } = buildPlugin();
    (window as any).clipboardData = {
      getData: (type: string) => (type === 'text/plain' ? '**bold**' : ''),
    };

    handlers.paste[0]({});

    expect(onceHandlers.PastePreProcess).toHaveLength(1);
    delete (window as any).clipboardData;
  });

  it('getMetadata returns plugin metadata', () => {
    const { api } = buildPlugin();
    expect(api.getMetadata()).toEqual({
      name: 'SC Markdown',
      url: 'https://github.com/scdevkit/webkit-rte',
    });
  });

  it('getMarkdown and setMarkdown honor removed state', () => {
    const { api, editor } = buildPlugin();
    editor.getContent.mockReturnValue('# title\n');
    expect(api.getMarkdown()).toBe('# title\n');

    api.setMarkdown('# hello');
    expect(editor.setContent).toHaveBeenCalledWith('# hello', { format: 'md' });

    editor.removed = true;
    expect(api.getMarkdown()).toBe('');
    api.setMarkdown('# noop');
  });
});

describe('markdown conversion', () => {
  describe('Core Markdown', () => {
    it('Paragraphs (core paragraph render and html->md paragraph conversion)', () => {
      expect(markdownToHtml('Hello world')).toContain('<p>Hello world</p>');
      expect(htmlToMarkdown('<p>Hello world</p>')).toBe('Hello world');
    });

    it('Horizontal rules: ---, ***, ___ (normalized html->md emits ---)', () => {
      expect(markdownToHtml('---')).toContain('<hr');
      expect(htmlToMarkdown('<hr>')).toBe('---');
    });

    it('ATX headings: # through ###### (normalization keeps ATX on export)', () => {
      expect(markdownToHtml('## Heading 2')).toContain('<h2>Heading 2</h2>');
      expect(htmlToMarkdown('<h2>Heading 2</h2>')).toBe('## Heading 2');
    });

    it('Nested blockquotes (md->html nesting and html->md quote marker)', () => {
      expect(markdownToHtml('> outer\n> > inner')).toContain('<blockquote>');
      expect(
        htmlToMarkdown('<blockquote><p>quoted</p></blockquote>')
      ).toContain('> quoted');
    });

    it('Inline code spans (md->html code tag and html->md backticks)', () => {
      expect(markdownToHtml('Use `code` here')).toContain('<code>code</code>');
      expect(htmlToMarkdown('<code>code</code>')).toContain('`code`');
    });

    it('Fenced code blocks with backticks + code blocks output fixed to fenced blocks', () => {
      expect(markdownToHtml('```\nconst x = 1;\n```')).toContain(
        '<pre class="hljs">'
      );
      expect(htmlToMarkdown('<pre><code>const x = 1;</code></pre>')).toContain(
        '```'
      );
    });

    it('Ordered lists (md->html ol and html->md numbered list)', () => {
      expect(markdownToHtml('1. first\n2. second')).toContain('<ol>');
      expect(htmlToMarkdown('<ol><li>first</li><li>second</li></ol>')).toMatch(
        /1\.\s+first/
      );
    });

    it('Unordered lists with -, *, + (html->md normalizes bullet marker to -)', () => {
      expect(markdownToHtml('- one\n- two')).toContain('<ul>');
      expect(htmlToMarkdown('<ul><li>one</li><li>two</li></ul>')).toMatch(
        /-\s+one/
      );
    });

    it('Extras: hard breaks, escapes, blank-line paragraphs, setext, indented code, tilde fence, info strings', () => {
      const hardBreakHtml = markdownToHtml('line 1  \nline 2');
      expect(hardBreakHtml).toContain('<br');

      const escapedHtml = markdownToHtml('\\*literal\\*');
      expect(escapedHtml).toContain('*literal*');

      const paragraphHtml = markdownToHtml('para one\n\npara two');
      expect(paragraphHtml).toContain('<p>para one</p>');
      expect(paragraphHtml).toContain('<p>para two</p>');

      expect(markdownToHtml('Heading\n===')).toContain('<h1>Heading</h1>');
      expect(markdownToHtml('Heading\n---')).toContain('<h2>Heading</h2>');

      expect(markdownToHtml('    code block')).toContain(
        '<pre><code>code block'
      );
      expect(markdownToHtml('~~~\ncode\n~~~')).toContain('<pre class="hljs">');
      expect(markdownToHtml('```json\n{"a":1}\n```')).toContain(
        'language-json'
      );
    });

    it('Structure extras: mixed nesting, loose vs tight, multi-paragraph items, blockquote/list interop', () => {
      const mixed = markdownToHtml('1. one\n   - two');
      expect(mixed).toContain('<ol>');
      expect(mixed).toContain('<ul>');

      const looseVsTight = markdownToHtml('- one\n\n- two');
      expect(looseVsTight).toContain('<p>one</p>');

      const multiPara = markdownToHtml('- one\n\n  two');
      expect(multiPara).toContain('<p>one</p>');
      expect(multiPara).toContain('<p>two</p>');

      expect(markdownToHtml('- item\n  > quote')).toContain('<blockquote>');
      expect(markdownToHtml('> - one\n> - two')).toContain('<ul>');
    });
  });

  describe('Inline Emphasis', () => {
    it('Italic with *text* and _text_ (normalization emits _ delimiter)', () => {
      expect(markdownToHtml('_italic_')).toContain('<em>italic</em>');
      expect(htmlToMarkdown('<p><em>italic</em></p>')).toBe('_italic_');
    });

    it('Bold with **text** and __text__ (normalization emits ** delimiter)', () => {
      expect(markdownToHtml('**bold**')).toContain('<strong>bold</strong>');
      expect(htmlToMarkdown('<p><strong>bold</strong></p>')).toBe('**bold**');
    });

    it('Strikethrough ~~text~~ (covers GFM strikethrough conversion)', () => {
      expect(markdownToHtml('~~dead~~')).toContain('<s>dead</s>');
      expect(htmlToMarkdown('<del>dead</del>')).toContain('~~dead~~');
    });

    it('Extras: * and __ variants, bold+italic nesting, nested edge, escapes in emphasis', () => {
      expect(markdownToHtml('*italic*')).toContain('<em>italic</em>');
      expect(markdownToHtml('__bold__')).toContain('<strong>bold</strong>');
      expect(markdownToHtml('***combo***')).toContain(
        '<em><strong>combo</strong></em>'
      );
      expect(markdownToHtml('**outer _inner_**')).toContain(
        '<strong>outer <em>inner</em></strong>'
      );
      expect(markdownToHtml('_escaped \\_ value_')).toContain(
        '<em>escaped _ value</em>'
      );
    });
  });

  describe('Links', () => {
    it('Inline links [text](url) + link output fixed to inline links', () => {
      expect(markdownToHtml('[label](https://example.com)')).toContain(
        'href="https://example.com"'
      );
      expect(
        htmlToMarkdown('<a href="https://example.com">label</a>')
      ).toContain('[label](https://example.com)');
    });

    it('Title-bearing links [text](url "title") and title retention on html->md', () => {
      expect(markdownToHtml('[label](https://example.com "title")')).toContain(
        'title="title"'
      );
      expect(
        htmlToMarkdown('<a href="https://example.com" title="title">label</a>')
      ).toContain('[label](https://example.com "title")');
    });

    it('Safe HTML attrs on render: rel, target (security allow-list behavior)', () => {
      const html = markdownToHtml('[x](https://example.com)');
      expect(html).toContain('rel="noopener noreferrer"');
      expect(html).toContain('target="_blank"');
    });

    it('Extras: autolinks, bare URLs, relative/root/anchor, reference styles, nested text, protocol sanitization', () => {
      expect(markdownToHtml('<https://example.com>')).toContain(
        'href="https://example.com"'
      );
      expect(markdownToHtml('<a@b.com>')).toContain('mailto:a@b.com');
      expect(markdownToHtml('visit https://example.com/path')).toContain(
        'href="https://example.com/path"'
      );

      expect(markdownToHtml('[rel](docs/readme.md)')).toContain(
        'href="docs/readme.md"'
      );
      expect(markdownToHtml('[root](/docs/readme.md)')).toContain(
        'href="/docs/readme.md"'
      );
      expect(markdownToHtml('[anchor](#top)')).toContain('href="#top"');

      const refMd = ['[text][id]', '', '[id]: https://example.com'].join('\n');
      const collapsedMd = ['[text][]', '', '[text]: https://example.com'].join(
        '\n'
      );
      const shortcutMd = ['[text]', '', '[text]: https://example.com'].join(
        '\n'
      );
      expect(markdownToHtml(refMd)).toContain('href="https://example.com"');
      expect(markdownToHtml(collapsedMd)).toContain(
        'href="https://example.com"'
      );
      expect(markdownToHtml(shortcutMd)).toContain(
        'href="https://example.com"'
      );

      const nested = markdownToHtml('[**b** `c`](https://example.com)');
      expect(nested).toContain('<strong>b</strong>');
      expect(nested).toContain('<code>c</code>');

      const jsProtocol = markdownToHtml('[x](javascript:alert(1))');
      expect(jsProtocol).not.toContain('<a href="javascript:alert(1)"');
      expect(jsProtocol).toContain('[x](javascript:alert(1))');
    });
  });

  describe('Images', () => {
    it('Inline images ![alt](src) + alt text preservation on html->md', () => {
      expect(markdownToHtml('![alt](img.png)')).toContain('<img');
      expect(htmlToMarkdown('<img src="img.png" alt="alt">')).toContain(
        '![alt](img.png)'
      );
    });

    it('Image titles ![alt](src "title") and title retention on html->md', () => {
      expect(markdownToHtml('![alt](img.png "title")')).toContain(
        'title="title"'
      );
      expect(
        htmlToMarkdown('<img src="img.png" alt="alt" title="title">')
      ).toContain('![alt](img.png "title")');
    });

    it('Azure image-size syntax ![alt](img.png =500x250) round-trip', () => {
      expect(markdownToHtml('![alt](img.png =120x80)')).toContain(
        'width="120"'
      );
      expect(
        htmlToMarkdown('<img src="img.png" alt="alt" width="120" height="80">')
      ).toBe('![alt](img.png =120x80)');
    });

    it('Extras: relative/absolute/external paths and image-inside-link behavior', () => {
      expect(markdownToHtml('![a](./img.png)')).toContain('src="./img.png"');
      expect(markdownToHtml('![a](/img.png)')).toContain('src="/img.png"');
      expect(markdownToHtml('![a](https://example.com/img.png)')).toContain(
        'src="https://example.com/img.png"'
      );

      const html = markdownToHtml(
        '[![alt text](img.png)](https://example.com)'
      );
      expect(html).toContain('<a href="https://example.com"');
      expect(html).toContain('alt="alt text"');
    });
  });

  describe('GitHub Flavored Markdown', () => {
    describe('Tables', () => {
      it('Tables: markdown render + html->md conversion + GFM table normalization', () => {
        expect(markdownToHtml('| A | B |\n|---|---|\n| 1 | 2 |')).toContain(
          '<table border="1">'
        );
        expect(
          htmlToMarkdown(
            '<table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'
          )
        ).toMatch(/\|\s*-+\s*\|/);
      });

      it('Tables: header row required/normalized via tbody-only empty header synthesis', () => {
        const markdown = htmlToMarkdown(
          '<table><tbody><tr><td>one</td><td>two</td></tr></tbody></table>'
        );

        expect(markdown).toContain('|     |     |');
        expect(markdown).toContain('| --- | --- |');
        expect(markdown).toContain('| one | two |');
      });

      it('Tables: caption policy + strip colgroup/col markup', () => {
        const markdown = htmlToMarkdown(
          '<table><caption>Stats</caption><colgroup><col><col></colgroup><tbody><tr><td>1</td><td>2</td></tr></tbody></table>'
        );

        expect(markdown).toContain('Stats');
        expect(markdown).not.toContain('colgroup');
        expect(markdown).not.toContain('<col');
      });

      it('Tables fallback policy: nested list in cell keeps wrapped raw html', () => {
        const markdown = htmlToMarkdown(
          '<table><tbody><tr><td><ul><li>nested</li></ul></td><td>plain</td></tr></tbody></table>'
        );

        expect(markdown).toContain('<div class="joplin-table-wrapper">');
        expect(markdown).toContain('<table>');
        expect(markdown).toContain('<ul>');
      });

      it('Tables fallback policy: no double-wrap for existing joplin-table-wrapper', () => {
        const service = buildTurndown({ preserveNestedTables: true });
        tables(service as any);

        const markdown = service.turndown(
          `<div class="joplin-table-wrapper">
            <table><tbody><tr><td>
              <table><tbody><tr><td>inner</td><td>value</td></tr></tbody></table>
            </td><td>plain</td></tr></tbody></table>
          </div>`
        );

        expect(markdown).toContain('<table>');
        expect(markdown).not.toContain('joplin-table-wrapper');
      });

      it('Tables: colspan expansion fallback + column alignment round-trip markers', () => {
        const service = buildTurndown();
        tables(service as any);

        const markdown = service.turndown(
          `<table>
            <thead><tr><th align="left">A</th><th align="right">B</th><th align="center">C</th></tr></thead>
            <tbody><tr><td colspan="2">wide</td><td>mid</td></tr></tbody></table>`
        );

        expect(markdown).toContain('| :--- | ---: | :---: |');
        expect(markdown).toContain('| wide |     | mid |');
      });

      it('Tables: rowspan fallback keeps full wrapped html (no flattening)', () => {
        const markdown = htmlToMarkdown(
          '<table><tbody><tr><td rowspan="2">A</td><td>B</td></tr><tr><td>C</td></tr></tbody></table>'
        );

        expect(markdown).toContain('<div class="joplin-table-wrapper">');
        expect(markdown).toContain('rowspan="2"');
      });

      it('Tables: styled-table fallback keeps wrapped html when preserveTableStyles enabled', () => {
        const service = buildTurndown({ preserveTableStyles: true });
        gfm(service);

        const markdown = service.turndown(
          '<table cellpadding="4"><tbody><tr><td style="background: yellow">x</td><td>y</td></tr></tbody></table>'
        );

        expect(markdown).toContain('joplin-table-wrapper');
        expect(markdown).toContain('background: yellow');
      });

      it('preserveTableStyles keep filter checks row or cell formatting only', () => {
        const { service, getKeepFilter } = buildRuleHarness({
          preserveTableStyles: true,
        });
        tables(service as any);

        const doc = new DOMParser().parseFromString(
          '<table><tbody><tr style="background: yellow"><td>x</td><td bordercolor="red">y</td></tr></tbody></table>',
          'text/html'
        );
        const table = doc.querySelector('table');

        expect(table).not.toBeNull();
        expect(getKeepFilter()?.(table as HTMLTableElement)).toBe(true);
      });

      it('preserveTableStyles keep filter ignores default spacing and plain tables', () => {
        const { service, getKeepFilter } = buildRuleHarness({
          preserveTableStyles: true,
        });
        tables(service as any);

        const doc = new DOMParser().parseFromString(
          '<table cellpadding="0" cellspacing="0"><tbody><tr><td>x</td><td>y</td></tr></tbody></table>',
          'text/html'
        );
        const table = doc.querySelector('table');

        expect(table).not.toBeNull();
        expect(getKeepFilter()?.(table as HTMLTableElement)).toBe(false);
      });
    });

    describe('Task lists', () => {
      it('Task lists - [ ] / - [x]: markdown render + html checkbox to markdown conversion', () => {
        const original = 'done\n\n-   [ ]  item 1\n-   [x]  item 2';
        const html = markdownToHtml(original);

        const root = document.createElement('div');
        root.innerHTML = html;

        const items = root.querySelectorAll<HTMLElement>(
          'ul > li.task-list-item'
        );
        expect(items.length).toBe(2);
        expect(items[0].textContent).toBe('[ ]  item 1');
        expect(items[1].textContent).toBe('[x]  item 2');

        expect(htmlToMarkdown(html)).toBe(original);
      });

      it('Task lists conversion handles aria checkbox markers in label/span wrappers', () => {
        const { service, rules } = buildRuleHarness();
        taskListItems(service);

        const li = document.createElement('li');
        const label = document.createElement('label');
        const spanWrapper = document.createElement('span');
        li.append(label, spanWrapper);

        const checked = document.createElement('span');
        checked.setAttribute('role', 'checkbox');
        checked.setAttribute('aria-checked', 'true');
        label.append(checked);

        const unchecked = document.createElement('span');
        unchecked.setAttribute('role', 'checkbox');
        unchecked.setAttribute('aria-checked', 'false');
        spanWrapper.append(unchecked);

        expect(rules.taskListItems.filter(checked)).toBe(true);
        expect(rules.taskListItems.filter(unchecked)).toBe(true);
        expect(rules.taskListItems.replacement('', checked)).toBe('[x] ');
        expect(rules.taskListItems.replacement('', unchecked)).toBe('[ ] ');
      });

      it('Task list plugin options: enabled checkbox + uppercase [X] marker support', () => {
        const harness = buildTasklistHarness({ enabled: true });
        const tokens = [
          buildTasklistToken('bullet_list_open', 0),
          buildTasklistToken('list_item_open', 1, '', [['class', 'old-value']]),
          buildTasklistToken('paragraph_open', 2),
          buildTasklistToken('inline', 3, '[X] done'),
        ];

        harness.run(tokens);

        expect(tokens[1].attrs).toContainEqual([
          'class',
          'task-list-item enabled',
        ]);
        expect(tokens[3].children[0].content).toContain('aria-checked="true"');
        expect(tokens[3].children[0].content).not.toContain('aria-disabled');
      });

      it('Task list plugin options: wrap checkbox in label when label=true', () => {
        const harness = buildTasklistHarness({ label: true });
        const tokens = [
          buildTasklistToken('bullet_list_open', 0),
          buildTasklistToken('list_item_open', 1),
          buildTasklistToken('paragraph_open', 2),
          buildTasklistToken('inline', 3, '[x] done'),
        ];

        harness.run(tokens);

        expect(tokens[3].children[0].content).toBe('<label>');
        expect(tokens[3].children[1].content).toContain('aria-checked="true"');
        expect(tokens[3].children[tokens[3].children.length - 1].content).toBe(
          '</label>'
        );
      });

      it('Task list plugin options: move label after checkbox when labelAfter=true', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.5);
        const harness = buildTasklistHarness({
          label: true,
          labelAfter: true,
        });
        const tokens = [
          buildTasklistToken('bullet_list_open', 0),
          buildTasklistToken('list_item_open', 1),
          buildTasklistToken('paragraph_open', 2),
          buildTasklistToken('inline', 3, '[x] done'),
        ];

        harness.run(tokens);

        const trailingLabel = tokens[3].children[
          tokens[3].children.length - 1
        ] as { content: string; attrs?: Array<{ for: string }> };
        const openingLabel = tokens[3].children[1] as {
          content: string;
          attrs?: Array<{ for: string }>;
        };

        expect(tokens[3].children[0].content).toMatch(/id="task-item-/);
        expect(openingLabel.content).toContain(
          '<label class="task-list-item-label"'
        );
        expect(openingLabel.attrs?.[0]).toEqual(
          expect.objectContaining({
            for: expect.stringMatching(/^task-item-/),
          })
        );
        expect(trailingLabel.content).toBe('</label>');

        (Math.random as jest.Mock).mockRestore();
      });

      it('ignores non-task inline items', () => {
        const harness = buildTasklistHarness();
        const tokens = [
          buildTasklistToken('bullet_list_open', 0),
          buildTasklistToken('list_item_open', 1),
          buildTasklistToken('paragraph_open', 2),
          buildTasklistToken('inline', 3, 'plain item'),
        ];

        harness.run(tokens);

        expect(tokens[1].attrs).toEqual([]);
        expect(tokens[3].content).toBe('plain item');
        expect(tokens[3].children[0].content).toBe('plain item');
      });
    });

    describe('Code blocks', () => {
      it('Fenced code with language identifiers + language tag preserved on html->md', () => {
        expect(markdownToHtml('```ts\nconst a = 1;\n```')).toContain(
          'language-ts'
        );
        expect(
          htmlToMarkdown(
            '<pre><code class="language-ts">const a = 1;</code></pre>'
          )
        ).toContain('```');
      });

      it('Syntax-highlight round-trip: highlight wrapper html converts to fenced markdown', () => {
        const service = buildTurndown();
        gfm(service);

        const markdown = service.turndown(
          '<div class="highlight-source-js"><pre>const a = 1;</pre></div>'
        );

        expect(markdown).toContain('```js');
        expect(markdown).toContain('const a = 1;');
      });
    });

    it('GFM extras: escaped pipes, multiline-cell fallback, ordered task lists, autolink literals', () => {
      const escapedPipes = markdownToHtml(
        '| A | B |\n|---|---|\n| x \\| y | z |'
      );
      expect(escapedPipes).toContain('<td>x | y</td>');

      const multilineCell = htmlToMarkdown(
        '<table><tbody><tr><td>a<br>b</td><td>c</td></tr></tbody></table>'
      );
      expect(multilineCell).toContain('<br>');
      expect(multilineCell).toContain('| a  <br>b | c   |');

      const orderedTasks = markdownToHtml('1. [ ] first\n2. [x] second');
      expect(orderedTasks).toMatch(/<ol\b/);
      expect(orderedTasks).toContain('task-list-item');

      expect(markdownToHtml('autolink https://example.com')).toContain(
        'href="https://example.com"'
      );
    });
  });

  describe('Extensions', () => {
    it('Math block preservation policy: md->html wrapper and html->md $$ round-trip', () => {
      const originalMarkdown = ['$$', '\\frac{a_1}{b_2} + c_3', '$$'].join(
        '\n'
      );
      const html = markdownToHtml(originalMarkdown);
      const roundTrip = htmlToMarkdown(html);

      expect(html).toBe(
        '<pre class="sc-math">$$\n\\frac{a_1}{b_2} + c_3\n$$</pre>'
      );
      expect(roundTrip).toBe(originalMarkdown);
    });

    it('Math block normalization: unescape \\ and _ artifacts from html input', () => {
      const markdown = htmlToMarkdown(
        '<pre class="sc-math">$$\\\\frac{a\\_1}{b\\_2} + c\\_3$$</pre>'
      );

      expect(markdown).toContain('$$\\frac{a_1}{b_2} + c_3$$');
      expect(markdown).not.toContain('\\\\\\\\frac');
      expect(markdown).not.toContain('\\_1');
    });

    it('Footnotes [^1] + footnote definitions round-trip', () => {
      const originalMarkdown = 'text[^1]\n\n[^1]: note';
      const html = markdownToHtml(originalMarkdown);
      const roundTrip = htmlToMarkdown(html);

      expect(html).toBe(
        [
          '<p>text<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup></p>',
          '<section class="footnotes">',
          '<ol class="footnotes-list">',
          '<li id="fn1" class="footnote-item"><p>note <a href="#fnref1" class="footnote-backref">↩︎</a></p>',
          '</li>',
          '</ol>',
          '</section>\n',
        ].join('\n')
      );
      expect(roundTrip).toBe(originalMarkdown);
    });

    it('Definition lists md->html and html->md', () => {
      const original = 'Term\n: Def';
      const html = markdownToHtml(original);
      expect(html.trim()).toBe('<dl>\n<dt>Term</dt>\n<dd>Def</dd>\n</dl>');
      expect(htmlToMarkdown(html)).toBe(original);
    });

    it('Highlight/mark syntax policy (==text== and <mark> conversion)', () => {
      expect(markdownToHtml('==hello==')).toContain('<mark>hello</mark>');
      expect(htmlToMarkdown('<mark>hello</mark>')).toContain(
        '<mark>hello</mark>'
      );
    });

    it('Emoji shortcodes :smile: round-trip through markdown-it + Turndown', () => {
      const originalMarkdown = 'Emoji shortcodes :smile:';
      const html = markdownToHtml(originalMarkdown);
      const roundTrip = htmlToMarkdown(html);

      expect(html).toBe('<p>Emoji shortcodes 😄</p>\n');
      expect(roundTrip).toBe(originalMarkdown);
      expect(htmlToMarkdown('<p>Emoji shortcodes 😄</p>')).toBe(
        'Emoji shortcodes :smile:'
      );
    });

    it('Emoji aliases use stable canonical shortcode for shared glyphs', () => {
      expect(htmlToMarkdown('<p>Face 😆</p>')).toBe('Face :laughing:');
      expect(htmlToMarkdown(markdownToHtml('Face :laughing:'))).toBe(
        'Face :laughing:'
      );
      expect(htmlToMarkdown(markdownToHtml('Face :satisfied:'))).toBe(
        'Face :laughing:'
      );
    });

    it('HTML comments not preserved policy (tinymce/hugerte irrelevant)', () => {
      const originalMarkdown = [
        'Before',
        '',
        '<!-- internal-note -->',
        '',
        'After',
      ].join('\n');

      const expectedRoundTrip = originalMarkdown.replace(
        '\n\n<!-- internal-note -->\n\n',
        '\n\n'
      );

      const html = markdownToHtml(originalMarkdown);
      const roundTrip = htmlToMarkdown(html);
      const fromHtml = htmlToMarkdown(
        '<p>Before</p><!-- internal-note --><p>After</p>'
      );

      expect(html).toBe('<p>Before</p>\n\n<p>After</p>\n');
      expect(roundTrip).toBe(expectedRoundTrip);

      expect(fromHtml).toContain('Before');
      expect(fromHtml).toContain('After');
      expect(fromHtml).not.toContain('internal-note');
    });

    describe('Front matter', () => {
      it('Front matter preservation policy: YAML object table render and round-trip', () => {
        const md = [
          '---',
          'title: Hello',
          'metadata:',
          '  owner:',
          '    profile:',
          '      name: Alice',
          '      links:',
          '        - type: docs',
          '          url: https://example.com/docs',
          '  sections:',
          '    - id: intro',
          '      items:',
          '        - kind: text',
          '          value: Welcome',
          '---',
          '',
          '# Heading',
        ].join('\n');
        const html = markdownToHtml(md);
        expect(html).toContain('metadata-yaml-table');
        expect(htmlToMarkdown(html)).toContain('title: Hello');
      });

      it('Front matter invalid root policy: scalar/array root does not render metadata table', () => {
        const scalarRoot = ['---', 'hello', '---', '', '# Heading'].join('\n');
        const arrayRoot = [
          '---',
          '- one',
          '- two',
          '---',
          '',
          '# Heading',
        ].join('\n');

        expect(markdownToHtml(scalarRoot)).not.toContain('metadata-yaml-table');
        expect(markdownToHtml(arrayRoot)).not.toContain('metadata-yaml-table');
      });

      it('Front matter invalid YAML or missing closing marker fallback policy', () => {
        const invalidYaml = ['---', 'bad: [', '---', '', '# Heading'].join(
          '\n'
        );
        const noClosingMarker = ['---', 'title: Hello', '', '# Heading'].join(
          '\n'
        );

        expect(markdownToHtml(invalidYaml)).not.toContain(
          'metadata-yaml-table'
        );
        expect(markdownToHtml(noClosingMarker)).not.toContain(
          'metadata-yaml-table'
        );
      });

      it('Front matter html object table fallback without rows emits empty object YAML', () => {
        const md = htmlToMarkdown(
          '<table class="metadata-yaml-table object"></table>'
        );
        expect(md).toContain('---');
        expect(md).toContain('{}');
      });

      it('Front matter html table with array class emits YAML array', () => {
        const md = htmlToMarkdown(
          '<table class="metadata-yaml-table array"><tbody><tr><td>one</td><td>2</td></tr></tbody></table>'
        );
        expect(md).toContain('---');
        expect(md).toContain('- one');
        expect(md).toContain('- 2');
      });

      it('Front matter html table no class uses header heuristic (object vs array)', () => {
        const asObject = htmlToMarkdown(
          `<table class="metadata-yaml-table">
            <thead><tr><th>title</th></tr></thead>
            <tbody><tr><td>Hello</td></tr></tbody></table>`
        );
        const asArray = htmlToMarkdown(
          '<table class="metadata-yaml-table"><tbody><tr><td>x</td><td>y</td></tr></tbody></table>'
        );

        expect(asObject).toContain('title: Hello');
        expect(asArray).toContain('- x');
        expect(asArray).toMatch(/-\s+'?y'?/);
      });

      it('Front matter round-trip keeps key order (object insertion order)', () => {
        const md = [
          '---',
          'first: 1',
          'second: 2',
          'third: 3',
          '---',
          '',
          '# Heading',
        ].join('\n');

        const html = markdownToHtml(md);
        const roundTrip = htmlToMarkdown(html);

        expect(roundTrip).toMatch(/first: 1[\s\S]*second: 2[\s\S]*third: 3/);
      });

      it('Front matter extras: ... close marker and top-only parsing', () => {
        const dotCloseHtml = markdownToHtml(
          ['---', 'title: Dot', '...', '', '# Heading'].join('\n')
        );
        expect(dotCloseHtml).toContain('metadata-yaml-table');

        const notTop = markdownToHtml(
          ['# Heading', '', '---', 'title: Later', '---'].join('\n')
        );
        expect(notTop).not.toContain('metadata-yaml-table');
      });

      it('Front matter scalars/arrays/nested objects and typed booleans-null-numbers round-trip', () => {
        const md = [
          '---',
          'title: Hello',
          'published: true',
          'views: 42',
          'ratio: 3.14',
          'archived: null',
          'tags:',
          '  - docs',
          '  - 2',
          'metadata:',
          '  owner:',
          '    name: Alice',
          '    active: false',
          '---',
          '',
          '# Heading',
        ].join('\n');

        const html = markdownToHtml(md);
        const roundTrip = htmlToMarkdown(html);

        expect(html).toContain('metadata-yaml-table object');
        expect(html).toContain('metadata-yaml-table array');
        expect(roundTrip).toContain('title: Hello');
        expect(roundTrip).toContain('tags:');
        expect(roundTrip).toContain('- docs');
        expect(roundTrip).toContain('- 2');
        expect(roundTrip).toContain('metadata:');
        expect(roundTrip).toContain('owner:');
        expect(roundTrip).toContain('name: Alice');
        expect(roundTrip).toMatch(/published:\s*true/);
        expect(roundTrip).toMatch(/views:\s*42/);
        expect(roundTrip).toMatch(/ratio:\s*3\.14/);
        expect(roundTrip).toMatch(/archived:\s*null/);
        expect(roundTrip).toMatch(/active:\s*false/);
      });
    });

    it('[[_TOC_]] preservation round-trip', () => {
      const originalMarkdown = '[[_TOC_]]';
      const html = markdownToHtml(originalMarkdown);
      const roundTrip = htmlToMarkdown(html);

      expect(html).toBe('<p>[[_TOC_]]</p>\n');
      expect(roundTrip).toBe(originalMarkdown);
    });

    it('[[_TOSP_]] preservation round-trip', () => {
      const originalMarkdown = '[[_TOSP_]]';
      const html = markdownToHtml(originalMarkdown);
      const roundTrip = htmlToMarkdown(html);

      expect(html).toBe('<p>[[_TOSP_]]</p>\n');
      expect(roundTrip).toBe(originalMarkdown);
    });

    it('Azure ::: mermaid/video/query-table container preservation and non-linkification policy', () => {
      const markdown = [
        '::: mermaid',
        'graph TD',
        'A --> B',
        ':::',
        '',
        '::: video',
        'https://example.com/video.mp4',
        ':::',
        '',
        '::: query-table',
        'wiql: Select [System.Id] From WorkItems',
        ':::',
      ].join('\n');

      const html = markdownToHtml(markdown);
      const roundTrip = htmlToMarkdown(html);

      expect(html).toBe(
        '<pre class="sc-azure-container">::: mermaid\ngraph TD\nA --&gt; B\n:::</pre><pre class="sc-azure-container">::: video\nhttps://example.com/video.mp4\n:::</pre><pre class="sc-azure-container">::: query-table\nwiql: Select [System.Id] From WorkItems\n:::</pre>'
      );
      expect(roundTrip).toBe(markdown);
    });

    it('Pull-request suggestion fence preservation using p.sc-pull-request wrapper', () => {
      const markdown = [
        'Please update line below.',
        '',
        '```suggestion',
        'const isEditorReady = true;',
        '```',
      ].join('\n');

      const html = markdownToHtml(markdown);
      const roundTrip = htmlToMarkdown(html);

      expect(html).toBe(
        '<p>Please update line below.</p>\n<p class="sc-pull-request">```suggestion<br>const isEditorReady = true;<br>```</p>'
      );
      expect(roundTrip).toBe(markdown);
    });

    it('GitHub/Azure extension extras: mermaid fence, mentions/work item refs, inline and block math, attachments', () => {
      const mermaidMarkdown = '```mermaid\ngraph TD\nA-->B\n```';
      const mermaidHtml = markdownToHtml(mermaidMarkdown);
      const mermaidRoundTrip = htmlToMarkdown(mermaidHtml);
      expect(mermaidHtml).toBe(
        '<pre class="hljs"><code class="hljs language-mermaid scroll">graph TD\nA--&gt;B\n</code></pre>\n'
      );
      expect(mermaidRoundTrip).toBe(mermaidMarkdown);

      const refsMarkdown = 'Track #123 with @user and @<{guid}>';
      const refsHtml = markdownToHtml(refsMarkdown);
      const refsRoundTrip = htmlToMarkdown(refsHtml);
      expect(refsHtml).toBe(
        '<p>Track #123 with @user and @&lt;{guid}&gt;</p>\n'
      );
      expect(refsRoundTrip).toBe(refsMarkdown);

      const inlineMathMarkdown = 'Inline math $a_1 + b_2$ sample';
      const inlineMathHtml = markdownToHtml(inlineMathMarkdown);
      const inlineMathRoundTrip = htmlToMarkdown(inlineMathHtml);
      expect(inlineMathHtml).toBe('<p>Inline math $a_1 + b_2$ sample</p>\n');
      expect(inlineMathRoundTrip).toBe(inlineMathMarkdown);

      const blockMathMarkdown = '$$\na_1+b_2\n$$';
      const blockMathHtml = markdownToHtml(blockMathMarkdown);
      const blockMathRoundTrip = htmlToMarkdown(blockMathHtml);
      expect(blockMathHtml).toBe('<pre class="sc-math">$$\na_1+b_2\n$$</pre>');
      expect(blockMathRoundTrip).toBe(blockMathMarkdown);

      const emojiMarkdown = 'Emoji shortcodes :smile:';
      const emojiHtml = markdownToHtml(emojiMarkdown);
      const emojiRoundTrip = htmlToMarkdown(emojiHtml);
      expect(emojiHtml).toBe('<p>Emoji shortcodes 😄</p>\n');
      expect(emojiRoundTrip).toBe(emojiMarkdown);

      expect(markdownToHtml('[attachment](./.attachments/file.txt)')).toBe(
        '<p><a href="./.attachments/file.txt" rel="noopener noreferrer" target="_blank">attachment</a></p>\n'
      );
    });
  });

  describe('HTML Pass-Through / Rich Text', () => {
    it('Underline via <u> pass-through and round-trip', () => {
      expect(markdownToHtml('<u>u</u>')).toContain('<u>u</u>');
      expect(htmlToMarkdown('<u>u</u>')).toContain('<u>u</u>');
    });

    it('Superscript <sup> and Subscript <sub> pass-through and round-trip', () => {
      expect(markdownToHtml('<sub>x</sub><sup>y</sup>')).toContain(
        '<sub>x</sub>'
      );
      const md = htmlToMarkdown('<sub>x</sub><sup>y</sup>');
      expect(md).toContain('<sub>x</sub>');
      expect(md).toContain('<sup>y</sup>');
    });

    it('<span style="color"> and <span style="background"> preservation', () => {
      expect(markdownToHtml('<span style="color:red">x</span>')).toContain(
        'color:red'
      );
      expect(
        htmlToMarkdown('<span style="background: yellow">x</span>')
      ).toContain('background: yellow');
    });

    it('Alignment HTML: align attr and text-align style preservation', () => {
      expect(markdownToHtml('<p align="center">x</p>')).toContain(
        'align="center"'
      );
      expect(htmlToMarkdown('<p align="center">x</p>')).toContain(
        '<p align="center">x</p>'
      );
    });

    it('<details><summary> block preservation and round-trip', () => {
      expect(
        markdownToHtml('<details><summary>a</summary><p>b</p></details>')
      ).toContain('<details>');
      expect(
        htmlToMarkdown('<details><summary>a</summary><p>b</p></details>')
      ).toContain('<details>');
    });

    it('<kbd> preservation if used (pass-through and round-trip)', () => {
      const markdown = 'Press <kbd>Ctrl</kbd>+<kbd>S</kbd> to save.';
      const html = markdownToHtml(markdown);

      expect(html).toContain('<kbd>Ctrl</kbd>');
      expect(html).toContain('<kbd>S</kbd>');
      expect(htmlToMarkdown(html)).toContain(markdown);
    });

    it('<ins>, <del>, <tt>, <small>, <big>, <center> policy and markdown conversion behavior', () => {
      const html = [
        '<p><ins>added</ins> and <del>removed</del></p>',
        '<p><tt>mono</tt> <small>small</small> <big>big</big></p>',
        '<center>center text</center>',
      ].join('');

      const markdown = htmlToMarkdown(html);

      expect(markdown).toContain('<ins>added</ins>');
      expect(markdown).toContain('~~removed~~');
      expect(markdown).toContain('<tt>mono</tt>');
      expect(markdown).toContain('<small>small</small>');
      expect(markdown).toContain('<big>big</big>');
      expect(markdown).toContain('<center>center text</center>');
    });

    it('Extras: safe inline/block html and br preservation', () => {
      expect(markdownToHtml('<span>ok</span>')).toContain('<span>ok</span>');
      expect(markdownToHtml('<div><p>block</p></div>')).toContain(
        '<div><p>block</p></div>'
      );

      const brRoundTrip = htmlToMarkdown(markdownToHtml('first  \nsecond'));
      expect(brRoundTrip).toContain('first');
      expect(brRoundTrip).toContain('second');
    });
  });

  describe('Code Block Details', () => {
    it('Code block detail extras: unknown/no-language, escaping, backticks in code, tilde source normalization', () => {
      expect(markdownToHtml('```madeuplang\nvalue\n```')).toContain(
        'language-madeuplang'
      );
      expect(htmlToMarkdown('<pre><code>plain</code></pre>')).toContain('```');
      expect(markdownToHtml('```\n<div>&</div>\n```')).toContain(
        '&lt;div&gt;&amp;&lt;/div&gt;'
      );

      const backticksInCode = htmlToMarkdown(
        '<pre><code>has `` ticks</code></pre>'
      );
      expect(backticksInCode).toContain('has `` ticks');

      const tildeRoundTrip = htmlToMarkdown(
        markdownToHtml('~~~js\nconst a = 1;\n~~~')
      );
      expect(tildeRoundTrip).toContain('```js');
    });
  });

  describe('Round-Trip Invariants', () => {
    it('Round-trip and normalization extras: semantic sample, typographer/unicode, heading/hr/bullet/em/strong/link/table normal forms', () => {
      const semanticSource = ['# H1', '', '- one', '- two', '', '> quote'].join(
        '\n'
      );
      const semanticRoundTrip = htmlToMarkdown(markdownToHtml(semanticSource));
      expect(semanticRoundTrip).toContain('# H1');
      expect(semanticRoundTrip).toMatch(/-\s+one/);
      expect(semanticRoundTrip).toContain('> quote');

      const unicodeRoundTrip = htmlToMarkdown(
        markdownToHtml('Quotes "x" and cafe')
      );
      expect(unicodeRoundTrip).toContain('x');

      expect(htmlToMarkdown('<h3>T</h3>')).toBe('### T');
      expect(htmlToMarkdown('<hr>')).toBe('---');
      expect(htmlToMarkdown('<ul><li>x</li></ul>')).toMatch(/-\s+x/);
      expect(htmlToMarkdown('<p><em>x</em> <strong>y</strong></p>')).toBe(
        '_x_ **y**'
      );
      expect(htmlToMarkdown('<a href="https://example.com">x</a>')).toContain(
        '[x](https://example.com)'
      );

      const tableMd = htmlToMarkdown(
        '<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>'
      );
      expect(tableMd).toMatch(/\|\s*A\s*\|/);
      expect(tableMd).toContain('| --- |');
    });
  });

  describe('Security / Sanitization', () => {
    it('Strip script/object/iframe/unsafe embeds sanitization policy', () => {
      expect(
        markdownToHtml('<script>alert(1)</script><p>ok</p>')
      ).not.toContain('<script>');
      expect(htmlToMarkdown('<p>ok</p>')).toBe('ok');
    });

    it('Strip editor-private attrs and bookmark spans on html->md export', () => {
      expect(
        htmlToMarkdown(
          '<a href="https://example.com" data-mce-href="https://example.com">x</a>'
        )
      ).not.toContain('data-mce-href');
      expect(
        htmlToMarkdown('<p>a<span data-mce-type="bookmark"></span>b</p>')
      ).toBe('ab');
    });

    it('Sanitize dangerous inline CSS and strip style tags', () => {
      const html = markdownToHtml(
        '<span style="color:red; background-image:url(javascript:alert(1)); width:expression(alert(1))">x</span>' +
          '<style>span { position: absolute; }</style>'
      );

      expect(html).not.toContain('javascript:');
      expect(html).not.toContain('expression(');
      expect(html).not.toContain('<style');
    });

    it('Unsupported custom HTML tags escape predictably', () => {
      expect(markdownToHtml('<custom-tag>hello</custom-tag>')).toContain(
        '&lt;custom-tag&gt;hello&lt;/custom-tag&gt;'
      );
    });

    it('Security extras: strip event handlers, sanitize javascript urls, keep safe attrs where allowed', () => {
      const sanitized = markdownToHtml(
        '<a href="https://example.com" onclick="alert(1)">x</a>'
      );
      expect(sanitized).toContain('href="https://example.com"');
      expect(sanitized).not.toContain('onclick');

      const jsUrlSanitized = markdownToHtml(
        '<a href="javascript:alert(1)">x</a>'
      );
      expect(jsUrlSanitized).not.toContain('javascript:');

      const linkAttrs = markdownToHtml('[x](https://example.com)');
      expect(linkAttrs).toContain('rel="noopener noreferrer"');
      expect(linkAttrs).toContain('target="_blank"');
    });
  });

  describe('Round-Trip Invariants', () => {
    it('Plain text never mutates into unexpected markdown (escape policy)', () => {
      const markdown = htmlToMarkdown(
        '<p>foo_bar and [brackets] and (paren)</p>'
      );

      expect(markdown).toMatch(/foo\\+_bar/);
      expect(markdown).toMatch(/\\+\[brackets\\+\]/);
      expect(markdown).toContain('\\(paren\\)');
    });

    it('Empty input returns empty output (null operation policy)', () => {
      expect(markdownToHtml('')).toBe('');
      expect(htmlToMarkdown('')).toBe('');
    });

    it('Nullish input policy explicit for markdownToHtml/htmlToMarkdown', () => {
      expect(markdownToHtml(null as any)).toBe('');
      expect(htmlToMarkdown(undefined as any)).toBe('');
    });
  });
});
