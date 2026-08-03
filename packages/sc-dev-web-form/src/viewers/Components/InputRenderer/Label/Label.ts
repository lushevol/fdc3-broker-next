import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
export class Label extends FormBaseViewer {
 
  renderElement() {
    // @ts-ignore
    const { 
      label = 'Label',
      tooltip,
      labelSize = 'md',
      tooltipPlacement = 'top', 
      required,
      value,
      defaultValue,
    } = this.template;

    return html`
      <sc-label
        tooltip=${tooltip}
        .labelSize=${labelSize}
        .tooltipPlacement=${tooltipPlacement}
        ?required=${required}
      >
        <div slot="label" >
          <div class="sc-label-wrapper">
            <div class="sc-label-text">${(this.getContextValue() || value || defaultValue && unsafeHTML(defaultValue) || label)}</div>
          </div>
        </div>
      </sc-label>
    `;
  }
 
}