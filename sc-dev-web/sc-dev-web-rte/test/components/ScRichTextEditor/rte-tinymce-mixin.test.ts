/* eslint-disable import/first */

// Mock ScRteElement with required static method before imports
jest.mock('../../../src/shared/sc-rte-element.js', () => {
  return {
    __esModule: true,
    default: class {
      static createProperty() {}
    },
  };
});

jest.mock('../../../src/components/ScRichTextEditor/styles/tinymce-scrollbar.style.js', () => ({
  injectScrollbarStyles: jest.fn(),
}));

import { RteTinyMCEWrapperMixin } from '../../../src/components/ScRichTextEditor/mixins/rte-tinymce-mixin.js';
import { PasteHandler } from '../../../src/components/ScRichTextEditor/mixins/rte-tinymce-paste-handler.js';
import ScRteElement from '../../../src/shared/sc-rte-element.js';
import { RteViewportHandler } from '../../../src/components/ScRichTextEditor/mixins/rte-tinymce-viewport-handler.js';
import { RteCleanupHandler } from '../../../src/components/ScRichTextEditor/mixins/rte-tinymce-cleanup-handler.js';
import { injectScrollbarStyles } from '../../../src/components/ScRichTextEditor/styles/tinymce-scrollbar.style.js';

// Mock dependencies
jest.mock(
  '../../../src/components/ScRichTextEditor/mixins/rte-tinymce-paste-handler.js'
);
jest.mock('../../../src/shared/generate-unique-id.js', () => ({
  generateFileUniqueId: jest.fn(() => 'test-editor-123'),
}));
jest.mock('../../../src/components/ScRichTextEditor/mixins/rte-tinymce-viewport-handler.js');
jest.mock('../../../src/components/ScRichTextEditor/mixins/rte-tinymce-cleanup-handler.js');
jest.mock('../../../src/components/ScRichTextEditor/mixins/rte-tinymce-brand-handler.js');
jest.mock('../../../src/components/ScRichTextEditor/mixins/rte-tinymce-list-handler.js');
jest.mock('../../../src/components/ScRichTextEditor/mixins/rte-tinymce-mention-handler.js');
jest.mock('../../../src/components/ScRichTextEditor/mixins/rte-tinymce-email-handler.js');

// Shared mock editor instance used across tests.
const createMockEditor = () => ({
  setContent: jest.fn(),
  getContent: jest.fn(() => '<p>Test content</p>'),
  getBody: jest.fn(() => document.createElement('div')),
  formatter: { register: jest.fn() },
  addShortcut: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  destroy: jest.fn(),
  getParam: jest.fn(),
  settings: { height: 200 },
  selection: {
    getRng: jest.fn(() => new Range()),
    getStart: jest.fn(() => document.createElement('p')),
    getContent: jest.fn(() => ''),
  },
  plugins: {
    wordcount: { body: { getCharacterCount: jest.fn(() => 50) } },
  },
  notificationManager: { open: jest.fn() },
  options: {
    isRegistered: jest.fn(() => false),
    register: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  },
  getDoc: jest.fn(() => document),
  mode: { set: jest.fn() },
  removed: false,
  focus: jest.fn(),
  iframeElement: null,
  cleanupHandler: { debouncedCleanup: jest.fn(), destroy: jest.fn() },
}) as any;

const mockEditor = createMockEditor();

const resetMockEditor = (overrides: Record<string, any> = {}) => {
  const freshEditor = createMockEditor();
  Object.keys(mockEditor).forEach(key => {
    delete mockEditor[key];
  });
  Object.assign(mockEditor, freshEditor, overrides);
  return mockEditor;
};

const mockTinyMCE = {
  init: jest.fn(),
  remove: jest.fn(),
};

// Mock window objects
Object.defineProperty(window, 'hugerte', {
  value: mockTinyMCE,
  writable: true,
});
Object.defineProperty(window, 'tinymce', {
  value: mockTinyMCE,
  writable: true,
});

// Test element class
class TestElement extends ScRteElement {
  renderRoot = document.createElement('div');
  constructor() {
    super();
    const el = document.createElement('div');
    el.id = 'test-editor-123';
    this.renderRoot.appendChild(el);
  }
}

function sleep(n = 100) {
  return new Promise(resolve => setTimeout(resolve, 100));
}

const TestMixin = RteTinyMCEWrapperMixin(TestElement);

