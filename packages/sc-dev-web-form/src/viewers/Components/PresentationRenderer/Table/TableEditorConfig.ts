import { html, css, nothing, PropertyValueMap } from 'lit';
import { property, state } from 'lit/decorators.js';
import TableStyle from './Table.style.js';
import ScElement from '../../../utils/sc-element.js';
import { watch } from '../../../utils/watch.js';
import '../../common/DynamicDateValidator.js';
// @ts-ignore
import GridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';

type ConfigKey =
  | 'text-field'
  | 'number'
  | 'formatted-input'
  | 'date'
  | 'time'
  | 'link'
  | 'dropdown-input'
  | 'dropdown-multi-select'
  | 'employee-input'
  | 'employee-multi-input'
  | 'toggle';

type Config = {
  [K in ConfigKey]: Array<any>;
};

type OptionConfig = {
  [K: string]: any;
};

const optionsTpl = {
  dropdown: [
    {
    label: 'Option 1',
    value: 'Option1',
    },
  ],
  toggle: [
    {
    label: 'Toggle 1',
    value: 'Toggle1',
    },
    {
    label: 'Toggle 2',
    value: 'Toggle2',
    },
  ],
  link: [
    {
      label: 'Same window',
      value: '_self',
      },
      {
      label: 'New window',
      value: '_blank',
      },
  ],
};


const ColumnTypeOptions = [
    {
      label: 'Text input',
      value: 'text-field',
    },
    {
      label: 'Number',
      value: 'number',
    },
    {
      label: 'Formatted input',
      value: 'formatted-input',
    },
    {
      label: 'Date',
      value: 'date',
    },
    {
      label: 'Time',
      value: 'time',
    },
    {
      label: 'Link',
      value: 'link',
    },
    {
      label: 'Dropdown',
      value: 'dropdown-input',
    },
    {
      label: 'Multi Dropdown',
      value: 'dropdown-multi-select',
    },
    {
      label: 'Employee input',
      value: 'employee-input',
    },
    {
      label: 'Employee multi input',
      value: 'employee-multi-input',
    },
    {
      label: 'Toggle',
      value: 'toggle',
    },
  ];
