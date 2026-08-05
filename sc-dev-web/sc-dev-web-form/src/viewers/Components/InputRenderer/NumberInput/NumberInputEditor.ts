import { html } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';

export class NumberInputEditor extends FormBaseEditor {
  handleChange = (value: any, field: string) => {
    this.onChange(value, field);
    this.requestUpdate();
  };

  renderOtherGeneral = () => {
    const { type = 'number', maxDecimals, helpText, placeholder } = this.component.template;
    return html`
      <div class=row>
        <sc-label label='Description'></sc-label>
        <sc-rich-text-editor-v2
          value=${helpText}
          .toolbar=${this.simpleToolbars}
          @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.text, 'helpText');
    this.requestUpdate();
  }}
        >
        </sc-rich-text-editor-v2>
      </div>
      <div class=row>
        <sc-text-input
          label="Placeholder"
          value=${placeholder}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'placeholder')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-radio-group
          direction=horizontal
          label=Type
          value=${type}
          @sc-change=${(e: CustomEvent) => this.handleChange(e.detail.value, 'type')}
        >
          <sc-radio value=number>Number</sc-radio>
          <sc-radio value=digit>Digit</sc-radio>
        </sc-radio-group>
      </div>
      ${type === 'digit'
    ? html`
            <div class="row">
              <sc-number-input
                label="Decimal Places"
                value=${maxDecimals}
                border-type="box"
                @sc-input=${(e: CustomEvent) =>
    this.handleChange(e.detail.value, 'maxDecimals')}
              >
              </sc-number-input>
            </div>
          `
    : ''}
    `;
  };
  renderValidation = () => {
    const { max, min } = this.component.template;
    return html`
      <div class=row>
        <sc-number-input
          label="Min value"
          value=${min}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'min')}
        >
        </sc-number-input>
      </div>
      <div class=row>
        <sc-number-input
          label="Max value"
          value=${max}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'max')}
        >
        </sc-number-input>
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
      <form-number-input .component=${this.component} .key=${this.key}>
      </form-number-input>
    `;
  };
}