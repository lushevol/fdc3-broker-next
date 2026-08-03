import { Editor } from 'hugerte';

/**
 * Handles brand alignment for rich text content while preserving Office formatting.
 * This handler works in coordination with the existing PasteHandler to ensure
 * brand compliance without breaking Excel/Word table formatting.
 */
export class BrandHandler {
  private editor: Editor | null = null;
  private debug = false; // Set to true when debugging brand alignment issues

  // Brand font sizes mapped to inline pixel values for email compatibility
  private readonly BRAND_FONT_SIZES = new Map([
    ['body', '14px'], // Default body text size for inheritance
    ['h1', '38px'], // Title 1 - 2.1875rem
    ['h2', '28px'], // Title 2 - 1.75rem
    ['h3', '21px'], // Title 3 - 1.3125rem
    ['h4', '17.5px'], // Title 4 - 1.09375rem (bold)
    ['h5', '17.5px'], // Title 5 - 1.09375rem (regular)
    ['h6', '14px'], // Title 6 - 0.875rem
    ['div', '16px'], // Body 1 - 1rem
    ['p', '14px'], // Body 2 - 0.875rem
    ['aside', '12px'], // Body 3 - 0.75rem
    ['section', '10px'], // Body 4 - 0.625rem
    ['td', '14px'], // Table cells - default body text size
    ['th', '14px'], // Table headers - default body text size
  ]);

  // Brand font family from ScRichTextEditorV2.style.ts
  private readonly BRAND_FONT_FAMILY =
    '\'SC Prosper Sans\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\'';

  // Line heights from ScRichTextEditorV2.style.ts
  private readonly BRAND_LINE_HEIGHTS = new Map([
    ['body', '1.4'], // Default body line-height for inheritance
    ['h1', '1.6'],
    ['h2', '1.35'],
    ['h3', '1.33'],
    ['h4', '1.4'],
    ['h5', '1.4'],
    ['h6', '1.4'],
    ['div', '1.4'],
    ['p', '1.4'],
    ['aside', '1.4'],
    ['section', '1.4'],
    ['td', '1.4'],
    ['th', '1.4'],
  ]);

  /**
   * Properties that should ALWAYS be stripped from pasted content
   * These will be removed and replaced with brand defaults
   */
  private readonly STRIP_PROPERTIES = [
    'font-family', // Always use brand font
    'font-size', // Always use brand sizes
    // Uncomment when color whitelisting is ready
    // 'color', // Will strip non-brand text colors
    // 'background-color', // Will strip non-brand background colors
  ];

  /**
   * Properties that should ALWAYS be preserved from source (Excel, Word, etc.)
   * Add more properties here as needed for future requirements
   */
  private readonly PRESERVE_PROPERTIES = [
    'font-weight', // Bold text
    'font-style', // Italic text
    'text-decoration', // Underline, strikethrough
    'color', // Text color (All colors preserved for now)
    'background-color', // Cell/text background (All colors preserved for now)
    'background', // Alternative background property
    'border', // Table borders
    'border-top',
    'border-right',
    'border-bottom',
    'border-left',
    'border-width',
    'border-style',
    'border-color',
    'text-align', // Text alignment
    'vertical-align', // Cell alignment
    'width', // Column widths
    'height', // Row heights
    'padding', // Cell padding
    'margin', // Spacing
  ];

  // Uncomment and populate when ready for color whitelisting
  /*
  private readonly ALLOWED_COLORS = [
    // Text colors
    '#000000', // Black
    '#ffffff', // White

    // Background colors
    'transparent',

    // Add more brand colors here
  ];
  */

  /**
   * Font families that must be preserved for special characters (bullets, symbols)
   */
  private readonly PRESERVE_FONTS = ['Symbol', 'Wingdings', 'Courier New'];

  /**
   * Bullet characters that indicate special font preservation needed
   */
  private readonly BULLET_CHARS = /[·•◦▪▫■□▬►‣⁃]/;

  // Tags to remove completely (dangerous or non-brand compliant)
  private readonly UNWANTED_TAGS = [
    'font',
    'script',
    'iframe',
    'meta',
    'link',
    'object',
    'embed',
  ];

