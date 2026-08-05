import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
export class NumberInput extends FormBaseViewer {

  renderElement() {
    // @ts-ignore
    const { label, labelSize, tooltip, value, defaultValue, placeholder, helpText, borderType = 'box', disabled, readonly, required, max, min, type, maxDecimals } = this.template;
    return html`
      <sc-number-input
        label=${label}
        label-size=${labelSize}
        tooltip=${tooltip}
        value=${value || defaultValue}
        placeholder=${placeholder}
        border-type=${borderType}
        .max=${max !== '' ? max : undefined}
        .min=${min !== '' ? min : undefined}
        @sc-input=${(e: CustomEvent)=> {
          if (e.detail?.value) {
            e.detail.value = Number(e.detail.value);
          }
          this._onValueChange(e);
        }}
        @sc-blur=${this._onBlur}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        ?error=${this.invalid}
        error-message=${this.errorMessage}
        type=${type}
        max-decimals=${maxDecimals}
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-number-input>
    `;
  }
 
}