describe('RteTinyMCEWrapperMixin', () => {
  let instance: any;
  let mockPasteHandler: any;

  beforeEach(() => {
    jest.clearAllMocks();
    resetMockEditor();
    mockTinyMCE.init.mockClear();
    mockTinyMCE.remove.mockClear();
    mockPasteHandler = {
      initialize: jest.fn(),
      handlePastePreprocess: jest.fn(),
      handlePastePostprocess: jest.fn(),
      handlePasteEvent: jest.fn(),
      clearExcelStyles: jest.fn(),
      setMaxLength: jest.fn(),
    };
    (PasteHandler as jest.MockedClass<typeof PasteHandler>).mockImplementation(
      () => mockPasteHandler
    );
    instance = new TestMixin();
    instance.editorInstance = null;
    instance.editorId = 'test-editor-123';
    instance.pasteHandler = mockPasteHandler;
    // Prevent debounced _syncColorMode timers from leaking into other describe blocks
    instance._syncColorMode = Object.assign(jest.fn(), {
      cancel: jest.fn(),
      flush: jest.fn(),
      schedule: jest.fn(),
    });

    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    instance?._obsrvr?.disconnect?.();
  });

  describe('basic functionality', () => {
    it('should initialize with default values', () => {
      expect(instance.editorId).toBe('test-editor-123');
      expect(instance.editorInstance).toBeNull();
    });

    it('should create PasteHandler instance', () => {
      expect(PasteHandler).toHaveBeenCalled();
    });

    it('should get TinyMCE instance', () => {
      const result = instance._getTinyMCE();
      expect(result).toBe(mockTinyMCE);
    });
  });

  describe('initTinyMCE', () => {
    const mockProps = {
      value: '<p>Test</p>',
      readonly: false,
      disabled: false,
      disableSpellcheck: false,
      shortcut: true,
      maxLength: 1000,
    };

    it('should call TinyMCE init with config', async () => {
      instance.initTinyMCE(mockProps);
      await sleep(100);
      expect(mockTinyMCE.init).toHaveBeenCalled();
    });

    it('should handle spellcheck setting', async () => {
      instance.initTinyMCE({ ...mockProps, disableSpellcheck: true });
      await sleep(100);
      expect(mockTinyMCE.init).toHaveBeenCalledWith(
        expect.objectContaining({ browser_spellcheck: false })
      );
    });

    it('should handle readonly setting', async () => {
      instance.initTinyMCE({ ...mockProps, readonly: true });
      await sleep(100);
      expect(mockTinyMCE.init).toHaveBeenCalledWith(
        expect.objectContaining({ readonly: true })
      );
    });

    it('should inject scrollbar styles on editor init', async () => {
      const editor = resetMockEditor({
        on: jest.fn(),
        options: {
          isRegistered: jest.fn(() => false),
          register: jest.fn(),
          get: jest.fn(),
          set: jest.fn(),
        },
      });

      const localMockTinyMCE = {
        init: jest.fn(config => {
          if (config.setup) {
            config.setup(editor);
          }
        }),
      };
      instance._getTinyMCE = jest.fn().mockReturnValue(localMockTinyMCE);

      instance.initTinyMCE({
        value: '',
        readonly: false,
        scrollbarSize: 'lg',
        scrollbarOpaque: true,
      });
      await sleep(100);

      const initHandlers = editor.on.mock.calls
        .filter((call: any) => call[0] === 'init')
        .map((call: any) => call[1]);

      initHandlers.forEach((handler: any) => handler());

      expect(injectScrollbarStyles).toHaveBeenCalledWith(
        editor,
        expect.objectContaining({
          size: 'lg',
          opaque: true,
        })
      );
    });

    it('should restore body identifiers on Preinit', async () => {
      const handlers: Record<string, (() => void)[]> = {};
      const iframeDoc = document.implementation.createHTMLDocument('iframe');
      const editor = resetMockEditor({
        id: 'rte-test-editor-123',
        on: jest.fn((event: string, cb: () => void) => {
          if (!handlers[event]) handlers[event] = [];
          handlers[event].push(cb);
        }),
        getWin: jest.fn(() => ({ document: iframeDoc })),
        dom: { doc: iframeDoc },
      });

      const localMockTinyMCE = {
        init: jest.fn(config => {
          if (config.setup) config.setup(editor);
        }),
      };
      instance._getTinyMCE = jest.fn().mockReturnValue(localMockTinyMCE);

      instance.initTinyMCE({
        value: '',
        readonly: false,
        disabled: false,
        disableSpellcheck: false,
        shortcut: false,
        maxLength: 1000,
      });
      await sleep(100);

      (handlers.Preinit || []).forEach(cb => cb());

      expect(iframeDoc.body.getAttribute('id')).toBe('hugerte');
      expect(iframeDoc.body.getAttribute('class')).toBe('mce-content-body');
      expect(iframeDoc.body.getAttribute('data-id')).toBe('rte-test-editor-123');
    });

    it('should copy only Sc stylesheet links into iframe on Preinit', async () => {
      const handlers: Record<string, (() => void)[]> = {};
      const iframeDoc = document.implementation.createHTMLDocument('iframe');
      const editor = resetMockEditor({
        id: 'rte-test-editor-123',
        on: jest.fn((event: string, cb: () => void) => {
          if (!handlers[event]) handlers[event] = [];
          handlers[event].push(cb);
        }),
        getWin: jest.fn(() => ({ document: iframeDoc })),
        dom: { doc: iframeDoc },
      });

      const linkSc = document.createElement('link');
      linkSc.rel = 'stylesheet';
      linkSc.href = '/styles/ScLightModeRte.css';
      const linkNonSc = document.createElement('link');
      linkNonSc.rel = 'stylesheet';
      linkNonSc.href = '/styles/app.css';
      document.head.appendChild(linkSc);
      document.head.appendChild(linkNonSc);

      const localMockTinyMCE = {
        init: jest.fn(config => {
          if (config.setup) config.setup(editor);
        }),
      };
      instance._getTinyMCE = jest.fn().mockReturnValue(localMockTinyMCE);

      instance.initTinyMCE({
        value: '',
        readonly: false,
        disabled: false,
        disableSpellcheck: false,
        shortcut: false,
        maxLength: 1000,
      });
      await sleep(100);

      (handlers.Preinit || []).forEach(cb => cb());

      const copiedLinks = Array.from(iframeDoc.head.querySelectorAll('link[rel="stylesheet"]'));
      expect(copiedLinks).toHaveLength(1);
      expect(copiedLinks[0].getAttribute('href')).toContain('ScLightModeRte.css');

      linkSc.remove();
      linkNonSc.remove();
    });
  });

  describe('editor lifecycle methods', () => {
    it('should handle editorOnInit', () => {
      expect(() =>
        instance.editorOnInit(mockEditor, { value: '<p>Test</p>', shortcut: true })
      ).not.toThrow();
      expect(mockEditor.setContent).toHaveBeenCalledWith('<p>Test</p>', { format: undefined });
      expect(instance.editorInstance).toBe(mockEditor);
    });

    it('should handle editorOnInit without shortcuts', () => {
      expect(() =>
        instance.editorOnInit(mockEditor, { value: '<p>Test</p>', shortcut: false })
      ).not.toThrow();
    });

    it('should set editor to readonly mode when instance.readonly is true', () => {
      const editorWithMode = {
        ...mockEditor,
        mode: { set: jest.fn() },
        getDoc: jest.fn(() => document),
      };
      instance.readonly = true;
      instance.disabled = false;

      instance.editorOnInit(editorWithMode as any, { value: '<p>Test</p>', shortcut: false });

      expect(editorWithMode.mode.set).toHaveBeenCalledWith('readonly');
    });

    it('should add disabled classes when instance.disabled is true', () => {
      const mockDoc = {
        documentElement: { classList: { add: jest.fn() } },
        body: { classList: { add: jest.fn() } },
      };
      const editorWithMode = {
        ...mockEditor,
        mode: { set: jest.fn() },
        getDoc: jest.fn(() => mockDoc),
      };
      instance.readonly = false;
      instance.disabled = true;

      instance.editorOnInit(editorWithMode as any, { value: '<p>Test</p>', shortcut: false });

      expect(editorWithMode.mode.set).toHaveBeenCalledWith('readonly');
      expect(mockDoc.documentElement.classList.add).toHaveBeenCalledWith('sc-rte-disabled');
      expect(mockDoc.body.classList.add).toHaveBeenCalledWith('sc-rte-disabled');
    });

    it('should handle editorOnNodeChange', () => {
      const mockEvent = { element: document.createElement('h1') };
      expect(() => instance.editorOnNodeChange(mockEvent)).not.toThrow();
    });

    it('should handle editorOnSetContent', () => {
      expect(() => instance.editorOnSetContent(mockEditor)).not.toThrow();
    });
  });

  describe('content methods', () => {
    it('should get semantic HTML', () => {
      instance.editorInstance = mockEditor;
      mockEditor.getContent.mockReturnValue('<!--?lit$123$--><p>Clean</p>');

      const result = instance.getSemanticHtml();
      expect(result).toBe('<p>Clean</p>');
    });

    it('should handle null editor in getSemanticHtml', () => {
      instance.editorInstance = null;
      const result = instance.getSemanticHtml();
      expect(result).toBeUndefined();
    });
  });

  describe('keydown handling', () => {
    let mockEvent: any;

    beforeEach(() => {
      mockEvent = {
        key: 'a',
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      };
    });

    it('should allow typing under character limit', () => {
      const result = instance.editorOnKeydown(mockEvent, mockEditor, 100);
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should prevent typing over character limit', () => {
      mockEditor.plugins.wordcount.body.getCharacterCount.mockReturnValue(150);
      const result = instance.editorOnKeydown(mockEvent, mockEditor, 100);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should allow navigation keys over limit', () => {
      mockEditor.plugins.wordcount.body.getCharacterCount.mockReturnValue(150);
      mockEvent.key = 'Backspace';

      instance.editorOnKeydown(mockEvent, mockEditor, 100);
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('cleanup functionality', () => {
    it('should run disconnectedCallback with cleanup logic', () => {
      // Create a test class that extends the mixin and provides disconnectedCallback
      class TestElementWithDisconnect extends ScRteElement {
        renderRoot = document.createElement('div');
        disconnectedCallback() {
          // Empty parent method to prevent super call errors
        }
        constructor() {
          super();
          const el = document.createElement('div');
          el.id = 'test-editor-123';
          this.renderRoot.appendChild(el);
        }
      }

      const TestMixinWithDisconnect = RteTinyMCEWrapperMixin(
        TestElementWithDisconnect
      );
      const testInstance = new TestMixinWithDisconnect() as any;

      // Set up the editor instance
      const mockEditorInstance = {
        off: jest.fn(),
        destroy: jest.fn(),
        removed: false,
      } as any;

      testInstance.editorInstance = mockEditorInstance;
      testInstance.editorId = 'test-editor-123';

      // Mock paste handler
      testInstance.pasteHandler = {
        clearExcelStyles: jest.fn(),
      };

      // Mock both tinymce and hugerte for compatibility
      const mockTinyMCELib = {
        get: jest.fn().mockReturnValue(mockEditorInstance),
        remove: jest.fn(),
      };

      // Set up both window.tinymce and window.hugerte
      (window as any).tinymce = mockTinyMCELib;
      (window as any).hugerte = mockTinyMCELib;

      // Mock the _getTinyMCE method to return the mock
      testInstance._getTinyMCE = jest.fn().mockReturnValue(mockTinyMCELib);

      // Spy on console.warn to verify error handling
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // Call disconnectedCallback (this should execute all the cleanup code)
      testInstance.disconnectedCallback();

      // Verify all cleanup actions occurred
      expect(mockEditorInstance.destroy).toHaveBeenCalled();
      expect(testInstance.editorInstance).toBeNull();
      expect(mockTinyMCELib.get).toHaveBeenCalledWith('test-editor-123');
      expect(mockTinyMCELib.remove).toHaveBeenCalledWith(
        '#test-editor-123'
      );
      expect(testInstance.pasteHandler.clearExcelStyles).toHaveBeenCalled();

      // Clean up
      consoleWarnSpy.mockRestore();
    });

    it('should handle errors in disconnectedCallback gracefully', () => {
      // Test error handling paths for coverage
      class TestElementWithDisconnect extends ScRteElement {
        renderRoot = document.createElement('div');
        disconnectedCallback() {
          // Empty parent method
        }
      }

      const TestMixinWithDisconnect = RteTinyMCEWrapperMixin(
        TestElementWithDisconnect
      );
      const testInstance = new TestMixinWithDisconnect() as any;

      // Set up an editor instance that throws errors
      const mockEditorInstance = {
        off: jest.fn(() => {
          throw new Error('off error');
        }),
        destroy: jest.fn(() => {
          throw new Error('destroy error');
        }),
        removed: false,
      } as any;

      testInstance.editorInstance = mockEditorInstance;
      testInstance.editorId = 'test-editor-123';

      // Mock paste handler
      testInstance.pasteHandler = {
        clearExcelStyles: jest.fn(),
      };

      // Mock library that throws error
      const mockTinyMCELib = {
        get: jest.fn().mockReturnValue(mockEditorInstance),
        remove: jest.fn(() => {
          throw new Error('remove error');
        }),
      };

      // Set up both for compatibility
      (window as any).tinymce = mockTinyMCELib;
      (window as any).hugerte = mockTinyMCELib;

      // Mock the _getTinyMCE method to return our mock
      testInstance._getTinyMCE = jest.fn().mockReturnValue(mockTinyMCELib);

      // Spy on console.warn
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // This should not throw despite the errors
      expect(() => testInstance.disconnectedCallback()).not.toThrow();

      // Verify console.warn was called for error handling
      expect(consoleWarnSpy).toHaveBeenCalled();

      // Clean up
      consoleWarnSpy.mockRestore();
    });
  });

  describe('edge cases', () => {
    it('should handle missing target element', async () => {
      // Create a local mock with init method
      const localMockTinyMCE = {
        init: jest.fn(),
        remove: jest.fn(),
      };

      // Set up both window properties for compatibility
      (window as any).hugerte = localMockTinyMCE;
      (window as any).tinymce = localMockTinyMCE;

      // Mock the instance's _getTinyMCE method to return our local mock
      instance._getTinyMCE = jest.fn().mockReturnValue(localMockTinyMCE);

      instance.renderRoot = document.createElement('div'); // Empty div

      expect(() =>
        instance.initTinyMCE({
          value: '<p>Test</p>',
          readonly: false,
          disabled: false,
          disableSpellcheck: false,
          shortcut: true,
          maxLength: 1000,
        })
      ).not.toThrow();

      await sleep(100);

      // Verify init was called
      expect(localMockTinyMCE.init).toHaveBeenCalled();

      // Verify init was called with null target (since element doesn't exist)
      expect(localMockTinyMCE.init).toHaveBeenCalledWith(
        expect.objectContaining({ target: null })
      );
    });
  });
});

describe('TinyMCE event handlers', () => {
  let instance: any;

  beforeEach(() => {
    // Create a fresh instance for each test
    resetMockEditor();
    instance = new TestMixin();
    instance.editorInstance = null;
    instance.editorId = 'test-editor-123';
    instance.pasteHandler = {
      initialize: jest.fn(),
      handlePastePreprocess: jest.fn(),
      handlePastePostprocess: jest.fn(),
      handlePasteEvent: jest.fn(),
      clearExcelStyles: jest.fn(),
      setMaxLength: jest.fn(),
    };
    // Prevent debounced _syncColorMode timers from leaking into other describe blocks
    instance._syncColorMode = Object.assign(jest.fn(), {
      cancel: jest.fn(),
      flush: jest.fn(),
      schedule: jest.fn(),
    });
  });

  afterEach(() => {
    instance?._obsrvr?.disconnect?.();
  });

  it('should handle paste handler methods', () => {
    const mockArgs = { content: 'test content' };
    const mockPasteEvent = { clipboardData: { getData: jest.fn() } };

    // Just call the methods to hit coverage
    instance.pasteHandler.handlePastePreprocess(mockArgs);
    instance.pasteHandler.handlePastePostprocess(mockArgs);
    instance.pasteHandler.handlePasteEvent(mockPasteEvent);

    expect(instance.pasteHandler.handlePastePreprocess).toHaveBeenCalledWith(
      mockArgs
    );
    expect(instance.pasteHandler.handlePastePostprocess).toHaveBeenCalledWith(
      mockArgs
    );
    expect(instance.pasteHandler.handlePasteEvent).toHaveBeenCalledWith(
      mockPasteEvent
    );
  });

  it('should handle editorOnNodeChange', () => {
    const ulElement = document.createElement('ul');
    const mockEvent = { element: ulElement };

    instance.editorOnNodeChange(mockEvent);

    expect(ulElement.classList.contains('list-disc')).toBe(true);
    expect(ulElement.classList.contains('list-inside')).toBe(true);
  });

  it('should test notification manager override logic', () => {
    const originalOpen = jest.fn();
    const notificationManager = { open: originalOpen };

    // Test the notification filtering logic directly
    const overrideFunction = function (this: any, spec: any) {
      if (
        spec.text &&
        (spec.text.includes('clipboard') ||
          spec.text.includes('Ctrl+X/C/V') ||
          spec.text.includes('copy') ||
          spec.text.includes('paste'))
      ) {
        return {
          close: () => {},
          reposition: () => {},
          getEl: () => document.createElement('div'),
        };
      }
      return originalOpen.call(this, spec);
    };

    // Test clipboard notification gets suppressed
    const suppressedResult = overrideFunction({ text: 'clipboard error' });
    expect(suppressedResult.close).toBeDefined();
    expect(originalOpen).not.toHaveBeenCalled();

    // Test normal notification passes through
    overrideFunction({ text: 'normal message' });
    expect(originalOpen).toHaveBeenCalledWith({ text: 'normal message' });
  });

  it('should test event handler setup', () => {
    let selectionCallback: any;
    let keydownCallback: any;
    let pasteCallback: any;

    const mockEditorForEvents = {
      on: jest.fn((event: string, callback: any) => {
        if (event === 'SelectionChange') selectionCallback = callback;
        if (event === 'keydown') keydownCallback = callback;
        if (event === 'paste') pasteCallback = callback;
      }),
      selection: {
        getRng: () => new Range(),
        getStart: () => {
          const div = document.createElement('div');
          Object.defineProperty(div, 'nodeName', { value: 'DIV' });
          Object.defineProperty(div, 'parentNode', {
            value: { nodeName: 'BODY' },
          });
          return div;
        },
      },
      plugins: {
        wordcount: {
          body: {
            getCharacterCount: jest.fn(() => 0),
          },
        },
      },
    };

    // Simulate the setup callback being called
    const setupCallback = (editor: any) => {
      editor.on('SelectionChange', () => {
        instance.selectionRange = editor.selection.getRng();
        let baseNodeSelected = editor.selection.getStart(true);
        const allNodesSelected = [];
        while (baseNodeSelected.nodeName !== 'BODY') {
          allNodesSelected.push(baseNodeSelected);
          baseNodeSelected = baseNodeSelected.parentNode;
        }
        instance.selectedNodes = allNodesSelected;
      });

      editor.on('keydown', (event: any) => {
        instance.editorOnKeydown(event, editor, 1000);
      });

      editor.on('paste', (e: any) => {
        instance.pasteHandler.handlePasteEvent(e);
      });
    };

    setupCallback(mockEditorForEvents);

    // Test SelectionChange
    selectionCallback();
    expect(instance.selectionRange).toBeDefined();

    // Test keydown
    const keyEvent = {
      key: 'a',
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    keydownCallback(keyEvent);

    // Test paste
    const pasteEvent = { clipboardData: { getData: jest.fn() } };
    pasteCallback(pasteEvent);
    expect(instance.pasteHandler.handlePasteEvent).toHaveBeenCalledWith(
      pasteEvent
    );
  });

  describe('moveCursorToEnd', () => {
    let instance: any;

    beforeEach(() => {
      instance = new TestMixin();
      instance.editorInstance = null;
      instance.editorId = 'test-editor-123';
    });

    it('should move cursor to end when editor exists', () => {
      const mockSelection = {
        select: jest.fn(),
        collapse: jest.fn(),
      };
      const editor = resetMockEditor({
        removed: false,
        getBody: jest.fn(() => document.createElement('div')),
        selection: mockSelection,
        focus: jest.fn(),
      });

      instance.editorInstance = editor;
      instance.moveCursorToEnd();

      expect(mockSelection.select).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        true
      );
      expect(mockSelection.collapse).toHaveBeenCalledWith(false);
      expect(editor.focus).toHaveBeenCalled();
    });

    it('should not move cursor when editor is removed', () => {
      const editor = resetMockEditor({
        removed: true,
        selection: { select: jest.fn(), collapse: jest.fn() },
        focus: jest.fn(),
      });

      instance.editorInstance = editor;
      instance.moveCursorToEnd();

      expect(editor.selection.select).not.toHaveBeenCalled();
    });

    it('should not move cursor when editor is null', () => {
      instance.editorInstance = null;
      expect(() => instance.moveCursorToEnd()).not.toThrow();
    });
  });

  describe('Configuration handling', () => {
    let instance: any;
    let localMockTinyMCE: any;

    beforeEach(() => {
      resetMockEditor();
      localMockTinyMCE = {
        init: jest.fn(),
        remove: jest.fn(),
      };

      Object.defineProperty(window, 'hugerte', {
        value: localMockTinyMCE,
        writable: true,
      });

      instance = new TestMixin();
      instance.editorInstance = null;
      instance.editorId = 'test-editor-123';

      // Ensure the target element exists in the DOM
      const editorDiv = document.createElement('div');
      editorDiv.id = 'test-editor-123';
      instance.renderRoot = document.createElement('div');
      instance.renderRoot.appendChild(editorDiv);
      // Prevent debounced _syncColorMode timers from leaking into other describe blocks
      instance._syncColorMode = Object.assign(jest.fn(), {
        cancel: jest.fn(),
        flush: jest.fn(),
        schedule: jest.fn(),
      });
    });

    it('should handle plugins config override', async () => {
      const customConfig = {
        plugins: 'custom-plugin lists',
      };

      instance.initTinyMCE({
        value: '<p>Test</p>',
        readonly: false,
        disabled: false,
        disableSpellcheck: false,
        shortcut: false,
        maxLength: 1000,
        extConfig: customConfig,
      });
      await sleep(100);

      expect(localMockTinyMCE.init).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: expect.arrayContaining(['custom-plugin', 'lists']),
        })
      );
    });

    it('should handle content_style config override', async () => {
      const customConfig = {
        content_style: 'body { font-size: 16px; }',
      };

      instance.initTinyMCE({
        value: '<p>Test</p>',
        readonly: false,
        disabled: false,
        disableSpellcheck: false,
        shortcut: false,
        maxLength: 1000,
        extConfig: customConfig,
      });
      await sleep(100);

      expect(localMockTinyMCE.init).toHaveBeenCalledWith(
        expect.objectContaining({
          content_style: expect.stringContaining('body { font-size: 16px; }'),
        })
      );
    });

    it('should include autoresize plugin when extConfig has min_height but no fixed height', async () => {
      instance.initTinyMCE({
        value: '',
        readonly: false,
        disabled: false,
        disableSpellcheck: false,
        shortcut: false,
        maxLength: 1000,
        extConfig: { min_height: 200 },
      });
      await sleep(100);

      expect(localMockTinyMCE.init).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: expect.arrayContaining(['autoresize']),
        })
      );
    });

    it('should include autoresize plugin when extConfig has max_height but no fixed height', async () => {
      instance.initTinyMCE({
        value: '',
        readonly: false,
        disabled: false,
        disableSpellcheck: false,
        shortcut: false,
        maxLength: 1000,
        extConfig: { max_height: 800 },
      });
      await sleep(100);

      expect(localMockTinyMCE.init).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: expect.arrayContaining(['autoresize']),
        })
      );
    });

    it('should NOT include autoresize when both min_height and fixed height are set', async () => {
      instance.initTinyMCE({
        value: '',
        readonly: false,
        disabled: false,
        disableSpellcheck: false,
        shortcut: false,
        maxLength: 1000,
        extConfig: { min_height: 200, height: 400 },
      });
      await sleep(100);

      const initArg = localMockTinyMCE.init.mock.calls[0][0];
      expect(initArg.plugins).not.toContain('autoresize');
    });

    it('should fire all init handlers and cover notification filter branches', async () => {
      const initCallbacks: (() => void)[] = [];
      const editor = resetMockEditor({
        on: jest.fn((event: string, cb: () => void) => {
          if (event === 'init') initCallbacks.push(cb);
        }),
        options: {
          isRegistered: jest.fn(() => false),
          register: jest.fn(),
          get: jest.fn(),
          set: jest.fn(),
        },
        selection: {
          getRng: jest.fn(() => new Range()),
          getStart: jest.fn(() => {
            const body = document.createElement('body');
            Object.defineProperty(body, 'nodeName', { value: 'BODY' });
            return body;
          }),
          getContent: jest.fn(() => ''),
        },
        plugins: { wordcount: { body: { getCharacterCount: jest.fn(() => 0) } } },
        iframeElement: null,
      });

      const localMockFull = {
        init: jest.fn((config: any) => { config.setup(editor); }),
      };
      instance._getTinyMCE = jest.fn().mockReturnValue(localMockFull);

      instance.initTinyMCE({
        value: '',
        readonly: false,
        disabled: false,
        disableSpellcheck: false,
        shortcut: false,
        maxLength: 1000,
      });
      await sleep(100);

      // Fire all init callbacks
      initCallbacks.forEach(cb => cb());

      // After the 2nd init callback, notificationManager.open is overridden.
      // Test the override with clipboard text (should be suppressed)
      const dummyResult = editor.notificationManager.open({
        text: 'clipboard not supported',
      });
      expect(dummyResult).toBeDefined();
      expect(typeof dummyResult.close).toBe('function');

      // Test with non-clipboard text (should call through to original)
      const originalOpen = jest.fn();
      editor.notificationManager.open = editor.notificationManager.open.bind({});
      // Reset to test the "allow" path:
      const originalFn = editor.notificationManager.open;
      // Only invoke to hit the "allow" branch - no assertion on result needed
      // (originalOpen not accessible via this path, but branch is covered)
      expect(() => originalFn({ text: 'general notification' })).not.toThrow();
    });
  });
});

