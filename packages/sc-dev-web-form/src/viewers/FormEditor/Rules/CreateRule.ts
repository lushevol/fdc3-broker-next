import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { repeat } from 'lit/directives/repeat.js';
// @ts-ignore
import GridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import { DataSource } from '../../../models/DataSource.js';
import ScElement from '../../utils/sc-element.js';
import { Component } from '../../../models/Component.js';
import { componentContext } from '../../contexts/component-context.js';
import { FormDefinition } from '../../../models/FormDefinition.js';
import { formContext } from '../../contexts/form-context.js';
import { pageContext } from '../../contexts/page-context.js';
import Style from '../../utils/common.style.js';
import { Rule } from '../../../models/Rule.js';
import { OnLoad, OnValueChange } from './constants.js';
import { watch } from '../../utils/watch.js';
import {
  isProcessApiSource,
} from '../../utils/process-api.js';
import {
  processApiContext,
  type ProcessApiContextValue,
} from '../../contexts/process-api-context.js';

export type ParameterType = {
  value: string;
  type: string;
}
export default class CreateRule extends ScElement {
  
  // @ts-ignore
  @consume({ context: componentContext })
  @property({ type: Object }) component: Component;
  
  @consume({ context: pageContext, subscribe: true })
  @state()
  private _selectedPage = { id: '' };
  
  @property({ type: Object }) config: Rule = new Rule();

  @property({ type: Number }) step = 1;

  static styles = [
    GridStyle,
    Style,
  ];

  @state() _selectedDataSource: DataSource | undefined = undefined;

  // @ts-ignore
  @consume({ context: processApiContext, subscribe: true })
  @property({ attribute: false })
    processApiFieldsContext?: ProcessApiContextValue;

  // @ts-ignore
  @consume({ context: formContext, subscribe: true })
  @property({ attribute: false }) 
    formDefinition: FormDefinition;
  
  @watch('config')
  configUpdated() {
    if (this.config) {
      this._selectedDataSource = this.formDefinition.getDataSource(this.config.dataSource);
    }
  }

  get page() {
    return this.formDefinition.getPage(this._selectedPage?.id);
  }

  get components() {
    return this.page?.getAllComponents() || [];
  }

  get dataSources() {
    return this.formDefinition.getDataSources() || [];
  }

  constructor() {
    super();
    const dataSource = this.config?.dataSource;
    if (dataSource) {
      this._selectedDataSource = this.formDefinition.getDataSource(dataSource);
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('step')
      || changedProperties.has('config')
      || changedProperties.has('_selectedDataSource')
    ) {
      this.dispatchEvent(new CustomEvent('step-changed', {
        detail: {
          step: this.step,
        },
        bubbles: true,
        composed: true,
      }));
    }
  }

  get validateSelectStep() {
    const { type, name, dataSource, parameters, targetComponent } = this.config;
    if (!(type && name && dataSource && parameters)) {
      return false;
    }

    if (type === OnValueChange) {
      return !!targetComponent;
    }

    return true;
  }

  get selectedDataSourceFields(): string[] {
    if (!this._selectedDataSource) return [];

    if (isProcessApiSource(this._selectedDataSource)) {
      const cached = this.processApiFieldsContext?.getCachedFields(this._selectedDataSource) || [];
      if (!cached.length) {
        void this.processApiFieldsContext?.getOrLoadFields(this._selectedDataSource);
      }
      return cached;
    }

    if (Array.isArray(this._selectedDataSource.apiFields) && this._selectedDataSource.apiFields.length > 0) {
      return this._selectedDataSource.apiFields.filter(Boolean) as string[];
    }

    if (this._selectedDataSource.type === 'excel') {
      return Object.values(this._selectedDataSource.parsedData?.properties || {}) as string[];
    }

    return [];
  }

  getComponentLabel(componentId: string | undefined) {
    if (!componentId) return '-';
    const component = this.page?.getComponent(componentId);
    return component?.template?.label || component?.id || componentId;
  }

  goToStep(step: number) {
    this.step = step;
  }

  nextStep() {
    if (this.step === 1 && !this.validateSelectStep) return;
    if (this.step < 3) {
      this.step += 1;
    }
  }

