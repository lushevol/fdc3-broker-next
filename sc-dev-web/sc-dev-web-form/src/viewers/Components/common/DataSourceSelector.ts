import { html, css, nothing } from 'lit';
import { consume } from '@lit/context';
import { property, state } from 'lit/decorators.js';
// @ts-ignore
import GridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import { FormDefinition } from '../../../models/FormDefinition.js';
import { DataSource } from '../../../models/DataSource.js';
import { OptionConfig } from '../../../models/OptionConfig.js';
import Style from '../../utils/common.style.js';
import ScElement from '../../utils/sc-element.js';
import { Component } from '../../../models/Component.js';
import { formContext } from '../../contexts/form-context.js';
import { pageContext } from '../../contexts/page-context.js';
import { watch } from '../../utils/watch.js';

export class DataSourceSelector extends ScElement {
  static styles = [
    css`
      ${Style}
      ${GridStyle}
      .parameter-section {
        margin: 0.75rem 0.125rem;
      }
      .parameter-title {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
      }
    `,
  ];

  @property({ type: Object }) config: OptionConfig = new OptionConfig();

  // @ts-ignore
  @property({ type: Object }) component: Component = {};

  @state() _selectedDataSource: DataSource | undefined = undefined;

  // @ts-ignore
  @consume({ context: formContext, subscribe: true })
  @property({ attribute: false }) 
    formDefinition: FormDefinition;
  
  @consume({ context: pageContext, subscribe: true })
  @state()
  private _selectedPage = { id: '' };
    
  @watch('config')
  updateSelectedDataSource() {
    if (this.config) {
      this._selectedDataSource = this.formDefinition.getDataSource(this.config.id);
    }
  }

  get dataSources() {
    return this.formDefinition.getDataSources() || [];
  }

  get page() {
    return this.formDefinition.getPage(this._selectedPage?.id);
  }
  get components() {
    return this.page?.getAllComponents() || [];
  }

  setSelectedDataSource(event: CustomEvent) {
    const dataSourceId = event.detail.value;
    this._selectedDataSource = this.formDefinition.getDataSource(dataSourceId);
    this.emit('config-updated', {
      detail: {
        value: dataSourceId,
        key: 'id',
        selectedDataSource: this._selectedDataSource,
      },
    });
  }

  updateArgumentsValues(index: number, value: any, key: string, name: any) {
    const argumentsValues = this.config.parameters || [];
    const argValue = argumentsValues[index] || {};

    // @ts-ignore
    argValue[key] = value;
    argValue.name = name;
    argumentsValues[index] = argValue;
    this.emit('config-updated', {
      detail: {
        value: argumentsValues,
        key: 'parameters',
        selectedDataSource: this._selectedDataSource,
      },
    });
    this.requestUpdate();
  }

  updateConfig(key: string, value: any) {
    this.emit('config-updated', {
      detail: {
        value,
        key,
        selectedDataSource: this._selectedDataSource,
      },
    });
    this.requestUpdate();
  }

  updateReferredComponent(referrenceId: string, currentId: string) {
    this.page?.getComponent(referrenceId)?.updateReferrers(currentId);
  }

  render() {
    if (this._selectedDataSource) {

    }
    // @ts-ignore
    const apiArguments: any = this._selectedDataSource?.apiArguments || [];
    const apiFields: any = this._selectedDataSource?.apiFields || [];
    const argumentsValues: any = this.config.parameters || [];
    const type = this._selectedDataSource?.type;

    return html`
      <div class=row>
        <sc-dropdown-input 
          label="Data source" 
          required
          hoist 
          value=${this.config.id}
          @sc-select=${this.setSelectedDataSource.bind(this)}
        >
          ${
  this.dataSources.map((source: DataSource) => html`<sc-dropdown-option value=${source.id}>${source.name || source.id}</sc-dropdown-option>`)
}
        </sc-dropdown-input>
      </div>
      ${apiArguments?.length > 0 ? html`<div class=row>
        <sc-label label="Parameters" required></sc-label>
        ${
          apiArguments?.map((arg: any, index: number) => {
            if (!arg) return;
            const argValue = argumentsValues?.[index];
            return html`
              <div class="parameter-section" style="${index < 1 ? 'margin-top: 0;' : ''}">
                <sc-box>
                  <div class="parameter-title">
                    ${`Parameters ${index + 1}`}
                  </div>
                  <div>
                    <sc-paragraph>${arg.value}</sc-paragraph>
                    <sc-spacer vertical size="08"></sc-spacer>
                    <sc-dropdown-input 
                      hoist
                      label=Source
                      value=${argValue?.source}
                      @sc-select=${(event: CustomEvent) => this.updateArgumentsValues(index, event.detail.value, 'source', arg.value)}
                    >
                      <sc-dropdown-option value=component>Component</sc-dropdown-option>
                      <sc-dropdown-option value=text>Free text</sc-dropdown-option>
                    </sc-dropdown-input>
                  </div>
                  <div>
                      ${argValue?.source === 'component' ? html`
                      <sc-dropdown-input 
                        value=${argValue?.value}
                        hoist
                        @sc-select=${(event: CustomEvent) => {
                          this.updateArgumentsValues(index, event.detail.value, 'value', arg.value);
                          this.updateReferredComponent(event.detail.value, this.component?.id);
                        }}
                      >
                        ${
                          this.components.map((c: Component) => {
                            return html`
                              <sc-dropdown-option value=${c.id}>${c.template?.label || c.id}</sc-dropdown-option>
                            `;
                          })
                        }
                      </sc-dropdown-input>
                    ` : html`
                      <sc-text-input 
                        border-type=box 
                        hoist
                        label=Value
                        value=${argValue?.value} 
                        @sc-input=${(event: CustomEvent) => this.updateArgumentsValues(index, event.detail.value, 'value', arg.value)}>
                      </sc-text-input>
                    `}
                  </div>
                </sc-box></div>`;
          })
        }
      </div>` : nothing }
    `;
  }
}
if (!window.customElements.get('data-source-selector')) {
  window.customElements.define('data-source-selector', DataSourceSelector);
}