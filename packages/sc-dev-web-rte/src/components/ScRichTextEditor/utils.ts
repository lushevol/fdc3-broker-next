// Refactor this file in the future
import { diff } from '@yeger/html-diff';
import { Editor } from 'hugerte';

// Move to constant.ts 
export const DEFAULT_MAX_IMAGE_SIZE = 1024;

// Custom formats not included by default in TinyMCE
export const CUSTOM_FORMATS = [
  'aside',
  'section',
];

export const ELEMENT_CLASSES: { [key: string]: string[] } = {
  ul: ['list-disc', 'list-inside'],
  ol: ['list-decimal', 'list-inside'],
};

export type Revision = {
  id: string;
  authorId: string;
  content: string;
  dateCreated: string;
};

export const htmlDiff = (oldText: string, newText: string) => {
  const result = diff(
    oldText,
    newText,
    {
      blocksExpression: [
        {
          exp: /<(h1|h2|h3|h4|h5|h6|a).*?>.*?<\/\1>/gm,
        },
        {
          exp: /<img[\w\W]+?\/>/gm,
        },
      ],
    }
  );
  return result;
};

export const handleOnChange = (event: Event, maxImageSize: number, editor?: Editor) => {
  const target = event.target as HTMLInputElement;
  if (target?.files && target.files.length > 0) {
    const file = target.files[0];
    const fileSize = Math.round(file.size / 1024);
    if (fileSize >= maxImageSize) {
      alert(
        `Image too big, please select a file less than ${Math.round(
          maxImageSize / 1024
        )}MB`
      );
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      editor?.execCommand(
        'InsertImage',
        false,
        base64String
      );
    };
    reader.readAsDataURL(file);
  }
};

// Move to /core folder inside ScRichTextEditor
// Based on the handleImageUpload on the old rich text editor image.ts
// Remove the reference in the function as it would be deprecated in favor of the TinyMCE Editor
export const handleImageUpload = (
  editor: Editor,
  maxImageSize: number = DEFAULT_MAX_IMAGE_SIZE
) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (event: Event) => handleOnChange(event, maxImageSize, editor);
  input.click();
  if (input.hasOwnProperty('remove')) {
    input.remove();
  }
};

// Move to /core folder inside ScRichTextEditor
export type EditorCommand = {
  handler: (editor: Editor, args?: any) => void;
  keys?: string;
  description?: string;
};

