import { html, nothing } from 'lit';
import { property, query, queryAll } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import * as Keys from '../../shared/key-values.js';
import { isNumber, validNumber } from '../../shared/number.js';
import { watch } from '../../shared/watch.js';
import ScTheme from '../../styles/ScTheme.js';
import { FormInputBase } from '../ScFormInput/FormInputBase.js';
import { ScNumberInput } from '../ScFormInput/ScNumberInput.js';
import ScSliderStyle from './ScSlider.style.js';
import { ScSliderStop } from './ScSliderStop.js';

interface NumberType {
  type: 'number';
  value: number;
}
interface RangeType {
  type: 'range';
  value: [number, number];
}
interface StringType {
  type: 'string';
  value: string;
}

export class ScSlider extends FormInputBase {
  static dependencies = {
    'sc-slider-stop': ScSliderStop,
    'sc-number-input': ScNumberInput,
  };
  static styles = ScTheme.getStyles().concat([ScSliderStyle]);

  @property({
    type: String,
    attribute: 'value',
    converter: (value: string | null): number | string | [number, number] =>
        value !== null ? validateValue(value) : '',
  }) value: number | string | [number, number];

  @property({ type: String }) type: 'number' | 'string' | 'range' = 'number';
  @property({ type: Number }) step = 1;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Boolean, attribute: 'no-input' }) noInput = this.type === 'string';
  @property({ type: Boolean, attribute: 'no-badge' }) noBadge = this.type === 'string';
  @property({ type: Boolean, attribute: 'realtime' }) realtime = false;
  @property({ type: Boolean }) compact = this.type === 'string';
  @property({ type: Number, attribute: 'stop-step' }) stopStep:
    | number
    | undefined;
  @property({ attribute: false }) stops: ScSliderStop[] = [];

  /// overrides
  @property({ type: Boolean, attribute: false }) useDefaultSlotNotAsLabel =
    true;
  @property({ type: String, attribute: false }) formControlClsName =
    'non-existing';

  @query('.slider') private _slider: HTMLElement;
  @query('.slider-track') private _track: HTMLElement;
  @queryAll('.slider-handle') private _handles: NodeListOf<HTMLElement>;

  // internal step position values
  private _positions: [number, number] = [0, 0];
  // index of handle being dragged, or null if not dragging
  private _handleIndex: 0 | 1 = 0;
  private _isDragging = false;

  bindEvents() {
    super.bindEvents();
    this._onSlotChange();
  }

  private _onDragStart = (e: MouseEvent) => {
    if (this.disabled) return;
    e.preventDefault();

    if (this.isRangeType()) {
      const value = this.getPositionFromGlobal(e.clientX);
      // closest handle
      this._handleIndex =
        this._positions[0] !== this._positions[1]
          ? Math.abs(this._positions[0] - value) <
            Math.abs(this._positions[1] - value)
            ? 0
            : 1
          : value > this._positions[0]
          ? 1
          : 0;
    } else {
      this._handleIndex = 1;
    }
    const value = this.getPositionFromGlobal(e.clientX, this.step);
    this.moveHandle(this._handleIndex, value);
    this._isDragging = true;

    const handle = this._handles[this._handleIndex];
    handle.classList.add('active');
    this._slider.focus();

    window.addEventListener('mousemove', this._onDragMove);
    window.addEventListener('mouseup', this._onDragEnd);
    window.addEventListener('blur', this._onDragEnd);
  };

  private _onDragMove = (e: MouseEvent) => {
    if (this._isDragging) {
      const value = this.getPositionFromGlobal(e.clientX, this.step);
      this.moveHandle(this._handleIndex, value);
      this._slider.classList.add('no-transition');
    }
  };

  private _onDragEnd = () => {
    window.removeEventListener('mousemove', this._onDragMove);
    window.removeEventListener('mouseup', this._onDragEnd);
    window.removeEventListener('blur', this._onDragEnd);
    this._isDragging = false;

    this._slider.classList.remove('no-transition');
    this._handles[this._handleIndex].classList.remove('active');
    if (!this.realtime) {
      this.syncValue();
    }
  };

  private _onKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) return;

    const index = Array.from(this._handles).indexOf(e.target as HTMLElement);
    if (index > -1) {
      this._handleIndex = index as 0 | 1;
    }

    const position = this._positions[this._handleIndex];
    let step = e.ctrlKey && !this.isStringType() ? this.step * 5 : this.step;

    switch (e.code) {
      case Keys.keyArrowRight:
      case Keys.keyArrowUp:
        if (e.ctrlKey && !this.isStringType() && this.stopStep) {
          step = this.stopStep - ((position + this.min) % this.stopStep);
          if (step === 0) step = this.stopStep;
        }
        break;
      case Keys.keyArrowLeft:
      case Keys.keyArrowDown:
        if (e.ctrlKey && !this.isStringType() && this.stopStep) {
          step = (position - this.min) % this.stopStep;
          if (step === 0) step = this.stopStep;
        }
        step *= -1;
        break;
      default:
        return;
    }
    this.moveHandle(this._handleIndex, position + step);
    e.preventDefault();
  };
  private _onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case Keys.keyArrowRight:
      case Keys.keyArrowDown:
      case Keys.keyArrowLeft:
      case Keys.keyArrowUp:
        this.syncValue();
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  private _onSlotChange() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot.stops');
    this.stops = (slot?.assignedElements() ?? []).filter(
      el => el.tagName === 'SC-SLIDER-STOP'
    ) as ScSliderStop[];

    if (this.type === 'string') {
      const count = this.stops.length;
      const maxWidth = 100 / (count - 1);
      // overrides attribute if options are present
      this.min = 0;
      this.max = count - 1;
      this.step = 1;
      this.stops.forEach((el, i) => {
        el.toggleAttribute('truncate', this.truncate);
        el.style.left = `${(i / (count - 1)) * 100}%`;
        el.style.maxWidth = this.truncate ? `${i % (count - 1) ? maxWidth : (maxWidth / 2)}%` : '';
      });
    } else {
      this.stops.forEach(stop => {
        stop.classList.add('absolute');
        stop.style.left = `${this.getPositionPercent(
          Number(stop.value ?? this.min)
        )}%`;
      });
    }
  }

  isNumberType(): this is NumberType {
    return this.type === 'number';
  }
  isStringType(): this is StringType {
    return this.type === 'string';
  }
  isRangeType(): this is RangeType {
    return this.type === 'range';
  }
  get hasStops(): boolean {
    return this.stops.length > 0 || !!this.stopStep;
  }

  @watch(['value', 'min', 'max'])
  async onValueChange() {
    await this.updateComplete;
    const old = this._positions;
    const { min, max } = this;
    if (this.isRangeType()) {
      if (!this.value) this.value = [min, min];
      this._positions = [...(this.value as [number, number])];
    } else {
      if (this.value === null) this.value = min;
      this._positions = [
        min,
        this.isStringType()
          ? this.stops.findIndex(stop => stop.value === this.value)
          : (this.value as number),
      ];
    }
    this._positions = [
      this.normalizePosition(
        Math.max(Math.min(this._positions[0], this._positions[1], max), min)
      ),
      this.normalizePosition(
        Math.min(Math.max(this._positions[1], this._positions[0], min), max)
      ),
    ];
    this.requestUpdate('_positions', old);
  }

  @watch('truncate')
  onTruncateChange() {
    this._onSlotChange();
  }

  /**
   * If type is string, returns the stop value at the given position. Otherwise returns same position as value.
   * @param position
   * @returns
   */
  getStopValue(position: number): number | string {
    const stops = this.stops;
    return this.type === 'string' && stops.length > 0
      ? stops[position].value
      : position;
  }

  getStopLabel(position: number): string | null {
    const stops = this.stops;
    return this.type === 'string' && stops.length > 0
      ? stops[position].textContent?.trim() ?? ''
      : null;
  }

  getTrackStyle(): { left: number; width: number } {
    const left = this.getPositionPercent(this._positions[0]);
    const width = this.getPositionPercent(this._positions[1]) - left;
    return { left, width };
  }

  /**
   * Syncs the position(s) to value and emits `sc-change` event
   */
  syncValue() {
    let value: typeof this.value;
    if (this.isRangeType()) {
      if (
        this._positions[0] === this.value[0] &&
        this._positions[1] === this.value[1]
      )
        return;
      // trick to normalize -0
      value = [...this._positions];
    } else {
      if (this._positions[1] === this.value) return;
      value = this.getStopValue(this._positions[1]);
    }
    this.value = value;
    this.emit('sc-change', { detail: { value } });
  }

  /**
   * Moves the handle based on position
   * @param handleIndex
   * @param pos
   */
  moveHandle(handleIndex: number, position: number) {
    if (this.disabled) return;

    let pos = this.normalizePosition(position);
    if (this.isRangeType()) {
      if (handleIndex === 0) {
        pos = Math.max(this.min, Math.min(this._positions[1], pos));
      } else {
        pos = Math.max(this._positions[0], Math.min(this.max, pos));
      }
    } else {
      pos = Math.max(this.min, Math.min(this.max, pos));
    }

    if (this._positions[handleIndex] !== pos) {
      this._positions[handleIndex] = pos;

      const handle = this._handles[handleIndex];
      handle.style.left = `${this.getPositionPercent(pos)}%`;
      handle.setAttribute('value', String(pos));

      const { left, width } = this.getTrackStyle();
      this._track.style.left = `calc(${left}% - 0.625rem)`;
      this._track.style.width = `calc(${width}% + 1.25rem)`;

      if (this.realtime) {
        this.syncValue();
      } else {
        const input = this.shadowRoot?.querySelector<HTMLInputElement>(
          `.input-${handleIndex}`
        );
        if (input) input.value = `${this.getStopValue(pos)}`;
      }
    }
  }

  /**
   * Normalizes the position based on step interval
   * @param position 
   * @returns 
   */
  normalizePosition(position: number): number {
    return Math.round((position - this.min) / this.step) * this.step + this.min;
  }

  /**
   * Converts viewport position into slider track position
   * @param globalPos
   * @param step - optional, will round off into steps
   * @returns `number` track position
   */
  getPositionFromGlobal(globalPos: number, step?: number) {
    const min = this.min ?? 0;
    const max = this.max ?? 100;
    const rect = this._slider.getBoundingClientRect();
    let percent = (globalPos - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    let value = min + percent * (max - min);
    if (step) value = Math.round(value / step) * step;
    return value;
  }

  /**
   * Converts position to percentage (width)
   * @param position
   * @returns `number` 0-100
   */
  getPositionPercent(position: number): number {
    const { min, max } = this;
    if (min === undefined || max === undefined) return 0;
    if (max === min) return 0;
    return ((position - min) / (max - min)) * 100;
  }

  renderHandleStops() {
    return html`
      <slot class="stops string-stops" @slotchange=${this._onSlotChange}></slot>

      ${this.renderStepStops()}

      <span
        class="slider-handle handle-0"
        tabindex="${this.disabled ? -1 : 0}"
        .ariaDisabled=${String(this.disabled)}
        role="slider"
        aria-label="Lower value"
        aria-valuenow="${this._positions[0]}"
        aria-valuemin="${this.min}"
        aria-valuemax="${Math.min(this.max, this._positions[1])}"
        style="left: ${this.getPositionPercent(
          this._positions[0]
        )}%; display: ${this.isRangeType() ? 'block' : 'none'}"
        value="${this._positions[0]}"
      ></span>

      <span
        class="slider-handle handle-1"
        tabindex="${this.disabled ? -1 : 0}"
        .ariaDisabled=${String(this.disabled)}
        role="slider"
        aria-label=${this.isRangeType() ? 'Higher value' : this.label}
        aria-valuenow="${this._positions[1]}"
        aria-valuemin="${Math.max(this.min, this._positions[0])}"
        aria-valuemax="${this.max}"
        .ariaValueText=${this.getStopLabel(this._positions[1])}
        style="left: ${this.getPositionPercent(this._positions[1])}%"
        value="${this._positions[1]}"
      ></span>
    `;
  }

  renderStepStops() {
    if (this.isStringType() || !this.stopStep) return nothing;
    const stopStep = this.stopStep;
    const stops = Array.from(
      { length: Math.floor((this.max - this.min) / this.stopStep) + 1 },
      (_, i) => this.min + i * stopStep
    );

    return html`<span class="stops step-stops">
      ${stops.map(
        (value, index) => html`<sc-slider-stop
          value=${value}
          class="${(stops.length - 1) / 2 === index ? 'middle-child' : ''}"
          style="left: ${this.getPositionPercent(value)}%"
        >
          ${value}
        </sc-slider-stop>`
      )}
    </span>`;
  }

  renderInput(index: number) {
    if (this.noInput) return nothing;
    if (index === 0) {
      return this.isRangeType()
        ? html`<sc-number-input
            class="input input-0"
            .value=${this._positions[0]}
            min=${this.min}
            max=${Math.min(this.max, this._positions[1] - this.step)}
            placeholder=""
            ?disabled=${this.disabled}
            ?error=${this.error}
            @sc-input=${(e: CustomEvent) =>
              this.moveHandle(0, Number(e.detail.value))}
          ></sc-number-input>`
        : nothing;
    }
    return this.isNumberType() || this.isRangeType()
      ? html`<sc-number-input
          class="input input-1"
          .value=${this._positions[1]}
          min=${this.isRangeType()
            ? Math.max(this.min, this._positions[0] + this.step)
            : this.min}
          max=${this.max}
          placeholder=""
          ?disabled=${this.disabled}
          ?error=${this.error}
          @sc-input=${(e: CustomEvent) =>
            this.moveHandle(1, Number(e.detail.value))}
        ></sc-number-input>`
      : nothing;
  }

  renderFormControl() {
    if (this.readonly)
      return html`
        ${this.isRangeType() && Array.isArray(this.value)
          ? this.value.join(' – ')
          : this.getStopLabel(this._positions[1]) ?? this.value}

        <slot class="stops hidden" @slotchange=${this._onSlotChange}></slot>
      `;

    const { left, width } = this.getTrackStyle();

    return html`<div
      class=${classMap({
        container: true,
        marked: this.hasStops,
        [this.type]: true,
        'no-badge': this.noBadge,
        'no-label': !this.label,
        compact: this.compact,
      })}
    >
      ${this.renderInput(0)}

      <div
        class="slider"
        tabindex="-1"
        @mousedown=${this._onDragStart}
        @keydown=${this._onKeyDown}
        @keyup=${this._onKeyUp}
      >
        <span class="slider-rail"></span>

        <span
          class="slider-track"
          style="left: calc(${left}% - 0.625rem); width: calc(${width}% + 1.25rem);"
        ></span>

        ${this.renderHandleStops()}
      </div>

      ${this.renderInput(1)}
    </div>`;
  }
}

function validateValue(valueStr: string): number | string | [number, number] {
  let value: any = valueStr;
  try {
    value = JSON.parse(valueStr);
    if (Array.isArray(value) && value.length === 2) {
      return [validNumber(value[0]), validNumber(value[1])];
    } else if (typeof value === 'number' || typeof value === 'string') {
      if (isNumber(value)) return validNumber(value);
      return value;
    }
  } catch (e) {}
  return '';
}