const ColumnTypeConfigOptions: Config = {
'text-field': [
    {
    label: 'Default value',
    value: 'defaultValue',
    type: 'string',
    },
    {
    label: 'Max length',
    value: 'maxLength',
    type: 'number',
    },
    {
      label: 'Readonly',
      value: 'readonly',
      type: 'boolean',
    },
    {
    label: 'Readonly rows',
    value: 'readonlyRows',
    type: 'number',
    },
],
number: [
    {
    label: 'Default value',
    value: 'defaultValue',
    type: 'number',
    },
    {
    label: 'Min value',
    value: 'min',
    type: 'number',
    },
    {
      label: 'Max value',
      value: 'max',
      type: 'number',
    },
    {
      label: 'Decimal places',
      value: 'maxDecimals',
      type: 'number',
    },
    {
    label: 'Readonly',
    value: 'readonly',
    type: 'boolean',
    },
],
'formatted-input': [
  {
    label: 'Default value',
    value: 'defaultValue',
    type: 'string',
  },
  {
    label: 'Format',
    value: 'format',
    type: 'string',
  },
  {
    label: 'Readonly',
    value: 'readonly',
    type: 'boolean',
  },
],
date: [
    {
      label: 'Default value',
      value: 'defaultValue',
      type: 'date',
    },
    {
      label: 'Format',
      value: 'format',
      type: 'string',
    },
    {
      label: 'Validation',
      value: 'validation',
      type: 'date-validation',
    },
    {
    label: 'Readonly',
    value: 'readonly',
    type: 'boolean',
    },
],
time: [
  {
    label: 'Default value',
    value: 'defaultValue',
    type: 'time',
  },
  {
    label: 'Readonly',
    value: 'readonly',
    type: 'boolean',
  },
],
link: [
  {
    label: 'Label',
    value: 'label',
    type: 'string',
  },
  {
    label: 'URL',
    value: 'defaultValue',
    type: 'string',
  },
  {
    label: 'Open in',
    value: 'target',
    field: optionsTpl.link,
    type: 'radio',
  },
  {
    label: 'Disabled',
    value: 'disabled',
    type: 'boolean',
  },
],
'dropdown-input': [
    {
      label: 'Default value',
      value: 'defaultValue',
      type: 'string',
    },
    {
      label: 'Readonly',
      value: 'readonly',
      type: 'boolean',
    },
    {
    label: 'Readonly rows',
    value: 'readonlyRows',
    type: 'number',
    },
    {
    label: 'Options',
    value: 'options',
    field: optionsTpl.dropdown,
    type: 'array',
    },
],
'dropdown-multi-select': [
    {
      label: 'Default value',
      value: 'defaultValue',
      type: 'string',
    },
    {
      label: 'Readonly',
      value: 'readonly',
      type: 'boolean',
    },
    {
    label: 'Readonly rows',
    value: 'readonlyRows',
    type: 'number',
    },
    {
    label: 'Options',
    value: 'options',
    field: optionsTpl.dropdown,
    type: 'array',
    },
],
'employee-input': [
    {
      label: 'Default value',
      value: 'defaultValue',
      type: 'string',
    },
    {
    label: 'Readonly',
    value: 'readonly',
    type: 'boolean',
    },
],
'employee-multi-input': [
    {
      label: 'Default value',
      value: 'defaultValue',
      type: 'string',
    },
    {
    label: 'Readonly',
    value: 'readonly',
    type: 'boolean',
    },
],
toggle: [
    {
      label: 'Label',
      value: 'label',
      type: 'string',
    },
    {
      label: 'Default value',
      value: 'defaultValue',
      type: 'string',
    },
    {
      label: 'Readonly',
      value: 'readonly',
      type: 'boolean',
    },
    {
    label: 'Options',
    value: 'options',
    field: optionsTpl.toggle,
    type: 'array',
    },
],
};
const NoValueTypes = ['link'];

export default class TableEditorConfig extends ScElement {
  
  static styles = css`
    ${GridStyle}
    ${TableStyle}
    .row {
      margin-bottom: 0.625rem;
    }
    .options-container {
      width: 100%;
      overflow-x: hidden;
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
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  `;

  @property({ type: String, attribute: 'column-config-option' }) columnOptionConfig:OptionConfig = {} ;
  @property({ type: String, attribute: 'tooltip-show' }) configUpdateStep:string;

  @state() _columnType = '';
  @state() _config:OptionConfig = {};
  @state() _options: {label: string, value:string}[] = [];

  willUpdate() {
    const { options, columnType } = this.columnOptionConfig;
    if (options) {
      this._options = options;
    }
    else if (this._options?.length === 0 && this._columnType) {
      if (this._columnType?.includes('dropdown')) {
        this._options = optionsTpl.dropdown;
      } else if (this._columnType?.includes('toggle')) {
        this._options = optionsTpl.toggle;
      } else if (this._columnType?.includes('link')) {
        this._options = optionsTpl.link;
      }
      if (this._options?.length > 0) {
        this.onUpdateConfig(this._options, 'options');
      }
    }
  }

  @watch(['configUpdateStep']) 
  async handleChangeTooltip() {
    await this.updateComplete;
    if (this.configUpdateStep.includes('delete') || this.configUpdateStep.includes('cancel')) {
      this._config = {};
      this._columnType = '';
    }
  }

  async firstUpdated() {
    this._config = {
      ...this.columnOptionConfig,
    };
    this._columnType = this._config?.columnType;
  }

  onUpdateConfig(value: any, key: string) {
    if (key === 'columnType' && value !== this._config?.columnType) {
      this._config = {
        [key]: value,
      };
    } else {
      this._config = {
        ...this._config,
        [key]: value,
      };
    }
    this.onValueChanged(this._config, 'columnOptionConfig');
  }

