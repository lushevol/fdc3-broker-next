import { html, css, nothing } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { consume } from '@lit/context';
import { property, state } from 'lit/decorators.js';
import ScElement from '../../utils/sc-element.js';
import { watch } from '../../utils/watch.js';
import { formContext } from '../../contexts/form-context.js';
import { predefinedContext } from '../../contexts/predefined-context.js';
import { pageContext } from '../../contexts/page-context.js';
import { DataSource } from '../../../models/DataSource.js';
import { FormDefinition } from '../../../models/FormDefinition.js';
import { Component } from '../../../models/Component.js';
import { Rule } from '../../../models/Rule.js';
import { OnLoad, OnValueChange } from '../../FormEditor/Rules/constants.js';
import {
  isProcessApiSource,
} from '../../utils/process-api.js';
import {
  processApiContext,
  type ProcessApiContextValue,
} from '../../contexts/process-api-context.js';
import CommonStyle from '../../utils/common.style.js';
// @ts-ignore
import GridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';

const PopulateTypeOptions = [
  {
    label: 'Data source',
    value: 'dataSource',
  },
  {
    label: 'Data flow',
    value: 'dataFlow',
  },
  {
    label: 'Pre-defined',
    value: 'predefined',
  },
  {
    label: 'Free text',
    value: 'text',
  },
  {
    label: 'Component',
    value: 'component',
  },
  {
    label: 'Context',
    value: 'context',
  },
];

const AutoModeOtherTypes = ['other', 'predefined', 'component'];

const ContextTypeOptions = [{
  label: 'Navigation',
  value: 'navigation',
},{
  label: 'User',
  value: 'user',
},{
  label: 'Locale',
  value: 'locale',
}];

const ContextFieldOptions: any = {
  navigation: [{
    label: 'Path',
    value: 'path',
  },{
    label: 'Params',
    value: 'params',
  }],
  user: [{
    label: 'Id',
    value: 'id',
  },{
    label: 'First name',
    value: 'firstName',
  },{
    label: 'Last name',
    value: 'lastName',
  }],
  locale: [
    {
      label: 'Available Languages',
      value: 'getAvailableLanguages',
    },{
      label: 'Current Language',
      value: 'getCurrentLanguage',
    },
  ],
  analytics: [
    {
      label: 'Cancel event',
      value: 'cancelEvent',
    },{
      label: 'End event',
      value: 'endEvent',
    },
    {
      label: 'Publish event',
      value: 'publishEvent',
    },{
      label: 'Start event',
      value: 'startEvent',
    },
  ],
};

export class PrefillAnswer extends ScElement {

  static styles = css`
    ${CommonStyle}
    ${GridStyle}
  `;

  @property({ type: Object }) component: Component;

  @property({ type: String }) mode = 'default';

  // @ts-ignore
  @consume({ context: predefinedContext })
  @property()
    predefined: any;

  // @ts-ignore
  @consume({ context: formContext, subscribe: true })
  @state()
    formDefinition: FormDefinition;

  // @ts-ignore
  @consume({ context: pageContext, subscribe: true })
  @state()
    _selectedPage = { id: '' };

  @state() _selectedDataSource: DataSource | undefined = undefined;

  // @ts-ignore
  @consume({ context: processApiContext, subscribe: true })
  @property({ attribute: false })
    processApiFieldsContext?: ProcessApiContextValue;

  @state() _rule: Rule;

  @property({ type: Array, attribute: 'bind-key' }) bindKey = [];

  // @ts-ignore
  @state() _optionConfig: OptionConfig = {};

  @state() _contextSource: any;

