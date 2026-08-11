import { html } from 'lit';
import { RepeaterBaseMixin } from './RepeaterBaseMixin.js';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import type { Component } from '../../../../models/Component.js';

export class Repeater extends RepeaterBaseMixin(FormBaseViewer) {

  repeat() {
    this._repeatTimes += 1;
    this.addNewGroup();
    this.component?.updateTemplate('repeatTimes', this._repeatTimes);
    this.emit('form-updated', {
      composed: true,
      bubbles: true,
      detail: {
        definition: this.formDefinition,
      },
    });
  }

  deleteGroup(index: number) {
    if (this.component.components) {
      this.component.components = this.component.components.filter((c: Component) => c.repeatGroupIndex !== index);
      this._repeatTimes -= 1;
      this.component?.updateTemplate('repeatTimes', this._repeatTimes);
      this.requestUpdate();
    }
  }

  renderElement = () => {
    const { id } = this.component;
    const { label, type, buttonText, repeatTimes = 1 } = this.component?.template ?? {};
    const arr = new Array(repeatTimes).fill(null);
    return html`
      ${arr.map((d, index) => html`
        <sc-box class='repeater-box' type=${type || 'transparent'}>
          <div class='box-body' id="${id}">
            <div style='margin-bottom: 1rem'>
              <sc-label
                label="${label}"
                label-size=lg
              ></sc-label>
            </div>
            ${
  this.generateComponent(this.getComponentsByIndex(index), true, this.key, this.formData, this.component, this.readonly)
}
          </div>
          ${this.renderDeleteIcon(index)}
        </sc-box>`)
}
      <sc-button @click=${this.repeat}>${buttonText}</sc-button>
    `;
  };
}