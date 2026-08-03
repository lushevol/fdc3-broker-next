import { html } from 'lit';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';
import { CompactSize } from '../../../../shared/utils.js';
import { state } from 'lit/decorators.js';
import { Option } from '../../../../models/Components/RatingTemplate.js';

export class RatingEditor extends FormBaseEditor {
  @state() _options: Option[] = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
  ];

  willUpdate() {
    const { options } = this.component.template;
    if (options.length > 0)
      this._options = options;
  }

  addOption() {
    this._options = [
      ...this._options,
      {
        label: `${this._options.length + 1 }`,
        value: this._options.length + 1,
      },
    ];
    this.onChange(this._options, 'options');
    this.requestUpdate();
  }

  deleteOption(index: number) {
    if (this._options.length === 1) return;
    this._options.splice(index, 1);
    this.onChange(JSON.parse(JSON.stringify(this._options)), 'options');
    this.requestUpdate();
  }

  updateOption(value: Option, index: number) {
    const options: Option = this._options[index];
    if (options) {
      this._options[index] = value;
      this._options = this.getFilterOption(this._options);
      this.onChange(JSON.parse(JSON.stringify(this._options)), 'options');
      this.requestUpdate();
    }
  }

  renderOtherGeneral = () => {
    const { max, helpText, mode, optionLabel, firstLowerText, lastLowerText } = this.component.template;
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
        <sc-radio-group
          columns=2
          direction=horizontal
          label="Mode"
          value=${mode}
          @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.value, 'mode');
    if (e.detail.value === 'button') {
      this.onChange(this._options, 'options');
    }
    this.requestUpdate();
  }}
        >
          <sc-radio value=default>Default</sc-radio>
          <sc-radio value=button>Button</sc-radio>
        </sc-radio-group>
      </div>
      ${mode !== 'button' ? html`<div class=row>
          <sc-number-input
            label="Max"
            value=${max}
            border-type="box"
            @sc-input=${(e: CustomEvent) =>{
    this.onChange(e.detail.value, 'max');
  }}
          >
          </sc-number-input>
        </div>` : html`<div class=row>
          <sc-dropdown-input
            label="Option label"
            hoist
            value=${optionLabel}
            @sc-select=${(e: CustomEvent) => {
    this.onChange(e.detail.value.split(','), 'optionLabel');
    this.requestUpdate();
  }}
          >
            <sc-dropdown-option value='Least likely,Most likely'>Least likely, Most likely</sc-dropdown-option>
            <sc-dropdown-option value='Disagree,Agree'>Disagree, Agree</sc-dropdown-option>
            <sc-dropdown-option value='custom'>Custom</sc-dropdown-option>
          </sc-dropdown-input>
          ${
  optionLabel[0] === 'custom' ? html`
              <sc-text-input
                value=${firstLowerText}
                border-type="box"
                placeholder="Label 1"
                @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'firstLowerText')}
              >
              </sc-text-input>
              <sc-text-input
                value=${lastLowerText}
                border-type="box"
                placeholder="Label 2"
                @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'lastLowerText')}
              >
              </sc-text-input>` : ''
}
        </div>`
}
    `;
  };

  renderStyleAndLayout = () => {
    const { size, mode } = this.component.template;
    if (mode === 'button') return;
    return html`
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Size"
          value=${size}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'size')}
        >
          ${
  CompactSize.map((size: string) => html`<sc-radio value=${size}>${size.toUpperCase()}</sc-radio>`)
}
        </sc-radio-group>
      </div>
    `;
  };

  renderDataOptions = () => {
    const { mode } = this.component.template;
    return html`
      <style>
        .option-title {
          font-size: 0.875rem;
          margin-bottom: var(--sc-spacing-8);
        }
        .options-container {
          overflow-x: hidden;
        }
        .options-text {
          font-size: 0.875rem;
        }
        .options-row {
          margin-bottom: var(--sc-spacing-4);
        }
        .options-row .value-col {
          padding-left: var(--sc-spacing-8);
        }
        .options-remove {
          color: var(--sc-color-red-500);
          margin-top:0.4rem;
          padding-left: var(--sc-spacing-4);
          cursor: pointer;
        }
        .options-remove-disable {
          color: var(--sc-color-grey-500);
          margin-top:0.4rem;
          padding-left: var(--sc-spacing-4);
          cursor: pointer;
        }
        .add-link {
          color: var(--sc-color-blue-500);
          cursor: pointer;
        }
      </style>
      ${mode === 'button' ? html`
      <div>
        <div class=option-title>Options</div>
        <div class="options-container">
        ${this._options?.length > 0 ? html`
          <sc-grid-row class="options-text">
            <sc-grid-column md="5"><sc-label label="Label" label-size="md"></sc-label></sc-grid-column>
            <sc-grid-column md="6"><sc-label label="Value" label-size="md"></sc-label></sc-grid-column>
          </sc-grid-row>` : ''}
        ${
  this._options?.map((option: Option, index: number) => {
    return html`
            <sc-grid-row no-gutters class="options-row">
              <sc-grid-column md="5">
                <sc-text-input value=${option.label}
                  @sc-input=${(e: CustomEvent) => this.updateOption({ label: e.detail.value, value: option.value }, index)}
                ></sc-text-input>
              </sc-grid-column>
              <sc-grid-column md="6">
                <div class="value-col">
                  <sc-text-input value=${option.value}
                    @sc-input=${(e: CustomEvent) => this.updateOption({ label: option.label, value: this.removeSpaces(e.detail.value) }, index)}
                  ></sc-text-input>
                </div>
              </sc-grid-column>
              <sc-grid-column md="1">
                <sc-icon
                  name="trash--line"
                  class=${ this._options.length === 1 ? 'options-remove-disable' : 'options-remove ' }
                  @click=${() => this.deleteOption(index)}
                >
              </sc-grid-column>
            </sc-grid-row>
            `;
  })
}
        </div>
        <div @click=${this.addOption} class='add-link row'>+ Add option</div>
    </div>` : ''} 
    `;
  };

  renderBasicComponent = () => {
    this._options = this.getFilterOption(this._options);
    
    return html`
      <form-rating .component=${this.component} .key=${this.key}>
      </form-rating>
    `;
  };
}