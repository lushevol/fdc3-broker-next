import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
export class Rating extends ComponentMixin(FormBaseViewer) {
 
  renderElement() {
    const { 
      label,
      tooltip,
      value, 
      defaultValue,
      placeholder, 
      helpText, 
      borderType = 'line', 
      disabled, 
      readonly, 
      required,
      mode,
      max,
      size,
      options,
      firstLowerText,
      lastLowerText,
      optionLabel,
    } = this.template;
    return html`
      <sc-rating
        label=${label}
        tooltip=${tooltip}
        value=${value || defaultValue}
        placeholder=${placeholder}
        help-text=${helpText}
        border-type=${borderType}
        @sc-change=${this._onValueChange}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        mode=${mode}
        max=${max}
        size=${size}
        .options=${options}
        first-lower-text=${optionLabel[0] === 'custom' ? firstLowerText : optionLabel[0]}
        last-lower-text=${optionLabel[0] === 'custom' ? lastLowerText : optionLabel[1]}
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-rating>
    `;
  }
 
}