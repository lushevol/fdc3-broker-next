import {
  EmailHandler,
  EmailOptions,
} from '../../../src/components/ScRichTextEditor/mixins/rte-tinymce-email-handler.js';

describe('EmailHandler', () => {
  let mockEditor: any;
  let handler: EmailHandler;

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});

    mockEditor = {
      on: jest.fn(),
      off: jest.fn(),
      options: {
        get: jest.fn(),
        register: jest.fn(),
      },
    };

    handler = new EmailHandler(mockEditor);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ─────────────────────────── constructor ───────────────────────────

  describe('constructor', () => {
    it('stores the editor reference', () => {
      expect(handler.editor).toBe(mockEditor);
    });

    it('registers PreProcess event listener', () => {
      expect(mockEditor.on).toHaveBeenCalledWith(
        'PreProcess',
        handler.onPreProcess
      );
    });

    it('registers objAlign option key', () => {
      expect(mockEditor.options.register).toHaveBeenCalledWith(
        EmailOptions.objAlign,
        { processor: 'string' }
      );
    });

    it('registers sc_process_object_align option key', () => {
      expect(mockEditor.options.register).toHaveBeenCalledWith(
        EmailOptions.sc_process_object_align,
        { processor: 'string' }
      );
    });
  });

  // ─────────────────────────── destroy ───────────────────────────────

  describe('destroy', () => {
    it('unregisters the PreProcess event listener', () => {
      handler.destroy();
      expect(mockEditor.off).toHaveBeenCalledWith(
        'PreProcess',
        handler.onPreProcess
      );
    });
  });

  // ─────────────────────────── isZeroValue ───────────────────────────

  describe('isZeroValue', () => {
    it('returns true for bare "0"', () => {
      expect(handler.isZeroValue('0')).toBe(true);
    });

    it('returns true for "0px"', () => {
      expect(handler.isZeroValue('0px')).toBe(true);
    });

    it('returns true for "0em"', () => {
      expect(handler.isZeroValue('0em')).toBe(true);
    });

    it('returns true for "0rem"', () => {
      expect(handler.isZeroValue('0rem')).toBe(true);
    });

    it('returns true for "0%"', () => {
      expect(handler.isZeroValue('0%')).toBe(true);
    });

    it('returns true for "0" with surrounding whitespace', () => {
      expect(handler.isZeroValue('  0px  ')).toBe(true);
    });

    it('returns false for "10px"', () => {
      expect(handler.isZeroValue('10px')).toBe(false);
    });

    it('returns false for "auto"', () => {
      expect(handler.isZeroValue('auto')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(handler.isZeroValue('')).toBe(false);
    });
  });

  // ─────────────────────────── detectAlignDir ────────────────────────

  describe('detectAlignDir', () => {
    let el: HTMLElement;

    beforeEach(() => {
      el = document.createElement('table');
    });

    it('returns the align attribute value when present', () => {
      el.setAttribute('align', 'center');
      expect(handler.detectAlignDir(el)).toBe('center');
    });

    it('returns "left" when float is left', () => {
      el.style.float = 'left';
      expect(handler.detectAlignDir(el)).toBe('left');
    });

    it('returns "right" when float is right', () => {
      el.style.float = 'right';
      expect(handler.detectAlignDir(el)).toBe('right');
    });

    it('returns "center" when margin-left and margin-right are both "auto"', () => {
      el.style.marginLeft = 'auto';
      el.style.marginRight = 'auto';
      expect(handler.detectAlignDir(el)).toBe('center');
    });

    it('returns "right" when margin-right is a zero value', () => {
      el.style.marginRight = '0px';
      expect(handler.detectAlignDir(el)).toBe('right');
    });

    it('returns "left" when margin-left is a zero value', () => {
      el.style.marginLeft = '0px';
      expect(handler.detectAlignDir(el)).toBe('left');
    });

    it('returns undefined when no alignment signals are present', () => {
      expect(handler.detectAlignDir(el)).toBeUndefined();
    });
  });

  // ─────────────────────────── applyAlignWrapper ─────────────────────

  describe('applyAlignWrapper', () => {
    let doc: Document;

    beforeEach(() => {
      doc = document;
    });

    it('does nothing when align is falsy', () => {
      const el = doc.createElement('img');
      doc.body.appendChild(el);
      // @ts-expect-error testing falsy align
      handler.applyAlignWrapper(el, '', doc);
      expect(el.parentElement).toBe(doc.body);
      doc.body.removeChild(el);
    });

    it('does nothing when element has no parentElement', () => {
      const el = doc.createElement('img');
      // el is detached – parentElement is null
      expect(() => handler.applyAlignWrapper(el, 'left', doc)).not.toThrow();
    });

    it('sets align attribute directly on element when float is set (left)', () => {
      const container = doc.createElement('div');
      const el = doc.createElement('img');
      el.style.float = 'left';
      container.appendChild(el);

      handler.applyAlignWrapper(el, 'left', doc);

      expect(el.getAttribute('align')).toBe('left');
      // element should still be a direct child (no extra wrapper)
      expect(el.parentElement).toBe(container);
    });

    it('sets align attribute directly on element when float is set (right)', () => {
      const container = doc.createElement('div');
      const el = doc.createElement('img');
      el.style.float = 'right';
      container.appendChild(el);

      handler.applyAlignWrapper(el, 'right', doc);

      expect(el.getAttribute('align')).toBe('right');
    });

    it('sets align attribute directly when existing align attribute is "left"', () => {
      const container = doc.createElement('div');
      const el = doc.createElement('img');
      el.setAttribute('align', 'left');
      container.appendChild(el);

      handler.applyAlignWrapper(el, 'left', doc);

      expect(el.getAttribute('align')).toBe('left');
      expect(el.parentElement).toBe(container);
    });

    it('sets align attribute directly when existing align attribute is "right"', () => {
      const container = doc.createElement('div');
      const el = doc.createElement('img');
      el.setAttribute('align', 'right');
      container.appendChild(el);

      handler.applyAlignWrapper(el, 'right', doc);

      expect(el.getAttribute('align')).toBe('right');
    });

    it('reuses existing single-child parent div for center alignment', () => {
      const outer = doc.createElement('section');
      const existingDiv = doc.createElement('div');
      const el = doc.createElement('img');
      existingDiv.appendChild(el);
      outer.appendChild(existingDiv);

      handler.applyAlignWrapper(el, 'center', doc);

      expect(existingDiv.getAttribute('align')).toBe('center');
      // element should also carry align="center" for center
      expect(el.getAttribute('align')).toBe('center');
      // no new child introduced in outer
      expect(outer.children.length).toBe(1);
      expect(outer.children[0]).toBe(existingDiv);
    });

    it('reuses existing single-child parent div for left alignment and removes align from el', () => {
      const outer = doc.createElement('section');
      const existingDiv = doc.createElement('div');
      const el = doc.createElement('img');
      existingDiv.appendChild(el);
      outer.appendChild(existingDiv);

      handler.applyAlignWrapper(el, 'left', doc);

      expect(existingDiv.getAttribute('align')).toBe('left');
      // for non-center, element's own align attribute is removed
      expect(el.hasAttribute('align')).toBe(false);
    });

    it('creates a new wrapper div when parent has multiple children (center)', () => {
      const outer = doc.createElement('section');
      const el = doc.createElement('img');
      const sibling = doc.createElement('span');
      outer.appendChild(el);
      outer.appendChild(sibling);

      handler.applyAlignWrapper(el, 'center', doc);

      // A new div wrapper should have been inserted
      const wrapper = el.parentElement as HTMLDivElement;
      expect(wrapper.tagName).toBe('DIV');
      expect(wrapper.getAttribute('align')).toBe('center');
      expect(el.getAttribute('align')).toBe('center');
      expect(outer.contains(wrapper)).toBe(true);
    });

    it('creates a new wrapper div when parent has multiple children (right)', () => {
      const outer = doc.createElement('section');
      const el = doc.createElement('img');
      const sibling = doc.createElement('span');
      outer.appendChild(el);
      outer.appendChild(sibling);

      handler.applyAlignWrapper(el, 'right', doc);

      const wrapper = el.parentElement as HTMLDivElement;
      expect(wrapper.tagName).toBe('DIV');
      expect(wrapper.getAttribute('align')).toBe('right');
      // align is removed from element for non-center
      expect(el.hasAttribute('align')).toBe(false);
    });

    it('removes margin-left, margin-right, and display styles from element', () => {
      const container = doc.createElement('div');
      const el = doc.createElement('img');
      el.style.marginLeft = 'auto';
      el.style.marginRight = 'auto';
      el.style.display = 'block';
      container.appendChild(el);

      handler.applyAlignWrapper(el, 'center', doc);

      // These styles should be removed after wrapping
      expect(el.style.marginLeft).toBe('');
      expect(el.style.marginRight).toBe('');
      expect(el.style.display).toBe('');
    });

    it('removes style attribute when cssText is empty after cleanup', () => {
      const container = doc.createElement('div');
      const inner = doc.createElement('div');
      const el = doc.createElement('img');
      el.style.marginLeft = 'auto';
      el.style.marginRight = 'auto';
      inner.appendChild(el);
      container.appendChild(inner);

      handler.applyAlignWrapper(el, 'center', doc);

      // After removal of the only style props, style attr should be gone
      expect(el.hasAttribute('style')).toBe(false);
    });
  });

  // ─────────────────────────── onPreProcess ──────────────────────────

  describe('onPreProcess', () => {
    function makePreProcessEvent(
      overrides: Partial<{ format: string; node: HTMLElement }>
    ) {
      return {
        format: 'html',
        node: document.createElement('div'),
        ...overrides,
      } as any;
    }

    it('returns early when format is not "html"', () => {
      mockEditor.options.get.mockReturnValue('parent');
      const spy = jest.spyOn(handler, 'detectAlignDir');

      handler.onPreProcess(makePreProcessEvent({ format: 'text' }));

      expect(spy).not.toHaveBeenCalled();
    });

    it('returns early when objAlign is not "parent"', () => {
      mockEditor.options.get.mockReturnValue('inline');
      const spy = jest.spyOn(handler, 'detectAlignDir');

      handler.onPreProcess(makePreProcessEvent({}));

      expect(spy).not.toHaveBeenCalled();
    });

    it('uses sc_process_object_align as fallback when objAlign is not set', () => {
      // objAlign returns undefined (falsy) so the || falls through to sc_process_object_align
      mockEditor.options.get.mockImplementation((key: string) => {
        if (key === EmailOptions.sc_process_object_align) return 'parent';
        return undefined;
      });
      const spy = jest.spyOn(handler, 'detectAlignDir');

      const node = document.createElement('div');
      handler.onPreProcess(makePreProcessEvent({ node }));

      // detectAlignDir should be called (since sc_process_object_align === 'parent')
      expect(mockEditor.options.get).toHaveBeenCalledWith(EmailOptions.sc_process_object_align);
    });

    it('returns early when both objAlign and sc_process_object_align are not "parent"', () => {
      mockEditor.options.get.mockImplementation((key: string) => {
        if (key === EmailOptions.objAlign) return undefined;
        if (key === EmailOptions.sc_process_object_align) return 'inline';
        return undefined;
      });
      const spy = jest.spyOn(handler, 'detectAlignDir');

      handler.onPreProcess(makePreProcessEvent({}));

      expect(spy).not.toHaveBeenCalled();
    });

    it('does not call applyAlignWrapper when detectAlignDir returns undefined', () => {
      mockEditor.options.get.mockReturnValue('parent');
      const spy = jest.spyOn(handler, 'applyAlignWrapper');

      const node = document.createElement('div');
      const img = document.createElement('img');
      // img has no alignment signals → detectAlignDir returns undefined
      node.appendChild(img);

      handler.onPreProcess(makePreProcessEvent({ node }));

      expect(spy).not.toHaveBeenCalled();
    });

    it('calls applyAlignWrapper for each matched element with a detected alignment', () => {
      mockEditor.options.get.mockReturnValue('parent');
      const spy = jest.spyOn(handler, 'applyAlignWrapper');

      const node = document.createElement('div');
      const table = document.createElement('table');
      table.setAttribute('align', 'center');
      node.appendChild(table);

      const img = document.createElement('img');
      img.style.float = 'left';
      node.appendChild(img);

      handler.onPreProcess(makePreProcessEvent({ node }));

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(table, 'center', node.ownerDocument);
      expect(spy).toHaveBeenCalledWith(img, 'left', node.ownerDocument);
    });

    it('processes audio and video elements in addition to table and img', () => {
      mockEditor.options.get.mockReturnValue('parent');
      const spy = jest.spyOn(handler, 'applyAlignWrapper');

      const node = document.createElement('div');
      const audio = document.createElement('audio');
      audio.setAttribute('align', 'right');
      const video = document.createElement('video');
      video.setAttribute('align', 'left');
      node.appendChild(audio);
      node.appendChild(video);

      handler.onPreProcess(makePreProcessEvent({ node }));

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
