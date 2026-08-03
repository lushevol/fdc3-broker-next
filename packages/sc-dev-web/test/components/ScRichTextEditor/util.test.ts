/// <reference types="jest" />
import { editorCommands } from '../../../src/components/ScRichTextEditor/utils.js';


describe('editorCommands: clipboard', () => {
  let mockEditor: any;
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    mockEditor = {
      selection: {
        isCollapsed: jest.fn(() => false),
        getContent: jest.fn(() => 'Sample Content'),
      },
      getDoc: () => ({
        execCommand: jest.fn(() => true),
      }),
      fire: jest.fn(),
      focus: jest.fn(),
      getBody: () => ({ dispatchEvent: jest.fn() }),
    };

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        write: jest.fn(() => Promise.resolve()),
        read: jest.fn(() =>
          Promise.resolve([
            {
              types: ['text/plain'],
              getType: async () => new Blob(['Pasted Content']),
            },
          ])
        ),
        readText: jest.fn(() => Promise.resolve('Pasted Content')),
      },
      writable: true,
      configurable: true,
    });

    if (typeof window.ClipboardItem === 'undefined') {
      (window as any).ClipboardItem = jest.fn();
    }
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
    });
    jest.clearAllMocks();
  });

  // Copy Tests
  it('copy handler should fire a success snackbar', async () => {
    await editorCommands.copy.handler(mockEditor);
    expect(mockEditor.fire).toHaveBeenCalledWith(
      'sc-show-snackbar',
      expect.anything()
    );
    expect(mockEditor.fire.mock.calls[0][1].detail.type).toBe('info');
  });

  it('copy handler should fire a success snackbar when modern API fails but legacy succeeds', async () => {
    (navigator.clipboard.write as jest.Mock).mockRejectedValueOnce(
      new Error('API failed')
    );
    mockEditor.getDoc().execCommand.mockReturnValueOnce(true);

    await editorCommands.copy.handler(mockEditor);

    expect(mockEditor.fire).toHaveBeenCalledWith(
      'sc-show-snackbar',
      expect.anything()
    );
    expect(mockEditor.fire.mock.calls[0][1].detail.type).toBe('info');
  });

  // Paste Tests
  it('paste handler should execute without errors', async () => {
    await editorCommands.paste.handler(mockEditor);
    
    expect(mockEditor.fire).not.toHaveBeenCalled();
    expect(mockEditor.focus).toHaveBeenCalled();
  });

  it('paste handler should show error when all methods fail', async () => {
    // Make everything fail
    Object.defineProperty(navigator, 'clipboard', { value: undefined, writable: true });
    mockEditor.getDoc = () => ({ execCommand: jest.fn(() => false) });

    await editorCommands.paste.handler(mockEditor);

    expect(mockEditor.fire).toHaveBeenCalledWith(
      'sc-show-snackbar',
      expect.objectContaining({
        detail: expect.objectContaining({ type: 'error' }),
      })
    );
  });
});

describe('editorCommands coverage', () => {
  let mockEditor: any;

  beforeEach(() => {
    mockEditor = {
      execCommand: jest.fn(),
      formatter: { apply: jest.fn() },
      selection: {
        isCollapsed: jest.fn(() => true),
        getContent: jest.fn(() => 'test content'),
      },
      getDoc: () => ({ execCommand: jest.fn(() => false) }),
      fire: jest.fn(),
      focus: jest.fn(),
      plugins: { paste: { clipboard: { paste: jest.fn() } } },
    };
  });

  it('should execute basic editor commands', () => {
    const commands = [
      'redo',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'removeformat',
      'justifyleft',
      'justifycenter',
      'justifyright',
      'outdent',
      'indent',
      'superscript',
      'subscript',
    ];

    commands.forEach(command => {
      editorCommands[command].handler(mockEditor);
      expect(mockEditor.execCommand).toHaveBeenCalled();
    });
  });

  it('should execute formatblock commands', () => {
    const formatCommands = [
      'formatblock-p',
      'formatblock-h2',
      'formatblock-h3',
      'formatblock-h4',
      'formatblock-h5',
      'formatblock-h6',
      'formatblock-div',
    ];

    formatCommands.forEach(command => {
      editorCommands[command].handler(mockEditor);
      expect(mockEditor.execCommand).toHaveBeenCalled();
    });
  });

  it('should apply custom formats', () => {
    editorCommands['formatblock-aside'].handler(mockEditor);
    expect(mockEditor.formatter.apply).toHaveBeenCalledWith('aside');

    editorCommands['formatblock-section'].handler(mockEditor);
    expect(mockEditor.formatter.apply).toHaveBeenCalledWith('section');
  });

  it('should execute blockquote command', () => {
    editorCommands['formatblock-blockquote'].handler(mockEditor);
    expect(mockEditor.execCommand).toHaveBeenCalledWith('mceBlockQuote');
  });

  it('should handle copy when selection is collapsed', async () => {
    mockEditor.selection.isCollapsed.mockReturnValue(true);

    await editorCommands.copy.handler(mockEditor);

    // Should return early and not fire any events
    expect(mockEditor.fire).not.toHaveBeenCalled();
  });

  it('should handle copy fallback to modern API', async () => {
    mockEditor.selection.isCollapsed.mockReturnValue(false);
    mockEditor.getDoc().execCommand.mockReturnValue(false); // Native copy fails
    mockEditor.selection.getContent
      .mockReturnValueOnce('<p>html content</p>')
      .mockReturnValueOnce('text content');

    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: { write: jest.fn(() => Promise.resolve()) },
      writable: true,
    });

    await editorCommands.copy.handler(mockEditor);

    expect(navigator.clipboard.write).toHaveBeenCalled();
    expect(mockEditor.fire).toHaveBeenCalled();
  });

  it('should handle copy error', async () => {
    mockEditor.selection.isCollapsed.mockReturnValue(false);
    mockEditor.getDoc().execCommand.mockReturnValue(false);

    // Mock clipboard API to throw error
    Object.defineProperty(navigator, 'clipboard', {
      value: { write: jest.fn(() => Promise.reject(new Error('API failed'))) },
      writable: true,
    });

    await editorCommands.copy.handler(mockEditor);

    expect(mockEditor.fire).toHaveBeenCalledWith(
      'sc-show-snackbar',
      expect.objectContaining({
        detail: expect.objectContaining({ type: 'error' }),
      })
    );
  });

  it('should handle paste without clipboard API', async () => {
    // Mock missing clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });

    await editorCommands.paste.handler(mockEditor);

    expect(mockEditor.fire).toHaveBeenCalledWith(
      'sc-show-snackbar',
      expect.objectContaining({
        detail: expect.objectContaining({ type: 'error' }),
      })
    );
  });
});

