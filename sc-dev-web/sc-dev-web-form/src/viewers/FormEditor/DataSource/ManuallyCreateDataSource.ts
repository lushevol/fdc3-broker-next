import { html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import ScElement from '../../utils/sc-element.js';
import Style from '../../utils/common.style.js';
import type { ParameterType, ParsedDataType } from './types.js';

export default class ManuallyCreateDataSource extends ScElement {
  
  static styles = [
    css`
      ${Style}
      .parameter-item {
        display: flex;
      }
      .parameter-item sc-text-input {
        flex: 1;
      }
      .parameter-item sc-icon {
        cursor: pointer;
      }
      .parameter-item .add {
        color: var(--sc-color-blue-500);
        margin-left: 0.625rem;
      }
      .parameter-item .delete {
        color: var(--sc-color-red-500);
        margin-left: 0.625rem;
      }
      .spinner-container {
        width: 100%;
        text-align: center;
      }
    `,
  ];

  @property({ type: String, attribute: 'source-type' }) selectedSourceType: string;

  @property({ type: String, attribute: 'source-name' }) sourceName: string;

  @property({ type: String, attribute: 'api-name-space' }) APINameSpace: string;

  @property({ type: String, attribute: 'api-query-name' }) APIQueryName: string;

  @property({ type: String, attribute: 'api-method' }) APIMethod: string;

  @property({ type: Array, attribute: 'api-arguments' }) APIArguments: Array<ParameterType | null> = [null];

  @property({ type: Array, attribute: 'api-fields' }) APIFields: Array<string | null> = [null];

  @property({ type: Array }) attachments = undefined;

  @property({ type: Object }) data: ParsedDataType | undefined;

  @state() uploading = false;

  @state() errorMsg = '';

  get isValidated() {
    if (this.selectedSourceType === 'api') {
      return this.selectedSourceType && this.sourceName && this.APINameSpace && this.APIQueryName && this.APIMethod;
    }
    return false;
  }

  updated() {
    if (this.isValidated) {
      this.emit('api-fields-validated');
    }
  }

  onValueChanged(value: any, type: string) {
    this.emit('value-changed', {
      detail: {
        type,
        value,
      },
    });   
  }

  onArgumentsChange(value: ParameterType, index: number) {
    if (this.APIArguments?.length) {
      this.APIArguments[index] = value;
    } else {
      this.APIArguments = [value];
    }
    this.onValueChanged(this.APIArguments, 'APIArguments');
    this.requestUpdate();
  }

  onFieldsChange(event: CustomEvent, index: number) {
    const { value } = event.detail;
    if (this.APIFields?.length) {
      this.APIFields[index] = value;
    } else {
      this.APIFields = [value];
    }
    this.onValueChanged(this.APIFields, 'APIFields');
    this.requestUpdate();
  }

  addArgument() {
    if (this.APIArguments?.length === 0) {
      this.APIArguments.push(null);
    }
    this.APIArguments.push(null);
    this.requestUpdate();
  }

  deleteArgument(index: number) {
    this.APIArguments.splice(index, 1);
    this.onValueChanged(this.APIArguments, 'APIArguments');
    this.requestUpdate();
  }

  addField() {
    if (this.APIFields?.length === 0) {
      this.APIFields.push(null);
    }
    this.APIFields.push(null);
    this.requestUpdate();
  }

  deleteField(index: number) {
    this.APIFields.splice(index, 1);
    this.onValueChanged(this.APIFields, 'APIFields');
    this.requestUpdate();
  }

  renderAPIConfig() {
    return html`
      <div class=row>
        <sc-text-input required label='Name space' border-type=box value=${this.APINameSpace} @sc-input=${
  (event: CustomEvent) => { this.onValueChanged(event.detail.value, 'APINameSpace'); }
}></sc-text-input>
      </div>
      <div class=row>
        <sc-text-input required label='Query name' border-type=box value=${this.APIQueryName} @sc-input=${
  (event: CustomEvent) => { this.onValueChanged(event.detail.value, 'APIQueryName'); }
}></sc-text-input>
      </div>
      <div class=row>
        <sc-label label='Arguments'></sc-label>
        ${
  (this.APIArguments || [null]).map((parameter: ParameterType | null, index: number) => html`
            <div class=parameter-item>
              <sc-text-input value=${parameter?.value} border-type=box @sc-input=${(event: CustomEvent) => this.onArgumentsChange({ value: event.detail.value, type: parameter?.type || 'text' }, index)}></sc-text-input>
              <sc-icon class=add name=plus-circle--line @click=${this.addArgument}></sc-icon>
              ${(this.APIArguments || [null]).length === 1 ? nothing : html`<sc-icon class=delete name=minus-circle--line @click=${() => this.deleteArgument(index)}></sc-icon>`}
            </div>
            <sc-radio-group value=${parameter?.type} direction=horizontal @sc-change=${(event: CustomEvent) => this.onArgumentsChange({ value: parameter?.value || '', type: event.detail.value }, index)}>
              <sc-radio value=Int>Int</sc-radio>
              <sc-radio value=Boolean>Boolean</sc-radio>
              <sc-radio value=Object>Object</sc-radio>
            </sc-radio-group>
          `)
}
      </div>
      <div class=row>
        <sc-label label='Fields'></sc-label>
        ${
  (this.APIFields || [null]).map((field: string | null, index: number) => html`
            <div class=parameter-item>
              <sc-text-input value=${field} border-type=box placeholder='Use . to connect child field, e.g accounts.accountCurrency' @sc-input=${(event: CustomEvent) => this.onFieldsChange(event, index)}></sc-text-input>
              <sc-icon class=add name=plus-circle--line @click=${this.addField}></sc-icon>
              ${(this.APIFields || [null]).length === 1 ? nothing : html`<sc-icon class=delete name=minus-circle--line @click=${() => this.deleteField(index)}></sc-icon>`}
            <div>
          `)
}
      </div>
    `;
  }

  renderExcelConfig() {
    return html`
      <div class=row>
        ${this.renderFileUpload()}
      </div>
      <div style='margin-top: 1rem'>
        ${this.renderFileResult()}
      </div>
    `;
  }

  uploadFile = async (file: File) => {
    if (file) {
      this.uploading = true;
      this.loadingEmit(true);
      const fd = new FormData();
      fd.append('file', file);
      let response;
      try {
        response = await this._restClient.request(
          '55313-128-webkit-plugin-webkit-exp-api',
          'api/webkit/v1/excels',
          'POST',
          fd
        );
        const data = await response.json();
        if (data.properties) {
          this.data = {
            properties: data.properties,
            contents: data.contents.slice(0, 500),
          };
          this.onValueChanged(this.data, 'parsedData');
        }
        this.loadingEmit(false);
      } catch (error) {
        this.errorMsg = 'File upload failed';
        this.loadingEmit(true);
        return;
      }
      this.uploading = false;
    }
  };

  loadingEmit(value: boolean) {
    this.emit('on-loading', {
      detail: {
        value,
      },
    });
  }

  renderFileUpload() {
    return html`
      <sc-file-input 
        label=File 
        required
        deletable
        placeholder="Click or drop file here"
        .value=${this.attachments}
        accept='.xlsx'
        @sc-change=${(e: CustomEvent) => {
    this.data = undefined;
    const files = e.detail.value;
    this.uploadFile(files[0]);
    this.onValueChanged(files.map((file: any) => ({
      id: file.id,
      name: file.name,
    })), 'attachments');
  }}
      >
      </sc-file-input>
    `; 
  }

  renderFileResult() {
    if (this.attachments) {
      let tableConf, tableData;
      if (this.data) {
        const { properties, contents } = this.data;
        tableConf = Object.keys(properties).map((key: string) => ({
          property: key,
          header: properties[key],
        })) || [];
        tableData = contents || [];
      }
      // @ts-ignore
      return html`${tableData.length >= 500 ? html`<sc-alert type="warning" mode="banner" open>
          <div>
              Your file exceeds the 500-row limit. Only the first 500 rows will be saved.
            </div>
        </sc-alert>` : nothing}
        ${this.uploading && !this.data ? 
    html`<div class=spinner-container><sc-spinner type=component size=sm></sc-spinner></div>` : 
    html`<sc-data-grid .columns=${tableConf} .data=${tableData} pagination page-size=10></sc-data-grid>`
}
      `;
    }
    return nothing;
  }

  render() {
    return html`
      <div class=row>
        <sc-dropdown-input required hoist border-type=box label='Data source type' .value=${this.selectedSourceType} @sc-select=${
  (event: CustomEvent) => { 
    this.onValueChanged(event.detail.value, 'selectedSourceType');
  }          
}>
          <sc-dropdown-option value="api">API</sc-dropdown-option>
          <sc-dropdown-option value="excel">Excel</sc-dropdown-option>
        </sc-dropdown-input>
      </div>
      <div class=row>
        <sc-text-input required border-type=box label='Data source name' .value=${this.sourceName} @sc-input=${
  (event: CustomEvent) => { this.onValueChanged(event.detail.value, 'sourceName'); }     
}></sc-text-input>
      </div>
      ${
  this.selectedSourceType === 'api' ? this.renderAPIConfig() : 
    this.selectedSourceType === 'excel' ? this.renderExcelConfig() : nothing
}
      <sc-toast 
        type=error 
        .open=${!!this.errorMsg} 
        placement="top-right" 
        duration="3000" 
        title=${this.errorMsg}
        @sc-hide=${() => { this.errorMsg = ''; this.loadingEmit(false); }}
      ></sc-toast>
    `;
  }
}


if (!window.customElements.get('manually-create-data-source')) {
  window.customElements.define('manually-create-data-source', ManuallyCreateDataSource);
}