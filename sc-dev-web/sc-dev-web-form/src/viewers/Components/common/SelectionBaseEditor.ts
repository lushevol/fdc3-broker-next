import { html, PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { FormBaseEditor } from './FormBaseEditor.js';
import { OptionBase } from '../../../models/base/OptionBase.js';
import { OptionConfig } from '../../../models/OptionConfig.js';
import './DataSourceSelectorForOption.js';

export class SelectionBaseEditor extends FormBaseEditor {
  @state() _options: OptionBase[] = [];

  // @ts-ignore
  @state() _optionConfig: OptionConfig = {};

  @state() _optionType = 'static';

  willUpdate() {
    const { options, optionConfig } = this.component.template;
    if (options) {
      this._options = options;
    }
    if (optionConfig) {
      this._optionConfig = optionConfig;
      this._optionType = optionConfig.type;
    }
  }

  addOption() {
    this._options.push(new OptionBase());
    this.requestUpdate();
  }
  
  deleteOption(index: number) {
    if (this._options.length === 1) return;
    this._options.splice(index, 1);
    this._options = [...this._options];
    this.onChange(this._options, 'options');
    this.requestUpdate();
  }

  updateOptionConfig(value: any, key: string) {
    // @ts-ignore
    this._optionConfig[key] = value;
    this.onChange(this._optionConfig, 'optionConfig');
    this.requestUpdate();
  }

  updateOption(value: string, type: string, index: number) {
    const _options = [...this._options];
    const option: OptionBase = this._options[index];
    if (option) {
      // @ts-ignore
      option[type] = value;
      _options[index] = option;
      this._options = _options;
      this._options = this.getFilterOption(this._options);
      this.onChange(this._options, 'options');
      this.requestUpdate();
    }
  }

  renderDataOptions: any = () => {
    return html`
      <style>
        .option-title {
          font-size: 0.875rem;
          margin-bottom: var(--sc-spacing-8);
        }
        .options-container {
          overflow-x: hidden;
          margin-top: var(--sc-spacing-12);
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
      <div class=row>
        <div class=option-title>Options</div>
        <sc-button-group value=${JSON.stringify([this._optionType])} single-select @sc-select=${(event: CustomEvent) => {
  this.updateOptionConfig(event.detail.value[0], 'type');
}}>
          <sc-button-group-item value=static>Manual input</sc-button-group-item>
          <sc-button-group-item value=dataSource>Data source</sc-button-group-item>
        </sc-button-group>
        ${
  this._optionType === 'static' ? html`
          <div class="options-container">
          ${this._options?.length > 0 ? html`
            <sc-grid-row class="options-text">
              <sc-grid-column md="5"><sc-label label="Label" label-size="md"></sc-label></sc-grid-column>
              <sc-grid-column md="6"><sc-label label="Value" label-size="md"></sc-label></sc-grid-column>
            </sc-grid-row>` : ''}
            ${
  this._options?.map((option: OptionBase, index: number) => {
    return html`
                  <sc-grid-row no-gutters class="options-row">
                    <sc-grid-column md="5">
                      <sc-text-input value=${option.label} @sc-input=${(e: CustomEvent) => {
  this.updateOption(e.detail.value, 'label', index);
  this.updateOption(this.removeSpaces(e.detail.value), 'value', index);
}}>
                      </sc-text-input>
                    </sc-grid-column>
                    <sc-grid-column md="6">
                      <div class="value-col">
                        <sc-text-input value=${option.value} @sc-input=${(e: CustomEvent) => this.updateOption(this.removeSpaces(e.detail.value), 'value', index)}></sc-text-input>
                      </div>
                    </sc-grid-column>
                    <sc-grid-column md="1">
                      <sc-icon
                        name="trash--line"
                        class=${ this._options.length === 1 ? 'options-remove-disable' : 'options-remove ' }
                        @click=${() => {
    this.deleteOption(index);
    this.requestUpdate();
  }}
                      >
                    </sc-grid-column>
                  </sc-grid-row>
                `;
  })
}
            </div>
            <div @click=${this.addOption} class='add-link row'>+ Add option</div>
          ` : html`
          <div class="options-container">
            <data-source-selector-for-option 
              config=${JSON.stringify(this._optionConfig)}
              component=${JSON.stringify(this.component)}
              @config-updated=${(event: CustomEvent) => this.updateOptionConfig(event.detail.value, event.detail.key)}
            >
            </data-source-selector-for-option>
          </div>
        `}
      </div>
      ${
  // @ts-ignore
  this.renderCustomProperties?.()
}
    `;
  };
}