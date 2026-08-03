import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { FormDefinition } from '../../../models/FormDefinition.js';
import { formContext } from '../../contexts/form-context.js';
// @ts-ignore
import GridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import { DataSource } from '../../../models/DataSource.js';
import { OptionConfig } from '../../../models/OptionConfig.js';
import Style from '../../utils/common.style.js';
import ScElement from '../../utils/sc-element.js';
import { Component } from '../../../models/Component.js';
import './DataSourceSelector.js';

export class DataSourceSelectorForOption extends ScElement {

  static styles = [Style, GridStyle];

  // @ts-ignore
  @consume({ context: formContext, subscribe: true })
  @state() 
    formDefinition: FormDefinition;
    
  @property({ type: Object }) config: OptionConfig = new OptionConfig();

  // @ts-ignore
  @property({ type: Object }) component: Component = {};

  @state() _selectedDataSource: DataSource | undefined = undefined;

  @property({ type: Array }) conf: {property: string; header: any;}[] | undefined;

  @property({ type: Array, attribute: 'bind-key' }) bindKey = [];

  @property({ type: Boolean, attribute: 'set-option' }) setOption = true;

  firstUpdated() {
    if (this.config) {
      const dataSources = this.formDefinition.getDataSources();
      let source;
      const { id } = this.config;
      if (dataSources && Array.isArray(dataSources)) {
        source = dataSources.find(d => d.id === id);
        if (source) {
          this._selectedDataSource = source;
        }
      }
    }
  }

  updateConfig(key: string, value: any) {
    this.emit('config-updated', {
      detail: {
        value,
        key,
      },
    });
    this.requestUpdate();
  }

  updateSelectedDataSource(event: CustomEvent) {
    const { value, key, selectedDataSource } = event.detail;
    this._selectedDataSource = selectedDataSource;
    this.emit('config-updated', {
      detail: {
        value,
        key,
      },
    });
  }

  tableTemplate() {
    if (this.conf) {
      const type = this._selectedDataSource?.type;
      const parsedData = this._selectedDataSource?.parsedData;
      // @ts-ignore
      const apiFields: any = this._selectedDataSource?.apiFields || [];
      const { keys = {}, type: _type } = this.config;
      if (!_type) {
        this.updateConfig('type', 'dataSource');
      }
      return this.conf.map((item, index) => html`
          <sc-grid-row style="${index > 0 ? 'margin-top: 1rem' : ''}">
            <sc-grid-column>
              <sc-dropdown-input
                label=${item.header} 
                hoist
                value=${//@ts-ignore 
  this.config?.keys?.[item?.property ?? ''] || ''
}
                @sc-select=${(event: CustomEvent) => {
    this.updateConfig('keys', {
      ...keys,
      [item.property]: event.detail.value,
    });
  }}
                .data=${
  (type === 'excel' ? Object.values(parsedData?.properties || {}) : apiFields)?.map((field: any) => {
    return  ({
      value: field,
      label: field,
    });
  })
}
              >
              </sc-dropdown-input>
            </sc-grid-column>
          </sc-grid-row>
        `);
    }
    
  }

