import { RteMentionHandler } from '../../../src/components/ScRichTextEditor/mixins/rte-tinymce-mention-handler.js';

describe('RteMentionHandler', () => {
  let mentionHandler: RteMentionHandler;
  let mockEditor: any;
  let mockDoc: any;
  let mockBody: any;
  let mockSelection: any;
  let mockRange: any;
  let mockGraphQLClient: any;
  let eventHandlers: Record<string, (...args: any[]) => void>;

  beforeEach(() => {
    jest.clearAllMocks();
    eventHandlers = {};

    const textNode = document.createTextNode('Hello @john');
    mockRange = {
      collapsed: true,
      startContainer: textNode,
      startOffset: 11,
      setStart: jest.fn(),
      setEnd: jest.fn(),
      getClientRects: jest.fn(() => [
        { top: 100, left: 200, bottom: 120, height: 20 },
      ]),
    };

    // Global mock for document.createRange
    (document.createRange as any) = jest.fn(() => mockRange);

    // Mock Selection
    mockSelection = {
      getRng: jest.fn(() => mockRange),
      setRng: jest.fn(),
    };

    // Mock Document Body
    mockBody = {
      querySelectorAll: jest.fn(() => []),
      appendChild: jest.fn(),
    };

    // Mock Document context
    mockDoc = {
      body: mockBody,
      head: { appendChild: jest.fn() },
      getElementById: jest.fn(() => null),
      createElement: jest.fn((tag: string) => ({
        tagName: tag.toUpperCase(),
        id: '',
        style: {},
        innerHTML: '',
        textContent: '',
        appendChild: jest.fn(),
        remove: jest.fn(),
        querySelectorAll: jest.fn(() => []),
        children: [],
        getAttribute: jest.fn(),
        setAttribute: jest.fn(),
        getBoundingClientRect: jest.fn(() => ({
          top: 10,
          left: 10,
          bottom: 20,
        })),
        onmouseenter: null,
        onmousedown: null,
        onclick: null,
      })),
    };

    // Mock Editor
    mockEditor = {
      initialized: true,
      removed: false,
      selection: mockSelection,
      getDoc: jest.fn(() => mockDoc),
      getBody: jest.fn(() => mockBody),
      getContainer: jest.fn(() => ({
        querySelector: jest.fn(() => ({
          getBoundingClientRect: jest.fn(() => ({
            top: 50,
            left: 50,
            bottom: 200,
            right: 300,
          })),
        })),
      })),
      insertContent: jest.fn(),
      fire: jest.fn(),
      on: jest.fn((event: string, handler: (...args: any[]) => void) => {
        eventHandlers[event] = handler;
      }),
    };

    // Mock GraphQL client with default success response
    mockGraphQLClient = {
      query: jest.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              data: {
                _55313_128_webkit_exp_api: {
                  get_employees: [
                    {
                      id: '12345',
                      name: 'John Doe',
                      businessTitle: 'Engineer',
                    },
                  ],
                  get_employee: {
                    id: '12345',
                    name: 'John Doe',
                    businessTitle: 'Engineer',
                  },
                },
              },
            }),
        })
      ),
    };

    global.fetch = jest.fn();

    jest.spyOn(document, 'getElementById').mockReturnValue(null);
    jest.spyOn(document.body, 'appendChild').mockImplementation(jest.fn());

    mentionHandler = new RteMentionHandler();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initialization Logic', () => {
    it('should register all core event listeners', () => {
      mentionHandler.initialize(mockEditor, mockGraphQLClient);
      expect(mockEditor.on).toHaveBeenCalledWith('keyup', expect.any(Function));
      expect(mockEditor.on).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
      expect(mockEditor.on).toHaveBeenCalledWith('click', expect.any(Function));
      expect(mockEditor.on).toHaveBeenCalledWith('blur', expect.any(Function));
    });

    it('should handle uninitialized editor state', () => {
      mockEditor.initialized = false;
      mentionHandler.initialize(mockEditor, mockGraphQLClient);
      expect(mockEditor.on).toHaveBeenCalledWith('init', expect.any(Function));
      if (eventHandlers['init']) eventHandlers['init']();
      expect(mockDoc.head.appendChild).toHaveBeenCalled();
    });
  });

  describe('Input & Search Logic (keyup)', () => {
    beforeEach(() => {
      mentionHandler.initialize(mockEditor, mockGraphQLClient);
    });

    it('should trigger employee search when @ is detected', async () => {
      await eventHandlers['keyup']({ key: 'n' });
      expect(mockGraphQLClient.query).toHaveBeenCalled();
    });

    it('should ignore input if range is not collapsed', async () => {
      mockRange.collapsed = false;
      await eventHandlers['keyup']({ key: 'n' });
      expect(mockGraphQLClient.query).not.toHaveBeenCalled();
    });

    it('should close menu if @ is not preceded by whitespace', async () => {
      mockRange.startContainer.textContent = 'test@john';
      mockRange.startOffset = 9;
      await eventHandlers['keyup']({ key: 'n' });
      expect(mockGraphQLClient.query).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation (keydown)', () => {
    beforeEach(() => {
      mentionHandler.initialize(mockEditor, mockGraphQLClient);
      (mentionHandler as any).isOpen = true;
      (mentionHandler as any).items = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
      ];
      (mentionHandler as any).menu = mockDoc.createElement('div');
      (mentionHandler as any).currentMentionRange = mockRange;
    });

    it('should handle ArrowDown and prevent default', () => {
      const e = { key: 'ArrowDown', preventDefault: jest.fn() };
      eventHandlers['keydown'](e);
      expect(e.preventDefault).toHaveBeenCalled();
    });

    it('should handle Enter to select item', () => {
      const e = { key: 'Enter', preventDefault: jest.fn() };
      eventHandlers['keydown'](e);
      expect(e.preventDefault).toHaveBeenCalled();
      expect(mockEditor.insertContent).toHaveBeenCalled();
    });

    it('should handle Escape to close menu', () => {
      const e = { key: 'Escape', preventDefault: jest.fn() };
      eventHandlers['keydown'](e);
      expect((mentionHandler as any).isOpen).toBe(false);
    });
  });

  describe('Click Interaction', () => {
    beforeEach(() => {
      mentionHandler.initialize(mockEditor, mockGraphQLClient);
    });

    it('should open menu when clicking an existing mention chip', async () => {
      const mockChip = mockDoc.createElement('span');
      mockChip.getAttribute = jest.fn(attr =>
        attr === 'data-mention-id' ? '123' : 'John'
      );

      const e = {
        target: { closest: jest.fn(() => mockChip) },
        preventDefault: jest.fn(),
      };

      await eventHandlers['click'](e);
      expect(mockGraphQLClient.query).toHaveBeenCalled();
    });

    it('should fallback to name search if ID lookup fails', async () => {
      mockGraphQLClient.query
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              data: { _55313_128_webkit_exp_api: { get_employee: null } },
            }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              data: {
                _55313_128_webkit_exp_api: { get_employees: [{ id: '1' }] },
              },
            }),
        });

      const mockChip = mockDoc.createElement('span');
      mockChip.getAttribute = jest.fn(attr =>
        attr === 'data-mention-id' ? '123' : 'John'
      );

      await eventHandlers['click']({
        target: { closest: () => mockChip },
        preventDefault: jest.fn(),
      });
      expect(mockGraphQLClient.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('Missing Client Handling', () => {
    it('should warn and do nothing if initialized without client', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      mentionHandler.initialize(mockEditor, undefined);
      await eventHandlers['keyup']({ key: 'n' });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('graphQLClient is required')
      );
      expect(global.fetch).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Utility Functions', () => {
    it('getMentions should extract data from DOM', () => {
      const mockEl = {
        getAttribute: jest.fn(a => (a === 'data-mention-id' ? 'ID' : 'Name')),
      };
      mockBody.querySelectorAll.mockReturnValue([mockEl]);
      mentionHandler.initialize(mockEditor, mockGraphQLClient);

      const result = mentionHandler.getMentions();
      expect(result).toEqual([{ id: 'ID', name: 'Name' }]);
    });

    it('should correctly escape HTML to prevent XSS', () => {
      const raw = '<b>Test</b>';
      const escaped = (mentionHandler as any).escapeHtml(raw);
      expect(escaped).not.toBe(raw);
    });
  });

  describe('Lifecycle', () => {
    it('destroy should clear editor reference and menu', () => {
      mentionHandler.initialize(mockEditor, mockGraphQLClient);
      mentionHandler.destroy();
      expect((mentionHandler as any).editor).toBeNull();
    });
  });
});
