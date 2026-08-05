import { html, css, nothing, PropertyValues } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { EditorManager, Editor } from 'hugerte';
import ScElement from '../../shared/sc-rte-element.js';
import { RteTinyMCEWrapperMixin, TinyMCEInitProps } from './mixins/rte-tinymce-mixin.js';
import { TConfiguration } from './typeUtils.js';
import { defaultToolbar, editorCommands } from './utils.js';
import { CustomToolbarButton } from './CustomToolbarButton.js';
import { INTERNAL_EVENTS } from '../../shared/sc-custom-events.js';
import { html as shtml, unsafeStatic } from 'lit/static-html.js';
import './ScRteToolbarV2.js';

type ToolbarDetail = { namespace: string; args: Array<any> };

export class ScRteFullscreenModal extends RteTinyMCEWrapperMixin(ScElement) {
  static styles = css`
    .fullscreen-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      height: 100%;
    }

    .fullscreen-editor-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .fullscreen-editor-wrapper .sc-rich-text-editor {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--sc-color-grey-150);
    }

    .fullscreen-editor-wrapper .sc-rich-text-editor:hover {
      border-color: var(--sc-color-blue-500);
    }

    /* Header styling */
    sc-modal::part(header) {
      border-bottom: 1px solid var(--sc-color-grey-150);
    }

    .tox .tox-edit-area__iframe {
      background-color: transparent;
    }
  `;

  declare moveCursorToEnd: () => void;

  // Disable viewport handler in fullscreen mode
  enableViewportResizing = false;

  @property({ type: Boolean }) open = false;
  @property({ type: String }) content = '';
  @property({ type: Object }) configuration: TConfiguration = {
    toolbar: { maxImageSize: 1024 },
  };
  @property({ type: Array }) toolbar = defaultToolbar;
  @property({ type: Array }) customToolbarButtons: CustomToolbarButton[] = [];
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) disableSpellcheck = false;
  @property({ type: Boolean }) shortcut = false;
  @property({ type: Number }) maxLength = Infinity;
  @property({ type: Object }) extConfig: EditorManager['defaultOptions'];
  @property({ type: String }) label = '';
  @property({ type: String }) format: 'html' | 'md' = 'html';

  @state() private _fullscreenEditorId = '';

  willUpdate(changedProperties: PropertyValues<this>) {
    // If the modal is about to open, set the unique ID ahead of time
    if (changedProperties.has('open') && this.open) {
      this._fullscreenEditorId = `rte_fullscreen_${Date.now()}`;
    }
  }

  updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('open') && this.open) {
      this.initializeFullscreenEditor();
    }
  }

  editorOnInit(editor: Editor, props: Partial<TinyMCEInitProps>) {
    super.editorOnInit(editor, props);

    setTimeout(() => {
      this.moveCursorToEnd();
    }, 50);
  }

  private initializeFullscreenEditor() {
    // Query using the reactive property value.
    const targetElement = this.renderRoot?.querySelector(
      `#${this._fullscreenEditorId}`
    );

    if (targetElement) {
      // Set the mixin's editorId property before initializing.
      this.editorId = this._fullscreenEditorId;

      this.initTinyMCE({
        value: this.content,
        format: this.format,
        readonly: this.readonly,
        disabled: this.disabled,
        disableSpellcheck: this.disableSpellcheck,
        shortcut: this.shortcut,
        maxLength: this.maxLength,
        extConfig: {
          ...this.extConfig,
          resize: false,
          plugins: 'lists link table wordcount',
          content_style: `.mce-content-body { padding: 1rem; }
          `,
        },
      });
    } else {
      console.error('Could not find editor target even after update cycle.');
    }
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
      default: {
        if (editorCommands[editorCommand]) {
          editorCommands[editorCommand].handler(
            this.editorInstance,
            editorCommandArgs
          );
        }
        break;
      }
      }
    }
  }

  private destroyEditor() {
    if (this.editorInstance && !this.editorInstance.removed) {
      this.editorInstance.destroy();
      this.editorInstance = null;
    }
  }

  handleClose() {
    if (this.editorInstance) {
      const content = this.editorInstance.getContent({ format: 'html' });
      this.emit('sc-action', {
        detail: { content },
        bubbles: true,
        composed: true,
      });
    }
    // Clean up the editor instance EVERY time the modal closes.
    setTimeout(() => {
      this.destroyEditor();
    }, 0);
  }

  // Override disconnectedCallback to ensure proper cleanup
  disconnectedCallback() {
    this.destroyEditor();
    super.disconnectedCallback();
  }

  renderToolbar() {
    if (this.readonly || !this.toolbar?.length) return nothing;

    const contextTriggerEvent = unsafeStatic(
      INTERNAL_EVENTS['sc-context-trigger']
    );

    return shtml`<sc-rte-toolbar-v2
      .configuration=${this.configuration}
      .range=${this.selectionRange}
      .selectedNodes=${this.selectedNodes}
      .toolbar=${this.toolbar}
      .customToolbarButtons=${this.customToolbarButtons}
      .replace=${false}
      .editorInstance=${this.editorInstance}
      @${contextTriggerEvent}=${this.handleToolbarAction}
    ></sc-rte-toolbar-v2>`;
  }

  render() {
    return html`
      <sc-modal
        .open=${this.open}
        expanded-view
        no-footer
        size="lg"
        @sc-hide=${this.handleClose}
      >
        <div slot="header">${this.label}</div>

        <div class="fullscreen-container">
          ${this.renderToolbar()}

          <div class="fullscreen-editor-wrapper">
            <div id=${this._fullscreenEditorId} part="form-control"></div>
          </div>
        </div>
      </sc-modal>
    `;
  }
}
