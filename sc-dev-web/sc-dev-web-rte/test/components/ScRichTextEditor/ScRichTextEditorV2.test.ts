import { html, fixture, aTimeout  } from '@open-wc/testing';
import { ScRichTextEditorV2 } from '../../../src/components/ScRichTextEditor/ScRichTextEditorV2.js';
import { ScRteFullscreenModal } from '../../../src/components/ScRichTextEditor/ScRteFullscreenModal.js';
import * as utils from '../../../src/components/ScRichTextEditor/core/utils.js';
import * as typeUtils from '../../../src/components/ScRichTextEditor/typeUtils.js';
import { editorCommands, Revision } from '../../../src/components/ScRichTextEditor/utils.js';
import { Editor } from 'hugerte';
import { injectScrollbarStyles } from '../../../src/components/ScRichTextEditor/styles/tinymce-scrollbar.style.js';
import '../../../elements/sc-rich-text-editor-v2.js';

jest.mock('marked', () => {
  return {
    marked: {
      Renderer: class {
        constructor() {}
      },
      setOptions: jest.fn((options: any) => {}),
      parse: jest.fn((content: string) => `${content}`),
    },
  };
});

jest.mock(
  '../../../src/components/ScRichTextEditor/styles/tinymce-scrollbar.style.js',
  () => ({
    injectScrollbarStyles: jest.fn(),
    ScrollbarSize: {},
  })
);

const toolbars = [
  'undo',
  'redo',
  'separate',
  'askai',
  'aishortcuts',
];

const sampleRevision1: Revision = {
  authorId: '123',
  content: 'Sample Revision 1 Content',
  dateCreated: '123123',
  id: 'rev1',
}; 

const sampleRevision2: Revision = {
  authorId: '123',
  content: 'Sample Revision 2 Content',
  dateCreated: '123124',
  id: 'rev2',
}; 

