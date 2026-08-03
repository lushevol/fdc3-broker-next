import {
  injectScrollbarStyles,
  removeScrollbarStyles,
  generateTinymceScrollbarStyle,
} from '../../../src/components/ScRichTextEditor/styles/tinymce-scrollbar.style.js';

describe('TinyMCE Scrollbar Styles', () => {
  let mockEditor: any;
  let mockDoc: any;
  let mockHead: any;
  let mockStyle: any;

  beforeEach(() => {
    mockStyle = { id: '', textContent: '' };
    mockHead = { appendChild: jest.fn() };
    mockDoc = {
      getElementById: jest.fn(),
      createElement: jest.fn().mockReturnValue(mockStyle),
      head: mockHead,
      getElementsByTagName: jest.fn().mockReturnValue([mockHead]),
    };
    mockEditor = {
      getDoc: jest.fn().mockReturnValue(mockDoc),
    };
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('generateTinymceScrollbarStyle', () => {
    it('should generate CSS for default options', () => {
      const css = generateTinymceScrollbarStyle();
      expect(css).toContain('hover');
    });

    it('should generate CSS for always visible', () => {
      const css = generateTinymceScrollbarStyle({ alwaysVisible: true });
      expect(css).not.toContain('hover');
    });

    it('should handle different sizes', () => {
      const css = generateTinymceScrollbarStyle({ size: 'lg' });
      expect(css).toContain('8px');
    });
  });

  describe('injectScrollbarStyles', () => {
    it('should handle missing document', () => {
      mockEditor.getDoc.mockReturnValue(null);
      injectScrollbarStyles(mockEditor);
      expect(console.error).toHaveBeenCalledWith(
        'RTE Scrollbar: No iframe doc'
      );
    });

    it('should remove existing style if present', () => {
      const mockExisting = { remove: jest.fn() };
      mockDoc.getElementById.mockReturnValue(mockExisting);

      injectScrollbarStyles(mockEditor);

      expect(mockDoc.getElementById).toHaveBeenCalledWith(
        'sc-rte-scrollbar-style'
      );
      expect(mockExisting.remove).toHaveBeenCalled();
    });

    it('should inject new style into head', () => {
      injectScrollbarStyles(mockEditor, { opaque: true });

      expect(mockDoc.createElement).toHaveBeenCalledWith('style');
      expect(mockHead.appendChild).toHaveBeenCalledWith(mockStyle);
      expect(mockStyle.textContent).toContain('#F2F2F2');
    });

    it('should handle fallback if doc.head is missing but getElementsByTagName works', () => {
      mockDoc.head = null;
      injectScrollbarStyles(mockEditor);
      expect(mockDoc.getElementsByTagName).toHaveBeenCalledWith('head');
    });

    it('should catch and log errors', () => {
      mockEditor.getDoc.mockImplementation(() => {
        throw new Error('Test error');
      });
      injectScrollbarStyles(mockEditor);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('removeScrollbarStyles', () => {
    it('should do nothing if doc is missing', () => {
      mockEditor.getDoc.mockReturnValue(null);
      removeScrollbarStyles(mockEditor);
      expect(mockDoc.getElementById).not.toHaveBeenCalled();
    });

    it('should remove style if it exists', () => {
      const mockExisting = { remove: jest.fn() };
      mockDoc.getElementById.mockReturnValue(mockExisting);

      removeScrollbarStyles(mockEditor);

      expect(mockExisting.remove).toHaveBeenCalled();
    });

    it('should do nothing if style does not exist', () => {
      mockDoc.getElementById.mockReturnValue(null);
      removeScrollbarStyles(mockEditor);
    });

    it('should catch errors silently', () => {
      mockEditor.getDoc.mockImplementation(() => {
        throw new Error('Test error');
      });
      expect(() => removeScrollbarStyles(mockEditor)).not.toThrow();
    });
  });
});
