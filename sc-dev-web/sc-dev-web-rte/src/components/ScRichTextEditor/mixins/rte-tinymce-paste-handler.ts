import { Buffer } from '@taichunmin/buffer';
import { parseRtf } from '../ext/rtfParser.js';
import { OfficeAttachment } from '../ext/types.js';
import type { Editor } from 'hugerte';

declare module 'hugerte' {
  interface EditorOptions {
    sc_paste_keep_all_nbsp: boolean;
    sc_paste_keep_span_nbsp: boolean;
    sc_paste_keep_span_text_nbsp: boolean;
    sc_paste_keep_consecutive_nbsp: boolean;
  }
}
export enum PasteOptions {
  sc_paste_keep_all_nbsp = 'sc_paste_keep_all_nbsp',
  sc_paste_keep_span_nbsp = 'sc_paste_keep_span_nbsp',
  sc_paste_keep_span_text_nbsp = 'sc_paste_keep_span_text_nbsp',
  sc_paste_keep_consecutive_nbsp = 'sc_paste_keep_consecutive_nbsp',
}
const optionTypes = {
  [PasteOptions.sc_paste_keep_all_nbsp]: false,
  [PasteOptions.sc_paste_keep_span_nbsp]: false,
  [PasteOptions.sc_paste_keep_span_text_nbsp]: false,
  [PasteOptions.sc_paste_keep_consecutive_nbsp]: false,
} as const;

export class PasteHandler {
  private excelClassStyles: Record<string, string> = {};
  private debug = false; // Set to true when debugging Office paste issues to view in console.log
  private maxLength?: number;
  private editor?: any;
  
  private _images?: OfficeAttachment[];

  private options?: Editor['options'];

  initialize(editor: Editor): void {
    for (const [optionKey, defaultValue] of Object.entries(optionTypes)) {
      editor.options.register(optionKey, {
        processor: typeof defaultValue === 'boolean' ? 'boolean' : 'string',
        default: defaultValue,
      });
    }
    this.options = editor.options;
  }


  /**
   * Set the max-length and editor reference for paste length validation
   */
  setMaxLength(maxLength?: number, editor?: any): void {
    if (this.debug) {
      console.log('[Set Max Length] Initial maxLength:', maxLength);
      console.log('[Set Max Length] Initial editor:', editor);
    }

    this.maxLength = maxLength;
    this.editor = editor;

    if (this.debug) {
      console.log('[Set Max Length] Stored values:', {
        storedMaxLength: this.maxLength,
        storedEditorExists: !!this.editor,
      });
    }
  }

  /**
   * Handles the paste event to capture raw clipboard data and extract Excel styles
   * Note: In HugeRTE/TinyMCE, images from Word/Outlook are handled via blob URLs,
   * not as File objects in clipboardData.files
   */
  handlePasteEvent(event: ClipboardEvent): void {
    if (this.debug) {
      console.log('[Paste Event] Original event:', event);
    }

    const clipboardData = event.clipboardData || (window as any).clipboardData as DataTransfer;

    if (clipboardData) {
      if (this.debug) {
        console.log(
          '[Paste Event] Clipboard types:',
          Array.from(clipboardData.types)
        );
      }

      // Try to get the HTML content directly
      const htmlData = clipboardData.getData('text/html');
      if (this.debug) {
        console.log('[Paste Event] Raw HTML from clipboard:', htmlData);
      }

      // Extract and store Excel class styles for later use
      this.extractExcelStyles(htmlData);

      // Try to get the plain text
      const textData = clipboardData.getData('text/plain');
      if (this.debug) {
        console.log('[Paste Event] Plain text from clipboard:', textData);
      }

      // Try to get RTF data if available
      if (clipboardData.types.includes('text/rtf')) {
        const rtfData = clipboardData.getData('text/rtf');
        if (this.debug) {
          console.log('[Paste Event] RTF data from clipboard:', rtfData);
        }

        this._images = undefined;
        // Convert ArrayBuffer to Buffer for parseRtf
        const arrayBuffer = this.stringToArrayBuffer(rtfData);
        const results = parseRtf(arrayBuffer, { extractAttachments: true });
        this._images = results.attachments.filter(a => a.type === 'image');
        if (this.debug) {
          if (this._images.length)
            console.log('[Paste Event] RTF images:', this._images);
          else
            console.log('[Paste Event] Parsed RTF image empty', results);
        }
      }
    }
  }

