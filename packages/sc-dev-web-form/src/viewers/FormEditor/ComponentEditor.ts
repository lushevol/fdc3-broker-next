import { html, css, LitElement, nothing, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { provide, consume } from '@lit/context';
import type { FormDefinition } from '../../models/FormDefinition.js';
import { CustomEventCallback } from '../../shared/formTypes.js';
import { componentContext } from '../contexts/component-context.js';
import { activeComponentContext } from '../contexts/active-component-context.js';
import { formContext } from '../contexts/form-context.js';
import { pageContext } from '../contexts/page-context.js';
import { actionContext } from '../contexts/action-context.js';
import { dataContext } from '../contexts/data-context.js';
import '../ComponentController.js';
import { Component } from '../../models/Component.js';
import { generateUniqueId } from '../../shared/generateUniqueId.js';
import type { CUSTOM_COMPONENT } from '../types.js';
import { watch } from '../utils/watch.js';

export class ComponentEditor extends LitElement {
  @provide({ context: componentContext })
  @property({ type: Component }) component: Component;

  @property({ type: Object }) customComponent: CUSTOM_COMPONENT;

  @property({ type: Function }) updateForm = (components: Component[]) => {};

  @property({ type: Function }) updateEditingStatus = (status: boolean) => {};

  @property({ type: Number }) key: number;

  @property({ type: String }) id: string;

  // @ts-ignore
  @consume({ context: formContext, subscribe: true })
  @property({ attribute: false }) 
    formDefinition: FormDefinition;

  @consume({ context: actionContext })
    _formAction: any;

  @consume({ context: dataContext })
  @state()
    _formData: any;
  
  @consume({ context: pageContext, subscribe: true })
  @state()
  private _selectedPage = { id: '' };
    
  @property({ type: Function }) handleEdit: CustomEventCallback;

  @property({ type: Function }) handleClick: CustomEventCallback;

  // @ts-ignore
  @consume({ context: activeComponentContext })
  @state()
    activeComponent: Component;    
    
  @state() _showEditor = false;

  @state() _showModal = false;

  @watch('_showEditor')
  updateStatus() {
    this.updateEditingStatus(this._showEditor);
  }

  get page() {
    return this.formDefinition.getPage(this._selectedPage?.id);
  }

  static styles = css`
    :host {
      position: relative;
      flex: 1;
      width: 100%;
    }

    .editicon {
      position: absolute;
      right: -0.125rem;
      top: -0.125rem;
      text-align: end;
      margin: auto;
      cursor: pointer;
    }

    .box {
      margin-top: -3rem;
    }

    .footer {
      margin-top: 2rem;
    }

  `;

  renderEditIcon() {
    if (this.component.undeletable) return nothing;
    return html`
      <div class=editicon part=edit>
        <!-- <span @click=${this.onEdit} style='color: var(--sc-color-blue-500); margin-right: 0.312rem'>
          <sc-icon name="edit-alt--line" size="sm"></sc-icon>
        </span> -->
        <span @mousedown=${this.onDelete} style='color: var(--sc-color-red-500)'>
          <sc-icon name="trash--line" size="sm"></sc-icon>
        </span>
      </div>
    `;
  }

  renderFormField() {
    return html`
      <component-controller
        .updateForm=${this.updateForm} 
        id=${this.id}
        mode=edit 
        .key=${generateUniqueId()} 
        .component=${this.component}
        .value=${this._formData?.find((d: any) => d.id === this.component.id)?.value}
        .customComponent=${this.customComponent}
        @component-value-changed=${this._formAction?.onValueChange}
      ></component-controller>
    `;
  }

  onClose() {
    this._showEditor = false;
  }

  onEdit(e: MouseEvent) {
    e.stopPropagation();
    this._formAction?.onComponentEdit(this.component, this.customComponent);
  }

  onDelete(e: MouseEvent) {
    e.stopPropagation();
    this._showModal = true;
  }

  onModalAction(action: string) {
    if (action === 'delete') {
      this.page?.removeComponent(this.component.id);
      this._formAction.updateFormDefinition();
    }
    this._showModal = false;
  }

  onSideSheetAction(action: string) {
    if (action === 'save') {
      this.page?.updateComponent(this.component.id, this.component);
      this._formAction.updateFormDefinition();
    }
    this._showEditor = false;
  }
  
  renderModal() {
    if (!this._showModal) return nothing;
    return html`
      <sc-modal size=xs no-header open @sc-hide=${() => this.onModalAction('cancel')}>
        Are you sure you want to delete this ${this.component.type.replace('-', ' ')} ?
        <div slot="footer">
          <sc-button size=sm type=secondary @mousedown=${(e: MouseEvent) => {
    e.stopPropagation();
    this.onModalAction('cancel');
  }}>Cancel</sc-button>
          <sc-button size=sm state=error @mousedown=${(e: MouseEvent) => { 
    e.stopPropagation();
    this.onModalAction('delete');
  }}>Delete</sc-button>
        </div>  
      </sc-modal>
    `;
  }

  render() {
    const isActiveComponent = this.component?.id === this.activeComponent?.id;
    return html`
      <div class="row" @mousedown=${this.onEdit}>
        ${this.renderFormField()}
      </div>
      ${
  isActiveComponent ? this.renderEditIcon() : nothing
}
      ${this.renderModal()}
    </div>
    `;
  }
}

if (!window.customElements.get('component-editor')) {
  window.customElements.define('component-editor', ComponentEditor);
}
