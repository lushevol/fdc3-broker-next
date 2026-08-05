import { html, css, LitElement } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
export class FormattedInput extends FormBaseViewer {
 
  renderElement() {
    // @ts-ignore
    const { label, labelSize, value, tooltip, defaultValue, placeholder, helpText, format = '.*', blocks, delimiter, borderType = 'box', disabled, readonly, required, maxRows, readonlyRows } = this.template;
    return html`
      <sc-formatted-input
        label=${label}
        label-size=${labelSize}
        tooltip=${tooltip}
        value=${value || defaultValue}
        placeholder=${placeholder}
        border-type=${borderType}
        .format=${format}
        .blocks=${blocks}
        .delimiter=${delimiter}
        auto-show-error
        @sc-input=${this._onValueChange}
        @sc-blur=${this._onBlur}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        ?error=${this.invalid}
        error-message=${this.errorMessage}
        ?max-rows=${maxRows}
        readonly-rows=${readonlyRows}
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-formatted-input>
    `;
  }
 
}