describe('ScRichTextEditor', () => {
  const mockEditorInstance = {
    value: 'test value 123 123',
    undoManager: {
      ignore: (callBackFn: () => void) => {
        callBackFn();
      },
      hasUndo: () => false,
      hasRedo: () => false,
    },
    setContent(value: string) {
      this.value = value;
    },
    getContent () {
      return this.value;
    },
    on: jest.fn(),
    once: jest.fn(),
    off: jest.fn(),
    execCommand: () => {},
    mode: {
      set: (sampleString: string) => {  },
    },
    plugins: {
      wordcount: { body: { getCharacterCount: jest.fn(() => 50) } },
    },
  } as any;

  it('Render TinyMCE text editor', async () => {
    const testValue = 'Test Value 123 123';
    const el = await fixture<ScRichTextEditorV2>(
      html`<sc-rich-text-editor-v2 .value=${testValue}
        .toolbar=${toolbars as any}
        .revisions=${[]}
        ></sc-rich-text-editor-v2>`,
      { scopedElements: { 'sc-rich-text-editor-v2': ScRichTextEditorV2 } }
    );
    el.borderType = 'line';
    const rteToolbar = el.shadowRoot?.querySelector('sc-rte-toolbar-v2');
    expect(!!rteToolbar).toBeTruthy();
    const rteEditor = el.shadowRoot?.getElementById(el.editorId);
    const undoToolbarAction = rteToolbar?.shadowRoot?.querySelector('sc-rte-action-v2[command="undo"]');

    expect(!!rteEditor).toBeTruthy;
    expect(!!rteToolbar).toBeTruthy;
    expect(!!undoToolbarAction).toBeTruthy;
    expect(el.value).toEqual(testValue);
    expect(undoToolbarAction?.getAttribute('command')).toEqual('undo');
  });

  it('Render error-message', async () => {
    const errorMessage = 'Error Message Test 123 12 3';
    const el = await fixture<ScRichTextEditorV2>(
      html`
        <sc-rich-text-editor-v2
          .error=${true}
          .errorMessage=${errorMessage}
        >
        </sc-rich-text-editor-v2>
      `,
      { scopedElements: { 'sc-rich-text-editor-v2': ScRichTextEditorV2 } }
    );
    const scRichTextEditorErrorMessage = el.shadowRoot?.querySelector('.error-message slot');
    expect(scRichTextEditorErrorMessage).toBeTruthy;
    expect(scRichTextEditorErrorMessage?.textContent?.includes(errorMessage)).toBe(true);
  });

  it('test utils of rich editor', () => {
    utils.editorCommand('');
    expect(utils.rgb2hex('rgb(255, 0, 0)')).toEqual('#ff0000');
  });

  it('typeUtils', () => {
    expect(typeUtils.TStyleKeysOfContext.color).toEqual('color');
  });

  it('handle toolbar action', () => {
    const mockEditorEvent: any = {
      detail: {
        namespace: 'editor.undo',
        args: [],
      },
    };
    const rte = new ScRichTextEditorV2();
    rte.editorInstance = mockEditorInstance;
    const editorCommandHandlerSpy = jest
      .spyOn(mockEditorInstance, 'execCommand');

    rte.handleToolbarAction(mockEditorEvent);
    rte.editorInstance = true as any;
    
    expect(editorCommandHandlerSpy).toHaveBeenCalled();
  });

  it('handles ask ai', async () => {
    const testValue = 'test111';
    const el = await fixture<ScRichTextEditorV2>(
      html`<sc-rich-text-editor-v2 .value=${testValue}
        .toolbar=${toolbars as any}
        .revisions=${[]}
        ></sc-rich-text-editor-v2>`,
      { scopedElements: { 'sc-rich-text-editor-v2': ScRichTextEditorV2 } }
    );
    el.editorInstance = {
      ...mockEditorInstance,
      on: (event: string, cb: () => void) => {
        if (event === 'input change') cb();
      },
      fire: (eventName:string) => {},
    } as any;
    await el.updateComplete;
    aTimeout(50);
    const mockEvent1 = {
      detail: {
        namespace: 'askai',
        args: [],
      },
    };    
    el.handleToolbarAction(mockEvent1 as any);
    await el.updateComplete;
    aTimeout(50);
    const askAIModalDom = el.shadowRoot?.querySelector('sc-rte-ask-ai-modal');
    expect(!!askAIModalDom).toBeTruthy();
    askAIModalDom?.dispatchEvent(new CustomEvent('sc-rte-ask-ai-update', {
      bubbles: true,
      detail: {
        content: 'test content',
      },
    }));
    askAIModalDom?.dispatchEvent(new CustomEvent('sc-rte-ask-ai-close', {
      bubbles: true,
    }));
    const mockEvent2 = {
      detail: {
        namespace: 'revisionhistory',
        args: [],
      },
    };
    el.handleToolbarAction(mockEvent2 as any);
    await el.updateComplete;
    const historyDom = el.shadowRoot?.querySelector('sc-rte-revision-history');
    expect(!!historyDom).toBeTruthy();
    historyDom?.dispatchEvent(new CustomEvent('sc-select',{
      bubbles: true,
      detail: {
        revision: sampleRevision1,
      },
    }));
    el.cancelRevision();
    el.editorOnInit(el.editorInstance as Editor, { value: testValue });
  });

  it('render show count', async () => {
    const testValue = 'test';
    const el = await fixture<ScRichTextEditorV2>(
      html`<sc-rich-text-editor-v2 .value=${testValue}
        show-count
        max-length="100"
        .toolbar=${toolbars as any}
        .revisions=${[]}
        ></sc-rich-text-editor-v2>`,
      { scopedElements: { 'sc-rich-text-editor-v2': ScRichTextEditorV2 } }
    );
    el.editorInstance = {
      on: (event: string, cb: () => void) => {
        if (event === 'input change') cb();
      },
      ...mockEditorInstance,
    } as any;
    await el.updateComplete;
  });

  it('handles revision history cancel functions', () => {
    const mockEvent1 = {
      detail: {
        namespace: 'formatblock',
        args: ['h1'],
      },
    };
    const mockEvent2 = {
      detail: {
        namespace: 'revisionhistory',
        args: [],
      },
    };
    const rte = new ScRichTextEditorV2();
    rte.editorInstance = mockEditorInstance as any;


    // Test with format block command
    const commandHandlerSpy = jest
      .spyOn(editorCommands['formatblock-h1'], 'handler');
    rte.handleToolbarAction(mockEvent1 as any);
    expect(commandHandlerSpy).toHaveBeenCalled();


    // Test revision history command
    const editorSetContentSpy = jest
      .spyOn(mockEditorInstance, 'setContent');
    const clearRevisionSpy = jest
      .spyOn(rte, 'clearRevision');

    // Click on the revision history button
    rte.handleToolbarAction(mockEvent2 as any);
    // Save current content to draft value
    rte.onShowRevisionsChange();
    // Cancel revision so that the draft value will be set
    rte.cancelRevision();
    
    // Check if setContent has been called with the draft value;
    expect(clearRevisionSpy).toHaveBeenCalled();
    expect(editorSetContentSpy).toHaveBeenCalledWith('test value 123 123');
    
  });

  it('handles revision history set revision functions', () => {
    const mockEvent = {
      detail: {
        namespace: 'revisionhistory',
        args: [],
      },
    };
    const editorSetContentSpy = jest
      .spyOn(mockEditorInstance, 'setContent');

    const rte = new ScRichTextEditorV2();
    rte.editorInstance = mockEditorInstance as any;
    // Click on the revision history button
    rte.handleToolbarAction(mockEvent as any);

    // Save current content to draft value
    rte.onShowRevisionsChange();

    rte.selectRevision(sampleRevision1);
    const testDiffValue = '<del class="diffmod">test</del><ins class="diffmod">Sample</ins> <del class="diffmod">value</del><ins class="diffmod">Revision</ins> 1<del class="diffdel">23</del> <del class="diffmod">123</del><ins class="diffmod">Content</ins>';
    expect(editorSetContentSpy).toHaveBeenNthCalledWith(1, 'test value 123 123');
    expect(editorSetContentSpy).toHaveBeenNthCalledWith(2, sampleRevision1.content);
    expect(editorSetContentSpy).toHaveBeenLastCalledWith(testDiffValue);
    
    rte.applyRevision();
    expect(rte.value).toEqual(sampleRevision1.content);
  });

  it('handles editorOnInit and cursor fix', () => {
    jest.useFakeTimers();
    const rte = new ScRichTextEditorV2();
    rte.value = 'initial';
    (rte as any)._isInternalUpdate = false;

    const mockEditor = {
      on: (event: string, cb: (e: any) => void) => {
        if (event === 'input change SetContent') cb({ type: 'input' });
      },
      getContent: () => 'updated by user',
      selection: {
        getBookmark: jest.fn(() => null),
        moveToBookmark: jest.fn(),
      },
      setContent: jest.fn(),
    };

    rte.editorInstance = mockEditor as any;

    rte.editorOnInit(mockEditor as any, { value: 'initial' });

    // handleContentChange is debounced at 500ms — advance timers
    jest.advanceTimersByTime(600);

    expect(rte.value).toBe('updated by user');
    jest.useRealTimers();
  });

  it('handles internal flag and updates with bookmark for cursor', () => {
    const rte = new ScRichTextEditorV2();

    const getContent = jest.fn(() => '<p>old</p>');
    const setContent = jest.fn();
    const moveToBookmark = jest.fn();
    const getBookmark = jest.fn(() => ({ id: 'bookmark' }));
    const isCollapsed = jest.fn(() => true);

    rte.editorInstance = {
      getContent,
      setContent,
      selection: { getBookmark, moveToBookmark, isCollapsed },
      hasFocus: jest.fn(() => false),
    } as any;

    // Internal: skips setContent
    (rte as any)._isInternalUpdate = true;
    rte.value = '<p>unchanged</p>';
    rte.onValueChange();

    expect(setContent).not.toHaveBeenCalled();

    // External: calls setContent and restores bookmark
    (rte as any)._isInternalUpdate = false;
    rte.value = '<p>new</p>';
    rte.onValueChange();

    expect(setContent).toHaveBeenCalledWith('<p>new</p>', { format: 'html' });
    expect(moveToBookmark).toHaveBeenCalledWith({ id: 'bookmark' });
  });

  it('renders the label when provided', async () => {
    const labelText = 'Test Editor Label';
    const el = await fixture<ScRichTextEditorV2>(
      html`<sc-rich-text-editor-v2 label=${labelText}></sc-rich-text-editor-v2>`,
      { scopedElements: { 'sc-rich-text-editor-v2': ScRichTextEditorV2 } }
    );

    const labelWrapper = el.shadowRoot?.querySelector('.sc-form-group-label');
    const labelComponent = el.shadowRoot?.querySelector('sc-label');

    expect(labelWrapper).toBeTruthy();
    expect(labelComponent).toBeTruthy();
    expect(labelComponent?.getAttribute('label')).toBe(labelText);
  });

  it('sanitizes malformed data URLs before initialization', () => {
    const rte = new ScRichTextEditorV2();
    const malformedInput = '<p>Image: <img src="data:;base64,/9j/4AAQ=="></p>';
    const expectedOutput =
      '<p>Image: <img src="data:image/jpeg;base64,/9j/4AAQ=="></p>';

    // Test that the sanitizer fixes the malformed URL
    const sanitized = (rte as any)._sanitizeInputValue(malformedInput);
    expect(sanitized).toBe(expectedOutput);

    // Test that it does not alter valid input
    const validInput = '<p>This is valid.</p>';
    expect((rte as any)._sanitizeInputValue(validInput)).toBe(validInput);
  });

  it('updates value on ExecCommand for formatting changes', () => {
    jest.useFakeTimers();
    const rte = new ScRichTextEditorV2();
    let execCommandHandler: (e: { command: string }) => void;

    // A mock editor that captures the 'ExecCommand' handler
    const mockEditor = {
      on: (event: string, cb: any) => {
        // Capture the handler function when it's registered
        if (event === 'ExecCommand') {
          execCommandHandler = cb;
        }
      },
      getContent: () => 'content after bold',
      // Add other properties that editorOnInit might access to prevent errors
      setContent: jest.fn(),
      formatter: { register: jest.fn() },
      addShortcut: jest.fn(),
      selection: { getBookmark: jest.fn(), moveToBookmark: jest.fn() },
    };

    rte.editorInstance = mockEditor as any;
    // Register the event handlers
    rte.editorOnInit(mockEditor as any, { value: 'initial content' });

    // Simulate a 'bold' command being executed by TinyMCE
    execCommandHandler!({ command: 'bold' });

    // Fast-forward timers to run the setTimeout in the handler
    jest.runAllTimers();

    // Check that the component's value was updated
    expect(rte.value).toBe('content after bold');

    jest.useRealTimers();
  });

  it('detects different image formats in sanitizer', () => {
    const rte = new ScRichTextEditorV2();

    // Test PNG detection (need longer header for proper detection)
    const pngInput =
      '<img src="data:;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAA">';
    const pngResult = (rte as any)._sanitizeInputValue(pngInput);
    expect(pngResult).toBe(
      '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAA">'
    );

    // Test GIF detection
    const gifInput =
      '<img src="data:;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">';
    const gifResult = (rte as any)._sanitizeInputValue(gifInput);
    expect(gifResult).toBe(
      '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">'
    );

    // Test WebP detection
    const webpInput =
      '<img src="data:;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA">';
    const webpResult = (rte as any)._sanitizeInputValue(webpInput);
    expect(webpResult).toBe(
      '<img src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA">'
    );

    // Test BMP detection
    const bmpInput =
      '<img src="data:;base64,Qk02AgAAAAAAADYAAAAoAAAAAQAAAAEAAAABACAAAAAAAAA">';
    const bmpResult = (rte as any)._sanitizeInputValue(bmpInput);
    expect(bmpResult).toBe(
      '<img src="data:image/bmp;base64,Qk02AgAAAAAAADYAAAAoAAAAAQAAAAEAAAABACAAAAAAAAA">'
    );
  });

  it('handles SetContent events', () => {
    jest.useFakeTimers();
    const rte = new ScRichTextEditorV2();
    let setContentHandler: (e: any) => void;

    const mockEditor = {
      on: (event: string, cb: any) => {
        if (event === 'input change SetContent') {
          setContentHandler = cb;
        }
      },
      getContent: () => 'content after setContent',
      setContent: jest.fn(),
      formatter: { register: jest.fn() },
      addShortcut: jest.fn(),
      selection: { getBookmark: jest.fn(), moveToBookmark: jest.fn() },
    };

    rte.editorInstance = mockEditor as any;
    rte.editorOnInit(mockEditor as any, { value: 'initial content' });

    // Simulate SetContent event
    setContentHandler!({ type: 'SetContent' });

    // Fast-forward timers
    jest.runAllTimers();

    // Check that the component's value was updated
    expect(rte.value).toBe('content after setContent');

    jest.useRealTimers();
  });

  it('updates container width on ResizeEditor when resize option is both', () => {
    const rte = new ScRichTextEditorV2();
    let resizeHandler: (() => void) | undefined;

    Object.defineProperty(rte, 'container', {
      configurable: true,
      value: { style: { width: '' } },
    });

    const mockEditor = {
      on: (event: string, cb: any) => {
        if (event === 'ResizeEditor') {
          resizeHandler = cb;
        }
      },
      options: {
        get: jest.fn(() => 'both'),
      },
      editorContainer: {
        style: { width: '400px' },
      },
      getContent: jest.fn(() => ''),
      setContent: jest.fn(),
      formatter: { register: jest.fn() },
      addShortcut: jest.fn(),
      selection: { getBookmark: jest.fn(), moveToBookmark: jest.fn() },
    };

    rte.editorOnInit(mockEditor as any, {});
    resizeHandler?.();

    expect(mockEditor.options.get).toHaveBeenCalledWith('resize');
  });

  it('returns early from handleResize when no editor exists', () => {
    const rte = new ScRichTextEditorV2();

    expect(() => rte.handleResize()).not.toThrow();
  });

  it('expands container width for revision history during resize', () => {
    const rte = new ScRichTextEditorV2();

    Object.defineProperty(rte, 'container', {
      configurable: true,
      value: { style: { width: '' } },
    });

    Object.defineProperty(rte, 'shadowRoot', {
      configurable: true,
      value: {
        querySelector: jest.fn(() => ({ clientWidth: 120 })),
      },
    });

    (rte as any)._showRevisions = true;
    rte.editorInstance = {
      options: {
        get: jest.fn(() => 'both'),
      },
      editorContainer: {
        style: { width: '400px' },
      },
    } as any;

    rte.handleResize();

    expect(rte.container.style.width).toBe('528px');
  });

  it('keeps the editor width when revisions are hidden during resize', () => {
    const rte = new ScRichTextEditorV2();

    Object.defineProperty(rte, 'container', {
      configurable: true,
      value: { style: { width: '' } },
    });

    rte.editorInstance = {
      options: {
        get: jest.fn(() => 'both'),
      },
      editorContainer: {
        style: { width: '410px' },
      },
    } as any;

    rte.handleResize();

    expect(rte.container.style.width).toBe('410px');
  });

  it('syncs iframe height during resize when editor is resizable', () => {
    const rte = new ScRichTextEditorV2();
    const querySelector = jest.fn(() => ({ clientHeight: 230 }));
    const iframeElement = { style: { height: '' } };

    rte.editorInstance = {
      options: {
        get: jest.fn(() => 'vertical'),
      },
      editorContainer: {
        querySelector,
      },
      iframeElement,
    } as any;

    rte.handleResize();

    expect(querySelector).toHaveBeenCalledWith('.tox-edit-area');
    expect(iframeElement.style.height).toBe('230px');
  });

  it('shrinks editor width to make room for revision history panel', () => {
    const rte = new ScRichTextEditorV2();
    const editorContainer = { style: { width: '' } };

    Object.defineProperty(rte, 'container', {
      configurable: true,
      value: {
        style: { maxWidth: '800px' },
        clientWidth: 500,
      },
    });

    Object.defineProperty(rte, 'shadowRoot', {
      configurable: true,
      value: {
        querySelector: jest.fn(() => ({ clientWidth: 120 })),
      },
    });

    (rte as any)._showRevisions = true;
    rte.editorInstance = {
      editorContainer,
    } as any;

    (rte as any)._handleResizeRevision();

    expect(editorContainer.style.width).toBe('372px');
  });

  it('keeps revision editor width unchanged when revision sidebar is hidden', () => {
    const rte = new ScRichTextEditorV2();
    const editorContainer = { style: { width: '' } };

    Object.defineProperty(rte, 'container', {
      configurable: true,
      value: {
        style: { maxWidth: '800px' },
        clientWidth: 500,
      },
    });

    rte.editorInstance = {
      editorContainer,
    } as any;

    (rte as any)._handleResizeRevision();

    expect(editorContainer.style.width).toBe('500px');
  });

  it('does not resize revision layout without a constrained container', () => {
    const rte = new ScRichTextEditorV2();
    const editorContainer = { style: { width: '' } };

    Object.defineProperty(rte, 'container', {
      configurable: true,
      value: {
        style: { maxWidth: '' },
        clientWidth: 500,
      },
    });

    rte.editorInstance = {
      editorContainer,
    } as any;

    (rte as any)._handleResizeRevision();

    expect(editorContainer.style.width).toBe('');
  });

  it('returns early from revision resize when no editor exists', () => {
    const rte = new ScRichTextEditorV2();

    expect(() => (rte as any)._handleResizeRevision()).not.toThrow();
  });
});

