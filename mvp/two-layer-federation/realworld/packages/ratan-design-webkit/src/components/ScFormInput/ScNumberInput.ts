import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';

import ScTheme from '../../styles/ScTheme.js';
import { FormInputBase } from './FormInputBase.js';
import '../../../elements/sc-icon.js';
import { watch } from '../../shared/watch.js';
import * as Keys from '../../shared/key-values.js';
import numberInputStyles from './ScNumberInput.style.js';

const ALLOWED_KEYS: Set<string> = new Set([
  Keys.keyArrowLeft,
  Keys.keyArrowRight,
  Keys.keyBackspace,
  Keys.keyDelete,
  Keys.keyHome,
  Keys.keyEnd,
  Keys.keyTab,
  Keys.keyEscape,
  Keys.keyEnter,
]);

const CTRL_KEYS: Set<string> = new Set(['a', 'c', 'v', 'x', 'z', 'y']);

// Removes redundant leading zeros: '007.5' → '7.5', '00' → '0', '-00.5' → '-0.5'
function stripLeadingZeros(str: string): string {
  const sign = str.startsWith('-') ? '-' : '';
  let digits = sign ? str.slice(1) : str;
  if (!digits) return sign;                              // bare '-' stays as '-'
  digits = digits.replace(/^0+/, '') || '0';            // strip zeros, keep at least one
  if (digits.startsWith('.')) digits = `0${digits}`;    // '.5' → '0.5'
  return sign + digits;
}

export class ScNumberInput extends FormInputBase {
  static readonly styles = [...ScTheme.getStyles(), numberInputStyles];

  @property({ type: Number }) min?: number;

  @property({ type: Number }) max?: number;

  @state() _active = false;

  @state() _focus = false;

  @property() type: 'number' | 'digit' = 'number';

  @property({ type: Number, attribute: 'max-decimals' }) maxDecimals: number | undefined = undefined;

  @query('.sc-form-control') formControl: HTMLInputElement | null;


  @watch(['readonly', 'disabled'], { waitUntilFirstUpdate: true })
  async updateArrowStatus() {
    if (this.disabled || this.readonly) {
      return;
    }
    await this.updateComplete;
    this.bindAfterFirstUpdated();
  }

  private upArrowClick = () => {
    if (this.formControl) {
      const base = this.value ? Math.floor(Number(this.value)) : (this.min ?? 0);
      this.value = this.max === undefined ? base + 1 : Math.min(this.max, base + 1);
    }
  };

  private downArrowClick = () => {
    if (this.formControl) {
      const base = this.value ? Math.floor(Number(this.value)) : (this.max ?? 0);
      this.value = this.min === undefined ? base - 1 : Math.max(this.min, base - 1);
    }
  };

  private limitDecimalPlaces(value: string | number = '') {
    if (value === '' || value === null) {
      return;
    }
    // Remove non-numeric characters (keep -, . and digits); remove any non-leading -
    let res = value.toString()
      .replace(/[^-.\d]/g, '')
      .replace(/(?!^)-/g, '');

    if (this.type === 'digit') {
      // Keep only the first dot — remove any subsequent ones
      const firstDot = res.indexOf('.');
      if (firstDot !== -1) {
        res = res.slice(0, firstDot + 1) + res.slice(firstDot + 1).replaceAll('.', '');
      }

      // Ensure a leading 0 before a bare decimal point (.5 -> 0.5)
      // Must happen BEFORE decimal trimming so that ".1234" + maxDecimals=0 -> "0", not ""
      if (res.startsWith('.')) res = `0${res}`;

      // Trim to maxDecimals decimal places.
      // ?? (not ||) so that maxDecimals=0 means "0 places" instead of "unlimited"
      // (0 || '' evaluates to '' which was incorrectly treated as unlimited)
      const dotPos = res.indexOf('.');
      if (dotPos !== -1) {
        if (this.maxDecimals === 0) {
          res = res.slice(0, dotPos);
        } else if (this.maxDecimals !== undefined) {
          res = res.slice(0, dotPos + 1 + this.maxDecimals);
        }
        // maxDecimals === undefined: unlimited decimals — no trimming
      }
    } else {
      res = res.replaceAll('.', '');
    }

    res = stripLeadingZeros(res);

    this.value = res;
  }

