import { html, css, PropertyValues, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import type { ELEMENT } from '../../types.js';
import { Component } from '../../../models/Component.js';
import { FormBaseViewer } from '../common/FormBaseViewer.js';

export class CustomComponent extends FormBaseViewer {

  static topLabelSupportedComponents = new Set(['sc-employee-name']);

  static styles = css`
    ${FormBaseViewer.styles}
    .top-label-wrapper {
      margin-bottom: 0.5rem;
    }
  `;

  @property({ type: Object }) component: Component;

  @property({ type: Object }) element: ELEMENT;

  @property({ type: Boolean }) readonly: boolean;
 
  @query('.custom-component-container') container: HTMLElement;

  get shouldShowTopLabelText() {
    const componentName = this.element?.name as string;
    const label = this.component?.template?.label;
    return CustomComponent.topLabelSupportedComponents.has(componentName)
      && typeof label === 'string'
      && label.trim().length > 0;
  }

  willUpdate(properties: PropertyValues) {
    this.createComponent();
  }

  updateElementByProperties(properties: any, element: any) {
    const value = this.component.template?.value || this.component.template?.defaultValue;
    const options = this.component.template?.options;
    const bindKeysField = this.component.template?.bindKeysField;
    const populateType = this.component.template?.populateType;
    if (this.component.template && properties) {
      Object.keys(this.component.template).forEach(key => {  
        if (properties[key]?.type !== 'slot') {
          element[key] = this.component.template?.[key]; 
        }
      });
    }
    
    Object.keys(properties).forEach(p => {
      // @ts-ignore
      const property = properties[p];
      const { bindKey } = property;
      let bindKeyValue;
      switch (populateType) {
      case 'text':
        bindKeyValue = bindKey ? this.component.template?.[bindKey] : null;
        break;
      case 'dataSource':
        bindKeyValue = options && options.length > 0 ? options[0]?.[bindKey] : null;
        break;
      case 'context':
        bindKeyValue = bindKeysField && Object.keys(bindKeysField).length > 0 ? bindKeysField?.[bindKey] : null;
        break;
      default:
        bindKeyValue = '';
        break;
      }
      if (property.type === 'event') {
        const { callback, isExternalFunc } = property;
        if (typeof callback === 'string' && isExternalFunc) {
          const tagName = element?.localName;
          if (tagName) {
            customElements.whenDefined(tagName).then(() => {
              element?.[callback]?.(this.formInstance);
            });
          }
        }
        element.addEventListener(p, (e: any) => {
          if (typeof callback === 'function') {
            callback();
          } else if (typeof callback === 'string') {
            let value = e;
            if (property.eventKey) {
              const keys = property.eventKey.split('.');
              keys.forEach((k: string) => {
                value = value?.[k];
              });
            }
            // @ts-ignore
            this?.[callback]?.(value);
          }
        });
      } else if (property.type === 'slot') {
        element.innerHTML = property.mappingValue && value
          ? this.component.template?.[p] || value
          : this.component.template?.[p] || property.defaultValue;
        if (property.mappingValue && bindKeyValue) {
          element.innerHTML = bindKeyValue;
        }
      } else if (property.type === 'items-slot') {
        const items = this.component.template?.[p];
        if (items) {
          items.forEach((item: any) => {
            const ele = document.createElement(property.slotElement);
            Object.keys(item).forEach(k => {
              if (k === 'slot') {
                ele.innerHTML = item[k];
              } else {
                ele[k] = item[k];
              }
            });
            element.appendChild(ele);
          });
        }
      } else {
        if (property.mappingValue && value) {
          element[p] = this.component.template?.[p] || value;
        }
        if (property.mappingValue && bindKeyValue) {
          element[p] = bindKeyValue;
        }
      }
    });
  }

  createComponent() {
    this.updateComplete.then(() => {
      if (this.element) {
        const { name, properties } = this.element;
        if (name) {
          const existElement: any = this.container.querySelector(name);
          if (existElement) {
            if (properties) {
              this.updateElementByProperties(properties, existElement);
            }
            existElement.readonly = this.readonly;
            if (name && this.errorMessage) {
              existElement.errorMessage = this.errorMessage;
            }
            if (this.component.template.value) {
              existElement.value = this.component.template.value;
            }
            return;
          }
          const element: any = document.createElement(name);
          if (properties) {
            this.updateElementByProperties(properties, element);
          }
          element.readonly = this.readonly;
          element.value = this.component.template.value;
          if (name && this.errorMessage) {
            element.errorMessage = this.errorMessage;
          }
          this.container.innerHTML = '';
          this.container?.append(element);
        }
      }
    });
  }

  renderElement() {
    if (this.show) {
      this.createComponent();
    }
    return html`
      ${this.shouldShowTopLabelText
        ? html`<div class='top-label-wrapper'><sc-label label=${this.component?.template?.label} label-size=md></sc-label></div>`
        : nothing}
      <div class='custom-component-container'></div>
      ${this.errorMessage ? html`<div style='color: var(--sc-color-red-500); font-size: 0.75rem'>${this.errorMessage}</div>` : nothing}
    `;
  }
}