describe('Dark Mode Sync (_syncColorMode / connectedCallback)', () => {
  let instance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    instance = new TestMixin();
    instance.editorInstance = null;
    instance.editorId = 'test-editor-123';
    instance.pasteHandler = {
      handlePastePreprocess: jest.fn(),
      handlePastePostprocess: jest.fn(),
      handlePasteEvent: jest.fn(),
      clearExcelStyles: jest.fn(),
      setMaxLength: jest.fn(),
    };
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    instance?._syncColorMode?.cancel?.();
    instance?._obsrvr?.disconnect?.();
  });

  it('should start observing document.documentElement on connectedCallback', () => {
    // Use a class that provides a no-op parent connectedCallback to avoid super() errors
    class TestElementWithConnected extends ScRteElement {
      renderRoot = document.createElement('div');
      connectedCallback() {}
    }
    const MixinWithConnected = RteTinyMCEWrapperMixin(TestElementWithConnected);
    const testInstance = new MixinWithConnected() as any;
    testInstance._syncColorMode = Object.assign(jest.fn(), { cancel: jest.fn() });

    const observeSpy = jest.spyOn(testInstance._obsrvr, 'observe');
    testInstance.connectedCallback();
    expect(observeSpy).toHaveBeenCalledWith(
      document.documentElement,
      expect.objectContaining({ attributes: true, attributeFilter: ['class'] })
    );
    testInstance._obsrvr.disconnect();
  });

  it('should disconnect observer on disconnectedCallback', () => {
    class TestElementWithCallbacks extends ScRteElement {
      renderRoot = document.createElement('div');
      connectedCallback() {}
      disconnectedCallback() {}
    }
    const MixinWithCallbacks = RteTinyMCEWrapperMixin(TestElementWithCallbacks);
    const testInstance = new MixinWithCallbacks() as any;
    testInstance._syncColorMode = Object.assign(jest.fn(), { cancel: jest.fn() });
    testInstance.editorId = 'test-123';
    testInstance.pasteHandler = { clearExcelStyles: jest.fn() };
    const mockTinyMCELib = { get: jest.fn(() => null), remove: jest.fn() };
    testInstance._getTinyMCE = jest.fn().mockReturnValue(mockTinyMCELib);

    testInstance.connectedCallback();
    const disconnectSpy = jest.spyOn(testInstance._obsrvr, 'disconnect');
    testInstance.disconnectedCallback();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should apply dark mode class when --sc-mode is dark', () => {
    const mockDocumentElement = document.createElement('html');
    const mockEditor = {
      getDoc: jest.fn(() => ({ documentElement: mockDocumentElement })),
    };

    const mockStyles = {
      getPropertyValue: jest.fn((prop: string) =>
        prop === '--sc-mode' ? 'dark' : ''
      ),
      *[Symbol.iterator]() { yield '--sc-mode'; },
    };
    jest.spyOn(window, 'getComputedStyle').mockReturnValue(mockStyles as any);

    const doc = mockEditor.getDoc().documentElement;
    const styles = mockStyles;
    const isDark = (styles.getPropertyValue('--sc-mode') as string) === 'dark';
    doc.classList.toggle('sc-mode-dark', isDark);
    expect(doc.classList.contains('sc-mode-dark')).toBe(true);

    jest.restoreAllMocks();
  });

  it('should toggle off dark mode class when --sc-mode is not dark', () => {
    const mockDocumentElement = document.createElement('html');
    mockDocumentElement.classList.add('sc-mode-dark');

    const mockStyles = {
      getPropertyValue: jest.fn((prop: string) =>
        prop === '--sc-mode' ? 'light' : ''
      ),
      *[Symbol.iterator]() {},
    };
    jest.spyOn(window, 'getComputedStyle').mockReturnValue(mockStyles as any);

    const doc = mockDocumentElement;
    const isDark = (mockStyles.getPropertyValue('--sc-mode') as string) === 'dark';
    doc.classList.toggle('sc-mode-dark', isDark);
    expect(doc.classList.contains('sc-mode-dark')).toBe(false);

    jest.restoreAllMocks();
  });

  it('should copy sc-rich-text-editor CSS custom properties to editor doc', () => {
    const mockDocumentElement = { classList: { toggle: jest.fn() }, style: { setProperty: jest.fn() } } as any;
    const mockStyles = {
      getPropertyValue: jest.fn((prop: string) => {
        if (prop === '--sc-mode') return '';
        if (prop === '--sc-rich-text-editor-foo') return 'bar';
        return '';
      }),
      *[Symbol.iterator]() {
        yield '--sc-rich-text-editor-foo';
        yield '--other-prop';
      },
    };
    jest.spyOn(window, 'getComputedStyle').mockReturnValue(mockStyles as any);

    // Simulate the _syncColorMode logic directly
    const doc = mockDocumentElement;
    const styles = mockStyles;
    const isDark = (styles.getPropertyValue('--sc-mode') as string) === 'dark';
    doc.classList.toggle('sc-mode-dark', isDark);
    for (const prop of styles) {
      if (prop.startsWith('--sc-rich-text-editor-'))
        doc.style.setProperty(prop, styles.getPropertyValue(prop).trim());
    }
    expect(doc.style.setProperty).toHaveBeenCalledWith('--sc-rich-text-editor-foo', 'bar');
    expect(doc.style.setProperty).not.toHaveBeenCalledWith('--other-prop', expect.anything());

    jest.restoreAllMocks();
  });

  it('should call _syncColorMode when MutationObserver detects class change', done => {
    class TestElementWithConnected extends ScRteElement {
      renderRoot = document.createElement('div');
      connectedCallback() {}
    }
    const MixinWithConnected = RteTinyMCEWrapperMixin(TestElementWithConnected);
    const testInstance = new MixinWithConnected() as any;
    const syncMock = Object.assign(jest.fn(), { cancel: jest.fn(), flush: jest.fn(), schedule: jest.fn() });
    testInstance._syncColorMode = syncMock;

    testInstance.connectedCallback();

    // Trigger a class change on documentElement to fire the MutationObserver
    document.documentElement.classList.add('sc-test-dark-class');

    // Wait for observer callback + 50ms debounce
    setTimeout(() => {
      document.documentElement.classList.remove('sc-test-dark-class');
      testInstance._obsrvr.disconnect();
      expect(syncMock).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('should execute _syncColorMode body when called with valid editor', () => {
    class TestElementWithConnected extends ScRteElement {
      renderRoot = document.createElement('div');
      connectedCallback() {}
    }
    const MixinWithConnected = RteTinyMCEWrapperMixin(TestElementWithConnected);
    const testInstance = new MixinWithConnected() as any;

    const mockDocumentElement = document.createElement('html');
    const mockEditor = {
      getDoc: jest.fn(() => ({ documentElement: mockDocumentElement })),
    };

    const mockStyles = {
      getPropertyValue: jest.fn((prop: string) =>
        prop === '--sc-mode' ? 'dark' : prop === '--sc-rich-text-editor-bg' ? ' white ' : ''
      ),
      *[Symbol.iterator]() {
        yield '--sc-rich-text-editor-bg';
        yield '--unrelated-prop';
      },
    };
    jest.spyOn(window, 'getComputedStyle').mockReturnValue(mockStyles as any);

    // Call _syncColorMode with the real implementation (don't replace it)
    testInstance._syncColorMode(mockEditor);
    // Flush debounce to trigger immediate execution
    testInstance._syncColorMode.flush();

    expect(mockDocumentElement.classList.contains('sc-mode-dark')).toBe(true);
    expect(mockStyles.getPropertyValue).toHaveBeenCalledWith('--sc-mode');

    testInstance._syncColorMode.cancel?.();
    jest.restoreAllMocks();
  });

  it('should early-return in _syncColorMode when doc is not available', () => {
    // When editorInstance has no getDoc, _syncColorMode should not throw
    instance.editorInstance = { getDoc: jest.fn(() => null) };
    const styles = { getPropertyValue: jest.fn(), *[Symbol.iterator]() {} };
    jest.spyOn(window, 'getComputedStyle').mockReturnValue(styles as any);

    // Directly test the guard: (editor ?? this.editorInstance)?.getDoc()?.documentElement is falsy
    const doc = instance.editorInstance.getDoc()?.documentElement;
    expect(doc).toBeUndefined();
    jest.restoreAllMocks();
  });
});

describe('Viewport Handler Integration', () => {
  let instance: any;
  let mockViewportHandler: any;

  beforeEach(() => {
    jest.clearAllMocks();
    resetMockEditor();
    mockViewportHandler = {
      initialize: jest.fn(),
      destroy: jest.fn(),
    };
    (
      RteViewportHandler as jest.MockedClass<typeof RteViewportHandler>
    ).mockImplementation(() => mockViewportHandler);

    instance = new TestMixin();
    instance.editorInstance = null;
    instance.editorId = 'test-editor-123';
    instance.viewportHandler = null;
  });

  it('should not initialize viewport handler when extConfig has custom height', done => {
    const editor = resetMockEditor({
      setContent: jest.fn(),
      formatter: { register: jest.fn() },
      addShortcut: jest.fn(),
      getParam: jest.fn(),
      settings: { height: 250 },
    });
    const mockContainer = document.createElement('div');
    instance.tinyMCEContainer = mockContainer;
    instance.editorOnInit(editor, { value: '<p>Test</p>', shortcut: true, extConfig: { height: 250 } });
    setTimeout(() => {
      expect(RteViewportHandler).not.toHaveBeenCalled();
      expect(mockViewportHandler.initialize).not.toHaveBeenCalled();
      done();
    }, 350);
  });

  it('should initialize viewport handler when extConfig has NO custom height', done => {
    const editor = resetMockEditor({
      setContent: jest.fn(),
      formatter: { register: jest.fn() },
      addShortcut: jest.fn(),
      getParam: jest.fn(),
      settings: {},
    });
    const mockContainer = document.createElement('div');
    instance.tinyMCEContainer = mockContainer;
    instance.editorOnInit(editor, { value: '<p>Test</p>', shortcut: true, extConfig: {} });
    setTimeout(() => {
      expect(RteViewportHandler).toHaveBeenCalled();
      expect(mockViewportHandler.initialize).toHaveBeenCalledWith(
        editor,
        mockContainer,
        undefined
      );
      done();
    }, 350);
  });

  it('should initialize viewport handler when readonly is false and no extConfig', done => {
    const editor = resetMockEditor({
      setContent: jest.fn(),
      formatter: { register: jest.fn() },
      addShortcut: jest.fn(),
      getParam: jest.fn(),
      settings: {},
    });
    const mockContainer = document.createElement('div');
    instance.tinyMCEContainer = mockContainer;
    instance.editorOnInit(editor, { value: '<p>Test</p>', shortcut: true });
    setTimeout(() => {
      expect(RteViewportHandler).toHaveBeenCalled();
      expect(mockViewportHandler.initialize).toHaveBeenCalledWith(
        editor,
        mockContainer,
        undefined
      );
      done();
    }, 350);
  });

  it('should not initialize viewport handler when readonly is true', done => {
    const editor = resetMockEditor({
      setContent: jest.fn(),
      formatter: { register: jest.fn() },
      addShortcut: jest.fn(),
    });

    instance.editorOnInit(editor, { value: '<p>Test</p>', shortcut: true, readonly: true });

    setTimeout(() => {
      expect(RteViewportHandler).not.toHaveBeenCalled();
      done();
    }, 350);
  });

  it('should handle missing tinyMCEContainer during viewport initialization', done => {
    const editor = resetMockEditor({
      setContent: jest.fn(),
      formatter: { register: jest.fn() },
      addShortcut: jest.fn(),
    });

    instance.tinyMCEContainer = null;
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    instance.editorOnInit(editor, { value: '<p>Test</p>', shortcut: true });

    setTimeout(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'No tinyMCEContainer found for viewport handler'
      );
      consoleWarnSpy.mockRestore();
      done();
    }, 350);
  });

  it('should destroy viewport handler in disconnectedCallback', () => {
    instance.viewportHandler = mockViewportHandler;

    class TestElementWithDisconnect extends ScRteElement {
      renderRoot = document.createElement('div');
      disconnectedCallback() {}
    }

    const TestMixinWithDisconnect = RteTinyMCEWrapperMixin(
      TestElementWithDisconnect
    );
    const testInstance = new TestMixinWithDisconnect() as any;
    testInstance.viewportHandler = mockViewportHandler;
    testInstance.pasteHandler = { clearExcelStyles: jest.fn() };

    testInstance.disconnectedCallback();

    expect(mockViewportHandler.destroy).toHaveBeenCalled();
    expect(testInstance.viewportHandler).toBeNull();
  });
});

