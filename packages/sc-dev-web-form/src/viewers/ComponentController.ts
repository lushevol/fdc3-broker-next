import { html, css, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';

import { Component } from '../models/Component.js';
import type { ValueChangeFunction, CommentsChangeFunction } from '../shared/formTypes.js';
import ScElement from './utils/sc-element.js';
import { ComponentNames } from '../shared/componentTypes.js';
import { formContext } from './contexts/form-context.js';
import { FormDefinition } from '../models/FormDefinition.js';
import './Components/index.js';
import { watch } from './utils/watch.js';
import type { CUSTOM_COMPONENT } from './types.js';
import { generateUniqueId } from '../shared/generateUniqueId.js';

export class ComponentController extends ScElement {
  static styles = css`
    :host {
      width: 100%;
    }
  `;
  @property({ type: Object }) component: any;

  @property({ type: Object }) customComponent: CUSTOM_COMPONENT;

  @property() value: any;

  @property({ type: String }) mode: 'edit' | 'view' = 'view';

  @property({ type: Boolean }) readonly: boolean;

  @property({ type: Boolean }) invalid: boolean;

  @property({ type: String, attribute: 'error-message' }) errorMessage: string;

  @property({ type: Number }) key: number;

  @property({ type: Boolean, attribute: 'show-properties' }) showProperties: boolean;

  @property({ type: Function }) onValueChange: ValueChangeFunction; 
  
  @property({ type: Function }) onCommentsChange: CommentsChangeFunction;
  
  @property({ type: Function }) updateForm = (components: Component[]) => {};

  // @ts-ignore
  @consume({ context: formContext, subscribe: true })
  @state()
    _formDefinition: FormDefinition;

  get isEditMode() {
    return this.mode === 'edit';
  }

  firstUpdated() {
    this.updateComponent();
  }

  @watch(['component', 'value', 'readonly']) 
  async updateComponent() {
    await this.updateComplete;
    const element: any = this.renderRoot.children[0];
    if (element) {
      element.onValueChange = this._onValueChange.bind(this);
      element.onCommentsChange = this._onCommentsChange.bind(this);
      element.onValueSelect = this._onValueSelect.bind(this);
      element.onBlur = this._onBlur.bind(this);
      if (this.component.type === ComponentNames.TABLE && this.value) {
        this.value?.forEach((v: unknown, index: number) => {
          this.component.template.data[index] = v;
        });
      } else if (this.value !== undefined) {
        this.component.template.value = this.value;
      }
      // element.component = this.component;
    }
  }

  _onCommentsChange(value: any) {
    this.emit('comments-changed', {
      detail: {
          commentsData: value,
      },
    });
  }

  _onValueChange(value: any, manuallyUpdate?: boolean, updateInvalid?: boolean) {
    this.emit('component-value-changed', {
      bubbles: true,
      composed: true,
      detail: {
        value,
        component: this.component,
        manuallyUpdate,
        updateInvalid,
      },
    });
  }

  _onValueSelect(value: any) {
    this.emit('component-value-selected', {
      bubbles: true,
      composed: true,
      detail: {
        value,
        component: this.component,
      },
    });
  }

  _onBlur(value: any) {
    this.emit('component-blur', {
      bubbles: true,
      composed: true,
      detail: {
        value,
        component: this.component,
      },
    });
  }

  renderComponent(component: Component, readonly: boolean) {
    const { type, id, customized } = component;
    const key = generateUniqueId();
    switch (type) {
    case ComponentNames.NUMBERINPUT:
      return this.isEditMode ? 
        html`
          <form-number-input-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-number-input-editor>
        ` :
        html`  
          <form-number-input .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-number-input>
        `;
    case ComponentNames.TEXTFIELD:
      return this.isEditMode ? 
        html`
          <form-text-field-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-text-field-editor>
        ` :
        html`  
          <form-text-field .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-text-field>
        `;
    case ComponentNames.TIMEINPUT:
      return this.isEditMode ? 
        html`
          <form-time-input-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-time-input-editor>
        ` :
        html`  
          <form-time-input .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-time-input>
        `;
    case ComponentNames.DATEDISPLAY:
      return this.isEditMode ? 
        html`
          <form-date-display-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-date-display-editor>
        ` :
        html`  
          <form-date-display .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-date-display>
        `;
    case ComponentNames.DATEINPUT:
      return this.isEditMode ? 
        html`
          <form-date-input-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-date-input-editor>
        ` :
        html`  
          <form-date-input .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-date-input>
        `;
    case ComponentNames.DATERANGEINPUT:
      return this.isEditMode ? 
        html`
          <form-date-range-input-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-date-range-input-editor>
        ` :
        html`  
          <form-date-range-input .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-date-range-input>
        `;
    case ComponentNames.RTE:
      return this.isEditMode ? 
        html`
          <form-rich-text-editor-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-rich-text-editor-editor>
        ` :
        html`  
          <form-rich-text-editor .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-rich-text-editor>
        `;
    case ComponentNames.FILEINPUT:
      return this.isEditMode ? 
        html`
          <form-file-input-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-file-input-editor>
        ` :
        html`  
          <form-file-input .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-file-input>
        `;
    case ComponentNames.FORMATTEDINPUT:
      return this.isEditMode ? 
        html`
          <form-formatted-input-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-formatted-input-editor>
        ` :
        html`  
          <form-formatted-input .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-formatted-input>
        `;
    case ComponentNames.PASSWORDINPUT:
      return this.isEditMode ? 
        html`
          <form-password-input-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-password-input-editor>
        ` :
        html`  
          <form-password-input .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-password-input>
        `;
    case ComponentNames.LABEL:
      return this.isEditMode ? 
        html`
          <form-label-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-label-editor>
        ` :
        html`  
          <form-label .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-label>
        `;
    case ComponentNames.TITLE:
      return this.isEditMode ? 
        html`
          <form-title-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-title-editor>
        ` :
        html`  
          <form-title .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-title>
        `;
    case ComponentNames.PARAGRAPH:
      return this.isEditMode ? 
        html`
          <form-paragraph-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-paragraph-editor>
        ` :
        html`  
          <form-paragraph .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-paragraph>
        `;
    case ComponentNames.CARDNUMBERINPUT:
      return this.isEditMode ? 
        html`
          <form-card-number-input-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-card-number-input-editor>
        ` :
        html`  
          <form-card-number-input .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-card-number-input>
        `;
    case ComponentNames.RATING:
      return this.isEditMode ? 
        html`
          <form-rating-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-rating-editor>
        ` :
        html`  
          <form-rating .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-rating>
        `;
    case ComponentNames.TOGGLE:
      return this.isEditMode ? 
        html`
          <form-toggle-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-toggle-editor>
        ` :
        html`  
          <form-toggle .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-toggle>
        `;
    case ComponentNames.TAG:
      return this.isEditMode ? 
        html`
          <form-tag-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-tag-editor>
        ` :
        html`  
          <form-tag .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-tag>
        `;
    case ComponentNames.CONTENTLOADER:
      return this.isEditMode ? 
        html`
          <form-content-loader-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-content-loader-editor>
        ` :
        html`  
          <form-content-loader .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-content-loader>
        `;
    case ComponentNames.SWITCH:
      return this.isEditMode ? 
        html`
          <form-switch-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-switch-editor>
        ` :
        html`  
          <form-switch .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-switch>
        `;
    case ComponentNames.BUTTON:
      return this.isEditMode ? 
        html`
          <form-button-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-button-editor>
        ` :
        html`  
          <form-button .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-button>
        `;
    case ComponentNames.LINK:
      return this.isEditMode ? 
        html`
          <form-link-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-link-editor>
        ` :
        html`  
          <form-link .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-link>
        `;
    case ComponentNames.CHECKBOX:
      return this.isEditMode ? 
        html`
          <form-checkbox-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-checkbox-editor>
        ` :
        html`  
          <form-checkbox .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-checkbox>
        `;
    case ComponentNames.RADIOGROUP:
      return this.isEditMode ? 
        html`
          <form-radio-group-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-radio-group-editor>
        ` :
        html`  
          <form-radio-group .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-radio-group>
        `;
    case ComponentNames.DROPDOWNINPUT:
      return this.isEditMode ? 
        html`
          <form-dropdown-input-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-dropdown-input-editor>
        ` :
        html`  
          <form-dropdown-input .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-dropdown-input>
        `;
    case ComponentNames.DROPDOWNMULTISELECT:
      return this.isEditMode ? 
        html`
          <form-dropdown-multi-select-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-dropdown-multi-select-editor>
        ` :
        html`  
          <form-dropdown-multi-select .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-dropdown-multi-select>
        `;
    case ComponentNames.EMPLOYEEINPUT:
      return this.isEditMode ? 
        html`
          <form-employee-input-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-employee-input-editor>
        ` :
        html`  
          <form-employee-input .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-employee-input>
        `;
    case ComponentNames.EMPLOYEEMULTIINPUT:
      return this.isEditMode ? 
        html`
          <form-employee-multi-input-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-employee-multi-input-editor>
        ` :
        html`  
          <form-employee-multi-input .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-employee-multi-input>
        `;
    case ComponentNames.BUTTONGROUP:
      return this.isEditMode ? 
        html`
          <form-button-group-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-button-group-editor>
        ` :
        html`  
          <form-button-group .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-button-group>
        `;
    case ComponentNames.ACCORDION:
      return this.isEditMode ? 
        html`
          <form-accordion-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-accordion-editor>
        ` :
        html`  
          <form-accordion .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-accordion>
        `;
    case ComponentNames.BOX:
      return this.isEditMode ? 
        html`
          <form-box-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-box-editor>
        ` :
        html`  
          <form-box .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-box>
        `;
    case ComponentNames.DYNAMICDISPLAY:
      return this.isEditMode ? 
        html`
          <form-dynamic-display-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-dynamic-display-editor>
        ` :
        html`  
          <form-dynamic-display .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-dynamic-display>
        `;
    case ComponentNames.BANNER:
      return this.isEditMode ? 
        html`
          <form-banner-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-banner-editor>
        ` :
        html`  
          <form-banner .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-banner>
        `;
    case ComponentNames.IMAGE:
      return this.isEditMode ? 
        html`
          <form-image-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-image-editor>
        ` :
        html`  
          <form-image .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-image>
        `;
    case ComponentNames.REPEATER:
      return this.isEditMode ? 
        html`
          <form-repeater-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-repeater-editor>
        ` :
        html`  
          <form-repeater .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-repeater>
        `;
    case ComponentNames.TABS:
      return this.isEditMode ? 
        html`
          <form-tabs-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-tabs-editor>
        ` :
        html`  
          <form-tabs .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-tabs>
        `;
    case ComponentNames.ICON:
      return this.isEditMode ? 
        html`
          <form-icon-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-icon-editor>
        ` :
        html`  
          <form-icon .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-icon>
        `;
    case ComponentNames.PROGRESSBAR:
      return this.isEditMode ? 
        html`
          <form-progress-bar-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-progress-bar-editor>
        ` :
        html`  
          <form-progress-bar .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-progress-bar>
        `;
    case ComponentNames.SPINNER:
      return this.isEditMode ? 
        html`
          <form-spinner-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-spinner-editor>
        ` :
        html`  
          <form-spinner .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-spinner>
        `;
    case ComponentNames.STEPPER:
      return this.isEditMode ? 
        html`
          <form-stepper-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-stepper-editor>
        ` :
        html`  
          <form-stepper .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-stepper>
        `;
    case ComponentNames.GRID1COLUMN:
      return this.isEditMode ? 
        html`
          <form-grid-1-column-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-grid-1-column-editor>
        ` :
        html`  
          <form-grid-1-column .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-grid-1-column>
        `;
    case ComponentNames.GRID2COLUMNS:
      return this.isEditMode ? 
        html`
          <form-grid-2-columns-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-grid-2-columns-editor>
        ` :
        html`  
          <form-grid-2-columns .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-grid-2-columns>
        `;
    case ComponentNames.GRID3COLUMNS:
      return this.isEditMode ? 
        html`
          <form-grid-3-columns-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-grid-3-columns-editor>
        ` :
        html`  
          <form-grid-3-columns .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-grid-3-columns>
        `;
    case ComponentNames.TABLE:
      return this.isEditMode ? 
        html`
          <form-table-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-table-editor>
        ` :
        html`  
          <form-table .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-table>
        `;
    case ComponentNames.DATAVIEW:
      return this.isEditMode ? 
        html`
          <form-data-view-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-data-view-editor>
        ` :
        html`  
          <form-data-view .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-data-view>
        `;
    case ComponentNames.DIVIDER:
      return this.isEditMode ? 
        html`
          <form-divider-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-divider-editor>
        ` :
        html`  
          <form-divider .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-divider>
        `;
    case ComponentNames.SPACER:
      return this.isEditMode ? 
        html`
          <form-spacer-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-spacer-editor>
        ` :
        html`  
          <form-spacer .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-spacer>
        `;
    case ComponentNames.DOCUMENTVIEWER:
      return this.isEditMode ? 
        html`
          <form-document-viewer-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-spacer-editor>
        ` :
        html`  
          <form-document-viewer .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-spacer>
          `;
    case ComponentNames.CAROUSEL:
      return this.isEditMode ? 
        html`
          <form-carousel-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-carousel-editor>
        ` :
        html`  
          <form-carousel .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-carousel>
        `;
    case ComponentNames.COMMENTS:
      return this.isEditMode ? 
        html`
          <form-comments-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-comments-editor>
        ` :
        html`  
          <form-comments .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-comments>
        `;
    case ComponentNames.MODAL:
      return this.isEditMode ? 
        html`
          <form-modal-editor .updateForm=${this.updateForm} .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties}></form-modal-editor>
        ` :
        html`
          <form-modal .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage}></form-modal>
        `;
    default:
      if (customized) {
        return this.isEditMode ? 
          html`
            <form-custom-component-editor .component=${component} .key=${key} id=${id} ?show-properties=${this.showProperties} .settings=${this.customComponent?.settings} .element=${this.customComponent?.element}></form-custom-component-editor>
          ` :
          html`  
            <form-custom-component .component=${component} .key=${key} id=${id} ?readonly=${readonly} ?invalid=${this.invalid} error-message=${this.errorMessage} .element=${this.customComponent?.element}></form-custom-component>
          `;
      }
      return '';
    }
  }

  render() {
    return html`
      ${this.renderComponent(this.component, this.readonly)}
    `;
  }
}
if (!window.customElements.get('component-controller')) {
  window.customElements.define('component-controller', ComponentController);
}
