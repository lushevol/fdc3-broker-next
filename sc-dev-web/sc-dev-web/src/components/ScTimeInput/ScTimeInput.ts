import { html } from 'lit';
import dayjs from 'dayjs/esm/index.js';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat/index.js';
import { msg } from '@lit/localize';
import { property, query, state } from 'lit/decorators.js';
import ScTheme from '../../styles/ScTheme.js';
import ScTimeInputStyle from './ScTimeInput.style.js';
import '../../../elements/sc-text-input.js';
import { ScTextInput } from '../ScFormInput/ScTextInput.js';
import { FormBase } from '../common/FormBase.js';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';
import {
  generateValues,
  generateAMPM,
  generateDateTimeString,
  TYPES_MAPPING,
  VALUE_OPTION,
  TIME_DEFAULT_VALUE,
  TYPES_MAPPING_TYPE,
} from './timeCaculate.js';
import { HasSlotController } from '../../shared/slot.js';
import { watch } from '../../shared/watch.js';
import { COMPACT_SIZE, TEXT_SIZE } from '../../shared/util.js';
import { waitUntil } from '@open-wc/testing';

dayjs.extend(customParseFormat);

/**
 * @summary Time input allow user to select the time.
 *
 * @dependency sl-dropdown
 * @dependency sc-text-input
 *
 * Time format:
 * H	0-23	Hours
 * HH	00-23	Hours, 2-digits
 * h	1-12	Hours, 12-hour clock
 * hh	01-12	Hours, 12-hour clock, 2-digits
 * m	0-59	Minutes
 * mm	00-59	Minutes, 2-digits
 * s	0-59	Seconds
 * ss	00-59	Seconds, 2-digits
 * A	AM PM	Post or ante meridiem, upper-case
 * a	am pm	Post or ante meridiem, lower-case
 */

export class ScTimeInput extends FormBase {
  static styles = ScTheme.getStyles().concat([ScTimeInputStyle]);

  @query('sc-text-input') input: ScTextInput;
  @query('sl-dropdown') dropdown: SlDropdown;

  private _value: TIME_DEFAULT_VALUE = {
    hour: dayjs().hour(),
    minute: dayjs().minute(),
    second: dayjs().second(),
  };

  private _AMPMValue = '';
  private _timeStr = '';
  private _clicked = false;
  private _focused = false;
  private _hovered = false;

  
  @property({ type: Boolean }) clearable = false;

  @property({ type: Number, attribute: 'hour-step' }) hourStep = 1;

  @property({ type: Number, attribute: 'minute-step' }) minuteStep = 1;

  @property({ type: Number, attribute: 'second-step' }) secondeStep = 1;

  @property({ type: String }) format = 'HH:mm';

  @property({ type: Boolean }) seconds = false;
  
  @property({ type: Boolean }) hoist = false;

  @property() value: Date | string | null = null;

  @property({ type: Array, attribute: 'disabled-hours' }) disabledHours = [];

  @property({ type: Array, attribute: 'disabled-minutes' }) disabledMinutes = [];

  @property({ type: Array, attribute: 'disabled-seconds' }) disabledSeconds = [];

  @property({ type: String, attribute: 'border-type' }) borderType : 'line' | 'box' = 'box';

  @property() size: `${COMPACT_SIZE}` = COMPACT_SIZE.md;

  @property({ attribute: 'label-size' }) labelSize: `${TEXT_SIZE}` = TEXT_SIZE.md;

  @property({ attribute: 'icon-size' }) iconSize?: `${COMPACT_SIZE}`;

  @property({ type: String, attribute: 'text-align' }) textAlign: 'left' | 'right' = 'left';

  @state() needRecover = false;

  static get scopedElements() {
    return {
      'sl-dropdown': SlDropdown,
    };
  }

