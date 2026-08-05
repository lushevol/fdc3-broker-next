import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import type { OptionBase } from '../../../../models/base/OptionBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
export class DropdownInput extends FormBaseViewer {
 
  renderElement() {
    // @ts-ignore
    const { label, labelSize, tooltip, value, defaultValue, readonly, disabled, required, borderType = 'box', options, placeholder, helpText, maxRows, readonlyRows } = this.template;
    const _options = this.getFilterOption(options);
    return html`
      <sc-dropdown-input
        label=${label}
        label-size=${labelSize}
        tooltip=${tooltip}
        value=${ value || defaultValue}
        placeholder=${placeholder}
        help-text=${helpText}
        border-type=${borderType}
        @sc-select=${this._onValueChange}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        hoist
        ?error=${this.invalid}
        error-message=${this.errorMessage}
        .data=${this.getContextValue() || _options}
        ?max-rows=${maxRows} 
        readonly-rows=${readonlyRows}
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-dropdown-input>
    `;
  }
 
}