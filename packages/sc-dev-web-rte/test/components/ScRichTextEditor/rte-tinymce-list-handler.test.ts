import { ListHandler } from '../../../src/components/ScRichTextEditor/mixins/rte-tinymce-list-handler.js';

describe('ListHandler', () => {
  let listHandler: ListHandler;
  let mockEditor: any;

  beforeEach(() => {
    mockEditor = {
      on: jest.fn(),
      off: jest.fn(),
      options: {
        get: jest.fn(),
      },
    };
    listHandler = new ListHandler(mockEditor);
  });

  describe('initialization and basic methods', () => {
    it('should initialize with default values', () => {
      expect(listHandler).toBeTruthy();
      expect(listHandler.editor).toBe(mockEditor);
      expect(listHandler.allowListReType).toBe(false);
      expect(listHandler.debug).toBe(false);
    });

    it('should register event listeners on construction', () => {
      expect(mockEditor.on).toHaveBeenCalledWith('ListMutation', listHandler.onListMutation);
      expect(mockEditor.on).toHaveBeenCalledWith('NodeChange', listHandler.onNodeChange);
      expect(mockEditor.on).toHaveBeenCalledWith('PastePostProcess', listHandler.onPastePostProcess);
      expect(mockEditor.on).toHaveBeenCalledTimes(3);
    });

    it('should unregister event listeners on destroy', () => {
      listHandler.destroy();
      expect(mockEditor.off).toHaveBeenCalledWith('ListMutation', listHandler.onListMutation);
      expect(mockEditor.off).toHaveBeenCalledWith('NodeChange', listHandler.onNodeChange);
      expect(mockEditor.off).toHaveBeenCalledWith('PastePostProcess', listHandler.onPastePostProcess);
      expect(mockEditor.off).toHaveBeenCalledTimes(3);
    });
  });

  describe('onListMutation', () => {
    it('should set allow to true for IndentList action', () => {
      const event = { action: 'IndentList' };
      listHandler.onListMutation(event);
      expect(listHandler.allowListReType).toBe(true);
    });

    it('should set allow to true for OutdentList action', () => {
      const event = { action: 'OutdentList' };
      listHandler.onListMutation(event);
      expect(listHandler.allowListReType).toBe(true);
    });

    it('should set allow to true for ToggleOlList action', () => {
      const event = { action: 'ToggleOlList' };
      listHandler.onListMutation(event);
      expect(listHandler.allowListReType).toBe(true);
    });

    it('should set allow to true for ToggleUlList action', () => {
      const event = { action: 'ToggleUlList' };
      listHandler.onListMutation(event);
      expect(listHandler.allowListReType).toBe(true);
    });

    it('should set allow to false for other actions', () => {
      const event = { action: 'SomeOtherAction' };
      listHandler.onListMutation(event);
      expect(listHandler.allowListReType).toBe(false);
    });

    it('should log when debug mode is enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      listHandler.debug = true;

      const event = { action: 'IndentList' };
      listHandler.onListMutation(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ListHandler] ListMutation:',
        'IndentList',
        'allow:',
        true
      );

      consoleSpy.mockRestore();
    });
  });

  describe('onNodeChange for OL lists', () => {
    beforeEach(() => {
      listHandler.allowListReType = true;
    });

    it('should apply type attribute to OL with default styles', () => {
      mockEditor.options.get.mockReturnValue(undefined);

      const olElement = document.createElement('ol');
      const liElement = document.createElement('li');
      olElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, olElement],
      };

      listHandler.onNodeChange(event as any);

      expect(olElement.getAttribute('type')).toBe('1');
    });

    it('should cycle through number styles based on depth', () => {
      mockEditor.options.get.mockReturnValue(['decimal', 'lower-alpha', 'lower-roman']);

      const olOuter = document.createElement('ol');
      const liOuter = document.createElement('li');
      const olInner = document.createElement('ol');
      const liInner = document.createElement('li');

      olOuter.appendChild(liOuter);
      liOuter.appendChild(olInner);
      olInner.appendChild(liInner);

      // Test depth 0 (outer list)
      const event1 = {
        selectionChange: false,
        element: liOuter,
        parents: [liOuter, olOuter],
      };
      listHandler.onNodeChange(event1 as any);
      expect(olOuter.getAttribute('type')).toBe('1'); // decimal

      // Re-enable for next node change
      listHandler.allowListReType = true;
      
      // Test depth 1 (inner list)
      const event2 = {
        selectionChange: false,
        element: liInner,
        parents: [liInner, olInner, liOuter, olOuter],
      };
      listHandler.onNodeChange(event2 as any);
      expect(olInner.getAttribute('type')).toBe('a'); // lower-alpha
    });

    it('should handle upper-alpha style', () => {
      mockEditor.options.get.mockReturnValue(['upper-alpha']);

      const olElement = document.createElement('ol');
      const liElement = document.createElement('li');
      olElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, olElement],
      };

      listHandler.onNodeChange(event as any);
      expect(olElement.getAttribute('type')).toBe('A');
    });

    it('should handle upper-roman style', () => {
      mockEditor.options.get.mockReturnValue(['upper-roman']);

      const olElement = document.createElement('ol');
      const liElement = document.createElement('li');
      olElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, olElement],
      };

      listHandler.onNodeChange(event as any);
      expect(olElement.getAttribute('type')).toBe('I');
    });

    it('should handle lower-roman style', () => {
      mockEditor.options.get.mockReturnValue(['lower-roman']);

      const olElement = document.createElement('ol');
      const liElement = document.createElement('li');
      olElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, olElement],
      };

      listHandler.onNodeChange(event as any);
      expect(olElement.getAttribute('type')).toBe('i');
    });

    it('should convert default to decimal', () => {
      mockEditor.options.get.mockReturnValue(['default']);

      const olElement = document.createElement('ol');
      const liElement = document.createElement('li');
      olElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, olElement],
      };

      listHandler.onNodeChange(event as any);
      expect(olElement.getAttribute('type')).toBe('1');
    });

    it('should remove duplicates from number styles', () => {
      mockEditor.options.get.mockReturnValue(['decimal', 'decimal', 'lower-alpha']);

      const olElement = document.createElement('ol');
      const liElement = document.createElement('li');
      olElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, olElement],
      };

      listHandler.onNodeChange(event as any);
      expect(olElement.getAttribute('type')).toBe('1'); // Should work normally
    });

    it('should handle empty array for number styles', () => {
      mockEditor.options.get.mockReturnValue([]);

      const olElement = document.createElement('ol');
      const liElement = document.createElement('li');
      olElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, olElement],
      };

      listHandler.onNodeChange(event as any);
      expect(olElement.getAttribute('type')).toBe('1'); // Default fallback
    });

    it('should handle non-array return from options.get', () => {
      mockEditor.options.get.mockReturnValue('not-an-array');

      const olElement = document.createElement('ol');
      const liElement = document.createElement('li');
      olElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, olElement],
      };

      listHandler.onNodeChange(event as any);
      expect(olElement.getAttribute('type')).toBe('1'); // Default fallback
    });

    it('should log when debug mode is enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      listHandler.debug = true;
      mockEditor.options.get.mockReturnValue(['decimal']);

      const olElement = document.createElement('ol');
      const liElement = document.createElement('li');
      olElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, olElement],
      };

      listHandler.onNodeChange(event as any);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ListHandler] Applied OL type:',
        '1',
        'for depth:',
        0,
        'list:',
        olElement
      );

      consoleSpy.mockRestore();
    });

    it('should handle invalid style name gracefully', () => {
      mockEditor.options.get.mockReturnValue(['invalid-style']);

      const olElement = document.createElement('ol');
      const liElement = document.createElement('li');
      olElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, olElement],
      };

      listHandler.onNodeChange(event as any);

      // Type should not be set since the style doesn't map to a valid type
      expect(olElement.getAttribute('type')).toBeNull();
    });

    it('should not convert non-default styles', () => {
      mockEditor.options.get.mockReturnValue(['decimal', 'lower-alpha']);

      const olElement = document.createElement('ol');
      const liElement = document.createElement('li');
      olElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, olElement],
      };

      listHandler.onNodeChange(event as any);

      // Should use decimal (first style), which maps to '1'
      expect(olElement.getAttribute('type')).toBe('1');
    });

    it('should handle mixed default and non-default styles', () => {
      mockEditor.options.get.mockReturnValue(['default', 'lower-alpha', 'upper-roman']);

      const olElement = document.createElement('ol');
      const liElement = document.createElement('li');
      olElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, olElement],
      };

      listHandler.onNodeChange(event as any);

      // Should use decimal (converted from 'default'), which maps to '1'
      expect(olElement.getAttribute('type')).toBe('1');
    });
  });

  describe('onNodeChange for UL lists', () => {
    beforeEach(() => {
      listHandler.allowListReType = true;
    });

    it('should apply type attribute to UL with default styles', () => {
      mockEditor.options.get.mockReturnValue(undefined);

      const ulElement = document.createElement('ul');
      const liElement = document.createElement('li');
      ulElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, ulElement],
      };

      listHandler.onNodeChange(event as any);

      expect(ulElement.getAttribute('type')).toBe('disc');
    });

    it('should cycle through bullet styles based on depth', () => {
      mockEditor.options.get.mockReturnValue(['disc', 'circle', 'square']);

      const ulOuter = document.createElement('ul');
      const liOuter = document.createElement('li');
      const ulInner = document.createElement('ul');
      const liInner = document.createElement('li');

      ulOuter.appendChild(liOuter);
      liOuter.appendChild(ulInner);
      ulInner.appendChild(liInner);

      // Test depth 0 (outer list)
      const event1 = {
        selectionChange: false,
        element: liOuter,
        parents: [liOuter, ulOuter],
      };
      listHandler.onNodeChange(event1 as any);
      expect(ulOuter.getAttribute('type')).toBe('disc');

      // Re-enable for next node change
      listHandler.allowListReType = true;
      
      // Test depth 1 (inner list)
      const event2 = {
        selectionChange: false,
        element: liInner,
        parents: [liInner, ulInner, liOuter, ulOuter],
      };
      listHandler.onNodeChange(event2 as any);
      expect(ulInner.getAttribute('type')).toBe('circle');
    });

    it('should handle circle style', () => {
      mockEditor.options.get.mockReturnValue(['circle']);

      const ulElement = document.createElement('ul');
      const liElement = document.createElement('li');
      ulElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, ulElement],
      };

      listHandler.onNodeChange(event as any);
      expect(ulElement.getAttribute('type')).toBe('circle');
    });

    it('should handle square style', () => {
      mockEditor.options.get.mockReturnValue(['square']);

      const ulElement = document.createElement('ul');
      const liElement = document.createElement('li');
      ulElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, ulElement],
      };

      listHandler.onNodeChange(event as any);
      expect(ulElement.getAttribute('type')).toBe('square');
    });

    it('should convert default to disc', () => {
      mockEditor.options.get.mockReturnValue(['default']);

      const ulElement = document.createElement('ul');
      const liElement = document.createElement('li');
      ulElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, ulElement],
      };

      listHandler.onNodeChange(event as any);
      expect(ulElement.getAttribute('type')).toBe('disc');
    });

    it('should remove duplicates from bullet styles', () => {
      mockEditor.options.get.mockReturnValue(['disc', 'disc', 'circle']);

      const ulElement = document.createElement('ul');
      const liElement = document.createElement('li');
      ulElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, ulElement],
      };

      listHandler.onNodeChange(event as any);
      expect(ulElement.getAttribute('type')).toBe('disc'); // Should work normally
    });

    it('should handle empty array for bullet styles', () => {
      mockEditor.options.get.mockReturnValue([]);

      const ulElement = document.createElement('ul');
      const liElement = document.createElement('li');
      ulElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, ulElement],
      };

      listHandler.onNodeChange(event as any);
      expect(ulElement.getAttribute('type')).toBe('disc'); // Default fallback
    });

    it('should handle non-array return from options.get', () => {
      mockEditor.options.get.mockReturnValue('not-an-array');

      const ulElement = document.createElement('ul');
      const liElement = document.createElement('li');
      ulElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, ulElement],
      };

      listHandler.onNodeChange(event as any);
      expect(ulElement.getAttribute('type')).toBe('disc'); // Default fallback
    });

    it('should log when debug mode is enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      listHandler.debug = true;
      mockEditor.options.get.mockReturnValue(['disc']);

      const ulElement = document.createElement('ul');
      const liElement = document.createElement('li');
      ulElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, ulElement],
      };

      listHandler.onNodeChange(event as any);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ListHandler] Applied UL type:',
        'disc',
        'for depth:',
        0,
        'list:',
        ulElement
      );

      consoleSpy.mockRestore();
    });

    it('should wrap around styles when depth exceeds style count', () => {
      mockEditor.options.get.mockReturnValue(['disc', 'circle']);

      // Create deeply nested list (depth 2 should wrap to depth 0)
      const ul0 = document.createElement('ul');
      const li0 = document.createElement('li');
      const ul1 = document.createElement('ul');
      const li1 = document.createElement('li');
      const ul2 = document.createElement('ul');
      const li2 = document.createElement('li');

      ul0.appendChild(li0);
      li0.appendChild(ul1);
      ul1.appendChild(li1);
      li1.appendChild(ul2);
      ul2.appendChild(li2);

      const event = {
        selectionChange: false,
        element: li2,
        parents: [li2, ul2, li1, ul1, li0, ul0],
      };

      listHandler.onNodeChange(event as any);
      expect(ul2.getAttribute('type')).toBe('disc'); // Wraps around: depth 2 % 2 = 0
    });

    it('should handle invalid style name gracefully', () => {
      mockEditor.options.get.mockReturnValue(['invalid-style']);

      const ulElement = document.createElement('ul');
      const liElement = document.createElement('li');
      ulElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, ulElement],
      };

      listHandler.onNodeChange(event as any);

      // Type should be set to the style as-is even if not mapped
      expect(ulElement.getAttribute('type')).toBe('invalid-style');
    });

    it('should not convert non-default styles', () => {
      mockEditor.options.get.mockReturnValue(['disc', 'circle']);

      const ulElement = document.createElement('ul');
      const liElement = document.createElement('li');
      ulElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, ulElement],
      };

      listHandler.onNodeChange(event as any);

      // Should use disc (first style)
      expect(ulElement.getAttribute('type')).toBe('disc');
    });

    it('should handle mixed default and non-default styles', () => {
      mockEditor.options.get.mockReturnValue(['default', 'circle', 'square']);

      const ulElement = document.createElement('ul');
      const liElement = document.createElement('li');
      ulElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, ulElement],
      };

      listHandler.onNodeChange(event as any);

      // Should use disc (converted from 'default')
      expect(ulElement.getAttribute('type')).toBe('disc');
    });
  });

  describe('onNodeChange - edge cases and filtering', () => {
    it('should ignore selection change events', () => {
      listHandler.allowListReType = true;
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const liElement = document.createElement('li');
      const event = {
        selectionChange: true,
        element: liElement,
        parents: [liElement],
      };

      listHandler.onNodeChange(event as any);

      // Should not process anything
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should ignore non-LI elements', () => {
      listHandler.allowListReType = true;
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const divElement = document.createElement('div');
      const event = {
        selectionChange: false,
        element: divElement,
        parents: [divElement],
      };

      listHandler.onNodeChange(event as any);

      // Should not process anything
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should ignore when allow is false', () => {
      listHandler.allowListReType = false;
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      listHandler.debug = true;

      const ulElement = document.createElement('ul');
      const liElement = document.createElement('li');
      ulElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, ulElement],
      };

      listHandler.onNodeChange(event as any);

      expect(consoleSpy).toHaveBeenCalledWith('[ListHandler] NodeChange ignored due to allow=false');
      consoleSpy.mockRestore();
    });

    it('should handle missing parent list element', () => {
      listHandler.allowListReType = true;

      const liElement = document.createElement('li');
      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement], // No list parent
      };

      expect(() => listHandler.onNodeChange(event as any)).not.toThrow();
    });

    it('should handle parent that is not UL or OL', () => {
      listHandler.allowListReType = true;

      const divElement = document.createElement('div');
      const liElement = document.createElement('li');
      divElement.appendChild(liElement);

      const event = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, divElement], // DIV instead of UL/OL
      };

      expect(() => listHandler.onNodeChange(event as any)).not.toThrow();
    });
  });

  describe('depth calculation', () => {
    it('should return 0 for top-level list', () => {
      const ulElement = document.createElement('ul');
      const liElement = document.createElement('li');
      const parents = [liElement, ulElement];

      const depth = listHandler.depth(ulElement, parents);
      expect(depth).toBe(0);
    });

    it('should return 1 for first nested list', () => {
      const ulOuter = document.createElement('ul');
      const liOuter = document.createElement('li');
      const ulInner = document.createElement('ul');
      const liInner = document.createElement('li');

      const parents = [liInner, ulInner, liOuter, ulOuter];

      const depth = listHandler.depth(ulInner, parents);
      expect(depth).toBe(1);
    });

    it('should return 2 for double-nested list', () => {
      const ul0 = document.createElement('ul');
      const li0 = document.createElement('li');
      const ul1 = document.createElement('ul');
      const li1 = document.createElement('li');
      const ul2 = document.createElement('ul');
      const li2 = document.createElement('li');

      const parents = [li2, ul2, li1, ul1, li0, ul0];

      const depth = listHandler.depth(ul2, parents);
      expect(depth).toBe(2);
    });

    it('should count only matching tag names', () => {
      const olOuter = document.createElement('ol');
      const liOuter = document.createElement('li');
      const ulInner = document.createElement('ul'); // Different tag
      const liInner = document.createElement('li');

      const parents = [liInner, ulInner, liOuter, olOuter];

      const depth = listHandler.depth(ulInner, parents);
      expect(depth).toBe(0); // No matching UL in parents
    });

    it('should stop counting at different list type', () => {
      const ul0 = document.createElement('ul');
      const li0 = document.createElement('li');
      const ol1 = document.createElement('ol');
      const li1 = document.createElement('li');
      const ul2 = document.createElement('ul');
      const li2 = document.createElement('li');

      const parents = [li2, ul2, li1, ol1, li0, ul0];

      const depth = listHandler.depth(ul2, parents);
      expect(depth).toBe(0); // Stops at OL
    });

    it('should skip the element itself when counting', () => {
      const ulElement = document.createElement('ul');
      const liElement = document.createElement('li');
      const parents = [liElement, ulElement, ulElement, ulElement]; // Multiple references

      const depth = listHandler.depth(ulElement, parents);
      expect(depth).toBe(0); // Should skip self
    });

    it('should handle empty parents array', () => {
      const ulElement = document.createElement('ul');
      const parents: HTMLElement[] = [];

      const depth = listHandler.depth(ulElement, parents);
      expect(depth).toBe(0);
    });
  });

  describe('mixed OL and UL lists', () => {
    it('should handle OL nested in UL', () => {
      listHandler.allowListReType = true;
      mockEditor.options.get.mockReturnValue(['decimal']);

      const ulOuter = document.createElement('ul');
      const liOuter = document.createElement('li');
      const olInner = document.createElement('ol');
      const liInner = document.createElement('li');

      ulOuter.appendChild(liOuter);
      liOuter.appendChild(olInner);
      olInner.appendChild(liInner);

      const event = {
        selectionChange: false,
        element: liInner,
        parents: [liInner, olInner, liOuter, ulOuter],
      };

      listHandler.onNodeChange(event as any);
      expect(olInner.getAttribute('type')).toBe('1');
    });

    it('should handle UL nested in OL', () => {
      listHandler.allowListReType = true;
      mockEditor.options.get.mockReturnValue(['disc']);

      const olOuter = document.createElement('ol');
      const liOuter = document.createElement('li');
      const ulInner = document.createElement('ul');
      const liInner = document.createElement('li');

      olOuter.appendChild(liOuter);
      liOuter.appendChild(ulInner);
      ulInner.appendChild(liInner);

      const event = {
        selectionChange: false,
        element: liInner,
        parents: [liInner, ulInner, liOuter, olOuter],
      };

      listHandler.onNodeChange(event as any);
      expect(ulInner.getAttribute('type')).toBe('disc');
    });
  });

  describe('complex nesting scenarios', () => {
    it('should handle deeply nested lists with multiple levels', () => {
      listHandler.allowListReType = true;
      mockEditor.options.get.mockReturnValue(['decimal', 'lower-alpha', 'lower-roman']);

      const ol0 = document.createElement('ol');
      const li0 = document.createElement('li');
      const ol1 = document.createElement('ol');
      const li1 = document.createElement('li');
      const ol2 = document.createElement('ol');
      const li2 = document.createElement('li');
      const ol3 = document.createElement('ol');
      const li3 = document.createElement('li');

      ol0.appendChild(li0);
      li0.appendChild(ol1);
      ol1.appendChild(li1);
      li1.appendChild(ol2);
      ol2.appendChild(li2);
      li2.appendChild(ol3);
      ol3.appendChild(li3);

      // Test level 3 (should wrap around: 3 % 3 = 0)
      const event = {
        selectionChange: false,
        element: li3,
        parents: [li3, ol3, li2, ol2, li1, ol1, li0, ol0],
      };

      listHandler.onNodeChange(event as any);
      expect(ol3.getAttribute('type')).toBe('1'); // Wraps to decimal
    });

    it('should handle sibling lists at the same level', () => {
      listHandler.allowListReType = true;
      mockEditor.options.get.mockReturnValue(['disc', 'circle']);

      const ulOuter = document.createElement('ul');
      const li1 = document.createElement('li');
      const ul1 = document.createElement('ul');
      const li1Inner = document.createElement('li');

      ulOuter.appendChild(li1);
      li1.appendChild(ul1);
      ul1.appendChild(li1Inner);

      const event1 = {
        selectionChange: false,
        element: li1Inner,
        parents: [li1Inner, ul1, li1, ulOuter],
      };

      listHandler.onNodeChange(event1 as any);
      expect(ul1.getAttribute('type')).toBe('circle');

      // Re-enable for next node change
      listHandler.allowListReType = true;
      
      // Add sibling list
      const li2 = document.createElement('li');
      const ul2 = document.createElement('ul');
      const li2Inner = document.createElement('li');

      ulOuter.appendChild(li2);
      li2.appendChild(ul2);
      ul2.appendChild(li2Inner);

      const event2 = {
        selectionChange: false,
        element: li2Inner,
        parents: [li2Inner, ul2, li2, ulOuter],
      };

      listHandler.onNodeChange(event2 as any);
      expect(ul2.getAttribute('type')).toBe('circle'); // Same depth, same style
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete workflow: mutation then node change', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      listHandler.debug = true;
      mockEditor.options.get.mockReturnValue(['decimal']);

      // Step 1: List mutation occurs
      const mutationEvent = { action: 'IndentList' };
      listHandler.onListMutation(mutationEvent);
      expect(listHandler.allowListReType).toBe(true);

      // Step 2: Node change occurs
      const olElement = document.createElement('ol');
      const liElement = document.createElement('li');
      olElement.appendChild(liElement);

      const nodeChangeEvent = {
        selectionChange: false,
        element: liElement,
        parents: [liElement, olElement],
      };

      listHandler.onNodeChange(nodeChangeEvent as any);
      expect(olElement.getAttribute('type')).toBe('1');

      consoleSpy.mockRestore();
    });

    it('should reset allow flag between different mutations', () => {
      // First mutation - allowed action
      listHandler.onListMutation({ action: 'ToggleOlList' });
      expect(listHandler.allowListReType).toBe(true);

      // Second mutation - disallowed action
      listHandler.onListMutation({ action: 'SomeOtherAction' });
      expect(listHandler.allowListReType).toBe(false);

      // Third mutation - allowed action again
      listHandler.onListMutation({ action: 'OutdentList' });
      expect(listHandler.allowListReType).toBe(true);
    });
  });

  describe('onPastePostProcess', () => {
    let containerNode: HTMLElement;

    beforeEach(() => {
      containerNode = document.createElement('div');
    });

    it('should convert OL to UL when LI has bullet type (disc)', () => {
      const ol = document.createElement('ol');
      const li1 = document.createElement('li');
      li1.setAttribute('type', 'disc');
      li1.textContent = 'Item 1';
      const li2 = document.createElement('li');
      li2.textContent = 'Item 2';
      
      ol.appendChild(li1);
      ol.appendChild(li2);
      containerNode.appendChild(ol);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      // Should have converted to UL
      const ul = containerNode.querySelector('ul');
      expect(ul).toBeTruthy();
      expect(ul?.getAttribute('type')).toBe('disc');
      expect(containerNode.querySelector('ol')).toBeNull();
      expect(ul?.children.length).toBe(2);
      
      // Type should be removed from LI elements
      expect(ul?.children[0].getAttribute('type')).toBeNull();
      expect(ul?.children[1].getAttribute('type')).toBeNull();
    });

    it('should convert OL to UL when LI has bullet type (circle)', () => {
      const ol = document.createElement('ol');
      const li = document.createElement('li');
      li.setAttribute('type', 'circle');
      li.textContent = 'Item 1';
      
      ol.appendChild(li);
      containerNode.appendChild(ol);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      const ul = containerNode.querySelector('ul');
      expect(ul).toBeTruthy();
      expect(ul?.getAttribute('type')).toBe('circle');
      expect(containerNode.querySelector('ol')).toBeNull();
    });

    it('should convert OL to UL when LI has bullet type (square)', () => {
      const ol = document.createElement('ol');
      const li = document.createElement('li');
      li.setAttribute('type', 'square');
      li.textContent = 'Item 1';
      
      ol.appendChild(li);
      containerNode.appendChild(ol);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      const ul = containerNode.querySelector('ul');
      expect(ul).toBeTruthy();
      expect(ul?.getAttribute('type')).toBe('square');
      expect(containerNode.querySelector('ol')).toBeNull();
    });

    it('should convert UL to OL when LI has number type (1)', () => {
      const ul = document.createElement('ul');
      const li1 = document.createElement('li');
      li1.setAttribute('type', '1');
      li1.textContent = 'Item 1';
      const li2 = document.createElement('li');
      li2.textContent = 'Item 2';
      
      ul.appendChild(li1);
      ul.appendChild(li2);
      containerNode.appendChild(ul);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      // Should have converted to OL
      const ol = containerNode.querySelector('ol');
      expect(ol).toBeTruthy();
      expect(ol?.getAttribute('type')).toBe('1');
      expect(containerNode.querySelector('ul')).toBeNull();
      expect(ol?.children.length).toBe(2);
      
      // Type should be removed from LI elements
      expect(ol?.children[0].getAttribute('type')).toBeNull();
      expect(ol?.children[1].getAttribute('type')).toBeNull();
    });

    it('should convert UL to OL when LI has number type (a)', () => {
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      li.setAttribute('type', 'a');
      li.textContent = 'Item 1';
      
      ul.appendChild(li);
      containerNode.appendChild(ul);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      const ol = containerNode.querySelector('ol');
      expect(ol).toBeTruthy();
      expect(ol?.getAttribute('type')).toBe('a');
      expect(containerNode.querySelector('ul')).toBeNull();
    });

    it('should convert UL to OL when LI has number type (A)', () => {
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      li.setAttribute('type', 'A');
      li.textContent = 'Item 1';
      
      ul.appendChild(li);
      containerNode.appendChild(ul);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      const ol = containerNode.querySelector('ol');
      expect(ol).toBeTruthy();
      expect(ol?.getAttribute('type')).toBe('A');
      expect(containerNode.querySelector('ul')).toBeNull();
    });

    it('should convert UL to OL when LI has number type (i)', () => {
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      li.setAttribute('type', 'i');
      li.textContent = 'Item 1';
      
      ul.appendChild(li);
      containerNode.appendChild(ul);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      const ol = containerNode.querySelector('ol');
      expect(ol).toBeTruthy();
      expect(ol?.getAttribute('type')).toBe('i');
      expect(containerNode.querySelector('ul')).toBeNull();
    });

    it('should convert UL to OL when LI has number type (I)', () => {
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      li.setAttribute('type', 'I');
      li.textContent = 'Item 1';
      
      ul.appendChild(li);
      containerNode.appendChild(ul);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      const ol = containerNode.querySelector('ol');
      expect(ol).toBeTruthy();
      expect(ol?.getAttribute('type')).toBe('I');
      expect(containerNode.querySelector('ul')).toBeNull();
    });

    it('should set type on UL when already UL with bullet type', () => {
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      li.setAttribute('type', 'disc');
      li.textContent = 'Item 1';
      
      ul.appendChild(li);
      containerNode.appendChild(ul);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      // Should remain UL
      const resultUl = containerNode.querySelector('ul');
      expect(resultUl).toBeTruthy();
      expect(resultUl?.getAttribute('type')).toBe('disc');
      
      // Type should be removed from LI
      expect(resultUl?.children[0].getAttribute('type')).toBeNull();
    });

    it('should set type on OL when already OL with number type', () => {
      const ol = document.createElement('ol');
      const li = document.createElement('li');
      li.setAttribute('type', '1');
      li.textContent = 'Item 1';
      
      ol.appendChild(li);
      containerNode.appendChild(ol);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      // Should remain OL
      const resultOl = containerNode.querySelector('ol');
      expect(resultOl).toBeTruthy();
      expect(resultOl?.getAttribute('type')).toBe('1');
      
      // Type should be removed from LI
      expect(resultOl?.children[0].getAttribute('type')).toBeNull();
    });

    it('should not process lists that already have type attribute', () => {
      const ol = document.createElement('ol');
      ol.setAttribute('type', 'A');
      const li = document.createElement('li');
      li.setAttribute('type', '1');
      li.textContent = 'Item 1';
      
      ol.appendChild(li);
      containerNode.appendChild(ol);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      // Should not change since OL already has type
      const resultOl = containerNode.querySelector('ol');
      expect(resultOl).toBeTruthy();
      expect(resultOl?.getAttribute('type')).toBe('A'); // Should remain unchanged
      
      // LI type should also remain since list was skipped
      expect(resultOl?.children[0].getAttribute('type')).toBe('1');
    });

    it('should not process lists without LI children with type attribute', () => {
      const ul = document.createElement('ul');
      const li1 = document.createElement('li');
      li1.textContent = 'Item 1';
      const li2 = document.createElement('li');
      li2.textContent = 'Item 2';
      
      ul.appendChild(li1);
      ul.appendChild(li2);
      containerNode.appendChild(ul);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      // Should remain unchanged
      const resultUl = containerNode.querySelector('ul');
      expect(resultUl).toBeTruthy();
      expect(resultUl?.getAttribute('type')).toBeNull();
    });

    it('should handle multiple lists in pasted content', () => {
      const ol1 = document.createElement('ol');
      const li1 = document.createElement('li');
      li1.setAttribute('type', 'disc');
      li1.textContent = 'Item 1';
      li1.style.setProperty('color', 'windowText');
      li1.classList.add('MsoNormal');
      ol1.appendChild(li1);

      const ul2 = document.createElement('ul');
      const li2 = document.createElement('li');
      li2.setAttribute('type', 'a');
      li2.textContent = 'Item 2';
      li2.style.setProperty('color', 'windowText');
      li2.classList.add('MsoNormal');
      ul2.appendChild(li2);

      containerNode.appendChild(ol1);
      containerNode.appendChild(ul2);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      // First list should be converted to UL
      const ul = containerNode.querySelector('ul');
      expect(ul?.getAttribute('type')).toBe('disc');

      // Second list should be converted to OL
      const ol = containerNode.querySelector('ol');
      expect(ol?.getAttribute('type')).toBe('a');
      console.log(containerNode.innerHTML);
    });

    it('should only process LI children when removing type attributes', () => {
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      li.setAttribute('type', '1');
      li.textContent = 'Item 1';
      
      const div = document.createElement('div');
      div.setAttribute('type', 'should-not-be-removed');
      
      ul.appendChild(li);
      ul.appendChild(div);
      containerNode.appendChild(ul);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      // Should have converted to OL
      const ol = containerNode.querySelector('ol');
      expect(ol).toBeTruthy();
      
      // LI type should be removed
      expect(ol?.children[0].getAttribute('type')).toBeNull();
      
      // DIV type should remain
      expect(ol?.children[1].getAttribute('type')).toBe('should-not-be-removed');
    });

    it('should log when debug mode is enabled and converts OL to UL', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      listHandler.debug = true;

      const ol = document.createElement('ol');
      const li = document.createElement('li');
      li.setAttribute('type', 'disc');
      li.textContent = 'Item 1';
      
      ol.appendChild(li);
      containerNode.appendChild(ol);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ListHandler] Converted pasted OL to UL with type:',
        'disc'
      );

      consoleSpy.mockRestore();
    });

    it('should log when debug mode is enabled and converts UL to OL', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      listHandler.debug = true;

      const ul = document.createElement('ul');
      const li = document.createElement('li');
      li.setAttribute('type', '1');
      li.textContent = 'Item 1';
      
      ul.appendChild(li);
      containerNode.appendChild(ul);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ListHandler] Converted pasted UL to OL with type:',
        '1'
      );

      consoleSpy.mockRestore();
    });

    it('should handle nested lists correctly', () => {
      const outerOl = document.createElement('ol');
      const li1 = document.createElement('li');
      li1.setAttribute('type', 'disc');
      li1.textContent = 'Outer item';
      
      const innerOl = document.createElement('ol');
      const li2 = document.createElement('li');
      li2.setAttribute('type', 'circle');
      li2.textContent = 'Inner item';
      
      innerOl.appendChild(li2);
      li1.appendChild(innerOl);
      outerOl.appendChild(li1);
      containerNode.appendChild(outerOl);

      const event = {
        node: containerNode,
      };

      listHandler.onPastePostProcess(event as any);

      // Both outer and inner should be converted to UL
      const uls = containerNode.querySelectorAll('ul');
      expect(uls.length).toBe(2);
      expect(uls[0].getAttribute('type')).toBe('disc');
      expect(uls[1].getAttribute('type')).toBe('circle');
    });
  });
});
