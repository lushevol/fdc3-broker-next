import { BrandHandler } from '../../../src/components/ScRichTextEditor/mixins/rte-tinymce-brand-handler.js';
import { Editor } from 'hugerte';

const createMockEditor = () => {
  const eventListeners: { [key: string]: (e?: any) => void } = {};
  const body = document.createElement('div');

  const mockEditor = {
    on: jest.fn((event, callback) => {
      eventListeners[event] = callback;
    }),
    getBody: jest.fn(() => body),
    selection: {
      getNode: jest.fn(() => body.firstChild || body),
    },
    fire: jest.fn(),
    dom: {
      getParents: jest.fn(),
    },
    schema: {
      isBlock: jest.fn(() => true),
    },
    undoManager: {
      ignore: jest.fn((fn: () => void) => fn()),
    },
  } as unknown as Editor;

  return { mockEditor, body, eventListeners };
};

describe('BrandHandler', () => {
  let brandHandler: BrandHandler;
  let mockEditor: Editor;
  let editorBody: HTMLElement;
  let eventListeners: { [key: string]: (e?: any) => void };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    const {
      mockEditor: editor,
      body,
      eventListeners: listeners,
    } = createMockEditor();
    mockEditor = editor;
    editorBody = body;
    eventListeners = listeners;

    brandHandler = new BrandHandler();
    brandHandler.initialize(mockEditor);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization and Event Setup', () => {
    it('should initialize and set up all required event listeners', () => {
      expect(mockEditor.on).toHaveBeenCalledWith(
        'ExecCommand',
        expect.any(Function)
      );
      expect(mockEditor.on).toHaveBeenCalledWith(
        'SetContent',
        expect.any(Function)
      );
      expect(mockEditor.on).toHaveBeenCalledWith(
        'paste_postprocess',
        expect.any(Function)
      );
      expect(mockEditor.on).toHaveBeenCalledWith('PastePostProcess', expect.any(Function));
    });
  });

  describe('Toolbar Actions (ExecCommand)', () => {
    it('should apply bold font weight to h4 on FormatBlock', () => {
      editorBody.innerHTML = '<h4>Test content</h4>';
      const h4 = editorBody.querySelector('h4')!;
      (mockEditor.selection.getNode as jest.Mock).mockReturnValue(h4);

      eventListeners.ExecCommand({ command: 'FormatBlock' });
      jest.runAllTimers();

      expect(h4.style.fontSize).toBe('17.5px');
      expect(h4.style.fontWeight).toBe('700');
    });
  });

  describe('Content Setting (SetContent)', () => {
    it('should apply brand styles to all elements when content is set', () => {
      editorBody.innerHTML =
        '<h1>Title</h1><p>Paragraph.</p><table><tbody><tr><td>Cell</td></tr></tbody></table>';

      eventListeners.SetContent({ set: true });
      jest.runAllTimers();

      const h1 = editorBody.querySelector('h1')!;

      expect(h1.style.fontSize).toBe('38px');
    });
  });

  describe('Paste Cleanup (paste_postprocess & input)', () => {
    it('should run full cleanup on paste_postprocess', () => {
      editorBody.innerHTML = '<font face="Arial">Text</font><o:p></o:p><p onclick​="alert(1)">Insecure</p><li></li>';

      eventListeners.paste_postprocess();
      jest.runAllTimers();

      expect(editorBody.innerHTML).toContain('Text');
      expect(editorBody.querySelector('font')).toBeNull();
      expect(editorBody.querySelector('o\\:p')).toBeNull();
      expect(editorBody.querySelector('p')?.hasAttribute('onclick')).toBe(
        false
      );
      expect(editorBody.querySelector('li')).toBeNull();
    });

    it('should run font styling cleanup on PastePostProcess as a fallback', () => {
      editorBody.innerHTML = '<p style="font-family: \'Times New Roman\';">Old font</p>';
      const p = editorBody.querySelector('p')!;

      eventListeners.PastePostProcess({ node: editorBody });

      expect(p.style.fontFamily).toContain('');
    });
  });

  describe('Styling and Cleanup Logic', () => {
    it('should skip styling an element that already has brand styles', () => {
      editorBody.innerHTML = '<p style="font-size: 14px; font-family: \'SC Prosper Sans\';">Styled</p>';
      const p = editorBody.querySelector('p')!;
      const styleSetterSpy = jest.spyOn(p.style, 'setProperty');

      (brandHandler as any).applyBrandStylesToElement(p);

      expect(styleSetterSpy).not.toHaveBeenCalled();
    });

    it('should not replace font-family for list items with symbol fonts', () => {
      editorBody.innerHTML = '<li style="font-family: Symbol;">·</li>';
      const li = editorBody.querySelector('li')!;

      eventListeners.paste_postprocess();
      jest.runAllTimers();

      expect(li.style.fontFamily).toBe('Symbol');
    });

    it('should completely remove dangerous tags like <​script>', () => {
      editorBody.innerHTML = '<div>Keep me</div><​script>alert(\'pwned\')<​/script>';

      (brandHandler as any).removeUnwantedTags(editorBody);

      expect(editorBody.querySelector('script')).toBeNull();
      expect(editorBody.querySelector('div')).not.toBeNull();
    });

    it('should clean dangerous attributes but preserve Mso classes', () => {
      editorBody.innerHTML = '<p class="MsoNormal custom" onmouseover​="danger()">Test</p>';

      eventListeners.paste_postprocess();
      jest.runAllTimers();

      const p = editorBody.querySelector('p')!;
      expect(p.hasAttribute('onmouseover')).toBe(false);
      expect(p.classList.contains('MsoNormal')).toBe(true);
      expect(p.classList.contains('custom')).toBe(false);
    });

    it('should unwrap non-dangerous tags like <font> while preserving content', () => {
      editorBody.innerHTML = '<div><font color="red">Important Text</font></div>';

      (brandHandler as any).removeUnwantedTags(editorBody);

      expect(editorBody.querySelector('font')).toBeNull();
      expect(editorBody.querySelector('div')?.textContent).toBe(
        'Important Text'
      );
    });

    it('should remove various non-preserved and generic attributes', () => {
      editorBody.innerHTML = `<p
                                id="bad-id"
                                data-test="should-be-removed"
                                custom-attr="should-also-be-removed"
                                class="MsoNormal">
                                Test
                              </p>`;

      (brandHandler as any).cleanDangerousAttributes(editorBody);

      const p = editorBody.querySelector('p')!;
      expect(p.hasAttribute('id')).toBe(false);
      expect(p.hasAttribute('data-test')).toBe(false);
      expect(p.hasAttribute('custom-attr')).toBe(false);
      expect(p.hasAttribute('class')).toBe(true);
    });
  });

  describe('Guard Clauses and Edge Cases', () => {
    it('should do nothing if the editor instance is null', () => {
      (brandHandler as any).editor = null;

      expect(() =>
        (brandHandler as any).applyBrandStylesToSelection()
      ).not.toThrow();
      expect(() =>
        (brandHandler as any).applyBrandStylesToAllElements()
      ).not.toThrow();
      expect(() =>
        (brandHandler as any).cleanupNonBrandElements()
      ).not.toThrow();
    });

    it('should return null from findBlockElement if no block parent is found', () => {
      editorBody.innerHTML = '<span>Just text</span>';
      const span = editorBody.querySelector('span')!;

      const result = (brandHandler as any).findBlockElement(span);
      expect(result).toBeNull();
    });

    it('should handle invalid elements in applyBrandStylesToElement', () => {
      expect(() =>
        (brandHandler as any).applyBrandStylesToElement(null)
      ).not.toThrow();
    });

    it('should not process void elements in cleanFontStyling', () => {
      editorBody.innerHTML = '<p>Hello<br>World</p>';
      const p = editorBody.querySelector('p')!;
      (brandHandler as any).cleanFontStyling(p);
      expect(p.innerHTML).toBe('Hello<br>World');
    });
  });

  describe('Destroy', () => {
    it('should nullify the editor instance on destroy', () => {
      brandHandler.destroy();
      expect((brandHandler as any).editor).toBeNull();
    });
  });
});
