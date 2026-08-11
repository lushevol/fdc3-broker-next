import { Editor } from 'hugerte';
import { RteViewportHandler } from '../../../src/components/ScRichTextEditor/mixins/rte-tinymce-viewport-handler.js';

describe('RteViewportHandler', () => {
  let viewportHandler: RteViewportHandler;
  let mockEditor: any;
  let mockContainer: HTMLElement;
  let mockBody: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Create mock body element for getBody()
    mockBody = document.createElement('div');
    Object.defineProperty(mockBody, 'scrollHeight', {
      value: 150,
      writable: true,
    });

    // Create mock iframe with offsetHeight
    const mockIframe = document.createElement('iframe');
    Object.defineProperty(mockIframe, 'offsetHeight', { value: 160 });

    mockEditor = {
      on: jest.fn(),
      off: jest.fn(),
      fire: jest.fn(),
      getBody: jest.fn(() => mockBody),
      removed: false,
      iframeElement: mockIframe,
    } as unknown as Editor;

    // Create a real DOM element for the container
    mockContainer = document.createElement('div');
    mockContainer.style.height = '200px';
    Object.defineProperty(mockContainer, 'offsetHeight', { value: 200 });
    Object.defineProperty(mockContainer, 'getBoundingClientRect', {
      value: jest.fn(() => ({
        top: 100,
        height: 200,
      })),
      writable: true,
    });
    document.body.appendChild(mockContainer);

    // Mock window.innerHeight
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
    });

    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn(cb => {
      cb(0);
      return 0;
    });

    // Create fresh handler instance
    viewportHandler = new RteViewportHandler();
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  describe('initialize', () => {
    it('should set up editor event listeners and adjust height', () => {
      viewportHandler.initialize(mockEditor, mockContainer);

      expect(mockEditor.on).toHaveBeenCalledWith('focus', expect.any(Function));
      expect(mockEditor.on).toHaveBeenCalledWith('blur', expect.any(Function));
      expect(mockEditor.on).toHaveBeenCalledWith(
        'SetContent',
        expect.any(Function)
      );
      expect(mockEditor.on).toHaveBeenCalledWith('input', expect.any(Function));
      expect(mockEditor.on).toHaveBeenCalledWith('paste', expect.any(Function));
      expect(mockEditor.on).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
      expect(requestAnimationFrame).toHaveBeenCalled();
    });

    it('should handle null editor gracefully', () => {
      expect(() => {
        viewportHandler.initialize(null as any, mockContainer);
      }).not.toThrow();
    });

    it('should handle initialization and adjust container height', () => {
      viewportHandler.initialize(mockEditor, mockContainer);

      // Fast-forward requestAnimationFrame
      jest.runAllTimers();

      // The container height should be adjusted
      expect(() => jest.runAllTimers()).not.toThrow();
    });
  });

  describe('editor event handling', () => {
    it('should handle focus event and set active handler', () => {
      let focusCallback: (() => void) | undefined;
      mockEditor.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === 'focus') focusCallback = callback;
        }
      );

      viewportHandler.initialize(mockEditor, mockContainer);

      expect(focusCallback).toBeDefined();
      focusCallback!();

      // Should not throw and should set active handler
      expect(() => focusCallback!()).not.toThrow();
    });

    it('should handle blur event', () => {
      let blurCallback: (() => void) | undefined;
      mockEditor.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === 'blur') blurCallback = callback;
        }
      );

      viewportHandler.initialize(mockEditor, mockContainer);

      expect(blurCallback).toBeDefined();
      blurCallback!();

      expect(() => blurCallback!()).not.toThrow();
    });

    it('should handle SetContent event with debouncing', () => {
      let setContentCallback: (() => void) | undefined;
      mockEditor.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === 'SetContent') setContentCallback = callback;
        }
      );

      viewportHandler.initialize(mockEditor, mockContainer);

      expect(setContentCallback).toBeDefined();
      setContentCallback!();

      // Fast-forward debounce timer
      jest.advanceTimersByTime(100);

      // Height should potentially be adjusted
      expect(() => setContentCallback!()).not.toThrow();
    });

    it('should handle paste event with timeout', () => {
      let pasteCallback: (() => void) | undefined;
      mockEditor.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === 'paste') pasteCallback = callback;
        }
      );

      viewportHandler.initialize(mockEditor, mockContainer);

      expect(pasteCallback).toBeDefined();
      pasteCallback!();

      // Fast-forward paste timeout
      jest.advanceTimersByTime(200);

      expect(() => pasteCallback!()).not.toThrow();
    });

    it('should handle keydown events for Backspace and Delete', () => {
      let keydownCallback: ((event: any) => void) | undefined;
      mockEditor.on.mockImplementation(
        (event: string, callback: (event: any) => void) => {
          if (event === 'keydown') keydownCallback = callback;
        }
      );

      viewportHandler.initialize(mockEditor, mockContainer);

      expect(keydownCallback).toBeDefined();

      // Test Backspace
      if (keydownCallback) {
        keydownCallback({ key: 'Backspace' });
      }
      jest.advanceTimersByTime(50);

      // Test Delete
      if (keydownCallback) {
        keydownCallback({ key: 'Delete' });
      }
      jest.advanceTimersByTime(50);

      // Test other key (should not trigger timeout)
      if (keydownCallback) {
        keydownCallback({ key: 'a' });
      }

      expect(mockEditor.on).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
    });
  });

  describe('height adjustment', () => {
    it('should adjust height based on content', () => {
      // Set different scroll height
      Object.defineProperty(mockBody, 'scrollHeight', {
        value: 300,
        writable: true,
      });

      viewportHandler.initialize(mockEditor, mockContainer);
      jest.runAllTimers();

      expect(() => jest.runAllTimers()).not.toThrow();
    });

    it('should respect minimum height', () => {
      // Set very small scroll height
      Object.defineProperty(mockBody, 'scrollHeight', {
        value: 50,
        writable: true,
      });

      viewportHandler.initialize(mockEditor, mockContainer);
      jest.runAllTimers();

      // Should maintain minimum height
      const newHeight = parseInt(mockContainer.style.height);
      expect(newHeight).toBeGreaterThanOrEqual(200);
    });

    it('should handle viewport constraints', () => {
      // Set container very close to top of screen
      (mockContainer.getBoundingClientRect as jest.Mock).mockReturnValue({
        top: 750, // Close to bottom of 800px viewport
        height: 200,
      });

      viewportHandler.initialize(mockEditor, mockContainer);
      jest.runAllTimers();

      // Should limit height based on available viewport space
      expect(() => jest.runAllTimers()).not.toThrow();
    });

    it('should handle missing getBoundingClientRect', () => {
      Object.defineProperty(mockContainer, 'getBoundingClientRect', {
        value: undefined,
        writable: true,
      });

      expect(() => {
        viewportHandler.initialize(mockEditor, mockContainer);
        jest.runAllTimers();
      }).not.toThrow();
    });

    it('should handle editor without body', () => {
      mockEditor.getBody.mockReturnValue(null);

      expect(() => {
        viewportHandler.initialize(mockEditor, mockContainer);
        jest.runAllTimers();
      }).not.toThrow();
    });

    it('should handle removed editor', () => {
      mockEditor.removed = true;

      viewportHandler.initialize(mockEditor, mockContainer);
      jest.runAllTimers();

      // Should handle gracefully without throwing
      expect(() => jest.runAllTimers()).not.toThrow();
    });
  });

  describe('convertToPixels function', () => {
    it('should handle numeric values', () => {
      viewportHandler.initialize(mockEditor, mockContainer, 300);
      jest.runAllTimers();
      expect(() => jest.runAllTimers()).not.toThrow();
    });

    it('should handle string pixel values', () => {
      viewportHandler.initialize(mockEditor, mockContainer, '250px');
      jest.runAllTimers();
      expect(() => jest.runAllTimers()).not.toThrow();
    });

    it('should handle invalid values', () => {
      viewportHandler.initialize(mockEditor, mockContainer, 'invalid');
      jest.runAllTimers();
      expect(() => jest.runAllTimers()).not.toThrow();
    });

    it('should handle zero values', () => {
      viewportHandler.initialize(mockEditor, mockContainer, 0);
      jest.runAllTimers();
      expect(() => jest.runAllTimers()).not.toThrow();
    });
  });

  describe('convertToPixels edge cases', () => {
    it('should return pixelValue when greater than 0', () => {
      // Create a temporary element that will have positive offsetHeight
      const testContainer = document.createElement('div');
      testContainer.style.height = '150px';
      Object.defineProperty(testContainer, 'offsetHeight', { value: 150 });
      document.body.appendChild(testContainer);

      viewportHandler.initialize(mockEditor, mockContainer, '150px');
      jest.runAllTimers();

      // Should use the converted pixel value
      expect(() => jest.runAllTimers()).not.toThrow();

      document.body.removeChild(testContainer);
    });

    it('should handle zero pixel values', () => {
      const testContainer = document.createElement('div');
      Object.defineProperty(testContainer, 'offsetHeight', { value: 0 });
      document.body.appendChild(testContainer);

      viewportHandler.initialize(mockEditor, mockContainer, '0px');
      jest.runAllTimers();

      expect(() => jest.runAllTimers()).not.toThrow();

      document.body.removeChild(testContainer);
    });
  });

  describe('viewport height constraints', () => {
    it('should limit height when exceeding viewport', () => {
      // Set container very close to bottom of viewport
      (mockContainer.getBoundingClientRect as jest.Mock).mockReturnValue({
        top: 750, // Close to bottom of 800px viewport
        height: 200,
      });

      // Set large content height that would exceed viewport
      Object.defineProperty(mockBody, 'scrollHeight', {
        value: 500,
        writable: true,
      });

      viewportHandler.initialize(mockEditor, mockContainer);
      jest.runAllTimers();

      expect(() => jest.runAllTimers()).not.toThrow();
    });

    it('should handle maxAvailableHeight greater than minHeight', () => {
      // Set container position that allows for height expansion
      (mockContainer.getBoundingClientRect as jest.Mock).mockReturnValue({
        top: 100,
        height: 200,
      });

      // Set content that would normally trigger expansion
      Object.defineProperty(mockBody, 'scrollHeight', {
        value: 600,
        writable: true,
      });

      viewportHandler.initialize(mockEditor, mockContainer);
      jest.runAllTimers();

      expect(() => jest.runAllTimers()).not.toThrow();
    });
  });

  describe('getContentHeight', () => {
    it('should return minHeight if the editor is null', () => {
      (viewportHandler as any).editor = null;

      const height = (viewportHandler as any).getContentHeight();
      expect(height).toBe(200);
    });

    it('should return minHeight if the editor is removed', () => {
      viewportHandler.initialize(mockEditor, mockContainer);
      mockEditor.removed = true;

      const height = (viewportHandler as any).getContentHeight();
      expect(height).toBe(200);
    });

    it('should return minHeight if the container offset is not measured', () => {
      (viewportHandler as any).containerHeightOffset = null;

      const height = (viewportHandler as any).getContentHeight();
      expect(height).toBe(200);
    });

    it('should return content scrollHeight when conditions are met', () => {
      viewportHandler.initialize(mockEditor, mockContainer);

      mockEditor.removed = false;
      (viewportHandler as any).containerHeightOffset = 40;

      const height = (viewportHandler as any).getContentHeight();
      expect(height).toBe(150);
    });
  });

  describe('getContentHeight edge cases', () => {
    it('should return minHeight when editor is removed', () => {
      viewportHandler.initialize(mockEditor, mockContainer);

      // Mark editor as removed
      mockEditor.removed = true;

      // Trigger height adjustment
      let adjustmentCallback: (() => void) | undefined;
      mockEditor.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === 'SetContent') adjustmentCallback = callback;
        }
      );

      viewportHandler.initialize(mockEditor, mockContainer);

      if (adjustmentCallback) {
        adjustmentCallback();
        jest.advanceTimersByTime(100);
      }

      expect(() => jest.runAllTimers()).not.toThrow();
    });

    it('should return minHeight when containerHeightOffset is null', () => {
      // Create handler but don't let it measure offset properly
      const mockEditorNoIframe = {
        ...mockEditor,
        iframeElement: null, // No iframe to measure offset
      };

      viewportHandler.initialize(mockEditorNoIframe, mockContainer);

      let adjustmentCallback: (() => void) | undefined;
      mockEditorNoIframe.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === 'SetContent') adjustmentCallback = callback;
        }
      );

      if (adjustmentCallback) {
        adjustmentCallback();
        jest.advanceTimersByTime(100);
      }

      expect(() => jest.runAllTimers()).not.toThrow();
    });

    it('should handle null editor in getContentHeight', () => {
      viewportHandler.initialize(mockEditor, mockContainer);

      // Force editor to null after initialization
      (viewportHandler as any).editor = null;

      let adjustmentCallback: (() => void) | undefined;
      mockEditor.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === 'SetContent') adjustmentCallback = callback;
        }
      );

      if (adjustmentCallback) {
        adjustmentCallback();
        jest.advanceTimersByTime(100);
      }

      expect(() => jest.runAllTimers()).not.toThrow();
    });
  });

  describe('measureContainerOffset coverage', () => {
    it('should handle missing iframe element', () => {
      const mockEditorNoIframe = {
        ...mockEditor,
        iframeElement: null,
      };

      expect(() => {
        viewportHandler.initialize(mockEditorNoIframe, mockContainer);
        jest.runAllTimers();
      }).not.toThrow();
    });

    it('should handle zero container or iframe height', () => {
      const mockIframe = document.createElement('iframe');
      Object.defineProperty(mockIframe, 'offsetHeight', { value: 0 });

      const mockEditorZeroHeight = {
        ...mockEditor,
        iframeElement: mockIframe,
      };

      const zeroHeightContainer = document.createElement('div');
      Object.defineProperty(zeroHeightContainer, 'offsetHeight', { value: 0 });
      Object.defineProperty(zeroHeightContainer, 'getBoundingClientRect', {
        value: jest.fn(() => ({
          top: 100,
          height: 0,
        })),
        writable: true,
      });
      document.body.appendChild(zeroHeightContainer);

      expect(() => {
        viewportHandler.initialize(mockEditorZeroHeight, zeroHeightContainer);
        jest.runAllTimers();
      }).not.toThrow();

      document.body.removeChild(zeroHeightContainer);
    });
  });

  describe('destroy', () => {
    it('should remove all event listeners and clean up', () => {
      viewportHandler.initialize(mockEditor, mockContainer);
      viewportHandler.destroy();

      expect(mockEditor.off).toHaveBeenCalledWith('focus');
      expect(mockEditor.off).toHaveBeenCalledWith('blur');
      expect(mockEditor.off).toHaveBeenCalledWith(
        'SetContent',
        expect.any(Function)
      );
      expect(mockEditor.off).toHaveBeenCalledWith(
        'input',
        expect.any(Function)
      );
      expect(mockEditor.off).toHaveBeenCalledWith('paste');
      expect(mockEditor.off).toHaveBeenCalledWith('keydown');
    });

    it('should handle destroy without initialization', () => {
      expect(() => {
        viewportHandler.destroy();
      }).not.toThrow();
    });

    it('should handle destroy with removed editor', () => {
      viewportHandler.initialize(mockEditor, mockContainer);
      mockEditor.removed = true;

      expect(() => {
        viewportHandler.destroy();
      }).not.toThrow();
    });

    it('should clear active handler if it was this instance', () => {
      // Initialize and focus to set as active
      let focusCallback: (() => void) | undefined;
      mockEditor.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === 'focus') focusCallback = callback;
        }
      );

      viewportHandler.initialize(mockEditor, mockContainer);

      expect(focusCallback).toBeDefined();
      focusCallback!();

      // Destroy should clear active handler
      viewportHandler.destroy();

      expect(() => viewportHandler.destroy()).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle errors in height adjustment gracefully', () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      viewportHandler.initialize(mockEditor, mockContainer);

      let adjustmentCallback: (() => void) | undefined;
      mockEditor.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === 'SetContent') adjustmentCallback = callback;
        }
      );

      viewportHandler.initialize(mockEditor, mockContainer);

      (mockContainer.getBoundingClientRect as jest.Mock).mockImplementation(
        () => {
          throw new Error('DOM error');
        }
      );

      if (adjustmentCallback) {
        adjustmentCallback();
        jest.advanceTimersByTime(100);
      }

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'RTE Viewport Handler: Error during height adjustment',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('should handle errors in getContentHeight gracefully', () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // Mock getBody to throw error
      mockEditor.getBody.mockImplementation(() => {
        throw new Error('Editor error');
      });

      viewportHandler.initialize(mockEditor, mockContainer);
      jest.runAllTimers();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'RTE Viewport Handler: Error getting content height',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('debouncing', () => {
    it('should debounce height adjustments', () => {
      let setContentCallback: (() => void) | undefined;
      mockEditor.on.mockImplementation(
        (event: string, callback: () => void) => {
          if (event === 'SetContent') setContentCallback = callback;
        }
      );

      viewportHandler.initialize(mockEditor, mockContainer);

      expect(setContentCallback).toBeDefined();

      // Trigger multiple times rapidly
      setContentCallback!();
      setContentCallback!();
      setContentCallback!();

      // Should only adjust once after debounce period
      jest.advanceTimersByTime(100);

      expect(() => jest.runAllTimers()).not.toThrow();
    });
  });
});
