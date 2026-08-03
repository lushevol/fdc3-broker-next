import { html } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';
import '../../common/DynamicDateValidator.js';

export class DateRangeInputEditor extends FormBaseEditor {
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

  renderOtherGeneral: any = () => {
    const { helpText, startPlaceholder, endPlaceholder, format } = this.component?.template ?? {};
    return html`
      <div class=row>
        <sc-label label='Description'></sc-label>
        <sc-rich-text-editor-v2
          .toolbar=${this.simpleToolbars}
          value=${helpText}
          @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.text, 'helpText');
    this.requestUpdate();
  }}
        >
        </sc-rich-text-editor-v2>
      </div>
      <div class=row>
        <sc-text-input
          label="Start date placeholder"
          value=${startPlaceholder}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'startPlaceholder')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-text-input
          label="End date placeholder"
          value=${endPlaceholder}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'endPlaceholder')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-text-input
          label="Format"
          value=${format}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'format')}
        >
        </sc-text-input>
      </div>
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
      <form-date-range-input .component=${this.component} .key=${this.key}>
      </form-date-range-input>
    `;
  };
}