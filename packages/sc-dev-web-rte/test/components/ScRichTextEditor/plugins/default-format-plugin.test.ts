import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('hugerte/hugerte.js', () => ({}));

type EventHandler = (args?: unknown) => void;
type RegisteredOption = {
  processor: (value: unknown) => boolean;
  default: unknown;
};

let pluginFactory: any;

const createEditor = (defaultFormat = ['forecolor:#E00A15', 'backcolor:#000000']) => {
  const handlers = new Map<string, EventHandler>();
  const oneTimeHandlers = new Map<string, EventHandler>();
  const execCommand = jest.fn();
  let selectedNode: Node | null = null;
  const body = document.createElement('div');
  let registeredOption: RegisteredOption | undefined;

  const editor = {
    options: {
      register: jest.fn((_name: string, option: RegisteredOption) => {
        registeredOption = option;
      }),
      get: jest.fn().mockReturnValue(defaultFormat),
    },
    selection: {
      getNode: jest.fn(() => selectedNode),
      getContent: jest.fn(() => selectedNode?.textContent ?? ''),
      select: jest.fn((node: Node) => {
        selectedNode = node;
      }),
    },
    formatter: {
      match: jest.fn(() => false),
    },
    undoManager: {
      ignore: jest.fn((callback: () => void) => callback()),
    },
    execCommand,
    on: jest.fn((event: string, handler: EventHandler) => {
      handlers.set(event, handler);
    }),
    once: jest.fn((event: string, handler: EventHandler) => {
      oneTimeHandlers.set(event, handler);
    }),
    dom: {
      doc: document,
    },
    getBody: jest.fn(() => body),
  } as any;

  const plugin = pluginFactory(editor);
  if (!registeredOption) {
    throw new Error('default-format option was not registered');
  }

  registeredOption.processor(defaultFormat);

  return {
    body,
    editor,
    execCommand,
    handlers,
    oneTimeHandlers,
    plugin,
    registeredOption,
    setSelectedNode(node: Node | null) {
      selectedNode = node;
    },
  };
};