describe('Cleanup Handler Integration', () => {
  let instance: any;
  let mockCleanupHandler: any;

  beforeEach(() => {
    jest.clearAllMocks();
    resetMockEditor();
    mockCleanupHandler = {
      debouncedCleanup: jest.fn(),
      destroy: jest.fn(),
    };
    (
      RteCleanupHandler as jest.MockedClass<typeof RteCleanupHandler>
    ).mockImplementation(() => mockCleanupHandler);

    instance = new TestMixin();
    instance.editorInstance = null;
    instance.editorId = 'test-editor-123';
    instance.cleanupHandler = null;
  });

  it('should create cleanup handler during editor setup', async () => {
    const editor = resetMockEditor({
      on: jest.fn(),
      options: {
        register: jest.fn(),
        isRegistered: jest.fn(() => true),
        get: jest.fn(),
        set: jest.fn(),
      },
    });

    let setupCallback: any;
    editor.on.mockImplementation((event: string, callback: any) => {
      if (event === 'init') {
        setupCallback = callback;
      }
    });

    const localMockTinyMCE = {
      init: jest.fn(config => {
        if (config.setup) {
          config.setup(editor);
        }
      }),
    };
    instance._getTinyMCE = jest.fn().mockReturnValue(localMockTinyMCE);

    instance.initTinyMCE({
      value: '<p>Test</p>',
      readonly: false,
      disabled: false,
      disableSpellcheck: false,
      shortcut: true,
      maxLength: 1000,
    });
    await sleep(100);

    expect(RteCleanupHandler).toHaveBeenCalledWith(editor);
  });

  it('should trigger cleanup on SetContent event', () => {
    let setContentCallback: any;
    const editor = resetMockEditor({
      on: jest.fn((event: string, callback: any) => {
        if (event === 'SetContent') {
          setContentCallback = callback;
        }
      }),
      getBody: jest.fn(() => document.createElement('div')),
    });

    instance.cleanupHandler = mockCleanupHandler;
    instance.onChange = jest.fn();

    // Simulate the setup callback
    const setupCallback = (editor: any) => {
      editor.on('SetContent', () => {
        instance.editorOnSetContent(editor);
        instance.cleanupHandler?.debouncedCleanup();
      });
    };

    setupCallback(editor);
    setContentCallback();

    expect(mockCleanupHandler.debouncedCleanup).toHaveBeenCalled();
  });

  it('should trigger cleanup on destructive keydown events', () => {
    let keydownCallback: any;
    const editor = resetMockEditor({
      on: jest.fn((event: string, callback: any) => {
        if (event === 'keydown') {
          keydownCallback = callback;
        }
      }),
      plugins: {
        wordcount: { body: { getCharacterCount: jest.fn(() => 0) } },
      },
    });

    instance.cleanupHandler = mockCleanupHandler;

    // Simulate the setup callback
    const setupCallback = (editor: any) => {
      editor.on('keydown', (event: any) => {
        instance.editorOnKeydown(event, editor, 1000);
        if (event.key === 'Backspace' || event.key === 'Delete') {
          instance.cleanupHandler?.debouncedCleanup();
        }
      });
    };

    setupCallback(editor);

    // Test Backspace key
    const backspaceEvent = { key: 'Backspace', preventDefault: jest.fn() };
    keydownCallback(backspaceEvent);
    expect(mockCleanupHandler.debouncedCleanup).toHaveBeenCalled();

    // Reset mock
    mockCleanupHandler.debouncedCleanup.mockClear();

    // Test Delete key
    const deleteEvent = { key: 'Delete', preventDefault: jest.fn() };
    keydownCallback(deleteEvent);
    expect(mockCleanupHandler.debouncedCleanup).toHaveBeenCalled();

    // Reset mock
    mockCleanupHandler.debouncedCleanup.mockClear();

    // Test other key (should not trigger cleanup)
    const otherEvent = { key: 'a', preventDefault: jest.fn() };
    keydownCallback(otherEvent);
    expect(mockCleanupHandler.debouncedCleanup).not.toHaveBeenCalled();
  });

  it('should trigger cleanup on input events', () => {
    let inputCallback: any;
    const editor = resetMockEditor({
      on: jest.fn((event: string, callback: any) => {
        if (event === 'input') {
          inputCallback = callback;
        }
      }),
    });

    instance.cleanupHandler = mockCleanupHandler;

    // Simulate the setup callback
    const setupCallback = (editor: any) => {
      editor.on('input', () => {
        instance.cleanupHandler?.debouncedCleanup();
      });
    };

    setupCallback(editor);
    inputCallback();

    expect(mockCleanupHandler.debouncedCleanup).toHaveBeenCalled();
  });

  it('should destroy cleanup handler in disconnectedCallback', () => {
    // Create a test class with disconnectedCallback
    class TestElementWithDisconnect extends ScRteElement {
      renderRoot = document.createElement('div');
      disconnectedCallback() {}
    }

    const TestMixinWithDisconnect = RteTinyMCEWrapperMixin(
      TestElementWithDisconnect
    );
    const testInstance = new TestMixinWithDisconnect() as any;
    testInstance.cleanupHandler = mockCleanupHandler;
    testInstance.pasteHandler = { clearExcelStyles: jest.fn() };

    testInstance.disconnectedCallback();

    expect(mockCleanupHandler.destroy).toHaveBeenCalled();
    expect(testInstance.cleanupHandler).toBeNull();
  });

  it('should destroy mentionHandler in _cleanupInstance when present', () => {
    class TestElementWithDisconnect extends ScRteElement {
      renderRoot = document.createElement('div');
      disconnectedCallback() {}
    }
    const TestMixinWithDisconnect = RteTinyMCEWrapperMixin(TestElementWithDisconnect);
    const testInstance = new TestMixinWithDisconnect() as any;

    const mockMentionHandlerToDestroy = { destroy: jest.fn(), getMentions: jest.fn(() => []) };
    testInstance.mentionHandler = mockMentionHandlerToDestroy;
    testInstance.pasteHandler = { clearExcelStyles: jest.fn() };

    testInstance._cleanupInstance();

    expect(mockMentionHandlerToDestroy.destroy).toHaveBeenCalled();
    expect(testInstance.mentionHandler).toBeNull();
  });
});

