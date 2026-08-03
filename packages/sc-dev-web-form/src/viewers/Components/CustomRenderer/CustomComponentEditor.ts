import { html, nothing } from 'lit';
import { BaseEditor } from '../common/BaseEditor.js';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import type { ValueChangeFunction } from '../../../shared/formTypes.js';
import type { ELEMENT, SETTINGS, SETTING_ITEM } from '../../types.js';
import { PropertyCategories } from '../../../shared/propertyTypes.js';
import { watch } from '../../utils/watch.js';
import '../common/PrefillAnswer.js';
// @ts-ignore
import ScBasicDefinitions from '@scdevkit/webkit/styles/ScBasicDefinitions.js';

export class CustomComponentEditor extends BaseEditor {

  @property({ type: Object }) element: ELEMENT;

  @property({ type: Object }) settings: SETTINGS;

  @state() _items: any[] = [];

  @watch('element')
  updateElement() {
    if (this.element) {
      const { properties } = this.element;
      if (properties) {
        Object.keys(properties).some((p: any) => {
          // @ts-ignore
          const value = properties[p];
          if (value.type === 'items-slot') {
            this._items = value.defaultValue || [];
            return true;
          }
        });
      }
    }
  }

  optionsStore: any = {
    backgroundColor: {
        options: Object.keys(ScBasicDefinitions?.colorMapping).map(color => `var(${color})`),
        optionsLabel: Object.keys(ScBasicDefinitions?.colorMapping).map(color => `${color}`),
    },
  };