describe('default-format-plugin', () => {
  beforeEach(async () => {
    jest.resetModules();
    pluginFactory = undefined;
    jest.clearAllMocks();

    Object.defineProperty(window, 'hugerte', {
      value: {
        PluginManager: {
          add: jest.fn((_id: string, factory: any) => {
            pluginFactory = factory;
          }),
        },
      },
      configurable: true,
      writable: true,
    });

    await import('../../../../src/components/ScRichTextEditor/plugins/default-format-plugin.js');
    expect(typeof pluginFactory).toBe('function');
  });

  it('applies color format to every inserted table cell', () => {
    const { execCommand, handlers, oneTimeHandlers } = createEditor();

    const execCommandHandler = handlers.get('ExecCommand');
    expect(execCommandHandler).toBeDefined();

    execCommandHandler?.({ command: 'mceInsertTable' });

    const tableSelectedHandler = oneTimeHandlers.get('ObjectSelected');
    expect(tableSelectedHandler).toBeDefined();

    const table = document.createElement('table');
    const row = document.createElement('tr');

    for (let index = 0; index < 4; index += 1) {
      row.appendChild(document.createElement('td'));
    }

    table.appendChild(row);
    tableSelectedHandler?.({ target: table });

    expect(execCommand).toHaveBeenCalledTimes(8);
    expect(execCommand).toHaveBeenNthCalledWith(1, 'forecolor', false, '#E00A15', { skip_focus: true });
    expect(execCommand).toHaveBeenNthCalledWith(2, 'backcolor', false, '#000000', { skip_focus: true });
    expect(execCommand).toHaveBeenNthCalledWith(7, 'forecolor', false, '#E00A15', { skip_focus: true });
    expect(execCommand).toHaveBeenNthCalledWith(8, 'backcolor', false, '#000000', { skip_focus: true });
  });

  it('returns early when selection already contains non-whitespace content', () => {
    const { editor, execCommand, handlers, setSelectedNode } = createEditor();
    const span = document.createElement('span');
    span.textContent = 'filled';
    setSelectedNode(span);

    handlers.get('NewBlock')?.();

    expect(editor.undoManager.ignore).not.toHaveBeenCalled();
    expect(execCommand).not.toHaveBeenCalled();
  });

  it('skips commands when formatter already matches a configured format', () => {
    const { editor, execCommand, handlers, setSelectedNode } = createEditor();
    const span = document.createElement('span');
    span.textContent = '\uFEFF';
    setSelectedNode(span);
    editor.formatter.match.mockReturnValue(true);

    handlers.get('NewBlock')?.();

    expect(editor.undoManager.ignore).not.toHaveBeenCalled();
    expect(execCommand).not.toHaveBeenCalled();
  });

  it('filters invalid values before applying commands', () => {
    const { execCommand, handlers, setSelectedNode } = createEditor([
      'forecolor:not-a-color',
      'backcolor:#000000',
      'ee:unknown:value',
    ]);
    const span = document.createElement('span');
    span.textContent = '\uFEFF';
    setSelectedNode(span);

    handlers.get('NewBlock')?.();

    expect(execCommand).toHaveBeenCalledTimes(2);
    expect(execCommand).toHaveBeenCalledWith('backcolor', false, '#000000', { skip_focus: true });
    expect(execCommand).toHaveBeenCalledWith('mceInsertContent', false, '<br data-mce-bogus="1">', { skip_focus: true });
  });

  it('applies valid formatblock command and routes match through formatter value', () => {
    const { editor, execCommand, handlers, setSelectedNode } = createEditor([
      'formatblock:h2',
      'alignleft',
    ]);
    const span = document.createElement('span');
    span.textContent = '\uFEFF';
    setSelectedNode(span);

    handlers.get('NewBlock')?.();

    expect(editor.formatter.match).toHaveBeenNthCalledWith(1, 'h2', undefined, undefined, true);
    expect(editor.formatter.match).toHaveBeenNthCalledWith(2, 'alignleft', undefined, undefined, true);
    expect(execCommand).toHaveBeenNthCalledWith(1, 'formatblock', false, 'h2', { skip_focus: true });
    expect(execCommand).toHaveBeenNthCalledWith(2, 'justifyleft', false, undefined, { skip_focus: true });
  });

  it('rejects invalid formatblock values and does not execute commands', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { execCommand, handlers, setSelectedNode } = createEditor([
      'formatblock:not-a-tag',
    ]);
    const span = document.createElement('span');
    span.textContent = '\uFEFF';
    setSelectedNode(span);

    handlers.get('NewBlock')?.();

    expect(execCommand).toHaveBeenCalledTimes(1);
    expect(execCommand).toHaveBeenCalledWith('mceInsertContent', false, '<br data-mce-bogus="1">', { skip_focus: true });
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('ignores empty command entries from option config', () => {
    const { execCommand, handlers, setSelectedNode } = createEditor([
      '   ',
      'backcolor:#000000',
    ]);
    const span = document.createElement('span');
    span.textContent = '\uFEFF';
    setSelectedNode(span);

    handlers.get('NewBlock')?.();

    expect(execCommand).toHaveBeenCalledTimes(2);
    expect(execCommand).toHaveBeenCalledWith('backcolor', false, '#000000', { skip_focus: true });
    expect(execCommand).toHaveBeenCalledWith('mceInsertContent', false, '<br data-mce-bogus="1">', { skip_focus: true });
  });

  it('returns false and logs when option processor receives non-array value', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { registeredOption } = createEditor();

    const valid = registeredOption.processor('not-array');

    expect(valid).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith('default-format', 'must be an array of strings');
    errorSpy.mockRestore();
  });

  it('applies format on block quote command only', () => {
    const { execCommand, handlers, setSelectedNode } = createEditor();
    const span = document.createElement('span');
    span.textContent = '\uFEFF';
    setSelectedNode(span);

    handlers.get('ExecCommand')?.({ command: 'mceBlockQuote' });
    expect(execCommand).toHaveBeenCalledTimes(3);

    execCommand.mockClear();
    handlers.get('ExecCommand')?.({ command: 'somethingElse' });
    expect(execCommand).not.toHaveBeenCalled();
  });

  it('applies format on SetContent only when the editor body is empty', () => {
    jest.useFakeTimers();
    const { body, execCommand, handlers, setSelectedNode } = createEditor();
    const span = document.createElement('span');
    span.textContent = '\uFEFF';
    setSelectedNode(span);

    body.textContent = '';
    handlers.get('SetContent')?.();
    jest.runAllTimers();
    expect(execCommand).toHaveBeenCalledTimes(3);

    execCommand.mockClear();
    body.textContent = 'not empty';
    handlers.get('SetContent')?.();
    jest.runAllTimers();
    expect(execCommand).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('hooks ListMutation to the next ExecCommand', () => {
    const { execCommand, handlers, oneTimeHandlers, setSelectedNode } = createEditor();
    const span = document.createElement('span');
    span.textContent = '\uFEFF';
    setSelectedNode(span);

    handlers.get('ListMutation')?.();
    expect(oneTimeHandlers.has('ExecCommand')).toBe(true);

    oneTimeHandlers.get('ExecCommand')?.();
    expect(execCommand).toHaveBeenCalledTimes(3);
  });

  it('ignores ObjectSelected when the target is not a table', () => {
    const { execCommand, handlers, oneTimeHandlers } = createEditor();

    handlers.get('ExecCommand')?.({ command: 'mceInsertTable' });
    oneTimeHandlers.get('ObjectSelected')?.({ target: document.createElement('div') });

    expect(execCommand).not.toHaveBeenCalled();
  });

  it('registers the option and exposes plugin metadata', () => {
    const { plugin, registeredOption } = createEditor();
    const metadata = plugin.getMetadata();

    expect(registeredOption).toMatchObject({ default: [] });
    expect(typeof registeredOption.processor).toBe('function');
    expect(metadata).toMatchObject({ name: 'scRteDefaultFormat' });
    expect((metadata as { url: string }).url).toContain(
      'src/components/ScRichTextEditor/plugins/default-format-plugin.ts'
    );
  });
});