  private stringToArrayBuffer(s: string) {
    const buffer = new ArrayBuffer(s.length);
    const bufferView = new Uint8Array(buffer);
    for (let i = 0; i < s.length; i++) {
      bufferView[i] = s.charCodeAt(i);
    }
    return Buffer.from(buffer) as any;
  }

  /**
   * Extract Excel styles from raw clipboard HTML
   */
  private extractExcelStyles(htmlData: string): void {
    if (this.debug) {
      console.log('[ExtractStyles] Processing raw HTML for Excel styles');
    }

    this.excelClassStyles = {};
    const seenStyles: Record<string, string> = {};

    // Use DOMParser to parse the HTML safely
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlData, 'text/html');

    const styleTags = doc.querySelectorAll('style');

    styleTags.forEach(styleTag => {
      const styleContent = styleTag.textContent || '';
      if (this.debug) {
        console.log('[ExtractStyles] Found style block:', styleContent);
      }

      // Parse CSS class definitions - keep ALL styles, not just background
      const classMatches = styleContent.match(
        /\.([a-zA-Z0-9_-]+)\s*\{([^}]*)\}/g
      );

      if (classMatches) {
        classMatches.forEach((classRule: string) => {
          const match = classRule.match(/\.([a-zA-Z0-9_-]+)\s*\{([^}]*)\}/);
          if (match) {
            const className = match[1];
            let classStyles = match[2].trim();

            if (this.debug) {
              console.log(
                `[ExtractStyles] Found class .${className}:`,
                classStyles
              );
            }

            // Store ALL styles from the class, not just background
            if (classStyles) {
              // Convert MSO styles to standard CSS where possible
              classStyles = this.convertMsoToStandardCss(classStyles);

              if (!seenStyles[classStyles]) {
                seenStyles[classStyles] = classStyles;
              }

              this.excelClassStyles[className] = seenStyles[classStyles];
              if (this.debug) {
                console.log(
                  `[ExtractStyles] Stored .${className} → ${seenStyles[classStyles]}`
                );
              }
            }
          }
        });
      }
    });

    if (this.debug) {
      console.log(
        '[ExtractStyles] Final extracted styles:',
        this.excelClassStyles
      );
    }
  }

  /**
   * Convert only the bare minimum MSO styles to standard CSS for browser compatibility
   * Keep everything else for perfect Office round-trip
   */
  private convertMsoToStandardCss(styles: string): string {
    let convertedStyles = styles;

    try {
      // Only convert MSO background styles to ensure colors show in browser
      // But keep the original MSO styles too for round-trip compatibility
      if (
        convertedStyles.includes('mso-background:') &&
        !convertedStyles.includes('background-color:')
      ) {
        convertedStyles = convertedStyles.replace(
          /mso-background:\s*([^;]+);?/gi,
          (match, color) => {
            return `${match} background-color: ${color.trim()};`;
          }
        );
      }

      if (
        convertedStyles.includes('mso-shading:') &&
        !convertedStyles.includes('background-color:')
      ) {
        convertedStyles = convertedStyles.replace(
          /mso-shading:\s*([^;]+);?/gi,
          (match, color) => {
            return `${match} background-color: ${color.trim()};`;
          }
        );
      }

      // Convert background: rgb(...) to background-color: rgb(...) but keep both
      if (
        convertedStyles.includes('background:') &&
        !convertedStyles.includes('background-color:')
      ) {
        convertedStyles = convertedStyles.replace(
          /background:\s*(rgb\([^)]+\))/gi,
          (match, color) => {
            return `${match}; background-color: ${color}`;
          }
        );
      }

      // Convert Microsoft-specific border colors to browser-compatible colors
      // Keep the original for Office round-trip compatibility
      convertedStyles = this.convertMicrosoftBorderColors(convertedStyles);

      // Clean up only duplicate semicolons, keep everything else
      convertedStyles = convertedStyles
        .replace(/;+/g, ';')
        .replace(/^;+|;+$/g, '');
    } catch (error) {
      console.error(
        '[PasteHandler] Error converting MSO styles:',
        error,
        'Original styles:',
        styles
      );
      return styles; // Return original if conversion fails
    }

    return convertedStyles;
  }

  /**
   * Convert Microsoft-specific border colors to browser-compatible equivalents
   */
  private convertMicrosoftBorderColors(styles: string): string {
    let convertedStyles = styles;

    try {
      // Microsoft color mappings for browser compatibility
      const microsoftColorMap: Record<string, string> = {
        windowtext: '#000000', // Black text color
        window: '#ffffff', // White background
        activecaption: '#0078d4', // Blue caption
        inactivecaption: '#999999', // Gray caption
        menu: '#f0f0f0', // Light gray menu
        menutext: '#000000', // Black menu text
        highlight: '#0078d4', // Blue highlight
        highlighttext: '#ffffff', // White highlight text
        infobackground: '#ffffe1', // Light yellow info
        infotext: '#000000', // Black info text
        buttonface: '#f0f0f0', // Light gray button
        buttontext: '#000000', // Black button text
        buttonshadow: '#808080', // Gray button shadow
        buttonhighlight: '#ffffff', // White button highlight
        threeddarkshadow: '#404040', // Dark gray 3D shadow
        threedface: '#c0c0c0', // Light gray 3D face
        threedhighlight: '#ffffff', // White 3D highlight
        threedlightshadow: '#d4d0c8', // Light gray 3D shadow
        threedshadow: '#808080', // Gray 3D shadow
      };

      // Convert border properties with Microsoft colors
      Object.entries(microsoftColorMap).forEach(([msColor, standardColor]) => {
        // Convert border-top, border-right, border-bottom, border-left with Microsoft colors
        const borderRegex = new RegExp(
          `(border(?:-(?:top|right|bottom|left))?:\\s*[^;]*?)\\b${msColor}\\b([^;]*;?)`,
          'gi'
        );
        convertedStyles = convertedStyles.replace(
          borderRegex,
          (match, before, after) => {
            // Keep original Microsoft color version AND add browser-compatible version
            const browserVersion = `${before}${standardColor}${after}`;
            return `${match} ${browserVersion}`;
          }
        );

        // Convert border-color properties specifically
        const borderColorRegex = new RegExp(
          `(border(?:-(?:top|right|bottom|left))?-color:\\s*[^;]*?)\\b${msColor}\\b([^;]*;?)`,
          'gi'
        );
        convertedStyles = convertedStyles.replace(
          borderColorRegex,
          (match, before, after) => {
            const browserVersion = `${before}${standardColor}${after}`;
            return `${match} ${browserVersion}`;
          }
        );
      });
    } catch (error) {
      console.error(
        '[PasteHandler] Error converting Microsoft border colors:',
        error
      );
      return styles; // Return original if conversion fails
    }

    return convertedStyles;
  }

  /**
   * Handle paste preprocessing and preserve everything
   */
  handlePastePreprocess(args: any): void {
    if (this.debug) {
      console.log('[Preprocess] Raw pasted content:', args.content);
    }

    let content = args.content;

    try {
      // Handle max-length validation before any other processing
      if (this.maxLength && this.editor) {
        content = this.enforceMaxLength(content);
        if (content === '') {
          args.content = '';
          return; // Exit early if paste would exceed limit
        }
      }

      // Remove the problematic &nbsp; dots
      content = this.removeNbspDots(content);

      // Remove align attribute from tables (prevents floating)
      content = this.removeTableAlignAttribute(content);

      // Only convert MSO styles to standard CSS and not remove anything
      content = content.replace(
        /style=('|")([^'"]*)\1/gi,
        (match: string, quote: string, style: string) => {
          const convertedStyle = this.convertMsoToStandardCss(style);

          if (convertedStyle !== style && this.debug) {
            console.log('[Preprocess] Converted MSO style from:', style);
            console.log('[Preprocess] Converted MSO style to:', convertedStyle);
          }

          return convertedStyle !== style
            ? `style=${quote}${convertedStyle}${quote}`
            : match;
        }
      );

      // Apply extracted Excel class styles to elements
      content = content.replace(
        /(<(?:td|th)[^>]*)\s*class="?([^">\s]+)"?([^>]*>)/gi,
        (match: string, before: string, className: string, after: string) => {
          const classStyle = this.excelClassStyles[className];
          if (classStyle) {
            if (this.debug) {
              console.log(
                `[Preprocess] Applying extracted ${className}: ${classStyle}`
              );
            }

            const existingStyle = before.match(/style="([^"]*)"/i);
            const currentStyles = existingStyle ? existingStyle[1] : '';

            // Merge class styles with existing inline styles
            const newStyle = currentStyles
              ? `style='${currentStyles}; ${classStyle}'`
              : `style='${classStyle}'`;
            const cleanedBefore = before.replace(/\s*style="[^"]*"/i, '');
            const result = `${cleanedBefore} ${newStyle}${after}`;

            if (this.debug) {
              console.log('[Preprocess] Applied style result:', result);
            }
            return result;
          }
          return match;
        }
      );

      // Handle pasted lists
      content = this.processListFormatting(content);

      if (this.debug) {
        console.log('[Preprocess] Final content:', content);
      }
      args.content = content;
    } catch (error) {
      console.error('[PasteHandler] Error during paste preprocessing:', error);
      // Continue with original content if processing fails
    }
  }

  /**
   * Enforce max-length limits on pasted content
   */
  private enforceMaxLength(content: string): string {
    if (!this.maxLength || !this.editor) {
      return content;
    }

    try {
      // Get plain text from content to count characters accurately
      const plainText = content
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      // Get current editor state
      const currentCharCount =
        this.editor.plugins.wordcount.body.getCharacterCount();
      const selectedText =
        this.editor.selection.getContent({ format: 'text' }) || '';
      const selectionLength = selectedText.length;

      // Calculate effective current length (current text minus what will be replaced)
      const effectiveLength = currentCharCount - selectionLength;
      const remaining = this.maxLength - effectiveLength;

      if (this.debug) {
        console.log('[MaxLength] Current chars:', currentCharCount);
        console.log('[MaxLength] Selected chars:', selectionLength);
        console.log('[MaxLength] Effective length:', effectiveLength);
        console.log('[MaxLength] Remaining chars:', remaining);
        console.log('[MaxLength] Paste text length:', plainText.length);
      }

      // If no remaining space, block the paste entirely
      if (remaining <= 0) {
        if (this.debug) {
          console.log('[MaxLength] Blocking paste - no remaining space');
        }
        return '';
      }

      // If paste content exceeds remaining space, truncate it
      if (plainText.length > remaining) {
        const truncatedText = plainText.substring(0, remaining);
        if (this.debug) {
          console.log(
            '[MaxLength] Truncating paste from',
            plainText.length,
            'to',
            remaining,
            'chars'
          );
        }

        // Convert line breaks back to HTML
        return truncatedText.replace(/\n/g, '<br>');
      }

      // Content is within limits, return as-is
      return content;
    } catch (error) {
      console.error('[PasteHandler] Error enforcing max length:', error);
      return content;
    }
  }

  /**
   * Remove problematic &nbsp; dots that cause visual artifacts
   */
  private removeNbspDots(content: string): string {
    try {
      let cleanedContent = content;

      // Remove ALL mce-item-anchor elements (Word bookmarks, etc.)
      cleanedContent = cleanedContent.replace(
        /<a[^>]*class="[^"]*mce-item-anchor[^"]*"[^>]*><\/a>/gi,
        ''
      );

      // Alternative pattern: Remove any anchor with mce-item-anchor class
      cleanedContent = cleanedContent.replace(
        /<a[^>]*mce-item-anchor[^>]*><\/a>/gi,
        ''
      );

      // Remove any Word bookmarks by name pattern (_GoBack, _Toc, etc.)
      cleanedContent = cleanedContent.replace(
        /<a[^>]*name="(?:_GoBack|_Toc\d*|_Ref\d*|OLE_LINK\d*)"[^>]*><\/a>/gi,
        ''
      );

      if (!this.options?.get(PasteOptions.sc_paste_keep_all_nbsp)) {
        // Generic pattern: Handle any nested span structure with &nbsp; after any character
        if (!this.options?.get(PasteOptions.sc_paste_keep_span_nbsp))
          cleanedContent = cleanedContent.replace(
            /(<span[^>]*><span>)([^&]*?)&nbsp;\s*(<\/span><\/span>)/gi,
            '$1$2$3'
          );

        // Single span pattern: Handle <span>ANYCHAR&nbsp;</span>
        if (!this.options?.get(PasteOptions.sc_paste_keep_span_text_nbsp))
          cleanedContent = cleanedContent.replace(
            /(<span[^>]*>)([^<]*?)&nbsp;\s*(<\/span>)/gi,
            '$1$2$3'
          );

        // Remove multiple consecutive &nbsp; that create additional dots
        if (!this.options?.get(PasteOptions.sc_paste_keep_consecutive_nbsp))
          cleanedContent = cleanedContent.replace(/(&nbsp;\s*){2,}/gi, ' ');

        if (this.debug && cleanedContent !== content) {
          console.log('[RemoveNbspDots] Removed anchors and nbsp dots');
        }
      }

      return cleanedContent;
    } catch (error) {
      console.error('[PasteHandler] Error removing nbsp dots:', error);
      return content;
    }
  }

  /**
   * Remove align attribute from tables to prevent floating behavior
   * Preserves all MSO properties for Outlook round-trip compatibility
   */
  private removeTableAlignAttribute(content: string): string {
    try {
      // Only remove align="left" or align="right" from table tags
      // Preserves all other attributes including mso-* properties
      return content.replace(
        /<table([^>]*?)\s+align\s*=\s*(['"]?)(left|right)\2([^>]*)>/gi,
        '<table$1$4>'
      );
    } catch (error) {
      console.error('[PasteHandler] Error removing table align:', error);
      return content;
    }
  }

  /**
   * Process list formatting in pasted content
   */
  private processListFormatting(content: string): string {
    try {
      let processedContent = content;
      processedContent = processedContent.replace(
        /(<p[^>]*>)\s*[·•]\s*([^<]+)(<\/p>)/gi,
        '<li type="disc">$2</li>'
      );
      processedContent = processedContent.replace(
        /(<p[^>]*>)\s*(\d+\.)\s*([^<]+)(<\/p>)/gi,
        '<li type="1">$3</li>'
      );
      /// this is breaking nested lists, rte handles wrapping automatically
      // processedContent = processedContent.replace(
      //   /(<li>[^<]*<\/li>\s*)+/gi,
      //   (match: string) => `<ul>${match}</ul>`
      // );
      return processedContent;
    } catch (error) {
      console.error('[PasteHandler] Error processing list formatting:', error);
      return content;
    }
  }

  /**
   * Handle paste postprocessing
   * This is where we finalize blob URL to base64 conversions
   */
  handlePastePostprocess(args: any): void {
    if (this.debug) {
      console.log('[Postprocess] Node:', args.node);
      console.log('[Postprocess] Node HTML:', args.node.innerHTML);
    }
    
    try {
      if (this._images?.length ?? 0 > 0) {
        this.replaceLocalImageUrlsInDom(args.node);
      } else if (this.debug) {
        console.log('[Postprocess] No images available to replace');
      }

      // remove any leftover comments
      const xpath = new XPathEvaluator();
      const iterator = xpath.evaluate('//comment()', args.node, null, XPathResult.ANY_TYPE, null);
      const comments = <Comment[]>[];
      for (let node: Node | null = iterator.iterateNext(); node; node = iterator.iterateNext()) {
        comments.push(node as Comment);
      }
      comments.forEach(comment => comment.parentNode?.removeChild(comment));
      this.debug && console.log(`[Postprocess] Removed ${comments.length} comment nodes`);

      if (this.debug) {
        console.log('[Postprocess] Final node HTML:', args.node.innerHTML);
      }
    } catch (error) {
      console.error('[PasteHandler] Error during paste postprocessing:', error);
    }
  }

  /**
   * Replace file:// URLs in pasted DOM with base64 data
   * Used in postprocess when async blob conversions complete
   */
  replaceLocalImageUrlsInDom(node: Element): void {
    if (this._images?.length) {
      const images = this._images;

      try {
        const imgElements = node.querySelectorAll<HTMLImageElement>(
          'img[src^="file://"]'
        );

        imgElements.forEach((img, index) => {
          const imgData = images[index];
          if (imgData) {
            if (this.debug) {
              console.log(
                '[PostprocessDOM] Replaced img src',
                img.src,
                imgData
              );
            }
            img.setAttribute(
              'src',
              `data:${imgData.mimeType};base64,${imgData.data}`
            );
            img.removeAttribute('v:shapes');
          }
        });
        const count = Math.min(imgElements.length, images.length);

        if (this.debug) {
          console.log(`[PostprocessDOM] Replaced ${count} images in DOM`);
        }
      } catch (error) {
        console.error('[PasteHandler] Error replacing images in DOM:', error);
      }
    }
    this._images = undefined;
  }

  /**
   * Clear stored Excel styles
   */
  clearExcelStyles(): void {
    this.excelClassStyles = {};
  }

  /**
   * Enable or disable debug logging
   */
  setDebugMode(enabled: boolean): void {
    this.debug = enabled;
  }
}