  private onKeydown(e: KeyboardEvent) {
    if (
      ALLOWED_KEYS.has(e.key) ||
      ((e.ctrlKey || e.metaKey) && CTRL_KEYS.has(e.key.toLowerCase()))
    ) {
      return;
    }

    const input = e.target as HTMLInputElement;
    const value = input.value;
    const selectionStart = input.selectionStart ?? 0;
    const selectionEnd = input.selectionEnd ?? 0;

    // allow one minus sign at the start, only if min allows negative numbers
    if (e.key === '-') {
      // Block minus sign if min is undefined or min >= 0
      if (this.min === undefined || this.min >= 0) {
        e.preventDefault();
        return;
      }
      // Allow minus sign only at start and if not already present
      if (selectionStart !== 0 || value.includes('-')) {
        e.preventDefault();
      }
      return;
    }

    // allow one decimal point
    if (e.key === '.' && this.type === 'digit' && (this.maxDecimals ?? 0) > 0) {
      if (value.includes('.')) {
        e.preventDefault();
      }
      return;
    }

    // allow numeric
    if (/^\d$/.test(e.key)) {
      if (this.max !== undefined || this.min !== undefined) {
        const newValue = value.slice(0, selectionStart) + e.key + value.slice(selectionEnd);
        const numericValue = parseFloat(newValue);

        if (this.max !== undefined && numericValue > this.max) {
          e.preventDefault();
          return;
        }

        // digit type allows intermediate states (e.g. typing "0" towards "0.01"),
        // enforced on blur instead
        if (this.min !== undefined && numericValue < this.min && this.type !== 'digit') {
          e.preventDefault();
          return;
        }
      }

      if (
        this.type === 'digit' &&
        (this.maxDecimals ?? 0) > 0 &&
        value.includes('.') &&
        selectionStart - value.indexOf('.') > (this.maxDecimals ?? 0)
      ) {
        e.preventDefault();
      }
      return;
    }

    // block everything else
    e.preventDefault();
  }

  private onBlur() {
    if (!this.value || this.value === '-') return;
    const value = +this.value;
    if (this.min !== undefined && value < this.min) {
      this.value = String(this.min);
    }
    if (this.max !== undefined && value > this.max) {
      this.value = String(this.max);
    }
  }

  @watch(['type'], { waitUntilFirstUpdate: true })
  onTypeChange = () => {
    this.value = '';
  };

  @watch(['maxDecimals', 'value'], { waitUntilFirstUpdate: true })
  handleDecimalsValue = (oldValue: unknown, newValue: unknown) => {
    if (oldValue !== newValue) {
      const rawDOMValue = this.formControl?.value ?? '';
      const cursorPos = this.formControl?.selectionEnd ?? 0;

      this.limitDecimalPlaces(this.value);
      let num = Number(this.value);
      let clamped = false;
      if (!isNaN(num)) {
        if (this.max !== undefined && num > this.max) {
          num = this.max;
          clamped = true;
        }
        if (this.min !== undefined && num < this.min && !(this._focus && this.type === 'digit')) {
          num = this.min;
          clamped = true;
        }
        if (clamped && this.type === 'digit' && (this.maxDecimals ?? 0) > 0) {
          const decimals = this.maxDecimals ?? 0;
          this.value = num.toFixed(decimals);
        } else if (clamped) {
          this.value = num.toString();
        }
      }
      if (this.formControl) {
        // Adjust cursor by how many characters were inserted/removed before it.
        // If value was clamped to a boundary, move cursor to end of new value.
        const lengthDelta = this.value.length - rawDOMValue.length;
        const adjustedPos = clamped
          ? this.value.length
          : Math.max(0, Math.min(cursorPos + lengthDelta, this.value.length));
        this.formControl.value = this.value;
        this.formControl.setSelectionRange(adjustedPos, adjustedPos);
      }
      this.emit('sc-input', {
        detail: {
          value: this.value,
        },
      });
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    this.limitDecimalPlaces(this.value);
  }

  override renderFormControl() {
    return this.readonly ? html`
      <div class='sc-form-control'>${this.value}</div>
    ` : html`
      <div class='${this.borderType}' style='width: 100%'>
        <input
          custom-input-event="true"
          class='${this.borderType} sc-form-control'
          mode='${this.type}'
          .min=${this.min}
          .max=${this.max}
          .value=${this.value}
          .placeholder=${this.placeholder}
          .disabled=${this.disabled}
          @keydown=${this.onKeydown}
          @blur=${this.onBlur}
        />
      </div>
    `;
  }

  override renderClearablePart() {
    // also show clear icon when value is 0
    return html`
      ${this.clearable &&
      !this.disabled &&
      !isNaN(parseInt(this.value)) &&
      (this._hover || this._focus)
        ? this.renderClearIcon()
        : null}
    `;
  }

  override renderMoreIcons() {
    if (this.readonly || this.disabled) return null;

    return html`
      ${this.renderClearablePart()}
      <div class='arrows'>
        <span class='arrow-up' @click=${this.upArrowClick}>
          <sc-icon size='xxs' name='arrow-ios-upward'></sc-icon>
        </span>
        <span class='arrow-down' @click=${this.downArrowClick}>
          <sc-icon size='xxs' name='arrow-ios-downward'></sc-icon>
        </span>
      </div>
    `;
  }

  override render() {
    return html`
      ${this.renderBaseFormInput()}
    `;
  }
}
