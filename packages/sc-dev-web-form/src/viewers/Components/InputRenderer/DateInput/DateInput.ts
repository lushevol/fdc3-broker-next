import { html, css, LitElement } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { generateDynamicDate } from '../../../../shared/utils.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class DateInput extends FormBaseViewer {
 
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
      min,
      max,
      type,
      format,
      dynamicDate = {},
      labelSize,
    } = this.template;
    const {
      minDateType,
      minDateRule,
      minValue,
      maxDateType,
      maxDateRule,
      maxValue,
    } = dynamicDate;
    return html`
      <sc-date-input
        label=${label}
        tooltip=${tooltip}
        value=${value || defaultValue}
        placeholder=${placeholder}
        hoist
        min=${type === 'fixed' ? min : generateDynamicDate(minValue, minDateType, minDateRule)}
        max=${type === 'fixed' ? max : generateDynamicDate(maxValue, maxDateType, maxDateRule)}
        format=${format || 'DD MMM YYYY'}
        @sc-change=${this._onValueChange}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        ?error=${this.invalid}
        error-message=${this.errorMessage}
        label-size=${labelSize}
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-date-input>
    `;
  }
 
}