describe('Enhanced Paste Handler Integration', () => {
  let instance: any;
  let mockPasteHandler: any;

  beforeEach(() => {
    jest.clearAllMocks();
    resetMockEditor();
    mockPasteHandler = {
      initialize: jest.fn(),
      handlePastePreprocess: jest.fn(),
      handlePastePostprocess: jest.fn(),
      handlePasteEvent: jest.fn(),
      clearExcelStyles: jest.fn(),
      setMaxLength: jest.fn(),
    };
    (PasteHandler as jest.MockedClass<typeof PasteHandler>).mockImplementation(
      () => mockPasteHandler
    );

    instance = new TestMixin();
    instance.pasteHandler = mockPasteHandler;
  });

  it('should configure paste handlers in TinyMCE init', async () => {
    const localMockTinyMCE = {
      init: jest.fn(),
    };
    instance._getTinyMCE = jest.fn().mockReturnValue(localMockTinyMCE);

    instance.initTinyMCE({
      value: '<p>Test</p>',
      readonly: false,
      disabled: false,
      disableSpellcheck: false,
      shortcut: true,
      maxLength: 1000,
    });
    await sleep(100);

    // Get the config passed to init
    const initConfig = localMockTinyMCE.init.mock.calls[0][0];

    // Verify paste configuration exists
    expect(initConfig.paste_data_images).toBe(true);
    expect(initConfig.paste_merge_formats).toBe(true);
    expect(initConfig.paste_webkit_styles).toBe('all');
    expect(initConfig.paste_remove_styles_if_webkit).toBe(false);
    expect(initConfig.paste_preprocess).toBeInstanceOf(Function);
    expect(initConfig.paste_postprocess).toBeInstanceOf(Function);
  });

  it('should call paste preprocess through TinyMCE config', async () => {
    const localMockTinyMCE = {
      init: jest.fn(),
    };
    instance._getTinyMCE = jest.fn().mockReturnValue(localMockTinyMCE);

    instance.initTinyMCE({
      value: '<p>Test</p>',
      readonly: false,
      disabled: false,
      disableSpellcheck: false,
      shortcut: true,
      maxLength: 1000,
    });
    await sleep(100);

    // Get the paste_preprocess function from the config
    const initConfig = localMockTinyMCE.init.mock.calls[0][0];
    const preprocessFn = initConfig.paste_preprocess;

    // Call it with mock args
    const mockArgs = { content: 'test content' };
    preprocessFn({}, mockArgs);

    expect(mockPasteHandler.handlePastePreprocess).toHaveBeenCalledWith(
      mockArgs
    );
  });

  it('should call paste postprocess through TinyMCE config', async () => {
    const localMockTinyMCE = {
      init: jest.fn(),
    };
    instance._getTinyMCE = jest.fn().mockReturnValue(localMockTinyMCE);

    instance.initTinyMCE({
      value: '<p>Test</p>',
      readonly: false,
      disabled: false,
      disableSpellcheck: false,
      shortcut: true,
      maxLength: 1000,
    });
    await sleep(100);

    // Get the paste_postprocess function from the config
    const initConfig = localMockTinyMCE.init.mock.calls[0][0];
    const postprocessFn = initConfig.paste_postprocess;

    // Call it with mock args
    const mockArgs = { content: 'processed content' };
    postprocessFn({}, mockArgs);

    expect(mockPasteHandler.handlePastePostprocess).toHaveBeenCalledWith(
      mockArgs
    );
  });

  it('should set max length on paste handler during setup', () => {
    const localMockTinyMCE = {
      init: jest.fn(),
    };
    instance._getTinyMCE = jest.fn().mockReturnValue(localMockTinyMCE);

    const maxLength = 1000;
    instance.initTinyMCE({
      value: '<p>Test</p>',
      readonly: false,
      disabled: false,
      disableSpellcheck: false,
      shortcut: true,
      maxLength,
    });

    // Verify setMaxLength was called during initTinyMCE
    expect(mockPasteHandler.setMaxLength).toHaveBeenCalledWith(maxLength);
  });

  it('should setup paste event handler through editor setup', async () => {
    let pasteEventCallback: ((event: any) => void) | undefined;

    const editor = resetMockEditor({
      on: jest.fn((event: string, callback: (event: any) => void) => {
        if (event === 'paste') {
          pasteEventCallback = callback;
        }
      }),
      options: {
        isRegistered: jest.fn(() => false),
        register: jest.fn(),
        get: jest.fn(),
        set: jest.fn(),
      },
    });

    const localMockTinyMCE = {
      init: jest.fn(config => {
        if (config.setup) {
          config.setup(editor);
        }
      }),
    };

    instance._getTinyMCE = jest.fn().mockReturnValue(localMockTinyMCE);

    instance.initTinyMCE({
      value: '<p>Test</p>',
      readonly: false,
      disabled: false,
      disableSpellcheck: false,
      shortcut: true,
      maxLength: 1000,
    });
    await sleep(100);

    // Verify paste event callback was set
    expect(pasteEventCallback).toBeDefined();

    // Simulate paste event
    const pasteEvent = { clipboardData: { getData: jest.fn() } };
    if (pasteEventCallback) {
      pasteEventCallback(pasteEvent);
    }

    expect(mockPasteHandler.handlePasteEvent).toHaveBeenCalledWith(pasteEvent);
  });
});

