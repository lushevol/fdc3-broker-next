import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import type { OptionBase } from '../../../../models/base/OptionBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class Checkbox extends FormBaseViewer {
 
  renderElement() {
    // @ts-ignore
    const { label, labelSize, tooltip, value, defaultValue, readonly, disabled, required, direction, options, helpText } = this.template;
    const _defaultValue = options ? defaultValue?.split(',') : defaultValue;
    const _options = this.getFilterOption(options);
    return html`
      ${
  _options && _options.length > 0 ? 
    html`
                  <sc-checkbox-group
                    label=${label}
                    label-size=${labelSize}
                    tooltip=${tooltip}
                    .value=${value || _defaultValue || []}
                    help-text=${helpText}
                    direction=${direction}
                    ?readonly=${readonly || this.readonly}
                    ?required=${required}
                    ?error=${this.invalid}
                    error-message=${this.errorMessage}
                    @sc-change=${this._onValueChange}
                  >
                    ${_options?.map((option: OptionBase) => html`
                      <sc-checkbox value=${option.value} ?disabled=${disabled}>${option.label}</sc-checkbox>
                    `)}
                    <div slot="help">${unsafeHTML(helpText)}</div>
                  </sc-checkbox-group>
                ` : 
    html`
                  <sc-checkbox 
                    value=${value || _defaultValue} 
                    help-text=${helpText}
                    @sc-change=${this._onValueChange} 
                    ?readonly=${readonly || this.readonly}
                    ?disabled=${disabled}
                    ?required=${required}
                  >
                    ${label}
                    <div slot="help">${unsafeHTML(helpText)}</div>
                  </sc-checkbox>
                `
}
      
    `;
  }
 
}