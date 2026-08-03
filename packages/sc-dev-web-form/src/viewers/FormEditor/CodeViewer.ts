import { html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import ScElement from '../utils/sc-element.js';
import { watch } from '../utils/watch.js';

export class CodeViewer extends ScElement {

  static styles = css`
    :host {
      --sc-form-input-border: none;
      flex: 1;
    }
    .container {
      position: relative;
      padding: 1.25rem;
      padding-top: 2.187rem;

      &.no-padding {
        padding: 0;
      }
    }
    
    .action-container {
      position: absolute;
      top: 0.312rem;
      right: 1.375rem;
      display: flex;
      align-items: center;
      font-size: 0.875rem;
      cursor: pointer;
    }

    .action-container sc-label {
      width: 1.875rem;
    }

    .copy-icon {
      display: flex;
    }

    .copy-icon sc-icon {
      margin-right: 0.625rem;
    }

    sc-icon {
      cursor: pointer;
    }

    .download-icon {
      margin: 0 0.625rem;
    }

    sc-icon.save {
      color: var(--sc-form-designer-code-snippet-save-icon-color, var(--sc-color-green-500));
    }

    sc-text-input::part(input) {
      padding: var(--sc-form-input-padding-top, 0.5rem) var(--sc-form-input-padding-right, 0) var(--sc-form-input-padding-bottom, 0.5rem) var(--sc-form-input-padding-left, 0);
    }
  `;

  @property({ type: String }) codeSinppets: string;

  @property({ type: Boolean }) editable = false;

  @property({ type: Boolean, attribute: 'no-padding' }) noPadding = true;

  @state() editMode = 'edit';

  @state() errorMessage = '';
  
  @state() manifest = '';

  @state() rows = 17;

  @watch('codeSinppets')
  updateManifest() {
    this.manifest = this.codeSinppets;
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateRows();
    window.addEventListener('resize', this.updateRows);
  }

  updateRows = () => {
    this.rows = Math.floor((window.innerHeight - 260) / 24);
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.updateRows);
  }

  downloadConfig() {
    const dataStr = `data:text/json;charset=utf-8,${  encodeURIComponent(JSON.stringify(this.codeSinppets))}`;
    // @ts-ignore
    const dlAnchorElem = this.renderRoot?.getElementById('downloadAnchorElem');
    dlAnchorElem?.setAttribute('href',     dataStr);
    dlAnchorElem?.setAttribute('download', 'formdef.json');
    dlAnchorElem?.click();
  }

  saveChange() {
    if (this.manifest) {
      try {
        this.emit('manifest-changed', {
          detail: {
            value: JSON.parse(this.manifest),
          },
        });
        // this.editMode = 'readonly';        
        this.codeSinppets = this.manifest;
      } catch (error: any) {
        this.errorMessage = error;
      }
    }
  }

  editCode() {
    this.rows = Math.floor((window.innerHeight - 260) / 24);
    this.editMode = 'edit';
  }

  onManifestPaste(e: CustomEvent) {
    this.errorMessage = '';
    this.manifest = e.detail.value;
    this.saveChange();
  }

  render() {
    return html`
      ${this.errorMessage ? html`<sc-alert type="error" mode="default" title=${this.errorMessage} open></sc-alert>` : nothing}
      <div class="container ${this.noPadding ? 'no-padding' : ''}" >
        <div id='copy-el' style='display: none'><pre id=json><code>${JSON.stringify(JSON.parse(this.codeSinppets), null, 2)}</code></pre></div>
          <sc-text-input multiline rows=${this.rows}
            ?readonly=${!this.editable}
            .value=${JSON.stringify(JSON.parse(this.codeSinppets), null, 2) || ''}
            @sc-input=${this.onManifestPaste}
          ></sc-text-input>
        <div class='action-container'>
          <!-- ${this.editable && this.editMode === 'readonly' ? html`<sc-icon size=sm name=edit--line @click=${this.editCode}></sc-icon>` : nothing}
          ${this.editable && this.editMode === 'edit' ? html`<sc-icon class=save size=sm name=tick @click=${this.saveChange}></sc-icon>` : nothing} -->
          <sc-copy mode="default" from="copy-el">
            <div slot=label class=copy-icon>
              <sc-icon name=copy--line></sc-icon>
              Copy
            </div>
          </sc-copy>
          <a id="downloadAnchorElem" style="display:none"></a>
          <sc-icon class=download-icon @click=${this.downloadConfig} size="sm" name="download"></sc-icon>
          <div @click=${this.downloadConfig}>Download</div>
      </div>
      </div>
    `;
  }
}

if (!window.customElements.get('code-viewer')) {
  window.customElements.define('code-viewer', CodeViewer);
}