describe('Snackbar functionality', () => {
  it('should show snackbar notification', () => {
    const rte = new ScRichTextEditorV2();

    (rte as any).showSnackbarNotification('Test message', 'success');

    expect((rte as any)._snackbarMessage).toBe('Test message');
    expect((rte as any)._snackbarType).toBe('success');
    expect((rte as any)._showSnackbar).toBe(true);
  });

  it('should handle sc-show-snackbar event in editorOnInit', () => {
    const rte = new ScRichTextEditorV2();
    let snackbarHandler: ((event: any) => void) | undefined;

    const mockEditor = {
      on: (event: string, cb: any) => {
        if (event === 'sc-show-snackbar') {
          snackbarHandler = cb;
        }
      },
      setContent: jest.fn(),
      formatter: { register: jest.fn() },
      addShortcut: jest.fn(),
    };

    rte.editorOnInit(mockEditor as any, { value: 'test' });

    // Trigger the snackbar event
    if (snackbarHandler) {
      snackbarHandler({
        detail: { message: 'Test notification', type: 'error' },
      });
    }

    expect((rte as any)._snackbarMessage).toBe('Test notification');
    expect((rte as any)._snackbarType).toBe('error');
    expect((rte as any)._showSnackbar).toBe(true);
  });
});

describe('Full screen functionality', () => {
  let mockEditor: any;

  beforeEach(() => {
    mockEditor = {
      getContent: jest.fn(() => '<p>test content</p>'),
      setContent: jest.fn(),
      removed: false,
      selection: { select: jest.fn(), collapse: jest.fn() },
      getBody: jest.fn(() => document.createElement('div')),
      focus: jest.fn(),
    };
  });

  it('should handle full screen when editor is ready and not readonly', () => {
    const rte = new ScRichTextEditorV2();
    rte.readonly = false;
    rte.editorInstance = mockEditor;

    rte.handleFullScreen();

    expect((rte as any)._fullScreenContent).toBe('<p>test content</p>');
    expect((rte as any)._showFullScreen).toBe(true);
  });

  it('should not handle full screen when readonly', () => {
    const rte = new ScRichTextEditorV2();
    rte.readonly = true;
    rte.editorInstance = mockEditor;

    rte.handleFullScreen();

    expect((rte as any)._showFullScreen).toBe(false);
  });

  it('should close full screen', () => {
    const rte = new ScRichTextEditorV2();
    (rte as any)._showFullScreen = true;
    (rte as any)._fullScreenContent = 'test';

    rte.closeFullScreen();

    expect((rte as any)._showFullScreen).toBe(false);
    expect((rte as any)._fullScreenContent).toBe('');
  });

  it('should update full screen content', () => {
    jest.useFakeTimers();
    const rte = new ScRichTextEditorV2();
    rte.editorInstance = mockEditor;
    rte.onChange = jest.fn();
    rte.moveCursorToEnd = jest.fn();

    const mockEvent = {
      detail: { content: '<p>new content</p>' },
    } as CustomEvent;

    rte.updateFullScreenContent(mockEvent);

    expect(rte.value).toBe('<p>new content</p>');
    expect(mockEditor.setContent).toHaveBeenCalledWith('<p>new content</p>');
    expect((rte as any)._showFullScreen).toBe(false);
    expect(rte.onChange).toHaveBeenCalled();

    jest.runAllTimers();
    expect(rte.moveCursorToEnd).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should not update when editor is removed', () => {
    const rte = new ScRichTextEditorV2();
    rte.editorInstance = { removed: true } as any;

    const mockEvent = {
      detail: { content: '<p>new content</p>' },
    } as CustomEvent;

    const originalValue = rte.value;
    rte.updateFullScreenContent(mockEvent);

    expect(rte.value).toBe(originalValue);
  });
});