  generatePropertySettingComponent(setting: SETTING_ITEM, key: string) {
    const { type, options, label, className, bindingKey, opposite, optionsLabel, placeholder } = setting;
    const value = this.component.template[bindingKey || key];
    switch (type) {
    case 'text-input':
      return html`
          <sc-text-input
            label=${label}
            value=${value === 'custom' ? '' : value} 
            @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, bindingKey || key)}
            placeholder=${placeholder}
          >
          </sc-text-input>
        `;
    case 'number-input':
      return html`
            <sc-number-input
              label=${label}
              value=${value} 
              @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, key)}
            >
            </sc-number-input>
          `;
    case 'dropdown-multi-select':
      return html`
          <sc-dropdown-multi-select
            hoist
            label=${label}
            .value=${value} 
            @sc-select=${(e: CustomEvent) => this.onChange(e.detail.value, key)}
          >
            ${
              options?.map(o => html`
                <sc-dropdown-option value=${o}>${o}</sc-dropdown-option>
              `)
            }
          </sc-dropdown-multi-select>
        `;
    case 'dropdown-input':
      const optionsAvailable = ['backgroundColor'].filter(item => item === key)[0];
      const option_ = this.optionsStore[optionsAvailable]?.options || options;
      const optionsLabel_ = this.optionsStore[optionsAvailable]?.optionsLabel || optionsLabel;
      return html`
          <sc-dropdown-input 
            label=${label}
            value=${value} 
            hoist
            @sc-select=${(e: CustomEvent) => {
              this.onChange(e.detail.value, key);
              this.requestUpdate();
            }} 
          >
            ${
              option_?.map((o:any, index: number) => html`
                <sc-dropdown-option value=${o}>${optionsLabel_ && optionsLabel_.length > 0 ? optionsLabel_[index] : o}</sc-dropdown-option>
              `)
            }
          </sc-dropdown-input>
        `;
    case 'radio-group':
      return html`
          <sc-radio-group
            columns=${ 
              //@ts-ignore
              options && options.length > 0 ? (['xxs', 'xs', 'sm', 'md', 'lg'].includes(options[0]) ? 3 : 2) : 2
            }
            label=${label}
            .value=${value}
            direction=horizontal
            @sc-change=${(e: CustomEvent) => {
              this.onChange(e.detail.value, key);
              this.requestUpdate();
            }}
          >
            ${
              options?.map((o:any, index) => html`
                <sc-radio value=${o}>
                ${optionsLabel && optionsLabel.length > 0 ? html`
                <span class=${className}>${optionsLabel[index]}</span>
                ` : html`<span class=${className || 'text-capitalize'}>${o}</span>`}
                </sc-radio>
              `)
            }
          </sc-radio-group>
        `;
    case 'checkbox-group':
      return html`
          <sc-checkbox-group 
            label=${label}
            .value=${value} 
            direction=horizontal
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, key)}
          >
            ${
              options?.map(o => html`
                <sc-checkbox value=${o}>
                  <span class=${className || 'text-capitalize'}>${o}</span>
                </sc-checkbox>
              `)
}
          </sc-checkbox-group>
        `;
    case 'switch':
      return html`
          <sc-switch 
            label=${label} 
            ?checked=${opposite ? !value : value}
            @sc-change=${(e: CustomEvent) => this.onChange(opposite ? !e.detail.checked : e.detail.checked, bindingKey || key)}
          ></sc-switch>
        `;
    case 'items-slot':
      return this.renderSlotItems({
        key,
        options,
        label,
      });

    case 'icon-selector':
      return html`
        <sc-icon-selector
        label="Icon"
        value=${value}
        @value-changed=${(e: CustomEvent) => {
    this.onChange(e.detail.value, key);
    this.requestUpdate();
  }}
      ></sc-icon-selector>`;
    case 'rich-text-editor':
      return html`
        <sc-label label='Body'></sc-label>
        <sc-rich-text-editor-v2
          value=${value}
          .toolbar=${[
    'undo',
    'redo',
    'separate',
    'fontstyle',
    'separate',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'backcolor',
    'forecolor',
    'clear',
    'addlink',
    'unlink',
  ]}
          @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.text, 'body');
    this.requestUpdate();
  }}
        >
        </sc-rich-text-editor-v2>`;
    case 'upload-input':
      const key_ = bindingKey || key;
      const imageSrc = this.component?.template[key_];
      const files = this.component.template?.files;
      const imageSrcFile = imageSrc ? this.base64ToFile(imageSrc,'image.png') : { id: null, file: null };
      return html`
        <sc-file-input
          deletable
          placeholder= "Click or drop file here"
          .value=${files}
          @sc-change= ${(e: CustomEvent) => {
            const files = e.detail.value;
            this.uploadFile(key_, files[0]);
          }}
          selectable=${true}
          @sc-select=${(e: CustomEvent) => {
            if (this.component?.template[key_]) {
              this.downloadFile(imageSrc, e.detail.value?.name);
            }
          }}
        >
        </sc-file-input>
          ${imageSrcFile?.id && !files ? html`
            <sc-file-item  width=auto 
              selectable
              no-border
              file-id=${imageSrcFile?.id} 
              name=${imageSrcFile?.file?.name} 
              size=${imageSrcFile?.file?.size}
              @sc-select=${(e: CustomEvent) => {
                this.downloadFile(imageSrc, 'image.png');
              }}>
            </sc-file-item>
          ` : nothing}
        `;
    default:
    }
  }

  addItem() {
    this._items.push({});
    this.requestUpdate();
  }
  
  deleteItem(index: number, key: string) {
    this._items.splice(index, 1);
    this.requestUpdate();
    this.onChange(this._items, key);
  }

  updateItem(value: string, type: string, index: number, key: string) {
    const item: any = this._items[index];
    if (item) {
      // @ts-ignore
      item[type] = value;
      this._items[index] = item;
      this.requestUpdate();
      this.onChange(this._items, key);
    }
  }

  renderSlotItems(config: any) {
    return html`
      <style>
        .option-row {
          position: relative;
          display: flex;
          margin-bottom: 0.937rem;
        }

        .option-row span {
          flex: 1;
        }

        .option-row .last-child {
          margin-left: 0.625rem
        }

        .delete-icon {
          position: absolute;
          top: 0;
          right: 0;
        }

        .add-link {
          color: var(--sc-color-blue-500);
          cursor: pointer;
        }
      </style>
      <div>
        <sc-label>${config.label}</sc-label>
        ${
  this._items?.map((item: any, index: number) => {
    return html`
              <div class=option-row>
                ${
  config.options?.map((o: any, j: number) => {
    return html`
                      <span class=${j === config.options.length - 1 ? 'last-child' : ''}>
                        <sc-text-input label=${o.label} value=${item[o.key]}
                          @sc-input=${(e: CustomEvent) => this.updateItem(e.detail.value, o.key, index, config.key)}
                        ></sc-text-input>
                      </span>
                    `;
  })
}
                <span class=delete-icon @click=${() => this.deleteItem(index, config.key)} style='color: var(--sc-color-red-500)'>
                  <sc-icon name="trash--line" size="sm"></sc-icon>
                </span>
              </div>
            `;
  })
}
        <div @click=${this.addItem} class='add-link row'>+ Add new item</div>
      </div>
    `;
  }

