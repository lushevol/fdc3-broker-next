import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import type { OptionBase } from '../../../../models/base/OptionBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class ButtonGroup extends FormBaseViewer {
 
  renderElement() {
    const { label, tooltip, value, size, labelSize, defaultValue, readonly, disabled, required, options, singleSelect, helpText } = this.template;
    const _defaultValue = defaultValue?.split(',');

    return html`
      <sc-button-group
        label=${label}
        tooltip=${tooltip}
        size=${size || 'md'}
        labelSize=${labelSize || 'md'}
        .value=${value || _defaultValue}
        @sc-select=${this._onValueChange}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        ?multiple=${singleSelect}
        help-text=${helpText}
      >
        ${
  options?.map((option: OptionBase) => html`
            <sc-button-group-item value=${option.value}>${option.label}</sc-button-group-item>
          `)}
          <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-button-group>
    `;
  }
 
}