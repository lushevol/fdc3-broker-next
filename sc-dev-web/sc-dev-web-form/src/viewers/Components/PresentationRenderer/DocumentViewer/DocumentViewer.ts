import { html, nothing, PropertyValueMap, PropertyValues } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { state } from 'lit/decorators.js';

export class DocumentViewer extends FormBaseViewer {

  @state() _invalidFileErrorMessage = '';
  @state() _file:any;

  updated(properties: PropertyValues) {
    if (properties.has('component')) {
      this.getDocumentViewerValue();
      this.getUpdateFile();
      if (this._file) {
        this.emitFileStreamEvent(this._file);
      }
    } else if (properties.has('onValueChange')) {
      this.getUpdateFile();
    }
  }

  disconnectedCallback() {
    this._file = null;
  }
  
  onRemove = () => {
    this._file = undefined;
    this.requestUpdate();
  };

  emitFileStreamEvent(file: File) {
    if (!file?.name || !file?.type) return;
    const { name, type } = file;
    const stream = file.stream();
    const newEvent = new CustomEvent('file-stream', {
      detail: { value: { name, type, file: stream } },
      bubbles: true,
      composed: true,
    });
    if (this.mode !== 'edit') {
      this._onValueChange(newEvent);
    }
  }

  _onFileValueChange = (event: CustomEvent) => {
    if (event.detail.invalidFiles?.length) {
      this._invalidFileErrorMessage = event.detail.invalidFiles[0].extra;
    } else {
      this._invalidFileErrorMessage = '';
      const file = event.detail.value[0];
      this._file = file;
      this.emitFileStreamEvent(file);
      this.requestUpdate();
    }
  };

  getUpdateFile = async () => {
    if (this._file) return;
    const data = this.formData.filter(item => item.id === this.component.id)?.[0];
    if (data && data?.value?.file && !data?.value?.file?.locked) {
      const reader = data?.value?.file.getReader();
      const chunks = [];
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) chunks.push(value);
        }
      } finally {
        reader.releaseLock();
      }
      const blob = new Blob(chunks, { type: data?.value?.type });
      const file = new File([blob],  data?.value?.name, { type: data?.value?.type });
      this._file = file;
    }
  };

  renderElement() {
    const { 
      label, 
      labelSize,
      fileType, 
      readonly, 
      required, 
      tooltip, 
      helpText,
    } = this.template;
    return html`
    <div>
        <sc-label
          label=${label}
          label-size=${labelSize}
          tooltip=${tooltip}
          ?required=${required}
        ></sc-label>
        <div style="height: 400px;">
          <sc-doc-viewer
            .file=${this.documentViewerFile || this._file}
          ></sc-doc-viewer>
        </div>
        ${
          readonly || this.readonly ? nothing : html`
          <sc-file-input
            .accept=${fileType ? `.${fileType}` : ''}
            ?no-border=${true}
            ?deletable=${true}
            @sc-change=${this._onFileValueChange}
            @sc-remove=${this.onRemove}
            ?error=${this.invalid}
          ></sc-file-input>
          `
        }
        <sc-label>
          <div slot="label" >
            <div class="sc-label-wrapper">
              <div class="sc-label-text" style='font-size: 0.625rem'>${ unsafeHTML(helpText) }</div>
            </div>
          </div>
        </sc-label>
      </div>
    `;
  }
 
}