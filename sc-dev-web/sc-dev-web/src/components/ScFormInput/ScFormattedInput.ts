import { html } from 'lit';
import { property, state } from 'lit/decorators.js';

import ScTheme from '../../styles/ScTheme.js';
import { FormInputBase } from './FormInputBase.js';
import { HasSlotController } from '../../shared/slot.js';

export class ScFormattedInput extends FormInputBase {
  static styles = ScTheme.getStyles();

  @property({ type: String }) format = '';

  @property({ type: String }) delimiter = ' - ';

  @property({ type: String }) blocks = '';

  @property({ type: Boolean, attribute: 'auto-show-error' }) autoShowError = false;

  @state() protected _blocks: string[] = [];

  connectedCallback() {
    super.connectedCallback();
    if (this.blocks) {
      this._blocks = this.blocks.split(',');
    }
  }

  get hasTooltip() {
    return !!(this.tooltip || this.hasSlotController.test('label-tooltip'));
  }
  get hashint() {
    return !!(this.hint || this.hasSlotController.test('label-hint'));
  }

  readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'label',
    'label-tooltip',
    'label-hint',
  );

  handleInput(event: any) {
    const { value } = event.detail;
    if (this.format) {
      this.value = value;
      const regExp = new RegExp(this.format);
      const result = value.match(regExp);
      this.emit('sc-validate-status', {
        detail: {
          value: this.value,
          status: !value || result?.length ? 'success' : 'error',
          rule: this.format,
        },
      });
      if (this.autoShowError) {
        if (!value || result?.length) {
          this.error = false;
          this.errorMessage = '';
        } else {
          this.error = true;
          this.errorMessage = this.errorMessage || 'Invalid value';
        }
      }
    } else if (this.blocks) {
      const copyValue = value.replace(/[^(\d|a-z|A-Z)]/g, '');
      const valueArray: Array<string> = Array.from(copyValue);
      const valueBlocks: any = [];

      this._blocks.forEach(block => {
        if (typeof +block === 'number') {
          const piece = valueArray.splice(0, +block).join('');
          if (piece) {
            valueBlocks.push(piece);
          }
        }
      });
      this.value = valueBlocks.join(this.delimiter);
      this.emit('sc-validate-status', {
        detail: {
          value: this.value,
          status: 'success',
        },
      });
    }
    const textInput: any = this.shadowRoot?.querySelector('sc-text-input');
    const formControl = textInput?.shadowRoot?.querySelector('.sc-form-control');
    if (formControl) {
      formControl.value = this.value;
    }
    this.emit('sc-input', {
      detail: {
        value: this.value,
      },
    });
  }

  render() {
    const hasDefaultSlot = this.hasSlotController.test('[default]');
    return html`
      <sc-text-input
        ?clearable=${this.clearable}
        .label=${this.label}
        .required=${this.required}
        .error=${this.error}
        .success=${this.success}
        .readonly=${this.readonly}
        .disabled=${this.disabled}
        .truncate=${this.truncate}
        .placeholder=${this.placeholder}
        .value=${this.value}
        .size=${this.size}
        .label-size=${this.labelSize}
        .icon-size=${this.iconSize}
        .text-align=${this.textAlign}
        .hint=${this.hint}
        ?max-rows=${this.maxRows}
        readonly-rows=${this.readonlyRows}
        help-text=${this.helpText}
        error-message=${this.errorMessage}
        border-type=${this.borderType}
        tooltip=${this.tooltip}
        tooltip-placement=${this.tooltipPlacement}
        hint=${this.hint}
        hint-placement=${this.hintPlacement}
        label-size=${this.labelSize}
        @sc-input=${this.handleInput}
      >
        ${this.label ? null : hasDefaultSlot ? html`<slot></slot>` : null}
        ${this.hasTooltip ? html`<slot name='label-tooltip' slot='label-tooltip'>${this.tooltip}</slot>` : ''}
        ${this.hashint ? html`<slot name='label-hint' slot='label-hint'>${this.hint}</slot>` : ''}
        <slot name='help' slot='help'>${this.helpText}</slot>
        <slot name='success' slot='success'>${this.successMessage}</slot>
        <slot name='error' slot='error'>${this.errorMessage}</slot>        
      </sc-text-input>
    `;
  }
}