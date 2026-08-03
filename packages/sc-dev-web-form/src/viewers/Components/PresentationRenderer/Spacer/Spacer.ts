import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';

export class Spacer extends FormBaseViewer {
 
  renderElement() {
    const { size, vertical = true } = this.template;
    return html`
      <sc-spacer
        size=${size}
        ?vertical=${vertical}
      >
      </sc-spacer>
    `;
  }
 
}