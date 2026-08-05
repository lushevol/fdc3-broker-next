import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';

export class Icon extends FormBaseViewer {
 
  renderElement() {
    const { name = 'home--line', size = 'sm' } = this.template;
    return html`
      <sc-icon
        name=${name}
        size=${size}
      ></sc-icon>    
    `;
  }
}