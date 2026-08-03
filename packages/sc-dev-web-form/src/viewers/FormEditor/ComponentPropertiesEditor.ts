import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { Component } from '../../models/Component.js';
import type { CUSTOM_COMPONENT } from '../types.js';

export class ComponentPropertiesEditor extends LitElement {

  @property({ type: Object }) component: Component;

  @property({ type: Object }) customComponent: CUSTOM_COMPONENT;

  static styles = css`
    .row {
      padding: 0.312rem 0;
    }
    .form-row {
      display: flex;
      padding: 0.312rem 0;
    }
    .form-row sc-text-input {
      margin-right: 0.625rem;
    }
    .add-button {
      margin: 0.625rem 0;
      cursor: pointer;
      color: #0473ea;
      text-align: right;
    }
  `;

  renderPropertyField() {
    return html`
      <component-controller mode=edit .component=${this.component} show-properties .customComponent=${this.customComponent}></component-controller>
    `;
  }

  render() {
    if (!this.component)
      return html`
        <div>Please select the component to edit it properties!!</div>
      `;
    return html`
      <div>
        ${this.renderPropertyField()}
      </div>
    `;
  }
}

if (!window.customElements.get('component-properties-editor')) {
  window.customElements.define('component-properties-editor', ComponentPropertiesEditor);
}