  private _onFormUpdated = () => {
    // Rule save mutates formDefinition in-place (same object reference), so
    // @watch('formDefinition') never fires. Instead we listen to the global
    // form-updated event and re-sync using this._rule.id directly — we do NOT
    // rely on component.template.populateRule because that property is written
    // asynchronously via value-changed and may not be set yet.
    if (!this._rule?.id) return;
    const updated = this.formDefinition?.getRule(this._rule.id);
    if (updated) {
      // Spread to produce a new object reference so Lit schedules a re-render.
      this._rule = { ...updated } as Rule;
      this._selectedDataSource = this.formDefinition.getDataSource(updated.dataSource);
      this.requestUpdate();
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('form-updated', this._onFormUpdated as EventListener);
  }

  disconnectedCallback() {
    window.removeEventListener('form-updated', this._onFormUpdated as EventListener);
    super.disconnectedCallback();
  }

  willUpdate() {
    const { optionConfig } = this.component.template;
    this._optionConfig = optionConfig || {};
  }

  @watch('component')
  updateRule() {
    if (this.component?.template?.populateRule) {
      const rule = this.formDefinition.getRule(this.component.template.populateRule);
      if (rule) {
        this._rule = rule;
        this._selectedDataSource = this.formDefinition.getDataSource(rule.dataSource);
        return;
      }
    }
    // No populateRule stored yet — check if any data flow already maps to this component.
    const linkedRules = this.formDefinition.getRulesForComponent?.(this.component.id) || [];
    if (linkedRules.length > 0) {
      const rule = linkedRules[0];
      this._rule = rule;
      this._selectedDataSource = this.formDefinition.getDataSource(rule.dataSource);
      // Automatically wire the populateRule reference back to the component
      if (!this.component.template.populateRule) {
        this.component.template.populateRule = rule.id;
        this.component.template.populate = true;
        this.component.template.populateType = 'dataFlow';
        this.emit('value-changed', { detail: { value: rule.id, name: 'populateRule' } });
        this.emit('value-changed', { detail: { value: 'dataFlow', name: 'populateType' } });
        this.emit('value-changed', { detail: { value: true, name: 'populate' } });
      }
    }
  }

  @watch('formDefinition')
  syncRuleFromDefinition() {
    if (!this.component?.template?.populateRule) return;
    const rule = this.formDefinition?.getRule(this.component.template.populateRule);
    if (rule) {
      // Spread to force a new object reference so Lit detects the state change.
      this._rule = { ...rule } as Rule;
      this._selectedDataSource = this.formDefinition.getDataSource(rule.dataSource);
      this.requestUpdate();
    }
  }

  get page() {
    return this.formDefinition.getPage(this._selectedPage?.id);
  }

  onPopulateTypeChange(event: CustomEvent) {
    const { populateType, populateRule } = this.component.template;
    const type = event.detail.value;
    if (type === populateType) return;

    if (type === 'dataSource' && populateType === 'dataFlow' && populateRule) {
      this.clearComponentMappingFromRule(populateRule);
    }

    if (type === 'dataSource') {
      // Always create a new prefill rule when switching to dataSource.
      // If coming from dataFlow the existing populateRule belongs to a
      // dataFlow rule — leave it in formDefinition, just create a new one.
      if (!populateRule || populateType !== 'dataSource') {
        const rule = new Rule();
        rule.name = `Prefill for ${this.component.template.label || this.component.id}`;
        rule.hiddenInRuleTab = true;
        this._rule = rule;
      }
      this.updateOptionConfig('dataSource', 'type');
    } else {
      // Only delete the auto-created prefill rule when leaving 'dataSource'.
      // Do NOT delete a dataFlow rule when the user switches away from 'dataFlow'.
      if (populateRule && populateType === 'dataSource') {
        const previousRule = this.formDefinition.getRule(populateRule);
        if (previousRule?.hiddenInRuleTab) {
          this.formDefinition.deleteRule(populateRule);
          this.updateTargetComponentRule(this._rule?.['targetComponent'], 'delete');
        }
      }
    }
    this.emit('value-changed', { detail: { value: '', name: 'populateSource' } });
    this.emit('value-changed', { detail: { value: '', name: 'populateRule' } });
    this.emit('value-changed', { detail: { value: '', name: 'defaultValue' } });
    this.emit('value-changed', { detail: { value: type, name: 'populateType' } });
    const contextTemplate = ['contextType', 'contextField', 'contextFieldChild', 'bindKeysField'];
    contextTemplate.forEach(key => {
      delete this.component?.template[key];
    });
    this.requestUpdate();
  }

  clearComponentMappingFromRule(ruleId: string) {
    const targetRule = this.formDefinition?.getRule(ruleId);
    if (!targetRule) return;

    const fields = { ...(targetRule.fields || {}) } as Record<string, string>;
    const oldKey = Object.keys(fields).find(k => fields[k] === this.component.id);
    if (!oldKey) return;

    delete fields[oldKey];
    targetRule.fields = fields;

    const rules = this.formDefinition.rules || [];
    const index = rules.findIndex((d: any) => d.id === targetRule.id);
    if (index > -1) {
      rules[index] = targetRule;
      this.formDefinition.updateRules(rules);
      this.emit('form-updated', {
        composed: true,
        bubbles: true,
        detail: {
          definition: this.formDefinition,
        },
      });
    }
  }

  async updateSelectedDataSource(event: CustomEvent) {
    const { value, selectedDataSource } = event.detail;
    this._selectedDataSource = selectedDataSource;
    this._rule['dataSource'] = selectedDataSource.id;
    if (!(value && typeof value === 'string')) {
      this._rule['parameters'] = value;
      const componentParam = value.find((item: any) => item.source === 'component');
      if (componentParam) {
        this._rule['targetComponent'] = componentParam.value;
        this._rule['type'] = OnValueChange;
      } else {
        this.updateTargetComponentRule(this._rule['targetComponent'], 'delete');
        this._rule['targetComponent'] = '';
        this._rule['type'] = OnLoad;
      }
    }
    this.requestUpdate();
    this.updatePopulateRule();
  }

  updateField(event: CustomEvent) {
    const fieldName = event.detail.value;
    const { populateType } = this.component.template;
    if (populateType === 'dataFlow') {
      // For data-flow binding: patch only this component's entry in rule.fields;
      // remove any old mapping for this component first, then add the new one.
      const fields = (this._rule['fields'] || {}) as Record<string, string>;
      const oldKey = Object.keys(fields).find(k => fields[k] === this.component.id);
      if (oldKey) delete fields[oldKey];
      if (fieldName) fields[fieldName] = this.component.id;
      this._rule['fields'] = fields;
    } else {
      this._rule['fields'] = { [fieldName]: this.component.id };
    }
    this.updatePopulateRule();
  }

  /** Remove this component's field mapping from the data-flow rule (do not delete the rule). */
  clearDataFlowBinding() {
    if (!this._rule) return;
    const fields = (this._rule['fields'] || {}) as Record<string, string>;
    const oldKey = Object.keys(fields).find(k => fields[k] === this.component.id);
    if (oldKey) delete fields[oldKey];
    this._rule['fields'] = fields;
    // Persist the patched rule
    const rules = this.formDefinition.rules || [];
    const index = rules.findIndex((d: any) => d.id === this._rule.id);
    if (index > -1) rules[index] = this._rule;
    this.formDefinition.updateRules(rules);
    this.emit('form-updated', {
      composed: true,
      bubbles: true,
      detail: {
        definition: this.formDefinition,
      },
    });
    // Clear local binding refs
    this.component.template.populateRule = '';
    this.component.template.populateType = '';
    this.component.template.populate = false;
    this._rule = undefined as any;
    this._selectedDataSource = undefined;
    this.emit('value-changed', { detail: { value: '', name: 'populateRule' } });
    this.emit('value-changed', { detail: { value: '', name: 'populateType' } });
    this.emit('value-changed', { detail: { value: false, name: 'populate' } });
    this.requestUpdate();
  }

  updatePopulateRule() {
    const rules = this.formDefinition.rules || [];
    const index = rules.findIndex(d => d.id === this._rule.id);
    if (index > -1) {
      rules[index] = this._rule;
    } else {
      rules.push(this._rule);
    }
    this.updateTargetComponentRule(this._rule['targetComponent']);
    this.formDefinition.updateRules(rules);
    this.emit('form-updated', {
      composed: true,
      bubbles: true,
      detail: {
        definition: this.formDefinition,
      },
    });
    this.emit('value-changed', { detail: { value: this._rule.id, name: 'populateRule' } });
  }

  updateTargetComponentRule(targetComponent: string, type = 'add') {
    if (targetComponent) {
      const component: Component | undefined = this.page?.getComponent(targetComponent);
      if (type === 'delete') {
        const rules = component?.rules;
        if (rules) {
          const deleteIndex = rules?.indexOf(targetComponent);
          rules?.splice(deleteIndex, 1);
          component.rules = rules;
        }
      } else {
        component && component.updateRules(this._rule.id);
      }
    }
  }

  updatePopulatorComponent(referrenceId: string, currentId: string) {
    this.page?.getComponent(referrenceId)?.updatePopulators(currentId);
  }

  updateOptionConfig(value: any, key: string) {
    // @ts-ignore
    this._optionConfig[key] = value;
    this.emit('value-changed', { detail: { value: this._optionConfig, name: 'optionConfig' } });
    this.requestUpdate();
  }

  contextFieldRender() {
    const { contextType, contextField } = this.component?.template ?? {};
    //@ts-ignore
    this._contextSource = this[`_${contextType}`];
    if (this.bindKey.length > 0) {
      return this.contextFieldByBindKeyRender();
    }
    return html`
      <sc-dropdown-input
        label="Select field"
        hoist
        value=${contextField}
        @sc-select=${(event: CustomEvent) => {
          this.emit('value-changed', { detail: { value: event.detail.value, name: 'contextField' } });
          this.requestUpdate();
        }}
      >
        ${(ContextFieldOptions[contextType] || []).map((item: {label: string; value: string}) => {
          return html`
            <sc-dropdown-option value=${ item.value }>${item.label}</sc-dropdown-option>
          `;
          })}
      </sc-dropdown-input>
      ${ this.contextFieldByOtherRender() }
    `;
  }

  
  contextFieldByBindKeyRender() {
    const { contextType, contextField, bindKeysField } = this.component?.template ?? {};
    let optionsList:any = []; 
    switch (contextType) {
      case 'locale':
        const localeData = contextField ? this._contextSource?.[contextField]() : [];
        optionsList = Array.isArray(localeData) && localeData.length > 0
          ? localeData.map((item: any) => ({ label: item.name, value: item.id }))
          : [{ label: localeData, value: localeData }];
        break;
      case 'navigation':
        optionsList = contextField === 'params' 
          ? (Object.keys(this._contextSource?.params || {})).map((item: any) => ({
            label: item,
            value: this._contextSource?.[contextField]?.[item],
          }))
          : [{ label: contextField, value: this._contextSource?.[contextField] }];
        break;
      case 'user':
          optionsList =  ContextFieldOptions[contextType].map((item: any) => ({
            label: item.label,
            value: this._contextSource?.[item.value],
          }));
          break;
    }
    return html`
      <style>
        .options-text {
          font-size: 0.875rem;
        }
      </style>
      ${['navigation', 'locale'].includes(contextType) ? html`
          <sc-dropdown-input
            label="Select field"
            hoist
            value=${contextField}
            @sc-select=${(event: CustomEvent) => {
              this.emit('value-changed', { detail: { value: event.detail.value, name: 'contextField' } });
              this.emit('value-changed', { detail: { value: {}, name: 'bindKeysField' } });
              this.requestUpdate();
            }}
          >
            ${(ContextFieldOptions[contextType] || []).map((item: {label: string; value: string}) => {
              return html`
                <sc-dropdown-option value=${ item.value }>${item.label}</sc-dropdown-option>
              `;
              })}
          </sc-dropdown-input>
      ` : nothing}
      <div style="padding-top:0.937rem;">
      <sc-box>
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
                    value=${bindKeysField?.[item.key]}
                    @sc-select=${(event: CustomEvent) => {
                      this.emit('value-changed', { detail: { value: {
                        ...bindKeysField,
                        [item.key]: event.detail.value,
                      }, name: 'bindKeysField' } });
                      this.requestUpdate();
                    }}
                    .data=${optionsList}
                  >
                  </sc-dropdown-input>
                </div>
              </sc-grid-column>
            </sc-grid-row>
        `)}
      </sc-box>
    </div>
    `;
  }
  contextFieldByOtherRender() {
    const { contextType, contextField, contextFieldChild } = this.component?.template ?? {};
    if (!contextField) return;
    switch (contextType) {
      case 'navigation':
        if (contextField === 'params') {
          return html`
          <sc-dropdown-input
              hoist
              value=${contextFieldChild}
              @sc-select=${(event: CustomEvent) => {
                this.emit('value-changed', { detail: { value: event.detail.value, name: 'contextFieldChild' } });
                this.requestUpdate();
              }}
            >
              ${(Object.keys(this._contextSource?.params || {})).map(item => {
                return html`
                  <sc-dropdown-option value=${item}>${item}</sc-dropdown-option>
                `;
                })}
            </sc-dropdown-input>
          `;
        }
        break;
      default:
        this.emit('value-changed', { detail: { value: '', name: 'contextFieldChild' } });
        this.requestUpdate();
        break;
    }
  }

  get _dataFlowBoundFieldName(): string {
    if (!this._rule?.fields) return '';
    const fields = this._rule.fields as Record<string, string>;
    return Object.keys(fields).find(k => fields[k] === this.component.id) || '';
  }

  get _dataFlowRuleOptions() {
    return (this.formDefinition?.rules || [])
      .filter((rule: Rule) => !!rule?.id && !!rule?.dataSource)
      .map((rule: Rule) => ({
        label: rule.name || rule.id,
        value: rule.id,
      }));
  }

  get _selectedDataSourceFields(): string[] {
    const dataSource = this._selectedDataSource;
    if (!dataSource) return [];

    if (isProcessApiSource(dataSource)) {
      const cached = this.processApiFieldsContext?.getCachedFields(dataSource) || [];
      if (!cached.length) {
        void this.processApiFieldsContext?.getOrLoadFields(dataSource);
      }
      return cached;
    }

    if (Array.isArray(dataSource.apiFields) && dataSource.apiFields.length > 0) {
      return dataSource.apiFields.filter(Boolean) as string[];
    }

    if (dataSource.type === 'excel') {
      return Object.values(dataSource.parsedData?.properties || {}) as string[];
    }

    return [];
  }

  onDataFlowRuleChange(event: CustomEvent) {
    const selectedRuleId = event.detail.value;
    if (!selectedRuleId || selectedRuleId === this._rule?.id) return;

    if (this._rule?.id) {
      this.clearComponentMappingFromRule(this._rule.id);
    }

    const selectedRule = this.formDefinition?.getRule(selectedRuleId);
    if (!selectedRule) return;

    this._rule = { ...selectedRule } as Rule;
    this._selectedDataSource = this.formDefinition.getDataSource(selectedRule.dataSource);
    this.component.template.populateRule = selectedRule.id;
    this.component.template.populateType = 'dataFlow';
    this.component.template.populate = true;
    this.emit('value-changed', { detail: { value: selectedRule.id, name: 'populateRule' } });
    this.requestUpdate();
  }

  render() {
    const { defaultValue, populate, populateType, populateSource, contextType } = this.component?.template ?? {};
    const components = this.page?.getAllComponents() || [];
    const SelectFieldList = this._selectedDataSourceFields.map((item: string) => ({
      label: item,
      value: item,
    }));
    return html`
      <div>
        ${this.mode === 'default' ? html`
          <div class=row>
            <sc-checkbox 
              ?checked=${populate}
              @sc-change=${(e: CustomEvent) => {
    this.emit('value-changed', { detail: { value: e.detail.checked, name: 'populate' } });
    !e.detail.checked && this.onPopulateTypeChange(new CustomEvent('sc-select', { detail: { value: '' } }));
    this.requestUpdate();
  }}
            >Pre-fill value</sc-checkbox>
          </div>
        ` : nothing}
        ${populate ? html`
          ${this.mode === 'auto' ? html`
          <div class=row>
            <sc-dropdown-input 
              hoist
              value=${[AutoModeOtherTypes.includes(populateType) ? 'other' : populateType]}
              @sc-select=${(e: CustomEvent) => {
    this.onPopulateTypeChange(new CustomEvent('sc-select', { detail: { value: e.detail.value } }));
  }}
            >
              <sc-dropdown-option value=textEditor>Manual input</sc-dropdown-option>
              <sc-dropdown-option value=dataSource>Data source</sc-dropdown-option>
              <sc-dropdown-option value=other>Other</sc-dropdown-option>
            </sc-dropdown-input>
          </div>
          ` : nothing}
          ${this.mode === 'default' || (this.mode === 'auto' && AutoModeOtherTypes.includes(populateType)) ? html`
            <div class=row>
              <sc-dropdown-input
                label="From"
                hoist
                value=${populateType}
                .data=${PopulateTypeOptions
                  .filter((item: any) => !!this.predefined?.options || item.value !== 'predefined')
                  .filter((item: any) => this.mode === 'auto' ? AutoModeOtherTypes.includes(item.value) : true)}
                @sc-select=${this.onPopulateTypeChange}
              ></sc-dropdown-input>
            </div>
          ` : nothing}
          ${populateType === 'dataFlow' ? html`
            <div class=row>
              <sc-dropdown-input
                hoist
                label="Data flow"
                .value=${this._rule?.id || ''}
                .data=${this._dataFlowRuleOptions}
                @sc-select=${(event: CustomEvent) => this.onDataFlowRuleChange(event)}
              ></sc-dropdown-input>
            </div>
            <div class=row>
              ${SelectFieldList.length > 0 ? html`
                ${keyed(
                  `${this._rule?.id || 'no-rule'}:${this._dataFlowBoundFieldName}`,
                  html`
                    <sc-dropdown-input
                      hoist
                      label="Select field"
                      .value=${this._dataFlowBoundFieldName}
                      .data=${SelectFieldList}
                      @sc-select=${this.updateField}
                    ></sc-dropdown-input>
                  `,
                )}
              ` : nothing}
            </div>
          ` : nothing}
          ${populateType === 'dataSource' 
    ? this.bindKey.length > 0 
      ? html`
              <data-source-selector-for-option 
                .bindKey=${this.bindKey}
                .config=${this._optionConfig}
                .component=${this.component}
                @config-updated=${(event: CustomEvent) => this.updateOptionConfig(event.detail.value, event.detail.key)}
              >
              </data-source-selector-for-option>`
      : html`
              <data-source-selector
                .component=${this.component}
                .config=${{
    ...this._rule,
    id: this._rule?.dataSource,
  }}
                @config-updated=${this.updateSelectedDataSource}>
              </data-source-selector>
              <div class=row>
                ${this._selectedDataSource && SelectFieldList.length > 0 ? html`
                  ${keyed(
                    `${this._rule?.id || 'no-rule'}:${this._dataFlowBoundFieldName}`,
                    html`
                      <sc-dropdown-input
                        hoist
                        label="Select field"
                        .value=${this._dataFlowBoundFieldName}
                        .data=${SelectFieldList}
                        @sc-select=${this.updateField}
                      ></sc-dropdown-input>
                    `,
                  )}
                ` : nothing}
              </div>
            `
    : nothing}
          ${populateType === 'predefined' && this.predefined?.options ? html`
            <sc-dropdown-input
              label="Select"
              hoist
              value=${populateSource}
              .data=${this.predefined?.options}
              @sc-select=${(event: CustomEvent) => this.emit('value-changed', {
                detail: { value: event.detail.value, name: 'populateSource' },
              })}
            ></sc-dropdown-input>
          ` : nothing}
          ${populateType === 'text' ? (
    this.bindKey.length > 0 
      ? this.bindKey.map((item: {label: string; key: string;}) => {
        return html`
                <sc-text-input
                  label=${item.label || item.key}
                  value=${this.component?.template[item.key]}
                  @sc-input=${(event: CustomEvent) => this.emit('value-changed', {
                    detail: { value: event.detail.value, name: item.key },
                  })}
                >
                </sc-text-input>`;
      })
      : html`
              <sc-text-input
                label="Value"
                value=${defaultValue}
                @sc-input=${(event: CustomEvent) => this.emit('value-changed', {
                  detail: { value: event.detail.value, name: 'defaultValue' },
                })}
              >
              </sc-text-input>`
  ) : nothing}
          ${populateType === 'textEditor' ? html`
            <sc-rich-text-editor-v2
              value=${defaultValue}
              .toolbar=${[
    'undo',
    'redo',
    'separate',
    'fontstyle',
    'separate',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'backcolor',
    'forecolor',
    'clear',
    'addlink',
    'unlink',
  ]}
              @sc-change=${(event: CustomEvent) => {
    this.emit('value-changed', {
      detail: {
        value: event.detail.text ? event.detail.text : '',
        name: 'defaultValue',
      },
    }); }
}
            >
            </sc-rich-text-editor-v2>
          ` : nothing}
          ${populateType === 'component' ? html`
            <sc-dropdown-input
              label="Select"
              hoist
              value=${populateSource}
              @sc-select=${(event: CustomEvent) => {
    this.emit('value-changed', { detail: { value: event.detail.value, name: 'populateSource' } });
    this.updatePopulatorComponent(event.detail.value, this.component.id);
  }}
            >
              ${components.map((c: Component) => {
    return html`
                  <sc-dropdown-option value=${c.id}>${c.template.label || c.id}</sc-dropdown-option>
                `;
  })}
            </sc-dropdown-input>
          ` : nothing} 
          ${populateType === 'context' ? html`
            <sc-dropdown-input
              label="Select"
              hoist
              value=${contextType}
              @sc-select=${(event: CustomEvent) => {
                this.emit('value-changed', { detail: { value: event.detail.value, name: 'contextType' } });
                this.emit('value-changed', { detail: { value: null, name: 'contextField' } });
                this.emit('value-changed', { detail: { value: null, name: 'contextFieldChild' } });
                this.emit('value-changed', { detail: { value: {}, name: 'bindKeysField' } });
                if (this.component.template?.options?.length > 0) {
                  this.emit('value-changed', { detail: { value: [], name: 'options' } });
                }
                this.requestUpdate();
              }}
            >
              ${ContextTypeOptions.map(item => {
                return html`
                  <sc-dropdown-option value=${item.value}>${item.label}</sc-dropdown-option>
                `;
              })}
            </sc-dropdown-input>
            ${
              contextType ?  this.contextFieldRender() : nothing
            }
          ` : nothing}
        ` : nothing}
      </div>
    `;
  }
}

if (!window.customElements.get('prefill-answer')) {
  window.customElements.define('prefill-answer', PrefillAnswer);
}