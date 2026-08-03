import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import type { OptionBase } from '../../../../models/base/OptionBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class RadioGroup extends FormBaseViewer {
 
  renderElement() {
    // @ts-ignore
    const { label, labelSize, tooltip, value, defaultValue, readonly, direction, disabled, required, options, helpText } = this.template;
    const _options = this.getFilterOption(options);
    
    return html`
      <sc-radio-group
        columns=3
        label=${label}
        label-size=${labelSize}
        tooltip=${tooltip}
        value=${value || defaultValue}
        help-text=${helpText}
        direction=${direction}
        ?readonly=${readonly || this.readonly}
        ?required=${required}
        ?disabled=${disabled}
        ?error=${this.invalid}
        error-message=${this.errorMessage}
        @sc-change=${this._onValueChange}
      >
        ${_options && _options.length > 0 ? _options.map((option: OptionBase) => html`
          <sc-radio value=${option.value} ?disabled=${disabled}>${option.label}</sc-radio>
        `) : html`
          <sc-radio 
            value=${value} 
            @sc-change=${this._onValueChange} 
            ?readonly=${readonly || this.readonly}
            ?disabled=${disabled}
            ?required=${required}
          >${label}</sc-radio>
        `}
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-radio-group>
    `;
  }
}