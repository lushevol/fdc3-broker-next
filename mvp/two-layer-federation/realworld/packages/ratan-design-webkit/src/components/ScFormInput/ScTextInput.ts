import { PropertyValues, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { property, query, state } from 'lit/decorators.js';

import ScTheme from '../../styles/ScTheme.js';
import { FormInputBase } from './FormInputBase.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-scrollbar.js';
import TextInputStyle from './ScTextInput.style.js';
import { watch } from '../../shared/watch.js';

export class ScTextInput extends FormInputBase {
  static styles = ScTheme.getStyles().concat([TextInputStyle]);

  @state() currentHeight = 0;

  @property({ type: String }) type = 'text';

  @property({ type: Number, attribute: 'max-length' }) maxLength:
    | number
    | undefined;

  @property({ type: Boolean }) multiline = false;

  @property({ type: Boolean, attribute: 'show-character-count' })
  showCharacterCount = false;

  @property({ type: Number }) rows: number | undefined;

  @property({
    converter: {
      fromAttribute: (value, type) => {
        return value === 'auto' ? value : value !== 'false';
      },
    },
  })
  resizable: boolean | 'auto' | undefined = false;

  @property({ type: String, attribute: 'prefix-icon' }) prefixIcon = '';

  @property({ type: String, attribute: 'suffix-icon' }) suffixIcon = '';

  @property({ type: String, attribute: 'suffix-label' }) suffixLabel = '';

  @property({ type: Boolean, state: true }) _reveal = false;
  
  @property({ type: Boolean }) autofocus = false;

  @query('.sc-form-control') input: HTMLInputElement | null;

  protected firstUpdated(): void {
    if (this.multiline) {
      this._computeHeight();
      this.triggerInput();
    }
    super.firstUpdated();
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.get('multiline') !== undefined) {
      this.bindEvents();
      if (changedProperties.get('multiline')) {
        this._computeHeight();
      }
    } else if (this.multiline) {
      if (
        changedProperties.get('resizable') !== undefined ||
        changedProperties.get('rows') !== undefined
      ) {
        this._computeHeight();
      }
    }
    super.updated(changedProperties);
  }

  triggerInput() {
    if (this.resizable === 'auto') {
      this.updateComplete.then(()=>{
        this._multilineInputHandler({ target: this.input } as Event);
      });
    }
  }

  @watch('value')
  handleValueChange() {
    if (
      this.maxLength &&
      typeof this.value === 'string' &&
      this.value.length > this.maxLength
    ) {
      this.value = this.value.slice(0, this.maxLength);
    }

    if (this.multiline) {
      this.triggerInput();
    }
  }
  
  @watch('autofocus')
  async handleOnFocus() {  
    if (this.autofocus) {
      await this.updateComplete;
      this.input?.focus();
    }
  }

  private _computeHeight() {
    this.updateComplete.then(() => {
      setTimeout(() => {
        const input = this.renderRoot.querySelector(
          `.${this.formControlClsName}`
        ) as HTMLInputElement;
        const styles = window.getComputedStyle(input);
        const rows = this.resizable !== true ? this.rows || 1 : 1,
          lh = styles.getPropertyValue('line-height'),
          pt = styles.getPropertyValue('padding-top'),
          pb = styles.getPropertyValue('padding-bottom'),
          bt = styles.getPropertyValue('border-top-width'),
          bb = styles.getPropertyValue('border-bottom-width');
    
        input.style.minHeight = `calc(${lh} + ${pt} + ${pb} + ${bt} + ${bb} + 1px)`;
        if (this.resizable === 'auto') {
          input.style.maxHeight = `calc((${lh} * ${rows}) + ${pt} + ${pb} + ${bt} + ${bb} + 1px)`;
        } else {
          input.style.removeProperty('max-height');
        }
      }, 0);
    });
  }
  
  private _multilineInputHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    input.style.height = '0px';
    const { scrollHeight } = input;
    if (this.currentHeight !== scrollHeight) {
      this.currentHeight = scrollHeight;
    }
    input.style.height = `calc(${this.currentHeight}px + 2px)`;
  }

  renderDescription() {
    if (this.maxLength && this.showCharacterCount && !this.readonly) {
      return html`
        <div class="character-count">
          ${this.value.length} / ${this.maxLength}
        </div>
      `;
    }
    return null;
  }

  renderFormControl() {
    if (this.readonly && (this.maxRows || (!this.multiline && !this.maxRows))) {
      let readonlyContent = this.value;
      if (typeof this.value === 'string') {
        const lines = String(this.value ?? '').split(/\r?\n/);
        readonlyContent = lines.map((line, index) =>
          index === 0 ? line : html`<br>${line}`
        );
      }

      return html`
        <div class="sc-form-control">
          <slot name="form-control" class="sc-form-control-content">
            ${readonlyContent}
          </slot>
        </div>
      `;
    }

    return html`
          ${this.multiline
            ? html`<sc-scrollbar .resizer=${this.resizable === true}>
                <textarea
                  class=${classMap({
                    'sc-form-control': true,
                    multiline: true,
                    [this.borderType]: true,
                    resizable: this.resizable === true,
                    'resizable-auto': this.resizable === 'auto',
                  })}
                  part="input"
                  .value=${this.value}
                  .placeholder=${this.readonly ? '' : this.placeholder}
                  .disabled=${this.disabled}
                  ?readonly=${this.readonly}
                  maxlength=${this.maxLength}
                  rows=${this.resizable === 'auto' ? undefined : this.rows}
                  @input=${
                    this.resizable === 'auto'
                      ? this._multilineInputHandler
                      : undefined
                  }
                >
                </textarea>
              </sc-scrollbar>`
            : html`
                <input
                  class=${classMap({
                    'sc-form-control': true,
                    [this.borderType]: true,
                  })}
                  part="input"
                  .type=${this._reveal ? 'text' : this.type}
                  .value=${this.value}
                  .placeholder=${this.placeholder}
                  .disabled=${this.disabled}
                  maxlength=${this.maxLength}
                />
              `}
        `;
  }

  renderPrefix() {
    return html`
      <slot name="prefix">
        ${this.prefixIcon
          ? html`<sc-icon
              class=${classMap({
                'prefix-icon-item': true,
                'multiline-item': this.multiline,
              })}
              name=${this.prefixIcon}
              size=${this.getCurrentIconSize()}
            ></sc-icon>`
          : null}
      </slot>
    `;
  }

  renderMoreIcons() {
    if (this.readonly) return nothing;
    return html`
      <div class=${classMap({
        'more-icons-container': true,
        'multiline-item': this.multiline,
      })} part="text-input-more-icons">
        ${this.renderClearablePart()}
        ${this.error
          ? html` <slot name="error-icon" class="error-icon">
              <sc-icon
                name="alert-circle--line"
                size=${this.getCurrentIconSize()}
              ></sc-icon>
            </slot>`
          : ''}
        <slot name="suffix" class="suffix">
          ${this.suffixLabel || this.suffixIcon
            ? html`<div class="suffix-container">
                ${this.suffixLabel
                  ? html`<div class="suffix-text">${this.suffixLabel}</div>`
                  : null}
                ${this.suffixIcon
                  ? html`<sc-icon
                      name=${this.suffixIcon}
                      size=${this.getCurrentIconSize()}
                    ></sc-icon>`
                  : null}
              </div>`
            : null}
        </slot>
      </div>
    `;
  }

  render() {
    return html` ${this.renderBaseFormInput()} `;
  }
}
