import { html, type PropertyValues, type TemplateResult } from 'lit';
import { state, property, queryAssignedElements } from 'lit/decorators.js';
import { dateRangePickerStyling } from './ScDateRangePicker.style.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { RootElement } from '../root-element/root-element.js';
import { toDateString } from '../helpers/to-date-string.js';
import { slotDatePicker } from '../helpers/slot-date-picker.js';
import type { DatePickerProperties, RangeValue } from '../typings.js';
import { watch } from '../../../shared/watch.js';
import ScTheme from '../../../styles/ScTheme.js';
import '../../../../elements/sc-icon.js';
import { maxMonthDays } from '../constants.js';
import { getDate } from '../helpers/get-date.js';

export class ScDateRangePicker extends DatePickerMixin(
  DatePickerMinMaxMixin(RootElement)
) implements DatePickerProperties {
  public static styles = ScTheme.getStyles().concat([
    dateRangePickerStyling,
  ]);

  @state() _selectedStartDate: string;

  @state() _selectedEndDate: string;

  @state() _endDatePickerDate: Date;

  private _value: RangeValue;
  // @ts-ignore
  // @property({ type: Object }) public value: RangeValue; 
  @property({ type: String }) public startValue = '' ;
   
  @property({ type: String }) public endValue = ''; 

  @queryAssignedElements({ selector: 'sc-date-picker' })
  public calendars: Array<any>;

  @watch('value')
  updateStartValue() {
    this.applyDefaultBoundarySelection();
  }

  private applyDefaultBoundarySelection() {
    const hasStart = Boolean(this.value?.start);
    const hasEnd = Boolean(this.value?.end);

    if (hasStart || hasEnd) {
      this._selectedStartDate = this.value?.start;
      this._selectedEndDate = this.value?.end;
      return;
    }

    this._selectedStartDate = '';
    this._selectedEndDate = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.applyDefaultBoundarySelection();
    const whenAllDefined = Promise.all([
      customElements.whenDefined('sc-date-picker'),
    ]);

    super.connectedCallback();
    this.updateComplete.then(() => {
      whenAllDefined.then(() => {
        const calendars = this.renderRoot.querySelectorAll('sc-date-picker');
        if (calendars) {
          Array.from(calendars).forEach((c: any) => {
            c.withoutBorder = false;
            c.range = true;
          });
        }
      });
    });

  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('min') || changedProperties.has('max') || changedProperties.has('value')) {
      this.applyDefaultBoundarySelection();
    }
  }

  onDatePickerValueUpdated = async (ev: CustomEvent, type: string): Promise<void> => {
    const {
      value,
      valueAsDate,
      quickSelect,
      timeSelect,
    } = ev.detail;
    const today = getDate();
    const todayValueStr = toDateString(today);

    if (quickSelect) {
      if (valueAsDate < today) {
        this._selectedStartDate = toDateString(valueAsDate);
        this._selectedEndDate = todayValueStr;
      } else {
        this._selectedStartDate = todayValueStr;
        this._selectedEndDate = toDateString(valueAsDate);
      }

      this._value = {
        start: this._selectedStartDate,
        end: this._selectedEndDate,
      };

      this._endDatePickerDate = getDate(this._selectedEndDate);
    } else {
      if (type === 'start') {
        this._selectedStartDate = value;
      } else {
        this._selectedEndDate = value;
      }
      const valueStr = (timeSelect && typeof value === 'string')
        ? value
        : toDateString(valueAsDate, this.picker, this.showTime, { format: this.format });
      
      this._value = {
        ...(this._value || {}),
        [type]: valueStr,
      };
    }

    if (this._value?.end && this.isMobile) {

    } else {
      ev.stopPropagation();
      ev.preventDefault();
    }

    this.emit('sc-select', {
      detail: {
        isKeypress: false,
        value: {
          ...(this._value || {}),
        },
        valueAsDate,
        valueAsNumber: +valueAsDate,
        quickSelect: quickSelect || false,
        timeSelect,
      },
    });
  };

  protected renderStartCalendar(): TemplateResult {
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
      picker,
      nextMonthLabel,
      previousMonthLabel,
      selectedDateLabel,
      selectedYearLabel,
      shortWeekLabel,
      showWeekNumber,
      startView,
      todayLabel,
      toyearLabel,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
      _selectedEndDate,
      _selectedStartDate,
      quickSelector,
      quickSelectorItems,
      showTime,
      seconds,
      format,
      timeValue,
    } = this;
    const timeValueStr = _selectedStartDate
      ? (timeValue?.start || this.defaultTimeValue)
      : '';
    return html`
    <div
      class="sc-date-range-picker-start"
    >
      ${slotDatePicker({
        chooseMonthLabel,
        chooseYearLabel,
        disabledDates,
        disabledDays,
        firstDayOfWeek,
        locale,
        max: _selectedEndDate || max,
        min,
        minYear,
        maxYear,
        nextMonthLabel,
        onDatePickerDateUpdated: (e: CustomEvent) => this.onDatePickerValueUpdated(e, 'start'),
        onDatePickerFirstUpdated: () => {},
        previousMonthLabel,
        selectedDateLabel,
        selectedYearLabel,
        shortWeekLabel,
        showWeekNumber,
        startView,
        picker,
        todayLabel,
        toyearLabel,
        value: _selectedStartDate,
        weekLabel,
        weekNumberTemplate,
        weekNumberType,
        quickSelector,
        quickSelectorItems,
        positionType: 'start',
        showTime,
        seconds,
        format,
        timeValue: timeValueStr,
      })}
    </div>
  `;
  }

  protected renderEndCalendar(): TemplateResult {
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
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
      _selectedEndDate,
      _selectedStartDate,
      rangeDays = !_selectedEndDate ? maxMonthDays : 0,
      showTime,
      seconds,
      format,
      timeValue,
    } = this;
    const timeValueStr = _selectedEndDate
      ? (timeValue?.end || this.defaultTimeValue)
      : '';
    return html`
    <div
      class="sc-date-range-picker-end"
    >
      ${slotDatePicker({
        chooseMonthLabel,
        chooseYearLabel,
        disabledDates,
        disabledDays,
        firstDayOfWeek,
        locale,
        max,
        min: _selectedStartDate || min,
        minYear,
        maxYear,
        nextMonthLabel,
        onDatePickerDateUpdated: (e: CustomEvent) => this.onDatePickerValueUpdated(e, 'end'),
        onDatePickerFirstUpdated: () => {},
        previousMonthLabel,
        selectedDateLabel,
        selectedYearLabel,
        shortWeekLabel,
        showWeekNumber,
        startView,
        picker,
        todayLabel,
        toyearLabel,
        value: _selectedEndDate,
        weekLabel,
        weekNumberTemplate,
        weekNumberType,
        rangeDays,
        positionType: 'end',
        showTime,
        seconds,
        format,
        timeValue: timeValueStr,
      })}
    </div>
  `;
  }

  render() {
    return html`
      <div class="container ${this.isMobile ? 'without-border' : ''}">
        ${this.renderStartCalendar()}
        ${this.renderEndCalendar()}
      </div>
    `;
  }
  
}
