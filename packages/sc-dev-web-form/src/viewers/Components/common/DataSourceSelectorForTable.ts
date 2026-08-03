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

export class DataSourceSelectorForTable extends ScElement {

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

  render() {
    // @ts-ignore
    const apiFields: any = this._selectedDataSource?.apiFields || [];
    const type = this._selectedDataSource?.type;
    const parsedData = this._selectedDataSource?.parsedData;
    return html`
      <data-source-selector 
        .config=${this.config}
        .component=${this.component}
        @config-updated=${this.updateSelectedDataSource}
      ></data-source-selector>
      ${(apiFields?.length > 0 || parsedData) ? html`<div class=row>
        <sc-label class=row>
          <div slot=label>${`Set the option label and value based on ${type === 'excel' ? 'excel headers' : 'API fields'}`}</div>
        </sc-label>
        <sc-box>
        ${this.conf
    ? this.conf.map((item, index) => {
      const dropdownData = (type === 'excel' 
        ? Object.values(parsedData?.properties || {}) 
        : apiFields
      )?.map((field: any) => ({
        value: field,
        label: field,
      }));
        
      return html`
                <sc-grid-row style="${index > 0 ? 'margin-top: 1rem' : ''}">
                  <sc-grid-column>
                    <sc-dropdown-input
                      label=${item.header}
                      hoist
                      value=${//@ts-ignore
  this.config[item.header]}
                      @sc-select=${(event: CustomEvent) =>
    this.updateConfig(item.header, event.detail.value)}
                      .data=${dropdownData}
                    >
                    </sc-dropdown-input>
                  </sc-grid-column>
                </sc-grid-row>
              `;
    })
    : nothing}
        </sc-box>
      </div>` : nothing }
    `;
  }
}
if (!window.customElements.get('data-source-selector-for-table')) {
  window.customElements.define('data-source-selector-for-table', DataSourceSelectorForTable);
}