  // Attributes to preserve for functionality
  private readonly PRESERVED_ATTRIBUTES = [
    'href',
    'src',
    'alt',
    'title',
    'colspan',
    'rowspan',
    'style',
    'class',
  ];

  /**
   * Initialize the brand handler with editor instance
   */
  public initialize(editor: Editor): void {
    this.editor = editor;
    this.setupEventListeners();
  }

  /**
   * Set up event listeners for brand alignment
   */
  private setupEventListeners(): void {
    if (!this.editor) return;

    // Apply brand styles after toolbar format commands
    this.editor.on('ExecCommand', (e: any) => {
      if (e.command === 'FormatBlock') {
        // Use setTimeout to ensure DOM is updated after TinyMCE processes the command
        setTimeout(() => {
          this.applyBrandStylesToSelection();

          // Clean up TinyMCE data attributes after format changes
          this.cleanupTinyMCEAttributes(this.editor!.getBody());

          // Trigger change to update component state
          this.editor?.fire('change');
        }, 0);
      }
    });

    // Apply brand styles when content is set programmatically
    this.editor.on('SetContent', ({ set }) => {
      if (set) {
        setTimeout(() => this.editor?.undoManager.ignore(() => {
          const body = this.editor?.getBody();
          if (body) this.applyBrandStylesToAllElements(body);
        }), 0);
      }
    });

    // Clean pasted content 
    // event name is wrong, never called; fixing to 'PastePostProcess' will cause breaking changes
    // TODO: review branding implementations vs current, check what is never called
    this.editor.on('paste_postprocess', () => {
      setTimeout(() => this.cleanupNonBrandElements(), 50);
    });

    // Additional cleanup for sources that bypass paste_postprocess

    this.editor.on('PastePostProcess', ({ node }) => {
      
      this.cleanFontStyling(node);
      this.cleanupTinyMCEAttributes(node);
    });
  }