  onValueChanged(value: any, type: string) {
    this.emit('value-changed', {
      detail: {
        type,
        value,
      },
    });  
  }

  onUpdateWidth(rawValue: any) {
    const widthValue = `${rawValue ?? ''}`.trim();
    if (!widthValue) {
      const { width, ...rest } = this._config || {};
      this._config = rest;
      this.onValueChanged(this._config, 'columnOptionConfig');
      return;
    }

    const width = Number(widthValue);
    this.onUpdateConfig(Number.isFinite(width) && width > 0 ? width : undefined, 'width');
  }

  updateOption(value: string, type: string, index: number) {
    const _options = [...this._options];
    const option = this._options[index];
    if (option) {
      // @ts-ignore
      option[type] = value;
      _options[index] = option;
      this._options = _options;
    }
    
    this.onUpdateConfig(this._options, 'options');
  }

  addOption() {
    this._options.push({ label: '', value: '' });
    this.requestUpdate();
  }

  deleteOption(index: number) {
    if (this._options.length === 1) return;
    this._options.splice(index, 1);
    this._options = [...this._options];
  }

  removeSpaces(value: string) {
    if (value) { return value.replace(/\s+/g, ''); }
    return value;
  }

  render() {
    return html`
        <div class=row-container @click=${(e:any)=>{ e.stopPropagation(); }}>
            <div class="row">
                <sc-dropdown-input
                    label='Type' 
                    .value=${this._config?.['columnType'] || ''} 
                    hoist
                    @sc-select=${(e: CustomEvent) => {
                      this._columnType = e.detail.value;
                      this.onUpdateConfig(e.detail.value, 'columnType');
                      if (this._options.length > 0) {
                        this._options = [];
                      }
                    }}
                >
                ${ColumnTypeOptions.map(item => {
                    return html`
                    <sc-dropdown-option value=${item.value}>${item.label}</sc-dropdown-option>
                    `;
                })}
                </sc-dropdown-input>
            </div>
            <div class="row">
              <sc-number-input
                label='Width'
                placeholder='Input width in px'
                .value=${this._config?.['width'] || ''}
                @sc-input=${(e: CustomEvent) => this.onUpdateWidth(e.detail.value)}
              ></sc-number-input>
            </div>
            ${NoValueTypes.includes(this._columnType) ? nothing : html`
              <div class="row">
                <sc-switch
                  label="Required"
                  ?checked=${this._config?.['required']}
                  @sc-change=${(e: CustomEvent) => this.onUpdateConfig(e.detail.checked, 'required')}
                >
                </sc-switch>
              </div>
            `}
        ${
          this._columnType || ColumnTypeConfigOptions?.[this._columnType as ConfigKey] 
          ? ColumnTypeConfigOptions[this._columnType as ConfigKey].map((item:{label:string, value:string, type:string, field?:Array<any>}) => {
              return html`
              <div class="row">
                  ${
                    item.type === 'string' 
                    ? html`
                      <sc-text-input
                          label=${item.label} 
                          .value=${this._config?.[item.value] || ''} 
                          @sc-input=${(e: CustomEvent) => {
                            this.onUpdateConfig(e.detail.value, item.value);
                          }}
                      ></sc-text-input>
                    `
                    : item.type === 'number' 
                    ? html`
                      <sc-number-input
                          label=${item.label} 
                          .value=${this._config?.[item.value] || ''} 
                          @sc-input=${(e: CustomEvent) => {
                            this.onUpdateConfig(e.detail.value, item.value);
                          }}
                      ></sc-number-input>
                    `
                    : item.type === 'date' 
                    ? html`
                      <sc-date-input
                        hoist
                        label=${item.label} 
                        value=${this._config?.[item.value] || ''}
                        border-type="box"
                        @sc-change=${(e: CustomEvent) => {
                          this.onUpdateConfig(e.detail.value, item.value);
                        }}
                      >
                      </sc-date-input>
                    `
                    : item.type === 'time'
                    ? html`
                      <sc-time-input
                        hoist
                        label=${item.label}
                        value=${this._config?.[item.value] || ''}
                        border-type="box"
                        @sc-input=${(e: CustomEvent) => {
                          this.onUpdateConfig(e.detail.value, item.value);
                        }}
                      >
                      </sc-time-input>
                    `
                    : item.type === 'boolean' 
                    ? html`
                      <sc-switch
                        label=${item.label}
                        ?checked=${this._config?.[item.value] || false}
                        @sc-change=${(e: CustomEvent) => {
                          this.onUpdateConfig(e.detail.checked, item.value);
                        }}
                      >
                      </sc-switch>
                    `
                    : item.type === 'array' && item.field
                    ? html`
                    <div class="options-container">
                    <sc-label class=row>
                      <div slot=label>Options</div>
                    </sc-label>
                      <sc-grid-row class="options-text">
                        <sc-grid-column md="5"><sc-label label="Label" label-size="md"></sc-label></sc-grid-column>
                        <sc-grid-column md="6"><sc-label label="Value" label-size="md"></sc-label></sc-grid-column>
                      </sc-grid-row>
                      ${
                        this._options?.map((option: {label: string; value: string;}, index: number) => {
                          return html`
                            <sc-grid-row no-gutters class="options-row">
                              <sc-grid-column md="5">
                                <sc-text-input value=${this._config?.options?.[index]?.label || option.label} 
                                @sc-input=${(e: CustomEvent) => {
                                  this.updateOption(e.detail.value, 'label', index);
                                  this.updateOption(this.removeSpaces(e.detail.value), 'value', index);
                                }}>
                                </sc-text-input>
                              </sc-grid-column>
                              <sc-grid-column md="6">
                                <div class="value-col">
                                  <sc-text-input 
                                    value=${this._config?.options?.[index]?.value || option.value} 
                                    @sc-input=${(e: CustomEvent) => this.updateOption(this.removeSpaces(e.detail.value), 'value', index)}
                                  ></sc-text-input>
                                </div>
                              </sc-grid-column>
                              <sc-grid-column md="1">
                                <sc-icon
                                  name="trash--line"
                                  class=${ this._options.length === 1 ? 'options-remove-disable' : 'options-remove ' }
                                  @mousedown=${(e: MouseEvent) => { 
                                    e.stopPropagation();
                                    this.deleteOption(index);
                                    this.requestUpdate();
                                  }}
                                >
                                </sc-icon>
                              </sc-grid-column>
                            </sc-grid-row>`;
                        })
                      }
                      <div @mousedown=${ this.addOption } class='add-link row'>+ Add option</div>
                    </div>`
                    : item.type === 'radio'
                    ? html`
                      <sc-radio-group
                        direction=horizontal
                        columns=2
                        label= 'Open in'
                        value=${this._config?.[item.value] || ''}
                        @sc-change=${(e: CustomEvent) => this.onUpdateConfig(e.detail.value, item.value)}
                      >
                        ${this._options?.map((option: {label: string; value: string;}, index: number) => {
                          return html`
                            <sc-radio value=${option.value}>${option.label}</sc-radio>
                        `; })}
                      </sc-radio-group>
                    `
                    : item.type === 'date-validation'
                    ? html`
                      <dynamic-date-validator
                        type=${this._config?.type || 'fixed'}
                        min=${this._config?.min}
                        max=${this._config?.max}
                        .dynamicDate=${this._config?.dynamicDate || {}}
                        @value-changed=${(e: CustomEvent) => {
                          e.stopPropagation();
                          this.onUpdateConfig(e.detail.value, e.detail.name);
                        }}
                      >
                      </dynamic-date-validator>
                    ` : nothing
                  }
              </div>`;
            })
          : nothing
        }
    </div>
    `;
  }
}

if (!window.customElements.get('table-editor-config')) {
  window.customElements.define('table-editor-config', TableEditorConfig);
}

