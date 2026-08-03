import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
export class EmployeeMultiInput extends FormBaseViewer {
 
  _onValueChange(e: CustomEvent) {
    const ids = e.detail.value?.map((v: any) => v.id);
    if (this.onValueChange) {
      this.onValueChange(ids);
    } else if (this._formAction?.onValueChange) {
      this._formAction?.onValueChange({ detail: {
        value: ids,
        component: this.component,
      } });
    }
  }

  renderElement() {
    const { 
      label,
      tooltip,
      value, 
      defaultValue,
      placeholder, 
      helpText, 
      disabled, 
      readonly, 
      required,
      minCount,
      maxCount,
      labelSize,
    } = this.template;
    return html`
      <sc-employee-multi-input
        label=${label}
        label-size=${labelSize}
        tooltip=${tooltip}
        .value=${Array.isArray(value || defaultValue) ? (value || defaultValue) : JSON.parse(value || defaultValue || '[]') }
        placeholder=${placeholder}
        help-text=${helpText}
        .minCount=${minCount}
        .maxCount=${maxCount}
        @sc-select=${(e: CustomEvent) => { this._onValueChange(e); }}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        ?error=${this.invalid}
        error-message=${this.errorMessage}
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-employee-multi-input>
    `;
  }
 
}