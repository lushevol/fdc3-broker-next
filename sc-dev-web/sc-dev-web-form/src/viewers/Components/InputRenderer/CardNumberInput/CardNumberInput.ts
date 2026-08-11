import { html, css, LitElement } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
export class CardNumberInput extends FormBaseViewer {
 
  renderElement() {
    // @ts-ignore
    const { label, labelSize, tooltip, value, defaultValue, placeholder, helpText, borderType = 'box', disabled, readonly, required, maxLength, textAlign, size, iconSize } = this.template;
    return html`
      <sc-card-number-input
        label=${label}
        label-size=${labelSize}
        tooltip=${tooltip}
        value=${value || defaultValue}
        placeholder=${placeholder}
        border-type=${borderType}
        @sc-input=${this._onValueChange}
        @sc-blur=${this._onBlur}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        ?error=${this.invalid}
        error-message=${this.errorMessage}
        .maxLength=${maxLength}
        text-align=${textAlign}
        size=${size}
        icon-size=${iconSize}
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-card-number-input>
    `;
  }
 
}