import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';

export class Title extends FormBaseViewer {
 
  renderElement() {
    // @ts-ignore
    const { 
      label = 'Title',
      level,
      ellipsis,
      rows,
      hero,
      defaultValue,
    } = this.template;

    return html`
      <sc-title
        level=${level}
        ?ellipsis=${ellipsis}
        ?hero=${hero}
        rows=${rows}
      >
        ${this.getContextValue() || defaultValue || label }
      </sc-title>
    `;
  }
 
}