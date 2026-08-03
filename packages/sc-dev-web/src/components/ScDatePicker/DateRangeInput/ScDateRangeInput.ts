
import { html, type PropertyValues } from 'lit';
import { property, queryAsync, state } from 'lit/decorators.js';

import { maxMonthDays } from '../constants.js';
import type { ScDatePicker } from '../DatePicker/ScDatePicker.js';
import { scDatePickerName } from '../DatePicker/constants.js';
import type { ScDateInputSurface } from '../DateInputSurface/ScDateInputSurface.js';
import { scDateInputSurfaceName } from '../DateInputSurface/constants.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { ElementMixin } from '../mixins/element-mixin.js';
import { baseStyling } from '../ScDatePicker.style.js';
import type { RangeValue } from '../typings.js';
import { dateRangePickerInputStyling } from './ScDateRangeInput.style.js';
import type { DateInputProperties } from './typings.js';
import ScTheme from '../../../styles/ScTheme.js';
import '../../../../elements/sc-icon.js';
import { FormInputBase } from '../../ScFormInput/FormInputBase.js';
import { getDate } from '../helpers/get-date.js';

export class ScDateRangeInput extends ElementMixin(
  DatePickerMixin(DatePickerMinMaxMixin(FormInputBase))
) implements DateInputProperties {
  public static styles = ScTheme.getStyles().concat([
    baseStyling,
    dateRangePickerInputStyling,
  ]);

  @state() _startShown = false;

  @state() _endShown = false;

  _dataId = String(getDate().getTime() + Math.random());

  @queryAsync('.divider') protected $divider!: Promise<HTMLInputElement | null>;

  @queryAsync(scDateInputSurfaceName) protected $inputSurface!: Promise<ScDateInputSurface | null>;

  @queryAsync(scDatePickerName) protected $picker!: Promise<ScDatePicker | null>;

  @property({ type: Object, attribute: 'start-config' }) public startConfig: FormInputBase;

  @property({ type: Object, attribute: 'end-config' }) public endConfig: FormInputBase;

  // @ts-ignore
  @property({ type: Object }) public value: RangeValue; 

  get startTooltip() {
    return !!(this.startConfig?.tooltip || this.hasSlotController.test('start-label-tooltip'));
  }

  get endTooltip() {
    return !!(this.endConfig?.tooltip || this.hasSlotController.test('end-label-tooltip'));
  }

  public override async firstUpdated(): Promise<void> {
    this.setAttribute('data-id', this._dataId);
  }

  public closePicker = (): void =>  {
    this._endShown = false;
    this._startShown = false;
  };

  // eslint-disable-next-line
  onDateChange(event: CustomEvent, type: string) {
    event.stopPropagation();
    event.preventDefault();
    const {
      value,
      valueAsDate,
    } = event.detail;

    if (typeof value === 'string') return;
    this.value = {
      ...this.value,
      ...value,
    };

    if (this.value.start)
      this.emit('sc-change', {
        detail: {
          value: this.value,
          valueAsDate,
        },
      });
  }

  handleClear(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    (this.value as string) = '';
    this.requestUpdate();
    this.emit('sc-clear');
  }

  handleClick(e: Event, type: 'start' | 'end') {
    if (this.disabled || this.readonly) {
      this.closePicker();
      return;
    }

    const target = (e.composedPath?.()?.[0] as HTMLElement) || (e.target as HTMLInputElement);
    if (target?.tagName === 'TD') {
      e.stopPropagation();
    }

    if (type === 'start') {
      this._endShown = false;
      this._startShown = true;
    } else if (type === 'end') {
      this._startShown = false;
      this._endShown = true;
    }
  }

  public override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    if ((changedProperties.has('disabled') || changedProperties.has('readonly')) && (this.disabled || this.readonly)) {
      this.closePicker();
    }
  }

  highLightDivider = async (highLighted:boolean) => {
    const {
      borderType,
    } = this;
    if (borderType === 'line') return;
    const divider = await this.$divider;
    if (divider) {
      divider.style.borderLeftColor = highLighted ? 
        'var(--sc-form-input-focus-border-color)' : 
        'var(--sc-date-picker-border-color)';
    }
  };

  renderDatePicker(type: string) {
    // @ts-ignore
    const config: FormInputBase = this[`${type}Config`] || {};
    const {
      chooseMonthLabel,
      chooseYearLabel,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      locale,
      max,
      min,
      minYear,
      maxYear,
      nextMonthLabel,
      previousMonthLabel,
      selectedDateLabel,
      selectedYearLabel,
      shortWeekLabel,
      showWeekNumber,
      startView,
      picker,
      todayLabel,
      toyearLabel,
      value,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
      borderType,
      disabled,
      readonly,
      format,
      clearable,
      hoist,
      quickSelector,
      quickSelectorItems,
      showTime,
      seconds,
    } = this;
    let rangeDays = 0;
    if (!value?.end) {
      rangeDays = maxMonthDays;
    }
    const isPickerOpen = !(disabled || readonly || config.readonly) &&
      (type === 'start' ? this._startShown : this._endShown);

    const commonClass = `${type}-date-picker`;
    const boxClose =  borderType === 'box' ? `box-${type}-date-picker` : '';
    const boxFocus = borderType === 'box' ? 'date-picker-focus' : '';
    const moreIcon = `${borderType}-start-date-picker-more`;
    return html`
      <sc-date-input
        class=${`${commonClass} ${boxClose} ${boxFocus} ${moreIcon}`}
        data-id=${this._dataId}
        .label=${config.label}
        .rangeDays=${rangeDays}
        ?clearable=${clearable}
        ?required=${config.required}
        ?error=${config.error}
        ?success=${config.success}
        ?readonly=${config.readonly}
        .placeholder=${config.placeholder}
        help-text=${config.helpText}
        border-type=${borderType}
        error-message=${config.errorMessage}
        success-message=${config.successMessage}
        ?tooltip=${config.tooltip}
        tooltip-placement=${config.tooltipPlacement}
        label-size=${config.labelSize} 
        ?show-week-number=${showWeekNumber}
        .chooseMonthLabel=${chooseMonthLabel}
        .chooseYearLabel=${chooseYearLabel}
        .disabledDates=${disabledDates}
        .disabledDays=${disabledDays}
        ?disabled=${disabled}
        .firstDayOfWeek=${firstDayOfWeek}
        .locale=${locale}
        .max=${max}
        .min=${min}
        .minYear=${minYear}
        .maxYear=${maxYear}
        .nextMonthLabel=${nextMonthLabel}
        .previousMonthLabel=${previousMonthLabel}
        .selectedDateLabel=${selectedDateLabel}
        .selectedYearLabel=${selectedYearLabel}
        .shortWeekLabel=${shortWeekLabel}
        .startView=${startView}
        .picker=${picker}
        .todayLabel=${todayLabel}
        .toyearLabel=${toyearLabel}
        .value=${value}
        .format=${format}
        .weekLabel=${weekLabel}
        .weekNumberTemplate=${weekNumberTemplate}
        .weekNumberType=${weekNumberType}
        range
        position-type=${type}
        ?open=${isPickerOpen}
        ?hoist=${hoist}
        display-value=${type}
        .size=${config.size || this.size}
        .iconSize=${config.iconSize || this.iconSize}
        .textAlign=${config.textAlign || this.textAlign}
        ?quick-selector=${quickSelector}
        ?show-time=${showTime}
        ?seconds=${seconds}
        .quickSelectorItems=${quickSelectorItems}
        @sc-change=${(event: CustomEvent) => this.onDateChange(event, type)}
        @sc-clear=${(event: Event) => this.handleClear(event)}
        @sc-close=${this.closePicker}
        @click=${(e: Event) => this.handleClick(e, type as 'start' | 'end')}
        @focus=${()=>this.highLightDivider(true)}
        @blur=${()=>this.highLightDivider(false)}
      >
      </sc-date-input>
    `;
  }

  renderDivider = () => {
    const {
      borderType,
    } = this;
    const typeDivider = `${borderType}-divider`;
    return html`
       <span class=${`${typeDivider} divider`}></span>
    `;
  };
  override renderFormControl()  {
    if (this.readonly) {
      return html`
        <div 
          class='sc-form-control'
          style='padding-left: 0; padding-right: 0'
        >
          ${this.value ? this.value.start : ''} ${this.value?.end ? `~ ${this.value.end}` : ''}
        </div>`;
    }
    return html`
      <div class="container">
        ${this.renderDatePicker('start')}
        <div class="date-range-input-gap"></div>
        ${this.renderDatePicker('end')}
      </div>
    `;
  }
}
