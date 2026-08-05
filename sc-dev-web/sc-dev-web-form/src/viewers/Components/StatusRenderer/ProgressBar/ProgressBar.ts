import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';

export class ProgressBar extends FormBaseViewer {
 
  renderElement() {
    const { type = 'success', size = 'sm', value, defaultValue, indeterminate, showLabel } = this.template;
    return html`
      <sc-progress-bar
        type=${type}
        size=${size}
        .value=${value || defaultValue}
        ?indeterminate=${indeterminate}
        ?showLabel=${showLabel}
      ></sc-progress-bar>    
    `;
  }
}