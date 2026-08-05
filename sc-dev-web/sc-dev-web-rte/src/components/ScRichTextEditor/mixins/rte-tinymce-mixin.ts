import { Editor, EditorEvent, EditorManager, HugeRTE } from 'hugerte';
// Required components
import 'hugerte/hugerte.js';
import 'hugerte/skins/content/default/content.js';
import 'hugerte/themes/silver/theme.min.js';
import 'hugerte/models/dom/model.min.js';
import 'hugerte/icons/default/icons.min.js';
// Skins
import 'hugerte/skins/ui/oxide/skin.js';
import 'hugerte/skins/ui/oxide/skin.shadowdom.js';
import 'hugerte/skins/ui/oxide/content.js';
// Plugins
import 'hugerte/plugins/lists/plugin.min.js';
import 'hugerte/plugins/advlist/plugin.min.js';
import 'hugerte/plugins/link/plugin.min.js';
import 'hugerte/plugins/table/plugin.min.js';
import 'hugerte/plugins/wordcount/plugin.min.js';
import 'hugerte/plugins/autoresize/plugin.min.js';

import { safeMixin, TConstructor } from '../../../shared/mixin.js';
import { ToolMixin } from '../../../mixins/tool-mixin.js';
import { property, state } from 'lit/decorators.js';
import { CUSTOM_FORMATS, editorCommands, ELEMENT_CLASSES } from '../utils.js';
import { generateFileUniqueId } from '../../../shared/generate-unique-id.js';
import ScRteElement from '../../../shared/sc-rte-element.js';
import { tinymceSkinOxideContent } from '../styles/tinymce-oxide.style.js';
import { editorContentStyles } from '../styles/ScRichTextEditorV2.style.js';
import { PasteHandler } from './rte-tinymce-paste-handler.js';
import { RteViewportHandler } from './rte-tinymce-viewport-handler.js';
import { RteCleanupHandler } from './rte-tinymce-cleanup-handler.js';
import { BrandHandler } from './rte-tinymce-brand-handler.js';
import { RteMentionHandler } from './rte-tinymce-mention-handler.js';
import {
  injectScrollbarStyles,
  ScrollbarSize,
} from '../styles/tinymce-scrollbar.style.js';
import { ListHandler } from './rte-tinymce-list-handler.js';
import { ExtConfig } from '../typeUtils.js';
import { EmailHandler } from './rte-tinymce-email-handler.js';
import {
  OPTION_NAME as defaultFormatOpt,
  PLUGIN_ID as defaultFormatPlugin,
} from '../plugins/default-format-plugin.js';
import { watch } from '../../../shared/watch.js';
import { debounce } from '../../../shared/debounce.js';
import { enableDefaultTrustTypesPolicy } from '../../../shared/trusted-types-policy.js';
// only import types, turndown requires immediate trusted policy on import
import type { MarkdownPluginApi } from '../plugins/markdown/markdown-plugin.js';

export type TinyMCEInitProps = {
  value: string;
  format: 'html' | 'md';
  readonly: boolean;
  disabled: boolean;
  disableSpellcheck: boolean;
  shortcut: boolean;
  maxLength: number;
  placeholder?: string;
  extConfig?: ExtConfig;
  // Scrollbar configuration
  scrollbarSize?: ScrollbarSize | '';
  scrollbarOpaque?: boolean;
  scrollbarAlwaysVisible?: boolean;
  validStyles?: Record<string, string>;
};

type TTinyMCEWrapper = {
  initTinyMCE(props: TinyMCEInitProps): void;
  selectionRange: Range | null;
  selectedNodes: Element[];
  editorInstance: Editor | null;
  editorId: string;
  editorOnInit(editor: Editor, props?: Partial<TinyMCEInitProps>): void;
  moveCursorToEnd(): void;
  _cleanupInstance(): void;
  getMentionedUsers(): { id: string; name: string }[];
  markdownPlugin: MarkdownPluginApi | undefined;
};

