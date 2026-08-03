import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';

export class Divider extends FormBaseViewer {
 
  renderElement() {
    const { size, textAlign, vertical, title, labelSize } = this.template;
    return html`
      <sc-divider
        size=${size}
        text-align=${textAlign}
        ?vertical=${vertical}
        title= ${title}
        label-size=${labelSize}
      >
      </sc-divider>
    `;
  }
 
}