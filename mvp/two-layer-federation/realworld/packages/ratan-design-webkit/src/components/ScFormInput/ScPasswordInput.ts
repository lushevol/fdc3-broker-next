import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import ScTheme from '../../styles/ScTheme.js';
import { FormInputBase } from './FormInputBase.js';
import '../../../elements/sc-icon.js';

export class ScPasswordInput extends FormInputBase {
  static styles = ScTheme.getStyles();

  @property({ type: Number, attribute: 'max-length' }) maxLength = 8;

  @property({ type: Boolean, state: true }) _reveal = false;

  bindAfterFirstUpdated() {
    const passwordIcon = (this.renderRoot as any) // eslint-disable-line
      .querySelector('.sc-form-password-icon');
    if (passwordIcon) {
      passwordIcon.addEventListener('click', () => {
        this._reveal = !this._reveal;
      });
    }
  }

  renderFormControl() {
    return this.readonly ? html`
      <div class='sc-form-control'>${this.value ? '******' : ''}</div>
    ` : html`
      <input
        class='${this.borderType} sc-form-control'
        part='input'
        .type=${this._reveal ? 'text' : 'password'}
        .value=${this.value}
        .placeholder=${this.placeholder}
        maxlength=${this.maxLength}
        .disabled=${this.disabled}
      />
    `;
  }

  renderMoreIcons() {
    if (this.readonly || this.disabled) return nothing;
    return html`
      ${this.renderClearablePart()}
      ${this.error ? html`
        <div> 
          <slot name='error-icon' class='error-icon'>
            <sc-icon name='alert-circle--line' size=${this.getCurrentIconSize()}></sc-icon>
          </slot>
        </div>
        ` : ''}
      <div 
        class='sc-form-password-icon'
        style='cursor:pointer;'
      >
         ${!this._reveal
    ? html`<sc-icon size=${this.getCurrentIconSize()} name='eye-off--line'></sc-icon>`
    : html`<sc-icon size=${this.getCurrentIconSize()} name='eye--line'></sc-icon>`
}
      </div>
    `;
  }

  renderPasswordStyle() {
    return html`
      <style>
        .error-icon {
          color: var(--sc-text-input-error-color, var(--sc-color-red-500));
        }
      </style>
    `;
  }

  render() {
    return html`
      ${this.renderPasswordStyle()}
      ${this.renderBaseFormInput()}
    `;
  }
}