describe('renderFullScreenLink functionality', () => {
  it('should render full screen link when enabled and not readonly', async () => {
    const el = await fixture<ScRichTextEditorV2>(
      html`<sc-rich-text-editor-v2 enable-fullscreen></sc-rich-text-editor-v2>`,
      { scopedElements: { 'sc-rich-text-editor-v2': ScRichTextEditorV2 } }
    );

    const result = el.renderFullScreenLink();
    expect(result).not.toBeNull();
  });

  it('should not render when fullscreen disabled', async () => {
    const el = await fixture<ScRichTextEditorV2>(
      html`<sc-rich-text-editor-v2></sc-rich-text-editor-v2>`,
      { scopedElements: { 'sc-rich-text-editor-v2': ScRichTextEditorV2 } }
    );

    const result = el.renderFullScreenLink();
    expect(result).toBeNull();
  });

  it('should not render when readonly', async () => {
    const el = await fixture<ScRichTextEditorV2>(
      html`<sc-rich-text-editor-v2
        enable-fullscreen
        readonly
      ></sc-rich-text-editor-v2>`,
      { scopedElements: { 'sc-rich-text-editor-v2': ScRichTextEditorV2 } }
    );

    const result = el.renderFullScreenLink();
    expect(result).toBeNull();
  });

  it('should not render when disabled attribute is set', async () => {
    const el = await fixture<ScRichTextEditorV2>(
      html`<sc-rich-text-editor-v2
        enable-fullscreen
        disabled
      ></sc-rich-text-editor-v2>`,
      { scopedElements: { 'sc-rich-text-editor-v2': ScRichTextEditorV2 } }
    );

    const result = el.renderFullScreenLink();
    expect(result).toBeNull();
  });
});

