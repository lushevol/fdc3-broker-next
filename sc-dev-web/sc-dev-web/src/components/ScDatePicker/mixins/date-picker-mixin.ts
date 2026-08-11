import { property, state } from 'lit/decorators.js';

import { 
  DateTimeFormat, 
  labelChooseMonth, 
  labelChooseYear, 
  labelNextMonth, 
  labelPreviousMonth, 
  labelSelectedDate, 
  labelSelectedYear, 
  labelSelectedMonth, 
  labelShortWeek, 
  labelToday, 
  labelTomonth, 
  labelToyear, 
  labelWeek, 
  weekNumberTemplate, 
} from '../constants.js';
import type { LitConstructor, WeekNumberType } from '../typings.js';
import type { DatePickerMixinProperties, MixinReturnType } from './typings.js';
import dayjs from 'dayjs/esm/index.js';
import { toDateString } from '../helpers/to-date-string.js';
import { getDate } from '../helpers/get-date.js';
import { PropertyValues } from 'lit';

export const DatePickerMixin = <BaseConstructor extends LitConstructor>(
  SuperClass: BaseConstructor
): MixinReturnType<BaseConstructor, DatePickerMixinProperties> => {
  class DatePickerMixinClass extends SuperClass implements DatePickerMixinProperties {
    @property({ attribute: 'choose-month-label', type: String }) chooseMonthLabel = labelChooseMonth;
    @property({ attribute: 'choose-year-label', type: String }) chooseYearLabel = labelChooseYear;
    @property({ attribute: 'disabled-dates', type: Array }) disabledDates = [];
    @property({ attribute: 'disabled-days', type: Array }) disabledDays = [];
    @property({ attribute: 'first-day-of-week', type: Number, reflect: true }) firstDayOfWeek = 0;
    @property({ type: String }) locale = DateTimeFormat().resolvedOptions().locale;
    @property({ type: String }) format = 'DD MMM YYYY';
    @property({ attribute: 'next-month-label', type: String }) nextMonthLabel = labelNextMonth;
    @property({ attribute: 'previous-month-label', type: String }) previousMonthLabel = labelPreviousMonth;
    @property({ attribute: 'selected-date-label', type: String }) selectedDateLabel = labelSelectedDate;
    @property({ attribute: 'selected-month-label', type: String }) selectedMonthLabel = labelSelectedMonth;
    @property({ attribute: 'selected-year-label', type: String }) selectedYearLabel = labelSelectedYear;
    @property({ attribute: 'short-week-label', type: String }) shortWeekLabel = labelShortWeek;
    @property({ attribute: 'show-week-number', type: Boolean, reflect: true }) showWeekNumber = false;
    @property({ attribute: 'today-label', type: String }) todayLabel = labelToday;
    @property({ attribute: 'tomonth-label', type: String }) tomonthLabel = labelTomonth;
    @property({ attribute: 'toyear-label', type: String }) toyearLabel = labelToyear;
    @property({ type: String, attribute: 'start-view' }) startView: 'monthGrid' | 'yearGrid' | 'calendar' = 'calendar';
    @property({ type: String }) picker: 'month' | 'year' | 'calendar' = 'calendar';
    @property({ attribute: 'week-label', type: String }) weekLabel = labelWeek;
    @property({ attribute: 'week-number-template', type: String }) weekNumberTemplate = weekNumberTemplate;
    @property({ attribute: 'week-number-type', type: String }) weekNumberType: WeekNumberType = 'first-4-day-week';
    
    @property({ type: Boolean }) public range = false;
    @property({ type: Boolean, attribute: 'show-action-bar' }) showActionBar = false;
    @property({ type: Boolean, attribute: 'quick-selector' }) quickSelector = false;
    @property({ type: Array, attribute: 'quick-selector-items' }) quickSelectorItems = [
      { amount: -1, unit: 'year' },
      { amount: -1, unit: 'month' },
      { amount: -1, unit: 'week' },
      { amount: -1, unit: 'day' },
      { amount: 1, unit: 'day' },
      { amount: 1, unit: 'week' },
      { amount: 1, unit: 'month' },
      { amount: 1, unit: 'year' },
    ];
    @property({ type: Boolean }) hoist = false;
    @property({ type: Boolean, attribute: 'show-time' }) showTime = false;
    @property({ type: Boolean }) seconds = false;
    /**
     * NOTE: `null` or `''` will always reset to the old valid date. In order to reset to
     * today's date, set `value` undefined.
     */
    @property() public value: any = '';
    @property() public timeValue: any = '';

    @state() public defaultTimeValue = '';
    @state() timeFormatRegex = new RegExp('H|h|k|m|s');

    get _timeFormat() {
      let timeFormat = 'HH:mm';
      const timeRegExp = new RegExp(/HH?.MM?(.S{1,2})?(\sA)?$/, 'i');
      if (timeRegExp.test(this.format as string)) {
        const [timeFirstFormatStr] = (this.format as string).match(timeRegExp) ?? [];
        timeFormat = timeFirstFormatStr ?? timeFormat;
      }
      return timeFormat;
    }

    updateTimeValue() {
      const getFormattedTimeValue = (rawValue: any): string => {
        if (!rawValue) return this.defaultTimeValue;
        const parsed = getDate(rawValue);
        return dayjs(parsed).isValid() ? dayjs(parsed).format(this._timeFormat) : this.defaultTimeValue;
      };

      if (this.showTime) {
        if (this.range) {
          this.timeValue = {
            start: getFormattedTimeValue(this.value.start),
            end: getFormattedTimeValue(this.value.end),
          };
        }
        else {
          this.timeValue = getFormattedTimeValue(this.value);
        }
      }

    }

    getDateString(date: Date) {
      if (this.format !== 'DD MMM YYYY' && !this.timeFormatRegex?.test(this.format as string)) {
        this.showTime = false;
      }
      return toDateString(date, this.picker, this.showTime, { format: this.format });
    }
    protected firstUpdated(_changedProperties: PropertyValues): void {
        super.firstUpdated(_changedProperties);
        if (this.format !== 'DD MMM YYYY' && !this.timeFormatRegex?.test(this.format as string)) {
          this.showTime = false;
        }
        this.defaultTimeValue = dayjs(dayjs().format('YYYY-MM-DD')).format(this._timeFormat);
    }
  }

  return DatePickerMixinClass as unknown as MixinReturnType<
    BaseConstructor,
    DatePickerMixinProperties
  >;
};
