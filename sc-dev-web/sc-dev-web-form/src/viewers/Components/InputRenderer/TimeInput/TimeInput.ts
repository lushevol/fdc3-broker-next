import { html, css, LitElement } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class TimeInput extends FormBaseViewer {
 
  renderElement() {
    // @ts-ignore
    const { label, labelSize, tooltip, value, defaultValue, placeholder, helpText, borderType = 'box', disabled, readonly, required } = this.template;
    return html`
      <sc-time-input
        label=${label}
        label-size=${labelSize}
        tooltip=${tooltip}
        value=${value || defaultValue}
        placeholder=${placeholder}
        border-type=${borderType}
        @sc-input=${this._onValueChange}
        @sc-blur=${this._onBlur}
        hoist
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        ?error=${this.invalid}
        error-message=${this.errorMessage}
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-time-input>
    `;
  }
 
}