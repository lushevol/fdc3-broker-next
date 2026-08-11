import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import type { OptionBase } from '../../../../models/base/OptionBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
export class Toggle extends FormBaseViewer {
 
  renderElement() {
    const { 
      label,
      labelSize,
      tooltip,
      value,
      defaultValue, 
      placeholder, 
      helpText, 
      borderType = 'line', 
      disabled, 
      readonly, 
      required,
      size = 'xxs',
      options,
    } = this.template;
    return html`
      <sc-toggle
        label=${label}
        label-size=${labelSize}
        label-size=md
        tooltip=${tooltip}
        value=${value || defaultValue || options?.[0]?.value}
        placeholder=${placeholder}
        help-text=${helpText}
        border-type=${borderType}
        @sc-select=${this._onValueChange}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        size=${size}
      >
      ${
  options?.map((option: OptionBase) => html`
          <sc-toggle-option value=${option.value}>${option.label}</sc-toggle-option>
        `)}
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-toggle>
    `;
  }
 
}