  renderSettings(settingKeys: Array<string>) {
    return html`
      ${
  typeof this.settings === 'function' ? 
    this.settings(this.component) : 
    settingKeys.map((key: string) => {
      const { limiter } = this.settings[key];
      if (limiter) {
        if (Array.isArray(limiter) && limiter.length > 0) {
          const isConditionMet = limiter.every((condition: any) => {
            const eq = Array.isArray(condition.eq) ? condition.eq : [condition.eq];
            return eq.includes(this.component.template[condition.arg]);
          });
        if (!isConditionMet) return;
        } else if (limiter.arg) {
          const eq = Array.isArray(limiter.eq) ? limiter.eq : [limiter.eq];
          const isConditionMet = eq.includes(this.component.template[limiter.arg]);
          if (!isConditionMet) return;
        }
      }
      return this.settings[key].type ? html`
              <div class='${this.settings[key]?.category === 'Behavior' ? 'w-half' : 'row'}'>
                ${
  this.generatePropertySettingComponent(this.settings[key], key)
}
              </div>
            ` : nothing;
    })
}
    `;
  }

  renderProperties: any = () => {
    let settingKeys: string[] = [];
    let settingCategories: string[] = [];
    let filteredDataBindKey: string[] = [];
    if (this.settings && typeof this.settings === 'object') {
      settingKeys = Object.keys(this.settings);
      settingCategories = Object.values(this.settings).map((item: any) => item.category).filter(item => item);
      Object.values(this.settings).forEach(((item: any) => {
        if (item.bindKey && item.category === 'Data Binding') {
          filteredDataBindKey =  item.bindKey;
        }
      }));
    }
    const allCategories = new Set<any>([
      PropertyCategories.GENERAL, 
      settingCategories.includes('Behavior') ? PropertyCategories.BEHAVIOR : null, 
      settingCategories.includes('Data Binding') ? PropertyCategories.DATABINDING : null, 
      PropertyCategories.STYLINGLAYOUT, 
      PropertyCategories.CONDITIONS].filter(Boolean));
    return html`
      <div class="row">
        ${repeat(allCategories, (category: string, index: number) => html`
          <sc-accordion ?open=${index === 0}>
            <div slot="summary">${category}</div>
            ${category === PropertyCategories.GENERAL ? html`
              <div style='width: 98%;'>
                ${this.renderId()}
                ${this.renderSettings(settingKeys.filter((key: string) => !this.settings[key].category || this.settings[key].category === category))}
              </div>
            ` : html`
              ${settingKeys.length > 0 ? this.renderSettings(settingKeys.filter((key: string) => this.settings[key].category === category)) : nothing}
            `}
            ${category === PropertyCategories.DATABINDING ? html`
              <prefill-answer
                .bindKey=${filteredDataBindKey}
                .component=${this.component}
                @value-changed=${(event: CustomEvent) => {
    this.onChange(event.detail.value, event.detail.name);
    this.requestUpdate();
  }}
              ></prefill-answer>
            ` : nothing}
            ${category === PropertyCategories.STYLINGLAYOUT ? html`
              ${this.renderAllStyleAndLayout()}
            ` : nothing}
            ${category === PropertyCategories.CONDITIONS ? this.renderConditions() : nothing}
          </sc-accordion>
        `)}
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-custom-component .element=${this.element} .component=${this.component} .key=${this.key}>
      </form-custom-component>
    `;
  };
}