// Mixin to wrap TinyMCE editor functionalities
export const RteTinyMCEWrapperMixin = safeMixin(
  <T extends TConstructor<ScRteElement>>(
    superClass: T
  ): TConstructor<TTinyMCEWrapper> & T => {
    class Mixin extends ToolMixin(superClass) {
      @property({
        type: Array,
        attribute: 'default-format',
        converter(value) {
          return value?.split(';').map(v => v.trim());
        },
      })
        defaultFormat?: string[];

      @state() editorInstance: Editor | null;
      @state() selectionRange: Range | null = null;
      @state() selectedNodes: Element[];
      editorId = `rte-${generateFileUniqueId()}`;
      tinyMCEContainer: HTMLElement;

      // Handles viewport resizing logic
      private viewportHandler: RteViewportHandler | null = null;

      // Handles Excel, Word, Outlook paste events and styles
      private pasteHandler = new PasteHandler();

      // Handles cleanup of plugin artifacts
      private cleanupHandler: RteCleanupHandler | null = null;

      // Handles brand insertion and management
      private brandHandler = new BrandHandler();

      // Handles @mention functionality
      private mentionHandler: RteMentionHandler | null = null;

      private listHandler?: ListHandler;
      private emailHandler?: EmailHandler;

      #pluginsLoaded?: Promise<any>;

      constructor() {
        super();

        enableDefaultTrustTypesPolicy();

        this.#pluginsLoaded = Promise.all([
          // turndown requires trusted policy on import,
          // so we load it asynchronously to avoid errors
          import('../plugins/markdown/markdown-plugin.js').catch(
            console.error
          ),
        ]);
      }


      get markdownPlugin(): MarkdownPluginApi | undefined {
        return (this.editorInstance?.plugins as any)?.scMarkdown as MarkdownPluginApi | undefined;
      }

      private _getTinyMCE(): HugeRTE {
        return (window as any).hugerte;
      }

      // Converts height values (rem, em, px) to pixels for autoresize plugin
      private _convertToPixels(
        value: string | number | undefined
      ): number | undefined {
        if (value === undefined) return undefined;
        if (typeof value === 'number') return value;

        const stringValue = String(value);
        const numericValue = parseFloat(stringValue);

        if (isNaN(numericValue)) return undefined;

        // If it's just a number string like "50", treat as pixels
        if (stringValue === String(numericValue)) {
          return numericValue;
        }

        // Handle rem units
        if (stringValue.includes('rem')) {
          const rootFontSize = parseFloat(
            getComputedStyle(document.documentElement).fontSize
          );
          return numericValue * rootFontSize;
        }

        // Handle em units
        if (stringValue.includes('em')) {
          const parentFontSize = 16; // Default browser font size
          return numericValue * parentFontSize;
        }

        // Handle px or just return the numeric part
        return numericValue;
      }

      @watch('defaultFormat')
      handleDefaultFormatChange() {
        if (this.editorInstance?.options.isRegistered(defaultFormatOpt))
          this.editorInstance.options.set(
            defaultFormatOpt,
            this.defaultFormat ?? []
          );
      }

      async initTinyMCE(props: TinyMCEInitProps) {
        const {
          extConfig,
          readonly,
          disabled,
          disableSpellcheck,
          value,
          shortcut,
          maxLength,
          placeholder,
          scrollbarSize,
          scrollbarOpaque,
          scrollbarAlwaysVisible,
          validStyles,
          format,
        } = props;

        const formats: Record<string, { block: string; classes: string }> = {};
        Object.entries(ELEMENT_CLASSES).forEach(([tag, classes]) => {
          formats[`sc_${tag}`] = { block: tag, classes: classes.join(' ') };
        });

        const targetElement = this.renderRoot?.querySelector(
          `[id='${this.editorId}']`
        );

        // Set maxLength in the paste handler
        this.pasteHandler.setMaxLength(maxLength);

        // Conditionally add autoresize plugin if min/max height is set (but not fixed height)
        const defaultPlugins = 'lists advlist link table wordcount'.split(' ');
        const useAutoresize =
          (extConfig?.min_height || extConfig?.max_height) &&
          !extConfig?.height;
        const plugins = (typeof extConfig?.plugins === 'string'
          ? extConfig.plugins.split(' ')
          : extConfig?.plugins) ?? [
          ...defaultPlugins,
          ...(useAutoresize ? ['autoresize'] : []),
        ];

        if (this.defaultFormat) plugins.push(defaultFormatPlugin);
        if (format === 'md') plugins.push('scMarkdown');

        await this.#pluginsLoaded;

        this._getTinyMCE().init({
          ...extConfig,
          target: targetElement as HTMLElement,
          plugins,
          toolbar: false,
          menubar: false,
          contextmenu: false,
          promotion: false,
          statusbar: !!(
            extConfig?.resize ||
            extConfig?.elementpath ||
            extConfig?.statusbar
          ),
          resize: extConfig?.resize || false,
          branding: false,
          placeholder,
          height: extConfig?.height || 200, // Initial editor height, will be adjusted by viewport handler
          min_height: this._convertToPixels(extConfig?.min_height),
          max_height: this._convertToPixels(extConfig?.max_height),
          highlight_on_focus: false,
          convert_unsafe_embeds: true, // Fixes CVE-2024-29881. Do not override
          sandbox_iframes: true, // Fixes CVE-2024-29881. Do not override
          skin_url: 'default',
          // content_css: '@sc-devkit/webkit/dist/styles/ScStyleguide.css',
          content_style: `${editorContentStyles.toString()} ${
            extConfig?.content_style ?? ''
          }`,
          fix_list_elements: true,
          advlist_bullet_styles: 'default,disc,circle,square',
          advlist_number_styles:
            'default,lower-alpha,lower-roman,upper-alpha,upper-roman',
          readonly,
          disabled,
          browser_spellcheck: !disableSpellcheck,
          format_empty_lines: true,
          // saves memory usage
          custom_undo_redo_levels: extConfig?.custom_undo_redo_levels ?? 50,

          // Enhanced paste configuration for Office compatibility
          paste_data_images: true, // Allow images from clipboard (Excel charts, etc.)
          paste_merge_formats: true, // Merge pasted formats with existing content
          paste_webkit_styles: 'all', // Preserve all styles from Office applications
          paste_remove_styles_if_webkit: false, // Do not strip styles from Office paste
          noneditable_class: 'mceNonEditable',
          inline_boundaries: true,
          inline_boundaries_selector:
            'a[href],code,sub,sup,span.mce-annotation,span.sc-mention,pre.sc-azure-container,pre.sc-math',
          // Allow all HTML elements and attributes for Office content
          valid_elements: '*[*]',
          invalid_elements:
            'o:p,script,meta,link,object,embed,style,form,input,button,select,textarea',
          valid_styles: {
            '*':
              'background,background-color,border,border-top,border-right,border-bottom,border-left,' +
              'border-width,border-style,border-color,color,font-size,font-weight,' +
              'font-style,text-decoration,text-align,vertical-align,width,height,padding,margin,' +
              'table-layout,border-collapse,border-spacing',
            img: 'margin-left,margin-right,float,display',
            li: 'list-style-type',
            ...validStyles, // Allow additional valid styles from props
          }, // CSS validation for Excel, Word, Outlook round-trip compatibility

          paste_preprocess: (plugin: any, args: any) => {
            this.pasteHandler.handlePastePreprocess(args);
          },
          paste_postprocess: (plugin: any, args: any) => {
            this.pasteHandler.handlePastePostprocess(args);
          },

          table_default_attributes: {
            border: '1',
          },
          table_default_header_rows: 1,
          table_use_colgroups: false,
          table_sizing_mode: format === 'md' ? 'responsive' : 'auto',
          table_resize_bars: format !== 'md',
          object_resizing: format === 'md' ? 'img' : undefined,
          formats: {
            ...formats,
            underline: { inline: 'u', exact: true },
            diff_del: {
              block: 'del',
              exact: true,
              wrapper: true,
              deep: true,
              remove: 'empty',
            },
            diff_ins: {
              block: 'ins',
              exact: true,
              wrapper: true,
              deep: true,
              remove: 'empty',
            },
          },
          setup: (editor: Editor) => {
            !editor.options.isRegistered('editor.options') &&
              editor.options.register('table_default_header_rows', {
                processor: 'number',
                default: 0,
              });

            this.pasteHandler.initialize(editor);

            // Initialize brand handler
            this.brandHandler.initialize(editor);

            // Instantiate the cleanup handler
            this.cleanupHandler = new RteCleanupHandler(editor);

            // Initialize @mention functionality
            if (!readonly && !disabled) {
              this.mentionHandler = new RteMentionHandler();
              this.mentionHandler.initialize(editor, this._graphQLClient);
            }

            this.listHandler = new ListHandler(editor);
            this.emailHandler = new EmailHandler(editor);

            editor.on('Preinit', () => {
              const win = editor.getWin();
              // restore body identifiers, removed from trust policy
              const body = win.document.body;
              if (body) {
                body.setAttribute('id', 'hugerte');
                body.setAttribute('class', 'mce-content-body');
                body.setAttribute('data-id', editor.id);
              }
              // apply default Trusted Types policy for editor window
              enableDefaultTrustTypesPolicy(win);

              // copy root <link> into iframe
              document
                .querySelectorAll('link[rel="stylesheet"][href]')
                .forEach(link => {
                  const href = link.getAttribute('href') || '';
                  if (!href.split('/').pop()?.startsWith('Sc')) return;

                  const el = editor.dom.doc.createElement('link');
                  el.rel = 'stylesheet';
                  el.href = href;
                  editor.dom.doc.head.prepend(el);
                });
            });
            // scMarkdown plugin self-initializes via PluginManager — no manual setup needed

            // Pass editor reference to paste handler for max-length validation
            editor.on('init', () => {
              this.pasteHandler.setMaxLength(maxLength, editor);
            });

            // Disable TinyMCE's built-in notifications
            editor.on('init', () => {
              // Override the notification manager to prevent default notifications
              const originalOpen = editor.notificationManager.open;
              editor.notificationManager.open = function (spec: any) {
                // Only allow non-copy/paste related notifications to show
                // This prevents the default "browser doesn't support clipboard" messages
                if (
                  spec.text &&
                  (spec.text.includes('clipboard') ||
                    spec.text.includes('Ctrl+X/C/V') ||
                    spec.text.includes('copy') ||
                    spec.text.includes('paste'))
                ) {
                  // Suppress these notifications as we handle them with ScSnackbar
                  // Return a dummy NotificationApi to satisfy the type
                  return {
                    close: () => {},
                    reposition: () => {},
                    getEl: () => document.createElement('div'),
                  } as any;
                }
                // Allow other notifications to show normally
                return originalOpen.call(this, spec);
              };
            });

            editor.on('init', () => {
              this.editorOnInit(editor, props);
              this.tinyMCEContainer = this.renderRoot.querySelector(
                `[id='${this.editorId}'] + .tox-hugerte`
              ) as HTMLElement;
              this.tinyMCEContainer?.classList.add(
                'sc-form-control',
                'box',
                'sc-rich-text-editor'
              );

              // Inject scrollbar styles directly into iframe document
              injectScrollbarStyles(editor, {
                size: scrollbarSize || 'default',
                opaque: scrollbarOpaque || false,
                alwaysVisible: scrollbarAlwaysVisible || false,
              });

              this._syncColorMode(editor);

              this.handleDefaultFormatChange();
            });

            editor.on('NodeChange', (e: EditorEvent<any>) => {
              this.editorOnNodeChange(e);
            });
            
            editor.on('SetContent', () => {
              this.editorOnSetContent(editor);
              // Trigger cleanup after content is programmatically set
              this.cleanupHandler?.debouncedCleanup();
            });

            editor?.on('SelectionChange', () => {
              this.selectionRange = editor.selection.getRng();
              let baseNodeSelected = editor.selection.getStart(true);
              const allNodesSelected = [];
              while (baseNodeSelected.nodeName !== 'BODY') {
                allNodesSelected.push(baseNodeSelected);
                baseNodeSelected = baseNodeSelected.parentNode as Element;
              }
              this.selectedNodes = allNodesSelected;
            });

            editor?.on('keydown', event => {
              this.editorOnKeydown(event, editor, (this as any).maxLength);

              // Trigger cleanup check on destructive keys
              if (event.key === 'Backspace' || event.key === 'Delete') {
                this.cleanupHandler?.debouncedCleanup();
              }
            });

            // Trigger cleanup on input events
            editor?.on('input', () => {
              this.cleanupHandler?.debouncedCleanup();
            });

            // Capture paste data before TinyMCE processes it and extract styles
            editor?.on('paste', (e: any) => {
              this.pasteHandler.handlePasteEvent(e);
            });

            editor?.on('sc-mention-insert', (e: any) => {
              this.emit('sc-mention', {
                detail: {
                  added: { id: e.user.id, name: e.user.name },
                  mentions: this.mentionHandler?.getMentions() || [],
                },
              });
            });
          },
        });
      }

      editorOnInit(editor:Editor, props?: TinyMCEInitProps) {
        const { value, format, shortcut, readonly, extConfig } = props ?? { value: '' };
        const isReadonly = (this as any).readonly;
        const isDisabled = (this as any).disabled;
        if (isReadonly || isDisabled) {
          editor.mode.set('readonly');
        }

        if (isDisabled) {
          const doc = editor.getDoc();
          doc.documentElement.classList.add('sc-rte-disabled');
          doc.body.classList.add('sc-rte-disabled');
        }

        editor.setContent(value, { format });
        CUSTOM_FORMATS.forEach((format: string) => {
          editor.formatter?.register(format, {
            block: format,
          });
        });
        this.editorInstance = editor;

        if (shortcut) {
          const commands = Object.values(editorCommands);
          commands.forEach(command => {
            const { keys, handler } = command;
            if (keys) {
              editor.addShortcut(keys, '', () => handler(editor));
            }
          });
        }

        // Only initialize viewport handler if no height management is active
        const hasCustomHeight = extConfig?.height !== undefined;
        const useAutoresize =
          (extConfig?.min_height || extConfig?.max_height) &&
          !extConfig?.height;

        // Only use our custom viewport handler if no built-in
        // height management (fixed height or autoresize) is active
        if (
          !readonly &&
          !hasCustomHeight && // Not fixed height
          !useAutoresize && // Not using autoresize plugin
          (this as any).enableViewportResizing !== false
        ) {
          // Dynamic resizing mode: Initialize viewport handler for auto-adjusting editor height
          setTimeout(() => {
            if (this.tinyMCEContainer) {
              this.viewportHandler = new RteViewportHandler();
              this.viewportHandler.initialize(
                editor,
                this.tinyMCEContainer,
                undefined
              );
            } else {
              console.warn('No tinyMCEContainer found for viewport handler');
            }
          }, 300);
        } else if (hasCustomHeight) {
          // Fixed height mode - force the exact height
          setTimeout(() => {
            if (this.tinyMCEContainer && editor.iframeElement) {
              const customHeight = extConfig.height;
              const heightValue =
                typeof customHeight === 'string'
                  ? customHeight
                  : `${customHeight}px`;

              // Force container to exact height
              this.tinyMCEContainer.style.height = heightValue;
              this.tinyMCEContainer.style.minHeight = heightValue;
              this.tinyMCEContainer.style.maxHeight = heightValue;

              // Measure the container's padding and border
              const style = window.getComputedStyle(this.tinyMCEContainer);
              const paddingTop = parseFloat(style.paddingTop) || 0;
              const paddingBottom = parseFloat(style.paddingBottom) || 0;
              const borderTop = parseFloat(style.borderTopWidth) || 0;
              const borderBottom = parseFloat(style.borderBottomWidth) || 0;

              // Subtract all vertical spacing (padding + borders)
              const totalVerticalDeduction = paddingTop + paddingBottom + borderTop + borderBottom;

              // Set iframe height = requested height - total vertical space
              const iframeHeight = `calc(${heightValue} - ${totalVerticalDeduction}px)`;

              const iframe = editor.iframeElement;
              iframe.style.height = iframeHeight;
              iframe.style.minHeight = iframeHeight;
              iframe.style.maxHeight = iframeHeight;
            }
          }, 100);
        }
        // Fixed height mode: If hasCustomHeight is true, skip viewport handler initialization
      }

      editorOnNodeChange(event: EditorEvent<any>) {
        const tagName = event.element.tagName.toLowerCase();
        if (tagName in ELEMENT_CLASSES) {
          event.element.classList.add(...ELEMENT_CLASSES[tagName]);
        }
      }

      editorOnKeydown(event: KeyboardEvent, editor: Editor, maxLength?: number) {
        if (maxLength) {
          const allowedKeys = [
            'Backspace',
            'Delete',
            'ArrowLeft',
            'ArrowUp',
            'ArrowRight',
            'ArrowDown',
          ]; // backspace, delete and cursor keys
          const characterCount =
            editor.plugins.wordcount.body.getCharacterCount();
          const exceededMaxCharacterCount = maxLength <= characterCount;
          const isKeyAllowed = allowedKeys.indexOf(event.key) !== -1;
          if (!isKeyAllowed && exceededMaxCharacterCount) {
            const selectedText =
              editor.selection.getContent({ format: 'text' }) || '';
            if (selectedText.length === 0) {
              event.preventDefault();
              event.stopPropagation();
              return false;
            }
          }
        }
      }

      editorOnSetContent(editor: Editor) {
        const body = editor.getBody();
        Object.entries(ELEMENT_CLASSES).forEach(([tag, classes]) => {
          const elements = body.querySelectorAll(tag);
          elements.forEach((el:Element) => el.classList.add(...classes));
        });
      }

      getSemanticHtml() {
        return this.editorInstance
          ?.getContent()
          .replace(/^<!--\?lit[^-]+-->/, '');
      }

      moveCursorToEnd() {
        if (this.editorInstance && !this.editorInstance.removed) {
          // Select the entire editor body, which moves the cursor to the end.
          this.editorInstance.selection.select(
            this.editorInstance.getBody(),
            true
          );
          // Collapse the selection to a single caret at that end point.
          this.editorInstance.selection.collapse(false);
          this.editorInstance.focus();
        }
      }

      getMentionedUsers(): { id: string; name: string }[] {
        return this.mentionHandler?.getMentions() || [];
      }

      _cleanupInstance() {
        // Clean up viewport handler
        if (this.viewportHandler) {
          this.viewportHandler.destroy();
          this.viewportHandler = null;
        }

        // Clean up the cleanup handler
        if (this.cleanupHandler) {
          this.cleanupHandler.destroy();
          this.cleanupHandler = null;
        }

        // Clean up the brand handler
        if (this.brandHandler) {
          this.brandHandler.destroy();
        }

        // Clean up the mention handler
        if (this.mentionHandler) {
          this.mentionHandler.destroy();
          this.mentionHandler = null;
        }

        if (this.emailHandler) {
          this.emailHandler.destroy();
          this.emailHandler = undefined;
        }

        this.listHandler?.destroy();
        this.listHandler = undefined;

        // Clean up the specific TinyMCE instance to prevent conflicts with other editors
        if (this.editorInstance) {
          try {
            // Only destroy if the editor instance still exists and hasn't been removed
            if (!this.editorInstance.removed) {
              this.editorInstance.destroy();
            }
          } catch (error) {
            // Log warning but don't throw to avoid breaking the unmount process
            console.warn('Error cleaning up TinyMCE editor instance:', error);
          }
          // Always clear the reference
          this.editorInstance = null;
        }

        // Remove the editor from TinyMCE's global registry by ID
        if (this.editorId) {
          try {
            const tinymce = this._getTinyMCE();
            const hasGet = typeof tinymce?.get === 'function';
            const hasRemove = typeof tinymce?.remove === 'function';

            // Only use global registry APIs when available in runtime/mocks.
            if (hasGet && hasRemove && tinymce.get(this.editorId)) {
              tinymce.remove(`#${this.editorId}`);
            }
          } catch (error) {
            // Log warning but continue cleanup
            console.warn(
              `Error destroying TinyMCE instance ${this.editorId}:`,
              error
            );
          } finally {
            // Always clear the reference to prevent memory leaks
            this.editorInstance = null;
          }
        }

        // Clean up paste handler resources
        this.pasteHandler.clearExcelStyles();
      }

      connectedCallback() {
        super.connectedCallback();

        this._obsrvr.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        });
      }

      // Enhanced disconnectedCallback to fix editor conflicts
      disconnectedCallback(): void {
        this._cleanupInstance();
        // Call parent cleanup method
        super.disconnectedCallback();
        this._obsrvr.disconnect();
      }

      _obsrvr = new MutationObserver(debounce(list => {
        for (const mutation of list) {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'class'
          ) {
            this._syncColorMode();
          }
        }
      }, 50));
      _syncColorMode = debounce((editor?:Editor) => {
        const doc = (editor ?? this.editorInstance)?.getDoc()?.documentElement;
        if (!doc) return;
        const styles = window.getComputedStyle(this);
        const value =
          styles.getPropertyValue('--sc-mode') ===
          'dark';
        doc.classList.toggle('sc-mode-dark', value);

        for (const prop of styles) {
          if (prop.startsWith('--sc-rich-text-editor-'))
            doc.style.setProperty(prop, styles.getPropertyValue(prop).trim());
        }
      }, 50);
    }
    return Mixin;
  }
);