describe('editorCommands additional coverage', () => {
  let mockEditor: any;

  beforeEach(() => {
    mockEditor = {
      execCommand: jest.fn(),
      focus: jest.fn(),
      getBody: () => ({ dispatchEvent: jest.fn() }),
      fire: jest.fn(),
    };
  });

  // Cover BackColor command
  it('should handle backcolor command', () => {
    editorCommands.backcolor.handler(mockEditor, ['#ff0000']);
    expect(mockEditor.execCommand).toHaveBeenCalledWith(
      'BackColor',
      false,
      '#ff0000'
    );
  });

  // Cover ForeColor command
  it('should handle forecolor command', () => {
    editorCommands.forecolor.handler(mockEditor, ['#00ff00']);
    expect(mockEditor.execCommand).toHaveBeenCalledWith(
      'ForeColor',
      false,
      '#00ff00'
    );
  });

  // Cover Unlink command
  it('should handle unlink command', () => {
    editorCommands.unlink.handler(mockEditor);
    expect(mockEditor.execCommand).toHaveBeenCalledWith('Unlink');
  });

  // Cover CreateLink command
  it('should handle createlink command', () => {
    editorCommands.createlink.handler(mockEditor, ['https://example.com']);
    expect(mockEditor.execCommand).toHaveBeenCalledWith(
      'CreateLink',
      false,
      'https://example.com'
    );
  });
});

describe('paste handler additional coverage', () => {
  let mockEditor: any;

  beforeEach(() => {
    mockEditor = {
      focus: jest.fn(),
      getBody: () => ({ dispatchEvent: jest.fn() }),
      getDoc: () => ({ execCommand: jest.fn(() => false) }),
      fire: jest.fn(),
    };

    // Mock secure context
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      writable: true,
    });
  });

  // Cover dispatchPasteEvent success path
  it('should handle paste with html content', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        read: jest.fn(() =>
          Promise.resolve([
            {
              types: ['text/html'],
              getType: async () => new Blob(['<p>test</p>']),
            },
          ])
        ),
      },
      writable: true,
    });

    global.DataTransfer = jest.fn().mockImplementation(() => ({
      setData: jest.fn(),
    }));
    global.ClipboardEvent = jest.fn().mockImplementation(() => ({}));

    await editorCommands.paste.handler(mockEditor);
    expect(mockEditor.focus).toHaveBeenCalled();
  });

  // Cover readText fallback
  it('should handle paste with readText fallback', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        read: jest.fn(() => Promise.resolve([{ types: [] }])),
        readText: jest.fn(() => Promise.resolve('fallback text')),
      },
      writable: true,
    });

    global.DataTransfer = jest.fn().mockImplementation(() => ({
      setData: jest.fn(),
    }));
    global.ClipboardEvent = jest.fn().mockImplementation(() => ({}));

    await editorCommands.paste.handler(mockEditor);
    expect(navigator.clipboard.readText).toHaveBeenCalled();
  });

  // Cover native execCommand failure path
  it('should handle native paste command failure', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });

    mockEditor.getDoc = () => ({
      execCommand: jest.fn(() => {
        throw new Error('execCommand failed');
      }),
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await editorCommands.paste.handler(mockEditor);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Native execCommand paste failed:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  // Cover final fallback dispatch
  it('should handle final event dispatch fallback', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });
    mockEditor.getDoc = () => ({ execCommand: jest.fn(() => false) });

    const dispatchEventMock = jest.fn();
    mockEditor.getBody = () => ({ dispatchEvent: dispatchEventMock });
    global.ClipboardEvent = jest.fn().mockImplementation(() => ({}));

    await editorCommands.paste.handler(mockEditor);
    expect(dispatchEventMock).toHaveBeenCalled();
  });

  // Cover final error catch
  it('should handle final error catch', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });
    mockEditor.getDoc = () => ({ execCommand: jest.fn(() => false) });

    const dispatchEventMock = jest.fn(() => {
      throw new Error('dispatch failed');
    });
    mockEditor.getBody = () => ({ dispatchEvent: dispatchEventMock });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await editorCommands.paste.handler(mockEditor);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Event dispatch paste failed:',
      expect.any(Error)
    );
    expect(mockEditor.fire).toHaveBeenCalledWith(
      'sc-show-snackbar',
      expect.objectContaining({
        detail: expect.objectContaining({ type: 'error' }),
      })
    );

    consoleSpy.mockRestore();
  });
});