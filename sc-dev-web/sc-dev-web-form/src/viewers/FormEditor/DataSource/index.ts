import { html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { modalStyle } from '../style.js';
import { FormDefinition } from '../../../models/FormDefinition.js';
import { DataSource } from '../../../models/DataSource.js';
import { formContext } from '../../contexts/form-context.js';
import { ListCardItem } from '../common/ListCardItem.js';
import { DeleteModal } from '../common/DeleteModal.js';
import './CreateDataSource.js';
import './TestAPI.js';
import ScElement from '../../utils/sc-element.js';
import type { ParsedDataType, ParsedSheetDataType } from './types.js';

export default class FormDataSource extends ScElement {
  static styles = [
    modalStyle,
    css`
      .data-link {
        display: flex;
        margin: 1rem 0;
      }
      .data-name {
        flex: 1;
      }
      .add-link {
        margin-top: 2rem;
      }
      .data-list {
        display: flex;
      }
      .row {
        margin: 1rem 0;
      }
      .modal-create-data-source {
        padding: 0 0.5rem;
        height: 25.937rem;
      }
    `,
  ];
  
  // @ts-ignore
  @consume({ context: formContext, subscribe: true })
  @property({ attribute: false }) 
    formDefinition: FormDefinition;

  @property({ type: Array }) data: DataSource[] = [];

  @state() showModal = false;

  @state() showDeleteModal = false;

  @state() step = 1;

  @state() selectedSourceType: string;

  @state() sourceName: string;

  @state() APINameSpace: string;

  @state() APINameSpaceId: string;

  @state() APINameSpaceName = '';

  @state() APINameSpaceLabel = '';

  @state() APIType = '';

  @state() APIQueryName: string;

  @state() APIQueryNameLabel = '';

  @state() APIEndpoint = '';

  @state() APIEndpointSummary = '';

  @state() APIMethod: string;

  @state() APIArguments: Array<string | null> = [null];

  @state() APIFields: Array<string | null> = [null];

  @state() attachments: Array<string | null> | undefined = undefined;
  
  @state() editData: DataSource | undefined;

  @state() parsedData: ParsedDataType | undefined;

  @state() parsedDataTab: ParsedSheetDataType[] | undefined;

  @state() showErrorMessage = false;

  @state() errorMessageParameter = '';

  @state() onLoading = false;
  
  get isAPI() {
    return this.selectedSourceType === 'api';
  }

  get isExcel() {
    return this.selectedSourceType === 'excel';
  }

  get validate() {
    if (this.isAPI) {
      return this.sourceName && this.APINameSpace && this.APIQueryName;
    } else if (this.isExcel) {
      return this.sourceName && this.attachments && this.attachments.length;
    }
    return false;
  }

  onClose() {
    this.showModal = false;
    this.clear();
  }

  onSave() {
    this.data = this.data || [];
    const newData = DataSource.from({
      type: this.isAPI ? 'api' : this.selectedSourceType,
      apiType: this.isAPI ? this.APIType : undefined,
      name: this.sourceName,
      apiNameSpace: this.isAPI ? this.APINameSpace : undefined,
      apiNameSpaceId: this.isAPI ? this.APINameSpaceId : undefined,
      apiNameSpaceName: this.isAPI
        ? (this.APINameSpaceName || this.APINameSpace || this.APINameSpaceId)
        : undefined,
      apiNameSpaceLabel: this.isAPI ? this.APINameSpaceLabel : undefined,
      apiQueryName: this.isAPI ? this.APIQueryName : undefined,
      apiQueryNameLabel: this.isAPI
        ? (this.APIQueryNameLabel || this.APIEndpointSummary || this.APIQueryName)
        : undefined,
      apiEndpoint: this.isAPI ? this.APIEndpoint : undefined,
      apiEndpointSummary: this.isAPI ? this.APIEndpointSummary : undefined,
      apiMethod: this.isAPI ? this.APIMethod : undefined,
      apiArguments: this.isAPI ? this.APIArguments?.filter(Boolean) : undefined,
      apiFields: this.isAPI && this.APIType !== 'process' ? (this.APIFields?.filter(Boolean) || undefined) : undefined,
      showErrorMessage: this.isAPI ? this.showErrorMessage : undefined,
      errorMessageParameter: this.isAPI ? this.errorMessageParameter : undefined,
      attachments: this.isExcel ? this.attachments : undefined,
      parsedData: this.isExcel ? this.parsedData : undefined,
      parsedDataTab: this.isExcel ? this.parsedDataTab : undefined,
    });
    if (this.editData) {
      const index = this.data.findIndex(d => d.id === (this.editData as DataSource).id);
      if (index > -1) {
        this.data[index] = newData;
      } else {
        this.data.push(newData);
      }
    } else {
      this.data.push(newData);
    }
    this.showModal = false;
    this.clear();
    this.updateForm(this.data);
    this.requestUpdate();
    this.emit('data-added', {
      detail: {
        data: this.data,
      },
    });
  }

  updateForm = (data: DataSource[]) => {
    this.formDefinition.updateDataSource(data);

    this.emit('form-updated', {
      composed: true,
      bubbles: true,
      detail: {
        definition: this.formDefinition,
      },
    });
  };

  clear() {
    this.sourceName = '';
    this.selectedSourceType = '';
    this.APINameSpace = '';
    this.APINameSpaceId = '';
    this.APINameSpaceName = '';
    this.APINameSpaceLabel = '';
    this.APIType = '';
    this.APIQueryName = '';
    this.APIQueryNameLabel = '';
    this.APIEndpoint = '';
    this.APIEndpointSummary = '';
    this.APIMethod = '';
    this.APIArguments = [null];
    this.APIFields = [null];
    this.attachments = undefined;
    this.parsedData = undefined;
    this.step = 1;
    this.editData = undefined;
  }

  resetAPIConfigValues() {
    this.APINameSpace = '';
    this.APINameSpaceId = '';
    this.APINameSpaceName = '';
    this.APINameSpaceLabel = '';
    this.APIType = '';
    this.APIQueryName = '';
    this.APIQueryNameLabel = '';
    this.APIEndpoint = '';
    this.APIEndpointSummary = '';
    this.APIMethod = '';
    this.APIArguments = [null];
    this.APIFields = [null];
    this.showErrorMessage = false;
    this.errorMessageParameter = '';
  }

  onCreateDataSourceValueChanged(event: CustomEvent) {
    const { type, value } = event.detail;
    if (type === 'selectedSourceType' && value !== this.selectedSourceType) {
      this.resetAPIConfigValues();
    }
    // @ts-ignore
    this[type] = value;
  }

  onSecondButtonClick(step:number) {
    if (step) {
      this.step = step;
    } else {
      this.step = 1;
    }
  }

  editDataSource = (data: DataSource) => {
    this.editData = data;
    const {
      type,
      apiType,
      name,
      apiNameSpace,
      apiNameSpaceId,
      apiNameSpaceName,
      apiNameSpaceLabel,
      apiQueryName,
      apiQueryNameLabel,
      apiEndpoint,
      apiEndpointSummary,
      apiMethod,
      apiArguments,
      apiFields,
      showErrorMessage,
      errorMessageParameter,
      attachments,
      parsedData,
      parsedDataTab,
    } = this.editData;
    this.selectedSourceType = type === 'api-process' ? 'api' : type;
    this.sourceName = name;
    this.APIType = apiType || (type === 'api-process' ? 'process' : type === 'api' ? 'exp' : '');
    this.APINameSpace = apiNameSpace;
    this.APINameSpaceId = apiNameSpaceId || '';
    this.APINameSpaceName = apiNameSpaceName || apiNameSpace || this.APINameSpaceId;
    this.APINameSpaceLabel = apiNameSpaceLabel || '';
    this.APIQueryName = apiQueryName;
    this.APIQueryNameLabel = apiQueryNameLabel || apiEndpointSummary || apiQueryName || '';
    this.APIEndpoint = apiEndpoint;
    this.APIEndpointSummary = apiEndpointSummary;
    this.APIMethod = apiMethod;
    this.APIArguments = apiArguments;
    this.APIFields = apiFields;
    this.showErrorMessage = showErrorMessage;
    this.errorMessageParameter = errorMessageParameter;
    this.attachments = attachments;
    this.parsedData = parsedData;
    this.parsedDataTab = parsedDataTab;
    this.showModal = true;
  };

  deleteDataSource = (data: DataSource) => {
    this.editData = data;
    this.showDeleteModal = true;
  };

  onAction(action: string) {
    if (action === 'delete' && this.editData) {
      this.formDefinition.deleteDataSource(this.editData.id);
    }
    this.showDeleteModal = false;
  }

  render() {
    return html`
      <div class=row>
        ${
  this.data?.map((d: any, index: number) => {
    const iconType = d.type === 'excel' ? 'file-xlsx' : 'server';
    return html`
              ${ListCardItem(
    iconType, 
    d.name,
    [
      html`<div @click=${() => this.editDataSource(d)}>Edit</div>`,
      html`<div @click=${() => this.deleteDataSource(d)}>Delete</div>`,
    ],
    d.type === 'excel' ? 'excel' : 'api'
  )}
              ${index < this.data.length - 1 ? html`<sc-spacer size="04"></sc-spacer>` : nothing}
            `;
  })
}
        <div class=add-link>
          <sc-link @click=${(event: MouseEvent) => {
            event.preventDefault();
            this.showModal = true;
          }}>+ Add data source</sc-link>
        </div>
        ${
  this.showModal ? html`
            <sc-modal size=md open=${this.showModal} disable-outside-click
              @sc-hide=${() => { this.showModal = false; this.clear(); }} 
              header=${this.step === 2 ? 'Test response' : this.editData ? 'Edit data source' : 'New data source'}>
                <div class="modal-create-data-source">
              ${this.isAPI ? html`
              <div style="margin-left:0.5rem;">
                  <sc-stepper
                    direction=horizontal
                    mode=full
                    title-position=right
                  >
                    ${
                      ['Select', 'Test', 'Confirmation'].map((item, index) => (html`
                        <sc-step 
                          ?disabled=${this.step !== (index + 1)} 
                          ?active=${this.step === (index + 1)} 
                          status=${this.step > (index + 1) ? 'finish' : ''}
                          show-description=${true}
                          title=${item}
                        ></sc-step>
                      `))
                    }
                  </sc-stepper>
                </div>
                ` : nothing}
                <div style=" padding-top:1rem;">
                  <create-data-source
                    .readonly=${this.step === 3}
                    .editData=${this.editData}
                    style='display: ${this.step === 2 ? 'none' : 'block'}'
                    source-type=${this.selectedSourceType}
                    source-name=${this.sourceName}
                    .APINameSpace=${this.APINameSpace}
                    .APINameSpaceId=${this.APINameSpaceId}
                    .APINameSpaceName=${this.APINameSpaceName}
                    .APINameSpaceLabel=${this.APINameSpaceLabel}
                    .APIType=${this.APIType}
                    .APIQueryName=${this.APIQueryName}
                    .APIQueryNameLabel=${this.APIQueryNameLabel}
                    .APIEndpoint=${this.APIEndpoint}
                    .APIEndpointSummary=${this.APIEndpointSummary}
                    .APIArguments=${this.APIArguments}
                    .APIFields=${this.APIFields}
                    .showErrorMessage=${this.showErrorMessage}
                    .errorMessageParameter=${this.errorMessageParameter}
                    .attachments=${this.attachments}
                    .data=${this.parsedData}
                    .tabsData=${this.parsedDataTab}
                    @value-changed=${this.onCreateDataSourceValueChanged}
                    @on-loading=${
                      (e: CustomEvent) => this.onLoading = e.detail.value
                    }
                  ></create-data-source>
                  <test-api
                    style='display: ${
                      this.step === 2 && this.selectedSourceType === 'api'
                        ? 'block' : 'none'
                    }'
                    source-type=${this.selectedSourceType}
                    api-type=${this.APIType}
                    method=${this.APIMethod}
                    namespace=${this.APINameSpace}
                    name=${this.APIQueryName}
                    endpoint=${this.APIEndpoint}
                    .arguments=${this.APIArguments?.[0] ? this.APIArguments : []}
                    .fields=${this.APIFields?.[0] ? this.APIFields : []}
                    .errorMessageParameter=${this.errorMessageParameter}
                    .showErrorMessage=${this.showErrorMessage}
                  ></test-api>
                </div></div>
              <div class=footer-button slot=footer style=" display:flex; gap: 0.5rem;">
                ${ this.isExcel ? html`
                  <sc-button size=sm type=secondary @click=${this.onClose} width=6.25rem>Cancel</sc-button>
                  <sc-button
                    size=sm
                    ?disabled=${!this.validate || this.onLoading}
                    @click=${this.onSave}
                    width=6.25rem
                  >Save</sc-button>
                ` : nothing }
                ${ this.isAPI ?
    this.step === 1 ? html`
                <sc-button size=sm type=secondary @click=${this.onClose} width=6.25rem>Cancel</sc-button>
                <sc-button
                  size=sm
                  ?disabled=${!this.validate}
                  @click=${() => this.onSecondButtonClick(2)}
                  width=6.25rem
                >Next</sc-button>
                `
      : this.step === 2 ? html`
                <sc-button
                  size=sm
                  type=secondary
                  ?disabled=${!this.validate}
                  @click=${() => this.onSecondButtonClick(1)}
                  width=6.25rem
                >Previous</sc-button>
                <sc-button
                  size=sm
                  ?disabled=${!this.validate}
                  @click=${() => this.onSecondButtonClick(3)}
                  width=6.25rem
                >Next</sc-button>` 
        : html`
                <sc-button
                  size=sm
                  type=secondary
                  @click=${() => this.onSecondButtonClick(2)}
                  width=6.25rem
                >Previous</sc-button>
                <sc-button
                  size=sm
                  ?disabled=${!this.validate || this.onLoading}
                  @click=${this.onSave}
                  width=6.25rem
                >Save</sc-button>
                ` : nothing}
                
                
                </div>
            </sc-modal>
          ` : nothing
}
        ${
  this.showDeleteModal
    ? DeleteModal('data source', () => this.onAction('delete'), () => this.onAction('cancel'))
    : nothing
}
      </div>
    `;
  }
}

if (!window.customElements.get('form-data-source')) {
  window.customElements.define('form-data-source', FormDataSource);
}