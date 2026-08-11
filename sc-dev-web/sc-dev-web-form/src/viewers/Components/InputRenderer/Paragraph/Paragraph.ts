import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';

export class Paragraph extends FormBaseViewer {
 
  renderElement() {
    // @ts-ignore
    const { 
      label = 'Paragraph',
      size,
      ellipsis,
      rows,
      defaultValue,
    } = this.template;

    return html`
      <sc-paragraph
        size=${size}
        ?ellipsis=${ellipsis}
        rows=${rows}
      >
        ${this.getContextValue() || defaultValue || label}
      </sc-paragraph>
    `;
  }
 
}