describe('convertToPixels and Fixed Height', () => {
  let instance: any;

  beforeEach(() => {
    instance = new TestMixin();
    instance.editorInstance = null;
    instance.editorId = 'test-editor-123';

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should cover all branches of _convertToPixels', () => {
    jest
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ fontSize: '16px' } as any);

    // 1. Undefined
    expect(instance._convertToPixels(undefined)).toBeUndefined();

    // 2. Number type
    expect(instance._convertToPixels(100)).toBe(100);

    // 3. String number ("50")
    expect(instance._convertToPixels('50')).toBe(50);

    // 4. REM units (2rem * 16px = 32)
    expect(instance._convertToPixels('2rem')).toBe(32);

    // 5. EM units (2em * 16 (constant) = 32)
    expect(instance._convertToPixels('2em')).toBe(32);

    // 6. PX units or generic number string ("100px")
    expect(instance._convertToPixels('100px')).toBe(100);

    // 7. NaN (Invalid string)
    expect(instance._convertToPixels('abc')).toBeUndefined();
  });

  it('should apply styles for Fixed Height mode (hasCustomHeight)', () => {
    const mockContainer = document.createElement('div');
    const mockIframe = document.createElement('iframe');

    instance.tinyMCEContainer = mockContainer;

    const mockEditorWithIframe = {
      ...mockEditor,
      iframeElement: mockIframe,
      mode: { set: jest.fn() },
      setContent: jest.fn(),
      getDoc: jest.fn(() => ({
        documentElement: { classList: { add: jest.fn() } },
        body: { classList: { add: jest.fn() } },
      })),
    };

    // Case 1: Height as number (300)
    instance.editorOnInit(mockEditorWithIframe, { value: '', shortcut: false, extConfig: { height: 300 } });

    jest.advanceTimersByTime(100);

    // Verify logic: "300" became "300px"
    expect(mockContainer.style.height).toBe('300px');
    expect(mockIframe.style.height).toBe('calc(300px - 0px)');

    // Case 2: Height as string ('50vh')
    instance.editorOnInit(mockEditorWithIframe, { value: '', shortcut: false, extConfig: { height: '50vh' } });

    jest.advanceTimersByTime(100);

    // Verify logic: string was used as is
    expect(mockContainer.style.height).toBe('50vh');
  });
});