  private readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'label',
    'label-tooltip'
  );

  get hasLabel() {
    return !!(this.label || this.hasSlotController.test('[default]') || this.hasSlotController.test('label'));
  }

  get hasTooltip() {
    return this.tooltip || this.hasSlotController.test('label-tooltip');
  }
  get hasHint() {
    return this.hint || this.hasSlotController.test('label-hint');
  }
  get CUSTOM_TYPES_MAPPING() {
    return this.getCustomTypesMapping();
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateStyle();
    window.addEventListener('resize', this.updateStyle);
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.updateStyle);
    super.disconnectedCallback();
  }

  updateStyle = () => {
    if (this.isLargeMobile || this.isSmallMobile) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this;
      this.updateComplete.then(() => {
        setTimeout(() => {
          if (_this.dropdown) {
            const popup: HTMLElement | null | undefined = this.dropdown.shadowRoot?.querySelector('sl-popup')?.shadowRoot?.querySelector('div[part="popup"]');
            const inputWidth = this.input?.getBoundingClientRect().width;
            popup?.style?.setProperty('min-width', `${inputWidth  }px`);
          }
        }, 0);
      });
    }
  };

  @watch('value')
  updateValue() {
    if (this.value) {
      let parseTime;
      if (typeof this.value === 'string') {
        parseTime = dayjs(this.value, this.format);
      }
      if (parseTime) {
        const hour = parseTime.hour();
        this._value = {
          hour: this._is12Hour && hour > 12 ? hour - 12 : hour,
          minute: parseTime.minute(),
          second: parseTime.second(),
        };
        const timeStr = parseTime.format(this.format);
        this._timeStr = timeStr;
        this.updateAMPM(timeStr);
        this.requestUpdate();
      }
    } else {
      this._clicked = false;
    }
  }

  get _AMPM() {
    return !!this.format.match(/a/i);
  }

  get _isUpperAMPM() {
    return !!this.format.match(/A/);
  }

  get _hours() {
    const selectedHour = (this.value || this._clicked) ? this._value?.hour : undefined;
    return generateValues(
      this._is12Hour ? 1 : 0,
      this._is12Hour ? 12 : 23,
      this.hourStep,
      this.disabledHours,
      this._is2DigitalHours,
      selectedHour
    );
  }

  get _is2DigitalHours() {
    return !!this.format.match(/hh/i);
  }

  get _minutes() {
    const selectedMinute = (this.value || this._clicked) ? this._value?.minute : undefined;
    return generateValues(
      0,
      59,
      this.minuteStep,
      this.disabledMinutes,
      this._is2DigitalMinutes,
      selectedMinute
    );
  }

  get _is2DigitalMinutes() {
    return !!this.format.match(/:mm/i);
  }

  get _seconds() {
    if (this.seconds) {
      const selectedSecond = (this.value || this._clicked) ? this._value?.second : undefined;
      return generateValues(
        0,
        59,
        this.secondeStep,
        this.disabledSeconds,
        this._is2DigitalSeconds,
        selectedSecond
      );
    }
    return [];
  }

  get _is2DigitalSeconds() {
    return !!this.format.match(/:ss/i);
  }

  get _is12Hour() {
    return !!this.format.match(/h/);
  }

  get _isAM() {
    return this._AMPMValue.toUpperCase() === 'AM';
  }

  get _placeholder() {
    if (!this._is12Hour) {
      return this.format.toUpperCase().replace('A','');
    }
    return this.format.toUpperCase().replace('A','AM');
  }

  get _time() {
    if (!this._value) {
      return '';
    }
    let { hour } = this._value;
    if (this._is12Hour) {
      if (this._isAM && hour >= 12) {
        hour = hour + 12;
      }
      if (!this._isAM) {
        hour = hour >= 12 ? hour : hour + 12;
      }
    }
    return generateDateTimeString(hour, this._value?.minute || 0, this._value?.second || 0);
  }

  updateAMPM(str: string) {
    const ap = str?.match(/am|pm/i);
    if (ap) {
      this._AMPMValue = ap?.[0];
    }
  }

  isValueInFormat(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false; 
    }
    if (this.format.match(/\d{2}:\d{2}(:\d{2})?\s(am|pm)/i)) {
      return true;
    }
    const parsedDate = dayjs(value, this.format, true);
    return parsedDate.isValid(); 
  }

  scrollToTarget() {
    this.updateComplete.then(() => {
      const lists = this.renderRoot.querySelectorAll('.list-item-container');
      lists.forEach(list => {
        const targetElement: Element | null = list?.querySelector(
          '.list-item.selected'
        );
        if (targetElement) {
          const position = targetElement.getAttribute('data-value');
          list.scrollTo(0, (Number(position) - 1) * targetElement.clientHeight);
        }
      });
    });
  }

  handleClear() {
    this._timeStr = '';
    this._clicked = false;
    //@ts-ignore
    this._value =  null;
    this.emit('sc-clear');
    this.requestUpdate();
  }

  handleFocus(detailObj?:CustomEvent) {
    this._focused = true;
    this.emit('sc-focus', { detail: (detailObj as CustomEvent).detail });
    this.requestUpdate();
  }

  handleBlur(detailObj?:CustomEvent) {
    this._focused = false;
    this.emit('sc-blur', { detail: (detailObj as CustomEvent).detail });
    this.requestUpdate();
    if (this.needRecover) {
      this.needRecover = false;
      this.value = '' as any;
      this._clicked = false;
      const newHour = this._hours.find(h=>h.selected);
      const newMinute = this._minutes.find(m=>m.selected);
      const newSecond = this._seconds.find(s=>s.selected);
      this._value = {
        hour: newHour ? Number(newHour.value) : this._value.hour,
        minute: newMinute ? Number(newMinute.value) : this._value.minute,
        second: newSecond ? Number(newSecond.value) : this._value.second,
      };
      setTimeout(()=>{
        this._clicked = true;
        this.value = dayjs(this._time).format(this.format) as any;
      },100);
    }
  }

  handleInput(detailObj?:CustomEvent) {
    const value = detailObj?.detail?.value;
    if (!this.isValueInFormat(value)) {
      this.needRecover = true;
      return;
    }
    const parseTime = dayjs(value, this.format);
    this.updateAMPM(parseTime.format(this.format));
    let hour = parseTime.hour();
    if (!this._isAM && hour > 12) {
      hour -= 12;
    }
    const minute = parseTime.minute();
    const second = parseTime.second();
    const hours = this._hours.filter(h=>!h.disabled).map(h=>h.value);
    const minutes = this._minutes.filter(h=>!h.disabled).map(m=>m.value);
    const seconds = this._seconds.filter(h=>!h.disabled).map(s=>s.value);
    if (hours.includes(hour) && minutes.includes(minute) && (this.seconds ? seconds.includes(second) : true)) {
      // update UI
      this.value = value;
      this.needRecover = false;
      // trigger input
      this.emit('sc-input', {
        detail: {
          value,
        },
      });
    }
    else {
      this.needRecover = true;
    }
  }

  handleMouseOver() {
    if (this.disabled || this.readonly) {
      return;
    }
    this._hovered = true;
    this.requestUpdate();
  }

  handleMouseLeave() {
    this._hovered = false;
    this.requestUpdate();
  }

  private _shouldRenderClockIcon() {
    if (this.disabled) {
      return true;
    }

    if (this.error) {
      return false;
    }

    if (!this._timeStr) {
      return true;
    }

    if (!this.clearable) {
      return true;
    }

    if (this._timeStr && !this._focused && !this._hovered) {
      return true;
    }
    return false;
  }

  renderSingleTimeInput() {
    const hasDefaultSlot = this.hasSlotController.test('[default]');
    const hasLabelSlot = this.hasSlotController.test('label');
    return this.readonly ? html`
      <sc-text-input
        .label=${this.label}
        .required=${this.required}
        .error=${this.error}
        .success=${this.success}
        .readonly=${this.readonly}
        .disabled=${this.disabled}
        .truncate=${this.truncate}
        border-type=${this.borderType}
        .placeholder=${this.placeholder || this._placeholder}
        .value=${
          !this.value && !this._clicked
          ? ''
          : dayjs(this._time).format(this.format)
        }
        .size=${this.size}
        .icon-size=${this.iconSize}
        .text-align=${this.textAlign}
        .hint=${this.hint}
        help-text=${this.helpText}
        error-message=${this.errorMessage}
        success-message=${this.successMessage}
        .tooltip=${this.tooltip}
        tooltip-placement=${this.tooltipPlacement}
        label-size=${this.labelSize}
        >
          ${this.label ? null : hasDefaultSlot ? html`<slot></slot>` : null}
          ${this.label ? null : hasLabelSlot ? html`<slot name='label' slot='label'></slot>` : null}
          ${this.hasTooltip ? html`<slot name='label-tooltip' slot='label-tooltip'>${this.tooltip}</slot>` : ''}
          ${this.hasHint ? html`<slot name='label-hint' slot='label-hint'>${this.hint}</slot>` : ''}
          <slot name='help' slot='help'>${this.helpText}</slot>
          <slot name='error' slot='error'>${this.errorMessage}</slot>
          <slot name='success' slot='success'>${this.successMessage}</slot>
        </sc-text-input>
        ` : html`
        <sl-dropdown 
          .disabled=${this.disabled} 
          style='width: 100%' 
          ?hoist=${this.hoist}
          @sl-after-show=${this.scrollToTarget}
          @sl-hide=${this.stopDefaultEvent}
          @sl-show=${this.stopDefaultEvent}
        >
          <div slot='trigger'>
            <sc-text-input
              ?clearable=${this.clearable}
              @sc-clear=${this.handleClear}
              @sc-focus=${this.handleFocus}
              @sc-blur=${this.handleBlur}
              @sc-input=${this.handleInput}
              @sc-mouseover=${this.handleMouseOver}
              @sc-mouseleave=${this.handleMouseLeave}
              .label=${this.label}
              .required=${this.required}
              .error=${this.error}
              .success=${this.success}
              .readonly=${this.readonly}
              .disabled=${this.disabled}
              .truncate=${this.truncate}
              border-type=${this.borderType}
              .placeholder=${this.placeholder || this._placeholder}
              .value=${
                !this.value && !this._clicked
                  ? ''
                  : dayjs(this._time).format(this.format)
              }
              .size=${this.size}
              .icon-size=${this.iconSize}
              .text-align=${this.textAlign}
              .hint=${this.hint}
              help-text=${this.helpText}
              error-message=${this.errorMessage}
              success-message=${this.successMessage}
              .tooltip=${this.tooltip}
              tooltip-placement=${this.tooltipPlacement}
              label-size=${this.labelSize}
              suffix-icon=${ this._shouldRenderClockIcon() ? 'clock--line' : ''}
            >
              ${this.label ? null : hasDefaultSlot ? html`<slot></slot>` : null}
              ${this.label ? null : hasLabelSlot ? html`<slot name='label' slot='label'></slot>` : null}
              ${this.hasTooltip ? html`<slot name='label-tooltip' slot='label-tooltip'>${this.tooltip}</slot>` : ''}
              ${this.hasHint ? html`<slot name='label-hint' slot='label-hint'>${this.hint}</slot>` : ''}
              <slot name='help' slot='help'>${this.helpText}</slot>
              <slot name='error' slot='error'>${this.errorMessage}</slot>
              <slot name='success' slot='success'>${this.successMessage}</slot>
            </sc-text-input>
          </div>
          ${this.renderTimeSelector()}
        </sl-dropdown>
    `;
  }

  renderTimeSelector() {
    return html`
      <div class='time-list-wrapper'>
        <div class='list'>${this.renderList(this._hours, 'hour')}</div>
        <div class='list'>${this.renderList(this._minutes, 'minute')}</div>
        ${this.seconds 
          ? html`
              <div class='list'>
                ${this.renderList(this._seconds, 'second')}
              </div>
            `
          : ''}
        ${this._AMPM && this._is12Hour
          ? html`
              <div class='list'>
                ${this.renderList(
                generateAMPM(this._isUpperAMPM, this._AMPMValue),
                'AM/PM'
              )}
              </div>
            `
          : ''}
      </div>
    `;
  }

  getCustomTypesMapping() {
    return {} as TYPES_MAPPING_TYPE;
  }

  renderList(options: VALUE_OPTION[] = [], type = '') {
    return html`
      <ul class=list-container ${options.length}-items'>
        <li class='list-title'>
          <span class="title-content">${type.toUpperCase() === 'AM/PM' ? type : msg(TYPES_MAPPING[type], { id: `sc-time-${TYPES_MAPPING[type].toLocaleLowerCase()}-text` })}</span>
        </li>
        <li>
          <sc-scrollbar selector="" round no-x></sc-scrollbar>
          <ul class='list-item-container'>
            ${options.map(
              option => html`
                <li
                  class='list-item'
                  data-value=${option.value}
                  @click=${() => this.handleItemClick(option, type)}
                >
                  <span 
                  class='item-content
                  ${option.selected ? 'selected' : ''}
                  ${option.disabled ? 'disabled' : ''}'>
                    ${option.label}
                  </span>
                </li>
              `
              )}
          </ul>
        </li>
      </ul>
    `;
  }

  handleItemClick(option: VALUE_OPTION, type: string) {
    if (option.disabled) return;
    this._clicked = true;
    if (type.toUpperCase() === 'AM/PM') {
      this._AMPMValue = option.value as string;
    } else {
      this._value = {
        ...this._value,
        [type]: option.value,
      } as TIME_DEFAULT_VALUE;
    }
    const newVal = dayjs(this._time).format(this.format);
    this._timeStr = newVal;
    this.emit('sc-input', {
      detail: {
        value: newVal,
      },
    });
    this.requestUpdate();
  }

  renderTimeInputStyle() {
    const iconStyle = html`
      <style>
        .sc-time-input .arrow-icon.box {
          --sc-form-input-padding-right: 0.125rem;
        }
        .sc-time-input:not(.disabled) .arrow-icon {
          cursor: pointer;
        }
        .sc-time-input .arrow-icon {
          position: absolute;
          /* color: var(--sc-form-input-color, var(--sc-color-blue-900)); */
          right: var(--sc-form-input-padding-right, 0);
          top: -0.125rem; 
        }
      </style>
    `;

    return html`${iconStyle}`;
  }

  render() {
    return html`
      ${this.renderTimeInputStyle()}
      <div class='sc-time-input ${this.disabled ? 'disabled' : ''} ${this.readonly ? 'readonly' : ''}'>${this.renderSingleTimeInput()}</div>
    `;
  }
}