describe('ensureEditorIsReady functionality', () => {
  let rte: ScRichTextEditorV2;
  let initSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let querySelectorSpy: jest.SpyInstance;

  beforeEach(() => {
    rte = new ScRichTextEditorV2();
    initSpy = jest
      .spyOn(rte as any, 'initializeEditor')
      .mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // Ensure renderRoot is defined and mock querySelector
    if (!rte.renderRoot) {
      (rte as any).renderRoot = { querySelector: jest.fn() };
    } else if (typeof rte.renderRoot.querySelector !== 'function') {
      (rte.renderRoot as any).querySelector = jest.fn();
    }
    querySelectorSpy = jest.spyOn((rte as any).renderRoot, 'querySelector');
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    querySelectorSpy.mockRestore();
  });

  it('should reinitialize when target exists but editor is missing', () => {
    const mockTarget = { isConnected: true };
    querySelectorSpy.mockReturnValue(mockTarget as any);

    rte.editorInstance = null;

    (rte as any).ensureEditorIsReady();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Main editor instance was unhealthy. Re-initializing.'
    );
    expect(initSpy).toHaveBeenCalled();
  });

  it('should reinitialize when editor is removed', () => {
    const mockTarget = { isConnected: true };
    querySelectorSpy.mockReturnValue(mockTarget as any);

    rte.editorInstance = { removed: true } as any;

    (rte as any).ensureEditorIsReady();

    expect(initSpy).toHaveBeenCalled();
  });

  it('should not reinitialize when editor is healthy', () => {
    const mockTarget = { isConnected: true };
    querySelectorSpy.mockReturnValue(mockTarget as any);

    rte.editorInstance = { removed: false } as any;

    (rte as any).ensureEditorIsReady();

    expect(initSpy).not.toHaveBeenCalled();
  });

  it('should not reinitialize when target is not connected', () => {
    const mockTarget = { isConnected: false };
    querySelectorSpy.mockReturnValue(mockTarget as any);

    rte.editorInstance = null;

    (rte as any).ensureEditorIsReady();

    expect(initSpy).not.toHaveBeenCalled();
  });
});

