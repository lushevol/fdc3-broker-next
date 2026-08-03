import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class PasswordInput extends FormBaseViewer {
 
  renderElement() {
    // @ts-ignore
    const { label, labelSize, value, tooltip, defaultValue, placeholder, helpText, borderType = 'box', disabled, readonly, required } = this.template;
    return html`
      <sc-password-input
        label=${label}
        label-size=${labelSize}
        tooltip=${tooltip}
        value=${value || defaultValue}
        placeholder=${placeholder}
        help-text=${helpText}
        border-type=${borderType}
        @sc-input=${this._onValueChange}
        @sc-blur=${this._onBlur}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        ?error=${this.invalid}
        error-message=${this.errorMessage}
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-password-input>
    `;
  }
 
}