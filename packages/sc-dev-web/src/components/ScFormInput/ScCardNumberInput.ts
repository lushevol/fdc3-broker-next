import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { FormInputBase } from './FormInputBase.js';

export class ScCardNumberInput extends FormInputBase {

  @property({ type: String }) placeholder = '•••• •••• •••• ••••';

  @property({ type: Boolean, attribute: 'no-suffix-icon' }) noSuffixIcon = false;

  @property({ type: Number, attribute: 'max-length' }) maxLength = 0;

  @property({ attribute: false }) format = /(\d{1,4})/g;

  @property({ type: String, attribute: false }) displayValue = '';

  @property({ type: String, attribute: false }) type = 'tel';

  formatNumber(val: string) {
    let num = val ? val.replace(/\D/g, '') : '';
    if (this.maxLength) num = num ? num.slice(0, this.maxLength) : '';

    const groups = num ? num.match(this.format) : [];
    const validGroups = groups ? groups : [];
    this.value = validGroups.join('');
    this.displayValue = validGroups.join(' ');
  }

  // // Shall we show error?
  // validateNumber(val: string) {
  //   let num = val.replace(/\s+|-/g, '');
  //   if (!/^\d+$/.test(num)) {
  //     return false;
  //   }
  //   return num.length === this.length;
  // }

  bindAfterFirstUpdated() {
    const textInput = (this.renderRoot as any) // eslint-disable-line
      .querySelector('.sc-form-control');
    if (textInput) {
      this.formatNumber(this.value);
    }
  }

  handleInput(e: any) {
    this.formatNumber(e.target.value);
    e.target.value = this.displayValue;
    this.emit('sc-input', {
      detail: {
        value: this.value,
      },
    });
    this._active = true;
  }

  renderFormControl() {
    return this.readonly ? html`
      <div class='sc-form-control'>${this.displayValue}</div>
    ` : html`
      <input
        class='${this.borderType} sc-form-control'
        part='input'
        .type='del'
        .value=${this.displayValue}
        .placeholder=${this.placeholder}
        .disabled=${this.disabled}
        @input=${this.handleInput}
      />
    `;
  }

  clearValue(e: Event): void {
    super.clearValue(e);
    this.displayValue = '';
  }
  renderMoreIcons() {
    if (this.readonly || this.disabled) return nothing;
    return html`
      <div>${this.renderClearablePart()}</div>
      ${this.noSuffixIcon || this.readonly
    ? null 
    : html`
            <div class='sc-form-suffix-icon'>
              <sc-icon name='lock--line' size=${this.getCurrentIconSize()}></sc-icon>
            </div>
          `
}
    `;
  }

  render() {
    return html`
      ${this.renderBaseFormInput()}
    `;
  }
}