describe('Lifecycle and property changes', () => {
  it('should re-initialize the editor when extConfig changes', async () => {
    jest.useFakeTimers();
    const el = await fixture<ScRichTextEditorV2>(
      html`<sc-rich-text-editor-v2></sc-rich-text-editor-v2>`,
      { scopedElements: { 'sc-rich-text-editor-v2': ScRichTextEditorV2 } }
    );
    await el.updateComplete;
    const cleanupSpy = jest.fn();
    const initSpy = jest.fn();
    (el as any)._cleanupInstance = cleanupSpy;
    (el as any).initializeEditor = initSpy;
    el.extConfig = { theme: 'silver' };
    await el.updateComplete;
    jest.runAllTimers();
    expect(cleanupSpy).toHaveBeenCalled();
    expect(initSpy).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should toggle disabled state and apply CSS classes to the editor', async () => {
    const el = await fixture<ScRichTextEditorV2>(
      html`<sc-rich-text-editor-v2></sc-rich-text-editor-v2>`,
      { scopedElements: { 'sc-rich-text-editor-v2': ScRichTextEditorV2 } }
    );
    const classListAddSpy = jest.fn();
    const classListRemoveSpy = jest.fn();
    const setModeSpy = jest.fn();
    el.editorInstance = {
      removed: false,
      on: jest.fn(),
      once: jest.fn(),
      off: jest.fn(),
      undoManager: { hasUndo: () => false, hasRedo: () => false },
      mode: {
        set: setModeSpy,
      },
      getDoc: () => ({
        documentElement: {
          classList: {
            add: classListAddSpy,
            remove: classListRemoveSpy,
          },
        },
        body: {
          classList: {
            add: classListAddSpy,
            remove: classListRemoveSpy,
          },
        },
      }),
    } as any;
    el.disabled = true;
    await el.updateComplete;
    expect(setModeSpy).toHaveBeenCalledWith('readonly');
    expect(classListAddSpy).toHaveBeenCalledWith('sc-rte-disabled');
    el.disabled = false;
    await el.updateComplete;
    expect(setModeSpy).toHaveBeenCalledWith('design');
    expect(classListRemoveSpy).toHaveBeenCalledWith('sc-rte-disabled');
  });

  it('should hot-swap scrollbar styles when config changes', async () => {
    const el = await fixture<ScRichTextEditorV2>(
      html`<sc-rich-text-editor-v2></sc-rich-text-editor-v2>`,
      { scopedElements: { 'sc-rich-text-editor-v2': ScRichTextEditorV2 } }
    );

    // Mock an active editor instance
    el.editorInstance = {
      removed: false,
      on: jest.fn(),
      once: jest.fn(),
      off: jest.fn(),
      undoManager: { hasUndo: () => false, hasRedo: () => false },
    } as any;

    await el.updateComplete;

    // Trigger the watcher by changing properties
    el.scrollbarSize = 'xl';
    el.scrollbarOpaque = true;

    await el.updateComplete;

    expect(injectScrollbarStyles).toHaveBeenCalledWith(
      el.editorInstance,
      expect.objectContaining({
        size: 'xl',
        opaque: true,
      })
    );
  });
});

describe('Placeholder functionality', () => {
  it('should update placeholder when changed', async () => {
    const rte = new ScRichTextEditorV2();
    const setOptionsSpy = jest.fn();
    const setAttributeSpy = jest.fn();
    const fireSpy = jest.fn();

    rte.editorInstance = {
      removed: false,
      options: {
        set: setOptionsSpy,
      },
      getBody: () => ({
        setAttribute: setAttributeSpy,
      }),
      getContent: () => '',
      fire: fireSpy,
    } as any;

    (rte as any).hasUpdated = true;

    rte.placeholder = 'Test placeholder';
    rte.onPlaceholderChange();

    expect(setOptionsSpy).toHaveBeenCalledWith(
      'placeholder',
      'Test placeholder'
    );
    expect(setAttributeSpy).toHaveBeenCalledWith(
      'data-mce-placeholder',
      'Test placeholder'
    );
    expect(fireSpy).toHaveBeenCalledWith('blur');
  });

  it('should not fire blur when content is not empty', async () => {
    const rte = new ScRichTextEditorV2();
    const fireSpy = jest.fn();

    rte.editorInstance = {
      removed: false,
      options: {
        set: jest.fn(),
      },
      getBody: () => ({
        setAttribute: jest.fn(),
      }),
      getContent: () => 'some content',
      fire: fireSpy,
    } as any;

    (rte as any).hasUpdated = true;

    rte.placeholder = 'Test placeholder';
    rte.onPlaceholderChange();

    expect(fireSpy).not.toHaveBeenCalled();
  });
});

