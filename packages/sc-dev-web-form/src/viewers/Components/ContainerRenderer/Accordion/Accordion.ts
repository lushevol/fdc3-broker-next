import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';

export class Accordion extends ComponentMixin(FormBaseViewer) {
   
  renderElement() {
    const { 
      labelSize = 'sm',
      open = true,
    } = this.template;
    return html`
      <sc-accordion summary-line="0" open icon-position="right" .labelSize=${labelSize} .open=${open} >
        <div slot="summary" style='font-weight: 600'>
          ${
  this.component.template?.label
}
        </div>
        ${
  this.generateComponent(this.component.components, true, this.key, this.formData, this.component, this.readonly)
}
        </sc-accordion>
      `;
  }
 
}