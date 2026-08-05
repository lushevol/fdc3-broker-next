import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';

export class Link extends FormBaseViewer {
 
  renderElement() {
    const { label, href, block, disabled, target } = this.template;
    return html`
      <sc-link
        href=${href}
        ?block=${block}
        ?disabled=${disabled}
        target=${target}
      >
        ${label}
      </sc-link>
    `;
  }
 
}