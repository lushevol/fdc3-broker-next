import { html } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';
import '../../common/DynamicDateValidator.js';

export class DateInputEditor extends FormBaseEditor {

  renderOtherGeneral = () => {
    const { format } = this.component.template;
    return html`
      <sc-text-input
        label="Format"
        value=${format}
        @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'format')}
      >
      </sc-text-input>
    `;
  };

  renderValidation = () => {
    const { type, max, min, dynamicDate = {} } = this.component.template;
    return html`
      <dynamic-date-validator
        type=${type}
        min=${min}
        max=${max}
        .dynamicDate=${dynamicDate}
        @value-changed=${(e: CustomEvent) => {
    this.onChange(e.detail.value, e.detail.name);
    this.requestUpdate();
  }}
      >
      </dynamic-date-validator>
    `;
  };

  renderStyleAndLayout = () => {
    const { labelSize } = this.component.template;
    return html`
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Label size"
          value=${labelSize}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'labelSize')}
        >
          <sc-radio value=sm>SM</sc-radio>
          <sc-radio value=md>MD</sc-radio>
          <sc-radio value=lg>LG</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-date-input .component=${this.component} .key=${this.key}>
      </form-date-input>
    `;
  };
}