  previousStep() {
    if (this.step > 1) {
      this.step -= 1;
    }
  }

  onValueChanged(value: any, type: string) {
    this.emit('value-changed', {
      detail: {
        config: {
          ...this.config,
          [type]: value,
        },
      },
    });    
  }

  async updateSelectedDataSource(event: CustomEvent) {
    const { value, selectedDataSource } = event.detail;
    this._selectedDataSource = selectedDataSource;
    this.onValueChanged(selectedDataSource.id, 'dataSource');
    await this.updateComplete;
    if (value && typeof value === 'string') return;
    this.onValueChanged(value, 'parameters');
  }

  renderAllComponents(
    label: string,
    value: string | undefined,
    selectCallback: any = () => {},
    readonly = false,
  ) {
    return html`
      <sc-dropdown-input
        label=${label}
        ?readonly=${readonly}
        value=${value}
        @sc-select=${selectCallback}
        hoist
      >
        ${
  repeat(
    this.components,
    (c: any) => c.id,
    c => html`
              <sc-dropdown-option value=${c.id}>${c.template?.label || c.id}</sc-dropdown-option>
            `
  )
}
      </sc-dropdown-input>
    `;
  }

  renderFieldsMapping() {
    const { fields = {} } = this.config;
    const dataSourceFields = this.selectedDataSourceFields;
    return html`
      <sc-grid-row>
        <sc-grid-column>
          <sc-label label=Field></sc-label>
        </sc-grid-column>
        <sc-grid-column>
          <sc-label label=Component></sc-label>
        </sc-grid-column>
      </sc-grid-row>
      ${
  repeat(
    dataSourceFields,
    (field: any) => field,
    field => html`
            <sc-grid-row>
              <sc-grid-column>
                <sc-paragraph>${field}</sc-paragraph>
              </sc-grid-column>
              <sc-grid-column>
                ${
  this.renderAllComponents(
    '', 
    // @ts-ignore
    fields?.[field], 
    (event: CustomEvent) => {
      // @ts-ignore
      fields[field] = event.detail.value;
      this.onValueChanged(fields, 'fields');
    }
  )
}
              </sc-grid-column>
            </sc-grid-row>
          `
  )
}
    `;
  }

  renderFlowNameSection(readonly = false) {
    const { name } = this.config;
    return html`
      <div class=row>
        <sc-text-input
          ?readonly=${readonly}
          ?required=${!readonly}
          label='Data flow name'
          .value=${name || ''}
          @sc-input=${readonly ? nothing : (event: CustomEvent) => { this.onValueChanged(event.detail.value, 'name'); }}
        ></sc-text-input>
      </div>
    `;
  }

  renderTriggerWhenSection(readonly = false) {
    const { type } = this.config;
    return html`
      <div class=row>
        <sc-dropdown-input
          ?readonly=${readonly}
          ?required=${!readonly}
          hoist
          label='Trigger when'
          .value=${type}
          @sc-select=${readonly ? nothing : (event: CustomEvent) => {
            this.onValueChanged(event.detail.value, 'type');
          }}
        >
          <sc-dropdown-option value=${OnLoad}>On Load</sc-dropdown-option>
          <sc-dropdown-option value=${OnValueChange}>On Value Change</sc-dropdown-option>
        </sc-dropdown-input>
      </div>
    `;
  }

  renderSkipReadonlySection(readonly = false) {
    const { disableTriggerInReadonly } = this.config;
    return html`
      <div class=row>
        <sc-checkbox
          ?disabled=${readonly}
          ?checked=${!!disableTriggerInReadonly}
          @sc-change=${readonly ? nothing : (event: CustomEvent) => {
            this.onValueChanged(event.detail.checked, 'disableTriggerInReadonly');
          }}
        >
          Skip this data flow in read-only mode
        </sc-checkbox>
      </div>
    `;
  }

  renderTriggerComponentSection(readonly = false) {
    const { type, targetComponent } = this.config;
    if (type !== OnValueChange && type !== 'onValueChange') {
      return nothing;
    }

    return html`
      <div class=row>
        ${this.renderAllComponents(
    'Select the component that will trigger the data flow',
    targetComponent,
    readonly ? () => {} : (event: CustomEvent) => this.onValueChanged(event.detail.value, 'targetComponent'),
    readonly,
  )}
      </div>
    `;
  }

