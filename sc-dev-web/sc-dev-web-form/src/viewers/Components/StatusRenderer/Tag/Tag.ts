import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';

export class Tag extends FormBaseViewer {
 
  renderElement() {
    const { label = 'Tag', type, mode, disabled, iconName, maxWidth, defaultValue } = this.template;
    return html`
      <sc-tag
        label=${label}
        type=${type}
        mode=${mode}
        ?disabled=${disabled}
        .iconName=${iconName}
        .maxWidth=${maxWidth}
      >
        ${defaultValue || label}
      </sc-tag>    
    `;
  }
 
}