// Move to /core folder inside ScRichTextEditor
// Editor commands for the new rich text editor.
// Each command has a `handler` function that will be called
// when the command is executed (Either through button click or shortcuts).
// Optional `key` is provided to serve as keyboard shortcut for the command.
export const editorCommands: Record<string, EditorCommand> = {
  undo: {
    keys: 'meta+z',
    handler: (editor: Editor) => {
      editor.execCommand('Undo');
    },
    description: 'Undo',
  },
  redo: {
    keys: 'meta+y',
    handler: (editor: Editor) => {
      editor.execCommand('Redo');
    },
    description: 'Redo',
  },
  bold: {
    keys: 'meta+b',
    handler: (editor: Editor) => {
      editor.execCommand('Bold');
    },
    description: 'Toggle bold',
  },
  italic: {
    keys: 'meta+i',
    handler: (editor: Editor) => {
      editor.execCommand('Italic');
    },
    description: 'Toggle italic',
  },
  underline: {
    keys: 'meta+u',
    handler: (editor: Editor) => {
      editor.execCommand('Underline');
    },
    description: 'Toggle underline',
  },
  strikethrough: {
    keys: 'meta+shift+83', // Does not work, launches the screenshot window
    handler: (editor: Editor) => {
      editor.execCommand('Strikethrough');
    },
    description: 'Strikethrough',
  },
  removeformat: {
    keys: 'meta+220',
    handler: (editor: Editor) => {
      editor.execCommand('RemoveFormat');
    },
    description: 'Remove Format',
  },
  justifyleft: {
    keys: 'meta+shift+l',
    handler: (editor: Editor) => {
      editor.execCommand('JustifyLeft');
    },
    description: 'Justify left',
  },
  justifycenter: {
    keys: 'meta+shift+e', // Does not work, closes the window
    handler: (editor: Editor) => {
      editor.execCommand('JustifyCenter');
    },
    description: 'Justify center',
  },
  justifyright: {
    keys: 'meta+shift+r',
    handler: (editor: Editor) => {
      editor.execCommand('JustifyRight');
    },
    description: 'Justify right',
  },
  insertunorderedlist: {
    keys: 'meta+shift+7',
    handler: (editor: Editor) => {
      editor.execCommand('InsertUnorderedList', false, {
        'list-attributes': { class: 'list-disc list-inside' },
      });
    },
    description: 'Unordered list',
  },
  insertorderedlist: {
    keys: 'meta+shift+8',
    handler: (editor: Editor) => {
      editor.execCommand('InsertOrderedList', false, {
        'list-attributes': { class: 'list-decimal list-inside' },
      });
    },
    description: 'Ordered list',
  },
  outdent: {
    keys: 'meta+219',
    handler: (editor: Editor) => {
      editor.execCommand('Outdent');
    },
    description: 'Outdent',
  },
  indent: {
    keys: 'meta+221',
    handler: (editor: Editor) => {
      editor.execCommand('Indent');
    },
    description: 'Indent',
  },
  'formatblock-p': {
    keys: 'meta+48',
    handler: (editor: Editor) => {
      editor.execCommand('FormatBlock', false, 'p');
    },
    description: 'Body 2',
  },
  'formatblock-h1': {
    keys: 'meta+49',
    handler: (editor: Editor) => {
      editor.execCommand('FormatBlock', false, 'h1');
    },
    description: 'Title 1',
  },
  'formatblock-h2': {
    keys: 'meta+50',
    handler: (editor: Editor) => {
      editor.execCommand('FormatBlock', false, 'h2');
    },
    description: 'Title 2',
  },
  'formatblock-h3': {
    keys: 'meta+51',
    handler: (editor: Editor) => {
      editor.execCommand('FormatBlock', false, 'h3');
    },
    description: 'Title 3',
  },
  'formatblock-h4': {
    keys: 'meta+52',
    handler: (editor: Editor) => {
      editor.execCommand('FormatBlock', false, 'h4');
    },
    description: 'Title 4',
  },
  'formatblock-h5': {
    keys: 'meta+53',
    handler: (editor: Editor) => {
      editor.execCommand('FormatBlock', false, 'h5');
    },
    description: 'Title 5',
  },
  'formatblock-h6': {
    keys: 'meta+54',
    handler: (editor: Editor) => {
      editor.execCommand('FormatBlock', false, 'h6');
    },
    description: 'Title 6',
  },
  'formatblock-div': {
    keys: 'meta+55',
    handler: (editor: Editor) => {
      editor.execCommand('FormatBlock', false, 'div');
    },
    description: 'Body 1',
  },
  'formatblock-aside': {
    keys: 'meta+56',
    handler: (editor: Editor) => {
      editor.formatter?.apply('aside');
      editor.fire('ExecCommand', { command: 'FormatBlock', value: 'aside' } as any);
    },
    description: 'Body 3',
  },
  'formatblock-section': {
    keys: 'meta+57',
    handler: (editor: Editor) => {
      editor.formatter?.apply('section');
      editor.fire('ExecCommand', { command: 'FormatBlock', value: 'section' } as any);
    },
    description: 'Body 4',
  },
  'formatblock-blockquote': {
    keys: 'meta+shift+q',
    handler: (editor: Editor) => {
      editor.execCommand('mceBlockQuote');
    },
    description: 'Blockquote',
  },
  superscript: {
    keys: 'meta+shift+38',
    handler: (editor: Editor) => {
      editor.execCommand('Superscript');
    },
    description: 'Superscript',
  },
  subscript: {
    keys: 'meta+shift+40',
    handler: (editor: Editor) => {
      editor.execCommand('Subscript');
    },
    description: 'Subscript',
  },
  insertimagev2: {
    keys: 'meta+shift+m',
    handler: (editor: Editor) => {
      handleImageUpload(editor);
    },
    description: 'Insert image',
  },
  backcolor: {
    handler: (editor: Editor, colors?: string[]) => {
      editor.execCommand('BackColor', false, colors?.[0]);
    },
  },
  forecolor: {
    handler: (editor: Editor, colors?: string[]) => {
      editor.execCommand('ForeColor', false, colors?.[0]);
    },
  },
  unlink: {
    handler: (editor: Editor) => {
      editor.execCommand('Unlink');
    },
    description: 'Remove link',
  },
  createlink: {
    handler: (editor: Editor, links?: string[]) => {
      editor.execCommand('CreateLink', false, links?.[0]);
    },
    description: 'Create link',
  },
  inserttablev2: {
    handler: (editor: Editor, tableDetails: Array<any>) => {
      const tableDetail = tableDetails[0];
      const headerRows = parseInt(editor.options.get('table_default_header_rows') || '0');
      editor.execCommand('mceInsertTable', false, {
        rows: tableDetail.rowCount + headerRows,
        columns: tableDetail.colCount,
        options: { headerRows },
      });
    },
    description: 'Insert Table',
  },
  aishortcuts: {
    keys: '',
    handler: (editor: Editor, args:any) => {
    },
    description: 'AI shortcuts',
  },
  copy: {
    handler: async (editor: Editor) => {
      if (editor.selection.isCollapsed()) return;

      const successMessage = 'Selected content copied to clipboard!';
      const errorMessage = 'Copy failed. Please use Ctrl+C (Cmd+C on Mac).';
      let copied = false;

      try {
        // Try to first use the browser's native copy command
        copied = editor.getDoc().execCommand('copy');

        if (!copied) {
          // If native copy fails, try modern Clipboard API as fallback
          const htmlContent = editor.selection.getContent({ format: 'html' });
          const textContent = editor.selection.getContent({ format: 'text' });

          // Create clipboard data with proper MIME types
          const clipboardData = {
            'text/html': new Blob([htmlContent], { type: 'text/html' }),
            'text/plain': new Blob([textContent], { type: 'text/plain' }),
          };

          const clipboardItem = new ClipboardItem(clipboardData);
          await navigator.clipboard.write([clipboardItem]);
          copied = true;
        }
      } catch (err) {
        console.error('Copy operation failed:', err);
        copied = false;
      }

      editor.fire('sc-show-snackbar', {
        detail: {
          message: copied ? successMessage : errorMessage,
          type: copied ? 'info' : 'error',
        },
      });
    },
    description: 'Copy selected content',
  },
  paste: {
    handler: async (editor: Editor) => {
      editor.focus();

      // Helper function to check if clipboard API is available
      const isClipboardAPIAvailable = () => {
        return (
          navigator.clipboard &&
          typeof navigator.clipboard.read === 'function' &&
          (window.isSecureContext ||
            location.hostname === 'localhost' ||
            location.hostname === '127.0.0.1' ||
            location.protocol === 'https:')
        );
      };

      // Helper function to show error message
      const showPasteError = () => {
        editor.fire('sc-show-snackbar', {
          detail: {
            message:
              'Your browser does not support direct paste. Please use Ctrl+V (Cmd+V on Mac).',
            type: 'error',
          },
        });
      };

      // Helper function to create and dispatch paste event
      const dispatchPasteEvent = (
        htmlContent: string | null,
        textContent: string | null
      ) => {
        try {
          const clipboardData = new DataTransfer();

          if (htmlContent) {
            clipboardData.setData('text/html', htmlContent);
          }
          if (textContent) {
            clipboardData.setData('text/plain', textContent);
          }

          const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            clipboardData,
          });

          // Ensure editor is focused before dispatching
          editor.focus();
          editor.getBody().dispatchEvent(pasteEvent);
          return true;
        } catch (error) {
          console.log('Failed to dispatch paste event:', error);
          return false;
        }
      };

      try {
        // Try modern Clipboard API first if available
        if (isClipboardAPIAvailable()) {
          try {
            const clipboardItems = await navigator.clipboard.read();
            let htmlContent: string | null = null;
            let textContent: string | null = null;

            // Get both HTML and text content
            for (const item of clipboardItems) {
              if (item.types.includes('text/html') && !htmlContent) {
                const blob = await item.getType('text/html');
                htmlContent = await blob.text();
              }
              if (item.types.includes('text/plain') && !textContent) {
                const blob = await item.getType('text/plain');
                textContent = await blob.text();
              }
            }

            // If no HTML, try readText as fallback
            if (!htmlContent && !textContent && navigator.clipboard.readText) {
              textContent = await navigator.clipboard.readText();
            }

            if (htmlContent || textContent) {
              const success = dispatchPasteEvent(htmlContent, textContent);
              if (success) {
                return; // Success - exit early
              }
            }
          } catch (clipboardError) {
            console.log(
              'Clipboard API failed, trying fallback:',
              clipboardError
            );
          }
        }

        // Fallback 1: Try the browser's native paste command
        try {
          editor.focus(); // Ensure focus before execCommand
          const nativePasteWorked = editor.getDoc().execCommand('paste');
          if (nativePasteWorked) {
            return;
          }
        } catch (execError) {
          console.log('Native execCommand paste failed:', execError);
        }

        // Fallback 2: Try TinyMCE's built-in paste handling
        try {
          const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
          });
          editor.focus(); // Ensure focus before dispatching
          editor.getBody().dispatchEvent(pasteEvent);
          return;
        } catch (dispatchError) {
          console.log('Event dispatch paste failed:', dispatchError);
        }

        // If we reach here, all methods failed
        showPasteError();
      } catch (err) {
        showPasteError();
        console.log('All paste methods failed:', err);
      }
    },
    description: 'Paste from clipboard',
  },
}; // Add more shortcuts as needed

// Move to /core folder inside ScRichTextEditor
export const defaultToolbar = [
  'undo',
  'redo',
  'separate',
  'fontstyle',
  'separate',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'subscript',
  'superscript',
  'backcolor',
  'forecolor',
  'clear',
  'separate',
  'alignleft',
  'aligncenter',
  'alignright',
  'orderedlist',
  'unorderedlist',
  'outdent',
  'indent',
  'separate',
  'addlink',
  'insertimage',
  'unlink',
  'quote',
  'table',
] as const;

// ask AI request parameters
export interface msgsProp {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
export const messagesRequestTemplateData: msgsProp[] = [
  {
    role: 'system',
    content: 'Answer the question based on the context below.',
  },
  {
    role: 'system',
    content: 'The response should be in HTML format.',
  },
  {
    role: 'system',
    content: 'The response should preserve any HTML formatting, links, and styles in the context.',
  },
];