  bindKeyTemplate() {
    const type = this._selectedDataSource?.type;
    const parsedData = this._selectedDataSource?.parsedData;
    // @ts-ignore
    const apiFields: any = this._selectedDataSource?.apiFields || [];
    const { keys = {} } = this.config;
    return this.bindKey && this.bindKey.length > 0 ? html`
      <sc-grid-row class="options-text">
        <sc-grid-column md="5"><sc-label label="Label" label-size="md"></sc-label></sc-grid-column>
        <sc-grid-column md="6"><sc-label label="Value" label-size="md"></sc-label></sc-grid-column>
      </sc-grid-row>
      ${
  this.bindKey.map((item: {label: string; key: string;}, index: number) =>  html`
          <sc-grid-row no-gutters style="${index > 0 ? 'margin-bottom: var(--sc-spacing-4);' : ''}" >
            <sc-grid-column md="5" style='line-height: 1.7rem' >
              ${item.label || item.key}
            </sc-grid-column>
            <sc-grid-column md="7">
              <div style="padding-left: var(--sc-spacing-8);">
                <sc-dropdown-input
                  hoist
                  value=${//@ts-ignore 
  this.config?.keys?.[item?.key ?? ''] || ''
}
                  @sc-select=${(event: CustomEvent) => {
    this.updateConfig('keys', {
      ...keys,
      [item.key]: event.detail.value,
    });
  }}
                  .data=${
  (type === 'excel' ? Object.values(parsedData?.properties || {}) : apiFields)?.map((field: any) => {
    return  ({
      value: field,
      label: field,
    });
  })
}
                >
              </sc-dropdown-input>
              </div>
            </sc-grid-column>
          </sc-grid-row>
        `)
}
    `
      : nothing;
    
  }

  render() {
    // @ts-ignore
    const apiFields: any = this._selectedDataSource?.apiFields || [];
    const { labelField, valueField, extraFields } = this.config;
    const type = this._selectedDataSource?.type;
    const parsedData = this._selectedDataSource?.parsedData;
    return html`
      <data-source-selector 
        .config=${this.config}
        .component=${this.component}
        @config-updated=${this.updateSelectedDataSource}
      ></data-source-selector>
      ${(this.setOption && (apiFields?.length > 0 || parsedData)) ? html`<div class=row>
        <sc-label class=row>
          <div slot=label>${`Set the option label and value based on ${type === 'excel' ? 'excel headers' : 'API fields'}`}</div>
        </sc-label>
        <sc-box>
        ${this.conf 
    ? this.tableTemplate()
    : this.bindKey && this.bindKey.length > 0
      ? this.bindKeyTemplate()
      : html`
                <sc-grid-row>
                  <sc-grid-column>
                    <sc-dropdown-input
                      label=Label 
                      hoist
                      value=${labelField}
                      @sc-select=${(event: CustomEvent) => this.updateConfig('labelField', event.detail.value)}
                      .data=${
  (type === 'excel' ? Object.values(parsedData?.properties || {}) : apiFields)?.map((field: any) => ({
    value: field,
    label: field,
  }))
}
                    >
                    </sc-dropdown-input>
                  </sc-grid-column>
                </sc-grid-row>
                <sc-grid-row>
                  <sc-grid-column>
                    <sc-dropdown-input
                      label=Value 
                      hoist
                      value=${valueField}
                      @sc-select=${(event: CustomEvent) => this.updateConfig('valueField', event.detail.value)}
                      .data=${
  (type === 'excel' ? Object.values(parsedData?.properties || {}) : apiFields)?.map((field: any) => ({
    value: field,
    label: field,
  }))
}
                    >
                    </sc-dropdown-input>
                  </sc-grid-column>
                </sc-grid-row>
              `
}
        </sc-box>
      </div>` : nothing }
      ${this._selectedDataSource ? html`<div class=row>
        <sc-label class=row>
          <div slot=label>Map more data fields that will not be displayed to users.</div>
        </sc-label>
        <sc-grid-row>
          <sc-grid-column>
            <sc-dropdown-multi-select
              label='Select field(s)' 
              hoist
              .value=${extraFields}
              @sc-select=${(event: CustomEvent) => this.updateConfig('extraFields', event.detail.value)}
            >
              ${
  (type === 'excel' ? Object.values(parsedData?.properties || {}) : apiFields)?.map((field: any) => {
    return html`<sc-dropdown-option value=${field}>${field}</sc-dropdown-option>`;
  })
}
            </sc-dropdown-multi-select>
          </sc-grid-column>
        </sc-grid-row>
      </div>` : null}
    `;
  }
}
if (!window.customElements.get('data-source-selector-for-option')) {
  window.customElements.define('data-source-selector-for-option', DataSourceSelectorForOption);
}