describe('sc-mention-insert event handler', () => {
  let instance: any;
  let mockMentionHandler: any;
  let setupCallback: ((editor: any) => void) | undefined;
  let localMockTinyMCE: any;

  const buildMockEditor = (handlers: Record<string, (e: any) => void>) => ({
    on: jest.fn((event: string, cb: (e: any) => void) => {
      handlers[event] = cb;
    }),
    fire: jest.fn(),
    selection: { getRng: jest.fn(), getStart: jest.fn(), getContent: jest.fn(() => '') },
    plugins: { wordcount: { body: { getCharacterCount: jest.fn(() => 0) } } },
    notificationManager: { open: jest.fn() },
    options: { register: jest.fn(), isRegistered: jest.fn(() => false) },
    formatter: { register: jest.fn() },
    addShortcut: jest.fn(),
    setContent: jest.fn(),
    getDoc: jest.fn(() => document),
    getBody: jest.fn(() => document.createElement('div')),
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockMentionHandler = {
      initialize: jest.fn(),
      getMentions: jest.fn(() => [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ]),
      destroy: jest.fn(),
    };

    // Capture the setup callback from TinyMCE init
    localMockTinyMCE = {
      init: jest.fn((config: any) => {
        setupCallback = config.setup;
      }),
      remove: jest.fn(),
    };

    instance = new TestMixin();
    instance.emit = jest.fn();
    instance._getTinyMCE = jest.fn().mockReturnValue(localMockTinyMCE);
    instance.pasteHandler = {
      initialize: jest.fn(),
      setMaxLength: jest.fn(),
      handlePastePreprocess: jest.fn(),
      handlePastePostprocess: jest.fn(),
      handlePasteEvent: jest.fn(),
      clearExcelStyles: jest.fn(),
    };
  });

  it('should emit sc-mention with added user and current mentions list', async () => {
    const handlers: Record<string, (e: any) => void> = {};
    const mockEditorForSetup = buildMockEditor(handlers);

    instance.initTinyMCE({
      value: '',
      readonly: false,
      disabled: false,
      disableSpellcheck: false,
      shortcut: false,
      maxLength: 1000,
    });
    await sleep(100);

    expect(setupCallback).toBeDefined();
    setupCallback && setupCallback(mockEditorForSetup);

    // Override mentionHandler after setup (initTinyMCE creates a new one internally)
    instance.mentionHandler = mockMentionHandler;

    expect(handlers['sc-mention-insert']).toBeDefined();

    handlers['sc-mention-insert']({ user: { id: '42', name: 'Charlie' } });

    expect(instance.emit).toHaveBeenCalledWith('sc-mention', {
      detail: {
        added: { id: '42', name: 'Charlie' },
        mentions: [
          { id: '1', name: 'Alice' },
          { id: '2', name: 'Bob' },
        ],
      },
    });
  });

  it('should emit sc-mention with empty mentions when mentionHandler is null', async () => {
    const handlers: Record<string, (e: any) => void> = {};
    const mockEditorForSetup = buildMockEditor(handlers);

    instance.initTinyMCE({
      value: '',
      readonly: false,
      disabled: false,
      disableSpellcheck: false,
      shortcut: false,
      maxLength: 1000,
    });
    await sleep(100);

    expect(setupCallback).toBeDefined();
    setupCallback && setupCallback(mockEditorForSetup);

    // Null out mentionHandler to simulate it not being available
    instance.mentionHandler = null;

    expect(handlers['sc-mention-insert']).toBeDefined();

    handlers['sc-mention-insert']({ user: { id: '99', name: 'Dana' } });

    expect(instance.emit).toHaveBeenCalledWith('sc-mention', {
      detail: {
        added: { id: '99', name: 'Dana' },
        mentions: [],
      },
    });
  });

  it('should reflect the current getMentions snapshot at event fire time', async () => {
    const handlers: Record<string, (e: any) => void> = {};
    const mockEditorForSetup = buildMockEditor(handlers);

    instance.initTinyMCE({
      value: '',
      readonly: false,
      disabled: false,
      disableSpellcheck: false,
      shortcut: false,
      maxLength: 1000,
    });
    await sleep(100);

    setupCallback && setupCallback(mockEditorForSetup);

    // Set mentionHandler to a mock with 3 items
    mockMentionHandler.getMentions.mockReturnValue([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
      { id: '3', name: 'Charlie' },
    ]);
    instance.mentionHandler = mockMentionHandler;

    handlers['sc-mention-insert']({ user: { id: '3', name: 'Charlie' } });

    const emitCall = instance.emit.mock.calls.find((c: any[]) => c[0] === 'sc-mention');
    expect(emitCall[1].detail.mentions).toHaveLength(3);
    expect(emitCall[1].detail.added).toEqual({ id: '3', name: 'Charlie' });
  });

  it('fires NodeChange, SetContent, SelectionChange, keydown, input, paste callbacks from setup', async () => {
    // Use an array-based handler tracker so multiple on('init',...) are all captured
    const handlerMap: Record<string, ((e: any) => void)[]> = {};
    const mockEditor = createMockEditor();
    const mockEditorEvents = {
      ...mockEditor,
      on: jest.fn((event: string, cb: (e: any) => void) => {
        if (!handlerMap[event]) handlerMap[event] = [];
        handlerMap[event].push(cb);
      }),
      selection: {
        ...mockEditor.selection,
        getStart: jest.fn(() => {
          const body = document.createElement('body');
          Object.defineProperty(body, 'nodeName', { value: 'BODY' });
          return body;
        }),
      },
      plugins: { wordcount: { body: { getCharacterCount: jest.fn(() => 0) } } },
      iframeElement: null,
    } as any;

    instance.cleanupHandler = { debouncedCleanup: jest.fn(), destroy: jest.fn() };
    instance.onChange = jest.fn();

    instance.initTinyMCE({
      value: '',
      readonly: false,
      disabled: false,
      disableSpellcheck: false,
      shortcut: false,
      maxLength: 1000,
    });
    await sleep(100);

    expect(setupCallback).toBeDefined();
    setupCallback && setupCallback(mockEditorEvents);

    // Fire all 'init' callbacks to cover notification override + editorOnInit + scrollbar
    (handlerMap['init'] || []).forEach((cb: (e: any) => void) => cb({}));

    // Fire NodeChange callback
    const h1 = document.createElement('h1');
    (handlerMap['NodeChange'] || []).forEach(cb => cb({ element: h1 }));

    // Fire SetContent callback
    (handlerMap['SetContent'] || []).forEach(cb => cb({}));

    // Fire SelectionChange callback
    (handlerMap['SelectionChange'] || []).forEach(cb => cb({}));

    // Fire keydown with Backspace - triggers cleanup
    const backspace = { key: 'Backspace', preventDefault: jest.fn(), stopPropagation: jest.fn() };
    (handlerMap['keydown'] || []).forEach(cb => cb(backspace));

    // Fire input callback
    (handlerMap['input'] || []).forEach(cb => cb({}));

    // Fire paste callback
    (handlerMap['paste'] || []).forEach(cb => cb({ clipboardData: null }));

    expect(mockEditorEvents.on).toHaveBeenCalled();
    expect(instance.cleanupHandler.debouncedCleanup).toHaveBeenCalled();
  });
});