describe('data-mce-href attribute sanitization', () => {
  // Helper to create a mock editor whose getContent mirrors what was set via setContent,
  // simulating how the real TinyMCE instance stores content.
  function makeMirrorEditor() {
    let storedContent = '';
    const editorInstance = {
      getContent: jest.fn((_opts?: any) => storedContent),
      setContent: jest.fn((val: string) => { storedContent = val; }),
      removed: false,
      hasFocus: jest.fn(() => false),
      selection: {
        isCollapsed: jest.fn(() => true),
        getBookmark: jest.fn(() => null),
        moveToBookmark: jest.fn(),
      },
    };
    return editorInstance;
  }

  // --- _sanitizeInputValue unit tests ---

  it('removes double-quoted data-mce-href from anchor elements', () => {
    const rte = new ScRichTextEditorV2();
    const input = '<p><a href="https://example.com" data-mce-href="https://example.com">Link</a></p>';
    const result = (rte as any)._sanitizeInputValue(input);
    expect(result).not.toContain('data-mce-href');
    expect(result).toBe('<p><a href="https://example.com">Link</a></p>');
  });

  it('removes single-quoted data-mce-href from anchor elements', () => {
    const rte = new ScRichTextEditorV2();
    const input = '<p><a href=\'https://example.com\' data-mce-href=\'https://example.com\'>Link</a></p>';
    const result = (rte as any)._sanitizeInputValue(input);
    expect(result).not.toContain('data-mce-href');
    expect(result).toBe('<p><a href=\'https://example.com\'>Link</a></p>');
  });

  it('removes unquoted data-mce-href from anchor elements', () => {
    const rte = new ScRichTextEditorV2();
    const input = '<p><a href="https://example.com" data-mce-href=https://example.com>Link</a></p>';
    const result = (rte as any)._sanitizeInputValue(input);
    expect(result).not.toContain('data-mce-href');
    expect(result).toBe('<p><a href="https://example.com">Link</a></p>');
  });

  it('does not corrupt element names containing data-mce- as part of the tag name', () => {
    const rte = new ScRichTextEditorV2();
    // Tag name itself contains "data-mce-" — should not be modified
    const input = '<something-data-mce-value class="test">content</something-data-mce-value>';
    const result = (rte as any)._sanitizeInputValue(input);
    expect(result).toBe(input);
  });

  it('removes data-mce-* attribute from element whose name ends with data-mce- substring', () => {
    const rte = new ScRichTextEditorV2();
    // Tag name contains "data-mce-" but the element also has a real data-mce-* attribute
    const input = '<something-data-mce-value data-mce-href="x">text</something-data-mce-value>';
    const result = (rte as any)._sanitizeInputValue(input);
    // The attribute should be removed but the tag name must remain intact
    expect(result).not.toContain('data-mce-href');
    expect(result).toContain('<something-data-mce-value>');
  });

  it('preserves href when only data-mce-href is removed', () => {
    const rte = new ScRichTextEditorV2();
    // Both href and data-mce-href present — only data-mce-href should go
    const input = '<a href="https://example.com" data-mce-href="https://example.com" target="_blank">Click</a>';
    const result = (rte as any)._sanitizeInputValue(input);
    expect(result).toContain('href="https://example.com"');
    expect(result).toContain('target="_blank"');
    expect(result).not.toContain('data-mce-href');
  });

  // --- sc-change event integration tests ---

  it('emits sc-change with detail.text having double-quoted data-mce-href removed', () => {
    jest.useFakeTimers();
    const rte = new ScRichTextEditorV2();
    (rte as any).getMentionedUsers = jest.fn(() => []);
    rte.editorInstance = makeMirrorEditor() as any;

    const captured: CustomEvent[] = [];
    rte.addEventListener('sc-change', (e: Event) => captured.push(e as CustomEvent));

    (rte as any)._isInternalUpdate = false;
    rte.value = '<p><a href="https://example.com" data-mce-href="https://example.com">Link</a></p>';
    rte.onValueChange();
    rte.onChange();
    jest.runAllTimers();

    expect(captured).toHaveLength(1);
    expect(captured[0].detail.text).not.toContain('data-mce-href');
    expect(captured[0].detail.text).toContain('href="https://example.com"');
    jest.useRealTimers();
  });

  it('emits sc-change with detail.text having single-quoted data-mce-href removed', () => {
    jest.useFakeTimers();
    const rte = new ScRichTextEditorV2();
    (rte as any).getMentionedUsers = jest.fn(() => []);
    rte.editorInstance = makeMirrorEditor() as any;

    const captured: CustomEvent[] = [];
    rte.addEventListener('sc-change', (e: Event) => captured.push(e as CustomEvent));

    (rte as any)._isInternalUpdate = false;
    rte.value = '<p><a href=\'https://example.com\' data-mce-href=\'https://example.com\'>Link</a></p>';
    rte.onValueChange();
    rte.onChange();
    jest.runAllTimers();

    expect(captured).toHaveLength(1);
    expect(captured[0].detail.text).not.toContain('data-mce-href');
    expect(captured[0].detail.text).toContain('https://example.com');
    jest.useRealTimers();
  });

  it('emits sc-change with detail.text having unquoted data-mce-href removed', () => {
    jest.useFakeTimers();
    const rte = new ScRichTextEditorV2();
    (rte as any).getMentionedUsers = jest.fn(() => []);
    rte.editorInstance = makeMirrorEditor() as any;

    const captured: CustomEvent[] = [];
    rte.addEventListener('sc-change', (e: Event) => captured.push(e as CustomEvent));

    (rte as any)._isInternalUpdate = false;
    rte.value = '<p><a href="https://example.com" data-mce-href=https://example.com>Link</a></p>';
    rte.onValueChange();
    rte.onChange();
    jest.runAllTimers();

    expect(captured).toHaveLength(1);
    expect(captured[0].detail.text).not.toContain('data-mce-href');
    expect(captured[0].detail.text).toContain('href="https://example.com"');
    jest.useRealTimers();
  });
});

