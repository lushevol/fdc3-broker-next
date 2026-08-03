import { html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { FormDefinition } from '../../../models/FormDefinition.js';
import { Rule } from '../../../models/Rule.js';
import { formContext } from '../../contexts/form-context.js';
import { pageContext } from '../../contexts/page-context.js';
import type { CUSTOM_RULE } from '../../types.js';
import ScElement from '../../utils/sc-element.js';
import { modalStyle } from '../style.js';
import './CreateRule.js';
import { OnValueChange } from './constants.js';
import { Component } from '../../../models/Component.js';
import { ListCardItem } from '../common/ListCardItem.js';
import { DeleteModal } from '../common/DeleteModal.js';

export default class FormRules extends ScElement {
  static styles = [
    modalStyle,
    css`
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
      .modal-rule-container {
        height: 25.937rem;
        padding: 0 0.5rem;
      }
    `,
  ];
  
  // @ts-ignore
  @consume({ context: formContext, subscribe: true })
  @property({ attribute: false }) 
    formDefinition: FormDefinition;

  @consume({ context: pageContext, subscribe: true })
  @state()
  private _selectedPage = { id: '' };
  
  @property({ type: Array }) data: Rule[] = [];

  @state() ruleConfig: Rule = new Rule();

  @state() showModal = false;

  @state() showDeleteModal = false;

  @state() ruleStep = 1;

  @state() editData: Rule | undefined;

  get page() {
    return this.formDefinition.getPage(this._selectedPage?.id);
  }
  get validate() {
    const { type, name, dataSource, parameters } = this.ruleConfig;
    return type && name && dataSource && parameters;
  }

  onCancel() {
    this.showModal = false;
    this.clear();
  }

  get ruleEditor() {
    return this.renderRoot?.querySelector('create-rule') as any;
  }

  onRuleStepChanged(event: CustomEvent) {
    this.ruleStep = event.detail.step;
  }

  onNextStep() {
    this.ruleEditor?.nextStep?.();
  }

  onPreviousStep() {
    this.ruleEditor?.previousStep?.();
  }

  onSave() {
    this.data = this.data || [];
    if (this.editData) {
      const index = this.data.findIndex(d => d.id === (this.editData as Rule).id);
      if (index > -1) {
        this.data[index] = this.ruleConfig;
      } else {
        this.data.push(this.ruleConfig);
      }
    } else {
      this.data.push(this.ruleConfig);
    }
    this.bindToTargetComponent();
    this.syncPopulateRuleToComponents();
    this.showModal = false;
    this.clear();
    this.updateForm(this.data);
    this.requestUpdate();
    this.emit('rule-added', {
      detail: {
        data: this.data,
      },
    });
   
  }

  /**
   * For each component mapped in this rule's fields, set component.template.populateRule
   * to this rule and clear any old auto-generated populateRule that differs.
   */
  syncPopulateRuleToComponents() {
    const fields = this.ruleConfig.fields as Record<string, string> | undefined;
    if (!fields) return;
    const ruleId = this.ruleConfig.id;

    Object.values(fields).forEach((componentId: string) => {
      const component: Component | undefined = this.page?.getComponent(componentId);
      if (!component) return;
      const existingRuleId: string | undefined = component.template?.populateRule;
      // If component is already bound to a different auto-generated rule, clean that rule's
      // fields entry for this component (do not delete the rule itself).
      if (existingRuleId && existingRuleId !== ruleId) {
        const oldRule = this.formDefinition.getRule(existingRuleId);
        if (oldRule?.fields) {
          const oldFields = oldRule.fields as Record<string, string>;
          const fieldKey = Object.keys(oldFields).find(k => oldFields[k] === componentId);
          if (fieldKey) {
            delete oldFields[fieldKey];
          }
        }
      }
      // Bind the new rule id to this component.
      // Do NOT overwrite populateType when the component is already bound via
      // 'dataSource' — that binding is managed by PrefillAnswer independently.
      component.template.populateRule = ruleId;
      component.template.populate = true;
      if (component.template.populateType !== 'dataSource') {
        component.template.populateType = 'dataFlow';
      }
    });
  }

  bindToTargetComponent() {
    const { type, id, targetComponent } = this.ruleConfig;
    if (type === OnValueChange && targetComponent) {
      const component: Component | undefined = this.page?.getComponent(targetComponent);
      if (component) {
        component.updateRules(id);
      }
    }
  }

  updateForm = (data: Rule[]) => {
    this.formDefinition?.updateRules(data);
    this.emit('form-updated', {
      composed: true,
      bubbles: true,
      detail: {
        definition: this.formDefinition,
      },
    });
  };

  updateConfig(event: CustomEvent) {
    this.ruleConfig = event.detail.config;
  }

  clear() {
    this.ruleConfig = new Rule();
    this.editData = undefined;
    this.ruleStep = 1;
  }

  editRule = (data: Rule) => {
    this.editData = data;
    this.ruleConfig = this.editData;
    this.showModal = true;
  };

  deleteRule = (data: Rule) => {
    this.editData = data;
    this.showDeleteModal = true;
  };

  onAction(action: string) {
    if (action === 'delete' && this.editData) {
      this.formDefinition.deleteRule(this.editData.id);
    }
    this.showDeleteModal = false;
  }

  render() {
    const visibleRules = (this.data || []).filter((rule: Rule) => !rule.hiddenInRuleTab);
    return html`
      <div class=row>
        ${
  visibleRules.map((d: any, index: number) => {
    const isAPI = this.formDefinition.getDataSource(d.dataSource)?.type?.includes('api');
    return html`
              ${ListCardItem(
    'merge', 
    d.name,
    [
      html`<div @click=${() => this.editRule(d)}>Edit</div>`,
      html`<div @click=${() => this.deleteRule(d)}>Delete</div>`,
    ],
    isAPI ? 'api' : 'excel'
  )}
              ${index < visibleRules.length - 1 ? html`<sc-spacer size="04"></sc-spacer>` : nothing}
            `;
  })
}
        <div class=add-link>
          <sc-link @click=${(event: MouseEvent) => { event.preventDefault(); this.showModal = true; }}>+ Add data flow</sc-link>
        </div>
        ${
  this.showModal ? html`
            <sc-modal size=md disable-outside-click open=${this.showModal} 
              @sc-hide=${() => { this.showModal = false; this.clear(); }} 
              header=${this.editData ? 'Edit data flow' : 'New data flow'}>
              <div class=modal-rule-container>
                <create-rule 
                  .config=${this.ruleConfig}
                  .step=${this.ruleStep}
                  @value-changed=${this.updateConfig}
                  @step-changed=${this.onRuleStepChanged}
                ></create-rule>
              </div>
              <div class=footer-button slot=footer>
              ${this.ruleStep === 1 ? html`
                <sc-button size=sm @click=${this.onCancel} type=secondary width=6.25rem>Cancel</sc-button>
                <sc-button
                  size=sm
                  ?disabled=${!this.validate}
                  @click=${this.onNextStep}
                  style='margin-left: 0.5rem'
                  fill
                  width=6.25rem
                >Next</sc-button>
              ` : nothing}
              ${this.ruleStep === 2 ? html`
                <sc-button size=sm @click=${this.onPreviousStep} type=secondary width=6.25rem>Previous</sc-button>
                <sc-button
                  size=sm
                  @click=${this.onNextStep}
                  style='margin-left: 0.5rem'
                  fill
                  width=6.25rem
                >Next</sc-button>
              ` : nothing}
              ${this.ruleStep === 3 ? html`
                <sc-button size=sm @click=${this.onPreviousStep} type=secondary width=6.25rem>Previous</sc-button>
                <sc-button
                  size=sm
                  ?disabled=${!this.validate}
                  @click=${this.onSave}
                  style='margin-left: 0.5rem'
                  fill
                  width=6.25rem
                >Save</sc-button>
              ` : nothing}
              </div> 
            </sc-modal>
          ` : nothing
} 
        ${
  this.showDeleteModal ? DeleteModal('data flow', () => this.onAction('delete'), () => this.onAction('cancel')) : nothing
}
      </div>
    `;
  }
}

if (!window.customElements.get('form-rules')) {
  window.customElements.define('form-rules', FormRules);
}