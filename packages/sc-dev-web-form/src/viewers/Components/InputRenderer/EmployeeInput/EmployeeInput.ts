import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class EmployeeInput extends FormBaseViewer {
 
  _onValueChange(e: CustomEvent) {
    if (this.onValueChange) {
      this.onValueChange(e.detail.value?.id);
    } else if (this._formAction?.onValueChange) {
      this._formAction?.onValueChange({ detail: {
        value: e.detail.value?.id,
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
      labelSize,
    } = this.template;
    return html`
      <sc-employee-input
        label=${label}
        label-size=${labelSize}
        tooltip=${tooltip}
        .value=${this.getContextValue() || value || defaultValue}
        placeholder=${placeholder}
        help-text=${helpText}
        @sc-select=${(e: CustomEvent) => { this._onValueChange(e); }}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        ?error=${this.invalid}
        error-message=${this.errorMessage}
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-employee-input>
    `;
  }
 
}