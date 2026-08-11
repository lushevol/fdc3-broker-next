import { html,nothing } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';

export class Box extends ComponentMixin(FormBaseViewer) {
 
  renderElement() {
    // @ts-ignore
    const { id } = this.component;
    const { label, tooltip, type, labelSize } = this.component?.template ?? {};
    return html`
        <sc-box type=${type || 'default'}>
          <div class='box-body' id="${id}">
          ${label ? html`<div style='margin-bottom: 1rem'>
            <sc-label
              label=${label}
              tooltip=${tooltip}
              label-size=${labelSize}
            ></sc-label>
          </div>` : nothing }
            <div class="row">
              ${
  this.generateComponent(this.component.components, true, this.key, this.formData, this.component, this.readonly)
}
            </div>
          </div>
        </sc-box>
      `;
  }
 
}