  /**
   * Apply brand styles to all text elements in the editor
   */
  private applyBrandStylesToAllElements(body: HTMLElement): void {
    if (!body) return;

    if (body.tagName.toLowerCase() === 'body') {
      // Apply base styles to body for inheritance
      body.style.fontFamily = this.BRAND_FONT_FAMILY;
      body.style.fontSize = this.BRAND_FONT_SIZES.get('body')!;
      body.style.lineHeight = this.BRAND_LINE_HEIGHTS.get('body')!;
    }

    if (this.debug) {
      console.log('[BrandHandler] Applied base styles to body', {
        fontSize: body.style.fontSize,
        lineHeight: body.style.lineHeight,
      });
    }

    // Apply specific styles ONLY to headings
    const headings = body.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      this.applyBrandStylesToElement(heading as HTMLElement);
    });

    // Clean all pasted content using whitelist system
    this.cleanFontStyling(body);
  }

  /**
   * Apply brand typography ONLY to specific elements like headings
   * Only applies inline styles when they differ from body defaults
   * Strips font-weight when changing styles (except Title 4)
   */
  private applyBrandStylesToElement(element: HTMLElement): void {
    if (!element || !element.tagName) return;

    const tagName = element.tagName.toLowerCase();
    const fontSize = this.BRAND_FONT_SIZES.get(tagName);
    const lineHeight = this.BRAND_LINE_HEIGHTS.get(tagName);

    if (fontSize) {
      // Get body defaults for comparison
      const bodyFontSize = this.BRAND_FONT_SIZES.get('body')!;
      const bodyLineHeight = this.BRAND_LINE_HEIGHTS.get('body')!;

      // Check if this is a heading (h1-h6)
      const isHeading = tagName.match(/^h[1-6]$/i);

      // Check if this is a custom block element that needs explicit font-size
      const needsExplicitFontSize = ['aside', 'section'].includes(tagName);

      if (isHeading || needsExplicitFontSize) {
        // Headings always get explicit styles (they differ from body)
        element.style.fontSize = fontSize;
        element.style.lineHeight = lineHeight!;

        // Only apply font-weight to h4 (Title 4 should be bold)
        // All other headings strip inline font-weight
        if (tagName === 'h4') {
          element.style.fontWeight = '700';
        } else {
          // Strip font-weight for all headings except h4
          element.style.removeProperty('font-weight');
        }
      } else {
        // For non-headings (p, div, etc.), only add inline styles if different from body
        if (fontSize !== bodyFontSize) {
          element.style.fontSize = fontSize;
        } else {
          // Remove inline font-size to inherit from body
          element.style.removeProperty('font-size');
        }

        if (lineHeight !== bodyLineHeight) {
          element.style.lineHeight = lineHeight!;
        } else {
          // Remove inline line-height to inherit from body
          element.style.removeProperty('line-height');
        }

        // Strip inline font-weight for all non-headings
        // Bold from toolbar B button uses <strong> tags, not inline styles
        element.style.removeProperty('font-weight');
      }

      // Clean up empty style attribute if no inline styles remain
      if (element.style.length === 0) {
        element.removeAttribute('style');
      }

      if (this.debug) {
        console.log(`[BrandHandler] Applied brand styles to ${tagName}`, {
          isHeading,
          fontSize: element.style.fontSize || 'inherit',
          lineHeight: element.style.lineHeight || 'inherit',
          fontWeight: element.style.fontWeight || 'inherit',
          hasStyleAttr: element.hasAttribute('style'),
        });
      }
    }
  }

  /**
   * Apply brand styles to the currently selected element
   */
  private applyBrandStylesToSelection(): void {
    if (!this.editor) return;

    const selection = this.editor.selection;
    const selectedNode = selection.getNode();
    const blockElement = this.findBlockElement(selectedNode);

    if (blockElement) {
      this.applyBrandStylesToElement(blockElement);

      if (this.debug) {
        console.log('[BrandHandler] Applied styles to selection:', {
          tagName: blockElement.tagName,
          fontSize: blockElement.style.fontSize,
          fontWeight: blockElement.style.fontWeight,
        });
      }
    }
  }

  /**
   * Find the nearest block element containing the given node
   */
  private findBlockElement(node: Node): HTMLElement | null {
    let current = node;

    while (current && current !== this.editor?.getBody()) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        const element = current as HTMLElement;
        const tagName = element.tagName.toLowerCase();

        if (this.BRAND_FONT_SIZES.has(tagName)) {
          return element;
        }
      }
      current = current.parentNode!;
    }

    return null;
  }

  /**
   * Clean font styling using whitelist system
   * - Strips properties in STRIP_PROPERTIES
   * - Preserves properties in PRESERVE_PROPERTIES
   * - Special handling for Office bullets
   */
  private cleanFontStyling(container: HTMLElement): void {
    this.removeOfficeTags(container);
    const allElements = container.querySelectorAll('*');

    allElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const style = htmlElement.style;
      if (!style) return;

      // Check if this element needs special font preservation (bullets, symbols)
      const shouldPreserveFont = this.shouldPreserveFontForElement(htmlElement);

      // Strip properties from STRIP_PROPERTIES list
      this.STRIP_PROPERTIES.forEach(property => {
        this.stripPropertyIfNeeded(htmlElement, property, shouldPreserveFont);
      });

      // All properties in PRESERVE_PROPERTIES are automatically kept

      // Clean up empty style attribute if no inline styles remain
      if (htmlElement.style.length === 0) {
        htmlElement.removeAttribute('style');
      }

      if (this.debug) {
        console.log(
          `[BrandHandler] Processed ${htmlElement.tagName}:`,
          `Preserved: ${this.PRESERVE_PROPERTIES.join(', ')}`
        );
      }
    });
  }

  /**
   * Determine if an element needs font preservation for bullets/symbols
   */
  private shouldPreserveFontForElement(element: HTMLElement): boolean {
    const style = element.style;

    // Check if element uses special fonts
    if (style.fontFamily) {
      for (const preserveFont of this.PRESERVE_FONTS) {
        if (style.fontFamily.includes(preserveFont)) {
          return true;
        }
      }
    }

    // Check if element contains bullet characters
    if (element.textContent && this.BULLET_CHARS.test(element.textContent)) {
      return true;
    }

    return false;
  }

  // Uncomment when color whitelisting is ready
  /*
  private normalizeColor(color: string): string {
    if (!color) return '';

    // Handle rgb/rgba format
    const rgbMatch = color.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
    );
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
      const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
      const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }

    // Handle hex format
    if (color.startsWith('#')) {
      return color.toLowerCase();
    }

    // Handle named colors (convert to lowercase for comparison)
    return color.toLowerCase();
  }

  private isColorAllowed(color: string): boolean {
    if (!color || color === 'transparent') {
      return true; // Always allow transparent
    }

    const normalizedColor = this.normalizeColor(color);
    return this.ALLOWED_COLORS.some(
      allowedColor => this.normalizeColor(allowedColor) === normalizedColor
    );
  }
  */

  /**
   * Strip a property from an element based on whitelist rules
   */
  private stripPropertyIfNeeded(
    element: HTMLElement,
    property: string,
    shouldPreserveFont: boolean
  ): void {
    const style = element.style;
    const tagName = element.tagName;

    // Special handling for font-family
    if (property === 'font-family') {
      if (!shouldPreserveFont && style.fontFamily) {
        style.removeProperty('font-family');

        if (this.debug) {
          console.log(`[BrandHandler] Stripped font-family from ${tagName}`);
        }
      }
      return;
    }

    // Special handling for font-size
    if (property === 'font-size') {
      // Don't strip from headings or custom block elements (aside, section)
      const isHeading = tagName.match(/^H[1-6]$/i);
      const isCustomBlock = ['ASIDE', 'SECTION', 'DIV'].includes(tagName);

      if (!isHeading && !isCustomBlock && style.fontSize) {
        style.removeProperty('font-size');

        if (this.debug) {
          console.log(`[BrandHandler] Stripped font-size from ${tagName}`);
        }
      }
      return;
    }

    // Uncomment when color whitelisting is ready
    /*
    // Special handling for color
    if (property === 'color') {
      const color = style.color;
      if (color && !this.isColorAllowed(color)) {
        style.removeProperty('color');

        if (this.debug) {
          console.log(
            `[BrandHandler] Stripped non-brand color ${color} from ${tagName}`
          );
        }
      }
      return;
    }

    // Special handling for background-color
    if (property === 'background-color') {
      const bgColor = style.backgroundColor;
      if (bgColor && !this.isColorAllowed(bgColor)) {
        style.removeProperty('background-color');

        if (this.debug) {
          console.log(
            `[BrandHandler] Stripped non-brand background-color ${bgColor} from ${tagName}`
          );
        }
      }
      return;
    }
    */

    // For any other properties in STRIP_PROPERTIES
    if (style.getPropertyValue(property)) {
      style.removeProperty(property);

      if (this.debug) {
        console.log(`[BrandHandler] Stripped ${property} from ${tagName}`);
      }
    }
  }

  /**
   * Clean up non-brand elements while preserving Office formatting
   */
  private cleanupNonBrandElements(container?: HTMLElement): void {
    if (!this.editor) return;

    const body = container ?? this.editor.getBody();

    this.removeUnwantedTags(body);
    this.cleanFontStyling(body);
    this.cleanDangerousAttributes(body);
    this.cleanupTinyMCEAttributes(body);
    this.removeEmptyListItems(body);
    this.applyBrandStylesToAllElements(body);
  }

  /**
   * Remove unwanted HTML tags while preserving content
   */
  private removeUnwantedTags(container: HTMLElement): void {
    this.UNWANTED_TAGS.forEach(tagName => {
      const elements = container.getElementsByTagName(tagName);

      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];

        if (['script', 'meta', 'link', 'object', 'embed'].includes(tagName)) {
          element.remove();
        } else {
          const parent = element.parentNode;
          if (parent) {
            while (element.firstChild) {
              parent.insertBefore(element.firstChild, element);
            }
            parent.removeChild(element);
          }
        }
      }
    });
  }

  /**
   * Remove Office-specific tags
   */
  private removeOfficeTags(container: HTMLElement): void {
    const officeTags = container.querySelectorAll('o\\:p, o\\:O');
    officeTags.forEach(tag => {
      const parent = tag.parentNode;
      if (parent) {
        while (tag.firstChild) {
          parent.insertBefore(tag.firstChild, tag);
        }
        parent.removeChild(tag);

        if (this.debug) {
          console.log('[BrandHandler] Removed Office tag:', tag.tagName);
        }
      }
    });
  }

  /**
   * Remove empty list items
   */
  private removeEmptyListItems(container: HTMLElement): void {
    const emptyListItems = container.querySelectorAll('li');

    emptyListItems.forEach(li => {
      const text = li.textContent?.trim();
      if (!text || text === '\u00A0' || text === '') {
        if (this.debug) {
          console.log('[BrandHandler] Removing empty list item');
        }
        li.remove();
      }
    });
  }

  /**
   * Clean dangerous attributes while preserving essential ones
   */
  private cleanDangerousAttributes(container: HTMLElement): void {
    const allElements = container.querySelectorAll('*');

    allElements.forEach(element => {
      const attributesToRemove: string[] = [];

      Array.from(element.attributes).forEach(attr => {
        const attrName = attr.name.toLowerCase();

        // Remove event handlers
        if (attrName.startsWith('on')) {
          attributesToRemove.push(attr.name);
          return;
        }

        // Remove most data attributes except table IDs
        if (attrName.startsWith('data-') && !attr.value.includes('tab-id-')) {
          attributesToRemove.push(attr.name);
          return;
        }

        // Remove id unless it's a table ID
        if (attrName === 'id' && !attr.value.startsWith('tab-id-')) {
          attributesToRemove.push(attr.name);
          return;
        }

        // Clean class attribute but preserve list and essential classes
        if (attrName === 'class') {
          const classValue = attr.value;
          const importantClasses = classValue
            .split(' ')
            .filter(
              cls =>
                cls.includes('list-') ||
                cls.includes('mce-') ||
                cls.includes('diff') ||
                cls.includes('sc-') ||
                cls.includes('MsoList') ||
                cls.includes('Mso') ||
                element.tagName.toLowerCase() === 'ul' ||
                element.tagName.toLowerCase() === 'ol' ||
                element.tagName.toLowerCase() === 'li'
            );

          if (importantClasses.length > 0) {
            element.setAttribute('class', importantClasses.join(' '));
          } else {
            attributesToRemove.push(attr.name);
          }
          return;
        }

        // Preserve essential attributes
        if (this.PRESERVED_ATTRIBUTES.includes(attrName)) {
          return;
        }

        // Remove everything else
        attributesToRemove.push(attr.name);
      });

      // Remove the identified attributes
      attributesToRemove.forEach(attrName => {
        element.removeAttribute(attrName);
      });
    });
  }

  /**
   * Clean up TinyMCE data attributes that can cause styling conflicts
   * Skip cleanup on actively selected/resizing tables
   */
  private cleanupTinyMCEAttributes(container: HTMLElement): void {
    const dataAttributes = [
      '[data-mce-style]',
      '[data-mce-bogus]',
      '[data-mce-fragment]',
    ];

    dataAttributes.forEach(selector => {
      const elements = container.querySelectorAll(selector);
      elements.forEach(element => {
        const attrName = selector.replace('[data-mce-', '').replace(']', '');

        // Skip cleanup on actively selected tables (being resized) for data-mce-style only
        if (
          attrName === 'style' &&
          element.tagName.toLowerCase() === 'table' &&
          element.hasAttribute('data-mce-selected')
        ) {
          return;
        }

        element.removeAttribute(`data-mce-${attrName}`);

        if (this.debug) {
          console.log(
            `[BrandHandler] Removed data-mce-${attrName} from`,
            element.tagName.toLowerCase()
          );
        }
      });
    });
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    this.editor = null;
  }
}
