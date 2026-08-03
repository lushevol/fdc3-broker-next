import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import type { OptionBase } from '../../../../models/base/OptionBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class DropdownMultiSelect extends FormBaseViewer {
 
  renderElement() {
    const {
      label,
      labelSize,
      tooltip,
      value,
      defaultValue,
      readonly,
      disabled,
      borderType = 'box',
      required,
      options,
      placeholder,
      helpText,
      maxRows,
      maxRow,
      readonlyRows,
      multipleRows,
      selectAll,
    } = this.template;
    const shouldUseMaxRows = maxRows ?? maxRow;
    const selectedValue = value ?? defaultValue;
    const _options = this.getFilterOption(options);
    return html`
      <sc-dropdown-multi-select
        label=${label}
        label-size=${labelSize}
        tooltip=${tooltip}
        .value=${selectedValue}
        placeholder=${placeholder}
        help-text=${helpText}
        border-type=${borderType}
        hoist
        @sc-select=${this._onValueChange}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        ?error=${this.invalid}
        error-message=${this.errorMessage}
        .data=${this.getContextValue() || _options}
        ?select-all=${selectAll || false}
        ?multiple-rows=${multipleRows ?? false}
        ?max-rows=${shouldUseMaxRows}
        readonly-rows=${readonlyRows} 
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-dropdown-multi-select>
    `;
  }
 
}