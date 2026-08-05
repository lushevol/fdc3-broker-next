import { html, nothing } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';

const ValidationTypeOptions = [
  {
    label: 'Email validator',
    value: 'email',
  },
  {
    label: 'URL validator',
    value: 'url',
  },
  {
    label: 'Pattern validator',
    value: 'pattern',
  },
];

export class FormattedInputEditor extends FormBaseEditor {
  renderOtherGeneral = () => {
    const { helpText, placeholder, blocks, delimiter } = this.component.template;
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
          label="Placeholder"
          value=${placeholder}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'placeholder')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-text-input
          label="Blocks"
          value=${blocks}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'blocks')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-text-input
          label="Delimiter"
          value=${delimiter}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'delimiter')}
        >
        </sc-text-input>
      </div>
    `;
  };

  renderValidation = () => {
    const { validationType, format } = this.component.template;
    return html`
      <div class=row>
        <sc-dropdown-input
          label="Validation type"
          hoist
          placeholder="Select"
          value=${validationType}
          .data=${ValidationTypeOptions}
          @sc-select=${this.onValidationTypeChange}
        ></sc-dropdown-input>
      </div>
      ${validationType && validationType !== 'url' ? html`
        <div class=row>
          <sc-text-input
            label="Format"
            value=${format}
            @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'format')}
          >
          </sc-text-input>
        </div>
      ` : nothing}
    `;
  };

  onValidationTypeChange(e: CustomEvent) {
    const type = e.detail.value;
    this.onChange(type, 'validationType');
    if (type === 'email') {
      this.onChange('\\w+@sc\\.com', 'format');
    } else if (type === 'url') {
      this.onChange('^(((http|https|ftp):\/\/)|mailto:)+', 'format');
    } else if (type === 'pattern') {
      this.onChange('.*', 'format');
    }
    this.requestUpdate();
  }

  renderOtherBehavior = () => {
    const { maxRow } = this.component.template;
    return html`
      <div class=w-half>
        <sc-switch
          label="Max row"
          ?checked=${maxRow || false}
          @sc-change=${(e: CustomEvent) => {
          this.onChange(e.detail.checked, 'maxRow');
          this.requestUpdate();
        }}
        >
        </sc-switch>
      </div>
    `;
  };

  renderStyleAndLayout = () => {
    const { maxRow, readonlyRows, labelSize = 'md' } = this.component.template;
    return html`
      ${maxRow ? html`
        <div class=row>
          <sc-number-input
            label="Readonly rows"
            value=${readonlyRows}
            border-type="box"
            @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'readonlyRows')}
          >
          </sc-number-input>
        </div>`
      : nothing}
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
      <form-formatted-input .component=${this.component} .key=${this.key}>
      </form-formatted-input>
    `;
  };
}