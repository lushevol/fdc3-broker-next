import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';

export class Spinner extends FormBaseViewer {
 
  renderLabel: any = () => {};

  renderElement() {
    const { size, color, message } = this.template; 
    return html`
      <sc-spinner
        size=${size}
        color=${color}
        message=${message}
      ></sc-spinner>    
    `;
  }
 
}