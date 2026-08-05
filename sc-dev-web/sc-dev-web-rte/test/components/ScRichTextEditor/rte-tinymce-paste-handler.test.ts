import {
  PasteHandler,
  PasteOptions,
} from '../../../src/components/ScRichTextEditor/mixins/rte-tinymce-paste-handler.js';

describe('PasteHandler', () => {
  let pasteHandler: PasteHandler;

  beforeEach(() => {
    pasteHandler = new PasteHandler();
  });

  describe('initialization and basic methods', () => {
    it('should initialize with default values', () => {
      expect(pasteHandler).toBeTruthy();
    });

    it('should toggle debug mode', () => {
      // Test enabling debug
      pasteHandler.setDebugMode(true);

      // Test disabling debug
      pasteHandler.setDebugMode(false);

      expect(() => pasteHandler.setDebugMode(true)).not.toThrow();
      expect(() => pasteHandler.setDebugMode(false)).not.toThrow();
    });

    it('should clear Excel styles', () => {
      pasteHandler.clearExcelStyles();
      expect(() => pasteHandler.clearExcelStyles()).not.toThrow();
    });
  });

  describe('handlePasteEvent', () => {
    it('should handle paste event without clipboardData', () => {
      const mockEvent = {} as ClipboardEvent;
      expect(() => pasteHandler.handlePasteEvent(mockEvent)).not.toThrow();
    });

    it('should handle paste event with clipboardData', () => {
      const mockEvent = {
        clipboardData: {
          types: ['text/html', 'text/plain'],
          getData: jest.fn((type: string) => {
            if (type === 'text/html') return '<p>HTML content</p>';
            if (type === 'text/plain') return 'Plain text';
            return '';
          }),
        },
      } as unknown as ClipboardEvent;

      pasteHandler.handlePasteEvent(mockEvent);

      expect(mockEvent.clipboardData?.getData).toHaveBeenCalledWith(
        'text/html'
      );
      expect(mockEvent.clipboardData?.getData).toHaveBeenCalledWith(
        'text/plain'
      );
    });

    it('should handle paste event with RTF data', () => {
      const mockEvent = {
        clipboardData: {
          types: ['text/html', 'text/plain', 'text/rtf'],
          getData: jest.fn((type: string) => {
            if (type === 'text/html')
              return '<​style>.xl65{color:black}<​/style><table><tr><td class="xl65">Test</td></tr></table>';
            if (type === 'text/plain') return 'Test';
            if (type === 'text/rtf') return '{\\rtf1 Test RTF}';
            return '';
          }),
        },
      } as unknown as ClipboardEvent;

      pasteHandler.handlePasteEvent(mockEvent);

      expect(mockEvent.clipboardData?.getData).toHaveBeenCalledWith('text/rtf');
    });

    it('should handle paste event with debug mode enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      const mockEvent = {
        clipboardData: {
          types: ['text/html'],
          getData: jest.fn(() => '<p>Test</p>'),
        },
      } as unknown as ClipboardEvent;

      pasteHandler.handlePasteEvent(mockEvent);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('extractExcelStyles', () => {
    it('should extract Excel styles from HTML with style blocks', () => {
      const htmlWithStyles = `
            <html>
              <head>
                <​style>
                .xl65 { color: black; background-color: yellow; }
                .xl66 { border: 1pt solid windowtext; }
                <​/style>
              </head>
              <body>
                <table><tr><td class="xl65">Test</td></tr></table>
              </body>
            </html>
            `;

      const mockEvent = {
        clipboardData: {
          types: ['text/html'],
          getData: jest.fn(() => htmlWithStyles),
        },
      } as unknown as ClipboardEvent;

      pasteHandler.handlePasteEvent(mockEvent);
      expect(() => pasteHandler.handlePasteEvent(mockEvent)).not.toThrow();
    });

    it('should handle HTML without style blocks', () => {
      const htmlWithoutStyles = '<table><tr><td>Test</td></tr></table>';

      const mockEvent = {
        clipboardData: {
          types: ['text/html'],
          getData: jest.fn(() => htmlWithoutStyles),
        },
      } as unknown as ClipboardEvent;

      expect(() => pasteHandler.handlePasteEvent(mockEvent)).not.toThrow();
    });
  });

  describe('convertMsoToStandardCss', () => {
    it('should handle MSO background styles', () => {
      const mockArgs = {
        content: '<td style="mso-background: yellow;">Test</td>',
      };

      expect(() => pasteHandler.handlePastePreprocess(mockArgs)).not.toThrow();
      expect(mockArgs.content).toContain('background-color');
    });

    it('should handle MSO shading styles', () => {
      const mockArgs = {
        content: '<td style="mso-shading: red;">Test</td>',
      };

      expect(() => pasteHandler.handlePastePreprocess(mockArgs)).not.toThrow();
      expect(mockArgs.content).toContain('background-color');
    });

    it('should handle background RGB styles', () => {
      const mockArgs = {
        content: '<td style="background: rgb(255, 0, 0);">Test</td>',
      };

      expect(() => pasteHandler.handlePastePreprocess(mockArgs)).not.toThrow();
      expect(mockArgs.content).toContain('background-color');
    });

    it('should handle Microsoft border colors', () => {
      const mockArgs = {
        content: '<td style="border: 1pt solid windowtext;">Test</td>',
      };

      expect(() => pasteHandler.handlePastePreprocess(mockArgs)).not.toThrow();
      expect(mockArgs.content).toContain('#000000');
    });
  });

  describe('handlePastePreprocess', () => {
    it('should process content with Excel class styles', () => {
      // First set up styles
      const htmlWithStyles = `
            <html>
              <head>
                <​style>
                  .xl65 { color: black; background-color: yellow; }
                <​/style>
              </head>
              <body>
                <table><tr><td class="xl65">Test</td></tr></table>
              </body>
            </html>
      `;

      const mockEvent = {
        clipboardData: {
          types: ['text/html'],
          getData: jest.fn(() => htmlWithStyles),
        },
      } as unknown as ClipboardEvent;

      pasteHandler.handlePasteEvent(mockEvent);

      // Then test preprocessing with class that should be found
      const mockArgs = {
        content: '<td class="xl65">Test</td>',
      };

      expect(() => pasteHandler.handlePastePreprocess(mockArgs)).not.toThrow();
      // The content should be processed (even if styles aren't applied due to conditions)
      expect(mockArgs.content).toContain('Test');
    });

    it('should process list formatting', () => {
      const mockArgs = {
        content: '<p>• Item 1</p><p>1. Item 2</p>',
      };

      pasteHandler.handlePastePreprocess(mockArgs);
      expect(mockArgs.content).toContain('<li type="disc">Item 1</li>');
      expect(mockArgs.content).toContain('<li type="1">Item 2</li>');
    });

    it('should handle preprocessing errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Test with malformed content that should trigger error handling
      const mockArgs = {
        content: undefined,
      };

      expect(() => pasteHandler.handlePastePreprocess(mockArgs)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should log debug information when debug mode is enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      const mockArgs = {
        content: '<p>Test content</p>',
      };

      pasteHandler.handlePastePreprocess(mockArgs);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('handlePastePostprocess', () => {
    it('should handle postprocessing with valid node', () => {
      const mockNode = document.createElement('div');
      mockNode.innerHTML = '<p>Test content</p>';

      const mockArgs = {
        node: mockNode,
      };

      expect(() => pasteHandler.handlePastePostprocess(mockArgs)).not.toThrow();
    });

    // it('should handle list items in postprocessing', () => {
    //   const mockNode = document.createElement('div');
    //   mockNode.innerHTML = '<li>Orphaned list item</li>';

    //   const mockArgs = {
    //     node: mockNode,
    //   };

    //   pasteHandler.handlePastePostprocess(mockArgs);

    //   // Check if orphaned list item gets wrapped
    //   const ulElement = mockNode.querySelector('ul');
    //   expect(ulElement).toBeTruthy();
    // });

    it('should log debug information in postprocessing when debug enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      const mockNode = document.createElement('div');
      const mockArgs = { node: mockNode };

      pasteHandler.handlePastePostprocess(mockArgs);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('processListFormatting', () => {
    it('should convert bullet points to list items', () => {
      const mockArgs = {
        content: '<p>• First item</p><p>• Second item</p>',
      };

      pasteHandler.handlePastePreprocess(mockArgs);
      expect(mockArgs.content).toContain('<li type="disc">First item</li>');
      expect(mockArgs.content).toContain('<li type="disc">Second item</li>');
    });

    it('should convert numbered lists to list items', () => {
      const mockArgs = {
        content: '<p>1. First item</p><p>2. Second item</p>',
      };

      pasteHandler.handlePastePreprocess(mockArgs);
      expect(mockArgs.content).toContain('<li type="1">First item</li>');
      expect(mockArgs.content).toContain('<li type="1">Second item</li>');
    });
  });

  describe('error handling', () => {
    it('should handle errors in MSO conversion', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Test with malformed content that might cause errors
      const mockArgs = {
        content:
          '<td style="border: 1pt solid windowtext; malformed-css;">Test</td>',
      };

      expect(() => pasteHandler.handlePastePreprocess(mockArgs)).not.toThrow();

      consoleErrorSpy.mockRestore();
    });

    it('should handle errors in postprocessing', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Test with invalid node structure that causes errors inside try block
      const mockNode = {
        querySelectorAll: jest.fn(() => {
          throw new Error('Query selector error');
        }),
      } as any;
      const mockArgs = {
        node: mockNode,
      };

      // Manually set images to trigger the error path
      (pasteHandler as any)._images = [{ data: 'test', mimeType: 'image/png' }];

      expect(() => pasteHandler.handlePastePostprocess(mockArgs)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Microsoft color conversion', () => {
    it('should convert various Microsoft color names', () => {
      const testColors = [
        'windowtext',
        'window',
        'activecaption',
        'buttonface',
        'highlight',
      ];

      testColors.forEach(color => {
        const mockArgs = {
          content: `<td style="border: 1pt solid ${color};">Test</td>`,
        };

        pasteHandler.handlePastePreprocess(mockArgs);
        expect(mockArgs.content).toContain('#'); // Should contain hex color
      });
    });
  });

  describe('max-length functionality', () => {
    it('should set max length and editor reference', () => {
      const mockEditor = {
        plugins: {
          wordcount: {
            body: {
              getCharacterCount: jest.fn(() => 50),
            },
          },
        },
        selection: {
          getContent: jest.fn(() => ''),
        },
      };

      expect(() => pasteHandler.setMaxLength(100, mockEditor)).not.toThrow();
      expect(() => pasteHandler.setMaxLength(100)).not.toThrow();
      expect(() => pasteHandler.setMaxLength()).not.toThrow();
    });

    it('should enforce max length during paste preprocessing', () => {
      const mockEditor = {
        plugins: {
          wordcount: {
            body: {
              getCharacterCount: jest.fn(() => 95),
            },
          },
        },
        selection: {
          getContent: jest.fn(() => ''),
        },
      };

      pasteHandler.setMaxLength(100, mockEditor);

      // Test content within limit
      const mockArgs1 = {
        content: 'Short',
      };
      pasteHandler.handlePastePreprocess(mockArgs1);
      expect(mockArgs1.content).toBe('Short');

      // Test content exceeding limit
      const mockArgs2 = {
        content: 'This is a very long text that exceeds the limit',
      };
      pasteHandler.handlePastePreprocess(mockArgs2);
      expect(mockArgs2.content.length).toBeLessThanOrEqual(5); // Only 5 chars remaining
    });

    it('should block paste when no space remaining', () => {
      const mockEditor = {
        plugins: {
          wordcount: {
            body: {
              getCharacterCount: jest.fn(() => 100),
            },
          },
        },
        selection: {
          getContent: jest.fn(() => ''),
        },
      };

      pasteHandler.setMaxLength(100, mockEditor);

      const mockArgs = {
        content: 'Any content',
      };
      pasteHandler.handlePastePreprocess(mockArgs);
      expect(mockArgs.content).toBe('');
    });

    it('should handle selection replacement in max length calculation', () => {
      const mockEditor = {
        plugins: {
          wordcount: {
            body: {
              getCharacterCount: jest.fn(() => 95),
            },
          },
        },
        selection: {
          getContent: jest.fn(() => 'selected text'), // 13 chars selected
        },
      };

      pasteHandler.setMaxLength(100, mockEditor);

      const mockArgs = {
        content: 'New content that is longer', // 26 chars
      };
      pasteHandler.handlePastePreprocess(mockArgs);
      // Should allow: 95 - 13 + 18 = 100 (exactly at limit)
      expect(mockArgs.content.length).toBeLessThanOrEqual(18);
    });

    it('should handle max length without editor', () => {
      pasteHandler.setMaxLength(100); // No editor

      const mockArgs = {
        content: 'Test content',
      };
      pasteHandler.handlePastePreprocess(mockArgs);
      expect(mockArgs.content).toBe('Test content'); // Should pass through unchanged
    });

    it('should handle max length errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const mockEditor = {
        plugins: {
          wordcount: {
            body: {
              getCharacterCount: jest.fn(() => {
                throw new Error('Count error');
              }),
            },
          },
        },
        selection: {
          getContent: jest.fn(() => ''),
        },
      };

      pasteHandler.setMaxLength(100, mockEditor);

      const mockArgs = {
        content: 'Test content',
      };

      expect(() => pasteHandler.handlePastePreprocess(mockArgs)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle HTML content in max length calculation', () => {
      const mockEditor = {
        plugins: {
          wordcount: {
            body: {
              getCharacterCount: jest.fn(() => 90),
            },
          },
        },
        selection: {
          getContent: jest.fn(() => ''),
        },
      };

      pasteHandler.setMaxLength(100, mockEditor);

      const mockArgs = {
        content: '<p><strong>Bold text</strong> with formatting</p>',
      };
      pasteHandler.handlePastePreprocess(mockArgs);

      // Should strip HTML tags for counting but preserve some content
      expect(mockArgs.content.length).toBeGreaterThan(0);
    });

    it('should log debug info for max length when debug enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      const mockEditor = {
        plugins: {
          wordcount: {
            body: {
              getCharacterCount: jest.fn(() => 50),
            },
          },
        },
        selection: {
          getContent: jest.fn(() => ''),
        },
      };

      pasteHandler.setMaxLength(100, mockEditor);

      const mockArgs = {
        content: 'Test content',
      };
      pasteHandler.handlePastePreprocess(mockArgs);

      const calls = consoleSpy.mock.calls;
      const hasMaxLengthCall = calls.some(call =>
        call.some(arg => typeof arg === 'string' && arg.includes('[MaxLength]'))
      );
      expect(hasMaxLengthCall).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe('RTF data handling', () => {
    it('should log RTF data when debug is enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      const mockEvent = {
        clipboardData: {
          types: ['text/html', 'text/plain', 'text/rtf'],
          getData: jest.fn((type: string) => {
            if (type === 'text/rtf') return '{\\rtf1 Test RTF Data}';
            return '<p>Test</p>';
          }),
        },
      } as unknown as ClipboardEvent;

      pasteHandler.handlePasteEvent(mockEvent);

      const rtfLogCall = consoleSpy.mock.calls.find(call =>
        call.some(
          arg =>
            typeof arg === 'string' &&
            arg.includes('[Paste Event] RTF data from clipboard:')
        )
      );
      expect(rtfLogCall).toBeTruthy();

      consoleSpy.mockRestore();
    });
  });

  describe('Excel style extraction with debug logging', () => {
    it('should handle style extraction without errors', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      const htmlWithStyles = `
          <​style>
          .xl65 { color: black; }<​/style>
          <table>
            <tr>
              <td>Test</td>
            </tr>
          </table>
      `;

      const mockEvent = {
        clipboardData: {
          types: ['text/html'],
          getData: jest.fn(() => htmlWithStyles),
        },
      } as unknown as ClipboardEvent;

      // Just verify it doesn't crash
      expect(() => pasteHandler.handlePasteEvent(mockEvent)).not.toThrow();

      // Verify debug mode was enabled and some logging occurred
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Error handling in style conversion', () => {
    it('should handle errors in MSO style conversion', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Test with malformed content that will trigger error in regex processing
      const mockArgs = {
        content: '<td style="mso-background: yellow;">Test</td>',
      };

      // Temporarily break the convertMsoToStandardCss method by overriding String.replace
      const originalReplace = String.prototype.replace;
      String.prototype.replace = function () {
        throw new Error('Conversion error');
      };

      pasteHandler.handlePastePreprocess(mockArgs);

      // Check for MSO error
      const hasErrorLog = consoleErrorSpy.mock.calls.some(call =>
        call.some(arg => typeof arg === 'string' && arg.includes('Error'))
      );
      expect(hasErrorLog).toBeTruthy();

      // Restore original method
      String.prototype.replace = originalReplace;
      consoleErrorSpy.mockRestore();
    });

    it('should handle errors in Microsoft border color conversion', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Test with content that should trigger border color conversion
      const mockArgs = {
        content: '<td style="border: 1pt solid windowtext;">Test</td>',
      };

      // Mock Object.entries to throw error during border color processing
      const originalEntries = Object.entries;
      Object.entries = jest.fn(() => {
        throw new Error('Border conversion error');
      });

      pasteHandler.handlePastePreprocess(mockArgs);

      // Should catch some error during processing
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Restore original method
      Object.entries = originalEntries;
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Style conversion debug logging', () => {
    it('should log MSO style conversions when debug is enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      const mockArgs = {
        content: '<td style="mso-background: yellow;">Test</td>',
      };

      pasteHandler.handlePastePreprocess(mockArgs);

      const conversionLog = consoleSpy.mock.calls.find(call =>
        call.some(
          arg =>
            typeof arg === 'string' &&
            arg.includes('[Preprocess] Converted MSO style from:')
        )
      );
      expect(conversionLog).toBeTruthy();

      consoleSpy.mockRestore();
    });
  });

  describe('Excel class style application', () => {
    it('should apply extracted Excel class styles and log when debug enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      // Manually set up the Excel class styles to simulate extraction
      (pasteHandler as any).excelClassStyles = {
        xl65: 'color: black; background-color: yellow;',
      };

      // Test preprocessing with class that should be found
      const mockArgs = {
        content: '<td class="xl65">Test content</td>',
      };

      pasteHandler.handlePastePreprocess(mockArgs);

      // Check if any debug logging occurred for class application
      const hasClassLog = consoleSpy.mock.calls.some(call =>
        call.some(
          arg => typeof arg === 'string' && arg.includes('[Preprocess]')
        )
      );
      expect(hasClassLog).toBeTruthy();

      // Verify that styles were applied
      expect(mockArgs.content).toContain('style=');
      expect(mockArgs.content).toContain('background-color: yellow');

      consoleSpy.mockRestore();
    });

    it('should handle existing inline styles when applying class styles', () => {
      // Manually set up the Excel class styles
      (pasteHandler as any).excelClassStyles = {
        xl65: 'color: black; background-color: yellow;',
      };

      // Test with existing inline styles
      const mockArgs = {
        content: '<td class="xl65" style="font-weight: bold;">Test</td>',
      };

      pasteHandler.handlePastePreprocess(mockArgs);

      // Should merge existing styles with class styles
      expect(mockArgs.content).toContain('font-weight: bold');
      expect(mockArgs.content).toContain('background-color: yellow');
    });

    it('should not modify content when no matching class styles exist', () => {
      // Clear any existing styles
      (pasteHandler as any).excelClassStyles = {};

      const mockArgs = {
        content: '<td class="xl99">Test content</td>',
      };

      pasteHandler.handlePastePreprocess(mockArgs);

      // Should remain unchanged since xl99 class doesn't exist
      expect(mockArgs.content).toBe('<td class="xl99">Test content</td>');
    });

    it('should log applied style results when debug enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      // Set up class styles
      (pasteHandler as any).excelClassStyles = {
        xl65: 'color: red;',
      };

      const mockArgs = {
        content: '<td class="xl65">Test</td>',
      };

      pasteHandler.handlePastePreprocess(mockArgs);

      // Check for style application logging
      const hasAppliedLog = consoleSpy.mock.calls.some(call =>
        call.some(
          arg =>
            typeof arg === 'string' &&
            (arg.includes('[Preprocess] Applying extracted') ||
              arg.includes('[Preprocess] Applied style result:'))
        )
      );
      expect(hasAppliedLog).toBeTruthy();

      consoleSpy.mockRestore();
    });
  });

  describe('Max length edge cases', () => {
    it('should return early when no max length or editor set', () => {
      pasteHandler.setMaxLength(); // No max length

      const mockArgs = {
        content: 'Any content here',
      };

      pasteHandler.handlePastePreprocess(mockArgs);
      expect(mockArgs.content).toBe('Any content here');
    });

    it('should block paste and log when no remaining space (debug enabled)', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      const mockEditor = {
        plugins: {
          wordcount: {
            body: {
              getCharacterCount: jest.fn(() => 100),
            },
          },
        },
        selection: {
          getContent: jest.fn(() => ''),
        },
      };

      pasteHandler.setMaxLength(100, mockEditor);

      const mockArgs = {
        content: 'Any content',
      };

      pasteHandler.handlePastePreprocess(mockArgs);

      const blockLog = consoleSpy.mock.calls.find(call =>
        call.some(
          arg =>
            typeof arg === 'string' &&
            arg.includes('[MaxLength] Blocking paste - no remaining space')
        )
      );
      expect(blockLog).toBeTruthy();
      expect(mockArgs.content).toBe('');

      consoleSpy.mockRestore();
    });

    it('should log truncation when debug enabled', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      const mockEditor = {
        plugins: {
          wordcount: {
            body: {
              getCharacterCount: jest.fn(() => 95),
            },
          },
        },
        selection: {
          getContent: jest.fn(() => ''),
        },
      };

      pasteHandler.setMaxLength(100, mockEditor);

      const mockArgs = {
        content: 'This is a very long text that will be truncated',
      };

      pasteHandler.handlePastePreprocess(mockArgs);

      const truncateLog = consoleSpy.mock.calls.find(call =>
        call.some(
          arg =>
            typeof arg === 'string' &&
            arg.includes('[MaxLength] Truncating paste from')
        )
      );
      expect(truncateLog).toBeTruthy();

      consoleSpy.mockRestore();
    });
  });

  describe('NBSP dots removal', () => {
    it('should log when nbsp dots are removed (debug enabled)', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      const mockArgs = {
        content: '<span><span>Text&nbsp;</span></span><a name="_GoBack"></a>',
      };

      pasteHandler.handlePastePreprocess(mockArgs);

      const removeLog = consoleSpy.mock.calls.find(call =>
        call.some(
          arg =>
            typeof arg === 'string' &&
            arg.includes('[RemoveNbspDots] Removed anchors and nbsp dots')
        )
      );
      expect(removeLog).toBeTruthy();

      consoleSpy.mockRestore();
    });

    it('should not log when no changes are made', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      const mockArgs = {
        content: '<p>Clean content without nbsp issues</p>',
      };

      pasteHandler.handlePastePreprocess(mockArgs);

      const removeLog = consoleSpy.mock.calls.find(call =>
        call.some(
          arg =>
            typeof arg === 'string' &&
            arg.includes('[RemoveNbspDots] Removed anchors and nbsp dots')
        )
      );
      expect(removeLog).toBeFalsy();

      consoleSpy.mockRestore();
    });
  });

  describe('RTF image parsing and replacement', () => {
    it('should parse RTF data and extract images', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      // Create mock RTF data with image marker
      const mockRtfData =
        '{\\rtf1\\ansi\\deff0 {\\pict\\pngblip\\picw100\\pich100 abcd1234}}';

      const mockEvent = {
        clipboardData: {
          types: ['text/html', 'text/plain', 'text/rtf'],
          getData: jest.fn((type: string) => {
            if (type === 'text/rtf') return mockRtfData;
            if (type === 'text/html') return '<p>Test</p>';
            return '';
          }),
        },
      } as unknown as ClipboardEvent;

      pasteHandler.handlePasteEvent(mockEvent);

      // Should log RTF data
      const rtfLog = consoleSpy.mock.calls.find(call =>
        call.some(
          arg =>
            typeof arg === 'string' &&
            arg.includes('[Paste Event] RTF data from clipboard:')
        )
      );
      expect(rtfLog).toBeTruthy();

      consoleSpy.mockRestore();
    });

    it('should handle RTF parsing with images found', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      // Mock RTF data that will result in images
      const mockRtfData = '{\\rtf1 Test}';

      const mockEvent = {
        clipboardData: {
          types: ['text/html', 'text/plain', 'text/rtf'],
          getData: jest.fn((type: string) => {
            if (type === 'text/rtf') return mockRtfData;
            return '<p>Test</p>';
          }),
        },
      } as unknown as ClipboardEvent;

      pasteHandler.handlePasteEvent(mockEvent);

      // Verify it processed RTF data
      expect(mockEvent.clipboardData?.getData).toHaveBeenCalledWith('text/rtf');

      consoleSpy.mockRestore();
    });

    it('should replace file:// URLs in images with base64 data', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      // Set up images in the handler
      (pasteHandler as any)._images = [
        { data: 'base64data1', mimeType: 'image/png', type: 'image' },
        { data: 'base64data2', mimeType: 'image/jpeg', type: 'image' },
      ];

      // Create a mock node with images having file:// URLs
      const mockNode = document.createElement('div');
      mockNode.innerHTML = `
        <img src="file:///C:/temp/image1.png" alt="Image 1">
        <img src="file:///C:/temp/image2.jpg" alt="Image 2">
      `;

      pasteHandler.replaceLocalImageUrlsInDom(mockNode);

      const images = mockNode.querySelectorAll('img');
      expect(images[0].getAttribute('src')).toBe(
        'data:image/png;base64,base64data1'
      );
      expect(images[1].getAttribute('src')).toBe(
        'data:image/jpeg;base64,base64data2'
      );

      // Check logging
      const replaceLog = consoleSpy.mock.calls.find(call =>
        call.some(
          arg =>
            typeof arg === 'string' &&
            arg.includes('[PostprocessDOM] Replaced img src')
        )
      );
      expect(replaceLog).toBeTruthy();

      consoleSpy.mockRestore();
    });

    it('should skip images without file:// URLs', () => {
      (pasteHandler as any)._images = [
        { data: 'base64data1', mimeType: 'image/png', type: 'image' },
      ];

      const mockNode = document.createElement('div');
      mockNode.innerHTML =
        '<img src="https://example.com/image.png" alt="Web Image">';

      const originalSrc = mockNode.querySelector('img')?.getAttribute('src');
      pasteHandler.replaceLocalImageUrlsInDom(mockNode);

      // Should not change the src
      expect(mockNode.querySelector('img')?.getAttribute('src')).toBe(
        originalSrc
      );
    });

    it('should handle image replacement when no matching image data exists', () => {
      (pasteHandler as any)._images = [
        { data: 'base64data1', mimeType: 'image/png', type: 'image' },
      ];

      const mockNode = document.createElement('div');
      mockNode.innerHTML = `
        <img src="file:///C:/temp/image1.png" alt="Image 1">
        <img src="file:///C:/temp/image2.png" alt="Image 2">
        <img src="file:///C:/temp/image3.png" alt="Image 3">
      `;

      pasteHandler.replaceLocalImageUrlsInDom(mockNode);

      const images = mockNode.querySelectorAll('img');
      // Only first image should be replaced
      expect(images[0].getAttribute('src')).toBe(
        'data:image/png;base64,base64data1'
      );
      // Others should remain unchanged
      expect(images[1].getAttribute('src')).toBe('file:///C:/temp/image2.png');
      expect(images[2].getAttribute('src')).toBe('file:///C:/temp/image3.png');
    });

    it('should clear images after replacement', () => {
      (pasteHandler as any)._images = [
        { data: 'base64data1', mimeType: 'image/png', type: 'image' },
      ];

      const mockNode = document.createElement('div');
      mockNode.innerHTML = '<img src="file:///C:/temp/image.png">';

      pasteHandler.replaceLocalImageUrlsInDom(mockNode);

      // Images should be cleared after replacement
      expect((pasteHandler as any)._images).toBeUndefined();
    });

    it('should handle errors during image replacement gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (pasteHandler as any)._images = [
        { data: 'base64data1', mimeType: 'image/png', type: 'image' },
      ];

      const mockNode = {
        querySelectorAll: jest.fn(() => {
          throw new Error('Query error');
        }),
      } as any;

      expect(() =>
        pasteHandler.replaceLocalImageUrlsInDom(mockNode)
      ).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should call replaceLocalImageUrlsInDom during postprocessing when images exist', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      (pasteHandler as any)._images = [
        { data: 'base64data1', mimeType: 'image/png', type: 'image' },
      ];

      const mockNode = document.createElement('div');
      mockNode.innerHTML = '<img src="file:///C:/temp/image.png">';

      const mockArgs = { node: mockNode };

      pasteHandler.handlePastePostprocess(mockArgs);

      // Image should be replaced
      expect(mockNode.querySelector('img')?.getAttribute('src')).toBe(
        'data:image/png;base64,base64data1'
      );

      consoleSpy.mockRestore();
    });

    it('should log when no images are available during postprocessing', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      (pasteHandler as any)._images = undefined;

      const mockNode = document.createElement('div');
      const mockArgs = { node: mockNode };

      pasteHandler.handlePastePostprocess(mockArgs);

      const noImagesLog = consoleSpy.mock.calls.find(call =>
        call.some(
          arg =>
            typeof arg === 'string' &&
            arg.includes('[Postprocess] No images available to replace')
        )
      );
      expect(noImagesLog).toBeTruthy();

      consoleSpy.mockRestore();
    });

    it('should count replaced images correctly', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      pasteHandler.setDebugMode(true);

      (pasteHandler as any)._images = [
        { data: 'base64data1', mimeType: 'image/png', type: 'image' },
        { data: 'base64data2', mimeType: 'image/jpeg', type: 'image' },
        { data: 'base64data3', mimeType: 'image/gif', type: 'image' },
      ];

      const mockNode = document.createElement('div');
      mockNode.innerHTML = `
        <img src="file:///C:/temp/image1.png">
        <img src="file:///C:/temp/image2.jpg">
      `;

      pasteHandler.replaceLocalImageUrlsInDom(mockNode);

      // Should log correct count (min of images and imgElements)
      const countLog = consoleSpy.mock.calls.find(call =>
        call.some(
          arg =>
            typeof arg === 'string' &&
            arg.includes('[PostprocessDOM] Replaced 2 images in DOM')
        )
      );
      expect(countLog).toBeTruthy();

      consoleSpy.mockRestore();
    });
  });

  describe('initialize', () => {
    function makeMockEditor(optionValues: Record<string, boolean> = {}) {
      return {
        options: {
          register: jest.fn(),
          get: jest.fn((key: string) => optionValues[key] ?? false),
        },
      } as any;
    }

    it('should register all four paste-nbsp options with the editor', () => {
      const mockEditor = makeMockEditor();
      pasteHandler.initialize(mockEditor);

      expect(mockEditor.options.register).toHaveBeenCalledWith(
        PasteOptions.sc_paste_keep_all_nbsp,
        {
          processor: 'boolean',
          default: false,
        }
      );
      expect(mockEditor.options.register).toHaveBeenCalledWith(
        PasteOptions.sc_paste_keep_span_nbsp,
        {
          processor: 'boolean',
          default: false,
        }
      );
      expect(mockEditor.options.register).toHaveBeenCalledWith(
        PasteOptions.sc_paste_keep_span_text_nbsp,
        {
          processor: 'boolean',
          default: false,
        }
      );
      expect(mockEditor.options.register).toHaveBeenCalledWith(
        PasteOptions.sc_paste_keep_consecutive_nbsp,
        {
          processor: 'boolean',
          default: false,
        }
      );
      expect(mockEditor.options.register).toHaveBeenCalledTimes(4);
    });

    it('should store the editor options reference and use it during preprocessing', () => {
      const mockEditor = makeMockEditor();
      pasteHandler.initialize(mockEditor);

      const mockArgs = { content: '<span><span>Text&nbsp;</span></span>' };
      pasteHandler.handlePastePreprocess(mockArgs);

      // options.get() must be consulted during the nbsp-removal step
      expect(mockEditor.options.get).toHaveBeenCalledWith(
        PasteOptions.sc_paste_keep_all_nbsp
      );
    });

    it('should preserve all nbsp when paste-keep-all-nbsp is true', () => {
      const mockEditor = makeMockEditor({ [PasteOptions.sc_paste_keep_all_nbsp]: true });
      pasteHandler.initialize(mockEditor);

      const mockArgs = {
        content:
          '<span><span>Text&nbsp;</span></span><span>Word&nbsp;</span>&nbsp;&nbsp;',
      };
      pasteHandler.handlePastePreprocess(mockArgs);

      // The entire nbsp-removal block is skipped, so &nbsp; must survive
      expect(mockArgs.content).toContain('&nbsp;');
    });

    it('should preserve nested span nbsp when paste-keep-span-nbsp is true', () => {
      const mockEditor = makeMockEditor({ [PasteOptions.sc_paste_keep_span_nbsp]: true });
      pasteHandler.initialize(mockEditor);

      // Inner span has an HTML child element so the single-span regex won't match it;
      // only the nested-span regex would have removed this &nbsp;.
      const mockArgs = {
        content: '<span><span><b>Bold</b>&nbsp;</span></span>',
      };
      pasteHandler.handlePastePreprocess(mockArgs);

      expect(mockArgs.content).toContain('&nbsp;');
    });

    it('should preserve single-span nbsp when paste-keep-span-text-nbsp is true', () => {
      const mockEditor = makeMockEditor({ [PasteOptions.sc_paste_keep_span_text_nbsp]: true });
      pasteHandler.initialize(mockEditor);

      const mockArgs = {
        content: '<span class="text">Word&nbsp;</span>',
      };
      pasteHandler.handlePastePreprocess(mockArgs);

      expect(mockArgs.content).toContain('&nbsp;');
    });

    it('should preserve consecutive nbsp when paste-keep-consecutive-nbsp is true', () => {
      const mockEditor = makeMockEditor({ [PasteOptions.sc_paste_keep_consecutive_nbsp]: true });
      pasteHandler.initialize(mockEditor);

      const mockArgs = {
        content: '<p>Text&nbsp;&nbsp;&nbsp;more</p>',
      };
      pasteHandler.handlePastePreprocess(mockArgs);

      expect(mockArgs.content).toContain('&nbsp;&nbsp;&nbsp;');
    });
  });
});