  renderSelectStep() {
    return html`
      ${this.renderFlowNameSection()}
      ${this.renderTriggerWhenSection()}
      ${this.renderSkipReadonlySection()}
      ${this.renderTriggerComponentSection()}
      <data-source-selector
        .component=${this.component}
        .config=${{
          ...this.config,
          id: this.config?.dataSource,
        }}
        @config-updated=${this.updateSelectedDataSource}
      >
      </data-source-selector>
    `;
  }

  renderConfirmationStep() {
    const { parameters, fields = {} } = this.config;
    return html`
      ${this.renderFlowNameSection(true)}
      ${this.renderTriggerWhenSection(true)}
      ${this.renderSkipReadonlySection(true)}
      ${this.renderTriggerComponentSection(true)}
      <div class=row>
        <sc-dropdown-input
          readonly
          hoist
          label="Data source"
          .value=${this._selectedDataSource?.id}
        >
          ${
            this.dataSources.map((source: DataSource) => html`
              <sc-dropdown-option value=${source.id}>${source.name || source.id}</sc-dropdown-option>
            `)
          }
        </sc-dropdown-input>
      </div>
      ${
        Array.isArray(parameters) && parameters.length > 0
          ? html`
              <div class=row>
                <sc-label label="Parameters"></sc-label>
                <div style="margin-top: 0.75rem;">
                  ${parameters.map((parameter: any) => {
                    const parameterName = parameter?.name || '-';
                    const parameterValue = parameter?.source === 'component'
                      ? this.getComponentLabel(parameter?.value)
                      : (parameter?.value || '-');
                    return html`
                      <sc-grid-row>
                        <sc-grid-column md="5">
                          <sc-paragraph rows="2" ellipsis>${parameterName}</sc-paragraph>
                        </sc-grid-column>
                        <sc-grid-column md="7">
                          <sc-paragraph rows="2" ellipsis>${parameterValue}</sc-paragraph>
                        </sc-grid-column>
                      </sc-grid-row>
                    `;
                  })}
                </div>
              </div>
            `
          : nothing
      }
      <div class=row>
        <sc-label label="Mappings"></sc-label>
        ${this.selectedDataSourceFields.length > 0 ? html`
          <div style="margin-top: 0.75rem;">
            ${this.selectedDataSourceFields.map((field: string) => {
              const componentId = (fields as Record<string, string>)?.[field];
              if (!componentId) return nothing;
              return html`
                <sc-grid-row>
                  <sc-grid-column md="5">
                    <sc-paragraph rows="2" ellipsis>${field}</sc-paragraph>
                  </sc-grid-column>
                  <sc-grid-column md="7">
                    <sc-paragraph rows="2" ellipsis>
                      ${this.getComponentLabel(componentId)}
                    </sc-paragraph>
                  </sc-grid-column>
                </sc-grid-row>
              `;
            })}
          </div>
        ` : html`<div style="margin-top: 0.5rem;">-</div>`}
      </div>
    `;
  }

  render() {
    return html`
      <div style="margin-bottom: 1rem;">
        <sc-stepper direction=horizontal mode=full title-position=right>
          ${['Select', 'Mapping', 'Confirmation'].map((item, index) => html`
            <sc-step
              ?disabled=${this.step !== (index + 1)}
              ?active=${this.step === (index + 1)}
              status=${this.step > (index + 1) ? 'finish' : ''}
              show-description=${true}
              title=${item}
            ></sc-step>
          `)}
        </sc-stepper>
      </div>
      ${this.step === 1 ? this.renderSelectStep() : nothing}
      ${this.step === 2 ? html`
        <div class=row>
          ${this._selectedDataSource ? this.renderFieldsMapping() : nothing}
        </div>
      ` : nothing}
      ${this.step === 3 ? this.renderConfirmationStep() : nothing}
    `;
  }
}


if (!window.customElements.get('create-rule')) {
  window.customElements.define('create-rule', CreateRule);
}