import { html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { watch } from '../../shared/watch.js';
import { ScRichTextEditorStyle } from './styles/ScRichTextEditorV2.style.js';
import { activeInputStyle,focusInputStyle,formGroupStyle } from './styles/FormInput.style.js';
import {
  defaultToolbar,
  editorCommands,
  htmlDiff,
  Revision,
} from './utils.js';
import { ExtConfig, TConfiguration } from '../ScRichTextEditor/typeUtils.js';
import './ScRteToolbarV2.js';
import './ScRteRevisionHistory.js';
import './ScRteRevisionItem.js';
import './ScRteAskAIModal.js';
import './ScRteFullscreenModal.js';

import { INTERNAL_EVENTS } from '../../shared/sc-custom-events.js';
import { html as shtml, unsafeStatic } from 'lit/static-html.js';
import { RteTinyMCEWrapperMixin, TinyMCEInitProps } from '../ScRichTextEditor/mixins/rte-tinymce-mixin.js';
import { EditorManager, Editor } from 'hugerte';
import { CustomToolbarButton } from './CustomToolbarButton.js';
import { ScRteBase } from './ScRichTextEditorBase.js';
import {
  injectScrollbarStyles,
  ScrollbarSize,
} from './styles/tinymce-scrollbar.style.js';
import { debounce } from '../../shared/debounce.js';

type ToolbarDetail = { namespace: string; args: Array<any> };
type RevisionDetail = { revision: Revision | null };

export class ScRichTextEditorV2 extends RteTinyMCEWrapperMixin(ScRteBase) {
  @property({ type: String, attribute: 'value' }) value: string;
  @property({ type: Boolean }) shortcut = false;
  @property({ type: Boolean, attribute: 'disable-spellcheck' }) disableSpellcheck = false;
  @property({ type: Boolean, attribute: 'show-count' }) showCount = false;
  @property({ type: Boolean, attribute: 'enable-fullscreen' }) enableFullscreen = false;
  @property({ type: Number, attribute: 'max-length' }) maxLength = Infinity;
  @property({ type: Object, attribute: 'configuration' })
    configuration: TConfiguration = {
      toolbar: {
        maxImageSize: 1024,
      },
    };
  @property({ type: Array }) revisions: Revision[] = [];
  @property({ type: Array }) toolbar: (typeof defaultToolbar)[number][] = [...defaultToolbar];
  @property({ type: Array }) customToolbarButtons: CustomToolbarButton[] = [];
  @property({ type: Object, attribute: 'ext-config' }) extConfig?: ExtConfig;
  @property({ type: String, attribute: 'ai-model' }) aiModel = 'YODA';
  @property({ type: String, attribute: 'ai-prompt' }) aiPrompt = '';
  @property({ type: String, attribute: 'ai-request-type' }) aiRequestType: 'model' | 'inline' = 'model';
  @property({ type: String, attribute: 'ai-insert-type' }) aiInsertType: 'replace' | 'insert-below' = 'replace';
  @property({ type: String }) placeholder = '';
  @property({ type: String, attribute: 'scrollbar-size' })
    scrollbarSize: ScrollbarSize | '' = 'sm';
  @property({ type: Boolean, attribute: 'scrollbar-opaque' })
    scrollbarOpaque = false;
  @property({ type: Boolean, attribute: 'scrollbar-always-visible' })
    scrollbarAlwaysVisible = false;
  @property({ type: Object, attribute: 'valid-styles' })
    validStyles?: Record<string, string>;
  @property({ type: String }) format: 'html' | 'md' = 'html';

  @query('.sc-rte-container') container: HTMLDivElement;

  @state() private _aiPrompt = '';
  @state() private _showRevisions = false;
  @state() private _showAskAi = false;
  @state() private _selectedRevision: Revision | null;
  @state() private _draftValue: string;
  @state() private _showSnackbar = false;
  @state() private _snackbarMessage = '';
  @state() private _snackbarType: 'info' | 'error' | 'success' = 'info';
  @state() private _showFullScreen = false;
  @state() private _fullScreenContent = '';

  private showSnackbarNotification(message: string, type: 'info' | 'error' | 'success' = 'info') {
    this._snackbarMessage = message;
    this._snackbarType = type;
    this._showSnackbar = true;
  }

  // internal flag to track if value updates are from user typing
  private _isInternalUpdate = false;

  /**
   * Sanitizes input HTML to fix malformed data URIs for images (missing MIME types)
   * This ensures images display correctly even if image is malformed data
   */
  private _sanitizeInputValue(inputValue: string): string {
    if (!inputValue) return '';

    let value = inputValue;

    // Remove existing data-mce-* attributes to prevent duplication issues
    // Handles double-quoted, single-quoted, unquoted, and valueless attribute forms
    value = value.replace(/<(?!\/)[a-z][^>]*>/gi, match =>
      match.replace(/\s+data-mce-[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'`=<>]+))?/gi, '')
    );
    
    // Fix malformed data URLs missing MIME types
    value = value.replace(
      /(<img[^>]*src="data:)(;base64,[^"]*")/gi,
      (match, p1_beforeMime, p2_afterMime) => {
        // Extract the base64 data to detect image type
        const base64Data = p2_afterMime.replace(';base64,', '');
        const header = base64Data.substring(0, 12);

        let mimeType = 'image/jpeg'; // Default fallback

        // Detect image type from base64 header
        if (header.startsWith('/9j/')) {
          mimeType = 'image/jpeg';
        } else if (header.startsWith('iVBORw0KGgo')) {
          mimeType = 'image/png';
        } else if (header.startsWith('R0lGOD')) {
          mimeType = 'image/gif';
        } else if (header.startsWith('UklGR')) {
          mimeType = 'image/webp';
        } else if (header.startsWith('Qk0')) {
          mimeType = 'image/bmp';
        }

        return `${p1_beforeMime}${mimeType}${p2_afterMime}`;
      }
    );
    return value;
  }

  get draggableBox() {
    return this.aiRequestType === 'model';
  }

  firstUpdated() {
    setTimeout(() => {
      this.initializeEditor();
    }, 0);
  }

  private initializeEditor() {
    // Sanitize the initial value to fix any malformed data URIs
    const sanitizedValue = this._sanitizeInputValue(this.value);

    this.initTinyMCE({
      value: sanitizedValue, // Use the sanitized value
      format: this.format,
      readonly: this.readonly,
      disabled: this.disabled,
      disableSpellcheck: this.disableSpellcheck,
      shortcut: this.shortcut,
      maxLength: this.maxLength,
      extConfig: this.extConfig,
      placeholder: this.placeholder,
      scrollbarSize: this.scrollbarSize,
      scrollbarOpaque: this.scrollbarOpaque,
      scrollbarAlwaysVisible: this.scrollbarAlwaysVisible,
      validStyles: this.validStyles,
    });
  }

  private ensureEditorIsReady() {
    const target = this.renderRoot?.querySelector(`#${this.editorId}`);

    if (
      target?.isConnected &&
      (!this.editorInstance || this.editorInstance.removed)
    ) {
      console.warn('Main editor instance was unhealthy. Re-initializing.');
      this.initializeEditor();
    }
  }

  connectedCallback() {
    super.connectedCallback();

    // Schedule editor check after DOM updates
    this.updateComplete.then(() => {
      // Check if we need to reinitialize the editor
      setTimeout(() => {
        this.ensureEditorIsReady();
      }, 0);
    });
  }

  updateContent(e:CustomEvent) {
    if (this.editorInstance && e.detail?.content) {
      this._showAskAi = false;
      this._aiPrompt = '';
      this.editorInstance?.fire('SetContent');
    }
  }

  closeAskAIModal() {
    this._showAskAi = false;
    this._aiPrompt = '';
  }

  handleFullScreen() {
    this.ensureEditorIsReady();

    if (this.editorInstance && !this.readonly) {
      this._fullScreenContent = this.editorInstance.getContent({
        format: 'html',
      });
      this._showFullScreen = true;
    }
  }

  closeFullScreen() {
    this._showFullScreen = false;
    this._fullScreenContent = '';
  }

  updateFullScreenContent(event: CustomEvent) {
    this.ensureEditorIsReady();

    if (event.detail?.content !== undefined && this.editorInstance && !this.editorInstance.removed) {
      // Use internal update flag to prevent unnecessary re-renders
      this._isInternalUpdate = true;
      this.value = event.detail.content;
      this.editorInstance.setContent(event.detail.content);
      this.onChange(this.value);
      this._showFullScreen = false;
      this._fullScreenContent = '';

      // Reset flag after short delay
      setTimeout(() => {
        this.moveCursorToEnd();
        this._isInternalUpdate = false;
      }, 20);
    }
  }

  editorOnInit(editor: Editor, props: Partial<TinyMCEInitProps>) {
    super.editorOnInit(editor, props);

    this.requestUpdate();

    setTimeout(() => {
      if (this.value && this.editorInstance && !this.editorInstance.getContent()) {
        editor.setContent(this._sanitizeInputValue(this.value));
      }
    }, 100);

    // Listen for focus event
    editor.on('focus', () => {
      this._focus = true;
    });

    // Listen for blur event
    editor.on('blur', () => {
      this._focus = false;
    });

    // Listen for custom snackbar events
    editor.on('sc-show-snackbar', (e: any) => {
      const eventData = e.detail || e;
      this.showSnackbarNotification(eventData.message, eventData.type || 'info');
    });


    editor.on('ResizeEditor', this.handleResize.bind(this));

    // This handler synchronizes the component's state with the editor's content
    // and emits the sc-change event to fix formatting issues
    const handleContentChange = debounce((eventSource: string) => {
      const editor = this.editorInstance;
      if (editor) {
        this.value = editor.getContent({ format: 'html' });
        // Call onChange to emit sc-change event
        this.onChange(this.value);
      }
    }, 500);

    // Listen to user input events
    // Handle programmatic content updates (paste, undo, setContent calls)
    this.editorInstance?.on('input change SetContent', ({ type }) =>
      handleContentChange(type)
    );

    // Handle specific toolbar/formatting commands (bold, italic, colors, etc.)
    // This ensures toolbar actions emit sc-change events
    this.editorInstance?.on('ExecCommand', (e:any) => {
      const formattingCommands = [
        'foreColor',
        'backColor',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'subscript',
        'superscript',
        'removeFormat',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'insertUnorderedList',
        'insertOrderedList',
        'indent',
        'outdent',
      ];
      if (formattingCommands.includes(e.command)) {
        setTimeout(() => handleContentChange(`exec-command-${e.command}`), 0);
      }
    });
  }

  // @ts-ignore
  @watch('value')
  onValueChange() {
    if (!this.editorInstance) return;

    // skip resetting editor content if value change came from user typing
    if (this._isInternalUpdate) {
      this._isInternalUpdate = false;
      return;
    }

    // Only apply user activity guards if editor is editable
    if (!this.readonly && !this.disabled) {
      // Prevent setContent while user is actively typing
      if (this.editorInstance.hasFocus()) {
        return;
      }

      // // Check if in the middle of copy operation
      // if (
      //   this.editorInstance.selection &&
      //   !this.editorInstance.selection.isCollapsed()
      // ) {
      //   // Skip reset content if text is selected (likely copying)
      //   return;
      // }
    }

    // Sanitize value before setting to fix malformed data URIs
    const sanitizedValue = this._sanitizeInputValue(this.value);

    if (this._showRevisions && this._selectedRevision) {
      this.selectRevision(this._selectedRevision);
    } else {
      const editorContent = this.editorInstance.getContent();

      // Only update if the sanitized content is actually different
      if (sanitizedValue !== editorContent) {
        // Only preserve bookmarks (cursor) if the editor is editable
        const bookmark =
          this.readonly || this.disabled
            ? null
            : this.editorInstance.selection.getBookmark(2, true);
        this.editorInstance.setContent(sanitizedValue, { format: this.format }); // Use sanitized value
        if (bookmark) {
          this.editorInstance.selection.moveToBookmark(bookmark);
        }
      }
    }
  }

// @ts-ignore
@watch('placeholder')
  onPlaceholderChange() {
    if (!this.hasUpdated) return;

    if (this.editorInstance && !this.editorInstance.removed) {
    // Update via options API
      this.editorInstance.options.set('placeholder', this.placeholder);

      // Directly update the body's data-mce-placeholder attribute
      const body = this.editorInstance.getBody();
      if (body) {
        body.setAttribute('data-mce-placeholder', this.placeholder);
      }

      // Force refresh if content is empty
      const content = this.editorInstance.getContent({ format: 'text' }).trim();
      if (content === '') {
        this.editorInstance.fire('blur');
      }
    }
  }

  // @ts-ignore
  @watch('maxLength')
onMaxLengthChange() {
  (this as any).pasteHandler?.setMaxLength(this.maxLength, this.editorInstance);
}

  // @ts-ignore
  @watch(['scrollbarSize', 'scrollbarOpaque', 'scrollbarAlwaysVisible'])
  onScrollbarConfigChange() {
    if (
      this.hasUpdated &&
      this.editorInstance &&
      !this.editorInstance.removed
    ) {
      // Update the style tag inside the existing iframe
      injectScrollbarStyles(this.editorInstance, {
        size: this.scrollbarSize || 'default',
        opaque: this.scrollbarOpaque,
        alwaysVisible: this.scrollbarAlwaysVisible,
      });
    }
  }

  // @ts-ignore
  @watch('extConfig')
  onExtConfigChange(oldValue?: EditorManager['defaultOptions']) {
    // Guard against firing on first update
    if (!this.hasUpdated) {
      return;
    }

    // Perform deep comparison to prevent unnecessary reinitialization
    if (JSON.stringify(oldValue) === JSON.stringify(this.extConfig)) {
      return;
    }

    // Config is genuinely different so re-initialize
    this.reinitialize();
  }
  @watch('format')
    reinitialize = debounce(() => {
      (this as any)._cleanupInstance();
      this.initializeEditor();
    }, 200);

  // @ts-ignore
  @watch(['readonly', '_showRevisions'])
  onShowRevisionsChange() {
    if (this._showRevisions) {
      this._draftValue =
        this.editorInstance?.getContent({ format: 'html' }) || '';
    }
    this.editorInstance?.mode.set(
      (this.readonly || this._showRevisions) ? 'readonly' : 'design'
    );
  }

  // @ts-ignore
  @watch(['disabled'])
  onDisabledChange() {
    if (this.editorInstance && !this.editorInstance.removed) {
      this.editorInstance?.mode.set(this.disabled ? 'readonly' : 'design');

      const doc = this.editorInstance.getDoc();
      if (this.disabled) {
        doc.documentElement.classList.add('sc-rte-disabled');
        doc.body.classList.add('sc-rte-disabled');
      } else {
        doc.documentElement.classList.remove('sc-rte-disabled');
        doc.body.classList.remove('sc-rte-disabled');
      }
    }
  }

  /*
        Overriden getStyles function from FormInputBase
        Uses light DOM query selector instead of shadowDOM query selector
    */
  // @ts-ignore
  @watch(['borderType', 'prefixIconSize'])
  getStyles() {
    const iconDefaultSize = 36;
    const scFormPaddingLeft = 12;
    const scFormPaddingRight = 12;
    const prefix = document!.querySelector('.sc-form-prefix-icon'); // eslint-disable-line
    const prefixDot = this.getPrefixDot(prefix);
    const suffix = document!.querySelector('.sc-form-more-icons'); // eslint-disable-line
    const tipIcon = document!.querySelector('.sc-form-group-icon'); // eslint-disable-line
    let paddingLeft = (prefix?.clientWidth || 0) + scFormPaddingLeft;
    // add padding left if has prefix dot for dropdown input
    if (prefixDot) { 
      paddingLeft = 25;
    }
    const tipWidth = tipIcon ? tipIcon.clientWidth || iconDefaultSize : 0;
    let paddingRight =
      (suffix?.clientWidth ?? 0) + tipWidth + scFormPaddingRight;
    const scFormControl: any = document!.querySelector(
      `.${this.formControlClsName}`
    ); // eslint-disable-line
    if (this.borderType === 'line' && !this.readonly) {
      paddingLeft = 0;
      paddingRight = 0;
    }
    if (scFormControl) {
      scFormControl.style['padding-left'] = `${paddingLeft}px`;
      scFormControl.style['padding-right'] = `${paddingRight}px`;
    }
  }

  handleResize() {
    const editor = this.editorInstance;
    if (!editor) return;
    const resize = editor.options.get('resize');
    if (resize === 'both') {
      // this.container.style.width = `${editor.editorContainer.clientWidth + 2}px`;
      let wpx = editor.editorContainer?.style?.width ?? this.style?.width;
      if (this._showRevisions) {
        const w =
          parseFloat(wpx) +
          8 +
          (this.shadowRoot?.querySelector('sc-rte-revision-history')
            ?.clientWidth || 0);
        wpx = `${w}px`;
      }
      this.container.style.width = wpx;
    }
    if (!!resize && !!editor.iframeElement)
      editor.iframeElement.style.height = `${
        editor.editorContainer.querySelector<HTMLDivElement>(
          '.tox-edit-area'
        )?.clientHeight
      }px`;
  }

  private _handleResizeRevision() {
    if (!this.editorInstance) return;
    const el = this.editorInstance.editorContainer;
    if (!this.container?.style.maxWidth) return;
    let w = this.container.clientWidth;
    if (this._showRevisions) {
      w -= 8 + (this.shadowRoot?.querySelector('sc-rte-revision-history')?.clientWidth || 0);
    }
    el.style.width = `${w}px`;
  }

  handleToolbarAction(event: CustomEvent<ToolbarDetail>) {
    const editorCommand = event.detail.namespace
      .replace('editor.', '')
      .toLowerCase();
    const editorCommandArgs = event.detail.args;
    if (this.editorInstance) {
      switch (editorCommand) {
      case 'formatblock': {
        editorCommands[`${editorCommand}-${editorCommandArgs[0]}`].handler(
          this.editorInstance,
          editorCommandArgs
        );
        break;
      }
      case 'revisionhistory': {
        this._showRevisions = true;
        this.updateComplete.then(() => this._handleResizeRevision());
        break;
      }
      case 'custom': {
        break;
      }
      case 'aishortcuts':
      case 'askai': {
        if (editorCommand === 'aishortcuts') {
          const { prompt = '' } = JSON.parse(editorCommandArgs[0].data);
          this._aiPrompt = prompt;
        }
        else {
          this._aiPrompt = this.aiPrompt;
        }
        this._showAskAi = true;
        break;
      }
      default: {
        editorCommands[editorCommand].handler(
          this.editorInstance,
          editorCommandArgs
        );
        break;
      }
      }
    }
  }


  selectRevision(revision: Revision | null) {
    this._selectedRevision = revision;
    if (!this.editorInstance) return;
    const editor = this.editorInstance;
    editor.undoManager.ignore(()=>{
      if (revision) {
        editor.setContent(revision.content);
        const res = htmlDiff(this._draftValue, editor.getContent({ format: 'html' }));
        editor.setContent(res);
      } else {
        editor.setContent(this._draftValue);
      }
    });
  }
  clearRevision() {
    this._selectedRevision = null;
    this.editorInstance?.undoManager.ignore(()=>{
      this.editorInstance?.setContent(this._draftValue);
    });
    this._draftValue = '';
  }
  cancelRevision() {
    this._showRevisions = false;
    this._handleResizeRevision();
    this.clearRevision();
  }
  applyRevision() {
    if (this._selectedRevision) {
      this.value = this._selectedRevision?.content;
    }
    this._showRevisions = false;
    this._selectedRevision = null;
  }
  /*
        Overriden renderInputStyle function from FormInputBase
        Added ScRichTextEditor style on the html return
    */
  renderInputStyle() {
    return html`
      ${ScRichTextEditorStyle} ${formGroupStyle}
      ${this._active && !this.disabled ? activeInputStyle : ''}
      ${this._focus && !this.disabled ? focusInputStyle : ''}
    `;
  }

  /*
        Overriden observePrefixIconSize
        Removed usage for this component
    */
  observePrefixIconSize() {
    // no-op
  }

  renderDescription() {
    if (this.maxLength && this.showCount && !this.readonly) {
      const characterCount = this.editorInstance?.plugins.wordcount.body.getCharacterCount();
      return html`
        <div class="character-count">
          ${characterCount} / ${this.maxLength}
        </div>
      `;
    }
    return null;
  }

  /*
        Overriden renderFormControl function from FormInputBase
        Renders the TinyMCE into the 'slot' element inside renderBaseFormInput();
    */
  renderFormControl() {
    return html`
      <div
        id=${this.editorId}
        part="form-control"
      ></div>
    `;
  }

  renderToolbar() {
    const contextTriggerEvent = unsafeStatic(
      INTERNAL_EVENTS['sc-context-trigger']
    );
    return shtml`<sc-rte-toolbar-v2
      .configuration=${this.configuration}
      .range=${this.selectionRange}
      .selectedNodes=${this.selectedNodes}
      .toolbar=${this.toolbar}
      .customToolbarButtons=${this.customToolbarButtons}
      .replace=${this._showRevisions}
      .disabled=${this.disabled}
      .editorInstance=${this.editorInstance}
      @${contextTriggerEvent}=${this.handleToolbarAction}
    >
      ${this.renderRevisionBar()}
    </sc-rte-toolbar-v2>`;
  }

  renderRevisionBar() {
    return html`<div class="sc-rte-revision-bar" slot="replace">
      <sc-button type="secondary" @click=${this.cancelRevision}>Cancel</sc-button>
      <sc-button type="primary" @click=${this.applyRevision}>Restore</sc-button>
    </div>`;
  }

  renderLabel() {
    if (!this.label && !this.tooltip) return null;
    return html`
      <div class="sc-form-group-label" id="label" part="label">
        ${this.label
    ? html`
              <sc-label
                label-size=${this.labelSize || this.size}
                label=${this.label}
                ?required=${this.required}
              ></sc-label>
            `
    : nothing}
        ${this.tooltip
    ? html`
              <div class="sc-label-tooltip">
                <sc-tooltip
                  trigger="hover"
                  placement="top"
                  hoist
                  .content=${this.tooltip}
                >
                  <sc-icon name="info-circle--line" size="xxs"></sc-icon>
                </sc-tooltip>
              </div>
            `
    : nothing}
      </div>
    `;
  }

  renderFullScreenLink() {
    if (!this.enableFullscreen || this.readonly || this.disabled) return null;

    return html`
      <div class="sc-rte-fullscreen-link">
        <sc-button
          type="link"
          state="default"
          size="xs"
          no-border
          left-icon="expand"
          @click=${this.handleFullScreen}
        >
          Full screen
        </sc-button>
      </div>
    `;
  }

  /**
   * Get the HTML content from the editor with Lit template comments removed
   * This provides clean semantic HTML for API consumption
   */
  getSemanticHtml(value?: string) {
    let content = value || this.editorInstance?.getContent() || '';

    // Remove Lit template comments
    content = content.replace(/^<!--\?lit[^-]+-->/, '');

    // Fix empty block elements: <p></p> becomes <p><br></p>
    content = content.replace(
      /<(p|h[1-6]|aside|section|div|td)([^>]*)>(\s*|&nbsp;)<\/\1>/gi,
      '<$1$2><br></$1>'
    );

    return content;
  }

  /**
   * Emits sc-change event when editor content changes
   * This is triggered by user input, formatting changes, and programmatic updates
   */
  onChange(value?: string) {
    setTimeout(() => {
      if (!this.editorInstance) return;
      let html: string | undefined;
      const getText = () => this.getSemanticHtml(value);

      const detail: Record<string, any> = {
        get text() {
          return html ??= getText();
        },
        mentions: this.getMentionedUsers(),
      };
      if (this.format === 'md') {
        Object.defineProperty(detail, 'md', {
          get: () => {
            return this.markdownPlugin?.getMarkdown() || '';
          },
          enumerable: true,
        });
      }
      this.emit('sc-change', { detail });
    }, 0);
  }

  render() {
    return html`
      ${ScRichTextEditorStyle}
      <div class="sc-rte-container">
        ${this.renderLabel()}
        ${!this.readonly && this.toolbar?.length ? this.renderToolbar() : null}
        ${this._showSnackbar
    ? html`<sc-snackbar
              .open=${true}
              type=${this._snackbarType}
              placement="top"
              duration="1500"
              @sc-hide=${() => {
    this._showSnackbar = false;
  }}
            >
              ${this._snackbarMessage}
            </sc-snackbar>`
    : nothing}
        <div class="sc-rte-content">
          ${this.renderBaseFormInput()}
          ${this._showRevisions
    ? html`<sc-rte-revision-history
                .revisions=${this.revisions}
                .selected=${this._selectedRevision}
                @sc-select=${(e: CustomEvent<RevisionDetail>) =>
    this.selectRevision(e.detail.revision)}
              ></sc-rte-revision-history>`
    : null}
        </div>
        ${this._showAskAi
    ? html`<sc-draggable-box
              class="sc-ai-draggable-box"
              z-index=${1400}
              .draggable=${this.draggableBox}
              .position=${{
    left: `${window.innerWidth / 2 - 400}px`,
    top: `${window.innerHeight / 2 - 100}px`,
  }}
            >
              <sc-rte-ask-ai-modal
                @sc-rte-ask-ai-update=${(e: CustomEvent) => {
    this.updateContent(e);
  }}
                @sc-rte-ask-ai-close=${() => {
    this.closeAskAIModal();
  }}
                .prompt=${this._aiPrompt}
                .editor=${this.editorInstance}
                ai-request-type=${this.aiRequestType}
                ai-insert-type=${this.aiInsertType}
                ai-model=${this.aiModel}
              ></sc-rte-ask-ai-modal>
            </sc-draggable-box>`
    : nothing}
        ${this.renderFullScreenLink()}
        ${this._showFullScreen
    ? html`<sc-rte-fullscreen-modal
              .open=${this._showFullScreen}
              .content=${this._fullScreenContent}
              .label=${this.label}
              .configuration=${this.configuration}
              .toolbar=${this.toolbar}
              .customToolbarButtons=${this.customToolbarButtons}
              .readonly=${this.readonly}
              .disabled=${this.disabled}
              .disableSpellcheck=${this.disableSpellcheck}
              .shortcut=${this.shortcut}
              .maxLength=${this.maxLength}
              .extConfig=${this.extConfig}
              @sc-action=${(e: CustomEvent) => {
    this.updateFullScreenContent(e);
  }}
              @sc-close=${() => {
    this.closeFullScreen();
  }}
            ></sc-rte-fullscreen-modal>`
    : nothing}
      </div>
    `;
  }
}