describe('format === md branch', () => {
  function makeMirrorEditor(extraPlugins: Record<string, any> = {}) {
    let storedContent = '';
    return {
      getContent: jest.fn((_opts?: any) => storedContent),
      setContent: jest.fn((val: string) => { storedContent = val; }),
      removed: false,
      hasFocus: jest.fn(() => false),
      selection: {
        isCollapsed: jest.fn(() => true),
        getBookmark: jest.fn(() => null),
        moveToBookmark: jest.fn(),
      },
      plugins: extraPlugins,
    };
  }

  it('onChange emits detail.md via markdownPlugin.getMarkdown when format is md', () => {
    jest.useFakeTimers();
    const rte = new ScRichTextEditorV2();
    (rte as any).getMentionedUsers = jest.fn(() => []);
    const mockMarkdownPlugin = { getMarkdown: jest.fn(() => '# hello') };
    rte.editorInstance = makeMirrorEditor({ scMarkdown: mockMarkdownPlugin }) as any;
    (rte as any).format = 'md';

    const captured: CustomEvent[] = [];
    rte.addEventListener('sc-change', (e: Event) => captured.push(e as CustomEvent));

    rte.onChange();
    jest.runAllTimers();

    expect(captured).toHaveLength(1);
    const md = captured[0].detail.md;
    expect(md).toBe('# hello');
    expect(mockMarkdownPlugin.getMarkdown).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('onChange detail.md returns empty string when markdownPlugin is absent', () => {
    jest.useFakeTimers();
    const rte = new ScRichTextEditorV2();
    (rte as any).getMentionedUsers = jest.fn(() => []);
    rte.editorInstance = makeMirrorEditor() as any; // no scMarkdown plugin
    (rte as any).format = 'md';

    const captured: CustomEvent[] = [];
    rte.addEventListener('sc-change', (e: Event) => captured.push(e as CustomEvent));

    rte.onChange();
    jest.runAllTimers();

    expect(captured).toHaveLength(1);
    expect(captured[0].detail.md).toBe('');
    jest.useRealTimers();
  });

  it('markdownPlugin getter returns scMarkdown plugin from editorInstance', () => {
    const rte = new ScRichTextEditorV2();
    const mockApi = { getMarkdown: jest.fn(), setMarkdown: jest.fn(), setEnabled: jest.fn() };
    rte.editorInstance = { plugins: { scMarkdown: mockApi } } as any;
    expect((rte as any).markdownPlugin).toBe(mockApi);
  });

  it('markdownPlugin getter returns undefined when editorInstance has no scMarkdown', () => {
    const rte = new ScRichTextEditorV2();
    rte.editorInstance = { plugins: {} } as any;
    expect((rte as any).markdownPlugin).toBeUndefined();
  });

  it('markdownPlugin getter returns undefined when editorInstance is null', () => {
    const rte = new ScRichTextEditorV2();
    rte.editorInstance = null as any;
    expect((rte as any).markdownPlugin).toBeUndefined();
  });
});

describe('ScRteFullscreenModal editorOnInit', () => {
  it('calls super.editorOnInit with the new props signature', () => {
    const modal = new ScRteFullscreenModal();
    const mockEditor = {
      on: jest.fn(),
      once: jest.fn(),
      off: jest.fn(),
      formatter: { register: jest.fn() },
      addShortcut: jest.fn(),
      setContent: jest.fn(),
      selection: { getBookmark: jest.fn(), moveToBookmark: jest.fn() },
    };
    expect(() => modal.editorOnInit(mockEditor as any, { value: '<p>hello</p>' })).not.toThrow();
  });

  it('exposes the format property with default html', () => {
    const modal = new ScRteFullscreenModal();
    expect((modal as any).format).toBe('html');
  });

  it('passes format to initTinyMCE when modal opens', async () => {
    jest.useFakeTimers();
    const el = await fixture<ScRteFullscreenModal>(
      html`<sc-rte-fullscreen-modal></sc-rte-fullscreen-modal>`,
      { scopedElements: { 'sc-rte-fullscreen-modal': ScRteFullscreenModal } }
    );
    (el as any).format = 'md';
    const initSpy = jest.spyOn(el as any, 'initTinyMCE').mockImplementation(() => {});
    el.open = true;
    await el.updateComplete;
    expect(initSpy).toHaveBeenCalledWith(expect.objectContaining({ format: 'md' }));
    jest.useRealTimers();
  });
});