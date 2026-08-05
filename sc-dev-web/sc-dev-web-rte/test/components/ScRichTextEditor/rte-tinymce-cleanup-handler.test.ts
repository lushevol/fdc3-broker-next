import { RteCleanupHandler } from '../../../src/components/ScRichTextEditor/mixins/rte-tinymce-cleanup-handler.js';

describe('RteCleanupHandler', () => {
  let mockEditor: any;
  let mockDoc: any;
  let mockBody: any;
  let cleanupHandler: RteCleanupHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Create mock body element
    mockBody = {
      querySelectorAll: jest.fn(),
    };

    // Create mock document
    mockDoc = {
      body: mockBody,
      querySelectorAll: jest.fn(),
    };

    // Create mock editor
    mockEditor = {
      getDoc: jest.fn(() => mockDoc),
      fire: jest.fn(),
      removed: false,
    };

    cleanupHandler = new RteCleanupHandler(mockEditor);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with editor', () => {
      expect(cleanupHandler).toBeDefined();
    });
  });

  describe('cleanupArtifacts - basic functionality', () => {
    it('should not cleanup when editor is null', () => {
      const handlerWithNullEditor = new RteCleanupHandler(null as any);

      expect(() => handlerWithNullEditor.cleanupArtifacts()).not.toThrow();
      expect(mockEditor.getDoc).not.toHaveBeenCalled();
    });

    it('should not cleanup when editor is removed', () => {
      mockEditor.removed = true;

      cleanupHandler.cleanupArtifacts();

      expect(mockEditor.getDoc).not.toHaveBeenCalled();
    });

    it('should not cleanup when document is null', () => {
      mockEditor.getDoc.mockReturnValue(null);

      cleanupHandler.cleanupArtifacts();

      expect(mockBody.querySelectorAll).not.toHaveBeenCalled();
    });

    it('should not cleanup when body is null', () => {
      mockDoc.body = null;

      cleanupHandler.cleanupArtifacts();

      expect(mockBody.querySelectorAll).not.toHaveBeenCalled();
    });

    it('should not cleanup when visible tables exist', () => {
      const mockTable = { textContent: 'some content' };
      mockBody.querySelectorAll.mockImplementation((selector: string) => {
        if (selector === 'table') {
          return [mockTable];
        }
        return [];
      });

      cleanupHandler.cleanupArtifacts();

      expect(mockDoc.querySelectorAll).not.toHaveBeenCalledWith(
        '[class*="ephox-"]'
      );
    });
  });

  describe('cleanupArtifacts - cleanup scenarios', () => {
    it('should cleanup artifacts when no visible tables exist', () => {
      const mockArtifact = { remove: jest.fn() };

      mockBody.querySelectorAll.mockImplementation((selector: string) => {
        if (selector === 'table') {
          return [];
        }
        return [];
      });

      mockDoc.querySelectorAll.mockImplementation((selector: string) => {
        if (selector === '[class*="ephox-"]') {
          return [mockArtifact];
        }
        return [];
      });

      const consoleLogSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      cleanupHandler.cleanupArtifacts();

      expect(mockArtifact.remove).toHaveBeenCalled();
      expect(mockEditor.fire).toHaveBeenCalledWith('ResizeEditor');

      consoleLogSpy.mockRestore();
    });

    it('should cleanup artifacts when tables exist but have no content', () => {
      const mockTable = { textContent: ' ' }; // whitespace only
      const mockArtifact = { remove: jest.fn() };

      mockBody.querySelectorAll.mockImplementation((selector: string) => {
        if (selector === 'table') {
          return [mockTable];
        }
        return [];
      });

      mockDoc.querySelectorAll.mockImplementation((selector: string) => {
        if (selector === '[class*="ephox-"]') {
          return [mockArtifact];
        }
        return [];
      });

      cleanupHandler.cleanupArtifacts();

      expect(mockArtifact.remove).toHaveBeenCalled();
      expect(mockEditor.fire).toHaveBeenCalledWith('ResizeEditor');
    });

    it('should cleanup artifacts when tables have null textContent', () => {
      const mockTable = { textContent: null };
      const mockArtifact = { remove: jest.fn() };

      mockBody.querySelectorAll.mockImplementation((selector: string) => {
        if (selector === 'table') {
          return [mockTable];
        }
        return [];
      });

      mockDoc.querySelectorAll.mockImplementation((selector: string) => {
        if (selector === '[class*="ephox-"]') {
          return [mockArtifact];
        }
        return [];
      });

      cleanupHandler.cleanupArtifacts();

      expect(mockArtifact.remove).toHaveBeenCalled();
    });

    it('should handle multiple tables correctly', () => {
      const mockTableEmpty = { textContent: '' };
      const mockTableWithContent = { textContent: 'data' };

      mockBody.querySelectorAll.mockImplementation((selector: string) => {
        if (selector === 'table') {
          return [mockTableEmpty, mockTableWithContent];
        }
        return [];
      });

      cleanupHandler.cleanupArtifacts();

      // Should not cleanup because at least one table has content
      expect(mockDoc.querySelectorAll).not.toHaveBeenCalledWith(
        '[class*="ephox-"]'
      );
    });

    it('should not cleanup when no artifacts are found', () => {
      mockBody.querySelectorAll.mockImplementation((selector: string) => {
        if (selector === 'table') {
          return [];
        }
        return [];
      });

      mockDoc.querySelectorAll.mockImplementation((selector: string) => {
        if (selector === '[class*="ephox-"]') {
          return [];
        }
        return [];
      });

      const consoleLogSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      cleanupHandler.cleanupArtifacts();

      expect(mockEditor.fire).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should handle multiple artifacts', () => {
      const mockArtifact1 = { remove: jest.fn() };
      const mockArtifact2 = { remove: jest.fn() };

      mockBody.querySelectorAll.mockImplementation((selector: string) => {
        if (selector === 'table') {
          return [];
        }
        return [];
      });

      mockDoc.querySelectorAll.mockImplementation((selector: string) => {
        if (selector === '[class*="ephox-"]') {
          return [mockArtifact1, mockArtifact2];
        }
        return [];
      });

      const consoleLogSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      cleanupHandler.cleanupArtifacts();

      expect(mockArtifact1.remove).toHaveBeenCalled();
      expect(mockArtifact2.remove).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });
  });

  describe('debouncedCleanup', () => {
    it('should debounce cleanup calls', () => {
      const cleanupSpy = jest
        .spyOn(cleanupHandler, 'cleanupArtifacts')
        .mockImplementation(() => {});

      cleanupHandler.debouncedCleanup();
      cleanupHandler.debouncedCleanup();
      cleanupHandler.debouncedCleanup();

      expect(cleanupSpy).not.toHaveBeenCalled();

      jest.advanceTimersByTime(150);

      expect(cleanupSpy).toHaveBeenCalledTimes(1);

      cleanupSpy.mockRestore();
    });

    it('should clear previous timer on new calls', () => {
      const cleanupSpy = jest
        .spyOn(cleanupHandler, 'cleanupArtifacts')
        .mockImplementation(() => {});

      cleanupHandler.debouncedCleanup();
      jest.advanceTimersByTime(100);

      cleanupHandler.debouncedCleanup();
      jest.advanceTimersByTime(100);

      expect(cleanupSpy).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);

      expect(cleanupSpy).toHaveBeenCalledTimes(1);

      cleanupSpy.mockRestore();
    });

    it('should handle multiple rapid calls correctly', () => {
      const cleanupSpy = jest
        .spyOn(cleanupHandler, 'cleanupArtifacts')
        .mockImplementation(() => {});

      // Call multiple times rapidly
      for (let i = 0; i < 5; i++) {
        cleanupHandler.debouncedCleanup();
        jest.advanceTimersByTime(50); // Advance less than debounce delay
      }

      expect(cleanupSpy).not.toHaveBeenCalled();

      // Now advance past the debounce delay
      jest.advanceTimersByTime(150);

      expect(cleanupSpy).toHaveBeenCalledTimes(1);

      cleanupSpy.mockRestore();
    });
  });

  describe('destroy', () => {
    it('should clear debounce timer', () => {
      cleanupHandler.debouncedCleanup();

      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      cleanupHandler.destroy();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });

    it('should handle destroy when no timer exists', () => {
      expect(() => cleanupHandler.destroy()).not.toThrow();
    });

    it('should prevent cleanup after destroy', () => {
      const cleanupSpy = jest
        .spyOn(cleanupHandler, 'cleanupArtifacts')
        .mockImplementation(() => {});

      cleanupHandler.debouncedCleanup();
      cleanupHandler.destroy();

      jest.advanceTimersByTime(150);

      expect(cleanupSpy).not.toHaveBeenCalled();

      cleanupSpy.mockRestore();
    });
  });
});
